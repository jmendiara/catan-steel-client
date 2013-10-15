'use strict';

var proxyquire = require('proxyquire'),
    SocketIOMock = require('./mocks/socket.io-client-mock'),
    catanServer = proxyquire('../../lib/catan-steel-backend', {
        'socket.io-client': SocketIOMock
      }
    );

describe('Catan Steel Backend', function() {

  describe('Backend creation', function() {
    it('should be able to create a steel backend', function() {
      var server = catanServer.createConnection();
      expect(server).to.be.an.object;
    });

    describe('Client configuration', function() {
      it('should be able to configure where the backend should connect', function() {
        var config = {
              houses: {
                baseURL: 'http://foo',
                paths: {
                  abuela: '/bar',
                  donpepito: '/lol'
                }
              },
              conversation: {
                baseURL: 'http://yum'
              }
            },
            server = catanServer.createConnection(config);

        expect(server.config).to.be.deep.equal(config);
      });

      it('should be able to use default configuration', function() {
        var server = catanServer.createConnection();
        expect(server.config).to.be.deep.equal(catanServer._defaultConfig);
      });
    });

    it('should be able to connect using websockets', function() {
      var spy = sinon.spy(SocketIOMock, 'connect');
      catanServer.createConnection();

      expect(spy).to.have.been.calledOnce;
    });
  });

});
