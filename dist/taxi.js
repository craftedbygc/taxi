import e from "@unseenco/e";
//#region src/helpers.js
var t = null;
function n(e) {
	return typeof e == "string" ? (t ??= new DOMParser(), t.parseFromString(e, "text/html")) : e;
}
function r(e) {
	let t = new URL(e, window.location.origin), n = t.hash.length ? e.replace(t.hash, "") : null;
	return {
		hasHash: t.hash.length > 0,
		pathname: t.pathname.replace(/\/+$/, ""),
		host: t.host,
		search: t.search,
		raw: e,
		href: n || t.href
	};
}
function i(e, t) {
	e.parentNode.replaceChild(o(e, t), e);
}
function a(e, t) {
	(e.parentNode.tagName === "HEAD" ? document.head : document.body).appendChild(o(e, t));
}
function o(e, t) {
	let n = document.createElement(t);
	for (let t = 0; t < e.attributes.length; t++) {
		let r = e.attributes[t];
		n.setAttribute(r.nodeName, r.nodeValue);
	}
	return e.innerHTML && (n.innerHTML = e.innerHTML), n;
}
//#endregion
//#region src/Transition.js
var s = class {
	constructor({ wrapper: e }) {
		this.wrapper = e;
	}
	leave(e) {
		return this.#e((e) => this.onLeave(e), e, "onLeave");
	}
	enter(e) {
		return this.#e((e) => this.onEnter(e), e, "onEnter");
	}
	#e(e, t, n) {
		return new Promise((r) => {
			let i = (e) => {
				console.error(`Taxi: Transition ${n}() failed, continuing the navigation.`, e), r();
			};
			try {
				let n = e({
					...t,
					done: r
				});
				n && typeof n.then == "function" && n.then(() => r(), i);
			} catch (e) {
				i(e);
			}
		});
	}
	onLeave({ from: e, trigger: t, done: n }) {
		n();
	}
	onEnter({ to: e, trigger: t, done: n }) {
		n();
	}
}, c = class {
	constructor({ content: e, page: t, title: n, wrapper: r }) {
		this._contentString = e.outerHTML, this._DOM = null, this.page = t, this.title = n, this.wrapper = r, this.content = this.wrapper.lastElementChild, this.trigger = !1;
	}
	onEnter() {}
	onEnterCompleted() {}
	onLeave() {}
	onLeaveCompleted() {}
	initialLoad() {
		this.trigger = "initialLoad";
	}
	update() {
		if (!this._DOM) throw Error("Taxi Renderer: update() was called before createDom(). Ensure createDom() runs first.");
		document.title = this.title, this.wrapper.appendChild(this._DOM.firstElementChild), this.content = this.wrapper.lastElementChild, this._DOM = null;
	}
	createDom() {
		this._DOM || (this._DOM = document.createElement("div"), this._DOM.innerHTML = this._contentString);
	}
	remove() {
		this.content.remove();
	}
	enter(e, t, n = null) {
		return new Promise((r) => {
			this.trigger = t, this.onEnter();
			let i = e.enter({
				trigger: t,
				to: this.content
			});
			(n ? Promise.all([i, n]) : i).then(() => {
				this.onEnterCompleted(), r();
			});
		});
	}
	leave(e, t, n) {
		return new Promise((r) => {
			this.trigger = t, this.onLeave(), e.leave({
				trigger: t,
				from: this.content
			}).then(() => {
				n && this.remove(), this.onLeaveCompleted(), r();
			});
		});
	}
}, l = class {
	data = /* @__PURE__ */ new Map();
	regexCache = /* @__PURE__ */ new Map();
	add(e, t, n) {
		this.data.has(e) || (this.data.set(e, /* @__PURE__ */ new Map()), this.regexCache.set(e, RegExp(`^${e}$`))), this.data.get(e).set(t, n), this.regexCache.set(t, RegExp(`^${t}$`));
	}
	findMatch(e, t) {
		for (let [n, r] of this.data) if (e.pathname.match(this.regexCache.get(n))) {
			for (let [e, n] of r) if (t.pathname.match(this.regexCache.get(e))) return n;
		}
		return null;
	}
}, u = "A transition is currently in progress", d = (e) => {
	e.name !== "AbortError" && console.warn(e);
}, f = class {
	isTransitioning = !1;
	cache = /* @__PURE__ */ new Map();
	#e = null;
	#t = /* @__PURE__ */ new Map();
	#n = null;
	#r = 0;
	#i = null;
	#a = null;
	#o = null;
	get currentCacheEntry() {
		return this.#e;
	}
	constructor(e = {}) {
		let { links: t = "a[href]:not([target]):not([href^=\\#]):not([data-taxi-ignore])", removeOldContent: n = !0, allowInterruption: i = !1, bypassCache: a = !1, enablePrefetch: o = "hover", enableViewTransitions: l = !1, enableAccessibility: u = !1, maxCacheSize: d = 0, fetchOptions: f = {}, renderers: p = { default: c }, transitions: m = { default: s }, reloadJsFilter: h = (e) => e.dataset.taxiReload !== void 0, reloadCssFilter: g = (e) => e.dataset.taxiReload !== void 0 } = e;
		if (this.renderers = p, this.transitions = m, this.defaultRenderer = this.renderers.default || c, this.defaultTransition = this.transitions.default || s, this.wrapper = document.querySelector("[data-taxi]"), !this.wrapper) throw Error("Taxi: no [data-taxi] wrapper element was found in the document.");
		this.reloadJsFilter = h, this.reloadCssFilter = g, this.removeOldContent = n, this.allowInterruption = i, this.bypassCache = a, this.enablePrefetch = o === !0 ? "hover" : o, this.enableViewTransitions = l, this.enableAccessibility = u, this.maxCacheSize = d, this.fetchOptions = f, this.cache = /* @__PURE__ */ new Map(), this.isPopping = !1, this.currentLocation = r(window.location.href), this.cache.set(this.currentLocation.href, this.#S(document.cloneNode(!0), window.location.href)), this.#e = this.cache.get(this.currentLocation.href), this.#d(t), this.enableAccessibility && this.#v(), this.#e.renderer.initialLoad();
	}
	setDefaultRenderer(e) {
		this.defaultRenderer = this.renderers[e];
	}
	setDefaultTransition(e) {
		this.defaultTransition = this.transitions[e];
	}
	addRoute(e, t, n) {
		this.router ||= new l(), this.router.add(e, t, n);
	}
	preload(e, t = !1) {
		return e = r(e).href, this.cache.has(e) ? Promise.resolve(this.#b(e)) : this.#g(e, !1).then(async (n) => (this.#x(e, this.#S(n.html, n.url)), t && this.cache.get(e).renderer.createDom(), this.cache.get(e)));
	}
	updateCache(e) {
		let t = r(e || window.location.href).href;
		this.cache.has(t) && this.cache.delete(t);
		let n = this.#S(document.cloneNode(!0), t);
		if (t === this.currentLocation?.href && this.#e) {
			let e = this.#e.renderer;
			e._contentString = n.content.outerHTML, e.page = n.page, e.title = n.title, n.renderer = e, this.#e = n;
		}
		this.#x(t, n), this.enablePrefetch === "visible" && this.#f();
	}
	destroy() {
		e.off("click", this.#i, this.#p), e.off("popstate", window, this.#m), this.enablePrefetch === "hover" && e.off("mouseenter focus", this.#i, this.#h), this.#a?.disconnect(), this.#a = null, this.#n?.abort(), this.#n = null, this.#o?.remove(), this.#o = null, this.cache.clear();
	}
	clearCache(e) {
		let t = r(e || window.location.href).href;
		this.cache.has(t) && this.cache.delete(t);
	}
	navigateBack() {
		if (!this.allowInterruption && this.isTransitioning) {
			console.warn(u);
			return;
		}
		window.history.back();
	}
	navigateForward() {
		if (!this.allowInterruption && this.isTransitioning) {
			console.warn(u);
			return;
		}
		window.history.forward();
	}
	navigateTo(e, t = !1, n = !1) {
		return new Promise((i, a) => {
			if (!this.allowInterruption && this.isTransitioning) {
				a(/* @__PURE__ */ Error(u));
				return;
			}
			this.#n?.abort();
			let o = ++this.#r, c = new AbortController();
			this.#n = c, this.isTransitioning = !0, this.isPopping = !0, this.targetLocation = r(e), this.popTarget = window.location.href;
			let l = this.targetLocation, d = this.enableViewTransitions && "startViewTransition" in document, f = d && !window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches, p = new (d ? s : this.#_(t))({ wrapper: this.wrapper }), m = () => {
				if (o !== this.#r) throw new DOMException("Taxi: navigation was interrupted by a newer navigation", "AbortError");
			}, h;
			if (this.bypassCache || !this.cache.has(l.href) || this.cache.get(l.href).skipCache) {
				let e = this.#g(l.href, !0, c.signal).then((e) => {
					let t;
					try {
						t = this.#S(e.html, e.url);
					} catch (e) {
						throw window.location.href = l.raw, e;
					}
					return this.#x(l.href, t), t.renderer.createDom(), t;
				});
				e.catch(() => {}), h = this.#s(l, p, n, f, m).then(() => e).then((e) => (m(), this.#c(l, p, e, n, f, o)));
			} else {
				let e = this.#b(l.href);
				e.renderer.createDom(), h = this.#s(l, p, n, f, m).then(() => (m(), this.#c(l, p, e, n, f, o)));
			}
			h.then(() => i()).catch((e) => {
				o === this.#r && (this.isTransitioning = !1, this.isPopping = !1, this.#n = null), a(e);
			});
		});
	}
	on(t, n) {
		e.on(t, n);
	}
	off(t, n) {
		e.off(t, n);
	}
	#s(t, n, r, i, a) {
		return e.emit("NAVIGATE_OUT", {
			from: this.#e,
			to: this.cache.get(t.href) || {
				page: null,
				content: null,
				finalUrl: t.href,
				skipCache: null,
				scripts: null,
				styles: null,
				title: null,
				renderer: null
			},
			trigger: r
		}), this.#e.renderer.leave(n, r, !i && this.removeOldContent).then(() => {
			a(), r !== "popstate" && window.history.pushState({}, "", t.raw);
		});
	}
	async #c(t, n, i, a, o, s) {
		this.currentLocation = t, this.popTarget = this.currentLocation.href;
		let c = null;
		if (o) {
			let e = this.#e.renderer;
			c = document.startViewTransition(() => {
				this.removeOldContent && e.remove(), i.renderer.update();
			}), await c.updateCallbackDone;
		} else i.renderer.update();
		e.emit("NAVIGATE_IN", {
			from: this.#e,
			to: i,
			trigger: a
		}), this.reloadJsFilter && this.#l(i.scripts), this.reloadCssFilter && this.#u(i.styles), a !== "popstate" && t.href !== r(i.finalUrl).href && window.history.replaceState({}, "", i.finalUrl), this.enableAccessibility && this.#y(i);
		let l = c ? c.finished.catch(() => {}) : null;
		await i.renderer.enter(n, a, l), e.emit("NAVIGATE_END", {
			from: this.#e,
			to: i,
			trigger: a
		}), this.#e = i, s === this.#r && (this.isTransitioning = !1, this.isPopping = !1, this.#n = null), this.enablePrefetch === "visible" && this.#f();
	}
	#l(e) {
		let t = [...e], n = Array.from(document.querySelectorAll("script")).filter(this.reloadJsFilter);
		for (let e = 0; e < n.length; e++) for (let r = 0; r < t.length; r++) if (n[e].outerHTML === t[r].outerHTML) {
			i(n[e], "SCRIPT"), t.splice(r, 1);
			break;
		}
		for (let e of t) a(e, "SCRIPT");
	}
	#u(e) {
		let t = Array.from(document.querySelectorAll("link[rel=\"stylesheet\"]")).filter(this.reloadCssFilter), n = Array.from(document.querySelectorAll("style")).filter(this.reloadCssFilter), r = e.filter((e) => {
			if (!e.href) return !0;
			if (!t.find((t) => t.href === e.href)) return document.body.append(e), !1;
		});
		for (let e = 0; e < n.length; e++) for (let t = 0; t < r.length; t++) if (n[e].outerHTML === r[t].outerHTML) {
			i(n[e], "STYLE"), r.splice(t, 1);
			break;
		}
		for (let e of r) a(e, "STYLE");
	}
	#d(t) {
		this.#i = t, e.delegate("click", t, this.#p), e.on("popstate", window, this.#m), this.enablePrefetch === "hover" ? e.delegate("mouseenter focus", t, this.#h) : this.enablePrefetch === "visible" && this.#f();
	}
	#f() {
		"IntersectionObserver" in window && !navigator.connection?.saveData && (this.#a ? this.#a.disconnect() : this.#a = new IntersectionObserver((e) => {
			e.forEach((e) => {
				e.isIntersecting && (this.#a.unobserve(e.target), this.preload(e.target.href).catch(() => {}));
			});
		}), document.querySelectorAll(this.#i).forEach((e) => {
			let t = r(e.href);
			t.host === window.location.host && !this.cache.has(t.href) && this.#a.observe(e);
		}));
	}
	#p = (e) => {
		if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.currentTarget.hasAttribute("download")) return;
		let t = r(e.currentTarget.href);
		if (this.currentLocation = r(window.location.href), this.currentLocation.host === t.host) {
			if (this.currentLocation.href !== t.href || this.currentLocation.hasHash && !t.hasHash) {
				e.preventDefault(), this.navigateTo(t.raw, e.currentTarget.dataset.transition || !1, e.currentTarget).catch(d);
				return;
			}
			!this.currentLocation.hasHash && !t.hasHash && e.preventDefault();
		}
	};
	#m = () => {
		let e = r(window.location.href);
		if (e.pathname === this.currentLocation.pathname && e.search === this.currentLocation.search && !this.isPopping) return !1;
		if (!this.allowInterruption && (this.isTransitioning || this.isPopping)) return window.history.pushState({}, "", this.popTarget), console.warn(u), !1;
		this.isPopping || (this.popTarget = window.location.href), this.isPopping = !0, this.navigateTo(window.location.href, !1, "popstate").catch(d);
	};
	#h = (e) => {
		if (this.isTransitioning) return;
		let t = r(e.currentTarget.href);
		this.currentLocation.host === t.host && this.preload(e.currentTarget.href, !1).catch(() => {});
	};
	#g(e, t = !0, r = void 0) {
		if (this.#t.has(e)) return this.#t.get(e);
		r?.addEventListener("abort", () => {
			this.#t.get(e) === i && this.#t.delete(e);
		});
		let i = new Promise((a, o) => {
			let s;
			fetch(e, {
				mode: "same-origin",
				method: "GET",
				credentials: "same-origin",
				...this.fetchOptions,
				headers: {
					"X-Requested-With": "Taxi",
					...this.fetchOptions.headers
				},
				signal: r
			}).then((n) => {
				if (!n.ok) {
					o(/* @__PURE__ */ Error("Taxi encountered a non 2xx HTTP status code")), t && (window.location.href = e);
					return;
				}
				return s = n.url, n.text();
			}).then((e) => {
				e !== void 0 && a({
					html: n(e),
					url: s
				});
			}).catch((n) => {
				o(n), t && n.name !== "AbortError" && (window.location.href = e);
			}).finally(() => {
				this.#t.get(e) === i && this.#t.delete(e);
			});
		});
		return this.#t.set(e, i), i;
	}
	#_(e) {
		if (e) return this.transitions[e] ? this.transitions[e] : (console.warn(`Taxi: transition "${e}" is not registered. Falling back to default.`), this.defaultTransition);
		let t = this.router?.findMatch(this.currentLocation, this.targetLocation);
		return t ? this.transitions[t] ? this.transitions[t] : (console.warn(`Taxi: route transition "${t}" is not registered. Falling back to default.`), this.defaultTransition) : this.defaultTransition;
	}
	#v() {
		this.#o = document.createElement("div"), this.#o.setAttribute("data-taxi-announcer", ""), this.#o.setAttribute("aria-live", "assertive"), this.#o.setAttribute("aria-atomic", "true"), this.#o.style.cssText = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0", document.body.appendChild(this.#o);
	}
	#y(e) {
		this.#o && (this.#o.textContent = e.title || document.title);
		let t = e.renderer.content, n = t.querySelector("h1") || t;
		n.hasAttribute("tabindex") || n.setAttribute("tabindex", "-1"), n.focus({ preventScroll: !0 });
	}
	#b(e) {
		let t = this.cache.get(e);
		return this.cache.delete(e), this.cache.set(e, t), t;
	}
	#x(e, t) {
		if (this.maxCacheSize > 0 && !this.cache.has(e) && this.cache.size >= this.maxCacheSize) {
			for (let e of this.cache.keys()) if (e !== this.currentLocation?.href) {
				this.cache.delete(e);
				break;
			}
		}
		this.cache.set(e, t);
	}
	#S(e, t) {
		let n = e.querySelector("[data-taxi-view]");
		if (!n) throw Error(`Taxi: the fetched page for "${t}" does not contain a [data-taxi-view] element.`);
		let r = n.dataset.taxiView.length ? this.renderers[n.dataset.taxiView] : this.defaultRenderer;
		return r || console.warn(`Taxi: the renderer "${n.dataset.taxiView}" is set in [data-taxi-view] but was not registered.`), {
			page: e,
			content: n,
			finalUrl: t,
			skipCache: n.hasAttribute("data-taxi-nocache"),
			scripts: this.reloadJsFilter ? Array.from(e.querySelectorAll("script")).filter(this.reloadJsFilter) : [],
			styles: this.reloadCssFilter ? Array.from(e.querySelectorAll("link[rel=\"stylesheet\"], style")).filter(this.reloadCssFilter) : [],
			title: e.title,
			renderer: new (r || this.defaultRenderer)({
				wrapper: this.wrapper,
				title: e.title,
				content: n,
				page: e
			})
		};
	}
};
//#endregion
export { f as Core, c as Renderer, s as Transition };

//# sourceMappingURL=taxi.js.map