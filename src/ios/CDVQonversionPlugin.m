//
//  CDVQonversionPlugin.m
//  Qonversion
//
//  Created by Surik Sarkisyan on 10.03.2021.
//

#import "CDVQonversionPlugin.h"
#import <Qonversion/Qonversion.h>

@implementation CDVQonversionPlugin

- (void)launch:(CDVInvokedUrlCommand *)command {
    [self storeSDKInfo];
    NSString *projectKey = [command argumentAtIndex:0];
    
    [Qonversion launchWithKey:projectKey];
}

- (void)setDebugMode:(CDVInvokedUrlCommand *)command {
    [Qonversion setDebugMode];
}

- (void)setUserID:(CDVInvokedUrlCommand *)command {
    NSString *userID = [command argumentAtIndex:0];
    [Qonversion setUserID:userID];
}

- (void)syncPurchases:(CDVInvokedUrlCommand *)command { }

- (void)storeSDKInfo {
    [NS]
}

@end
