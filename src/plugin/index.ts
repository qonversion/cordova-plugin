import QonversionInternal from './internal/QonversionInternal';
import QonversionApi from './QonversionApi';
import QonversionConfig from './QonversionConfig';

// Suppress TS warnings about window.cordova
declare let window: any; // turn off type checking
declare let module: any; // turn off type checking

export default class Qonversion {
  private constructor() {}

  private static backingInstance: QonversionApi | undefined;

  /**
   * Use this variable to get a current initialized instance of the Qonversion SDK.
   * Please, use the property only after calling {@link Qonversion.initialize}.
   * Otherwise, trying to access the variable will cause an exception.
   *
   * @return Current initialized instance of the Qonversion SDK.
   * @throws error if the instance has not been initialized
   */
  static getSharedInstance(): QonversionApi {
    if (!this.backingInstance) {
      throw "Qonversion has not been initialized. You should call " +
      "the initialize method before accessing the shared instance of Qonversion."
    }

    return this.backingInstance;
  }

  /**
   * An entry point to use Qonversion SDK. Call to initialize Qonversion SDK with required and extra configs.
   * The function is the best way to set additional configs you need to use Qonversion SDK.
   * You still have an option to set a part of additional configs later via calling separate setters.
   *
   * @param config a config that contains key SDK settings.
   *        Call {@link QonversionConfigBuilder.build} to configure and create a QonversionConfig instance.
   * @return Initialized instance of the Qonversion SDK.
   */
  static initialize(config: QonversionConfig): QonversionApi {
    this.backingInstance = new QonversionInternal(config);
    return this.backingInstance;
  }
}

if (!window.plugins) {
  window.plugins = {};
}
if (!window.plugins.Qonversion) {
  window.plugins.Qonversion = Qonversion;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = Qonversion;
}
