
<p align="center"><strong>Taxi.js is the spiritual successor to Highway.js.</strong></p>

<p align="center">Full docs on the way!</p>

<p align="center">
  <code>npm i @unseenco/taxi</code> or <code>yarn add @unseenco/taxi</code>
</p>


![taxi-stripe](https://user-images.githubusercontent.com/3481634/162572869-c07f1daf-4dd9-4a37-8644-a4bb070d2603.png)

Taxi is a js library for adding AJAX navigation and beautiful transitions to your website. 

It was designed as a drop-in replacement for [Highway.js](https://github.com/Dogstudio/highway) which is sadly no longer maintained.

### Improvements over Highway:

* URL-based routing
* Better cache management
* Ability to preload URLs
* Opt-in ability to stop navigation during an active transition
* Auto runs javascript on the new page
* Previous page's content is automatically removed (you can opt out of this if you like)


### Differences to Highway
* Different public API
* New methods and functionality
* `data-taxi` and `data-taxi-view` are to be used instead of `data-router-wrapper` and `data-router-view` respectively.
* `attach` and `detach` are no longer methods - link clicks are listened to via delegation so these are no longer needed.
* `redirect` is now `navigateTo` as "redirect" felt weird as a method name!
* The params passed to renderers, transitions, and events are now a little different


# Table of Contents
* [How to Use](#how-to-use)
* [Transitions and Routing](#transitions-and-routing)
  * [Routing 101](#routing-101)
* [API](#api)
* [Events](#events)


# How to Use




# Transitions and Routing

Taxi has a distinct heirarchy when it comes to choosing which transition to run during a navigation:

#### 1. Explicit Transition
If a user clicks a link with `data-transition="something"` present, then the "something" transition will be used. 

These are for special cases really, as browser navigation (back/forward buttons) will never trigger this.

#### 2. Route Transition
If there was no explicit transition, then Taxi will next check the defined routes to see if a contextual transition can be matched.

#### 3. Default Transition
As there was no explicit transition, and no matches from the router, finally the default transition will be used.

## Routing 101
Routes are defined in Taxi as a regex to run against the current URL, and one to run against the new URL after the navigation.

### Route Ordering
Routes are tested in **the same order they are declared**, and as soon as a match is found, that transition is chosen.


Lost? Well consider the following:

```js
// bad
taxi.addRoute('/pages/.*', '/', 'somethingElse')
taxi.addRoute('/pages/specific', '/', 'something')

// good
taxi.addRoute('/pages/specific', '/', 'something')
taxi.addRoute('/pages/.*', '/', 'somethingElse')
```

In the above example, if the user was navigating from `/pages/specific` to the homepage, only the second example would match and run the "something" transition.

This is because the first example registers the catch all **before** the specific rule, so the specific one is never reached.


**Please note:** Your regex is wrapped inside `^` and `$` automatically, so a regex of `/api` will match `/api` **but not** `/v2/api`. Keep this in mind when adding routing rules!



# API

### addRoute(fromPattern: string, toPattern: string, transition: string): void
Registers a route into the RouteStore.

### navigateTo(url: string, transition?: string = false): Promise
Perform a manual navigation to the provided URL.

If a `transition` name is not provided then Taxi will try and find a match in the RouteStore, otherwise the default transition will be used.

### preload(url: string): Promise
prefetch the provided URL and add it to the cache ahead of any user navigation.

### updateCache(): void
Updates the HTML cache for the current URL.

Useful when adding/removing content via AJAX such as a search page or infinite loader

### deleteCache(url?: string): void
Remove the cached HTML for the provided URL. If no URL provided, remove cache for the current URL.

### setDefaultRenderer(renderer: string): void
If you don't like "default" as the name of your default renderer, you can change the default renderer to be anything you like here.

### setDefaultTransition(renderer: string): void
Same as `setDefaultRenderer`, but for the transitions instead.

### on(event: string, callback: function): void
Add an [event listener](#events).

### off(event: string, callback?: function)
Remove an [event listener](#events). If no callback is supplied, then remove all listeners for the provided event.


## Events
