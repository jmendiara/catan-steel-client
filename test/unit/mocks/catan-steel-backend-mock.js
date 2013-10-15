'use strict';

/*jshint -W098*/
var SteelBackend = function SteelBackendServerMock(config) {



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
  CatanBackend: SteelBackend
};
