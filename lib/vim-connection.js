var path      = require('path');
var fs        = require('fs');
var tmp       = require('tmp');
var wrapper   = require('module').wrapper;

var sourceMap         = require('source-map');
var SourceMapConsumer = sourceMap.SourceMapConsumer;

var util         = require('util');
var EventEmitter = require('events').EventEmitter;
var VimView      = require('./vim-view.js');
var convertSourceMap = require('convert-source-map');

tmp.setGracefulCleanup();

function VimConnection(vim, agent) {
  EventEmitter.call(this);
  this.agent = agent;
  this.conf = this.agent.conf.vim;
  this.keys = this.conf.keys;
  this.views = {};                   // key: debuggerId:scriptId
  this.bufferToView = {};
  var currentLineMarker;             // TODO: sould it be debugger propery?
  var self = this;
  this.vim = vim;
  this.agent.debuggers.forEach(this.setupDebuggerClient.bind(this));
  vim.on("disconnected", function() {
    //this.agent.handleVimDisconnect.bind(this.agent));
    console.log('this connection needs to be removed!!!!');
    self.disconnected = true;
  });
  this.addKeyBindings();
  this.lastUsedBuffer = null;
}
util.inherits(VimConnection, EventEmitter);

function nop() {}

VimConnection.prototype.getView = function(bufferId) {
  var v = this.bufferToView[bufferId];
  if (v) return v;
  v = this.bufferToView[this.lastUsedBuffer];
  return v;
}

VimConnection.prototype.addKeyBindings = function() {
  var self = this;

  function stepHandlerFor(type) {
    return function(buffer, offset, lnum, col) {
      console.log(buffer.pathname);
      var view = self.getView(buffer.id);
      if (view)
        view.dc.step(type, 1, nop);
    };
  }
  this.vim.key(this.keys.next, stepHandlerFor('next'));
  this.vim.key(this.keys.in, stepHandlerFor('in'));
  this.vim.key(this.keys.out, stepHandlerFor('out'));

  this.vim.key(this.keys.continue, function (buffer, offset, lnum, col) {
    var view = self.getView(buffer.id);
    if (view)
      view.dc.reqContinue(nop);
  });

  // TODO: refactor
  this.vim.key(this.keys.up, function (buffer, offset, lnum, col) {

    var view = self.getView(buffer.id);
    var dc = view.dc;
    if (!dc) {
      console.log('AAAA not owned by debugger yet')
    }

    dc.reqBacktrace(function(err, res) {
      if (!res.frames)
        return;
      if (res.frames.length == dc.currentFrame+1)
        return;
      dc.currentFrame++;
      var scriptRef = res.frames[dc.currentFrame].script.ref;
      frame = res.frames[dc.currentFrame];
      self.showScript(dc, scriptRef, frame.line + 1, frame.column);
    });
  });
  this.vim.key(this.keys.down, function (buffer, offset, lnum, col) {
    var view = self.bufferToView[buffer.id];
    var dc = view.dc;
    dc.reqBacktrace(function(err, res) {
      if (!res.frames || dc.currentFrame <= 0)
        return;
      dc.currentFrame--;
      var scriptRef = res.frames[dc.currentFrame].script.ref;
      frame = res.frames[dc.currentFrame]
      self.showScript(dc, scriptRef, frame.line + 1, frame.column);
    });
  });
  this.vim.key(this.keys.jump, function (buffer, offset, lnum, col) {
    var view = self.bufferToView[buffer.id];
    var dc = view.dc;
    dc.reqBacktrace(function(err, res) {
      if (!res.frames || dc.currentFrame <= 0)
        return;
      var scriptRef = res.frames[dc.currentFrame].script.ref;
      self.showScript(dc, scriptRef, res.frames[dc.currentFrame].line + 1, 0);
    });
  });
  this.vim.key(this.keys.break, function (buffer, offset, lnum, col) {

    var line = parseInt(lnum, 10);
    var column = parseInt(col, 10);
    var view = self.bufferToView[buffer.id];

    if (!view) {
      self.addPendingBreakpoint(buffer, line - 1, column);
      VimView.addBreakpointMarkerToBuffer(buffer, [line, column]);
      return;
    }

    var script = view.dc.scripts[view.scriptId];
    var dc = view.dc;

    // TODO: update breakpoints
    //dc.req({ command: 'listbreakpoints' }, function(err, res) {
    //  console.log(err, res);
    //});

    var pos = view.generatedPosition(line, column);
    dc.setBreakpoint({
      type: 'scriptId',
      target: view.scriptId,
      line: pos[0] - 1,
      column: pos[1]
    }, function(err, res) {
      // TODO: handle err
      // TODO: add to dc.breakpoints
      // TODO: use res.actual_locations ( and after mapping back to generated positions )
      //       if sourcemaps don't tell generated position then use cursor line/column as approximation

      // TODO: probably move cursor to actual_location
      // console.log('Add breakpoint result:', res);
      view.addBreakpointMarker(pos);
    })
  });
  this.vim.key(this.keys.toggle, function (buffer, offset, lnum, col) {
    var view = self.bufferToView[buffer.id];
    //var script = view.dc.scripts[view.scriptId];
    //self.showScript(dc, script, line, column);
    view.toggleOrigSource();
  });
};

VimConnection.prototype.addPendingBreakpoint = function(buffer, line, col) {
  // TODO: check if there is already pending breakpoint here and toggle
  this.agent.addPendingBreakpoint([buffer.pathname, line, col]);
}

VimConnection.prototype.setupDebuggerClient = function(dc) {
  var self = this;
  // TODO: move to showFrame(frame)
  dc.reqBacktrace(function(err, res) {
    if (!res.frames)
      return;
    var scriptRef = res.frames[0].script.ref;
    var script = dc.handles[scriptRef];
    self.showScript(dc, script, res.frames[0].line + 1, 0);
  });

  dc.on('break', function(res) {

    if (self.disconnected )
      return;

    dc.currentFrame = 0;
    dc.currentScript = res.body.script;

    var script = dc.scripts[res.body.script.id];

    if (!script.source) {
      dc.reqSource(undefined, undefined, function(err, srcRes) {
        script.source = srcRes.source;
        self.showScript(dc, script, res.body.sourceLine + 1, res.body.sourceColumn);
      });
    } else {
      self.showScript(dc, script, res.body.sourceLine + 1, res.body.sourceColumn);
    }
  });

  dc.on('afterCompile', function(res) {
    var scriptFileName = res.body.script.name;
    var pb = self.agent.pendingBreakpoints[scriptFileName];
    var scriptId = res.body.script.id;

    if (pb) {
      // TODO: refactor this to use same code as used with breakpoint key handler
      // calculate sourcemaps on load
      pb.forEach(function(pos) {
        dc.setBreakpoint({
          type: 'scriptId',
          target: scriptId,
          line: pos[0],
          column: pos[1]
        }, function(err, res) {
          // TODO: handle err
          // TODO: add to dc.breakpoints
          // TODO: use res.actual_locations ( and after mapping back to generated positions )
          //       if sourcemaps don't tell generated position then use cursor line/column as approximation

          //view.addBreakpointMarker(pos);
          // console.log('Resolved pending breakpoint', scriptFileName, pos, res);
          // TODO: move pending marker to res.actual_locations if it's different from pos ( line only )
          // note that node files are prefixed with wrapper lines
        })
      });
    }
  });
};

VimConnection.prototype.showScript = function(debuggerClient, script, line, column, attempt) {

  if (!attempt)
    attempt = 0;

  var self = this;
  var scriptRef;

  if (typeof script == 'number') {
    scriptRef = script;
    script = debuggerClient.handles[scriptRef];
    if (!script && attempt < 2) {
      return debuggerClient.reqScripts(function() {
        self.showScript(debuggerClient, scriptRef, line, column, 1);
      });
    }
  }

  if (!script) {
    //console.log('no script for ' + scriptRef);
    return;
  }

  if (!script.name)
    script.name = '_' + script.id + '_eval.js';

  if (debuggerClient.repl) {
    var r = debuggerClient.repl;
    //require('readline').clearScreenDown(r.rli.output);
    // TODO: line/col is useless here (visible in vim)
    // better display short stack visualisation as path
    r.setPrompt([script.name, line+1, column].join(':') + '> ');
    r.displayPrompt();
  }


  //console.log('show script:', script.id, script.name, line, column);

  var viewKey = JSON.stringify(debuggerClient.address()) + ':' + script.id;
  var view = this.views[viewKey];
  var self = this;
  if (view) {
    this.lastUsedBuffer = view.buffer;
    var origPos = view.originalPosition(line, column);
    //console.log('Position: ', line, column, '->', origPos);
    view.setCurrentLineMarker(origPos);
    return;
  }

  // return name immediately if exists or copy with content if not
  function getSrcFile(name, value, cb) {
    // TODO async
    if (fs.existsSync(name)) {
      return cb(null, name);
    }
    tmp.tmpName(function(err, tmpPath) {
      if (err)
        return cb(err);

      var name = tmpPath + '-' + path.basename(script.name);
      //var src = script.source.slice(wrapper[0].length, -wrapper[1].length);
      // TODO: async?
      function writeSource() {
        var src = script.source;
        fs.writeFile(name, src, function(err) {
          if (err)
            return cb(err);
          else
            return cb(null, name);
        });
      }

      if (!script.source) // try to request source from debuggee
        debuggerClient.reqSource(undefined, undefined, function(err, srcRes) {
          script.source = srcRes.source;
          writeSource();
        });
      else
        writeSource(cb);
    });
  }

  getSrcFile(script.name, script.source, function(err, name) {

    var map = null;
    var v3map = convertSourceMap.fromSource(script.source);
    if (v3map && v3map.sourcemap) {
      map = new SourceMapConsumer(v3map.sourcemap);
    }

    // TODO: find if there is a way to reuse sm generated by coffe at compile time
    // instead of re-compiling (potentially using different compiler)
    if (!map && script.name && script.name.match(/\.coffee$/)) {
      var coffee;
      try {
        var coffee = require('coffee-script');
        var answer = coffee.compile(fs.readFileSync(script.name, 'utf-8'), {sourceMap: true});
        map = new SourceMapConsumer(JSON.parse(answer.v3SourceMap));
      } catch (e) {
        console.log('install coffee-script to get coffee sourcemap support')
      }
    }

    self.vim.editFile(name, function(buff) {
      view = self.views[viewKey] = new VimView(self.vim, buff, script.id, debuggerClient);
      view.sourceMap = map;
      self.bufferToView[buff.id] = view;
      self.lastUsedBuffer = buff.id;
      var origPos = view.originalPosition(line, column);

      // TODO: finish "toggle original/generate source" functionality
      if (false) { //(script.name && script.name.match(/\.coffee$/)) {
        getSrcFile(script.name + '.js', script.source, function(origName) {
          self.vim.editFile(origName, function(srcBuffer) {
            view.addOrigSource(srcBuffer);
            view.srcLineMarker = [srcBuffer, 0, [line, column]];
            view.setCurrentLineMarker(origPos);
          });
        });
      } else {
        //console.log('Position: ', line, column, '->', origPos);
        view.setCurrentLineMarker(origPos);
      }
    });
  });
};

module.exports = VimConnection;
