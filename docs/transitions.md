---
layout: layouts/base.njk
title: Transitions
---

# Transitions
Whenever a user navigates on your site, a Transition class is run to provide the fancy animation between the two pages.

A transition consists of an `onLeave` method called when leaving the current page, and an `onEnter` method which is called after the new content has been added to the DOM.

Each method is passed an object  containing the `done` promise resolve function to call when your animation is finished, and the `trigger` that caused the navigation (either `'popstate'` for browser navigation, the `Element` if a link click, or `false` if the navigation was caused programmatically via `navigateTo`.

The methods are also passed a reference to the active `data-taxi-view` element: When leaving the current `data-taxi-view` is passed, and when entering the new `data-taxi-view` is passed instead:

```js
import { Transition } from '@unseenco/taxi'

export default class MyTransition extends Transition {
  /**
   * Handle the transition leaving the previous page.
   * @param { { from: HTMLElement, trigger: string|HTMLElement|false, done: function } } props
   */
  onLeave({ from, trigger, done }) {
    // do something ...
    done()
  }

  /**
   * Handle the transition entering the next page.
   * @param { { to: HTMLElement, trigger: string|HTMLElement|false, done: function } } props
   */
  onEnter({ to, trigger, done }) {
    // do something else ...
    done()
  }
}
```

`this.wrapper` is also available, which is a reference to the main `data-taxi` container.

## Registering a transition
As with [renderers]({{ global.url }}/renderers/), when initializing Taxi you should pass through an object of Transitions to register:

```js
import MyTransition from './transitions/MyTransition'
import SomeOtherTransition from './transitions/SomeOtherTransition'

const taxi = new Core({
	renderers: {
		mine: MyTransition,
		someOther: SomeOtherTransition,
	}
})
```

### Setting a default Transition
Taxi will look for a transition with a key of `default`:

```js
const taxi = new Core({
	renderers: {
		default: MyTransition
	}
})
```

But of course this can be changed by using the `setDefaultTransition` method:

```js
const taxi = new Core({
	renderers: {
		mine: MyTransition
	}
})

taxi.setDefaultTransition('mine')
```

Confused as to why you would want to set a default Transition? No worries, read on to find out (it's important!).

## How transitions are chosen
Taxi has a distinct hierarchy when it comes to choosing which transition to run during a navigation.

The checks Taxi takes to find a Transition are as follows:

### 1. Explicit Transition
You can specify a `data-transition` attribute on a clicked link like so:
```html
<a href="/some/page/" data-transition="someTransition"> ... </a>
```
If a user clicks the above link, the `"someTransition"` transition will be used.

These are for special cases really, as browser navigation (back/forward buttons) will never trigger this.

### 2. Route Transition
The navigation had no explicit Transition associated with it, so Taxi will next check the defined routes to see if a contextual transition can be matched.

Learn more about [routing]({{ global.url }}/routing/).

### 3. Default Transition
If there was no explicit transition, and no matches from the router, finally the default transition will be used.

<div class="border rounded-sm p-4 mt-16">
    <div class="text-sm mb-2 font-bold">What's next:</div>
    <div>
        <a href="{{ global.url }}/routing/">Routing</a>
    </div>
</div>