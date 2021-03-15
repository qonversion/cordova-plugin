package com.qonversion.android.sdk;

import com.appfeel.cordova.annotated.android.plugin.AnnotatedCordovaPlugin;
import com.appfeel.cordova.annotated.android.plugin.ExecutionThread;
import com.appfeel.cordova.annotated.android.plugin.PluginAction;

import org.apache.cordova.CallbackContext;

public class QonversionPlugin extends AnnotatedCordovaPlugin {
	@PluginAction(thread = ExecutionThread.UI, actionName = "launch")
    private void launch(String projectKey, boolean observerMode, CallbackContext callbackContext) {
        Qonversion.launch(this.cordova.getActivity().getApplication(), projectKey, observerMode);
    }

    @PluginAction(thread = ExecutionThread.WORKER, actionName = "setDebugMode")
    private void setDebugMode(CallbackContext callbackContext) {
        Qonversion.setDebugMode();
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "setUserID")
    private void setUserID(String userID, CallbackContext callbackContext) {
        Qonversion.setUserID(userID);
    }

    @PluginAction(thread = ExecutionThread.UI, actionName = "syncPurchases")
    private void syncPurchases(CallbackContext callbackContext) {
        Qonversion.syncPurchases();
    }
}
