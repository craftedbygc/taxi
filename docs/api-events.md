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

## preload()
Prefetch the provided URL and add it to the cache ahead of any user navigation.

```js
/**
 * preload( url: string, preloadAssets?: boolean = false): Promise
 */
taxi.preload('/path/to/preload')
```

You can pass a second argument to indicate you want to preload the assets on the target URL as well (images, media, etc):
```js
taxi.preload('/path/to/preload', true)
```


As `preload` returns a promise, you can also run code based on whether the fetch was a success or not:

```js
taxi.preload('/path/to/404')
    .then(() => console.log('success!'))
    .catch(err => console.warn(err))
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

// This event is sent everytime a `data-taxi-view` is added to the DOM
taxi.on('NAVIGATE_IN', ({ to, trigger }) => {
  // ...
})

// This event is sent before the `onLeave()` method of a transition is run to hide a `data-router-view`
taxi.on('NAVIGATE_OUT', ({ from, trigger }) => {
  // ...
})

// This event is sent everytime the `done()` method is called in the `onEnter()` method of a transition
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