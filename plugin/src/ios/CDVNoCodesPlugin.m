//
//  CDVNoCodesPlugin.m
//  Qonversion
//

#import "CDVNoCodesPlugin.h"
#import "QCUtils.h"
@import QonversionSandwich;

@interface CDVNoCodesPlugin () <NoCodesEventListener, NoCodesPurchaseDelegateBridge>

@property (nonatomic, strong) NoCodesSandwich *noCodesSandwich;
@property (nonatomic, strong, nullable) NSString *noCodesEventDelegateId;
@property (nonatomic, strong, nullable) NSString *purchaseEventDelegateId;
@property (nonatomic, strong, nullable) NSString *restoreEventDelegateId;

@end

@implementation CDVNoCodesPlugin

- (void)noCodesDidTriggerWithEvent:(NSString * _Nonnull)event payload:(NSDictionary<NSString *,id> * _Nullable)payload {
    if (self.noCodesEventDelegateId) {
        NSMutableDictionary *result = [NSMutableDictionary dictionaryWithObject:event forKey:@"event"];
        if (payload) {
            [result setObject:payload forKey:@"payload"];
        }
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result];
        [pluginResult setKeepCallbackAsBool:true];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.noCodesEventDelegateId];
    }
}

- (void)purchaseWithProduct:(NSDictionary<NSString *,id> * _Nonnull)productData {
    if (self.purchaseEventDelegateId) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:productData];
        [pluginResult setKeepCallbackAsBool:true];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.purchaseEventDelegateId];
    }
}

- (void)restore {
    if (self.restoreEventDelegateId) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [pluginResult setKeepCallbackAsBool:true];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.restoreEventDelegateId];
    }
}

- (NoCodesSandwich *)noCodesSandwich {
    if (!_noCodesSandwich) {
        _noCodesSandwich = [[NoCodesSandwich alloc] initWithNoCodesEventListener:self];
    }

    return _noCodesSandwich;
}

- (void)initialize:(CDVInvokedUrlCommand *)command {
    NSString *projectKey = [command argumentAtIndex:0];
    NSString *source = [command argumentAtIndex:1];
    NSString *version = [command argumentAtIndex:2];
    NSString *proxyUrl = [command argumentAtIndex:3];
    NSString *locale = [command argumentAtIndex:4];
    
    [self.noCodesSandwich storeSdkInfoWithSource:source version:version];
    [self.noCodesSandwich initializeWithProjectKey:projectKey proxyUrl:proxyUrl locale:locale];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)subscribe:(CDVInvokedUrlCommand *)command {
    self.noCodesEventDelegateId = command.callbackId;

    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT];
    [pluginResult setKeepCallbackAsBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)subscribePurchase:(CDVInvokedUrlCommand *)command {
    self.purchaseEventDelegateId = command.callbackId;

    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT];
    [pluginResult setKeepCallbackAsBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)subscribeRestore:(CDVInvokedUrlCommand *)command {
    self.restoreEventDelegateId = command.callbackId;

    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT];
    [pluginResult setKeepCallbackAsBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)showScreen:(CDVInvokedUrlCommand *)command {
    NSString *contextKey = [command argumentAtIndex:0];
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.noCodesSandwich showScreen:contextKey];
    });
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)close:(CDVInvokedUrlCommand *)command {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.noCodesSandwich close];
    });
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)setScreenPresentationConfig:(CDVInvokedUrlCommand *)command {
    NSDictionary *config = [command argumentAtIndex:0];
    NSString *contextKey = [command argumentAtIndex:1];
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.noCodesSandwich setScreenPresentationConfig:config forContextKey:contextKey];
    });
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)setLocale:(CDVInvokedUrlCommand *)command {
    NSString *locale = [command argumentAtIndex:0];
    [self.noCodesSandwich setLocale:locale];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)setPurchaseDelegate:(CDVInvokedUrlCommand *)command {
    [self.noCodesSandwich setPurchaseDelegate:self];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)delegatedPurchaseCompleted:(CDVInvokedUrlCommand *)command {
    [self.noCodesSandwich delegatedPurchaseCompleted];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)delegatedPurchaseFailed:(CDVInvokedUrlCommand *)command {
    NSString *errorMessage = [command argumentAtIndex:0];
    [self.noCodesSandwich delegatedPurchaseFailed:errorMessage];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)delegatedRestoreCompleted:(CDVInvokedUrlCommand *)command {
    [self.noCodesSandwich delegatedRestoreCompleted];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)delegatedRestoreFailed:(CDVInvokedUrlCommand *)command {
    NSString *errorMessage = [command argumentAtIndex:0];
    [self.noCodesSandwich delegatedRestoreFailed:errorMessage];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
