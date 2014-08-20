var path = require('path');
var fs = require('fs');
var tmp = require('tmp');
tmp.setGracefulCleanup();
var wrapper = require('module').wrapper;
var sourceMap = require('source-map');
var SourceMapConsumer = sourceMap.SourceMapConsumer;

function VimView(conn, buffer, scriptId, debuggerClient) {
  this.vim      = conn;
  this.buffer   = buffer;
  this.dc       = debuggerClient;
  this.scriptId = scriptId;
  this.lineAnnoType = {
    id: 1,
    name: "line",
    tooltip: "",
    glyph: "->",
    fg: 0,
    bg: 15710005
  };
  this.bpAnnoType = {
    id: 2,
    name: "breakpoint",
    tooltip: "",
    glyph: "==",
    fg: 0,
    //bg: '#ff0000'
    bg: 15710005
  };
  /*
  this.bpHitAnnoType = {
    id: 3,
    name: "bphit",
    tooltip: "",
    glyph: "=>",
    fg: 0,
    bg: 15710005
  };
  */
  this.bpMarkers = [];
}

VimView.prototype.originalPosition = function(line, column) {
  if (!this.sourceMap)
    return [line, column];
  var original = this.sourceMap.originalPositionFor({
    source: '',
    line: line,
    column: column
  });
  return [original.line, original.column];
};

VimView.prototype.generatedPosition = function(line, column) {
  if (!this.sourceMap)
    return [line, column];
  var generated = this.sourceMap.generatedPositionFor({
    source: '',
    line: line,
    column: column
  });
  return [generated.line, generated.column];
};

// TODO: this is still very WIP
VimView.prototype.addOrigSource = function(buffer) {
  this.srcBuffer = buffer;
  this.srcLineAnnoType = this.srcBuffer.defineAnnoType({
    name: "2",
    tooltip: "",
    glyph: "->",
    fg: 0,
    bg: 15710005
  });
};

VimView.prototype.toggleOrigSource = function() {
  if (!this.srcBuffer)
    return;

  if (this.buffer == this.srcBuffer) {
    this.sourcemap = this._sourcemap;
    this.buffer = this.compiledBuffer;
    this.srcLineMarker     = this.currentLineMarker;
    this.vim.currentLineMarker = this.vim.compiledLineMarker;
    this.setCurrentLineMarker(this.compiledLineMarker[2]);
  } else {
    this._sourcemap = this.sourcemap;
    this.sourcemap = null;
    this.buffer = this.srcBuffer;
    this.compiledLineMarker = this.currentLineMarker;
    this.vim.currentLineMarker  = this.vim.srcLineMarker;
    this.setCurrentLineMarker(this.srcLineMarker[2]);
  }
};

VimView.prototype.addBreakpointMarker = function(pos) {
  var line = pos[0];
  var col  = pos[1];
  var anno = this.buffer.addAnno(this.bpAnnoType, line, col);
  var marker = [this.buffer, anno, pos];
  this.bpMarkers.push(marker);
  return marker;
}

VimView.prototype.setCurrentLineMarker = function(pos) {
  var line = pos[0];
  var col  = pos[1];
  var anno, buffer;
  if (this.vim.currentLineMarker) {
    buffer = this.vim.currentLineMarker[0];
    anno = this.vim.currentLineMarker[1];
    buffer.removeAnno(anno);
  }
  anno = this.buffer.addAnno(this.lineAnnoType, line, 0);
  this.vim.currentLineMarker = [this.buffer, anno, pos];
  this.buffer.setDot(line, col);
  this.buffer.setVisible(true);
};

module.exports = VimView;
