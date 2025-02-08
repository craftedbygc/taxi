---
layout: layouts/base.njk
title: Routing
---

# Routing
Routing in Taxi is used to choose which [Transition]({{ global.url }}/transitions/) to choose when a user performs a navigation.

They are defined via the `addRoute` method, and consist of a regex to run against the current URL, a regex to run against the new URL after the navigation, and the transition to use if matched.

Here are a few examples:

```js
// Transition from a blog page to the homepage
taxi.addRoute('/blog/.*', '', 'blogToHome')

// Transition the homepage to any other page
taxi.addRoute('', '.*', 'fromHome')

// Transition from the about page, to the contact page
taxi.addRoute('/about', '/contact', 'aboutToContact')
```

**Please note:** Your regex is wrapped inside `^` and `$` automatically, so a regex of `/api` will match `/api` **but not** `/v2/api`. Keep this in mind when adding routing rules!

**Also please note:** All trailing slashes are stripped from all URLs before they are matched. This means that `/` will not match your homepage, but `''` or `/?` will.

They are also run as `RegExp` so there's no need to escape slashes. 👊


Suck at regular expressions? Start here: [RegEx help for newbies](https://softchris.github.io/pages/javascript-regex.html)


## Route Ordering
Routes are tested in **the same order they are declared**, and as soon as a match is found, that transition is chosen.


Lost? Well consider the following:

```js
// bad
taxi.addRoute('/pages/.*', '', 'somethingElse')
taxi.addRoute('/pages/specific', '', 'something')

// good
taxi.addRoute('/pages/specific', '', 'something')
taxi.addRoute('/pages/.*', '', 'somethingElse')
```

In the above example, if the user was navigating from `/pages/specific` to the homepage, only the second example would match and run the "something" transition.

This is because the first example registers the catch-all **before** the specific rule, so the specific one is never reached.


<div class="border rounded-sm p-4 mt-16">
    <div class="text-sm mb-2 font-bold">What's next:</div>
    <div>
        <a href="{{ global.url }}/navigation-lifecycle/">Navigation Lifecycle</a>
    </div>
</div>