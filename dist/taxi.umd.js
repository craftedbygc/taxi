!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("@unseenco/e")):"function"==typeof define&&define.amd?define(["exports","@unseenco/e"],t):t((e||self).taxi={},e.E)}(this,function(e,t){function r(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var n=/*#__PURE__*/r(t);function i(){return i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},i.apply(this,arguments)}function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function a(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(r)return(r=r.call(e)).next.bind(r);if(Array.isArray(e)||(r=function(e,t){if(e){if("string"==typeof e)return o(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?o(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0;return function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var c=new DOMParser;function s(e){var t=new URL(e,window.location.origin),r=null;return t.hash.length&&(r=e.replace(t.hash,"")),{hasHash:t.hash.length>0,pathname:t.pathname,host:t.host,raw:e,href:r||t.href}}function h(e){"HEAD"===e.parentNode.tagName?document.head.appendChild(u(e)):document.body.appendChild(u(e))}function u(e){for(var t=document.createElement("SCRIPT"),r=0;r<e.attributes.length;r++){var n=e.attributes[r];t.setAttribute(n.nodeName,n.nodeValue)}return e.innerHTML&&(t.innerHTML=e.innerHTML),t}var l=/*#__PURE__*/function(){function e(e){this.wrapper=e.wrapper}var t=e.prototype;return t.leave=function(e){var t=this;return new Promise(function(r){t.onLeave(i({},e,{done:r}))})},t.enter=function(e){var t=this;return new Promise(function(r){t.onEnter(i({},e,{done:r}))})},t.onLeave=function(e){(0,e.done)()},t.onEnter=function(e){(0,e.done)()},e}(),f=/*#__PURE__*/function(){function e(e){var t=e.page,r=e.title,n=e.wrapper;this._contentString=e.content.outerHTML,this._DOM=null,this.page=t,this.title=r,this.wrapper=n,this.content=this.wrapper.lastElementChild}var t=e.prototype;return t.onEnter=function(){},t.onEnterCompleted=function(){},t.onLeave=function(){},t.onLeaveCompleted=function(){},t.initialLoad=function(){this.onEnter(),this.onEnterCompleted()},t.update=function(){document.title=this.title,this.wrapper.appendChild(this._DOM.firstElementChild),this.content=this.wrapper.lastElementChild,this._DOM=null},t.createDom=function(){this._DOM||(this._DOM=document.createElement("div"),this._DOM.innerHTML=this._contentString)},t.remove=function(){this.wrapper.firstElementChild.remove()},t.enter=function(e,t){var r=this;return new Promise(function(n){r.onEnter(),e.enter({trigger:t,to:r.content}).then(function(){r.onEnterCompleted(),n()})})},t.leave=function(e,t,r){var n=this;return new Promise(function(i){n.onLeave(),e.leave({trigger:t,from:n.content}).then(function(){r&&n.remove(),n.onLeaveCompleted(),i()})})},e}(),d=/*#__PURE__*/function(){function e(){this.data=new Map,this.regexCache=new Map}var t=e.prototype;return t.add=function(e,t,r){this.data.has(e)||(this.data.set(e,new Map),this.regexCache.set(e,new RegExp("^"+e+"$"))),this.data.get(e).set(t,r),this.regexCache.set(t,new RegExp("^"+t+"$"))},t.findMatch=function(e,t){for(var r,n=a(this.data);!(r=n()).done;){var i=r.value,o=i[1];if(e.pathname.match(this.regexCache.get(i[0]))){for(var c,s=a(o);!(c=s()).done;){var h=c.value,u=h[1];if(t.pathname.match(this.regexCache.get(h[0])))return u}break}}return null},e}(),p="A transition is currently in progress",v=/*#__PURE__*/function(){function e(e){var t=this;void 0===e&&(e={}),this.isTransitioning=!1,this.currentCacheEntry=null,this.cache=new Map,this.activePromises=new Map,this.onClick=function(e){if(!e.metaKey&&!e.ctrlKey){var r=s(e.currentTarget.href);if(t.currentLocation=s(window.location.href),t.currentLocation.host!==r.host)return;if(t.currentLocation.href!==r.href||t.currentLocation.hasHash&&!r.hasHash)return e.preventDefault(),void t.navigateTo(r.raw,e.currentTarget.dataset.transition||!1,e.currentTarget).catch(function(e){return console.warn(e)});t.currentLocation.hasHash||r.hasHash||e.preventDefault()}},this.onPopstate=function(){return!(window.location.pathname===t.currentLocation.pathname&&!t.isPopping)&&(t.allowInterruption||!t.isTransitioning&&!t.isPopping?(t.isPopping||(t.popTarget=window.location.href),t.isPopping=!0,void t.navigateTo(window.location.href,!1,"popstate")):(window.history.pushState({},"",t.popTarget),console.warn(p),!1))},this.onPrefetch=function(e){var r=s(e.currentTarget.href);t.currentLocation.host===r.host&&t.preload(e.currentTarget.href,!1)};var r=e.links,n=void 0===r?"a:not([target]):not([href^=\\#]):not([data-taxi-ignore])":r,i=e.removeOldContent,o=void 0===i||i,a=e.allowInterruption,c=void 0!==a&&a,h=e.bypassCache,u=void 0!==h&&h,d=e.enablePrefetch,v=void 0===d||d,g=e.renderers,m=e.transitions,w=void 0===m?{default:l}:m,y=e.reloadJsFilter,C=void 0===y?function(e){return void 0!==e.dataset.taxiReload}:y,T=e.reloadCssFilter,L=void 0===T?function(e){return!0}:T;this.renderers=void 0===g?{default:f}:g,this.transitions=w,this.defaultRenderer=this.renderers.default||f,this.defaultTransition=this.transitions.default||l,this.wrapper=document.querySelector("[data-taxi]"),this.reloadJsFilter=C,this.reloadCssFilter=L,this.removeOldContent=o,this.allowInterruption=c,this.bypassCache=u,this.enablePrefetch=v,this.cache=new Map,this.isPopping=!1,this.attachEvents(n),this.currentLocation=s(window.location.href),this.cache.set(this.currentLocation.href,this.createCacheEntry(document.cloneNode(!0),window.location.href)),this.currentCacheEntry=this.cache.get(this.currentLocation.href),this.currentCacheEntry.renderer.initialLoad()}var t=e.prototype;return t.setDefaultRenderer=function(e){this.defaultRenderer=this.renderers[e]},t.setDefaultTransition=function(e){this.defaultTransition=this.transitions[e]},t.addRoute=function(e,t,r){this.router||(this.router=new d),this.router.add(e,t,r)},t.preload=function(e,t){var r=this;return void 0===t&&(t=!1),e=s(e).href,this.cache.has(e)?Promise.resolve():this.fetch(e,!1).then(function(n){try{return r.cache.set(e,r.createCacheEntry(n.html,n.url)),t&&r.cache.get(e).renderer.createDom(),Promise.resolve()}catch(e){return Promise.reject(e)}}).catch(function(e){return console.warn(e)})},t.updateCache=function(e){var t=s(e||window.location.href).href;this.cache.has(t)&&this.cache.delete(t),this.cache.set(t,this.createCacheEntry(document.cloneNode(!0),t))},t.clearCache=function(e){var t=s(e||window.location.href).href;this.cache.has(t)&&this.cache.delete(t)},t.navigateTo=function(e,t,r){var n=this;return void 0===t&&(t=!1),void 0===r&&(r=!1),new Promise(function(i,o){if(n.allowInterruption||!n.isTransitioning){n.isTransitioning=!0,n.isPopping=!0,n.targetLocation=s(e),n.popTarget=window.location.href;var a,c=new(n.chooseTransition(t))({wrapper:n.wrapper});if(n.bypassCache||!n.cache.has(n.targetLocation.href)||n.cache.get(n.targetLocation.href).skipCache){var h=n.fetch(n.targetLocation.href).then(function(e){n.cache.set(n.targetLocation.href,n.createCacheEntry(e.html,e.url)),n.cache.get(n.targetLocation.href).renderer.createDom()}).catch(function(t){window.location.href=e});a=n.beforeFetch(n.targetLocation,c,r).then(function(){try{return Promise.resolve(h.then(function(){try{return Promise.resolve(n.afterFetch(n.targetLocation,c,n.cache.get(n.targetLocation.href),r))}catch(e){return Promise.reject(e)}}))}catch(e){return Promise.reject(e)}})}else n.cache.get(n.targetLocation.href).renderer.createDom(),a=n.beforeFetch(n.targetLocation,c,r).then(function(){try{return Promise.resolve(n.afterFetch(n.targetLocation,c,n.cache.get(n.targetLocation.href),r))}catch(e){return Promise.reject(e)}});a.then(function(){i()})}else o(new Error(p))})},t.on=function(e,t){n.default.on(e,t)},t.off=function(e,t){n.default.off(e,t)},t.beforeFetch=function(e,t,r){var i=this;return n.default.emit("NAVIGATE_OUT",{from:this.currentCacheEntry,trigger:r}),new Promise(function(n){i.currentCacheEntry.renderer.leave(t,r,i.removeOldContent).then(function(){"popstate"!==r&&window.history.pushState({},"",e.raw),n()})})},t.afterFetch=function(e,t,r,i){var o=this;return this.currentLocation=e,this.popTarget=this.currentLocation.href,new Promise(function(a){r.renderer.update(),n.default.emit("NAVIGATE_IN",{from:o.currentCacheEntry,to:r,trigger:i}),o.reloadJsFilter&&o.loadScripts(r.scripts),o.reloadCssFilter&&o.loadStyles(r.styles),"popstate"!==i&&e.href!==r.finalUrl&&window.history.replaceState({},"",r.finalUrl),r.renderer.enter(t,i).then(function(){n.default.emit("NAVIGATE_END",{from:o.currentCacheEntry,to:r,trigger:i}),o.currentCacheEntry=r,o.isTransitioning=!1,o.isPopping=!1,a()})})},t.loadScripts=function(e){for(var t,r=[].concat(e),n=Array.from(document.querySelectorAll("script")).filter(this.reloadJsFilter),i=0;i<n.length;i++)for(var o=0;o<r.length;o++)if(n[i].outerHTML===r[o].outerHTML){(t=n[i]).parentNode.replaceChild(u(t),t),r.splice(o,1);break}for(var c,s=a(r);!(c=s()).done;)h(c.value)},t.loadStyles=function(e){var t=Array.from(document.querySelectorAll('link[rel="stylesheet"]')).filter(this.reloadCssFilter);e.forEach(function(e){e.href&&!t.find(function(t){return t.href===e.href})&&document.body.append(e)})},t.attachEvents=function(e){n.default.delegate("click",e,this.onClick),n.default.on("popstate",window,this.onPopstate),this.enablePrefetch&&n.default.delegate("mouseenter focus",e,this.onPrefetch)},t.fetch=function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(e,t){var r=this;if(void 0===t&&(t=!0),this.activePromises.has(e))return this.activePromises.get(e);var n=new Promise(function(n,i){var o;fetch(e,{mode:"same-origin",method:"GET",headers:{"X-Requested-With":"Taxi"},credentials:"same-origin"}).then(function(r){return r.ok||(i("Taxi encountered a non 2xx HTTP status code"),t&&(window.location.href=e)),o=r.url,r.text()}).then(function(e){var t;n({html:(t=e,"string"==typeof t?c.parseFromString(t,"text/html"):t),url:o})}).catch(function(r){i(r),t&&(window.location.href=e)}).finally(function(){r.activePromises.delete(e)})});return this.activePromises.set(e,n),n}),t.chooseTransition=function(e){var t;if(e)return this.transitions[e];var r=null==(t=this.router)?void 0:t.findMatch(this.currentLocation,this.targetLocation);return r?this.transitions[r]:this.defaultTransition},t.createCacheEntry=function(e,t){var r=e.querySelector("[data-taxi-view]"),n=r.dataset.taxiView.length?this.renderers[r.dataset.taxiView]:this.defaultRenderer;return n||console.warn('The Renderer "'+r.dataset.taxiView+'" was set in the data-taxi-view of the requested page, but not registered in Taxi.'),{page:e,content:r,finalUrl:t,skipCache:r.hasAttribute("data-taxi-nocache"),scripts:this.reloadJsFilter?Array.from(e.querySelectorAll("script")).filter(this.reloadJsFilter):[],styles:this.reloadCssFilter?Array.from(e.querySelectorAll('link[rel="stylesheet"]')).filter(this.reloadCssFilter):[],title:e.title,renderer:new n({wrapper:this.wrapper,title:e.title,content:r,page:e})}},e}();e.Core=v,e.Renderer=f,e.Transition=l});
//# sourceMappingURL=taxi.umd.js.map
