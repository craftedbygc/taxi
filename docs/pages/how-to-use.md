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
You can use Taxi via a CDN thanks to the kind folks at unpkg.com. Just be sure to note that the main export is `taxi` with a lowercase t:

```html
<script src="https://unpkg.com/@unseenco/e@2.2.2/dist/e.umd.js" crossorigin></script>
<script src="https://unpkg.com/@unseenco/taxi@1.0.3/dist/taxi.umd.js" crossorigin></script>

<main data-taxi>
    <article data-taxi-view>
        ...
    </article>
</main>

<script>
    const t = new taxi.Core()
</script>
```

## Which links are handled by Taxi?
Taxi will only transition links to a domain which is the same as the current URL (for obvious reasons).

By default, Taxi will not transition links which:

* have `data-taxi-ignore` present on the link element;
* are anchor links for the current page;
* have a `target` attribute present on the link element;

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
    links: 'a:not([target]):not([href^=\\#]):not([data-taxi-ignore])'
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

> **Note:** When `enableViewTransitions` is active, custom JS `Transition` classes are bypassed — the browser handles the visual animation. Renderer lifecycle hooks (`onLeave`, `onEnter`, etc.) still fire as normal, but `onEnterCompleted` (and the `NAVIGATE_END` event) now wait for the browser's animation to visually finish before firing, rather than firing as soon as the new content is in the DOM. `onLeave`/`onLeaveCompleted` are unaffected and still fire immediately, since they're JS-side bookkeeping hooks rather than part of the visual animation. Browsers that don't support the API fall back to the standard behaviour automatically.

See [View Transitions](/view-transitions/) for a deeper explanation and a live demo, including how to scope the animation to a single element (e.g. a specific `<div>`).

### maxCacheSize

<div class="sm:text-right sm:-mt-8 md:-mt-10 2xl:-mt-12 not-prose">

`number`

</div>

By default Taxi caches every page it visits indefinitely. Set `maxCacheSize` to a positive integer to limit how many pages are kept in the cache at once.

When the limit is reached, the oldest cached page (that isn't the current page) is evicted to make room. Set to `0` (default) for unlimited caching.

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

`bool|function(element: HTMLLinkElement)`

</div>

Please see [Reloading CSS](/reloading-css/) for more information.


<div class="border rounded-sm p-4 mt-16">
    <div class="text-sm mb-2 font-bold">What's next:</div>
    <div>
        <a href="/renderers/">Renderers</a>
    </div>
</div>