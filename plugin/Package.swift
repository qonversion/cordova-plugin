// swift-tools-version:5.9
import PackageDescription

// Swift Package Manager manifest for cordova-ios 8+ (`package="swift"` on the iOS platform in plugin.xml).
// cordova-ios 7 ignores this file and installs the plugin through <source-file>/<header-file> + the
// QonversionSandwich pod declared in plugin.xml. Both pins must match — `fastlane upgrade_sandwich` bumps them.
//
// The package and product are named after the plugin id: cordova-ios references
// `.product(name: "<plugin id>", package: "<plugin id>")` from the generated cordova-ios-plugins package.
// The cordova-ios dependency line is rewritten by cordova-ios to a local path at install time.
let package = Package(
    name: "@qonversion/cordova-plugin",
    platforms: [.iOS(.v13)],
    products: [
        .library(name: "@qonversion/cordova-plugin", targets: ["QonversionCordovaPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/apache/cordova-ios.git", "8.0.0"..<"9.0.0"),
        .package(url: "https://github.com/qonversion/sandwich-sdk.git", exact: "7.13.1")
    ],
    targets: [
        .target(
            name: "QonversionCordovaPlugin",
            dependencies: [
                .product(name: "Cordova", package: "cordova-ios"),
                .product(name: "QonversionSandwich", package: "sandwich-sdk")
            ],
            path: "src/ios",
            publicHeadersPath: "."
        )
    ]
)
