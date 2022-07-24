---
layout: layouts/base.njk
title: Renderers
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
* `this.wrapper` : A reference to the `data-taxi` element
* `this.content` :  A reference to the `data-taxi-view` element which is being added to the DOM

## Registering a Renderer
When initializing Taxi, you can pass through an object of renderers to register:

```js
import MyRenderer from './renderers/MyRenderer'
import SomeOtherRenderer from './renderers/SomeOtherRenderer'

const taxi = new Core({
	renderers: {
		mine: MyRenderer,
		someOther: SomeOtherRenderer,
	}
})
```


## Associating a Renderer with a page
When Taxi fetches a page, it looks at the `data-taxi-view` attribute to choose the renderer for that page. 

If we wanted to run `SomeOtherRenderer` from the example above when visiting a page, we would just use the key we added it under as the value for `data-taxi-view`:

```html
<div data-taxi-view="someOther">
    ...
</div>
```

Now when the page is transitioned to, Taxi knows to find the renderer with a key of `someOther` and run it.

### Default Renderers
But what happens if we don't specify a value to `data-taxi-view`?
```html
<div data-taxi-view> ... </div>
```
 Taxi will look for a renderer with a key of `default` and run that as a fallback:

```js
const taxi = new Core({
	renderers: {
		default: MyRenderer,
		someOther: SomeOtherRenderer,
	}
})
```

If you don't like `default` as the key for this fallback renderer, you can set your own using the `SomeOtherRenderer` method:

```js
const taxi = new Core({
	renderers: {
		mine: MyRenderer,
		someOther: SomeOtherRenderer,
	}
})

taxi.setDefaultRenderer('mine')
```


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

<div class="border rounded-sm p-4 mt-16">
    <div class="text-sm mb-2 font-bold">What's next:</div>
    <div>
        <a href="/transitions/">Transitions</a>
    </div>
</div>
