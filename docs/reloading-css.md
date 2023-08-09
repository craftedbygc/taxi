---
layout: layouts/base.njk
title: Reloading CSS
---

# Running CSS on New Pages
Similarly to [Reloading JS]({{ global.url }}/reloading-js/) Taxi can also reload and run CSS present from the next page after navigation.

If enabled, this feature will run just after the `NAVIGATE_IN` event, after the new content has been appended to the DOM, but before the `Renderer.onEnter` method is called.

## Choosing which stylesheets are reloaded
By default, only stylesheets with the `data-taxi-reload` attribute are reloaded after a navigation.

```html
<!-- reloaded -->
<link rel="stylesheet" href="/foo.css" data-taxi-reload />

<!-- this is not reloaded -->
<link rel="stylesheet" href="/bar.css" />
```

If using the super cool [astro](https://astro.build/) or some other build tool which outputs per-page/component CSS, `reloadCssFilter` accepts a callback function to filter styles on the new page and decide which to load.

Your callback is passed the `link` element, and must return a boolean indicating whether the stylesheet should be reloaded or not (you could check the src or id attributes for example).

Here is the default callback for `reloadCssFilter`:

```js
 (element) => element.dataset.taxiReload !== undefined
```

and here is a custom example which loads everything:
```js
import { Core } from '@unseenco/taxi'

const taxi = new Core({
	reloadCssFilter: (element) => true
})
```


## Disabling this feature
Just set `reloadCssFilter` to false when initing Taxi:

```js
import { Core } from '@unseenco/taxi'

const taxi = new Core({
	reloadCssFilter: false
})
```

<div class="border rounded-sm p-4 mt-16">
    <div class="text-sm mb-2 font-bold">What's next:</div>
    <div>
        <a href="{{ global.url }}/api-events/">API & Events</a>
    </div>
</div>