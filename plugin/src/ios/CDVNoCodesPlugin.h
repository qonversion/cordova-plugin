//
//  CDVNoCodesPlugin.h
//  Qonversion
//

#import <Cordova/CDV.h>

@interface CDVNoCodesPlugin : CDVPlugin

- (void)initialize:(CDVInvokedUrlCommand *)command;
- (void)subscribe:(CDVInvokedUrlCommand *)command;
- (void)subscribePurchase:(CDVInvokedUrlCommand *)command;
- (void)subscribeRestore:(CDVInvokedUrlCommand *)command;
- (void)showScreen:(CDVInvokedUrlCommand *)command;
- (void)close:(CDVInvokedUrlCommand *)command;
- (void)setScreenPresentationConfig:(CDVInvokedUrlCommand *)command;
- (void)setLocale:(CDVInvokedUrlCommand *)command;
- (void)setPurchaseDelegate:(CDVInvokedUrlCommand *)command;
- (void)delegatedPurchaseCompleted:(CDVInvokedUrlCommand *)command;
- (void)delegatedPurchaseFailed:(CDVInvokedUrlCommand *)command;
- (void)delegatedRestoreCompleted:(CDVInvokedUrlCommand *)command;
- (void)delegatedRestoreFailed:(CDVInvokedUrlCommand *)command;

@end
