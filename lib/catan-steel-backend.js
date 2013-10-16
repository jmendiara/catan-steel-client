'use strict';

var socketIO = require('socket.io-client'),
    Q = require('q'),
    request = require('request'),
    protocol = require('./protocol'),
    _ = require('underscore');

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
  var steps = [];

  function hear(str) {
    steps.push(function hearStep(socket, trx) {
      var defer = Q.defer();

      socket.once(str, defer.resolve);

      trx.fin(function onFin() {
        socket.removeListener('str', defer.resolve);
      });
      return function hearAction() {

        return defer.promise;
      };
    });
  }

  function say(str) {
    steps.push(function sayStep(socket, trx) {
      return function sayAction(data) {
        socket.emit(str, data);
        return data;
      };
    });
  }

  function go(str) {
    steps.push(function goStep(socket, trx) {
      return function goAction(data) {
        var defer = Q.defer();
        var req = request({
          method: 'POST',
          url: getURLFor(str),
          json: data
        }, function onResponse(err, res, body) {
          if (err) {
            return defer.reject(err);
          }
          if (res.statusCode !== 200) {
            return defer.reject(body);
          }
          defer.resolve(_.pick(body, 'certificate'));
        });

        trx.fail(req.abort);

        return defer.promise;
      };
    });

  }

  function getURLFor(where) {
    var url = config.houses.baseURL;

    switch (where) {
      case protocol.HOMES.ABUELA:
        url += config.houses.paths.abuela;
        break;
      case protocol.HOMES.DON_JOSE:
        url += config.houses.paths.donpepito;
        break;
      default:
    }

    return url;
  }

  function chop(cb) {

    if (!socket.socket.connected) {
      return cb('No estoy conectado');
    }
    var trx = Q.defer();

    socket.once('error', trx.reject);
    socket.once('disconnect', trx.reject);

    /*jshint -W064*/

    steps
        .map(function(step) {
          console.log('Chipp');

          return step(socket, trx.promise);
        })
        .reduce(Q.when, Q())
        .then(trx.resolve)
        .fail(trx.reject)
        .fin(function() {
          socket.removeListener('error', trx.reject);
          socket.removeListener('disconnect', trx.reject);
        });

    return trx.promise.nodeify(cb);

  }

  return {
    hear: hear,
    say: say,
    go: go,
    chop: chop,
    config: config,
    _steps: steps,
    _socket: socket
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
