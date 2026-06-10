# Static light bootsplash, no dark mode at cold launch

The native splash (via `react-native-bootsplash`) is intentionally a single static **light** background (`#FFFFFF`) with the LRT wordmark, even though the app has a full dark theme.

## Context

App dark mode is a user-controlled setting persisted in MMKV (`useSettingsStore.isDarkMode`), independent of the device's OS appearance. The native splash renders **before** JavaScript boots, so it can only read OS appearance — not the in-app setting. Any OS-appearance-driven "dark splash" would therefore mismatch a user who sets the app to dark while their phone is light (or vice versa). True fidelity would require native code reading the persisted setting from MMKV at launch, or a paid bootsplash license for dark logo assets.

The pre-existing iOS `LaunchScreen.storyboard` was already hardcoded white, so shipping a single light background is no regression.

## Decision

Ship one static light splash. Accept the white cold-launch flash for dark-mode users as the cost of zero added native complexity and no licensing cost.

## Consequences

- Revisiting this means either a bootsplash license (dark logo) or native MMKV reads in `AppDelegate.swift` / `MainActivity.kt` to pick the background at launch — non-trivial, hence this record.
- The in-app `BootstrapErrorScreen` remains theme-aware; only the pre-JS native splash is fixed light.
