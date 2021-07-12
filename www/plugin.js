const sdkVersion = "1.0.0";
const sdkVersionKey = "com.qonversion.keys.sourceVersion";
const source = "cordova";
const sourceKey = "com.qonversion.keys.source";

var Qonversion = /** @class */ (function () {
    function Qonversion() {
    }

    Qonversion.launch = function (projectKey, observerMode) {
        window.cordova.exec(null, null, 'QonversionPlugin', 'storeSDKInfo', [sdkVersion, sdkVersionKey, source, sourceKey]);
        window.cordova.exec(null, null, 'QonversionPlugin', 'launch', [projectKey, observerMode]);
    };

    Qonversion.setUserID = function (userID) {
        window.cordova.exec(null, null, 'QonversionPlugin', 'setUserID', [userID]);
    };

    Qonversion.setDebugMode = function () {
        window.cordova.exec(null, null, 'QonversionPlugin', 'setDebugMode');
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