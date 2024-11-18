//
//  QCUtils.m
//  Qonversion
//
//  Created by Kamo Spertsyan on 15.11.2024.
//

#import "QCUtils.h"

@implementation QCUtils

+ (void)returnCordovaResult:(NSDictionary *)result
                      error:(SandwichError *)error
                    command:(CDVInvokedUrlCommand *)command
                   delegate:(id <CDVCommandDelegate>)commandDelegate {
    CDVPluginResult *pluginResult = nil;
    if (error) {
        NSMutableDictionary *errorInfo = [NSMutableDictionary new];
        errorInfo[@"domain"] = error.domain;
        errorInfo[@"description"] = error.details;
        errorInfo[@"additionalMessage"] = error.additionalMessage;
        errorInfo[@"code"] = error.code;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorInfo];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result];
    }
    [commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
