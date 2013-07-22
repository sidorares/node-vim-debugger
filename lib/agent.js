var VimServer     = require("vim-netbeans").VimServer;
var VimConnection = require('./vim-connection.js');
var util          = require('util');
var EventEmitter  = require('events').EventEmitter;

function Agent(port) {
  EventEmitter.call(this);
  this.netbeansPort = port;
  this.nbServer = new VimServer({port: this.netbeansPort});
  this.nbServer.listen();
  this.debuggers = [];
  this.vims = [];
  this.nbServer.on("clientAuthed", this.addVimClient.bind(this));
}
util.inherits(Agent, EventEmitter);

Agent.prototype.addVimClient = function(vim) {
  this.vims.push(new VimConnection(vim, this));
};

Agent.prototype.addDebuggerClient = function(dc) {
  this.debuggers.push(dc);
  this.vims.forEach(function(vim) {
    vim.setupDebuggerClient(dc);
  });
};

module.exports = Agent;
