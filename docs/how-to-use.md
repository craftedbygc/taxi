---
layout: layouts/base.njk
title: How To Use
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

### renderers `Object.<string, Renderer>`
Please see [Renderers]({{ global.url }}/renderers/) for more information.


### transitions `Object.<string, Transition>`
Please see [Transitions]({{ global.url }}/transitions/) for more information.

### links `string`
Links is a CSS selector which Taxi uses to decide if a clicked link should be transitioned or not.

Here is the default value:
```js
const taxi = new Core({ 
    links: 'a:not([target]):not([href^=\\#]):not([data-taxi-ignore])'
})
```

As you can see the default value ignored links with a `target` attribute, is an anchor link on the current page, or has `data-taxi-ignore` present.

You can use this option to extend this behaviour and fine tune which links are considered valid.


### removeOldContent `boolean`
Taxi will remove the previous page's content after the Transition's `onLeave` method has finished. Set this to `false` to disable this behaviour.

### allowInterruption `boolean`
Taxi blocks further navigation while a transition is in progress. Set this to `true` to disable this behaviour.


### bypassCache `boolean`
Default behaviour is to cache the contents of a URL after fetching it to make repeated visits faster. Set this to `true` to disable the cache completely.

If you want default behaviour, but wish to force certain pages to always be fetched (and never loaded from cache), you can add the `data-taxi-nocache` attribute to the `data-taxi-view` element on that page. 


### enablePrefetch `boolean`
Default behaviour is to preload links on your website whenever the `mouseenter` or `focus` event is triggered.

If you want to disable this or want to implement your own preloading strategy, set this to `false`.

### reloadJsFilter `bool|function(element: HTMLElement)`
Please see [Reloading JS]({{ global.url }}/reloading-js/) for more information.


<div class="border rounded-sm p-4 mt-16">
    <div class="text-sm mb-2 font-bold">What's next:</div>
    <div>
        <a href="{{ global.url }}/renderers/">Renderers</a>
    </div>
</div>

### reloadCssFilter `bool|function(element: HTMLLinkElement)`
Please see [Reloading CSS]({{ global.url }}/reloading-css/) for more information.


<div class="border rounded-sm p-4 mt-16">
    <div class="text-sm mb-2 font-bold">What's next:</div>
    <div>
        <a href="{{ global.url }}/renderers/">Renderers</a>
    </div>
</div>