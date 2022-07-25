---
layout: layouts/base.njk
title: Navigation Lifecycle
---

# Navigation Lifecycle
Now that you understand [Renderers]({{ global.url }}/renderers) and [Transitions]({{ global.url }}/transitions/), how does it all fit together?

Let's use a **real world example** to find out:

1. A user clicks a link in your app
2. Taxi [checks to see which Transition]({{ global.url }}/transitions/#how-transitions-are-chosen) should be used
3. The current Renderer's `onLeave` method is called
4. Then the chosen Transition's `onLeave`
5. Then the Renderer's `onLeaveCompleted`
6. Next, Taxi will go and fetch the new page the user has requested, and swap the current page's content to this new content as soon as it's ready
7. Taxi will look at the new page content and call the `onEnter` method of the Renderer set via the new page's `data-taxi-view` attribute, or the default if not defined
8. Then call the Transition's `onEnter` method
9. Finally, when the transition is all finished, the new Renderer's `onEnterComplete` is called


<div class="border rounded-sm p-4 mt-16">
    <div class="text-sm mb-2 font-bold">What's next:</div>
    <div>
        <a href="{{ global.url }}/reloading-js/">Reloading JS</a>
    </div>
</div>