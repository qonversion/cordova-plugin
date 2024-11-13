package com.qonversion.android.sdk;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.appfeel.cordova.annotated.android.plugin.AnnotatedCordovaPlugin;
import com.appfeel.cordova.annotated.android.plugin.ExecutionThread;
import com.appfeel.cordova.annotated.android.plugin.PluginAction;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import io.qonversion.sandwich.QonversionEventsListener;
import io.qonversion.sandwich.QonversionSandwich;

public class QonversionPlugin extends AnnotatedCordovaPlugin implements QonversionEventsListener {

    private QonversionSandwich qonversionSandwich;

    private @Nullable CallbackContext entitlementsUpdateDelegate = null;
    private @Nullable CallbackContext automationsEventDelegate = null;

    @Override
    public void pluginInitialize() {
        super.pluginInitialize();
        qonversionSandwich = new QonversionSandwich(
                (Application) cordova.getContext().getApplicationContext(),
                cordova::getActivity,
                this
        );
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "syncHistoricalData", isAutofinish = false)
    public void syncHistoricalData(CallbackContext callbackContext) {
        qonversionSandwich.syncHistoricalData();
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "storeSDKInfo")
    public void storeSDKInfo(String source, String sdkVersion, CallbackContext callbackContext) {
        qonversionSandwich.storeSdkInfo(source, sdkVersion);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.MAIN, actionName = "initializeSdk", isAutofinish = false)
    public void initializeSdk(
            String projectKey,
            String launchModeKey,
            @Nullable String environmentKey,
            @Nullable String entitlementsCacheLifetimeKey,
            @Nullable String proxyUrl,
            boolean kidsMode,
            CallbackContext entitlementsUpdateCallbackContext
    ) {
        qonversionSandwich.initialize(
                cordova.getContext().getApplicationContext(),
                projectKey,
                launchModeKey,
                environmentKey,
                entitlementsCacheLifetimeKey,
                proxyUrl,
                kidsMode
        );

        entitlementsUpdateDelegate = entitlementsUpdateCallbackContext;

        PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
        result.setKeepCallback(true);
        entitlementsUpdateCallbackContext.sendPluginResult(result);
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "purchase", isAutofinish = false)
    public void purchase(
            String productId,
            @Nullable String offerId,
            @Nullable Boolean applyOffer,
            @Nullable String oldProductId,
            @Nullable String updatePolicyKey,
            @Nullable JSONArray contextKeys,
            CallbackContext callbackContext
    ) {
        try {
            List<String> contextKeysList = contextKeys == null
                    ? null
                    : EntitiesConverter.convertArrayToStringList(contextKeys);

            qonversionSandwich.purchase(
                    productId,
                    offerId,
                    applyOffer,
                    oldProductId,
                    updatePolicyKey,
                    contextKeysList,
                    Utils.getResultListener(callbackContext));
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "updatePurchase", isAutofinish = false)
    public void updatePurchase(
            String productId,
            @Nullable String offerId,
            @Nullable Boolean applyOffer,
            String oldProductId,
            @Nullable String updatePolicyKey,
            @Nullable JSONArray contextKeys,
            CallbackContext callbackContext
    ) {
        purchase(productId, offerId, applyOffer, oldProductId, updatePolicyKey, contextKeys, callbackContext);
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setDefinedProperty")
    public void setDefinedProperty(String key, String value, CallbackContext callbackContext) {
        qonversionSandwich.setDefinedProperty(key, value);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setCustomProperty")
    public void setCustomProperty(String key, String value, CallbackContext callbackContext) {
        qonversionSandwich.setCustomProperty(key, value);
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "userProperties", isAutofinish = false)
    public void userProperties(CallbackContext callbackContext) {
        qonversionSandwich.userProperties(Utils.getResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "attribution")
    public void attribution(JSONObject data, String provider, CallbackContext callbackContext) {
        try {
            Map<String, Object> parsedData = EntitiesConverter.toMap(data);
            qonversionSandwich.addAttributionData(provider, parsedData);
            callbackContext.success();
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "checkEntitlements", isAutofinish = false)
    public void checkEntitlements(CallbackContext callbackContext) {
        qonversionSandwich.checkEntitlements(Utils.getResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "products", isAutofinish = false)
    public void products(CallbackContext callbackContext) {
        qonversionSandwich.products(Utils.getResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "offerings", isAutofinish = false)
    public void offerings(CallbackContext callbackContext) {
        qonversionSandwich.offerings(Utils.getResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "checkTrialIntroEligibilityForProductIds", isAutofinish = false)
    public void checkTrialIntroEligibilityForProductIds(JSONArray ids, CallbackContext callbackContext) {
        try {
            List<String> productIds = EntitiesConverter.convertArrayToStringList(ids);
            qonversionSandwich.checkTrialIntroEligibility(productIds, Utils.getResultListener(callbackContext));
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "restore", isAutofinish = false)
    public void restore(CallbackContext callbackContext) {
        qonversionSandwich.restore(Utils.getResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "remoteConfig", isAutofinish = false)
    public void remoteConfig(@Nullable String contextKey, CallbackContext callbackContext) {
        qonversionSandwich.remoteConfig(contextKey, Utils.getResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "remoteConfigList", isAutofinish = false)
    public void remoteConfigList(CallbackContext callbackContext) {
        qonversionSandwich.remoteConfigList(Utils.getResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "remoteConfigListForContextKeys", isAutofinish = false)
    public void remoteConfigListForContextKeys(JSONArray contextKeys, boolean includeEmptyContextKey, CallbackContext callbackContext) {
        try {
            List<String> keysList = EntitiesConverter.convertArrayToStringList(contextKeys);
            qonversionSandwich.remoteConfigList(keysList, includeEmptyContextKey, Utils.getResultListener(callbackContext));
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "attachUserToExperiment", isAutofinish = false)
    public void attachUserToExperiment(String experimentId, String groupId, CallbackContext callbackContext) {
        qonversionSandwich.attachUserToExperiment(experimentId, groupId, Utils.getEmptyResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "detachUserFromExperiment", isAutofinish = false)
    public void detachUserFromExperiment(String experimentId, CallbackContext callbackContext) {
        qonversionSandwich.detachUserFromExperiment(experimentId, Utils.getEmptyResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "attachUserToRemoteConfiguration", isAutofinish = false)
    public void attachUserToRemoteConfiguration(String remoteConfigurationId, CallbackContext callbackContext) {
        qonversionSandwich.attachUserToRemoteConfiguration(remoteConfigurationId, Utils.getEmptyResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "detachUserFromRemoteConfiguration", isAutofinish = false)
    public void detachUserFromRemoteConfiguration(String remoteConfigurationId, CallbackContext callbackContext) {
        qonversionSandwich.detachUserFromRemoteConfiguration(remoteConfigurationId, Utils.getEmptyResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "isFallbackFileAccessible", isAutofinish = false)
    public void isFallbackFileAccessible(CallbackContext callbackContext) {
        qonversionSandwich.isFallbackFileAccessible(Utils.getResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "syncPurchases", isAutofinish = false)
    public void syncPurchases(CallbackContext callbackContext) {
        qonversionSandwich.syncPurchases();
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "identify")
    public void identify(String userID, CallbackContext callbackContext) {
        qonversionSandwich.identify(userID, Utils.getResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "logout")
    public void logout(CallbackContext callbackContext) {
        qonversionSandwich.logout();
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "userInfo", isAutofinish = false)
    public void userInfo(CallbackContext callbackContext) {
        qonversionSandwich.userInfo(Utils.getResultListener(callbackContext));
    }

    @Override
    public void onEntitlementsUpdated(@NonNull Map<String, ?> map) {
        if (entitlementsUpdateDelegate != null) {
            try {
                final JSONObject payload = EntitiesConverter.convertMapToJson(map);
                entitlementsUpdateDelegate.success(payload);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }
}
