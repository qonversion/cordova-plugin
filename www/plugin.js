const sdkVersion = "1.0.0";
const source = "cordova";

var Qonversion = /** @class */ (function () {
    function Qonversion() {
    }

    Qonversion.launch = function (projectKey, observerMode) {
        window.cordova.exec(null, null, 'QonversionPlugin', 'storeSDKInfo', [source, sdkVersion]);
    };

    Qonversion.setAdvertisingID = function () {
        window.cordova.exec(null, null, 'QonversionPlugin', 'setAdvertisingID');
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
