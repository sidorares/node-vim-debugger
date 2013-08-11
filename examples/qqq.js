//eee = new Function('console.log(1); \n\n\n\n debugger; \n ;\n\n\n\n console.log(2);\n console.log(3)');
//eee();

var util = require('util');

require('/usr/local/lib/node_modules/coffee-script');

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
