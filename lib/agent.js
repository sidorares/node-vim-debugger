var VimServer     = require("vim-netbeans").VimServer;
var VimConnection = require('./vim-connection.js');
var util          = require('util');
var EventEmitter  = require('events').EventEmitter;

function Agent(conf) {
  EventEmitter.call(this);
  this.conf = conf;
  this.netbeansPort = conf.agent.port;
  this.nbServer = new VimServer({port: this.netbeansPort});
  this.nbServer.listen();
  this.debuggers = [];
  this.pendingBreakpoints = {};
  this.vims = [];
  this.nbServer.on("clientAuthed", this.addVimClient.bind(this));
}
util.inherits(Agent, EventEmitter);

Agent.prototype.addVimClient = function(vim) {
  this.vims.push(new VimConnection(vim, this));
};

Agent.prototype.addPendingBreakpoint = function(bp) {
  if (this.pendingBreakpoints[bp[0]]) {
    // TODO: toggle if same location?
    this.pendingBreakpoints[bp[0]].push([bp[1], bp[2]]);
  } else {
    this.pendingBreakpoints[bp[0]] = [ [bp[1], bp[2]] ];
  }
}

Agent.prototype.addDebuggerClient = function(dc) {
  this.debuggers.push(dc);
  this.vims.forEach(function(vim) {
    vim.setupDebuggerClient(dc);
  });
};

module.exports = Agent;
