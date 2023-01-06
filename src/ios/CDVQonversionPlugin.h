//
//  CDVQonversionPlugin.h
//  Qonversion
//
//  Created by Surik Sarkisyan on 10.03.2021.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

NS_ASSUME_NONNULL_BEGIN

@interface CDVQonversionPlugin : CDVPlugin
{}

- (void)storeSDKInfo:(CDVInvokedUrlCommand *)command;
- (void)initializeSdk:(CDVInvokedUrlCommand *)command;
- (void)setDefinedProperty:(CDVInvokedUrlCommand *)command;
- (void)setCustomProperty:(CDVInvokedUrlCommand *)command;
- (void)attribution:(CDVInvokedUrlCommand *)command;
- (void)checkEntitlements:(CDVInvokedUrlCommand *)command;
- (void)purchaseProduct:(CDVInvokedUrlCommand *)command;
- (void)purchase:(CDVInvokedUrlCommand *)command;
- (void)products:(CDVInvokedUrlCommand *)command;
- (void)restore:(CDVInvokedUrlCommand *)command;
- (void)offerings:(CDVInvokedUrlCommand *)command;
- (void)checkTrialIntroEligibility:(CDVInvokedUrlCommand *)command;
- (void)identify:(CDVInvokedUrlCommand *)command;
- (void)logout:(CDVInvokedUrlCommand *)command;
- (void)userInfo:(CDVInvokedUrlCommand *)command;
- (void)collectAdvertisingId:(CDVInvokedUrlCommand *)command;
- (void)collectAppleSearchAdsAttribution:(CDVInvokedUrlCommand *)command;
- (void)promoPurchase:(CDVInvokedUrlCommand *)command;
- (void)syncPurchases:(CDVInvokedUrlCommand *)command;

@end

NS_ASSUME_NONNULL_END
