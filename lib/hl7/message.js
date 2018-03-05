var header = require('./header');
var segment = require('./segment');
var p = require('physis-label');  

function message() {
  this.labels = [];
  this.header = new header();
  this.segments = [];
  this.args = [];

  if (arguments.length > 0) {

    for (var i = 0; i < arguments.length; i++) {
      this.header.addField(arguments[i]);
      if (p.label.Labeled.prototype.isPrototypeOf(arguments[i])) {
        this.labels.push(arguments[i].getLabel());
        this.args.push(arguments[i].getValue());
      } else {
        this.args.push(arguments[i]);
      }
    }
  }
}

message.prototype.getSegment = function(name) {
  for (var i = 0; i < this.segments.length; i++) {
    if (this.segments[i].name == name) return this.segments[i]
  }
}

message.prototype.getSegments = function(name) {
  var returnSegments = [];
  for (var i = 0; i < this.segments.length; i++) {
    if (this.segments[i].name == name) returnSegments.push(this.segments[i]);
  }
  return returnSegments;
}

message.prototype.addSegment = function() {

  if (arguments.length == 1) {
    var s = new segment(arguments[0]);
    this.segments.push(s);
    return s;
  }

  if (arguments.length > 1) {
    var s = new segment(arguments[0]);
    for (var i = 1; i < arguments.length; i++) {
      s.addField(arguments[i]);
    }
    this.segments.push(s);
    return s;
  }



}

message.prototype.log = function() {
  var currentSeperator = this.header.delimiters.segmentSeperator
  this.header.delimiters.segmentSeperator = '\n';
  var returnString = this.toString();
  this.header.delimiters.segmentSeperator = currentSeperator;
  return returnString

}


message.prototype.toString = function() {
  var returnString = this.header.toString() + this.header.delimiters.segmentSeperator;

  for (var i = 0; i < this.segments.length; i++) {

    returnString += this.segments[i].toString(this.header.delimiters);
    if (i != this.segments.length - 1) returnString += this.header.delimiters.segmentSeperator;
  }

  return returnString.replace(/^\s+|\s+$/g, '');
}

message.prototype.canFlowTo = function(label, policies) {
  return this.labels.reduce((acc, l) => {
    return l.canFlowTo(label, policies) && acc;
  }, true);
}

module.exports = message;
