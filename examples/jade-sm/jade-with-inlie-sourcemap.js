var jade = require('jade/lib/runtime.js');
module.exports=function(params) { if (params) {params.require = require;} return (
function template(locals) {
var jade_debug = [{ lineno: 1, filename: "/Users/locomote/tmp/node-vim-debugger/examples/browserify-jade/example/foo.jade" }];
try {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (undefined, id, name, console) {


buf.push("<!-- test test test-->");




debugger;


buf.push("<!-- test test test-->");


buf.push("");


buf.push("<ul>");


// iterate [1, 2, 3, 4, 5]
;(function(){
  var $$obj = [1, 2, 3, 4, 5];
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var val = $$obj[$index];



buf.push("<tr>");




debugger


buf.push("<td>" + (jade.escape(null == (jade_interp = id + val) ? "" : jade_interp)));


buf.push("</td>");


buf.push("<td>" + (jade.escape(null == (jade_interp = name) ? "" : jade_interp)));


buf.push("</td>");


buf.push("</tr>");


    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var val = $$obj[$index];



buf.push("<tr>");




debugger


buf.push("<td>" + (jade.escape(null == (jade_interp = id + val) ? "" : jade_interp)));


buf.push("</td>");


buf.push("<td>" + (jade.escape(null == (jade_interp = name) ? "" : jade_interp)));


buf.push("</td>");


buf.push("</tr>");


    }

  }
}).call(this);



buf.push("</ul>");


console.log(555)


var i = 1




i++


if (i == 2) debugger

}("undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"console" in locals_for_with?locals_for_with.console:typeof console!=="undefined"?console:undefined));;return buf.join("");
} catch (err) {
  jade.rethrow(err, jade_debug[0].filename, jade_debug[0].lineno, "// test test test\n//- console.log('test1')\n- debugger;\n// test test test\n\nul\n  each val in [1, 2, 3, 4, 5]\n    tr\n      //- console.log(val, val*2)\n      - debugger\n      td= id + val\n      td= name\n\n\n\n\n\n- console.log(555)\n- var i = 1\n//- if (i == 1) console.log(\"test\")\n- i++\n- if (i == 2) debugger\n");
}
}
)(params); }
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sb2NvbW90ZS90bXAvbm9kZS12aW0tZGVidWdnZXIvZXhhbXBsZXMvYnJvd3NlcmlmeS1qYWRlL2V4YW1wbGUvZm9vLmphZGUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7OztBQUNBOztBQUNBOzs7QUFDQTs7O0FBQ0E7OztBQUNBOzs7QUFDQTs7Ozs7Ozs7O0FBQUE7QUFDQTs7O0FBRUE7O0FBQUE7OztBQUNBOzs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFMQTtBQUNBOzs7QUFFQTs7QUFBQTs7O0FBQ0E7Ozs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUE7OztBQUNBOzs7QUFDQTs7QUFDQTs7O0FBQ0EiLCJmaWxlIjoiL1VzZXJzL2xvY29tb3RlL3RtcC9ub2RlLXZpbS1kZWJ1Z2dlci9leGFtcGxlcy9icm93c2VyaWZ5LWphZGUvZXhhbXBsZS9mb28uamFkZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRlc3QgdGVzdCB0ZXN0XG4vLy0gY29uc29sZS5sb2coJ3Rlc3QxJylcbi0gZGVidWdnZXI7XG4vLyB0ZXN0IHRlc3QgdGVzdFxuXG51bFxuICBlYWNoIHZhbCBpbiBbMSwgMiwgMywgNCwgNV1cbiAgICB0clxuICAgICAgLy8tIGNvbnNvbGUubG9nKHZhbCwgdmFsKjIpXG4gICAgICAtIGRlYnVnZ2VyXG4gICAgICB0ZD0gaWQgKyB2YWxcbiAgICAgIHRkPSBuYW1lXG5cblxuXG5cblxuLSBjb25zb2xlLmxvZyg1NTUpXG4tIHZhciBpID0gMVxuLy8tIGlmIChpID09IDEpIGNvbnNvbGUubG9nKFwidGVzdFwiKVxuLSBpKytcbi0gaWYgKGkgPT0gMikgZGVidWdnZXJcbiJdfQ==
