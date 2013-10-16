'use strict';

var EventEmitter = require('events').EventEmitter,
    util = require('util');


var SocketIOMock = function() {
  this.socket = {
    connected: false
  };
};

util.inherits(SocketIOMock, EventEmitter);

/**
 * @return {SocketIOMock}
 */
exports.connect = function() {
  return new SocketIOMock();
};
