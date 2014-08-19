//var tmpl = require('./template.jade');
var tmpl = require('./jade-with-inlie-sourcemap.js');
var data = require('./params.json');

tmpl(data);
//console.log(data);
