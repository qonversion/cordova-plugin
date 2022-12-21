package com.qonversion.android.sdk;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.Map;

import io.qonversion.sandwich.ResultListener;
import io.qonversion.sandwich.SandwichError;

import org.apache.cordova.CallbackContext;

public class Utils {
    static ResultListener getResultListener(CallbackContext callbackContext) {
        return new ResultListener() {
            @Override
            public void onSuccess(@NonNull Map<String, ?> map) {
                final WritableMap payload = EntitiesConverter.convertMapToWritableMap(map);
                promise.resolve(payload);
            }

            @Override
            public void onError(@NonNull SandwichError error) {
                rejectWithError(error, promise);
            }
        };
    }

    static void rejectWithError(@NonNull SandwichError sandwichError, final Promise promise) {
        rejectWithError(sandwichError, promise, null);
    }

    static void rejectWithError(@NonNull SandwichError sandwichError, final Promise promise, @Nullable String customErrorCode) {
        String errorMessage = sandwichError.getDescription() + "\n" + sandwichError.getAdditionalMessage();
        String errorCode = customErrorCode == null ? sandwichError.getCode() : customErrorCode;
        promise.reject(errorCode, errorMessage);
    }
}
