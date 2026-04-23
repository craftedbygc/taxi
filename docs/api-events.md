---
layout: layouts/base.njk
title: API and Events Reference
---

# API

## addRoute()
Registers a route into the RouteStore.

```js
/**
 * addRoute(fromPattern: string, toPattern: string, transition: string): void
 */
taxi.addRoute('/blog/.*', '/', 'blogToHome')
```

## navigateTo()
Perform a manual navigation to the provided URL.

If a `transition` name is not provided then Taxi will try and find a match in the RouteStore, otherwise the default transition will be used.

```js
/**
 * navigateTo(url: string, transition?: string = false): Promise
 */
taxi.navigateTo('/contact')

taxi.navigateTo('/contact', 'explcitTransition').then(() => { ... })
```

## navigateBack()
Navigate back in the browser history. Respects the `allowInterruption` setting — if a transition is in progress and `allowInterruption` is `false`, the call is ignored with a console warning.

```js
/**
 * navigateBack(): void
 */
taxi.navigateBack()
```

## navigateForward()
Navigate forward in the browser history. Respects the `allowInterruption` setting.

```js
/**
 * navigateForward(): void
 */
taxi.navigateForward()
```

## preload()
Prefetch the provided URL and add it to the cache ahead of any user navigation.

Returns a Promise that resolves to the `CacheEntry` so you can inspect the preloaded data.

```js
/**
 * preload(url: string, preloadAssets?: boolean = false): Promise<CacheEntry>
 */
taxi.preload('/path/to/preload')
```

You can pass a second argument to indicate you want to preload the assets on the target URL as well (images, media, etc):
```js
taxi.preload('/path/to/preload', true)
```


As `preload` returns a Promise that resolves to the `CacheEntry`, you can inspect the preloaded page or handle failures:

```js
taxi.preload('/path/to/page')
    .then((entry) => console.log('preloaded:', entry.title))
    .catch(err => {
        // Rejects on non-2xx responses (e.g. 404 with no error page),
        // network errors, or if the fetched page has no [data-taxi-view].
        console.warn('preload failed', err)
    })
```

## updateCache()
Updates the cached HTML for the provided URL. If no URL is provided, update cache for the current URL.

Useful when adding/removing content via AJAX such as a search page or infinite scroll.

```js
/**
 * updateCache(url?: string): void
 */
taxi.updateCache()
```


## clearCache()
Remove the cached HTML for the provided URL. If no URL is provided, remove cache for the current URL.

```js
/**
 * clearCache(url?: string): void
 */
taxi.clearCache('/path/to/delete')
```

## setDefaultRenderer()
If you don't like "default" as the name of your default renderer, you can change the default renderer to be anything you like here.

```js
/**
 * setDefaultRenderer(renderer: string): void
 */
taxi.setDefaultRenderer('myRenderer')
```

## setDefaultTransition()
Same as `setDefaultRenderer`, but for the transitions instead.
```js
/**
 * setDefaultTransition(transition: string): void
 */
taxi.setDefaultTransition('myTransition')
```



## Events
Events are handled by [@unseenco/e](https://www.npmjs.com/package/@unseenco/e).

### Adding Listeners
```js
import { Core } from '@unseenco/taxi'

const taxi = new Core({ ... })

// Sent before the current page's leave transition begins.
// Includes both the page being left (from) and the destination URL (to).
taxi.on('NAVIGATE_OUT', ({ from, to, trigger }) => {
  // from: the current CacheEntry
  // to:   a CacheEntry if the page was preloaded/cached; otherwise a stub with the
  //       same keys but null values (except finalUrl which holds the target URL string)
  // ...
})

// Sent once the new data-taxi-view has been added to the DOM
taxi.on('NAVIGATE_IN', ({ to, from, trigger }) => {
  // ...
})

// Sent after the enter transition has fully completed
taxi.on('NAVIGATE_END', ({ to, from, trigger }) => {
  // ...
})
```

### Removing Listeners
You can call `taxi.off(event_name)` to remove all listeners for an event, or pass the callback to remove just that listener instead:

```js
function foo() {
	... 
}

taxi.on('NAVIGATE_OUT', foo)

// Remove just the foo listener
taxi.off('NAVIGATE_OUT', foo)

// Remove all listeners
taxi.off('NAVIGATE_IN')
```
