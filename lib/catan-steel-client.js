/*
 * Copyright 2013 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of catan-steel-client
 *
 * catan-steel-client is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * catan-steel-client is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with catan-steel-client.
 * If not, seehttp://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License
 * please contact with::[contacto@tid.es]
 */

'use strict';

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
    },
    catanServer = require('./catan-steel-backend'),
    protocol = require('./protocol');

/**
 * The Catan Client Implementation
 * @param {Object} config The configuration.
 * @param {SteelBAckend} backend The backend used by the client.
 * @constructor
 */
var CatanClient = function CatanClientImpl(config, backend) {
  this.config = config || defaultConfig;
  this._backend = backend;
};

/**
 * Setups the protocol
 */
CatanClient.prototype.setup = function setup() {
  this._backend.ear(protocol.TALK.HOLA_DON_PEPITO);
  this._backend.say(protocol.TALK.HOLA_DON_JOSE);
  this._backend.ear(protocol.TALK.PASO_USTED_POR_MI_CASA);
  this._backend.go(protocol.HOMES.DON_JOSE);
  this._backend.say(protocol.TALK.POR_SU_CASA_YO_PASE);
  this._backend.ear(protocol.TALK.VIO_USTED_A_MI_ABUELA);
  this._backend.go(protocol.HOMES.ABUELA);
  this._backend.say(protocol.TALK.A_SU_ABUELA_YO_LA_VI);
  this._backend.ear(protocol.TALK.ADIOS_DON_PEPITO);
  this._backend.say(protocol.TALK.ADIOS_DON_JOSE);

};


function createClient(config) {
  var backend = catanServer.createConnection(config),
      client = new CatanClient(config, backend);

  return client;
}

/**
 * The exported functions and properties for catan-steel-client
 * @return {Object} The module.
 */
module.exports = {
  createClient: createClient,
  _defaultConfig: defaultConfig,
  _protocol: protocol,
  CatanClient: CatanClient
};
