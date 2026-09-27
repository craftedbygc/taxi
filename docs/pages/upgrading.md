---
layout: ../layouts/base.astro
title: Upgrading to 2.0
---

# Upgrading to 2.0
2.0 is mostly additive, but a few defaults and behaviours have changed. Work through this list when upgrading from 1.x.

## Breaking changes

### `initialLoad` no longer runs `onEnter` / `onEnterCompleted`
In 1.x, the base Renderer's `initialLoad` called `onEnter` and `onEnterCompleted`. If you never overrode `initialLoad`, those hooks ran on first page load. In 2.0 they don't.

To keep the old behaviour, add this to your Renderer (or a base Renderer your others extend):

```js
initialLoad() {
    this.onEnter()
    this.onEnterCompleted()
}
```

### Only CSS marked with `data-taxi-reload` is reloaded by default
The default `reloadCssFilter` used to return `true` for every stylesheet. It now matches `reloadJsFilter` and only reloads `<link rel="stylesheet">` and `<style>` elements that have `data-taxi-reload`.

Either add the attribute to the stylesheets that should be reloaded, or restore the old behaviour:

```js
new Core({
    reloadCssFilter: () => true
})
```

See [Reloading CSS](/reloading-css/).

### Route matching carries on after an unmatched "to" pattern
In 1.x, once a "from" pattern matched, Taxi stopped looking, even if none of that pattern's "to" patterns matched. It now carries on and checks the routes declared after it, so a catch-all declared later can match. See [Route Ordering](/routing/#route-ordering).

### `preload()` rejects on failure
`preload()` used to log a warning and resolve. It now resolves with the `CacheEntry`, and rejects on a non-2xx response, a network error, or a page with no `[data-taxi-view]`. Add a `.catch()` if you call it yourself:

```js
taxi.preload('/about').catch(() => {})
```

### Internal methods are now private
The following were never documented but were reachable in 1.x, and are now truly private (`#`) so they can't be called or overridden:

`fetch`, `beforeFetch`, `afterFetch`, `loadScripts`, `loadStyles`, `attachEvents`, `onClick`, `onPopstate`, `onPrefetch`, `chooseTransition`, `createCacheEntry`, `activePromises`.

`currentCacheEntry` is now a read-only getter.

### Modified clicks and download links are left to the browser
Taxi now ignores link clicks with <kbd>shift</kbd> or <kbd>alt</kbd> held (as well as <kbd>cmd</kbd>/<kbd>ctrl</kbd> as before), links with a `download` attribute, and clicks your own code has already called `preventDefault()` on. See [Which links are handled by Taxi?](/how-to-use/#which-links-are-handled-by-taxi)

### Missing `[data-taxi]` now throws
Creating a `Core` on a page without a `[data-taxi]` element now throws a descriptive error, instead of failing later with a less helpful one.

### Packaging
* The UMD build (`dist/taxi.umd.js`) and the `dist/taxi.esm.js` / `dist/taxi.modern.js` files are gone. The package now ships `dist/taxi.js` (ES module) and `dist/taxi.cjs` (CommonJS) behind an `exports` map. If you were loading Taxi via a `<script>` tag, switch to a module script, see [Via CDN](/how-to-use/#via-cdn).
* Deep imports such as `@unseenco/taxi/src/Core` no longer work. Import from `@unseenco/taxi`.
* Type declarations have moved from `src/*.d.ts` to `types/`, with separate CommonJS declarations for `require` users.
* `@unseenco/e` is now a regular dependency (`^3.0.0`) rather than being bundled in, so if you use `E` yourself you share the same event bus as Taxi. If you depend on `@unseenco/e` 2.x directly, upgrade it to 3.x to avoid installing two copies.
* Importing Taxi no longer needs a DOM, so it can be imported in code that also runs during server-side rendering (Astro, Next, etc). Only create the `Core` in the browser.

## New in 2.0
* **[View Transitions](/view-transitions/)** via `enableViewTransitions`, skipped automatically for users who prefer reduced motion.
* **`enableAccessibility`** (opt in) announces page changes to screen readers and moves focus to the new content. See [enableAccessibility](/how-to-use/#enableaccessibility).
* **`enablePrefetch: 'visible'`** to preload links as they scroll into view. `true` still works and means `'hover'`.
* **`maxCacheSize`** to cap the cache, evicting the least recently used page.
* **`fetchOptions`** to customise every request Taxi makes.
* **Transitions can return a Promise** from `onLeave` / `onEnter` instead of calling `done()`.
* **`navigateBack()` / `navigateForward()`**, which respect `allowInterruption`.
* **`destroy()`** to remove all of Taxi's listeners and observers.
* **`this.trigger`** is available inside Renderers.
* **`NAVIGATE_OUT` includes `to`**, the destination `CacheEntry` (or a stub if it isn't cached yet).
* **Better failure handling**: a failed navigation now resets Taxi so the next one isn't blocked, and a fetched page that isn't Taxi-compatible (e.g. a login redirect) is loaded normally by the browser instead of leaving an empty page.
* **Clearer warnings** for unregistered renderers and transitions.
* **Interruptions are handled properly** with `allowInterruption`: the interrupted navigation's request is aborted and its Promise rejects with an `AbortError`, and preloads in flight are no longer cancelled.
* **A transition that throws or rejects** is logged and treated as finished, instead of leaving the navigation hanging.
* **Typed events**: `on()` / `off()` accept `'NAVIGATE_OUT' | 'NAVIGATE_IN' | 'NAVIGATE_END'` with a typed payload.
