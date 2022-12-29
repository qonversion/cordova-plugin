cordova.define("cordova-plugin-qonversion.plugin", function(require, exports, module) {
const sdkVersion = "1.0.0";
const source = "cordova";

var Qonversion = /** @class */ (function () {
    function Qonversion() {
    }

    Qonversion.initialize = function () {
        window.cordova.exec(null, null, 'QonversionPlugin','initializeSdk', ["key", "mode", "env", "lifetime"])
    }

    Qonversion.products = function (callback, errorCallback) {
            window.cordova.exec(callback, errorCallback, 'QonversionPlugin', 'products', [])
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

});
