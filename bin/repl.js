var Agent = require('../lib/agent.js');

  var dc = require('v8-debugger').createClient({ port: 3333});
  var a = new Agent(3219);
  a.addDebuggerClient(dc);

var repl = require('repl');
var r = repl.start({
  prompt: ' >',
  eval: function eval(cmd, context, filename, callback) {
    console.log(cmd);
    if (cmd == '(\n)') {
      //console.log('nop');
      return callback('');
    }
    //var dc = a.lastActiveDebugger();
    //if (!evalDebuggerCommand(cmd, context, filename, callback)) {
    dc.reqEval('require(\'util\').inspect(' + cmd + ', {colors:true})', function(err, res) {
      var req = {
        command: 'lookup',
        'arguments': {
          handles: [res.handle],
          includeSource: true
        }
      };
      dc.req(req, function(err, lookupRes) {
        console.log(lookupRes);
        callback(res.value);
      });
    });
  }
});
//r.context.dc = dc;
//r.context.r = r;
