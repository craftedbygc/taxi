<p align="center">
<img width="380" src="https://user-images.githubusercontent.com/3481634/181377879-5f972dd8-ea10-4f5b-be44-5a23edfd3d5a.svg">
</p>

<p align="center"><strong>Taxi.js is the spiritual successor to Highway.js.</strong></p>

<p align="center"><a href="https://taxi.js.org" target="_blank">Full Documentation</a></p>

<p align="center">
  <code>npm i @unseenco/taxi</code> or <code>yarn add @unseenco/taxi</code>
  <br><br>
  <a href="https://www.npmjs.com/package/@unseenco/taxi" target="_blank"><img src="https://img.shields.io/npm/v/@unseenco/taxi?color=F4BA00&style=flat-square"></a>
</p>

----

Taxi is a js library for adding AJAX navigation and beautiful transitions to your website.

It was designed as a drop-in replacement for [Highway.js](https://github.com/Dogstudio/highway) which is sadly no longer maintained.

### Enhancements over Highway:

* URL-based routing
* Better cache management
* Ability to preload URLs
* Blocks navigation during an active transition (can be opted out)
* Auto runs javascript on the new page
* Previous page's content is automatically removed (you can opt out of this if you like)
* Click events on links can be intercepted via `stopPropagation` without hacks


### Differences to Highway
* Different public API
* New methods and functionality
* `data-taxi`, `data-taxi-view`, `data-taxi-ignore` are to be used instead of `data-router-wrapper`, `data-router-view`, `data-router-disabled` respectively.
* `attach` and `detach` are no longer methods - link clicks are listened to via delegation so these are no longer needed.
* `redirect` is now `navigateTo` as "redirect" felt weird as a method name!
* Renderers now have an `initialLoad` method
* The params passed to renderers, transitions, and events are now a little different
* Old content is automatically removed during a transition - so no need to manually call `from.remove()` in your transitions.

----

<p align="center"><a href="https://taxi.js.org" target="_blank">Full Documentation</a></p>
