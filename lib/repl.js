var repl = require('repl');
var util = require('util');

module.exports = function(dc, agent) {
  var r = repl.start({
    prompt: '> ',
    eval: function eval(cmd, context, filename, callback) {
      if (cmd == '(\n)') {
        // TODO: call previous command?
        return callback('');
      }
      dc.reqEval(cmd, function(err, res) {
        if (res.type == 'function') {
          //var cardinal = require('cardinal');
          //console.log(cardinal.highlight(res.source));

          // TODO: broadcast to all? only vim client associated with dc?
          agent.vims[0].showScript(dc, res.script.ref, res.line+1, res.column);
          return callback('[Function]');
        }
        lookupHandle(dc, res.handle, function(err, res) {
          formatLookup(dc, res, 0, function(r) {
            callback(util.inspect(r, {colors:true}));
          });
        });
      });
    }
  });
  dc.repl = r;
}

function lookupHandle(dc, handle, cb) {
  var req = {
    command: 'lookup',
    'arguments': {
      handles: [handle],
      includeSource: true
    }
  };
  dc.req(req, function(err, res) {
    //console.log(res);
    cb(err, res[handle]);
  });
}


// TODO: convert to switch/case
function formatLookup(dc, lookup, level, callback) {
  if (level > 10)
    return callback('[...]');

  if (!lookup)
    return callback();

  if (lookup.type == 'undefined')
    return callback(void(0));

  if (lookup.type == 'null')
    return callback(null);

  if (lookup.type == 'function')
    return callback('[Function ' + lookup.name + ']');

  // allow value = undefined and value = false
  // TODO: better way to check?
  if (Object.keys(lookup).indexOf('value') !== -1) {
    return callback(lookup.value);
  }

  if (lookup.type == 'object') {
    var obj = lookup.className == 'Array' ? [] : {};
    var reqLeft = lookup.properties.length;
    if (reqLeft == 0)
      return callback(obj);
    lookup.properties.forEach(function(prop, index) {
      lookupHandle(dc, lookup.properties[index].ref, function(err, resp) {
        formatLookup(dc, resp, level+1, function(value) {
          obj[lookup.properties[index].name] = value;
          reqLeft--;
          if (reqLeft === 0)
            callback(obj);
        });
      })
    })
  } else
    return callback('[' + lookup.text + ']')
}
