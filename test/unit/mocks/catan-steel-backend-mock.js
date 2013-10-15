'use strict';


/*jshint -W098*/
var SteelBackend = function SteelBackendServerMock(config) {

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
    chop: chop
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
  CatanBackend: SteelBackend
};
