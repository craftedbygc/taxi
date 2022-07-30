---
layout: layouts/base.njk
title: Reloading JS
---

# Running JS on New Pages
Taxi can reload and run js present on a fetched page during the navigation cycle. This is especially useful when working with traditional CMSs such as WordPress or Magento, or if you wanted to split your js if you have a particularly heavy page.

It will also parse and execute inline js, allowing you to add data to the `window` object for example.

If enabled, this feature will run just after the `NAVIGATE_IN` event, after the new content has been appended to the DOM, but before the `Renderer.onEnter` method is called.

## Choosing which scripts are reloaded
By default, only scripts with the `data-taxi-reload` attribute are reloaded after a navigation.

```html
<!-- reloaded -->
<script src="/foo.js" data-taxi-reload />

<!-- this is not reloaded -->
<script src="/bar.js" />
```
In certain situations, you may not have control over the `<script />` tags directly. Luckily `reloadJsFilter` accepts a callback function to filter scripts on the new page and decide which to load.

Your callback is passed the `script` element, and must return a boolean indicating whether the script should be reloaded or not (you could check the src or id attributes for example).

Here is the default callback for `reloadJsFilter`:

```js
 (element) => element.dataset.taxiReload !== undefined
```

and here is a custom example:
```js
import { Core } from '@unseenco/taxi'

const taxi = new Core({
  reloadJsFilter: (element) => element.dataset.taxiReload !== undefined || element.src?.match('myscript.js')
})
```


## Disabling this feature
Just set `reloadJsFilter` to false when initing Taxi:

```js
import { Core } from '@unseenco/taxi'

const taxi = new Core({
  reloadJsFilter: false
})
```

<div class="border rounded-sm p-4 mt-16">
    <div class="text-sm mb-2 font-bold">What's next:</div>
    <div>
        <a href="{{ global.url }}/api-events/">API & Events</a>
    </div>
</div>