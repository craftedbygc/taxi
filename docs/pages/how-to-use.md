---
layout: ../layouts/base.astro
title: How to use
---

# How to Use
## Get the package

Simply include [the package](https://www.npmjs.com/package/@unseenco/taxi) through your favourite package manager:

### npm
```
npm i @unseenco/taxi
```

### yarn
```
yarn add @unseenco/taxi
```

### pnpm
```
pnpm add @unseenco/taxi
```

## Setting up
Next, you need to import `Taxi.Core` into your code and create a new instance:

```js
import { Core } from '@unseenco/taxi'

const taxi = new Core()

// or if you prefer

import * as Taxi from '@unseenco/taxi'

const taxi = new Taxi.Core()
```

Then amend your HTML so that `data-taxi` is added  to the parent of the content you want to replace during a transition, and `data-taxi-view` is added to the element you are replacing:


```html
<main data-taxi>
    <article data-taxi-view>
        ...
    </article>
</main>
```

**Please note:** The `data-taxi-view` element **has to be the only child** of `data-taxi`.


Now when you navigate in your app, `data-taxi-view` will be replaced with the `data-taxi-view` from the target URL instead of the whole page loading 🥳


## Via CDN
You can load Taxi as an ES module straight from a CDN. jsDelivr's `+esm` endpoint also resolves Taxi's dependency (`@unseenco/e`) for you:

```html
<main data-taxi>
    <article data-taxi-view>
        ...
    </article>
</main>

<script type="module">
    import { Core } from 'https://cdn.jsdelivr.net/npm/@unseenco/taxi@2/+esm'

    const taxi = new Core()
</script>
```

> **Note:** 2.0 no longer ships a UMD build, so the old `taxi.umd.js` / global `taxi` approach is no longer available. See [Upgrading to 2.0](/upgrading/).

## Which links are handled by Taxi?
Taxi will only transition links to a domain which is the same as the current URL (for obvious reasons).

By default, Taxi will not transition links which:

* have `data-taxi-ignore` present on the link element;
* are anchor links for the current page;
* have a `target` attribute present on the link element;
* have a `download` attribute present on the link element;
* are clicked with a modifier key held (<kbd>cmd</kbd>, <kbd>ctrl</kbd>, <kbd>shift</kbd> or <kbd>alt</kbd>), so opening in a new tab/window or downloading works as normal;
* have had `preventDefault()` called on their click event by your own code before it reaches Taxi.

Of course, you can always change this behaviour using the [links option](#links-string).

## Options
When creating a new Taxi instance, you can pass an object of options into the constructor:

```js
const taxi = new Core({ ... })
```

Let's look at these in more detail.

### renderers 

<div class="sm:text-right sm:-mt-8 md:-mt-10 2xl:-mt-12 not-prose">

`Record<string, Renderer>`

</div>

Please see [Renderers](/renderers/) for more information.


### transitions 

<div class="sm:text-right sm:-mt-8 md:-mt-10 2xl:-mt-12 not-prose">

`Object.<string, Transition>`

</div>

Please see [Transitions](/transitions/) for more information.

### links 

<div class="sm:text-right sm:-mt-8 md:-mt-10 2xl:-mt-12 not-prose">

`string`

</div>

Links is a CSS selector which Taxi uses to decide if a clicked link should be transitioned or not.

Here is the default value:
```js
const taxi = new Core({ 
    links: 'a[href]:not([target]):not([href^=\\#]):not([data-taxi-ignore])'
})
```

As you can see the default value ignored links with a `target` attribute, is an anchor link on the current page, or has `data-taxi-ignore` present.

You can use this option to extend this behaviour and fine tune which links are considered valid.


### removeOldContent 

<div class="sm:text-right sm:-mt-8 md:-mt-10 2xl:-mt-12 not-prose">

`boolean`

</div>

Taxi will remove the previous page's content after the Transition's `onLeave` method has finished. Set this to `false` to disable this behaviour.

### allowInterruption 

<div class="sm:text-right sm:-mt-8 md:-mt-10 2xl:-mt-12 not-prose">

`boolean`

</div>

Taxi blocks further navigation while a transition is in progress. Set this to `true` to disable this behaviour.

When a new navigation interrupts one in progress, the interrupted navigation's request is aborted and its `navigateTo()` Promise rejects with an `AbortError`. Any preloads still downloading are left alone, so the new navigation can reuse them.


### bypassCache 

<div class="sm:text-right sm:-mt-8 md:-mt-10 2xl:-mt-12 not-prose">

`boolean`

</div>

Default behaviour is to cache the contents of a URL after fetching it to make repeated visits faster. Set this to `true` to disable the cache completely.

If you want default behaviour, but wish to force certain pages to always be fetched (and never loaded from cache), you can add the `data-taxi-nocache` attribute to the `data-taxi-view` element on that page. 


### enablePrefetch 

<div class="sm:text-right sm:-mt-8 md:-mt-10 2xl:-mt-12 not-prose">

`false | 'hover' | 'visible'`

</div>

Controls the automatic prefetch strategy. Defaults to `'hover'`.

| Value | Behaviour |
|---|---|
| `'hover'` | Preloads a link when the user hovers over or focuses it (`mouseenter`/`focus`) |
| `'visible'` | Uses `IntersectionObserver` to preload links as they scroll into the viewport |
| `false` | Disables automatic prefetching entirely |

```js
// Preload links as they scroll into view
const taxi = new Core({
    enablePrefetch: 'visible'
})

// Disable prefetching
const taxi = new Core({
    enablePrefetch: false
})
```

When using `'visible'`:
* only links to the current domain are observed;
* nothing is prefetched if the user has enabled a data saver mode (`navigator.connection.saveData`);
* links are re-scanned after each navigation. If you add links to the page yourself (e.g. an infinite loader), call [`updateCache()`](/api-events/#updatecache) afterwards and they will be picked up too.

> **Note:** `enablePrefetch: true` is still accepted and maps to `'hover'` for backwards compatibility.

### enableViewTransitions 

<div class="sm:text-right sm:-mt-8 md:-mt-10 2xl:-mt-12 not-prose">

`boolean`

</div>

Opt in to the browser's [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) for page swaps. Defaults to `false`.

When enabled and the browser supports it, Taxi wraps the DOM swap (remove old page, insert new page) inside `document.startViewTransition()`, giving you:
- A default cross-fade animation with no extra code
- Element-to-element transitions via `view-transition-name` CSS

```js
const taxi = new Core({
    enableViewTransitions: true
})
```

Apply a custom CSS transition by naming elements:
```css
.hero {
    view-transition-name: hero;
}
```

> **Note:** When `enableViewTransitions` is active, custom JS `Transition` classes are bypassed — the browser handles the visual animation. Renderer lifecycle hooks (`onLeave`, `onEnter`, etc.) still fire as normal, but `onEnterCompleted` (and the `NAVIGATE_END` event) now wait for the browser's animation to visually finish before firing, rather than firing as soon as the new content is in the DOM. `onLeave`/`onLeaveCompleted` are unaffected and still fire immediately, since they're JS-side bookkeeping hooks rather than part of the visual animation. Browsers that don't support the API fall back to the standard behaviour automatically. Users who prefer reduced motion get an instant swap with no animation.

See [View Transitions](/view-transitions/) for a deeper explanation and a live demo, including how to scope the animation to a single element (e.g. a specific `<div>`).

### enableAccessibility

<div class="sm:text-right sm:-mt-8 md:-mt-10 2xl:-mt-12 not-prose">

`boolean`

</div>

Opt in to accessibility handling for page changes. Defaults to `false`.

After a normal page load, screen readers announce the new page and keyboard focus starts at the top of the document. After an AJAX navigation neither happens: focus stays on a link that no longer exists and nothing is announced. With `enableAccessibility: true`, after each navigation Taxi:

* announces the new page's `<title>` through a visually hidden `aria-live` region (added to the end of `<body>` with a `data-taxi-announcer` attribute);
* moves focus to the first `<h1>` in the new `data-taxi-view`, or to the `data-taxi-view` element itself if there is no `<h1>`. The element gets `tabindex="-1"` so it can take focus, and focus happens with `preventScroll` so your scroll handling is unaffected.

```js
const taxi = new Core({
    enableAccessibility: true
})
```

Browsers show a focus outline on the focused element. If you'd rather not show it for these programmatically focused elements:

```css
[data-taxi-view] h1:focus:not(:focus-visible),
[data-taxi-view]:focus:not(:focus-visible) {
    outline: none;
}
```

### maxCacheSize

<div class="sm:text-right sm:-mt-8 md:-mt-10 2xl:-mt-12 not-prose">

`number`

</div>

By default Taxi caches every page it visits indefinitely. Set `maxCacheSize` to a positive integer to limit how many pages are kept in the cache at once.

When the limit is reached, the least recently used page (that isn't the current page) is evicted to make room. Visiting or preloading a cached page counts as using it. Set to `0` (default) for unlimited caching.

```js
const taxi = new Core({
    maxCacheSize: 10
})
```

### fetchOptions

<div class="sm:text-right sm:-mt-8 md:-mt-10 2xl:-mt-12 not-prose">

`RequestInit`

</div>

An object of options merged into every `fetch()` request Taxi makes. Use this to add custom headers, change credentials mode, etc.

```js
const taxi = new Core({
    fetchOptions: {
        headers: { 'X-My-Header': 'value' },
        credentials: 'include',
    }
})
```

### reloadJsFilter 

<div class="sm:text-right sm:-mt-8 md:-mt-10 2xl:-mt-12 not-prose">

`bool|function(element: HTMLElement)`

</div>

Please see [Reloading JS](/reloading-js/) for more information.

### reloadCssFilter

<div class="sm:text-right sm:-mt-8 md:-mt-10 2xl:-mt-12 not-prose">

`bool|function(element: HTMLLinkElement|HTMLStyleElement)`

</div>

Please see [Reloading CSS](/reloading-css/) for more information.


<div class="border rounded-sm p-4 mt-16">
    <div class="text-sm mb-2 font-bold">What's next:</div>
    <div>
        <a href="/renderers/">Renderers</a>
    </div>
</div>