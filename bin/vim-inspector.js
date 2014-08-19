var portfinder = require('portfinder')
var spawn = require('child_process').spawn;
var argv  = require('optimist').argv;

var NBAgent    = require('../lib/agent.js');
var Debugger   = require('_debugger');
var Repl  = require('../lib/repl.js');

var dc = new Debugger.Client();
// TODO: handle multiple ports, assign first available starting from 3219
var agent  = new NBAgent(3219);

if (argv._.length != 0) {
  // we need to spawn process
  // TODO: use port from portfinder instead 5858 to allow
  // multiple debuggers on the same machine
  var child = spawn(process.execPath, ['--debug-brk=5858'].concat(argv._));
  var banner = '';
  var waitBanner = true;
  child.stderr.on('data', function(data) {
    if (!waitBanner) {
      console.log('err > ' + data);
      return;
    }
    banner += data.toString();
    var m = banner.match(/debugger listening on port ([0-9]*)/i);
    if (m) {
      waitBanner = false;
      setTimeout(function() {
        dc.connect(5858);
        dc.on('ready', afterConnect);
      }, 100);
    }
    // TODO: check if there is more data after banner; if so treat it as script stderr data
    // TODO: decorate stdout here as well
  });
  child.stdout.on('data', function(data) {
    console.log('out > ' + data);
  });
} else {
  // TODO: read port from command line (we are connecting to already
  // running process, no portfinder here)
  dc.connect(5858);
  dc.on('ready', afterConnect);
}

function afterConnect() {

  agent.addDebuggerClient(dc);

  // TODO: spawn vim automatically as well?
  //spawn('tmux', ['split-window', 'vim -nb']);
  //var c = spawn('sh', ["i3 exec \"konsole -e 'vim -nb'\""]);
  //var i3 = require('i3').createClient();
  //i3.command('exec "konsole -e \'vim -nb\'"')

  // TODO: when netbeans port comes from portfinder, display it in the message
  // so it's easier to connect vim manually
  // don't display if its default 3219
  console.log('start vim with "vim -nb" command or type :nbs within vim');

  Repl(dc, agent);
}
