#!/usr/bin/env node

var Agent = require('../lib/agent.js');

var DebuggerClient = require('_debugger').Client;
var dc = new DebuggerClient();
dc.connect(5858);
var a = new Agent(3219);
a.addDebuggerClient(dc);

var repl = require('repl');
var r = repl.start({
  prompt: '>',
  eval: function eval(cmd, context, filename, callback) {
    if (cmd == '(\n)') {
      return callback('');
    }
    dc.reqEval('require(\'util\').inspect(' + cmd + ', {colors:true})', function(err, res) {
      var req = {
        command: 'lookup',
        'arguments': {
          handles: [res.handle],
          includeSource: true
        }
      };
      dc.req(req, function(err, lookupRes) {
        callback(res.value);
      });
    });
  }
});
