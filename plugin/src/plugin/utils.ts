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
const AUTOMATIONS_NATIVE_MODULE_NAME = 'AutomationsPlugin';

export const callQonversionNative = <T>(methodName: string, args?: any[]): Promise<T> => {
    return callNative(QONVERSION_NATIVE_MODULE_NAME, methodName, args);
}

export const callAutomationsNative = <T>(methodName: string, args?: any[]): Promise<T> => {
    return callNative(AUTOMATIONS_NATIVE_MODULE_NAME, methodName, args);
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

export const noop = () => {};
