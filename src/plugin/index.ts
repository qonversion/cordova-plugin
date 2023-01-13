import Qonversion from './Qonversion';

// Suppress TS warnings about window.cordova
declare let window: any; // turn off type checking
declare let module: any; // turn off type checking

if (!window.plugins) {
  window.plugins = {};
}
if (!window.plugins.Qonversion) {
  window.plugins.Qonversion = Qonversion;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = Qonversion;
}
