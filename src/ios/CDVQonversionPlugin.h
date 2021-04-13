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
- (void)launch:(CDVInvokedUrlCommand *)command;
- (void)setDebugMode:(CDVInvokedUrlCommand *)command;
- (void)setAdvertisingID:(CDVInvokedUrlCommand *)command;
- (void)setUserID:(CDVInvokedUrlCommand *)command;
- (void)syncPurchases:(CDVInvokedUrlCommand *)command;

@end

NS_ASSUME_NONNULL_END
