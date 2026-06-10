# LRT Mobile

The Lithuanian public broadcaster's React Native app (iOS + Android) for news, live TV/radio, podcasts, and video.

## Language

**Offline Mode**:
A degraded app state the user can enter when startup fails for lack of a network connection. It bypasses the normal data fetch and lets the user read previously bookmarked articles. Distinct from the device being offline — it is an explicit, user-chosen fallback.
_Avoid_: offline cache, airplane mode, no-connection mode

**Bootstrap**:
The startup phase between cold launch and the app being usable — the native splash is shown while the dynamic menu and home content are fetched. Ends when home content is ready, or fails into the bootstrap error surface (from which the user can retry or enter Offline Mode).
_Avoid_: cold start, init, loading
