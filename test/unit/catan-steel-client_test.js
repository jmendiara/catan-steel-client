'use strict';

var proxyquire = require('proxyquire'),
    catanServer = require('./mocks/catan-steel-backend-mock'),
    catanClient = proxyquire('../../lib/catan-steel-client', {
      './catan-steel-backend': catanServer
    });

describe('Catan Steel Client', function() {

  describe('Client creation', function() {
    it('should be able to create a steel client', function() {
      var client = catanClient.createClient();
      expect(client).to.be.an.object;
      expect(client).to.be.instanceOf(catanClient.CatanClient);
    });

    describe('Client configuration', function() {
      it('should be able to configure where the client should connect', function() {
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
            client = catanClient.createClient(config);

        expect(client.config).to.be.deep.equal(config);
      });

      it('should be able to use default configuration', function() {
        var client = catanClient.createClient();
        expect(client.config).to.be.deep.equal(catanClient._defaultConfig);
      });
    });

    describe('Catan Server Backend', function() {
      it('should be able to create a server backend implementation for a client', function() {
        var client = catanClient.createClient();
        expect(client._backend).to.exist;
        expect(client._backend).to.respondTo('hear');
        expect(client._backend).to.respondTo('say');
        expect(client._backend).to.respondTo('go');
      });

      describe('Protocol configuration', function() {
        var client,
            talk = catanClient._protocol.TALK,
            go = catanClient._protocol.HOMES,
            spyHear,
            spySay,
            spyGo;
        beforeEach(function() {
          var backend = catanServer.createConnection();

          client = new catanClient.CatanClient(null, backend);
          spyHear = sinon.spy(client._backend, 'hear');
          spySay = sinon.spy(client._backend, 'say');
          spyGo = sinon.spy(client._backend, 'go');
          client.setup();
        });

        it.skip('should hear "¡Hola Don Pepito!"', function() {
          expect(spyHear).to.have.been.calledWith(talk.HOLA_DON_PEPITO);
        });

        it('should say "¡Hola Don Jose!"', function() {
          expect(spySay).to.have.been.calledWith(talk.HOLA_DON_JOSE);
        });

        it('should hear "¿Paso usted por mi casa?"', function() {
          expect(spyHear).to.have.been.calledWith(talk.PASO_USTED_POR_MI_CASA);
        });

        it('should go to don Jose House', function() {
          expect(spyGo).to.have.been.calledWith(go.DON_JOSE);
        });

        it('should say "Por su casa yo pase"', function() {
          expect(spySay).to.have.been.calledWith(talk.POR_SU_CASA_YO_PASE);
        });

        it('should hear "¿Vio usted a mi abuela?"', function() {
          expect(spyHear).to.have.been.calledWith(talk.VIO_USTED_A_MI_ABUELA);
        });

        it('should go to Abuela House', function() {
          expect(spyGo).to.have.been.calledWith(go.ABUELA);
        });

        it('should say "A su abuela yo la vi"', function() {
         expect(spySay).to.have.been.calledWith(talk.A_SU_ABUELA_YO_LA_VI);
        });

        it('should hear "¡Adios Don Pepito!"', function() {
         expect(spyHear).to.have.been.calledWith(talk.ADIOS_DON_PEPITO);
        });

        it('should say "¡Adios Don Jose!"', function() {
          expect(spySay).to.have.been.calledWith(talk.ADIOS_DON_JOSE);
        });

        it('should make all the steps in order');

      });
    });
  });

  describe('Chopping', function() {
    var client;
    beforeEach(function() {
      client = catanClient.createClient();
      client.setup();
    });

    it('should be able to chop steel', function() {
      var stub = sinon.stub(client._backend, 'chop').yields(null, 'steel'),
          cb = sinon.spy();
      expect(client).to.respondTo('chop');

      client.chop(cb);
      expect(stub).to.have.been.called;
    });

    it('should inform when a chop has happened', function() {
      var cb = sinon.spy();

      sinon.stub(client._backend, 'chop').yields(null, 'steel');

      client.chop(cb);
      expect(cb).to.have.been.calledWith(null, 'steel');
    });

    it('should inform when a chop has not been successful', function() {
      var cb = sinon.spy(),
          err = new Error();

      sinon.stub(client._backend, 'chop').yields(err);

      client.chop(cb);
      expect(cb).to.have.been.calledWith(err);
    });

  });

});
