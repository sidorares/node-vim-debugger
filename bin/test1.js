var Agent = require('./agent.js');

var spawn = require('child_process').spawn;
var debuggee = spawn('node', ['--debug-brk=3333', './qqq.js']);
debuggee.stdout.pipe(process.stdin);

//var repl = require('repl');
//repl.start({
//  prompt: '===>'/*,
//  eval: function eval(cmd, context, filename, callback) {
//    console.log(cmd);
//    var result = 'poipoipoipoi';
//    callback(null, result);
//  }*/
//}).context.dc = dc;

function waitForDebuggee(proc, cb) {
  var buffer = '';
  var done = false;
  console.log('rrrrrrrrrrrrrrrrr');
  proc.stdout.on('data', function(buff) {
    console.log('aaaaaaaaaaaaaaaaaaa');
    console.log(buff);
    if (!done) {
      buffer += buff.toString();
      console.log(buffer);
      if (buffer.match(/debugger listening on port.*/)) {
        done = true;
        cb();
      }
    }
  });
  proc.stdout.pipe(process.stdin);
  proc.stdout.resume();
  proc.stdin.resume();
}

/*
waitForDebuggee(debuggee, function() {
  var dc = require('v8-debugger').createClient({ port: 3333});
  var a = new Agent(3219);
  a.addDebuggerClient(dc);
  var vim = spawn('vim', ['-nb'], {stdio: 'inherit'});
});
*/
