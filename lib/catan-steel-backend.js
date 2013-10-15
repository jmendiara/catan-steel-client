'use strict';

var socketIO = require('socket.io-client');



var defaultConfig = {
      houses: {
        baseURL: 'http://localhost:3005',
        paths: {
          abuela: '/abuela',
          donpepito: '/casa'
        }
      },
      conversation: {
        baseURL: 'http://localhost:3004'
      }
    };
/*jshint -W098*/
var SteelBackend = function SteelBackendServerImpl(config) {

  config = config || defaultConfig;

  var socket = socketIO.connect(config.conversation.baseURL);


  function ear(str) {

  }


  function say(str) {

  }

  function go(str) {

  }

  function chop(cb) {
    cb(null, 'steel');
  }

  return {
    ear: ear,
    say: say,
    go: go,
    chop: chop,
    config: config
  };

};

function createConnection(config) {
  var backend = new SteelBackend(config);
  return backend;
}
/**
 *
 *
 */
module.exports = {
  createConnection: createConnection,
  CatanBackend: SteelBackend,
  _defaultConfig: defaultConfig
};
