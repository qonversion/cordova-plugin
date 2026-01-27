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

import io.qonversion.sandwich.NoCodesEventListener;
import io.qonversion.sandwich.NoCodesPurchaseDelegateBridge;
import io.qonversion.sandwich.NoCodesSandwich;

public class NoCodesPlugin extends AnnotatedCordovaPlugin implements NoCodesEventListener, NoCodesPurchaseDelegateBridge {

    private NoCodesSandwich noCodesSandwich;
    private @Nullable CallbackContext noCodesEventDelegate = null;
    private @Nullable CallbackContext purchaseEventDelegate = null;
    private @Nullable CallbackContext restoreEventDelegate = null;

    @Override
    public void pluginInitialize() {
        super.pluginInitialize();
        noCodesSandwich = new NoCodesSandwich();
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "initialize", isAutofinish = false)
    public void initialize(
            String projectKey,
            String source,
            String version,
            @Nullable String proxyUrl,
            @Nullable String locale,
            @Nullable String theme,
            CallbackContext callbackContext
    ) {
        noCodesSandwich.storeSdkInfo(cordova.getActivity(), source, version);
        noCodesSandwich.initialize(
                cordova.getActivity(),
                projectKey,
                proxyUrl,
                null, // logLevelKey
                null, // logTag
                locale,
                theme
        );
        noCodesSandwich.setDelegate(this);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "subscribe", isAutofinish = false)
    public void subscribe(CallbackContext callbackContext) {
        noCodesEventDelegate = callbackContext;

        PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "subscribePurchase", isAutofinish = false)
    public void subscribePurchase(CallbackContext callbackContext) {
        purchaseEventDelegate = callbackContext;

        PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "subscribeRestore", isAutofinish = false)
    public void subscribeRestore(CallbackContext callbackContext) {
        restoreEventDelegate = callbackContext;

        PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "showScreen", isAutofinish = false)
    public void showScreen(String contextKey, CallbackContext callbackContext) {
        noCodesSandwich.showScreen(contextKey);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "close")
    public void close(CallbackContext callbackContext) {
        noCodesSandwich.close();
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setScreenPresentationConfig")
    public void setScreenPresentationConfig(JSONObject configData, @Nullable String contextKey, CallbackContext callbackContext) {
        try {
            final Map<String, Object> config = EntitiesConverter.toMap(configData);
            noCodesSandwich.setScreenPresentationConfig(config, contextKey);
            callbackContext.success();
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setLocale")
    public void setLocale(@Nullable String locale, CallbackContext callbackContext) {
        noCodesSandwich.setLocale(locale);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setTheme")
    public void setTheme(@Nullable String theme, CallbackContext callbackContext) {
        noCodesSandwich.setTheme(theme);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "setPurchaseDelegate")
    public void setPurchaseDelegate(CallbackContext callbackContext) {
        noCodesSandwich.setPurchaseDelegate(this);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "delegatedPurchaseCompleted")
    public void delegatedPurchaseCompleted(CallbackContext callbackContext) {
        noCodesSandwich.delegatedPurchaseCompleted();
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "delegatedPurchaseFailed")
    public void delegatedPurchaseFailed(String errorMessage, CallbackContext callbackContext) {
        noCodesSandwich.delegatedPurchaseFailed(errorMessage);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "delegatedRestoreCompleted")
    public void delegatedRestoreCompleted(CallbackContext callbackContext) {
        noCodesSandwich.delegatedRestoreCompleted();
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "delegatedRestoreFailed")
    public void delegatedRestoreFailed(String errorMessage, CallbackContext callbackContext) {
        noCodesSandwich.delegatedRestoreFailed(errorMessage);
        callbackContext.success();
    }

    // NoCodesEventListener implementation

    @Override
    public void onNoCodesEvent(@NonNull NoCodesEventListener.Event event, @Nullable Map<String, ?> payload) {
        if (noCodesEventDelegate != null) {
            try {
                JSONObject payloadJson = null;
                if (payload != null) {
                    payloadJson = EntitiesConverter.convertMapToJson(payload);
                }

                JSONObject data = new JSONObject();
                data.put("event", event.getKey());
                data.put("payload", payloadJson);

                PluginResult result = new PluginResult(PluginResult.Status.OK, data);
                result.setKeepCallback(true);
                noCodesEventDelegate.sendPluginResult(result);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    // NoCodesPurchaseDelegateBridge implementation

    @Override
    public void purchase(@NonNull Map<String, ?> productData) {
        if (purchaseEventDelegate != null) {
            try {
                JSONObject productJson = EntitiesConverter.convertMapToJson(productData);
                PluginResult result = new PluginResult(PluginResult.Status.OK, productJson);
                result.setKeepCallback(true);
                purchaseEventDelegate.sendPluginResult(result);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void restore() {
        if (restoreEventDelegate != null) {
            PluginResult result = new PluginResult(PluginResult.Status.OK);
            result.setKeepCallback(true);
            restoreEventDelegate.sendPluginResult(result);
        }
    }
}
