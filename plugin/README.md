# @qonversion/cordova-plugin

[![npm](https://img.shields.io/npm/v/@qonversion/cordova-plugin)](https://www.npmjs.com/package/@qonversion/cordova-plugin)
[![GitHub release](https://img.shields.io/github/v/release/qonversion/cordova-plugin?label=Latest%20Release)](https://github.com/qonversion/cordova-plugin/releases)

Qonversion Cordova plugin: in-app subscriptions, receipt validation, subscription analytics, No-Codes paywalls and third-party integrations for Cordova apps on iOS and Android.

## Installation

```bash
cordova plugin add @qonversion/cordova-plugin
```

The plugin wires up the native iOS and Android modules itself: on cordova-ios 8 it is installed as a Swift package and the native dependency comes from Swift Package Manager; cordova-ios 6/7 keep using CocoaPods. The iOS deployment target must be 13.0 or higher — on cordova-ios 6/7 add `<preference name="deployment-target" value="13.0" />` to `config.xml`. Requirements and troubleshooting: [Cordova installation guide](https://documentation.qonversion.io/docs/cordova).

## Documentation

- [Installation](https://documentation.qonversion.io/docs/cordova)
- [Quick start](https://documentation.qonversion.io/docs/quickstart)
- [CocoaPods → Swift Package Manager migration (December 2026)](https://documentation.qonversion.io/docs/dec-2026-migration-guide-cocoapods-to-spm)
- [Source, sample app and changelog](https://github.com/qonversion/cordova-plugin)

## License

MIT
