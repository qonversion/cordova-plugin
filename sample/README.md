# Qonversion Cordova sample

A Cordova app exercising `@qonversion/cordova-plugin` from `../plugin` (products, entitlements, remote configs, user properties, No-Codes).

## Run

The plugin's JavaScript is built, not committed, so build it first:

```bash
cd plugin && yarn && yarn build
cd ../sample && npm install
npx cordova platform add ios      # or android
npm run ios                       # cordova run ios --emulator; `npm run xcode` opens platforms/ios/App.xcworkspace
```

`cordova platform add` restores the plugin from `package.json` (`cordova.plugins` + the `file:../plugin` dependency). After changing the plugin, `npm run clean` rebuilds it and re-adds it to the project (needs a global `cordova` CLI).

iOS: cordova-ios 8 installs the plugin as a Swift package; the CocoaPods tool still has to be installed (cordova-ios generates a pod-less Podfile and runs `pod install`). `build.json` carries Qonversion's development team for device builds — change it for your own account, simulator builds ignore it.
