// swift-tools-version:5.9
// Consumed by cordova-ios 8+ when <platform name="ios" package="swift"> is set.
import PackageDescription

let package = Package(
    name: "qonversion-cordova-plugin",
    platforms: [.iOS(.v13)],
    products: [
        .library(name: "qonversion-cordova-plugin", targets: ["QonversionPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/apache/cordova-ios.git", from: "8.0.0"),
        .package(url: "https://github.com/qonversion/sandwich-sdk.git", exact: "7.10.0")
    ],
    targets: [
        .target(
            name: "QonversionPlugin",
            dependencies: [
                .product(name: "Cordova", package: "cordova-ios"),
                .product(name: "QonversionSandwich", package: "sandwich-sdk")
            ],
            path: "src/ios",
            publicHeadersPath: "."
        )
    ]
)
