//
//  CDVQonversionPlugin.m
//  Qonversion
//
//  Created by Surik Sarkisyan on 10.03.2021.
//

#import "CDVQonversionPlugin.h"
@import QonversionSandwich;

@interface CDVQonversionPlugin () <QonversionEventListener>

@property (nonatomic, strong) QonversionSandwich *qonversionSandwich;

@end

@implementation CDVQonversionPlugin

- (void)qonversionDidReceiveUpdatedEntitlements:(NSDictionary<NSString *,id> *)entitlements {
    
}

- (void)shouldPurchasePromoProductWith:(NSString *)productId {
    
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
    
    [self.qonversionSandwich initializeWithProjectKey:key launchModeKey:launchModeKey environmentKey:environmentKey entitlementsCacheLifetimeKey:cacheLifetimeKey];
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

- (void)attribution:(CDVInvokedUrlCommand *)command {
    NSDictionary *data = [command argumentAtIndex:0];
    NSString *provider = [command argumentAtIndex:1];
    
    [self.qonversionSandwich attributionWithProviderKey:provider value:data];
}

- (void)checkEntitlements:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich checkEntitlements:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [weakSelf returnCordovaResult:result error:error command:command];
    }];
}

- (void)purchaseProduct:(CDVInvokedUrlCommand *)command {
    NSString *productId = [command argumentAtIndex:0];
    NSString *offeringId = [command argumentAtIndex:1];
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich purchaseProduct:productId offeringId:offeringId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [weakSelf returnCordovaResult:result error:error command:command];
    }];
}

- (void)purchase:(CDVInvokedUrlCommand *)command {
    NSString *productId = [command argumentAtIndex:0];
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich purchase:productId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [weakSelf returnCordovaResult:result error:error command:command];
    }];
}

- (void)products:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich products:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [weakSelf returnCordovaResult:result error:error command:command];
    }];
}

- (void)restore:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich restore:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [weakSelf returnCordovaResult:result error:error command:command];
    }];
}

- (void)offerings:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich offerings:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [weakSelf returnCordovaResult:result error:error command:command];
    }];
}

- (void)checkTrialIntroEligibility:(CDVInvokedUrlCommand *)command {
    NSArray *data = [command argumentAtIndex:0];
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich checkTrialIntroEligibility:data completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [weakSelf returnCordovaResult:result error:error command:command];
    }];
}

- (void)identify:(CDVInvokedUrlCommand *)command {
    NSString *identityId = [command argumentAtIndex:0];
    [self.qonversionSandwich identify:identityId];
}

- (void)logout:(CDVInvokedUrlCommand *)command {
    [self.qonversionSandwich logout];
}

- (void)userInfo:(CDVInvokedUrlCommand *)command {
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich userInfo:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [weakSelf returnCordovaResult:result error:error command:command];
    }];
}

- (void)setAdvertisingId:(CDVInvokedUrlCommand *)command {
    [self.qonversionSandwich collectAdvertisingId];
}

- (void)setAppleSearchAdsAttributionEnabled:(CDVInvokedUrlCommand *)command {
    [self.qonversionSandwich collectAppleSearchAdsAttribution];
}

- (void)promoPurchase:(CDVInvokedUrlCommand *)command {
    NSString *storeProductId = [command argumentAtIndex:0];
    __block __weak CDVQonversionPlugin *weakSelf = self;
    [self.qonversionSandwich promoPurchase:storeProductId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [weakSelf returnCordovaResult:result error:error command:command];
    }];
}

- (void)presentCodeRedemptionSheet:(CDVInvokedUrlCommand *)command {
    if (@available(iOS 14.0, *)) {
        [self.qonversionSandwich presentCodeRedemptionSheet];
    }
}

- (void)syncPurchases:(CDVInvokedUrlCommand *)command { }

- (void)returnCordovaResult:(NSDictionary *)result
                      error:(SandwichError *)error
                    command:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = nil;
    if (error) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:error.additionalInfo];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result];
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
