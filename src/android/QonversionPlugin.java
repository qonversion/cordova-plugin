package com.qonversion.android.sdk;

import com.appfeel.cordova.annotated.android.plugin.AnnotatedCordovaPlugin;
import com.appfeel.cordova.annotated.android.plugin.ExecutionThread;
import com.appfeel.cordova.annotated.android.plugin.PluginAction;

import org.apache.cordova.CallbackContext;

public class QonversionPlugin extends AnnotatedCordovaPlugin {
    @PluginAction(thread = ExecutionThread.UI, actionName = "storeSDKInfo")
    private void storeSDKInfo(String source, String sdkVersion, CallbackContext callbackContext) {
        qonversionSandwich.storeSdkInfo(source, sdkVersion);
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "checkEntitlements")
    private void checkEntitlements(CallbackContext callbackContext) {
        qonversionSandwich.checkEntitlements(Utils.getResultListener(promise));
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setAdvertisingID")
    private void setAdvertisingID(CallbackContext callbackContext) {
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "syncPurchases")
    private void syncPurchases(CallbackContext callbackContext) {
        Qonversion.syncPurchases();
    }
}
