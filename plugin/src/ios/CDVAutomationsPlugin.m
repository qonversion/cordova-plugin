//
//  CDVAutomationsPlugin.m
//  Qonversion
//
//  Created by Kamo Spertsyan on 15.11.2024.
//

#import "CDVAutomationsPlugin.h"
#import "QCUtils.h"
@import QonversionSandwich;

@interface CDVAutomationsPlugin () <AutomationsEventListener>

@property (nonatomic, strong) AutomationsSandwich *automationsSandwich;
@property (nonatomic, strong, nullable) NSString *automationsEventDelegateId;

@end

@implementation CDVAutomationsPlugin

- (void)automationDidTriggerWithEvent:(NSString * _Nonnull)event payload:(NSDictionary<NSString *,id> * _Nullable)payload {
    if (self.automationsEventDelegateId) {
        NSMutableDictionary *result = [NSMutableDictionary dictionaryWithObject:event forKey:@"event"];
        if (payload) {
            [result setObject:payload forKey:@"payload"];
        }
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result];
        [pluginResult setKeepCallbackAsBool:true];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.automationsEventDelegateId];
    }
}

- (AutomationsSandwich *)automationsSandwich {
    if (!_automationsSandwich) {
        _automationsSandwich = [AutomationsSandwich new];
    }

    return _automationsSandwich;
}

- (void)subscribe:(CDVInvokedUrlCommand *)command {
    self.automationsEventDelegateId = command.callbackId;

    [self.automationsSandwich subscribe:self];

    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT];
    [pluginResult setKeepCallbackAsBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)showScreen:(CDVInvokedUrlCommand *)command {
    __block __weak CDVAutomationsPlugin *weakSelf = self;
    NSString *screenId = [command argumentAtIndex:0];
    [self.automationsSandwich showScreen:screenId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [QONUtils returnCordovaResult:result error:error command:command delegate:weakSelf.commandDelegate];
    }];
}

- (void)setScreenPresentationConfig:(CDVInvokedUrlCommand *)command {
    NSDictionary *config = [command argumentAtIndex:0];
    NSString *screenId = [command argumentAtIndex:1];
    [self.automationsSandwich setScreenPresentationConfig:config forScreenId:screenId];
}

@end
