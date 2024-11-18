//
//  CDVAutomationsPlugin.h
//  Qonversion
//
//  Created by Kamo Spertsyan on 15.11.2024.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

NS_ASSUME_NONNULL_BEGIN

@interface CDVAutomationsPlugin : CDVPlugin
{}

- (void)subscribe:(CDVInvokedUrlCommand *)command;
- (void)showScreen:(CDVInvokedUrlCommand *)command;
- (void)setScreenPresentationConfig:(CDVInvokedUrlCommand *)command;

@end

NS_ASSUME_NONNULL_END
