---
layout: layouts/base.njk
title: API and Events Reference
---

# API

### `addRoute(fromPattern: string, toPattern: string, transition: string): void`
Registers a route into the RouteStore.

### `navigateTo(url: string, transition?: string = false): Promise`
Perform a manual navigation to the provided URL.

If a `transition` name is not provided then Taxi will try and find a match in the RouteStore, otherwise the default transition will be used.

### `preload(url: string): Promise`
prefetch the provided URL and add it to the cache ahead of any user navigation.

### `updateCache(): void`
Updates the HTML cache for the current URL.

Useful when adding/removing content via AJAX such as a search page or infinite loader

### `deleteCache(url?: string): void`
Remove the cached HTML for the provided URL. If no URL provided, remove cache for the current URL.

### `setDefaultRenderer(renderer: string): void`
If you don't like "default" as the name of your default renderer, you can change the default renderer to be anything you like here.

### `setDefaultTransition(renderer: string): void`
Same as `setDefaultRenderer`, but for the transitions instead.

### `on(event: string, callback: function): void`
Add an [event listener](#events).

### `off(event: string, callback?: function)`
Remove an [event listener](#events). If no callback is supplied, then remove all listeners for the provided event.


![taxi-stripe-small](https://user-images.githubusercontent.com/3481634/164978141-8ec3aade-5a56-4986-93f7-05c971aeb940.png)

# Events
Events are handled by [@unseenco/e](https://www.npmjs.com/package/@unseenco/e) and work as they did in Highway.js.

### Adding Listeners
```js
import { Core } from '@unseenco/taxi'

const Taxi = new Core({ ... })

// This event is sent everytime a `data-taxi-view` is added to the DOM
Taxi.on('NAVIGATE_IN', ({ to, trigger, location }) => {
  // ...
});

// This event is sent before the `onLeave()` method of a transition is run to hide a `data-router-view`
Taxi.on('NAVIGATE_OUT', ({ from, trigger, location }) => {
  // ...
});

// This event is sent everytime the `done()` method is called in the `onEnter()` method of a transition
Taxi.on('NAVIGATE_END', ({ to, from, trigger, location }) => {
  // ...
});
```

### Removing Listeners
You can call `Taxi.off(event_name)` to remove all listeners for an event, or pass the callback to remove just that listener instead:

```js
function foo() { // ... }

Taxi.on('NAVIGATE_OUT', foo)

// Remove just the foo listener
Taxi.off('NAVIGATE_OUT', foo)

// remove all listeners
Taxi.off('NAVIGATE_IN')
```