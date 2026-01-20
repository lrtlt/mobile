# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LRT.lt is a React Native mobile application (iOS and Android) for the Lithuanian public broadcasting service. The app provides access to news articles, live TV/radio streams, podcasts, videos, and weather information.

## Development Commands

### Running the App

```bash
# iOS
yarn run-ios                                    # Build & run in debug mode
react-native run-ios --configuration Release   # Build & run in release mode

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

**iOS**: After installing dependencies, run `cd ios && pod install` to install CocoaPods.

**Android**: Ensure Android SDK is configured. The app uses Gradle build system.

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

**Firebase** (v22.4.0):
- Analytics: Navigation and event tracking
- Messaging (FCM): Push notifications with foreground/background handlers
- Crashlytics: Error reporting
- Firestore: Dynamic menu configuration
- App Check: Security token validation

**Media Players**:
- THEOplayer (v10.7.1): Video/audio playback via `PlayerProvider` context
- Google Cast (v4.9.1): Chromecast support

**Analytics**:
- Gemius plugin (configured via `.env` variables)
- Chartbeat SDK (account ID: 65978)
- Firebase Analytics

**Authentication**: Auth0 (v5.3.1) configured via `.env` variables

**Storage**: MMKV (v3.3.3) for ultra-fast persistent key-value storage

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
    └── [setup hooks]       # useFirebaseMessaging, useGoogleAnalyticsSetup, etc.
```

**Key Screens** (`app/screens/`): `article`, `channel`, `podcast`, `vodcast`, `search`, `user`, `favorites`, `bookmarks`, `history`, `weather`, `games`, `gallery`, `verticalVideos`

**Key Components** (`app/components/`): `videoComponent`, `audioComponent`, `articleParagraphs`, `htmlRenderer`, `drawer`, `opusPlaylistModal`, `facebookComments`, `MyScrollView`, `MyFlatList`

### Article Formatters

Strategy pattern in `app/util/articleFormatters/` for dynamic layouts:
- Router: `formatArticles()` dispatches by `template_id`
- Formatters: default, top, template1-3, template9, template999
- Each handles responsive grid/row layouts differently

### Environment Configuration

`.env` file contains:
- Gemius analytics credentials
- Firebase App Check debug tokens
- Chartbeat configuration
- THEOplayer license
- Auth0 domain and client ID

Use `react-native-config` to access environment variables in code.

### Babel Configuration

`babel.config.js` includes `react-native-worklets/plugin` for Reanimated worklets support.

### TypeScript

Configuration extends `@react-native/typescript-config` with:
- Platform-specific module suffixes: `.ios`, `.android`, `.native`
- `noUnusedLocals: true` for stricter checking

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

## Testing Notes

- Jest is configured in `package.json`
- Node version: >=20
- Run tests with `yarn test`

## Platform-specific Considerations

**iOS**:
- CocoaPods dependencies managed in `ios/Podfile`
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
