package com.qonversion.android.sdk;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.preference.PreferenceManager;

import com.appfeel.cordova.annotated.android.plugin.AnnotatedCordovaPlugin;
import com.appfeel.cordova.annotated.android.plugin.ExecutionThread;
import com.appfeel.cordova.annotated.android.plugin.PluginAction;

import org.apache.cordova.CallbackContext;

public class QonversionPlugin extends AnnotatedCordovaPlugin {
    @PluginAction(thread = ExecutionThread.UI, actionName = "storeSDKInfo")
    private void storeSDKInfo(String sdkVersion, String sdkVersionKey, String source, String sourceKey, CallbackContext callbackContext) {
        Context app = this.cordova.getActivity().getApplicationContext();

        SharedPreferences.Editor editor = PreferenceManager.getDefaultSharedPreferences(app).edit();
        editor.putString(sdkVersionKey, sdkVersion);
        editor.putString(sourceKey, source);
        editor.apply();
    }

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
