# Changelog

## 2.0.0

See the [upgrade guide](https://taxi.js.org/upgrading/) for migration steps.

### Breaking
- `Renderer.initialLoad()` no longer calls `onEnter()` / `onEnterCompleted()`.
- `reloadCssFilter` now defaults to only reloading stylesheets with `data-taxi-reload`.
- Route matching continues to later routes when a "from" pattern matches but none of its "to" patterns do.
- `preload()` resolves with the `CacheEntry` and rejects on failure instead of logging a warning.
- Internal methods are now private class members, and `currentCacheEntry` is read-only.
- Link clicks with shift/alt held, links with `download`, and clicks already `preventDefault()`-ed are no longer intercepted.
- A missing `[data-taxi]` element now throws on construction.
- Packaging: ESM (`dist/taxi.js`) and CJS (`dist/taxi.cjs`) builds behind an `exports` map. The UMD build and `src` entry are gone. Types have moved to `types/`.
- Requires `@unseenco/e` `^3.0.0`, which is now an external dependency instead of being bundled.

### Added
- `enableViewTransitions` option for the View Transitions API. It is skipped for users with `prefers-reduced-motion: reduce`.
- `enableAccessibility` option (off by default) that announces the new page title in an `aria-live` region and moves focus to the new content after each navigation.
- `enablePrefetch: 'visible'` to prefetch links as they enter the viewport (respects data saver, same-origin links only).
- `maxCacheSize` option with least-recently-used eviction.
- `fetchOptions` option.
- Transitions can return a Promise instead of calling `done()`.
- `navigateBack()`, `navigateForward()` and `destroy()` methods.
- `this.trigger` on Renderers, and `to` in the `NAVIGATE_OUT` payload.
- Sourcemaps, and CommonJS type declarations.
- Typed event names and payloads for `on()` / `off()`.

### Fixed
- A failed navigation resets `isTransitioning` so later navigations aren't blocked.
- With `allowInterruption`, clicking a link while its hover preload was still downloading could hang the navigation. Navigations now use their own abort controller: an interrupted navigation rejects with an `AbortError`, and preloads are never aborted.
- A Transition whose `onLeave`/`onEnter` throws or rejects no longer hangs the navigation.
- A fetched page without `[data-taxi-view]` falls back to a full page load instead of leaving the wrapper empty.
- Failed hover prefetches and popstate navigations no longer cause unhandled promise rejections.
- Importing Taxi no longer requires a DOM, so it can be imported during server-side rendering.
- `updateCache()` on the current page keeps the live Renderer instance and updates `currentCacheEntry`.
- `Renderer.remove()` removes the renderer's own content rather than the wrapper's first child.
- Type declarations: invalid `array` type, broken filter function types, missing `Transition` import, and missing `.js` extensions for `nodenext` resolution.
