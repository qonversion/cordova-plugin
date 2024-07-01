// Suppress TS warnings about window.cordova
declare let device: any; // turn off type checking
declare let window: any; // turn off type checking

export const isIos = (): boolean => {
    return device.platform === "iOS"
}

export const isAndroid = (): boolean => {
    return device.platform === "Android"
}

export const NATIVE_MODULE_NAME = 'QonversionPlugin';

export const callNative = <T>(methodName: string, args?: any[]): Promise<T> => {
    return new Promise((resolve, reject) => {
        window.cordova.exec(
          (result: any) => resolve(result),
          (error: any) => reject(error),
          NATIVE_MODULE_NAME,
          methodName,
          args ?? [],
        );
    });
}

export const noop = () => {};
