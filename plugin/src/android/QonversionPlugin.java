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

import io.qonversion.sandwich.PurchaseResultListener;
import io.qonversion.sandwich.QonversionEventsListener;
import io.qonversion.sandwich.QonversionSandwich;
import io.qonversion.sandwich.ResultListener;
import io.qonversion.sandwich.SandwichError;

public class QonversionPlugin extends AnnotatedCordovaPlugin implements QonversionEventsListener {

    private QonversionSandwich qonversionSandwich;

    private static final String ERROR_CODE_PURCHASE_CANCELLED_BY_USER = "PURCHASE_CANCELLED_BY_USER";

    private @Nullable CallbackContext entitlementsUpdateDelegate = null;

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

    @PluginAction(thread = ExecutionThread.UI, actionName = "purchaseProduct", isAutofinish = false)
    public void purchaseProduct(String productId, String offeringId, CallbackContext callbackContext) {
        qonversionSandwich.purchaseProduct(productId, offeringId, getPurchaseResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "purchase", isAutofinish = false)
    public void purchase(String productId, CallbackContext callbackContext) {
        qonversionSandwich.purchase(productId, getPurchaseResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "updateProductWithId", isAutofinish = false)
    public void updateProductWithId(
            final String productId,
            @Nullable final String offeringId,
            final String oldProductId,
            CallbackContext callbackContext
    ) {
        updateProductWithIdAndProrationMode(productId, offeringId, oldProductId, null, callbackContext);
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "updateProductWithIdAndProrationMode", isAutofinish = false)
    public void updateProductWithIdAndProrationMode(
            final String productId,
            @Nullable final String offeringId,
            final String oldProductId,
            @Nullable final Integer prorationMode,
            CallbackContext callbackContext
    ) {
        qonversionSandwich.updatePurchaseWithProduct(
                productId,
                offeringId,
                oldProductId,
                prorationMode,
                getPurchaseResultListener(callbackContext)
        );
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "updatePurchase", isAutofinish = false)
    public void updatePurchase(String productId, String oldProductId, CallbackContext callbackContext) {
        updatePurchaseWithProrationMode(productId, oldProductId, null, callbackContext);
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "updatePurchaseWithProrationMode", isAutofinish = false)
    public void updatePurchaseWithProrationMode(String productId, String oldProductId, Integer prorationMode, CallbackContext callbackContext) {
        qonversionSandwich.updatePurchase(productId, oldProductId, prorationMode, getPurchaseResultListener(callbackContext));
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
        }
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "restore", isAutofinish = false)
    public void restore(CallbackContext callbackContext) {
        qonversionSandwich.restore(Utils.getResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "remoteConfig", isAutofinish = false)
    public void remoteConfig(CallbackContext callbackContext) {
        qonversionSandwich.remoteConfig(Utils.getResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "attachUserToExperiment", isAutofinish = false)
    public void attachUserToExperiment(String experimentId, String groupId, CallbackContext callbackContext) {
        qonversionSandwich.attachUserToExperiment(experimentId, groupId, Utils.getEmptyResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "detachUserFromExperiment", isAutofinish = false)
    public void detachUserFromExperiment(String experimentId, CallbackContext callbackContext) {
        qonversionSandwich.detachUserFromExperiment(experimentId, Utils.getEmptyResultListener(callbackContext));
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "syncPurchases", isAutofinish = false)
    public void syncPurchases(CallbackContext callbackContext) {
        qonversionSandwich.syncPurchases();
        callbackContext.success();
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "identify")
    public void identify(String userID, CallbackContext callbackContext) {
        qonversionSandwich.identify(userID);
        callbackContext.success();
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

    private PurchaseResultListener getPurchaseResultListener(CallbackContext callbackContext) {
        return new PurchaseResultListener() {
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
            public void onError(@NonNull SandwichError error, boolean isCancelled) {
                if (isCancelled) {
                    Utils.rejectWithError(error, callbackContext, ERROR_CODE_PURCHASE_CANCELLED_BY_USER);
                } else {
                    Utils.rejectWithError(error, callbackContext);
                }
            }
        };
    }
}
