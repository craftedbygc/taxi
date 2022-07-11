---
layout: layouts/base.njk
title: How To Use
---
# How to Use
Simply import `Taxi.Core` into your code and create a new instance:

```js
import { Core } from '@unseenco/taxi'

const Taxi = new Core({ ... })
```

Then amend your HTML so that `data-taxi` is added  to the parent of the content you want to replace during a transition, and `data-taxi-view` is added to the element you are replacing.

The `data-taxi-view` element **has to be the only child** of `data-taxi`.

```html
<main data-taxi>
  <article data-taxi-view>
    ...
  </article>
</main>
```
Now when you navigate in your app, `data-taxi-view` will be replaced with the `data-taxi-view` from the target URL instead of the whole page loading 🥳



## Parameters
When creating a new Taxi instance, you can pass an object of parameters into the constructor:

| Param | Type | Default | Description |
|---|---|---|---|
| links | `string` | `'a:not([target]):not([href^= \\ #]):not([data-taxi-ignore])'` | Which links should Taxi intercept. |
| removeOldContent | `boolean` | `true` | Taxi will remove the previous page's content after the Transition's `onLeave` method has finished. Set this to false to disable this behaviour. |
| renderers | `Object.<string, Renderer>` | `{ default: Taxi.Renderer }` | All Renderers for the project. |
| transitions | `Object.<string, Transition>` | `{ default: Taxi.Transition }` | All Transitions for the project. |
| reloadJsFilter | `bool\|function(element: HTMLElement)` | `function` | See [running JS on new pages](#running-js-on-new-pages) for details. |