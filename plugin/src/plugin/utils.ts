// Suppress TS warnings about window.cordova
declare let device: any; // turn off type checking
declare let window: any; // turn off type checking

export const isIos = (): boolean => {
    return device.platform === "iOS"
}

export const isAndroid = (): boolean => {
    return device.platform === "Android"
}

const QONVERSION_NATIVE_MODULE_NAME = 'QonversionPlugin';
const NOCODES_NATIVE_MODULE_NAME = 'NoCodesPlugin';

export const callQonversionNative = <T>(methodName: string, args?: any[]): Promise<T> => {
    return callNative(QONVERSION_NATIVE_MODULE_NAME, methodName, args);
}

export const subscribeOnQonversionNativeEvents = <T>(methodName: string, callback: (event: T) => void, args?: any[]) => {
    return subscribeOnNativeEvents(QONVERSION_NATIVE_MODULE_NAME, methodName, callback, args);
}

export const callNoCodesNative = <T>(methodName: string, args?: any[]): Promise<T> => {
    return callNative(NOCODES_NATIVE_MODULE_NAME, methodName, args);
}

export const subscribeOnNoCodesNativeEvents = <T>(methodName: string, callback: (event: T) => void, args?: any[]) => {
    return subscribeOnNativeEvents(NOCODES_NATIVE_MODULE_NAME, methodName, callback, args);
}

const callNative = <T>(moduleName: string, methodName: string, args?: any[]): Promise<T> => {
    return new Promise((resolve, reject) => {
        window.cordova.exec(
          (result: any) => resolve(result),
          (error: any) => reject(error),
          moduleName,
          methodName,
          args ?? [],
        );
    });
}

const subscribeOnNativeEvents = <T>(moduleName: string, methodName: string, callback: (event: T) => void, args?: any[]) => {
    window.cordova.exec(
      callback,
      () => console.log('Error occurred while receiving native event'),
      moduleName,
      methodName,
      args ?? [],
    );
}

export const noop = () => {};
