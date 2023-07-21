package com.qonversion.android.sdk;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.Map;

import io.qonversion.sandwich.ResultListener;
import io.qonversion.sandwich.SandwichError;

import org.apache.cordova.CallbackContext;
import org.json.JSONException;
import org.json.JSONObject;

public class Utils {

    static ResultListener getEmptyResultListener(CallbackContext callbackContext) {
        return new ResultListener() {
            @Override
            public void onSuccess(@NonNull Map<String, ?> map) {
                callbackContext.success(new JSONObject());
            }

            @Override
            public void onError(@NonNull SandwichError sandwichError) {
                Utils.rejectWithError(sandwichError, callbackContext);
            }
        };
    }

    static ResultListener getResultListener(CallbackContext callbackContext) {
        return new ResultListener() {
            @Override
            public void onSuccess(@NonNull Map<String, ?> map) {
                try {
                    final JSONObject payload = EntitiesConverter.convertMapToJson(map);
                    callbackContext.success(payload);
                } catch (JSONException e) {
                    e.printStackTrace();
                    callbackContext.error(e.getMessage());
                }
            }

            @Override
            public void onError(@NonNull SandwichError error) {
                rejectWithError(error, callbackContext);
            }
        };
    }

    static void rejectWithError(@NonNull SandwichError sandwichError, final CallbackContext callbackContext) {
        rejectWithError(sandwichError, callbackContext, null);
    }

    static void rejectWithError(@NonNull SandwichError sandwichError, final CallbackContext callbackContext, @Nullable String customErrorCode) {
        try {
            final JSONObject errorDescription = new JSONObject();
            errorDescription.put("description", sandwichError.getDescription());
            errorDescription.put("additionalMessage", sandwichError.getAdditionalMessage());
            errorDescription.put("code", customErrorCode == null ? sandwichError.getCode() : customErrorCode);
            callbackContext.error(errorDescription);
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }
}
