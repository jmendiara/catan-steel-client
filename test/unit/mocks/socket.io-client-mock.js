'use strict';

var util = require('util'),
    EventEmitter = require('events').EventEmitter;

var SocketIO = function SocketIOMock() {

};

util.inherits(SocketIO, EventEmitter);

/**
 * The Most simple mock of socketio ever
 * @type {SocketIO}
 */
module.exports = new SocketIO();
