# Qonversion Cordova Plugin

**Qonversion is the app growth system for people and agents.** It collects the revenue data of your
subscription app and keeps it lined up with what App Store Connect reports, so campaigns,
experiments and entitlements run on the same numbers. This repository holds the Cordova plugin: the
part that runs inside your app.

[![Version](https://img.shields.io/github/v/release/qonversion/cordova-plugin?label=version)](https://github.com/qonversion/cordova-plugin/releases)
[![npm](https://img.shields.io/npm/v/%40qonversion%2Fcordova-plugin)](https://www.npmjs.com/package/@qonversion/cordova-plugin)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![Platforms](https://img.shields.io/badge/platforms-iOS%20%7C%20Android-blue.svg?style=flat)](https://documentation.qonversion.io/docs/cordova)

```bash
cordova plugin add @qonversion/cordova-plugin
```

**The full readme lives in [`plugin/README.md`](plugin/README.md)** — quickstart, the first call,
requirements and the agent section. The package is published from `plugin/`, so that is also the
file npm renders.

* [Welcome](https://documentation.qonversion.io/docs/qonversion-platform) — what the platform does.
* [Cordova setup](https://documentation.qonversion.io/docs/cordova) — full installation.
* [Quick start](https://documentation.qonversion.io/docs/quickstart) — choose a mode, create a project, connect the stores.
* [For agents](https://documentation.qonversion.io/docs/for-agents) — MCP servers, machine-readable docs, ready-made prompts.

Working with an agent? Read [`AGENTS.md`](AGENTS.md).

## Sample app

[`sample/`](sample) — a Cordova app that initializes the plugin, lists products, makes a purchase
and reads entitlements.

## Help

Contact us via [issues on GitHub](https://github.com/qonversion/cordova-plugin/issues) or the
[contact form](https://qonversion.io/contact-us) on our site.

## License

Qonversion SDK is available under the MIT license. See [LICENSE](LICENSE).
