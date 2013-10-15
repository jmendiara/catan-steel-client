'use strict';

var catanClient = require('../../lib/catan-steel-client');

describe('Catan Steel Client', function() {

  describe('Client creation', function() {
    it('should be able to create a steel client', function() {
      var client = catanClient.createClient();
      expect(client).to.be.an.object;
      expect(client).to.be.instanceOf(catanClient.CatanClient);
    });

    it('should be able to configure where the client should connect');
  });

  describe('Chopping', function() {
    it('should be able to chop steel');

    it('should inform when a chop has happened');

    it('should inform when a chop has not been successful');

  });

});
