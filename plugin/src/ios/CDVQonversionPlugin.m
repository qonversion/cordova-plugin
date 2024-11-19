//
//  CDVQonversionPlugin.m
//  Qonversion
//
//  Created by Surik Sarkisyan on 10.03.2021.
//

#import "CDVQonversionPlugin.h"
#import "QCUtils.h"
@import QonversionSandwich;

@interface CDVQonversionPlugin () <QonversionEventListener>

@property (nonatomic, strong) QonversionSandwich *qonversionSandwich;
@property (nonatomic, strong, nullable) NSString *entitlementsUpdateDelegateId;
@property (nonatomic, strong, nullable) NSString *promoPurchaseDelegateId;

@end

@implementation CDVQonversionPlugin

- (void)qonversionDidReceiveUpdatedEntitlements:(NSDictionary<NSString *,id> *)entitlements {
    if (self.entitlementsUpdateDelegateId) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:entitlements];
        [pluginResult setKeepCallbackAsBool:true];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.entitlementsUpdateDelegateId];
    }
}

- (void)shouldPurchasePromoProductWith:(NSString *)productId {
    if (self.promoPurchaseDelegateId) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:productId];
        [pluginResult setKeepCallbackAsBool:true];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.promoPurchaseDelegateId];
    }
}

- (QonversionSandwich *)qonversionSandwich {
    if (!_qonversionSandwich) {
        _qonversionSandwich = [[QonversionSandwich alloc] initWithQonversionEventListener:self];
    }

    return _qonversionSandwich;
}

- (void)storeSDKInfo:(CDVInvokedUrlCommand *)command {
    NSString *source = [command argumentAtIndex:0];
    NSString *version = [command argumentAtIndex:1];

    [self.qonversionSandwich storeSdkInfoWithSource:source version:version];
}

- (void)initializeSdk:(CDVInvokedUrlCommand *)command {
    NSString *key = [command argumentAtIndex:0];
    NSString *launchModeKey = [command argumentAtIndex:1];
    NSString *environmentKey = [command argumentAtIndex:2];
    NSString *cacheLifetimeKey = [command argumentAtIndex:3];
    NSString *proxyUrl = [command argumentAtIndex:4];
    [self.qonversionSandwich initializeWithProjectKey:key
                                        launchModeKey:launchModeKey
                                       environmentKey:environmentKey
                         entitlementsCacheLifetimeKey:cacheLifetimeKey
                                             proxyUrl:proxyUrl];

    self.entitlementsUpdateDelegateId = command.callbackId;

    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT];
    [pluginResult setKeepCallbackAsBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)syncHistoricalData:(CDVInvokedUrlCommand *)command {
    [self.qonversionSandwich syncHistoricalData];
}

- (void)syncStoreKit2Purchases:(CDVInvokedUrlCommand *)command {
    [self.qonversionSandwich syncStoreKit2Purchases];
}

- (void)setDefinedProperty:(CDVInvokedUrlCommand *)command {
    NSString *property = [command argumentAtIndex:0];
    NSString *value = [command argumentAtIndex:1];

    [self.qonversionSandwich setDefinedProperty:property value:value];
}

- (void)setCustomProperty:(CDVInvokedUrlCommand *)command {
    NSString *property = [command argumentAtIndex:0];
    NSString *value = [command argumentAtIndex:1];

    [self.qonversionSandwich setCustomProperty:property value:value];
}

- (void)userProperties:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich userProperties:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [QCUtils returnCordovaResult:result error:error command:command delegate:weakSelf.commandDelegate];
    }];
}

- (void)attribution:(CDVInvokedUrlCommand *)command {
    NSDictionary *data = [command argumentAtIndex:0];
    NSString *provider = [command argumentAtIndex:1];

    [self.qonversionSandwich attributionWithProviderKey:provider value:data];
}

- (void)checkEntitlements:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich checkEntitlements:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [QCUtils returnCordovaResult:result error:error command:command delegate:weakSelf.commandDelegate];
    }];
}

- (void)getPromotionalOffer:(CDVInvokedUrlCommand *)command {
    NSString *productId = [command argumentAtIndex:0];
    NSString *discountId = [command argumentAtIndex:1];
}

- (void)purchase:(CDVInvokedUrlCommand *)command {
    NSString *productId = [command argumentAtIndex:0];
    NSNumber *quantityNumber = [command argumentAtIndex:1];
    NSArray *contextKeys = [command argumentAtIndex:2];
    NSDictionary *promoOffer = [command argumentAtIndex:3];
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich purchase:productId quantity:[quantityNumber integerValue] contextKeys:contextKeys promoOffer:promoOffer completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [QCUtils returnCordovaResult:result error:error command:command delegate:weakSelf.commandDelegate];
    }];
}

- (void)products:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich products:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [QCUtils returnCordovaResult:result error:error command:command delegate:weakSelf.commandDelegate];
    }];
}

- (void)restore:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich restore:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [QCUtils returnCordovaResult:result error:error command:command delegate:weakSelf.commandDelegate];
    }];
}

- (void)offerings:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich offerings:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [QCUtils returnCordovaResult:result error:error command:command delegate:weakSelf.commandDelegate];
    }];
}

- (void)checkTrialIntroEligibilityForProductIds:(CDVInvokedUrlCommand *)command {
    NSArray *data = [command argumentAtIndex:0];
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich checkTrialIntroEligibility:data completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [QCUtils returnCordovaResult:result error:error command:command delegate:weakSelf.commandDelegate];
    }];
}

- (void)remoteConfig:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    NSString *contextKey = [command argumentAtIndex:0];
    [self.qonversionSandwich remoteConfig:contextKey :^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [QCUtils returnCordovaResult:result error:error command:command delegate:weakSelf.commandDelegate];
    }];
}

- (void)remoteConfigList:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [_qonversionSandwich remoteConfigList:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [QCUtils returnCordovaResult:result error:error command:command delegate:weakSelf.commandDelegate];
    }];
}

- (void)remoteConfigListForContextKeys:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    NSArray *contextKeys = [command argumentAtIndex:0];
    BOOL includeEmptyContextKey = [[command argumentAtIndex:1] boolValue];
    [_qonversionSandwich remoteConfigList:contextKeys includeEmptyContextKey:includeEmptyContextKey :^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [QCUtils returnCordovaResult:result error:error command:command delegate:weakSelf.commandDelegate];
    }];
}

- (void)attachUserToExperiment:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    NSString *experimentId = [command argumentAtIndex:0];
    NSString *groupId = [command argumentAtIndex:1];
    [self.qonversionSandwich attachUserToExperimentWith:experimentId groupId:groupId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        if (error) {
            [QCUtils returnCordovaResult:nil error:error command:command delegate:weakSelf.commandDelegate];
        } else {
            [QCUtils returnCordovaResult:@{} error:nil command:command delegate:weakSelf.commandDelegate];
        }
    }];
}

- (void)detachUserFromExperiment:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    NSString *experimentId = [command argumentAtIndex:0];
    [self.qonversionSandwich detachUserFromExperimentWith:experimentId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        if (error) {
            [QCUtils returnCordovaResult:nil error:error command:command delegate:weakSelf.commandDelegate];
        } else {
            [QCUtils returnCordovaResult:@{} error:nil command:command delegate:weakSelf.commandDelegate];
        }
    }];
}

- (void)attachUserToRemoteConfiguration:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    NSString *remoteConfigurationId = [command argumentAtIndex:0];
    [self.qonversionSandwich attachUserToRemoteConfigurationWith:remoteConfigurationId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        if (error) {
            [QCUtils returnCordovaResult:nil error:error command:command delegate:weakSelf.commandDelegate];
        } else {
            [QCUtils returnCordovaResult:@{} error:nil command:command delegate:weakSelf.commandDelegate];
        }
    }];
}

- (void)detachUserFromRemoteConfiguration:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    NSString *remoteConfigurationId = [command argumentAtIndex:0];
    [self.qonversionSandwich detachUserFromRemoteConfigurationWith:remoteConfigurationId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        if (error) {
            [QCUtils returnCordovaResult:nil error:error command:command delegate:weakSelf.commandDelegate];
        } else {
            [QCUtils returnCordovaResult:@{} error:nil command:command delegate:weakSelf.commandDelegate];
        }
    }];
}

- (void)isFallbackFileAccessible:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich isFallbackFileAccessibleWithCompletion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        if (error) {
            [QCUtils returnCordovaResult:nil error:error command:command delegate:weakSelf.commandDelegate];
        } else {
            [QCUtils returnCordovaResult:result error:nil command:command delegate:weakSelf.commandDelegate];
        }
    }];
}

- (void)identify:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    NSString *identityId = [command argumentAtIndex:0];
    [self.qonversionSandwich identify:identityId :^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [QCUtils returnCordovaResult:result error:error command:command delegate:weakSelf.commandDelegate];
    }];
}

- (void)logout:(CDVInvokedUrlCommand *)command {
    [self.qonversionSandwich logout];
}

- (void)userInfo:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich userInfo:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [QCUtils returnCordovaResult:result error:error command:command delegate:weakSelf.commandDelegate];
    }];
}

- (void)collectAdvertisingId:(CDVInvokedUrlCommand *)command {
    [self.qonversionSandwich collectAdvertisingId];
}

- (void)collectAppleSearchAdsAttribution:(CDVInvokedUrlCommand *)command {
    [self.qonversionSandwich collectAppleSearchAdsAttribution];
}

- (void)promoPurchase:(CDVInvokedUrlCommand *)command {
    NSString *storeProductId = [command argumentAtIndex:0];
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich promoPurchase:storeProductId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [QCUtils returnCordovaResult:result error:error command:command delegate:weakSelf.commandDelegate];
    }];
}

- (void)presentCodeRedemptionSheet:(CDVInvokedUrlCommand *)command {
    if (@available(iOS 14.0, *)) {
        [self.qonversionSandwich presentCodeRedemptionSheet];
    }
}

- (void)subscribeOnPromoPurchases:(CDVInvokedUrlCommand *)command {
    self.promoPurchaseDelegateId = command.callbackId;

    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT];
    [pluginResult setKeepCallbackAsBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
