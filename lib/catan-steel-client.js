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
    };

/**
 * The Catan Client Implementation
 * @param {Object} config The configuration.
 * @constructor
 */
var CatanClient = function CatanClientImpl(config) {
  this.config = config || defaultConfig;
};


function createClient(config) {
  var client = new CatanClient(config);
  return client;
}

/**
 * The exported functions and properties for catan-steel-client
 * @return {Object} The module.
 */
module.exports = {
  createClient: createClient,
  _defaultConfig: defaultConfig,
  CatanClient: CatanClient
};
