/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");


/***/ }),

/***/ "./node_modules/@unseenco/e/src/e.js":
/*!*******************************************!*\
  !*** ./node_modules/@unseenco/e/src/e.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var selector_set__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! selector-set */ "./node_modules/selector-set/selector-set.next.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./node_modules/@unseenco/e/src/utils.js");



/**
 * Public API
 */
class E {
    /**
     * Binds all provided methods to a provided context.
     *
     * @param {object} context
     * @param {string[]} [methods] Optional.
     */
    bindAll(context, methods) {
        if (!methods) {
            methods = Object.getOwnPropertyNames(Object.getPrototypeOf(context))
        }

        for (let i = 0; i < methods.length; i++) {
            context[methods[i]] = context[methods[i]].bind(context)
        }
    }

    /**
	 * Bind event to a string, NodeList, or element.
	 *
	 * @param {string} event
	 * @param {string|NodeList|HTMLElement|Element|Window|Document|array|function} el
	 * @param {*} [callback]
	 * @param {{}|boolean} [options]
	 */
    on(event, el, callback, options) {
		const events =  event.split(' ')

        for (let i = 0; i < events.length; i++) {
			if (typeof el === 'function' && callback === undefined) {
				(0,_utils__WEBPACK_IMPORTED_MODULE_1__.makeBusStack)(events[i])
				_utils__WEBPACK_IMPORTED_MODULE_1__.listeners[events[i]].push(el)
				continue
			}

            if (el.nodeType && el.nodeType === 1 || el === window || el === document) {
                el.addEventListener(events[i], callback, options)
                continue
            }

            el = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.maybeRunQuerySelector)(el)

            for (let n = 0; n < el.length; n++) {
                el[n].addEventListener(events[i], callback, options)
            }
        }
    }

    /**
     * Add a delegated event.
     *
     * @param {string} event
     * @param {string|NodeList|HTMLElement|Element} delegate
     * @param {*} [callback]
     */
    delegate(event, delegate, callback) {
        const events =  event.split(' ')

        for (let i = 0; i < events.length; i++) {
            let map = _utils__WEBPACK_IMPORTED_MODULE_1__.eventTypes[events[i]]

            if (map === undefined) {
                map = new selector_set__WEBPACK_IMPORTED_MODULE_0__["default"]()
                _utils__WEBPACK_IMPORTED_MODULE_1__.eventTypes[events[i]] = map

                if (_utils__WEBPACK_IMPORTED_MODULE_1__.nonBubblers.indexOf(events[i]) !== -1) {
                    document.addEventListener(events[i], _utils__WEBPACK_IMPORTED_MODULE_1__.handleDelegation, true)
                } else {
                    document.addEventListener(events[i], _utils__WEBPACK_IMPORTED_MODULE_1__.handleDelegation)
                }
            }

            map.add(delegate, callback)
        }
    }

    /**
     * Remove a callback from a DOM element, or one or all Bus events.
     *
     * @param {string} event
     * @param {string|NodeList|HTMLElement|Element|window|Undefined} [el]
     * @param {*} [callback]
	 * @param {{}|boolean} [options]
     */
    off(event, el, callback, options) {
        const events =  event.split(' ')

        for (let i = 0; i < events.length; i++) {
			if (el === undefined) {
				_utils__WEBPACK_IMPORTED_MODULE_1__.listeners[events[i]] = []
				continue
			}

			if (typeof el === 'function') {
				(0,_utils__WEBPACK_IMPORTED_MODULE_1__.makeBusStack)(events[i])

				for (let n = 0; n < _utils__WEBPACK_IMPORTED_MODULE_1__.listeners[events[i]].length; n++) {
					if (_utils__WEBPACK_IMPORTED_MODULE_1__.listeners[events[i]][n] === el) {
						_utils__WEBPACK_IMPORTED_MODULE_1__.listeners[events[i]].splice(n, 1)
					}
				}
				continue
			}

            const map = _utils__WEBPACK_IMPORTED_MODULE_1__.eventTypes[events[i]]

            if (map !== undefined) {
                map.remove(el, callback)

                if (map.size === 0) {
                    delete _utils__WEBPACK_IMPORTED_MODULE_1__.eventTypes[events[i]]

					if (_utils__WEBPACK_IMPORTED_MODULE_1__.nonBubblers.indexOf(events[i]) !== -1) {
						document.removeEventListener(events[i], _utils__WEBPACK_IMPORTED_MODULE_1__.handleDelegation, true)
					} else {
						document.removeEventListener(events[i], _utils__WEBPACK_IMPORTED_MODULE_1__.handleDelegation)
					}
                    continue
                }
            }

            if (el.removeEventListener !== undefined) {
                el.removeEventListener(events[i], callback, options)
                continue
            }

            el = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.maybeRunQuerySelector)(el)

            for (let n = 0; n < el.length;n++) {
                el[n].removeEventListener(events[i], callback, options)
            }
        }
    }

    /**
     * Emit a DOM or Bus event.
     *
     * @param {string} event
     * @param {...*} args
     */
    emit(event, ...args) {
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.triggerBus)(event, args)
    }

    /**
     * Return a clone of the delegated event stack for debugging.
     *
     * @returns {{}}
     */
    debugDelegated() {
        return (0,_utils__WEBPACK_IMPORTED_MODULE_1__.clone)(_utils__WEBPACK_IMPORTED_MODULE_1__.eventTypes)
    }

    /**
     * Return a clone of the bus event stack for debugging.
     *
     * @returns {array}
     */
    debugBus() {
        return (0,_utils__WEBPACK_IMPORTED_MODULE_1__.clone)(_utils__WEBPACK_IMPORTED_MODULE_1__.listeners)
    }
}

const instance = new E()
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (instance);


/***/ }),

/***/ "./node_modules/@unseenco/e/src/utils.js":
/*!***********************************************!*\
  !*** ./node_modules/@unseenco/e/src/utils.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "eventTypes": () => (/* binding */ eventTypes),
/* harmony export */   "listeners": () => (/* binding */ listeners),
/* harmony export */   "nonBubblers": () => (/* binding */ nonBubblers),
/* harmony export */   "makeBusStack": () => (/* binding */ makeBusStack),
/* harmony export */   "triggerBus": () => (/* binding */ triggerBus),
/* harmony export */   "maybeRunQuerySelector": () => (/* binding */ maybeRunQuerySelector),
/* harmony export */   "handleDelegation": () => (/* binding */ handleDelegation),
/* harmony export */   "clone": () => (/* binding */ clone)
/* harmony export */ });
/**
 * Holds the SelectorSets for each event type
 * @type {{}}
 */
const eventTypes = {}

/**
 * Holds Bus event stacks
 * @type {{}}
 */
const listeners = {}

/**
 * Events that don't bubble
 * @type {string[]}
 */
const nonBubblers = ['mouseenter', 'mouseleave', 'pointerenter', 'pointerleave']

/**
 * Make a bus stack if not already created.
 *
 * @param {string} event
 */
function makeBusStack(event) {
    if (listeners[event] === undefined) {
        listeners[event] = []
    }
}

/**
 * Trigger a bus stack.
 *
 * @param {string} event
 * @param args
 */
function triggerBus(event, args) {
    if (listeners[event]) {
        for (let i = 0; i < listeners[event].length; i++) {
            listeners[event][i](...args)
        }
    }
}

/**
 * Maybe run querySelectorAll if input is a string.
 *
 * @param {HTMLElement|Element|string} el
 * @returns {NodeListOf<Element>}
 */
function maybeRunQuerySelector(el) {
    return typeof el === 'string' ? document.querySelectorAll(el) : el
}

/**
 * Handle delegated events
 *
 * @param {Event} e
 */
function handleDelegation(e) {
    let matches = traverse(eventTypes[e.type], e.target)

    if (matches.length) {
        for (let i = 0; i < matches.length; i++) {
            for (let i2 = 0; i2 < matches[i].stack.length; i2++) {
                if (nonBubblers.indexOf(e.type) !== -1) {
                    addDelegateTarget(e, matches[i].delegatedTarget)
                    if (e.target === matches[i].delegatedTarget) {
                        matches[i].stack[i2].data(e)
                    }
                } else {
                    addDelegateTarget(e, matches[i].delegatedTarget)
                    matches[i].stack[i2].data(e)
                }
            }
        }
    }
}

/**
 * Find a matching selector for delegation
 *
 * @param {SelectorSet} listeners
 * @param {HTMLElement|Element|EventTarget} target
 * @returns {[]}
 */
function traverse(listeners, target) {
    const queue = []
    let node = target

    do {
        if (node.nodeType !== 1) {
            break
        }

        const matches = listeners.matches(node)

        if (matches.length) {
            queue.push({delegatedTarget: node, stack: matches})
        }
    } while ((node = node.parentElement))

    return queue
}

/**
 * Add delegatedTarget attribute to dispatched delegated events
 *
 * @param {Event} event
 * @param {HTMLElement|Element} delegatedTarget
 */
function addDelegateTarget(event, delegatedTarget) {
    Object.defineProperty(event, 'currentTarget', {
        configurable: true,
        enumerable: true,
		get: () => delegatedTarget
    })
}

/**
 * Creates a deep clone of an object.
 *
 * @param object
 * @returns {object|array}
 */
function clone(object) {
	return JSON.parse(JSON.stringify(object))
}




/***/ }),

/***/ "./src/Core.js":
/*!*********************!*\
  !*** ./src/Core.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Core)
/* harmony export */ });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _unseenco_e__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @unseenco/e */ "./node_modules/@unseenco/e/src/e.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
/* harmony import */ var _taxi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./taxi */ "./src/taxi.js");
/* harmony import */ var _RouteStore__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./RouteStore */ "./src/RouteStore.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





/**
 * @typedef CacheEntry
 * @type {object}
 * @property {Renderer} renderer
 * @property {Document|Node} page
 * @property {array} scripts
 * @property {string} title
 * @property {HTMLElement|Element} content
 */

var Core = /*#__PURE__*/function () {
  /**
   * @type {CacheEntry|null}
   */

  /**
   * @type {Map<string, CacheEntry>}
   */

  /**
   * @param {string} [parameters.links] Selector to select elements attach highway link events to
   * @param {Object.<string, Renderer>} [parameters.renderers] All Renderers for the application
   * @param {Object.<string, Transition>} [parameters.transitions] All Transitions for the application
   * @param {function(node: HTMLElement)} [parameters.reloadJsFilter]
   */
  function Core() {
    var _this = this;

    var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Core);

    _defineProperty(this, "isTransitioning", false);

    _defineProperty(this, "currentCacheEntry", null);

    _defineProperty(this, "cache", new Map());

    _defineProperty(this, "onClick", function (e) {
      if (!(e.metaKey || e.ctrlKey)) {
        var target = (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.processUrl)(e.currentTarget.href);
        _this.currentLocation = (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.processUrl)(window.location.href); // the target is a new URL, or is removing the hash from the current URL

        if (_this.currentLocation.href !== target.href || _this.currentLocation.hasHash && !target.hasHash) {
          e.preventDefault(); // noinspection JSIgnoredPromiseFromCall

          _this.navigateTo(target.raw, e.currentTarget.dataset.taxiTransition || false, e.currentTarget);

          return;
        } // a click to the current URL was detected


        if (!_this.currentLocation.hasHash && !target.hasHash) {
          e.preventDefault();
        }
      }
    });

    _defineProperty(this, "onPopstate", function () {
      // don't trigger for on-page anchors
      if (window.location.pathname === _this.currentLocation.pathname) {
        return false;
      }

      if (_this.isTransitioning) {
        // overwrite history state with current page if currently navigating
        window.history.pushState({}, '', _this.currentLocation.href);
        return false;
      } // noinspection JSIgnoredPromiseFromCall


      _this.navigateTo(window.location.href, false, 'popstate');
    });

    var _parameters$links = parameters.links,
        links = _parameters$links === void 0 ? 'a:not([target]):not([href^=\\#]):not([data-taxi-ignore])' : _parameters$links,
        _parameters$renderers = parameters.renderers,
        renderers = _parameters$renderers === void 0 ? {
      "default": _taxi__WEBPACK_IMPORTED_MODULE_3__.Renderer
    } : _parameters$renderers,
        _parameters$transitio = parameters.transitions,
        transitions = _parameters$transitio === void 0 ? {
      "default": _taxi__WEBPACK_IMPORTED_MODULE_3__.Transition
    } : _parameters$transitio,
        _parameters$reloadJsF = parameters.reloadJsFilter,
        reloadJsFilter = _parameters$reloadJsF === void 0 ? function (node) {
      return !((node === null || node === void 0 ? void 0 : node.id) === '__bs_script__' || node !== null && node !== void 0 && node.src.includes('browser-sync-client.js'));
    } : _parameters$reloadJsF;
    this.renderers = renderers;
    this.transitions = transitions;
    this.defaultRenderer = this.renderers["default"] || _taxi__WEBPACK_IMPORTED_MODULE_3__.Renderer;
    this.defaultTransition = this.transitions["default"] || _taxi__WEBPACK_IMPORTED_MODULE_3__.Transition;
    this.wrapper = document.querySelector('[data-taxi]');
    this.reloadJsFilter = reloadJsFilter;
    this.cache = new Map(); // Add delegated link events

    this.attachEvents(links);
    this.currentLocation = (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.processUrl)(window.location.href); // as this is the initial page load, prime this page into the cache

    this.cache.set(this.currentLocation.href, this.createCacheEntry(document.cloneNode(true))); // fire the current Renderer enter methods

    this.currentCacheEntry = this.cache.get(this.currentLocation.href);
    this.currentCacheEntry.renderer.initialLoad();
  }
  /**
   * @param {string} renderer
   */


  _createClass(Core, [{
    key: "setDefaultRenderer",
    value: function setDefaultRenderer(renderer) {
      this.defaultRenderer = this.renderers[renderer];
    }
    /**
     * @param {string} transition
     */

  }, {
    key: "setDefaultTransition",
    value: function setDefaultTransition(transition) {
      this.defaultTransition = this.transitions[transition];
    }
  }, {
    key: "addRoute",
    value: function addRoute(fromPattern, toPattern, transition) {
      if (!this.router) {
        this.router = new _RouteStore__WEBPACK_IMPORTED_MODULE_4__["default"]();
      }

      this.router.add(fromPattern, toPattern, transition);
    }
    /**
     * Prime the cache for a given URL
     *
     * @param {string} url
     * @return {Core}
     */

  }, {
    key: "preload",
    value: function preload(url) {
      var _this2 = this;

      // convert relative URLs to absolute
      url = (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.processUrl)(url).href;

      if (!this.cache.has(url)) {
        this.fetch(url).then( /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee(newPage) {
            return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _this2.cache.set(url, _this2.createCacheEntry(newPage));

                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          return function (_x2) {
            return _ref.apply(this, arguments);
          };
        }());
      }

      return this;
    }
    /**
     * @param {string} url
     * @param {string|false} [transition]
     * @param {string|false|HTMLElement} [trigger]
     * @return {Promise<void|Error>}
     */

  }, {
    key: "navigateTo",
    value: function navigateTo(url) {
      var _this3 = this;

      var transition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var trigger = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      this.targetLocation = (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.processUrl)(url);
      return new Promise(function (resolve, reject) {
        // Don't allow multiple navigations to occur at once
        if (_this3.isTransitioning) {
          reject(new Error('A transition is currently in progress'));
          return;
        }

        var TransitionClass = new (_this3.chooseTransition(transition))({
          wrapper: _this3.wrapper
        });

        _this3.beforeFetch(_this3.targetLocation, TransitionClass, trigger).then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee3() {
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (!_this3.cache.has(_this3.targetLocation.href)) {
                    _context3.next = 6;
                    break;
                  }

                  _context3.next = 3;
                  return _this3.afterFetch(_this3.targetLocation, TransitionClass, _this3.cache.get(_this3.targetLocation.href), trigger);

                case 3:
                  return _context3.abrupt("return", _context3.sent);

                case 6:
                  return _context3.abrupt("return", _this3.fetch(_this3.targetLocation.raw).then( /*#__PURE__*/function () {
                    var _ref3 = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2(newPage) {
                      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              _context2.next = 2;
                              return _this3.afterFetch(_this3.targetLocation, TransitionClass, _this3.createCacheEntry(newPage), trigger);

                            case 2:
                              return _context2.abrupt("return", _context2.sent);

                            case 3:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      }, _callee2);
                    }));

                    return function (_x3) {
                      return _ref3.apply(this, arguments);
                    };
                  }()));

                case 7:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }))).then(function () {
          resolve();
        });
      });
    }
    /**
     * Add an event listener.
     * @param {string} event
     * @param {any} callback
     */

  }, {
    key: "on",
    value: function on(event, callback) {
      _unseenco_e__WEBPACK_IMPORTED_MODULE_1__["default"].on(event, callback);
    }
    /**
     * Remove an event listener.
     * @param {string} event
     * @param {any} callback
     */

  }, {
    key: "off",
    value: function off(event, callback) {
      _unseenco_e__WEBPACK_IMPORTED_MODULE_1__["default"].off(event, callback);
    }
    /**
     * @private
     * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} url
     * @param {Transition} TransitionClass
     * @param {string|HTMLElement|false} trigger
     * @return {Promise<void>}
     */

  }, {
    key: "beforeFetch",
    value: function beforeFetch(url, TransitionClass, trigger) {
      var _this4 = this;

      this.isTransitioning = true;
      _unseenco_e__WEBPACK_IMPORTED_MODULE_1__["default"].emit('NAVIGATE_OUT', {
        from: this.currentCacheEntry,
        trigger: trigger
      });
      return new Promise(function (resolve) {
        _this4.currentCacheEntry.renderer.leave(TransitionClass, trigger).then(function () {
          if (trigger !== 'popstate') {
            window.history.pushState({}, '', url.raw);
          }

          resolve();
        });
      });
    }
    /**
     * @private
     * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} url
     * @param {Transition} TransitionClass
     * @param {CacheEntry} entry
     * @param {string|HTMLElement|false} trigger
     * @return {Promise<void>}
     */

  }, {
    key: "afterFetch",
    value: function afterFetch(url, TransitionClass, entry, trigger) {
      var _this5 = this;

      // add this page to cache
      if (!this.cache.has(url.href)) {
        this.cache.set(url.href, entry);
      }

      this.currentLocation = url;
      _unseenco_e__WEBPACK_IMPORTED_MODULE_1__["default"].emit('NAVIGATE_IN', {
        from: this.currentCacheEntry,
        to: entry,
        trigger: trigger
      });
      return new Promise(function (resolve) {
        entry.renderer.update();

        _this5.loadScripts(entry.scripts);

        entry.renderer.enter(TransitionClass, trigger).then(function () {
          _unseenco_e__WEBPACK_IMPORTED_MODULE_1__["default"].emit('NAVIGATE_END', {
            from: _this5.currentCacheEntry,
            to: entry,
            trigger: trigger
          });
          _this5.currentCacheEntry = entry;
          _this5.isTransitioning = false;
          resolve();
        });
      });
    }
    /**
     * Load up scripts from the target page if needed
     *
     * @param {HTMLElement[]} cachedScripts
     */

  }, {
    key: "loadScripts",
    value: function loadScripts(cachedScripts) {
      var newScripts = _toConsumableArray(cachedScripts);

      var currentScripts = _toConsumableArray(document.querySelectorAll('script:not([data-no-reload])')).filter(this.reloadJsFilter); // loop through all new scripts


      for (var i = 0; i < currentScripts.length; i++) {
        for (var n = 0; n < newScripts.length; n++) {
          if (currentScripts[i].outerHTML === newScripts[n].outerHTML) {
            (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.reloadScript)(currentScripts[i]);
            newScripts.splice(n, 1);
            break;
          }
        }
      }

      var _iterator = _createForOfIteratorHelper(newScripts),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var script = _step.value;
          (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.appendScript)(script);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    /**
     * @private
     * @param {string} links
     */

  }, {
    key: "attachEvents",
    value: function attachEvents(links) {
      _unseenco_e__WEBPACK_IMPORTED_MODULE_1__["default"].delegate('click', links, this.onClick);
      _unseenco_e__WEBPACK_IMPORTED_MODULE_1__["default"].on('popstate', window, this.onPopstate);
    }
    /**
     * @private
     * @param {MouseEvent} e
     */

  }, {
    key: "fetch",
    value: function (_fetch) {
      function fetch(_x) {
        return _fetch.apply(this, arguments);
      }

      fetch.toString = function () {
        return _fetch.toString();
      };

      return fetch;
    }(
    /**
     * @private
     * @param {string} url
     * @return {Promise<Document>}
     */
    function (url) {
      return new Promise(function (resolve) {
        fetch(url, {
          mode: 'same-origin',
          method: 'GET',
          headers: {
            'X-Requested-With': 'Taxi'
          },
          credentials: 'same-origin'
        }).then(function (response) {
          if (!response.ok) {
            console.warn('Taxi encountered a non 2xx HTTP status code');
            window.location.href = url;
          }

          return response.text();
        }).then(function (htmlString) {
          resolve((0,_helpers__WEBPACK_IMPORTED_MODULE_2__.parseDom)(htmlString));
        })["catch"](function (err) {
          console.warn(err);
          window.location.href = url;
        });
      });
    }
    /**
     * @private
     * @param {string|false} transition
     * @return {Transition|function}
     */
    )
  }, {
    key: "chooseTransition",
    value: function chooseTransition(transition) {
      var _this$router;

      if (transition) {
        return this.transitions[transition];
      }

      var routeTransition = (_this$router = this.router) === null || _this$router === void 0 ? void 0 : _this$router.findMatch(this.currentLocation, this.targetLocation);

      if (routeTransition) {
        return this.transitions[routeTransition];
      }

      return this.defaultTransition;
    }
    /**
     * @private
     * @param {Document|Node} page
     * @return {CacheEntry}
     */

  }, {
    key: "createCacheEntry",
    value: function createCacheEntry(page) {
      var content = page.querySelector('[data-taxi-view]');
      var Renderer = content.dataset.taxiView.length ? this.renderers[content.dataset.taxiView] : this.defaultRenderer;
      return {
        page: page,
        content: content,
        scripts: _toConsumableArray(page.querySelectorAll('script:not([data-no-reload])')).filter(this.reloadJsFilter),
        title: page.title,
        renderer: new Renderer({
          wrapper: this.wrapper,
          title: page.title,
          content: content,
          page: page
        })
      };
    }
  }]);

  return Core;
}();



/***/ }),

/***/ "./src/Renderer.js":
/*!*************************!*\
  !*** ./src/Renderer.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Renderer)
/* harmony export */ });
/* harmony import */ var _Transition__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Transition */ "./src/Transition.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }



var Renderer = /*#__PURE__*/function () {
  /**
   * @param {{content: HTMLElement|Element, page: Document|Node, title: string, wrapper: Element}} props
   */
  function Renderer(_ref) {
    var content = _ref.content,
        page = _ref.page,
        title = _ref.title,
        wrapper = _ref.wrapper;

    _classCallCheck(this, Renderer);

    this._contentString = content.outerHTML;
    this.page = page;
    this.title = title;
    this.wrapper = wrapper;
    this.content = this.wrapper.lastElementChild;
  }

  _createClass(Renderer, [{
    key: "onEnter",
    value: function onEnter() {}
  }, {
    key: "onEnterCompleted",
    value: function onEnterCompleted() {}
  }, {
    key: "onLeave",
    value: function onLeave() {}
  }, {
    key: "onLeaveCompleted",
    value: function onLeaveCompleted() {}
  }, {
    key: "initialLoad",
    value: function initialLoad() {
      this.onEnter();
      this.onEnterCompleted();
    }
  }, {
    key: "update",
    value: function update() {
      document.title = this.title;
      this.wrapper.insertAdjacentHTML('beforeend', this._contentString);
      this.content = this.wrapper.lastElementChild;
    }
  }, {
    key: "remove",
    value: function remove() {
      this.wrapper.firstElementChild.remove();
    }
    /**
     * Called when transitioning into the current page.
     * @param {Transition} transition
     * @param {string|HTMLElement|false} trigger
     * @return {Promise<null>}
     */

  }, {
    key: "enter",
    value: function enter(transition, trigger) {
      var _this = this;

      return new Promise(function (resolve) {
        _this.onEnter();

        transition.enter({
          trigger: trigger,
          to: _this.content
        }).then(function () {
          _this.onEnterCompleted();

          resolve();
        });
      });
    }
    /**
     * Called when transitioning away from the current page.
     * @param {Transition} transition
     * @param {string|HTMLElement|false} trigger
     * @return {Promise<null>}
     */

  }, {
    key: "leave",
    value: function leave(transition, trigger) {
      var _this2 = this;

      return new Promise(function (resolve) {
        _this2.onLeave();

        transition.leave({
          trigger: trigger,
          from: _this2.content
        }).then(function () {
          _this2.remove();

          _this2.onLeaveCompleted();

          resolve();
        });
      });
    }
  }]);

  return Renderer;
}();



/***/ }),

/***/ "./src/RouteStore.js":
/*!***************************!*\
  !*** ./src/RouteStore.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RouteStore)
/* harmony export */ });
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var RouteStore = /*#__PURE__*/function () {
  function RouteStore() {
    _classCallCheck(this, RouteStore);

    _defineProperty(this, "data", new Map());

    _defineProperty(this, "regexCache", new Map());
  }

  _createClass(RouteStore, [{
    key: "add",
    value:
    /**
     *
     * @param {string} fromPattern
     * @param {string} toPattern
     * @param {string} transition
     */
    function add(fromPattern, toPattern, transition) {
      if (!this.data.has(fromPattern)) {
        this.data.set(fromPattern, new Map());
        this.regexCache.set(fromPattern, new RegExp("^".concat(fromPattern, "$")));
      }

      this.data.get(fromPattern).set(toPattern, transition);
      this.regexCache.set(toPattern, new RegExp("^".concat(toPattern, "$")));
    }
    /**
     *
     * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} currentUrl
     * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} nextUrl
     * @return {string|null}
     */

  }, {
    key: "findMatch",
    value: function findMatch(currentUrl, nextUrl) {
      // Loop through all from patterns
      var _iterator = _createForOfIteratorHelper(this.data),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
              fromPattern = _step$value[0],
              potentialMatches = _step$value[1];

          // If we have a match
          if (currentUrl.pathname.match(this.regexCache.get(fromPattern))) {
            // loop through all associated to patterns
            var _iterator2 = _createForOfIteratorHelper(potentialMatches),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var _step2$value = _slicedToArray(_step2.value, 2),
                    toPattern = _step2$value[0],
                    transition = _step2$value[1];

                // If we find a match, return it
                if (nextUrl.pathname.match(this.regexCache.get(toPattern))) {
                  return transition;
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }

            break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return null;
    }
  }]);

  return RouteStore;
}();



/***/ }),

/***/ "./src/Transition.js":
/*!***************************!*\
  !*** ./src/Transition.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Transition)
/* harmony export */ });
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Transition = /*#__PURE__*/function () {
  /**
   * @param {{wrapper: HTMLElement}} props
   */
  function Transition(_ref) {
    var wrapper = _ref.wrapper;

    _classCallCheck(this, Transition);

    this.wrapper = wrapper;
  }
  /**
   * @param {{ from: HTMLElement, trigger: string|HTMLElement|false }} props
   * @return {Promise<void>}
   */


  _createClass(Transition, [{
    key: "leave",
    value: function leave(props) {
      var _this = this;

      return new Promise(function (resolve) {
        _this.onLeave(_objectSpread(_objectSpread({}, props), {}, {
          done: resolve
        }));
      });
    }
    /**
     * @param {{ to: HTMLElement, trigger: string|HTMLElement|false }} props
     * @return {Promise<void>}
     */

  }, {
    key: "enter",
    value: function enter(props) {
      var _this2 = this;

      return new Promise(function (resolve) {
        _this2.onEnter(_objectSpread(_objectSpread({}, props), {}, {
          done: resolve
        }));
      });
    }
    /**
     * Handle the transition leaving the previous page.
     * @param {{from: HTMLElement, trigger: string|HTMLElement|false, done: function}} props
     */

  }, {
    key: "onLeave",
    value: function onLeave(_ref2) {
      var from = _ref2.from,
          trigger = _ref2.trigger,
          done = _ref2.done;
      done();
    }
    /**
     * Handle the transition entering the next page.
     * @param {{to: HTMLElement, trigger: string|HTMLElement|false, done: function}} props
     */

  }, {
    key: "onEnter",
    value: function onEnter(_ref3) {
      var to = _ref3.to,
          trigger = _ref3.trigger,
          done = _ref3.done;
      done();
    }
  }]);

  return Transition;
}();



/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parseDom": () => (/* binding */ parseDom),
/* harmony export */   "processUrl": () => (/* binding */ processUrl),
/* harmony export */   "reloadScript": () => (/* binding */ reloadScript),
/* harmony export */   "appendScript": () => (/* binding */ appendScript),
/* harmony export */   "duplicateScript": () => (/* binding */ duplicateScript)
/* harmony export */ });
var parser = new DOMParser();
/**
 * Parse a HTML string into a proper Document.
 * @param {string|Document} html
 * @return {Document|*}
 */

function parseDom(html) {
  return typeof html === 'string' ? parser.parseFromString(html, 'text/html') : html;
}
/**
 * Extract details from a given URL string. Assumed to be on the current TLD.
 * @param {string} url
 * @return {{raw: string, href: string, hasHash: boolean, pathname: string}}
 */

function processUrl(url) {
  var details = new URL(url, window.location.origin);
  var normalized = null;

  if (details.hash.length) {
    normalized = url.replace(details.hash, '');
  }

  return {
    hasHash: details.hash.length > 0,
    pathname: details.pathname,
    raw: url,
    href: normalized || details.href
  };
}
/**
 * Reloads a provided script/stylesheet by replacing with itself.
 * @param {HTMLElement} node
 */

function reloadScript(node) {
  node.parentNode.replaceChild(duplicateScript(node), node);
}
/**
 * Loads a provided script/stylesheet by appending a clone to the current document.
 * @param {HTMLElement} node
 */

function appendScript(node) {
  if (node.parentNode.tagName === 'HEAD') {
    document.head.appendChild(duplicateScript(node));
  } else {
    document.body.appendChild(duplicateScript(node));
  }
}
/**
 * Creates a clone of a given HTMLElement
 * @param {HTMLElement} node
 * @return {HTMLElement}
 */

function duplicateScript(node) {
  var replacement = document.createElement('SCRIPT'); // Loop Over Attributes

  for (var k = 0; k < node.attributes.length; k++) {
    // Get Attribute
    var attr = node.attributes[k]; // Set Attribute

    replacement.setAttribute(attr.nodeName, attr.nodeValue);
  } // Inline Script


  if (node.innerHTML) {
    replacement.innerHTML = node.innerHTML;
  }

  return replacement;
}

/***/ }),

/***/ "./src/taxi.js":
/*!*********************!*\
  !*** ./src/taxi.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Core": () => (/* reexport safe */ _Core__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "Renderer": () => (/* reexport safe */ _Renderer__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "Transition": () => (/* reexport safe */ _Transition__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _Core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Core */ "./src/Core.js");
/* harmony import */ var _Renderer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Renderer */ "./src/Renderer.js");
/* harmony import */ var _Transition__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Transition */ "./src/Transition.js");





/***/ }),

/***/ "./tests/renderers/DefaultRenderer.js":
/*!********************************************!*\
  !*** ./tests/renderers/DefaultRenderer.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DefaultRenderer)
/* harmony export */ });
/* harmony import */ var _src_taxi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/taxi */ "./src/taxi.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var DefaultRenderer = /*#__PURE__*/function (_Renderer) {
  _inherits(DefaultRenderer, _Renderer);

  var _super = _createSuper(DefaultRenderer);

  function DefaultRenderer() {
    _classCallCheck(this, DefaultRenderer);

    return _super.apply(this, arguments);
  }

  _createClass(DefaultRenderer, [{
    key: "onEnter",
    value: function onEnter() {
      console.log('view on enter', this.content);
    }
  }, {
    key: "onEnterCompleted",
    value: function onEnterCompleted() {
      console.log('view on enter completed', this.content);
    }
  }, {
    key: "onLeave",
    value: function onLeave() {
      console.log('view on leave', this.content);
    }
  }, {
    key: "onLeaveCompleted",
    value: function onLeaveCompleted() {
      console.log('view on leave completed', this.content);
    }
  }]);

  return DefaultRenderer;
}(_src_taxi__WEBPACK_IMPORTED_MODULE_0__.Renderer); // todo promisify?




/***/ }),

/***/ "./tests/transitions/DefaultTransition.js":
/*!************************************************!*\
  !*** ./tests/transitions/DefaultTransition.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DefaultTransition)
/* harmony export */ });
/* harmony import */ var _src_taxi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/taxi */ "./src/taxi.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var DefaultTransition = /*#__PURE__*/function (_Transition) {
  _inherits(DefaultTransition, _Transition);

  var _super = _createSuper(DefaultTransition);

  function DefaultTransition() {
    _classCallCheck(this, DefaultTransition);

    return _super.apply(this, arguments);
  }

  _createClass(DefaultTransition, [{
    key: "onLeave",
    value: function onLeave(_ref) {
      var from = _ref.from,
          trigger = _ref.trigger,
          done = _ref.done;
      console.log('default transition leave');
      done();
    }
  }, {
    key: "onEnter",
    value: function onEnter(_ref2) {
      var to = _ref2.to,
          trigger = _ref2.trigger,
          done = _ref2.done;
      console.log('default transition enter');
      done();
    }
  }]);

  return DefaultTransition;
}(_src_taxi__WEBPACK_IMPORTED_MODULE_0__.Transition);



/***/ }),

/***/ "./tests/transitions/OverrideTransition.js":
/*!*************************************************!*\
  !*** ./tests/transitions/OverrideTransition.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ OverrideTransition)
/* harmony export */ });
/* harmony import */ var _src_taxi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/taxi */ "./src/taxi.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var OverrideTransition = /*#__PURE__*/function (_Transition) {
  _inherits(OverrideTransition, _Transition);

  var _super = _createSuper(OverrideTransition);

  function OverrideTransition() {
    _classCallCheck(this, OverrideTransition);

    return _super.apply(this, arguments);
  }

  _createClass(OverrideTransition, [{
    key: "onLeave",
    value: function onLeave(_ref) {
      var from = _ref.from,
          trigger = _ref.trigger,
          done = _ref.done;
      console.log('override transition leave');
      done();
    }
  }, {
    key: "onEnter",
    value: function onEnter(_ref2) {
      var from = _ref2.from,
          to = _ref2.to,
          trigger = _ref2.trigger,
          done = _ref2.done;
      console.log('override transition enter');
      done();
    }
  }]);

  return OverrideTransition;
}(_src_taxi__WEBPACK_IMPORTED_MODULE_0__.Transition);



/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ "./node_modules/selector-set/selector-set.next.js":
/*!********************************************************!*\
  !*** ./node_modules/selector-set/selector-set.next.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SelectorSet)
/* harmony export */ });
// Public: Create a new SelectorSet.
function SelectorSet() {
  // Construct new SelectorSet if called as a function.
  if (!(this instanceof SelectorSet)) {
    return new SelectorSet();
  }

  // Public: Number of selectors added to the set
  this.size = 0;

  // Internal: Incrementing ID counter
  this.uid = 0;

  // Internal: Array of String selectors in the set
  this.selectors = [];

  // Internal: Map of selector ids to objects
  this.selectorObjects = {};

  // Internal: All Object index String names mapping to Index objects.
  this.indexes = Object.create(this.indexes);

  // Internal: Used Object index String names mapping to Index objects.
  this.activeIndexes = [];
}

// Detect prefixed Element#matches function.
var docElem = window.document.documentElement;
var matches =
  docElem.matches ||
  docElem.webkitMatchesSelector ||
  docElem.mozMatchesSelector ||
  docElem.oMatchesSelector ||
  docElem.msMatchesSelector;

// Public: Check if element matches selector.
//
// Maybe overridden with custom Element.matches function.
//
// el       - An Element
// selector - String CSS selector
//
// Returns true or false.
SelectorSet.prototype.matchesSelector = function(el, selector) {
  return matches.call(el, selector);
};

// Public: Find all elements in the context that match the selector.
//
// Maybe overridden with custom querySelectorAll function.
//
// selectors - String CSS selectors.
// context   - Element context
//
// Returns non-live list of Elements.
SelectorSet.prototype.querySelectorAll = function(selectors, context) {
  return context.querySelectorAll(selectors);
};

// Public: Array of indexes.
//
// name     - Unique String name
// selector - Function that takes a String selector and returns a String key
//            or undefined if it can't be used by the index.
// element  - Function that takes an Element and returns an Array of String
//            keys that point to indexed values.
//
SelectorSet.prototype.indexes = [];

// Index by element id
var idRe = /^#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
SelectorSet.prototype.indexes.push({
  name: 'ID',
  selector: function matchIdSelector(sel) {
    var m;
    if ((m = sel.match(idRe))) {
      return m[0].slice(1);
    }
  },
  element: function getElementId(el) {
    if (el.id) {
      return [el.id];
    }
  }
});

// Index by all of its class names
var classRe = /^\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
SelectorSet.prototype.indexes.push({
  name: 'CLASS',
  selector: function matchClassSelector(sel) {
    var m;
    if ((m = sel.match(classRe))) {
      return m[0].slice(1);
    }
  },
  element: function getElementClassNames(el) {
    var className = el.className;
    if (className) {
      if (typeof className === 'string') {
        return className.split(/\s/);
      } else if (typeof className === 'object' && 'baseVal' in className) {
        // className is a SVGAnimatedString
        // global SVGAnimatedString is not an exposed global in Opera 12
        return className.baseVal.split(/\s/);
      }
    }
  }
});

// Index by tag/node name: `DIV`, `FORM`, `A`
var tagRe = /^((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
SelectorSet.prototype.indexes.push({
  name: 'TAG',
  selector: function matchTagSelector(sel) {
    var m;
    if ((m = sel.match(tagRe))) {
      return m[0].toUpperCase();
    }
  },
  element: function getElementTagName(el) {
    return [el.nodeName.toUpperCase()];
  }
});

// Default index just contains a single array of elements.
SelectorSet.prototype.indexes['default'] = {
  name: 'UNIVERSAL',
  selector: function() {
    return true;
  },
  element: function() {
    return [true];
  }
};

// Use ES Maps when supported
var Map;
if (typeof window.Map === 'function') {
  Map = window.Map;
} else {
  Map = (function() {
    function Map() {
      this.map = {};
    }
    Map.prototype.get = function(key) {
      return this.map[key + ' '];
    };
    Map.prototype.set = function(key, value) {
      this.map[key + ' '] = value;
    };
    return Map;
  })();
}

// Regexps adopted from Sizzle
//   https://github.com/jquery/sizzle/blob/1.7/sizzle.js
//
var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g;

// Internal: Get indexes for selector.
//
// selector - String CSS selector
//
// Returns Array of {index, key}.
function parseSelectorIndexes(allIndexes, selector) {
  allIndexes = allIndexes.slice(0).concat(allIndexes['default']);

  var allIndexesLen = allIndexes.length,
    i,
    j,
    m,
    dup,
    rest = selector,
    key,
    index,
    indexes = [];

  do {
    chunker.exec('');
    if ((m = chunker.exec(rest))) {
      rest = m[3];
      if (m[2] || !rest) {
        for (i = 0; i < allIndexesLen; i++) {
          index = allIndexes[i];
          if ((key = index.selector(m[1]))) {
            j = indexes.length;
            dup = false;
            while (j--) {
              if (indexes[j].index === index && indexes[j].key === key) {
                dup = true;
                break;
              }
            }
            if (!dup) {
              indexes.push({ index: index, key: key });
            }
            break;
          }
        }
      }
    }
  } while (m);

  return indexes;
}

// Internal: Find first item in Array that is a prototype of `proto`.
//
// ary   - Array of objects
// proto - Prototype of expected item in `ary`
//
// Returns object from `ary` if found. Otherwise returns undefined.
function findByPrototype(ary, proto) {
  var i, len, item;
  for (i = 0, len = ary.length; i < len; i++) {
    item = ary[i];
    if (proto.isPrototypeOf(item)) {
      return item;
    }
  }
}

// Public: Log when added selector falls under the default index.
//
// This API should not be considered stable. May change between
// minor versions.
//
// obj - {selector, data} Object
//
//   SelectorSet.prototype.logDefaultIndexUsed = function(obj) {
//     console.warn(obj.selector, "could not be indexed");
//   };
//
// Returns nothing.
SelectorSet.prototype.logDefaultIndexUsed = function() {};

// Public: Add selector to set.
//
// selector - String CSS selector
// data     - Optional data Object (default: undefined)
//
// Returns nothing.
SelectorSet.prototype.add = function(selector, data) {
  var obj,
    i,
    indexProto,
    key,
    index,
    objs,
    selectorIndexes,
    selectorIndex,
    indexes = this.activeIndexes,
    selectors = this.selectors,
    selectorObjects = this.selectorObjects;

  if (typeof selector !== 'string') {
    return;
  }

  obj = {
    id: this.uid++,
    selector: selector,
    data: data
  };
  selectorObjects[obj.id] = obj;

  selectorIndexes = parseSelectorIndexes(this.indexes, selector);
  for (i = 0; i < selectorIndexes.length; i++) {
    selectorIndex = selectorIndexes[i];
    key = selectorIndex.key;
    indexProto = selectorIndex.index;

    index = findByPrototype(indexes, indexProto);
    if (!index) {
      index = Object.create(indexProto);
      index.map = new Map();
      indexes.push(index);
    }

    if (indexProto === this.indexes['default']) {
      this.logDefaultIndexUsed(obj);
    }
    objs = index.map.get(key);
    if (!objs) {
      objs = [];
      index.map.set(key, objs);
    }
    objs.push(obj);
  }

  this.size++;
  selectors.push(selector);
};

// Public: Remove selector from set.
//
// selector - String CSS selector
// data     - Optional data Object (default: undefined)
//
// Returns nothing.
SelectorSet.prototype.remove = function(selector, data) {
  if (typeof selector !== 'string') {
    return;
  }

  var selectorIndexes,
    selectorIndex,
    i,
    j,
    k,
    selIndex,
    objs,
    obj,
    indexes = this.activeIndexes,
    selectors = (this.selectors = []),
    selectorObjects = this.selectorObjects,
    removedIds = {},
    removeAll = arguments.length === 1;

  selectorIndexes = parseSelectorIndexes(this.indexes, selector);
  for (i = 0; i < selectorIndexes.length; i++) {
    selectorIndex = selectorIndexes[i];

    j = indexes.length;
    while (j--) {
      selIndex = indexes[j];
      if (selectorIndex.index.isPrototypeOf(selIndex)) {
        objs = selIndex.map.get(selectorIndex.key);
        if (objs) {
          k = objs.length;
          while (k--) {
            obj = objs[k];
            if (obj.selector === selector && (removeAll || obj.data === data)) {
              objs.splice(k, 1);
              removedIds[obj.id] = true;
            }
          }
        }
        break;
      }
    }
  }

  for (i in removedIds) {
    delete selectorObjects[i];
    this.size--;
  }

  for (i in selectorObjects) {
    selectors.push(selectorObjects[i].selector);
  }
};

// Sort by id property handler.
//
// a - Selector obj.
// b - Selector obj.
//
// Returns Number.
function sortById(a, b) {
  return a.id - b.id;
}

// Public: Find all matching decendants of the context element.
//
// context - An Element
//
// Returns Array of {selector, data, elements} matches.
SelectorSet.prototype.queryAll = function(context) {
  if (!this.selectors.length) {
    return [];
  }

  var matches = {},
    results = [];
  var els = this.querySelectorAll(this.selectors.join(', '), context);

  var i, j, len, len2, el, m, match, obj;
  for (i = 0, len = els.length; i < len; i++) {
    el = els[i];
    m = this.matches(el);
    for (j = 0, len2 = m.length; j < len2; j++) {
      obj = m[j];
      if (!matches[obj.id]) {
        match = {
          id: obj.id,
          selector: obj.selector,
          data: obj.data,
          elements: []
        };
        matches[obj.id] = match;
        results.push(match);
      } else {
        match = matches[obj.id];
      }
      match.elements.push(el);
    }
  }

  return results.sort(sortById);
};

// Public: Match element against all selectors in set.
//
// el - An Element
//
// Returns Array of {selector, data} matches.
SelectorSet.prototype.matches = function(el) {
  if (!el) {
    return [];
  }

  var i, j, k, len, len2, len3, index, keys, objs, obj, id;
  var indexes = this.activeIndexes,
    matchedIds = {},
    matches = [];

  for (i = 0, len = indexes.length; i < len; i++) {
    index = indexes[i];
    keys = index.element(el);
    if (keys) {
      for (j = 0, len2 = keys.length; j < len2; j++) {
        if ((objs = index.map.get(keys[j]))) {
          for (k = 0, len3 = objs.length; k < len3; k++) {
            obj = objs[k];
            id = obj.id;
            if (!matchedIds[id] && this.matchesSelector(el, obj.selector)) {
              matchedIds[id] = true;
              matches.push(obj);
            }
          }
        }
      }
    }
  }

  return matches.sort(sortById);
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./tests/app.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _unseenco_e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @unseenco/e */ "./node_modules/@unseenco/e/src/e.js");
/* harmony import */ var _src_taxi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/taxi */ "./src/taxi.js");
/* harmony import */ var _renderers_DefaultRenderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./renderers/DefaultRenderer */ "./tests/renderers/DefaultRenderer.js");
/* harmony import */ var _transitions_DefaultTransition__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./transitions/DefaultTransition */ "./tests/transitions/DefaultTransition.js");
/* harmony import */ var _transitions_OverrideTransition__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./transitions/OverrideTransition */ "./tests/transitions/OverrideTransition.js");





_unseenco_e__WEBPACK_IMPORTED_MODULE_0__["default"].on('DOMContentLoaded', window, function () {
  var taxi = new _src_taxi__WEBPACK_IMPORTED_MODULE_1__.Core({
    links: 'a:not([target]):not([href^=\\#]):not([download]):not([data-router-disabled]):not(.sf-dump-toggle):not(#wpadminbar a)',
    renderers: {
      "default": _renderers_DefaultRenderer__WEBPACK_IMPORTED_MODULE_2__["default"]
    },
    transitions: {
      "default": _transitions_DefaultTransition__WEBPACK_IMPORTED_MODULE_3__["default"],
      override: _transitions_OverrideTransition__WEBPACK_IMPORTED_MODULE_4__["default"]
    }
  });
});
})();

/******/ })()
;