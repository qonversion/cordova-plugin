//
//  CDVQonversionPlugin.m
//  Qonversion
//
//  Created by Surik Sarkisyan on 10.03.2021.
//

#import "CDVQonversionPlugin.h"
#import <Qonversion/Qonversion.h>

@implementation CDVQonversionPlugin

- (void)storeSDKInfo:(CDVInvokedUrlCommand *)command {
    NSString *sdkVersion = [command argumentAtIndex:0];
    NSString *sdkVersionKey = [command argumentAtIndex:1];
    NSString *source = [command argumentAtIndex:2];
    NSString *sourceKey = [command argumentAtIndex:3];
    
    [[NSUserDefaults standardUserDefaults] setValue:sdkVersion forKey:sdkVersionKey];
    [[NSUserDefaults standardUserDefaults] setValue:source forKey:sourceKey];
}

- (void)launch:(CDVInvokedUrlCommand *)command {
    NSString *projectKey = [command argumentAtIndex:0];
    
    [Qonversion launchWithKey:projectKey];
}

- (void)setDebugMode:(CDVInvokedUrlCommand *)command {
    [Qonversion setDebugMode];
}

- (void)setAdvertisingID:(CDVInvokedUrlCommand *)command {
    [Qonversion setAdvertisingID];
}

- (void)setUserID:(CDVInvokedUrlCommand *)command {
    NSString *userID = [command argumentAtIndex:0];
    [Qonversion setUserID:userID];
}

- (void)syncPurchases:(CDVInvokedUrlCommand *)command { }

@end
