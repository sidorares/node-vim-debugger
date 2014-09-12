#!/usr/bin/env node
var conf = require('rc')("vimdebug", {
  vim: {
    keys: {
      break    : "C-p",
      continue : "C-c",
      down     : "C-d",
      in       : "C-i",
      next     : "C-n",
      out      : "C-o",
      up       : "C-u"
    },
  },
  agent: {
    port: 3219
  },
  debugger: {
    port: 5858
  },
  windowmanager: ''
});

var portfinder = require('portfinder')
var spawn = require('child_process').spawn;
var argv  = require('optimist').argv;

var NBAgent    = require('../lib/agent.js');
// I have some tweaks in v8-debugger, most important, 'requireSource' flag in lookup requests
// otherwise "v8-debugger" can be replaced with built-in "_debugger"
//var Debugger  = require('_debugger');
var Debugger   = require('v8-debugger');
var Repl       = require('../lib/repl.js');

var dc = new Debugger.Client();
// TODO: handle multiple ports, assign first available starting from 3219
var agent  = new NBAgent(conf);

if (argv._.length != 0) {
  // we need to spawn process
  // TODO: use port from portfinder instead 5858 to allow
  // multiple debuggers on the same machine
  var child = spawn(process.execPath, ['--debug-brk=' + conf.debugger.port].concat(argv._));
  var banner = '';
  var waitBanner = true;
  child.stderr.on('data', function(data) {
    if (!waitBanner) {
      console.log('err > ' + data);
      return;
    }
    banner += data.toString();
    // TODO: this assumes no more stderr messages after banner
    // more correct way: if more text after banner in one single chunk, treat it as script stderr
    var m = banner.match(/debugger listening on port ([0-9]*)/i);
    if (m) {
      waitBanner = false;
      // TODO: figure out a cleaner way, without setTimeout, which may fail on slower environments
      setTimeout(function() {
        console.log('Debugger listening on port ' + conf.debugger.port);
        dc.connect(conf.debugger.port);
        dc.on('ready', afterConnect);
      }, 300);
    }
    // TODO: check if there is more data after banner; if so treat it as script stderr data
    // TODO: decorate stdout here as well
  });
  child.stdout.on('data', function(data) {
    console.log('');
    data.toString().split('\n').forEach(function (line) {
      if (line) {
        console.log('out > %s', line);
      }
    });
  });
} else {
  // TODO: read port from command line (we are connecting to already
  // running process, no portfinder here)
  dc.connect(5858);
  dc.on('ready', afterConnect);
}

function afterConnect() {

  agent.addDebuggerClient(dc);

  // ===================================================================================
  // eventually will be moved to user script with on start / break / line / repl actions
  // ===================================================================================
  switch (conf.windowmanager) {
    case 'tmux':
      if (process.env.TMUX) {
        spawn('tmux', ['split-window', '-p', '25', 'vim -nb']);
        spawn('tmux', ['swap-pane', '-D']);
      }
      break;
    case 'i3':
      var i3 = require('i3').createClient();
      i3.command('split v');
      i3.command('resize grow height 10 ppt')
      i3.command('exec "konsole -e \'vim -nb\'"')
      break;
    default:
      // TODO: when netbeans port comes from portfinder, display it in the message
      // so it's easier to connect vim manually
      // don't display if its default 3219
      console.log('start vim with "vim -nb" command or type :nbs within vim');
      break;
  }

  // TODO: handle vim disconnects
  Repl(dc, agent);
  dc.repl.on('exit', function () {
    process.exit();
  });
}
