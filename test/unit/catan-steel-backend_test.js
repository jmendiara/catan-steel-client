'use strict';

var proxyquire = require('proxyquire'),
    nock = require('nock'),
    socketIOMock = require('./mocks/socket.io-client-mock'),
    catanServer = proxyquire('../../lib/catan-steel-backend', {
      'socket.io-client': socketIOMock
    });

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
      var spy = sinon.spy(socketIOMock, 'connect');

      catanServer.createConnection();

      expect(spy).to.have.been.calledOnce;
    });
  });

  describe('Steps', function() {
    var server;
    beforeEach(function() {
      server = catanServer.createConnection();
    });

    it('should add steps on hear, say and go', function() {
      expect(server._steps).to.be.empty;
      server.say('hola');
      expect(server._steps).to.be.have.length(1);
      server.go('que');
      expect(server._steps).to.be.have.length(2);
      server.hear('hay');
      expect(server._steps).to.be.have.length(3);
    });

    describe('should execute all the steps on chop', function() {
      beforeEach(function() {
        server._socket.socket.connected = true;
      });

      it('should add listen to socket on hear', function() {
        var once = sinon.spy(server._socket, 'once');
        server.hear('hay');
        server.chop();
        expect(once).to.have.been.calledWith('hay');
      });

      it('should execute request on go', function() {
        server.go('que');
        nock(server.config.houses.baseURL)
            .post('/')
            .reply({certificate: 'sd'});

        server.chop();
      });

      it('should emit say', function(done) {
        var emit = sinon.stub(server._socket, 'emit');
        server.say('hola');
        server.chop(function() {
          expect(emit).to.have.been.calledWith('hola');
          done();
        });
      });
    });
  });

});
