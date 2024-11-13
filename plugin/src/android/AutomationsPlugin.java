package com.qonversion.android.sdk;

import com.appfeel.cordova.annotated.android.plugin.AnnotatedCordovaPlugin;
import com.appfeel.cordova.annotated.android.plugin.ExecutionThread;
import com.appfeel.cordova.annotated.android.plugin.PluginAction;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

import io.qonversion.sandwich.AutomationsEventListener;
import io.qonversion.sandwich.AutomationsSandwich;
import io.qonversion.sandwich.ResultListener;
import io.qonversion.sandwich.SandwichError;

public class AutomationsPlugin extends AnnotatedCordovaPlugin implements AutomationsEventListener {

    private AutomationsSandwich automationsSandwich;
    private @Nullable CallbackContext automationsEventDelegate = null;

    @Override
    public void pluginInitialize() {
        super.pluginInitialize();
        automationsSandwich = new AutomationsSandwich();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "subscribe")
    public void subscribe(CallbackContext callbackContext) {
        automationsEventDelegate = callbackContext;
        automationsSandwich.setDelegate(this);

        PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "showScreen", isAutofinish = false)
    public void showScreen(String screenId, CallbackContext callbackContext) {
        automationsSandwich.showScreen(screenId, new ResultListener() {
            @Override
            public void onSuccess(@NonNull Map<String, ?> map) {
                callbackContext.success();
            }

            @Override
            public void onError(@NonNull SandwichError error) {
                Utils.rejectWithError(error, callbackContext);
            }
        });
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setScreenPresentationConfig")
    public void setScreenPresentationConfig(JSONObject configData, @Nullable String screenId) {
        try {
            final Map<String, Object> config = EntitiesConverter.toMap(configData);
            automationsSandwich.setScreenPresentationConfig(config, screenId);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onAutomationEvent(@NonNull AutomationsEventListener.Event event, @Nullable Map<String, ?> payload) {
        if (automationsEventDelegate != null) {
            try {
                JSONObject payloadJson = null;
                if (payload != null) {
                    payloadJson = EntitiesConverter.convertMapToJson(payload);
                }

                JSONObject result = new JSONObject();
                result.put("event", event.getKey());
                result.put("payload", payloadJson);
                automationsEventDelegate.success(result);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }
}
