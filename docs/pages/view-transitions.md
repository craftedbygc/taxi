---
layout: ../layouts/base.astro
title: View Transitions
---

# View Transitions
Taxi can opt in to the browser's native [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) to animate page swaps, instead of (or in addition to) writing your own JS [Transition](/transitions/).

Enable it with the `enableViewTransitions` option:

```js
import { Core } from '@unseenco/taxi'

const taxi = new Core({
	enableViewTransitions: true
})
```

When this is enabled and the browser supports it, Taxi wraps its DOM swap (removing the old `data-taxi-view`, inserting the new one) inside `document.startViewTransition()`. The browser then takes a screenshot of the page before and after the swap and animates between them - by default, a simple cross-fade. 

Custom JS `Transition` classes are bypassed in favour of this browser-driven animation, but renderer lifecycle hooks (`onLeave`, `onEnter`, etc.) still run as normal. 

Browsers without support simply fall back to Taxi's regular behaviour, so this is safe to enable.

## Lifecycle timing
`onEnter` fires as soon as the new content is in the DOM (matching the browser starting its animation), but `onEnterCompleted` - and the `NAVIGATE_END` event - wait for the browser's `finished` promise, i.e. until the animation has actually finished playing on screen. `isTransitioning` also stays `true` for that whole duration, so you can rely on it (or `NAVIGATE_END`) to know the animation is visually done, not just that the DOM has been swapped.

`onLeave`/`onLeaveCompleted` are unaffected and still fire immediately (before the browser even takes its "before" screenshot) - they're JS-side bookkeeping hooks, not part of the visual animation.


## Can it transition just one element, like a specific div?
**Yes.** Give an element a unique `view-transition-name` and the browser pulls it out of the default cross-fade entirely, giving it its own "before" and "after" snapshot that it animates (morphs) between - regardless of where or how big it is on each page. Everything else on the page keeps using the default root transition.

```css
.hero {
	view-transition-name: hero;
}
```

As long as an element with `view-transition-name: hero` exists on both the page you're leaving and the page you're entering, the browser will morph one into the other (position, size, etc.) while the rest of the page just cross-fades. If you don't want an element to animate at all, set `view-transition-name: none` on it instead.

## Live demo
Below is a small, self-contained example: a photo gallery where clicking a card navigates (via a real Taxi instance) to a detail page. Each photo shares the same `view-transition-name` between the gallery and detail views, so it morphs from its small square into the larger detail layout, while the heading/text around it simply fades.

<p><a href="/view-transitions-demo/gallery.html" target="_blank" rel="noopener">Open the demo in a new tab ↗</a></p>

<iframe src="/view-transitions-demo/gallery.html" title="Taxi.js View Transitions demo" loading="lazy" style="width: 100%; height: 32rem; border: 2px solid currentColor; border-radius: 0.5rem;"></iframe>

<div class="border rounded-sm p-4 mt-16">
    <div class="text-sm mb-2 font-bold">What's next:</div>
    <div>
        <a href="/routing/">Routing</a>
    </div>
</div>
