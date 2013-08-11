var path      = require('path');
var fs        = require('fs');
var tmp       = require('tmp');
var wrapper   = require('module').wrapper;

var sourceMap         = require('source-map');
var SourceMapConsumer = sourceMap.SourceMapConsumer;

var util         = require('util');
var EventEmitter = require('events').EventEmitter;
var VimView      = require('./vim-view.js');


tmp.setGracefulCleanup();

function VimConnection(vim, agent) {
  EventEmitter.call(this);
  this.agent = agent;
  this.views = {};                   // key: debuggerId:scriptId
  this.bufferToView = {};
  var currentLineMarker;             // TODO: sould it be debugger propery?
  var self = this;
  this.vim = vim;
  this.agent.debuggers.forEach(this.setupDebuggerClient.bind(this));
  //vim.on("disconnected", this.agent.handleVimDisconnect.bind(this.agent));
  this.addKeyBindings();
}
util.inherits(VimConnection, EventEmitter);

function nop() {}

VimConnection.prototype.addKeyBindings = function() {
  var self = this;

  function stepHandlerFor(type) {
    return function(buffer, offset, lnum, col) {
      var view = self.bufferToView[buffer.id];
      console.log('view.dc.step(type, 1, nop)', type);
      view.dc.step(type, 1, nop);
    };
  }
  this.vim.key("C-n", stepHandlerFor('next'));
  this.vim.key("C-i", stepHandlerFor('in'));
  this.vim.key("C-o", stepHandlerFor('out'));

  this.vim.key("C-c", function (buffer, offset, lnum, col) {
    var view = self.bufferToView[buffer.id];
    view.dc.reqContinue(nop);
  });

  // TODO: refactor
  this.vim.key("C-u", function (buffer, offset, lnum, col) {
    var view = self.bufferToView[buffer.id];
    var dc = view.dc;
    dc.reqBacktrace(function(err, res) {
      if (!res.frames)
        return;
      if (res.frames.length == dc.currentFrame+1)
        return;
      dc.currentFrame++;
      var scriptRef = res.frames[dc.currentFrame].script.ref;
      function safeScriptFromHandle(handle, cb) {
        var script = dc.handles[scriptRef];
        if (script)
          return cb(script);
        dc.reqScripts(function() {
          cb(dc.handles[scriptRef]);
        });
      }
      safeScriptFromHandle(scriptRef, function(script) {
        self.showScript(dc, script, res.frames[dc.currentFrame].line + 1, 0);
      });
    });
  });
  this.vim.key("C-d", function (buffer, offset, lnum, col) {
    var view = self.bufferToView[buffer.id];
    var dc = view.dc;
    dc.reqBacktrace(function(err, res) {
      if (!res.frames || dc.currentFrame <= 0)
        return;
      dc.currentFrame--;
      var scriptRef = res.frames[dc.currentFrame].script.ref;
      var script = dc.handles[scriptRef];
      self.showScript(dc, script, res.frames[dc.currentFrame].line + 1, 0);
    });
  });
  this.vim.key("C-f", function (buffer, offset, lnum, col) {
    var view = self.bufferToView[buffer.id];
    //var script = view.dc.scripts[view.scriptId];
    //self.showScript(dc, script, line, column);
    view.toggleOrigSource();
  });
};

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

    console.log(res);
    dc.currentFrame = 0;
    dc.currentScript = res.body.script;

    var script = dc.scripts[res.body.script.id];

    if (!script.source) {
      dc.reqSource(undefined, undefined, function(err, srcRes) {
        script.source = srcRes.source;
        if (!script.name)
          script.name = '___eval.js';
        self.showScript(dc, script, res.body.sourceLine + 1, res.body.sourceColumn);
      });
    } else {
      console.log(res.body);
      self.showScript(dc, script, res.body.sourceLine + 1, res.body.sourceColumn);
    }
  });
};

VimConnection.prototype.showScript = function(debuggerClient, script, line, column) {
  var viewKey = JSON.stringify(debuggerClient.address()) + ':' + script.id;
  var view = this.views[viewKey];
  var self = this;
  if (view) {
    var origPos = view.originalPosition(line, column);
    view.setCurrentLineMarker(origPos);
    return;
  }

  // return name immediately if exists or copy with content if not
  function getSrcFile(name, value, cb) {
    if (fs.existsSync(name)) {
      return cb(name);
    }
    tmp.tmpName(function(err, tmpPath) {
      var name = tmpPath + path.basename(script.name);
      //var src = script.source.slice(wrapper[0].length, -wrapper[1].length);
      var src = script.source;
      fs.writeFileSync(name, src);
      return cb(name);
    });
  }

  getSrcFile(script.name, script.source, function(name) {
    var map = null;
    if (script.name.match(/\.coffee$/)) {
      var coffee = require('coffee-script');
      var answer = coffee.compile(fs.readFileSync(script.name, 'utf-8'), {sourceMap: true});
      map = new SourceMapConsumer(JSON.parse(answer.v3SourceMap));
    }
    self.vim.editFile(name, function(buff) {
      view = self.views[viewKey] = new VimView(self.vim, buff, script.id, debuggerClient);
      view.sourceMap = map;
      self.bufferToView[buff.id] = view;
      var origPos = view.originalPosition(line, column);
      if (script.name.match(/\.coffee$/)) {
        getSrcFile(script.name + '.js', script.source, function(origName) {
          self.vim.editFile(origName, function(srcBuffer) {
            view.addOrigSource(srcBuffer);
            view.srcLineMarker = [srcBuffer, 0, [line, column]];
            view.setCurrentLineMarker(origPos);
          });
        });
      } else {
        view.setCurrentLineMarker(origPos);
      }
    });
  });
};

module.exports = VimConnection;
