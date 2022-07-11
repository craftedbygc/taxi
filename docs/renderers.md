---
layout: layouts/base.njk
title: How To Use
---

# Renderers
A Renderer is run everytime a page is shown or hidden when using Taxi. They are an ideal place to init/destroy components on the page, or play intro animations.

All Renderers should extend `@unseenco/taxi.Renderer` and look something like this:

```js
import { Renderer } from '@unseenco/taxi';

export default class CustomRenderer extends Renderer {
  onEnter() {
    // run after the new content has been added to the Taxi container
  }

  onEnterCompleted() {
     // run after the transition.onEnter has fully completed
  }

  onLeave() {
    // run before the transition.onLeave method is called
  }

  onLeaveCompleted() {
    // run after the transition.onleave has fully completed
  }
}
```

The following props are available within Renderer methods:
* `this.page` : The entire document that is being rendered
* `this.title` : The document.title of the page being rendered
* `this.wrapper` : A reference to the current `data-taxi` main wrapper
* `this.content` :  A reference to the `data-taxi-view` which is being added to the DOM

## Running code on the initial visit to your site
Renderers are called whenever a navigation takes place, but the correct Renderer is also called when a user first visits your site.

There may be things you want to setup at this time such as persistent components like navigation, or smoothscroll for example.

To aid with this, Renderers also have an `initialLoad` method which is only run on a user's first visit.

As no navigation has taken place, Taxi won't fire your Renderer's `onEnter` or `onEnterCompleted` methods, so we suggest running them here is a good idea:

```js
import { Renderer } from '@unseenco/taxi';

export default class CustomRenderer extends Renderer {
  initialLoad() {
    // run code that should only happen once for your site

    this.onEnter()
    this.onEnterCompleted()
  }

  // rest of your methods
}
```

