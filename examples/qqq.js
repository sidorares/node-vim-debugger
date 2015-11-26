// comment at first line

var oo = {};
var o1 = { aa: 1, bb: 'test' };

debugger;

var baz = require('./baz.js');

baz();

var util = require('util');

//require('/usr/local/lib/node_modules/coffee-script');
require('coffee-script');

var obj = {};

obj.prop = 123;

// comment in the middle
//var bbb = require('./testc');
var bbb = require('./testc.coffee');
console.log(bbb(123));
console.log('aaa');
var f = new Function("var a = 1;\n\n\n; var b = 2;\n\n\n debugger; return a+b;");
debugger;

var c = f();



//console.log(typeof eee);

setInterval(function() {
console.log('bbb');
debugger;
console.log(process.pid);
}, 1000);


// comment at the end
