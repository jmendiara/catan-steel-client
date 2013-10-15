'use strict';

var catanClient = require('../../lib/catan-steel-client');

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
      it('should be able to create a server backend implementation for a client');

      describe('Protocol configuration', function() {
        it('should ear "¡Hola Don Pepito!"');
        it('should say "¡Hola Don Jose!"');
        it('should ear "¿Paso usted por mi casa?"');
        it('should go to don Jose House');
        it('should say "Por su casa yo pase"');
        it('should ear "¿Vio usted a mi abuela?"');
        it('should go to Abuela House');
        it('should say "A su abuela yo la vi"');
        it('should ear "¡Adios Don Pepito!"');
        it('should say "¡Adios Don Jose!"');

      });
    });
  });

  describe('Chopping', function() {

    it('should be able to chop steel');

    it('should inform when a chop has happened');

    it('should inform when a chop has not been successful');

  });

});
