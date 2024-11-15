//
//  QCUtils.h
//  Qonversion
//
//  Created by Kamo Spertsyan on 15.11.2024.
//

@interface QCUtils : NSObject

+ (void)returnCordovaResult:(NSDictionary *)result
                      error:(SandwichError *)error
                    command:(CDVInvokedUrlCommand *)command
                   delegate:id <CDVCommandDelegate> commandDelegate;

@end
