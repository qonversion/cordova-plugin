/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

import {ScreenPresentationStyle} from "../../../plugin/src/plugin/enums";

const app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        document.getElementById("initialize-sdk").addEventListener("click", this.initializeSdk);
        document.getElementById("purchase").addEventListener("click", this.purchase);
        document.getElementById("update-purchase").addEventListener("click", this.updatePurchase);
        document.getElementById("get-products").addEventListener("click", this.getProducts);
        document.getElementById("get-remote-config").addEventListener("click", this.getRemoteConfig);
        document.getElementById("get-remote-config-list").addEventListener("click", this.getRemoteConfigList);
        document.getElementById("get-offerings").addEventListener("click", this.getOfferings);
        document.getElementById("check-trial-into").addEventListener("click", this.checkTrialIntroEligibility);
        document.getElementById("check-entitlements").addEventListener("click", this.checkEntitlements);
        document.getElementById("restore").addEventListener("click", this.restore);
        document.getElementById("sync-purchases").addEventListener("click", this.syncPurchases);
        document.getElementById("sync-historical-data").addEventListener("click", this.syncHistoricalData);
        document.getElementById("identify").addEventListener("click", this.identify);
        document.getElementById("logout").addEventListener("click", this.logout);
        document.getElementById("user-info").addEventListener("click", this.userInfo);
        document.getElementById("attribution").addEventListener("click", this.attribution);
        document.getElementById("set-user-property").addEventListener("click", this.setUserProperty);
        document.getElementById("set-custom-user-property").addEventListener("click", this.setCustomUserProperty);
        document.getElementById("user-properties").addEventListener("click", this.userProperties);
        document.getElementById("set-entitlements-update-listener").addEventListener("click", this.setEntitlementsUpdateListener);
        document.getElementById("collect-advertising-id").addEventListener("click", this.collectAdvertisingId);
        document.getElementById("collect-apple-search-ads-attribution").addEventListener("click", this.collectAppleSearchAdsAttribution);
        document.getElementById("set-promo-purchases-delegate").addEventListener("click", this.setPromoPurchasesDelegate);
        document.getElementById("present-code-redemption-sheet").addEventListener("click", this.presentCodeRedemptionSheet);
        document.getElementById("set-delegate").addEventListener("click", this.setAutomationsDelegate);
        document.getElementById("show-screen").addEventListener("click", this.showScreen);
        document.getElementById("set-screen-presentation-config").addEventListener("click", this.setScreenPresentationConfig);
    },

    onDeviceReady: function() {
        // Cordova is now initialized. Have fun!
        console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
        document.getElementById('deviceready').classList.add('ready');
    },

    initializeSdk() {
        const config = new Qonversion.ConfigBuilder(
          'PV77YHL7qnGvsdmpTs7gimsxUvY-Znl2',
          Qonversion.LaunchMode.SUBSCRIPTION_MANAGEMENT,
        )
          .setEnvironment(Qonversion.Environment.SANDBOX)
          .setEntitlementsCacheLifetime(Qonversion.EntitlementsCacheLifetime.MONTH)
          .setEntitlementsUpdateListener({
              onEntitlementsUpdated(entitlements) {
                  console.log('Entitlements updated!', entitlements);
              },
          })
          .build();
        Qonversion.initialize(config);
    },

    async purchase() {
        const productId = document.getElementById('product-id').value;
        const offerId = document.getElementById('offer-id').value;
        const products = await Qonversion.getSharedInstance().products();
        const product = products.get(productId);
        try {
            const purchaseOptions = !!offerId ? new Qonversion.PurchaseOptionsBuilder().setOfferId(offerId) : undefined;
            const entitlements = await Qonversion.getSharedInstance().purchaseProduct(product, purchaseOptions);
            console.log('Qonversion purchase:', entitlements, productId);
        } catch (e) {
            console.log('Qonversion purchase failed', e);
        }
    },

    async updatePurchase() {
        const productId = document.getElementById('update-product-id').value;
        const oldProductId = document.getElementById('update-product-old-id').value;
        const products = await Qonversion.getSharedInstance().products();
        const product = products.get(productId);
        try {
            if (product) {
                const purchaseUpdateModel = product.toPurchaseUpdateModel(oldProductId, Qonversion.PurchaseUpdatePolicy.CHARGE_FULL_PRICE);
                const entitlements = await Qonversion.getSharedInstance().updatePurchase(purchaseUpdateModel);
                console.log('Qonversion updatePurchase:', entitlements, product);
            } else {
                console.log('Qonversion updatePurchase:', 'product not found', productId);
            }
        } catch (e) {
            console.log('Qonversion updatePurchase failed', e);
        }
    },

    async getProducts() {
        const products = await Qonversion.getSharedInstance().products();
        console.log('Qonversion products:', products);
    },

    async getRemoteConfig() {
        const remoteConfig = await Qonversion.getSharedInstance().remoteConfig();
        console.log('Qonversion remote config:', remoteConfig);
    },

    async getRemoteConfigList() {
        const remoteConfigList = await Qonversion.getSharedInstance().remoteConfigList();
        console.log('Qonversion remote config list:', remoteConfigList);
    },

    async getOfferings() {
        const offerings = await Qonversion.getSharedInstance().offerings();
        console.log('Qonversion offerings:', offerings);
    },

    async checkTrialIntroEligibility() {
        const productIds = document.getElementById('product-ids').value;
        const ids = productIds.split(', ');
        const eligibilities = await Qonversion.getSharedInstance().checkTrialIntroEligibility(ids);
        console.log('Qonversion checkTrialIntroEligibility:', eligibilities, ids);
    },

    async checkEntitlements() {
        try {
            const entitlements = await Qonversion.getSharedInstance().checkEntitlements();
            console.log('Qonversion checkEntitlements:', entitlements);
        } catch (e) {
            console.log('Qonversion checkEntitlements failed', e);
        }
    },

    async restore() {
        try {
            const entitlements = await Qonversion.getSharedInstance().restore();
            console.log('Qonversion restore:', entitlements);
        } catch (e) {
            console.log('Qonversion restore failed', e);
        }
    },

    async syncPurchases() {
        await Qonversion.getSharedInstance().syncPurchases();
        console.log('Qonversion syncPurchases');
    },

    async syncHistoricalData() {
        await Qonversion.getSharedInstance().syncHistoricalData();
        console.log('Qonversion syncHistoricalData');
    },

    async identify() {
        const userId = document.getElementById('user-id').value;
        const user = await Qonversion.getSharedInstance().identify(userId);
        console.log('Qonversion identify', user);
    },

    logout() {
        Qonversion.getSharedInstance().logout();
        console.log('Qonversion logout');
    },

    async userInfo() {
        const userInfo = await Qonversion.getSharedInstance().userInfo();
        console.log('Qonversion userInfo', userInfo);
    },

    attribution() {
        const data = {
            a: 'aaaa',
            b: {
                c: 25.52,
            }
        };
        const provider = Qonversion.AttributionProvider.APPSFLYER;
        Qonversion.getSharedInstance().attribution(data, provider);
        console.log('Qonversion attribution', data, provider);
    },

    setUserProperty() {
        Qonversion.getSharedInstance().setUserProperty(Qonversion.UserPropertyKey.ADVERTISING_ID, "testAdId");
        console.log('Qonversion setProperty');
    },

    setCustomUserProperty() {
        Qonversion.getSharedInstance().setCustomUserProperty("test_property", "test prop value");
        console.log('Qonversion setUserProperty');
    },

    async userProperties() {
        const properties = await Qonversion.getSharedInstance().userProperties();
        console.log('Qonversion properties', properties);
    },

    setEntitlementsUpdateListener() {
        Qonversion.getSharedInstance().setEntitlementsUpdateListener({
            onEntitlementsUpdated(entitlements) {
                console.log('Entitlements updated!', entitlements);
            },
        });
        console.log('Qonversion setEntitlementsUpdateListener');
    },

    collectAdvertisingId() {
        Qonversion.getSharedInstance().collectAdvertisingId();
        console.log('Qonversion collectAdvertisingId');
    },

    collectAppleSearchAdsAttribution() {
        Qonversion.getSharedInstance().collectAppleSearchAdsAttribution();
        console.log('Qonversion collectAppleSearchAdsAttribution');
    },

    setPromoPurchasesDelegate() {
        Qonversion.getSharedInstance().setPromoPurchasesDelegate({
            onPromoPurchaseReceived(productId, promoPurchaseExecutor) {
                console.log('Promo purchase received!', productId);
                promoPurchaseExecutor();
            },
        });
        console.log('Qonversion setPromoPurchasesDelegate');
    },

    presentCodeRedemptionSheet() {
        Qonversion.getSharedInstance().presentCodeRedemptionSheet();
        console.log('Qonversion presentCodeRedemptionSheet');
    },

    setAutomationsDelegate() {
        Qonversion.Automations.getSharedInstance().setDelegate({
            automationsDidFailExecuting(actionResult) {
                console.log('Qonversion automationsDidFailExecuting', actionResult);
            },

            automationsDidFinishExecuting(actionResult) {
                console.log('Qonversion automationsDidFinishExecuting', actionResult);
            },

            automationsDidShowScreen(screenId) {
                console.log('Qonversion automationsDidShowScreen', screenId);
            },

            automationsDidStartExecuting(actionResult) {
                console.log('Qonversion automationsDidStartExecuting', actionResult);
            },

            automationsFinished() {
                console.log('Qonversion automationsFinished');
            }
        });
    },

    showScreen() {
        const screenId = document.getElementById('screen-id').value;
        Qonversion.Automations.getSharedInstance().showScreen(screenId);
        console.log('Qonversion showScreen', screenId);
    },

    setScreenPresentationConfig() {
        const config = new Qonversion.ScreenPresentationConfig(Qonversion.ScreenPresentationStyle.PUSH);
        Qonversion.Automations.getSharedInstance().setScreenPresentationConfig(config);
        console.log('Qonversion setScreenPresentationConfig', config);
    },
};

app.initialize();
