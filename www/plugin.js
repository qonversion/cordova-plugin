/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck');
var channel = require('cordova/channel');
var utils = require('cordova/utils');
var exec = require('cordova/exec');
var cordova = require('cordova');
// Tell cordova channel to wait on the CordovaInfoReady event

var Qonversion = /** @class */ (function () {
    function Qonversion() {
    }

    Qonversion.launch = function (projectKey, observerMode) {
        window.cordova.exec(null, null, 'QonversionPlugin', 'launch', [projectKey, observerMode]);
    };

    Qonversion.setUserID = function (userID) {
        window.cordova.exec(null, null, 'QonversionPlugin', 'setUserID', [userID]);
    };

    Qonversion.setDebugMode = function () {
        window.cordova.exec(null, null, 'QonversionPlugin', 'setDebugMode');
    };

    Qonversion.syncPurchases = function () {
        window.cordova.exec(null, null, 'QonversionPlugin', 'syncPurchases');
    };    

    return Qonversion;
}());

if (!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.Qonversion) {
    window.plugins.Qonversion = new Qonversion();
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = Qonversion;
}
exports.default = Qonversion;