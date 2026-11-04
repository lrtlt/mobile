# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LRT.lt is a React Native mobile application (iOS and Android) for the Lithuanian public broadcasting service. The app provides access to news articles, live TV/radio streams, podcasts, videos, and weather information.

React Native 0.88 (React 19.3, New Architecture only, Hermes).

## Development Commands

### Running the App

```bash
# iOS
yarn run-ios                                    # Build & run in debug mode
react-native run-ios --mode Release            # Build & run in release mode
yarn run-ios --device                           # Build & run on a connected iPhone

# Android
yarn run-android                                # Build & run in debug mode
react-native run-android --variant=release     # Build & run in release mode

# Metro bundler
yarn start                                      # Start the Metro bundler
```

### Clean Build

```bash
# macOS/Linux (includes iOS pod install)
yarn clean-build

# Windows (includes Android gradlew clean)
yarn clean-build-win
```

### Code Quality

```bash
yarn lint          # Run ESLint
yarn ts            # Run TypeScript compiler (skipLibCheck enabled)
yarn test          # Run Jest tests
```

### Platform-specific Setup

**iOS**: After installing dependencies, run `yarn pods` (`bundle exec pod install` in `ios/`). CocoaPods crashes without a UTF-8 locale, so set `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8` if needed. React Native core is installed as the prebuilt `React.xcframework` (React Native's default), so changes under `node_modules/react-native` are not compiled on iOS.

**Android**: compileSdk 37, AGP 9 (with `android.builtInKotlin=false` / `android.newDsl=false` opt-outs), Kotlin 2.4 (`kotlinVersion` in `android/build.gradle`, also the `kotlin-gradle-plugin` classpath version; Firebase BoM 35 and Cast 23 ship Kotlin 2.4 metadata), minSdk 26 (required by Auth0 v6). Android Auto (`android/auto`) uses Firebase Analytics/Firestore directly with its own `firebase-bom` pin: keep it equal to `sdkVersions.android.firebase` in `@react-native-firebase/app`'s package.json.

### Yarn Patches

Yarn 3 applies `.yarn/patches/*` through `resolutions` in `package.json`. A patch only applies to the exact version in its key, so recreate it with `yarn patch` / `yarn patch-commit` when bumping the package:
- `@d11/react-native-fast-image@8.13.0`: bases its `ImageStyle` type on React Native's (the strict types no longer export `FlexStyle` / `ShadowStyleIOS`). Types only.
- `react-native-autoheight-webview@1.6.5` (two stacked patches)

### Version Bumping

The app follows semantic versioning (MAJOR.MINOR.PATCH). When bumping versions, update all three locations:

**package.json**:
- `version`: String version (e.g., "2.65.2")

**Android** (`android/app/build.gradle`):
- `versionCode`: Calculated as MAJOR×100000 + MINOR×100 + PATCH (e.g., 2.65.2 = 206502)
- `versionName`: String version (e.g., "2.65.2")

**iOS** (`ios/lrtApp.xcodeproj/project.pbxproj`):
- `CURRENT_PROJECT_VERSION`: Same as Android versionCode (e.g., 206502)
- `MARKETING_VERSION`: Same as Android versionName (e.g., 2.65.2)

Both Debug and Release configurations must be updated in the iOS project file.

## Architecture

### State Management

The app uses **Zustand** for state management with MMKV for persistent storage. Key stores:

- **`useSettingsStore`** (`app/state/settings_store.ts`): Theme settings (dark mode), text size, feature toggles, logo, weather location
- **`useUserStore`** (`app/state/user_store.ts`): User-specific data like adult content consent
- **`useNavigationStore`** (`app/state/navigation_store.ts`): Menu structure, routes, channels - loaded from Firestore
- **`useArticleStore`** (`app/state/article_store.ts`): Content state for home, categories, mediateka, radioteka - uses Immer for immutable updates
- **`useArticleStorageStore`** (`app/state/article_storage_store.ts`): User bookmarks and reading history (max 50 items)

All stores use `zustandStorage` from `app/state/mmkv.ts` for persistence except `useArticleStore` (loaded on startup).

### Data Fetching

React Query (`@tanstack/react-query`) handles all server state with network-aware retry logic via `@react-native-community/netinfo`.

**API Layer** (`app/api/`):
- `HttpClient.ts`: Axios client with auth interceptor
- `Endpoints.ts`: API endpoint builders
- `hooks/`: 18+ custom React Query hooks (`useArticle`, `useSearch`, `useChannel`, `useProgram`, etc.)

**Key Patterns**:
- Query keys are arrays for cache invalidation
- `staleTime` typically 1-2 minutes for content freshness
- AbortSignal support for cancellation
- Fallback URL logic in `useArticle()` hook

### Navigation

React Navigation with deep linking support:
- Prefixes: `lrt://` and `https://www.lrt.lt`
- Main structure: `MainDrawer` → `Main Tab Navigator` → `MainStack` (30+ screens)
- Type-safe routes via `MainStackParamList` in `app/navigation/MainStack.tsx`
- Article deep links: `/naujienos/:category/*/:articleId/:title`

Menu structure is dynamic and loaded from Firestore (`internal/app-menu-v2` document) into `useNavigationStore`.

### Native Integrations

**Firebase** (v27.1.0; Firebase iOS SDK 13.1.1 via Swift Package Manager, Android BoM 35.0.2):
- iOS Firebase is SPM-only, which requires `use_frameworks! :linkage => :dynamic` for `lrtApp`. RNFB's pod install hooks link FirebaseCore into the app target (for `FirebaseApp.configure()` in `AppDelegate.swift`) and add the SPM embed and build-setting phases. Don't link any other Firebase product into `lrtApp`: when a product is declared by both an RNFB pod and our target, Xcode builds it as a shared framework, and for Analytics and Firestore that link fails (their prebuilt binaries lose GoogleAppMeasurement/abseil). So the CarPlay code reaches RNFB's own `FIRAnalytics` and `FIRFirestore` at runtime through `CarPlayAnalytics.m` and `RDSFirestoreListener.m`. `link_firebase_spm_products` in the Podfile links FirebaseMessaging into the `FCMImageNotification` extension (its own process, no CocoaPods) from RNFB's `firebase-ios-sdk` package reference at the same exact version. If you build Debug after a Release archive and get undefined `Sealable`/`getDebug…` symbols, the Pods still hold the Release flavor of the prebuilt `React.xcframework` (react-native#57293): write `Release` to `ios/Pods/React-Core-prebuilt/.last_build_configuration` and build again.
- Analytics: Navigation and event tracking
- Messaging (FCM): Push notifications with foreground/background handlers
- Crashlytics: Error reporting
- Firestore: Dynamic menu configuration

**Media Players**:
- THEOplayer (v11.8.0): Video/audio playback via `PlayerProvider` context
- Google Cast (v4.9.1): Chromecast support

**Analytics**:
- Gemius plugin (configured via `.env` variables)
- smartocto (`app/analytics/smartocto.ts`): GET requests to its ingestion endpoint, no SDK
- Firebase Analytics

**Authentication**: Auth0 (v6.1.0) configured via `.env` variables. `Auth0Provider` sets `useDPoP={true}`: v6 defaults it to off, but signed-in sessions are DPoP-bound and the native CarPlay / Android Auto auth managers (`CarPlayAuthManager.swift`, `AutoAuthManager.kt`, which use Auth0.swift 3 / Auth0.Android 4 directly) enable DPoP too.

**Storage**: MMKV (v4.3.2, built on react-native-nitro-modules) for ultra-fast persistent key-value storage

**Notifications**: Notifee (v9.1.8) for native notification handling

### Theming

Theme system in `app/theme/`:
- `ThemeProvider` consumes `isDarkMode` from `useSettingsStore`
- `useTheme()` hook provides `themeLight` or `themeDark` to components
- Channel-based color schemes in `app/util/UI.tsx` via `getColorsForChannel()`

Most styling uses React Native's `StyleSheet.create()`.

### Project Structure

```
app/
├── analytics/        # Firebase, smartocto and Gemius tracking, view counter, useNavigationAnalytics
├── api/              # HTTP client, endpoints, React Query hooks
├── components/       # 60+ reusable UI components organized by domain
├── constants/        # App-wide constants
├── hooks/            # Custom React hooks (useCancellablePromise, useIsMounted, etc.)
├── navigation/       # React Navigation setup, route definitions, deep linking
├── screens/          # 30+ full-screen features (article, channel, search, etc.)
├── state/            # Zustand stores (6 stores) and MMKV configuration
├── theme/            # Theme context and dark mode support
└── util/             # Utilities, formatters, setup hooks
    ├── articleFormatters/  # Template-based layout strategy pattern
    └── [setup hooks]       # useFirebaseMessaging, useNetworkStatus, etc.
```

**Key Screens** (`app/screens/`): `article`, `channel`, `podcast`, `vodcast`, `search`, `user`, `favorites`, `bookmarks`, `history`, `weather`, `games`, `gallery`, `verticalVideos`

**Key Components** (`app/components/`): `videoComponent`, `audioComponent`, `articleParagraphs`, `htmlRenderer`, `drawer2`, `baseModal`, `opusPlaylistModal`, `facebookComments`, `MyScrollView`, `MyFlatList`

Modals use `BaseModal` (`app/components/baseModal/BaseModal.tsx`), a wrapper around React Native's `Modal` with a fading backdrop and slide-up content (Reanimated). It keeps react-native-modal's prop names (`isVisible`, `onBackdropPress`, `onBackButtonPress`, `backdropOpacity`, `avoidKeyboard`); react-native-modal was removed because it uses `InteractionManager`, which React Native 0.88 removed.

The status bar is set per screen through native-stack's `statusBarStyle` option in `app/navigation/MainStack.tsx`, not with React Native's `StatusBar` component.

### Article Formatters

Strategy pattern in `app/util/articleFormatters/` for dynamic layouts:
- Router: `formatArticles()` dispatches by `template_id`
- Formatters: default, top, template1-3, template9, template999
- Each handles responsive grid/row layouts differently

### Environment Configuration

`.env` file contains:
- Gemius analytics credentials
- THEOplayer license
- Auth0 domain and client ID

Use `react-native-config` to access environment variables in code.

### Babel Configuration

`babel.config.js` includes `react-native-worklets/plugin` for Reanimated worklets support.

### TypeScript

Configuration extends `@react-native/typescript-config` with:
- Platform-specific module suffixes: `.ios`, `.android`, `.native`
- `noUnusedLocals: true` for stricter checking

The code type-checks against React Native's strict generated types (`types_generated`, the 0.88 default). Use their names: `ScrollViewInstance` for scroll view refs, `HostInstance` for native view refs (e.g. `measureInWindow`), `ListViewToken` instead of `ViewToken`. `Falsy` and `StyleSheet.absoluteFillObject` no longer exist; use `StyleSheet.absoluteFill`. Import react-native-webview types from `react-native-webview/lib/...`, not `src/`, or `tsc` type-checks the library's sources.

## Important Patterns

### Immutable Updates

`useArticleStore` uses Immer's `produce()` for complex nested state updates while maintaining immutability.

### Component Optimization

Use `useShallow` from Zustand to prevent unnecessary re-renders when selecting store slices.

### Event Listeners

`useNavigationStore` uses `react-native-event-listeners` for cross-store communication and navigation events.

### Cancellable Promises

Use `useCancellablePromise` hook for async operations that should cancel on unmount.

### Network Status

React Query integrates with Netinfo. Check `useNavigationStore` for `isOfflineMode` state.

### Analytics Tracking

Navigation changes automatically trigger Gemius tracking. Use Firebase Analytics for custom events via `useArticleStorageStore` methods.

Screens report views through `useNavigationAnalytics` (Firebase `page_view` + smartocto page view). For article pages the smartocto visit also sends an Article Read after 10 s and Attention Time every 5 s, counted only while the screen is focused and the app is in the foreground. Attention Time deliberately omits the scroll position (`sp`): lrt.lt reports read depth, and app values would mislead. The Firebase `page_view` (`app/analytics/googleAnalytics.ts`) mirrors the GA4 `page_view` lrt.lt sends (page_location, page_title, page_referrer), so app and web views land in the same event; no `screen_view` is sent. smartocto merges app and web traffic by url, domain id and post id, so the `smartocto` page metadata must match what lrt.lt sends in its `window._ain` object character for character. Check the web page before changing it. Screens without an lrt.lt page (bookmarks, history, gallery...) omit `smartocto`, and so does the tag screen (SlugScreen), because lrt.lt `/tema/...` tag pages load no smartocto tracker at all.

## Testing Notes

- Jest is configured in `package.json`
- Node version: >=22.13 (required by React Native 0.88)
- Run tests with `yarn test`

## Platform-specific Considerations

**iOS**:
- CocoaPods dependencies managed in `ios/Podfile`, with dynamic frameworks (required by Firebase SPM). `THEOplayer-Connector-SideloadedSubtitle` declares `static_framework`, which CocoaPods rejects under a dynamic pod, so the Podfile's `pre_install` builds it as a dynamic framework.
- Xcode configuration files in `ios/lrtApp.xcworkspace`

**Android**:
- Gradle configuration in `android/build.gradle`
- Custom fonts in `android/app/src/main/assets/fonts/`

## Recent Features

Based on recent commits:
- Audio embed posters
- Podcast playback fix for seasons with 100+ episodes
- Mediateka template 60 support
- Games webview integration
