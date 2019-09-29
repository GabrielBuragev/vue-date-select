var VueDateSelect = (function (exports) {
  'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = ".datepicker-wrapper {\n  outline: none;\n  border: 1px solid black; }\n  .datepicker-wrapper,\n  .datepicker-wrapper .datepicker-inner,\n  .datepicker-wrapper .datepicker-input-wrapper,\n  .datepicker-wrapper #datepicker {\n    height: 100%; }\n  .datepicker-wrapper .datepicker-inner,\n  .datepicker-wrapper .datepicker-inner input {\n    cursor: pointer; }\n  .datepicker-wrapper .datepicker-input-wrapper.closed .caret {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n    -webkit-transition: -webkit-transform 0.1s linear;\n    transition: -webkit-transform 0.1s linear;\n    transition: transform 0.1s linear;\n    transition: transform 0.1s linear, -webkit-transform 0.1s linear; }\n  .datepicker-wrapper .datepicker-input-wrapper.open .caret {\n    -webkit-transform: rotate(180deg);\n            transform: rotate(180deg);\n    -webkit-transition: -webkit-transform 0.1s linear;\n    transition: -webkit-transform 0.1s linear;\n    transition: transform 0.1s linear;\n    transition: transform 0.1s linear, -webkit-transform 0.1s linear; }\n  .datepicker-wrapper .datepicker-input-wrapper #datepicker {\n    padding-top: 10px;\n    padding-bottom: 10px;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center; }\n  .datepicker-wrapper .datepicker-input-wrapper .caret {\n    position: absolute;\n    right: 0;\n    top: 35%;\n    right: 4%;\n    color: #999;\n    margin-top: 4px;\n    border-style: solid;\n    border-width: 5px 5px 0;\n    border-color: #999 transparent transparent;\n    content: \"\"; }\n  .datepicker-wrapper .datepicker-input-wrapper div[readonly] {\n    background-color: #fff; }\n  .datepicker-wrapper .datepicker-dropdowns {\n    width: 100%;\n    position: absolute;\n    z-index: 100;\n    background-color: white;\n    -webkit-box-shadow: 0 0.25em 1em rgba(0, 0, 0, 0.3);\n            box-shadow: 0 0.25em 1em rgba(0, 0, 0, 0.3);\n    border-radius: 8px;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-flex: 1;\n        -ms-flex: 1;\n            flex: 1;\n    -webkit-box-orient: horizontal;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: row;\n            flex-direction: row; }\n    .datepicker-wrapper .datepicker-dropdowns .focused-liner {\n      border-top: 1px solid #66afe9;\n      border-bottom: 1px solid #66afe9;\n      /* top:40%; */\n      height: 35px;\n      width: 100%;\n      top: 107.5px;\n      position: absolute;\n      pointer-events: none;\n      /* top:40%; */ }\n\n.datepicker-list-wrapper {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1; }\n  .datepicker-list-wrapper .datepicker-dropdown-list {\n    display: inline-block;\n    max-height: 250px;\n    overflow-y: auto;\n    margin: auto;\n    position: relative;\n    -webkit-overflow-scrolling: touch;\n    -ms-overflow-style: none;\n    overflow: -moz-scrollbars-none;\n    width: 100%;\n    padding: 0; }\n    .datepicker-list-wrapper .datepicker-dropdown-list::-webkit-scrollbar {\n      width: 0 !important; }\n    .datepicker-list-wrapper .datepicker-dropdown-list li {\n      width: 100%;\n      padding: 5px;\n      font-size: 14px;\n      font-weight: 700;\n      text-align: center;\n      list-style: none;\n      height: 35.71px;\n      font-family: inherit;\n      padding: 0px !important;\n      display: block;\n      line-height: 35.71px;\n      vertical-align: middle; }\n      .datepicker-list-wrapper .datepicker-dropdown-list li[data-selectable] {\n        cursor: pointer; }\n        .datepicker-list-wrapper .datepicker-dropdown-list li[data-selectable]:hover {\n          outline: 0;\n          background: #eee; }\n      .datepicker-list-wrapper .datepicker-dropdown-list li span {\n        display: inline-block;\n        vertical-align: middle; }\n    .datepicker-list-wrapper .datepicker-dropdown-list .focused-item {\n      /* border-top:1px solid gray; */\n      /* border-bottom:1px solid gray; */\n      color: #f9676b; }\n    .datepicker-list-wrapper .datepicker-dropdown-list ul li:before {\n      content: \"\";\n      display: inline-block;\n      vertical-align: middle;\n      height: 100%; }\n    .datepicker-list-wrapper .datepicker-dropdown-list .noselect {\n      -webkit-touch-callout: none;\n      /* iOS Safari */\n      -webkit-user-select: none;\n      /* Safari */\n      /* Konqueror HTML */\n      -moz-user-select: none;\n      /* Firefox */\n      -ms-user-select: none;\n      /* Internet Explorer/Edge */\n      user-select: none;\n      /* Non-prefixed version, currently\n                                            supported by Chrome and Opera */ }\n";
  styleInject(css);

  /**
   * https://github.com/gre/bezier-easing
   * BezierEasing - use bezier curve for transition easing function
   * by Gaëtan Renaudeau 2014 - 2015 – MIT License
   */

  // These values are established by empiricism with tests (tradeoff: performance VS precision)
  var NEWTON_ITERATIONS = 4;
  var NEWTON_MIN_SLOPE = 0.001;
  var SUBDIVISION_PRECISION = 0.0000001;
  var SUBDIVISION_MAX_ITERATIONS = 10;

  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  var float32ArraySupported = typeof Float32Array === 'function';

  function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
  function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
  function C (aA1)      { return 3.0 * aA1; }

  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
  function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
  function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

  function binarySubdivide (aX, aA, aB, mX1, mX2) {
    var currentX, currentT, i = 0;
    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0.0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
  }

  function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
   for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
     var currentSlope = getSlope(aGuessT, mX1, mX2);
     if (currentSlope === 0.0) {
       return aGuessT;
     }
     var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
     aGuessT -= currentX / currentSlope;
   }
   return aGuessT;
  }

  function LinearEasing (x) {
    return x;
  }

  var src = function bezier (mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      throw new Error('bezier x values must be in [0, 1] range');
    }

    if (mX1 === mY1 && mX2 === mY2) {
      return LinearEasing;
    }

    // Precompute samples table
    var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
    for (var i = 0; i < kSplineTableSize; ++i) {
      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }

    function getTForX (aX) {
      var intervalStart = 0.0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }
      --currentSample;

      // Interpolate to provide an initial guess for t
      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;

      var initialSlope = getSlope(guessForT, mX1, mX2);
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    }

    return function BezierEasing (x) {
      // Because JavaScript number are imprecise, we should guarantee the extremes are right.
      if (x === 0) {
        return 0;
      }
      if (x === 1) {
        return 1;
      }
      return calcBezier(getTForX(x), mY1, mY2);
    };
  };

  var easings = {
      ease: [0.25, 0.1, 0.25, 1.0],
      linear: [0.00, 0.0, 1.00, 1.0],
      "ease-in": [0.42, 0.0, 1.00, 1.0],
      "ease-out": [0.00, 0.0, 0.58, 1.0],
      "ease-in-out": [0.42, 0.0, 0.58, 1.0]
  };

  // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
  let supportsPassive = false;
  try {
      let opts = Object.defineProperty({}, "passive", {
          get: function() {
              supportsPassive = true;
          }
      });
      window.addEventListener("test", null, opts);
  } catch (e) {}

  var _ = {
      $(selector) {
          if (typeof selector !== "string") {
              return selector;
          }
          return document.querySelector(selector);
      },
      on(element, events, handler, opts = { passive: false }) {
          if (!(events instanceof Array)) {
              events = [events];
          }
          for (let i = 0; i < events.length; i++) {
              element.addEventListener(
                  events[i],
                  handler,
                  supportsPassive ? opts : false
              );
          }
      },
      off(element, events, handler) {
          if (!(events instanceof Array)) {
              events = [events];
          }
          for (let i = 0; i < events.length; i++) {
              element.removeEventListener(events[i], handler);
          }
      },
      cumulativeOffset(element) {
          let top = 0;
          let left = 0;

          do {
              top += element.offsetTop || 0;
              left += element.offsetLeft || 0;
              element = element.offsetParent;
          } while (element);

          return {
              top: top,
              left: left
          };
      }
  };

  const abortEvents = [
      "mousedown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "keyup",
      "touchmove"
  ];

  let defaults = {
      container: "body",
      duration: 500,
      easing: "ease",
      offset: 0,
      force: true,
      cancelable: true,
      onStart: false,
      onDone: false,
      onCancel: false,
      x: false,
      y: true
  };

  const scroller = () => {
      let element; // element to scroll to
      let container; // container to scroll
      let duration; // duration of the scrolling
      let easing; // easing to be used when scrolling
      let offset; // offset to be added (subtracted)
      let force; // force scroll, even if element is visible
      let cancelable; // indicates if user can cancel the scroll or not.
      let onStart; // callback when scrolling is started
      let onDone; // callback when scrolling is done
      let onCancel; // callback when scrolling is canceled / aborted
      let x; // scroll on x axis
      let y; // scroll on y axis

      let initialX; // initial X of container
      let targetX; // target X of container
      let initialY; // initial Y of container
      let targetY; // target Y of container
      let diffX; // difference
      let diffY; // difference

      let abort; // is scrolling aborted

      let abortEv; // event that aborted scrolling
      let abortFn = e => {
          if (!cancelable) return;
          abortEv = e;
          abort = true;
      };
      let easingFn;

      let timeStart; // time when scrolling started
      let timeElapsed; // time elapsed since scrolling started

      let progress; // progress

      function scrollTop(container) {
          let scrollTop = container.scrollTop;

          if (container.tagName.toLowerCase() === "body") {
              // in firefox body.scrollTop always returns 0
              // thus if we are trying to get scrollTop on a body tag
              // we need to get it from the documentElement
              scrollTop = scrollTop || document.documentElement.scrollTop;
          }

          return scrollTop;
      }

      function scrollLeft(container) {
          let scrollLeft = container.scrollLeft;

          if (container.tagName.toLowerCase() === "body") {
              // in firefox body.scrollLeft always returns 0
              // thus if we are trying to get scrollLeft on a body tag
              // we need to get it from the documentElement
              scrollLeft = scrollLeft || document.documentElement.scrollLeft;
          }

          return scrollLeft;
      }

      function step(timestamp) {
          if (abort) return done();
          if (!timeStart) timeStart = timestamp;

          timeElapsed = timestamp - timeStart;

          progress = Math.min(timeElapsed / duration, 1);
          progress = easingFn(progress);

          topLeft(
              container,
              initialY + diffY * progress,
              initialX + diffX * progress
          );

          timeElapsed < duration ? window.requestAnimationFrame(step) : done();
      }

      function done() {
          if (!abort) topLeft(container, targetY, targetX);
          timeStart = false;

          _.off(container, abortEvents, abortFn);
          if (abort && onCancel) onCancel(abortEv, element);
          if (!abort && onDone) onDone(element);
      }

      function topLeft(element, top, left) {
          if (y) element.scrollTop = top;
          if (x) element.scrollLeft = left;
          if (element.tagName.toLowerCase() === "body") {
              // in firefox body.scrollTop doesn't scroll the page
              // thus if we are trying to scrollTop on a body tag
              // we need to scroll on the documentElement
              if (y) document.documentElement.scrollTop = top;
              if (x) document.documentElement.scrollLeft = left;
          }
      }

      function scrollTo(target, _duration, options = {}) {
          if (typeof _duration === "object") {
              options = _duration;
          } else if (typeof _duration === "number") {
              options.duration = _duration;
          }

          element = _.$(target);

          if (!element) {
              return console.warn(
                  "[vue-scrollto warn]: Trying to scroll to an element that is not on the page: " +
                      target
              );
          }

          container = _.$(options.container || defaults.container);
          duration = options.duration || defaults.duration;
          easing = options.easing || defaults.easing;
          offset = options.offset || defaults.offset;
          force = options.hasOwnProperty("force")
              ? options.force !== false
              : defaults.force;
          cancelable = options.hasOwnProperty("cancelable")
              ? options.cancelable !== false
              : defaults.cancelable;
          onStart = options.onStart || defaults.onStart;
          onDone = options.onDone || defaults.onDone;
          onCancel = options.onCancel || defaults.onCancel;
          x = options.x === undefined ? defaults.x : options.x;
          y = options.y === undefined ? defaults.y : options.y;

          var cumulativeOffsetContainer = _.cumulativeOffset(container);
          var cumulativeOffsetElement = _.cumulativeOffset(element);

          if (typeof offset === "function") {
              offset = offset();
          }

          initialY = scrollTop(container);
          targetY =
              cumulativeOffsetElement.top -
              cumulativeOffsetContainer.top +
              offset;

          initialX = scrollLeft(container);
          targetX =
              cumulativeOffsetElement.left -
              cumulativeOffsetContainer.left +
              offset;

          abort = false;

          diffY = targetY - initialY;
          diffX = targetX - initialX;

          if (!force) {
              const containerTop = initialY;
              const containerBottom = containerTop + container.offsetHeight;
              const elementTop = targetY;
              const elementBottom = elementTop + element.offsetHeight;
              if (
                  elementTop >= containerTop &&
                  elementBottom <= containerBottom
              ) {
                  // make sure to call the onDone callback even if there is no need to
                  // scroll the container. Fixes #111 (ref #118)
                  onDone(element);
                  return;
              }
          }

          if (typeof easing === "string") {
              easing = easings[easing] || easings["ease"];
          }

          easingFn = src.apply(src, easing);

          if (!diffY && !diffX) return;
          if (onStart) onStart(element);

          _.on(container, abortEvents, abortFn, { passive: true });

          window.requestAnimationFrame(step);

          return () => {
              abortEv = null;
              abort = true;
          };
      }

      return scrollTo;
  };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var dist = createCommonjsModule(function (module) {
  module.exports =
  /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId]) {
  /******/ 			return installedModules[moduleId].exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			i: moduleId,
  /******/ 			l: false,
  /******/ 			exports: {}
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.l = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
  /******/ 		if(!__webpack_require__.o(exports, name)) {
  /******/ 			Object.defineProperty(exports, name, {
  /******/ 				configurable: false,
  /******/ 				enumerable: true,
  /******/ 				get: getter
  /******/ 			});
  /******/ 		}
  /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
  /******/ 		var getter = module && module.__esModule ?
  /******/ 			function getDefault() { return module['default']; } :
  /******/ 			function getModuleExports() { return module; };
  /******/ 		__webpack_require__.d(getter, 'a', getter);
  /******/ 		return getter;
  /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = 0);
  /******/ })
  /************************************************************************/
  /******/ ([
  /* 0 */
  /***/ (function(module, exports, __webpack_require__) {


  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var UAParser = __webpack_require__(1);

  var _require = __webpack_require__(3),
      BROWSER_TYPES = _require.BROWSER_TYPES,
      OS_TYPES = _require.OS_TYPES,
      DEVICE_TYPES = _require.DEVICE_TYPES,
      defaultData = _require.defaultData;

  var UA = new UAParser();

  var browser = UA.getBrowser();
  var cpu = UA.getCPU();
  var device = UA.getDevice();
  var engine = UA.getEngine();
  var os = UA.getOS();
  var ua = UA.getUA();

  var CHROME = BROWSER_TYPES.CHROME,
      CHROMIUM = BROWSER_TYPES.CHROMIUM,
      IE = BROWSER_TYPES.IE,
      INTERNET_EXPLORER = BROWSER_TYPES.INTERNET_EXPLORER,
      OPERA = BROWSER_TYPES.OPERA,
      FIREFOX = BROWSER_TYPES.FIREFOX,
      SAFARI = BROWSER_TYPES.SAFARI,
      EDGE = BROWSER_TYPES.EDGE,
      YANDEX = BROWSER_TYPES.YANDEX,
      MOBILE_SAFARI = BROWSER_TYPES.MOBILE_SAFARI;
  var MOBILE = DEVICE_TYPES.MOBILE,
      TABLET = DEVICE_TYPES.TABLET,
      SMART_TV = DEVICE_TYPES.SMART_TV,
      BROWSER = DEVICE_TYPES.BROWSER,
      WEARABLE = DEVICE_TYPES.WEARABLE,
      CONSOLE = DEVICE_TYPES.CONSOLE;
  var ANDROID = OS_TYPES.ANDROID,
      WINDOWS_PHONE = OS_TYPES.WINDOWS_PHONE,
      IOS = OS_TYPES.IOS;
  var checkType = exports.checkType = function checkType(type) {
    switch (type) {
      case MOBILE:
        return { isMobile: true };
      case TABLET:
        return { isTablet: true };
      case SMART_TV:
        return { isSmartTV: true };
      case CONSOLE:
        return { isConsole: true };
      case WEARABLE:
        return { isWearable: true };
      case BROWSER:
        return { isBrowser: true };
      default:
        return defaultData;
    }
  };

  var getCurrentBrowser = exports.getCurrentBrowser = function getCurrentBrowser(name) {
    switch (name) {
      case CHROME:
      case FIREFOX:
      case OPERA:
      case YANDEX:
      case SAFARI:
      case IE:
      case EDGE:
      case CHROMIUM:
        return true;
      default:
        return false;
    }
  };

  var broPayload = exports.broPayload = function broPayload(isBrowser, browser, engine, os, ua) {
    return {
      isBrowser: isBrowser,
      browserMajorVersion: browser.major,
      browserFullVersion: browser.version,
      browserName: browser.name,
      engineName: engine.name || false,
      engineVersion: engine.version,
      osName: os.name,
      osVersion: os.version,
      userAgent: ua
    };
  };

  var mobilePayload = exports.mobilePayload = function mobilePayload(type, device, os, ua) {
    return _extends({}, type, {
      vendor: device.vendor,
      model: device.model,
      os: os.name,
      osVersion: os.version,
      ua: ua
    });
  };

  var stvPayload = exports.stvPayload = function stvPayload(isSmartTV, engine, os, ua) {
    return {
      isSmartTV: isSmartTV,
      engineName: engine.name,
      engineVersion: engine.version,
      osName: os.name,
      osVersion: os.version,
      userAgent: ua
    };
  };

  var consolePayload = exports.consolePayload = function consolePayload(isConsole, engine, os, ua) {
    return {
      isConsole: isConsole,
      engineName: engine.name,
      engineVersion: engine.version,
      osName: os.name,
      osVersion: os.version,
      userAgent: ua
    };
  };

  var wearPayload = exports.wearPayload = function wearPayload(isWearable, engine, os, ua) {
    return {
      isWearable: isWearable,
      engineName: engine.name,
      engineVersion: engine.version,
      osName: os.name,
      osVersion: os.version,
      userAgent: ua
    };
  };

  var isMobileType = function isMobileType() {
    return device.type === MOBILE;
  };
  var isTabletType = function isTabletType() {
    return device.type === TABLET;
  };

  var isMobileAndTabletType = function isMobileAndTabletType() {
    switch (device.type) {
      case MOBILE:
      case TABLET:
        return true;
      default:
        return false;
    }
  };

  var isSmartTVType = function isSmartTVType() {
    return device.type === SMART_TV;
  };
  var isBrowserType = function isBrowserType() {
    return device.type === BROWSER;
  };
  var isWearableType = function isWearableType() {
    return device.type === WEARABLE;
  };
  var isConsoleType = function isConsoleType() {
    return device.type === CONSOLE;
  };
  var isAndroidType = function isAndroidType() {
    return os.name === ANDROID;
  };
  var isWinPhoneType = function isWinPhoneType() {
    return os.name === WINDOWS_PHONE;
  };
  var isIOSType = function isIOSType() {
    return os.name === IOS;
  };
  var isChromeType = function isChromeType() {
    return browser.name === CHROME;
  };
  var isFirefoxType = function isFirefoxType() {
    return browser.name === FIREFOX;
  };
  var isChromiumType = function isChromiumType() {
    return browser.name === CHROMIUM;
  };
  var isEdgeType = function isEdgeType() {
    return browser.name === EDGE;
  };
  var isYandexType = function isYandexType() {
    return browser.name === YANDEX;
  };
  var isSafariType = function isSafariType() {
    return browser.name === SAFARI || browser.name === MOBILE_SAFARI;
  };

  var isMobileSafariType = function isMobileSafariType() {
    return browser.name === MOBILE_SAFARI;
  };
  var isOperaType = function isOperaType() {
    return browser.name === OPERA;
  };
  var isIEType = function isIEType() {
    return browser.name === INTERNET_EXPLORER || browser.name === IE;
  };

  var getBrowserFullVersion = function getBrowserFullVersion() {
    return browser.major;
  };
  var getBrowserVersion = function getBrowserVersion() {
    return browser.version;
  };
  var getOsVersion = function getOsVersion() {
    return os.version ? os.version : "none";
  };
  var getOsName = function getOsName() {
    return os.name ? os.name : "none";
  };
  var getBrowserName = function getBrowserName() {
    return browser.name;
  };
  var getMobileVendor = function getMobileVendor() {
    return device.vendor ? device.vendor : "none";
  };
  var getMobileModel = function getMobileModel() {
    return device.model ? device.model : "none";
  };
  var getEngineName = function getEngineName() {
    return engine.name;
  };
  var getEngineVersion = function getEngineVersion() {
    return engine.version;
  };
  var getUseragent = function getUseragent() {
    return ua;
  };

  var isSmartTV = isSmartTVType();
  var isConsole = isConsoleType();
  var isWearable = isWearableType();
  var isMobileSafari = isMobileSafariType();
  var isChromium = isChromiumType();
  var isMobile = isMobileAndTabletType();
  var isMobileOnly = isMobileType();
  var isTablet = isTabletType();
  var isBrowser = isBrowserType();
  var isAndroid = isAndroidType();
  var isWinPhone = isWinPhoneType();
  var isIOS = isIOSType();
  var isChrome = isChromeType();
  var isFirefox = isFirefoxType();
  var isSafari = isSafariType();
  var isOpera = isOperaType();
  var isIE = isIEType();
  var osVersion = getOsVersion();
  var osName = getOsName();
  var fullBrowserVersion = getBrowserFullVersion();
  var browserVersion = getBrowserVersion();
  var browserName = getBrowserName();
  var mobileVendor = getMobileVendor();
  var mobileModel = getMobileModel();
  var engineName = getEngineName();
  var engineVersion = getEngineVersion();
  var getUA = getUseragent();
  var isEdge = isEdgeType();
  var isYandex = isYandexType();

  var type = checkType(device.type);

  exports.default = function () {
    var isBrowser = type.isBrowser,
        isMobile = type.isMobile,
        isTablet = type.isTablet,
        isSmartTV = type.isSmartTV,
        isConsole = type.isConsole,
        isWearable = type.isWearable;

    if (isBrowser) {
      return broPayload(isBrowser, browser, engine, os, ua);
    }

    if (isSmartTV) {
      return stvPayload(isSmartTV, engine, os, ua);
    }

    if (isConsole) {
      return consolePayload(isConsole, engine, os, ua);
    }

    if (isMobile) {
      return mobilePayload(type, device, os, ua);
    }

    if (isTablet) {
      return mobilePayload(type, device, os, ua);
    }

    if (isWearable) {
      return wearPayload(isWearable, engine, os, ua);
    }
  };

  module.exports = {
    isSmartTV: isSmartTV,
    isConsole: isConsole,
    isWearable: isWearable,
    isMobileSafari: isMobileSafari,
    isChromium: isChromium,
    isMobile: isMobile,
    isMobileOnly: isMobileOnly,
    isTablet: isTablet,
    isBrowser: isBrowser,
    isAndroid: isAndroid,
    isWinPhone: isWinPhone,
    isIOS: isIOS,
    isChrome: isChrome,
    isFirefox: isFirefox,
    isSafari: isSafari,
    isOpera: isOpera,
    isIE: isIE,
    osVersion: osVersion,
    osName: osName,
    fullBrowserVersion: fullBrowserVersion,
    browserVersion: browserVersion,
    browserName: browserName,
    mobileVendor: mobileVendor,
    mobileModel: mobileModel,
    engineName: engineName,
    engineVersion: engineVersion,
    getUA: getUA,
    isEdge: isEdge,
    isYandex: isYandex
  };

  /***/ }),
  /* 1 */
  /***/ (function(module, exports, __webpack_require__) {

  var __WEBPACK_AMD_DEFINE_RESULT__;/*!
   * UAParser.js v0.7.18
   * Lightweight JavaScript-based User-Agent string parser
   * https://github.com/faisalman/ua-parser-js
   *
   * Copyright © 2012-2016 Faisal Salman <fyzlman@gmail.com>
   * Dual licensed under GPLv2 or MIT
   */
  (function(window,undefined$1){var LIBVERSION="0.7.18",EMPTY="",UNKNOWN="?",FUNC_TYPE="function",UNDEF_TYPE="undefined",OBJ_TYPE="object",STR_TYPE="string",MAJOR="major",MODEL="model",NAME="name",TYPE="type",VENDOR="vendor",VERSION="version",ARCHITECTURE="architecture",CONSOLE="console",MOBILE="mobile",TABLET="tablet",SMARTTV="smarttv",WEARABLE="wearable",EMBEDDED="embedded";var util={extend:function(regexes,extensions){var margedRegexes={};for(var i in regexes){if(extensions[i]&&extensions[i].length%2===0){margedRegexes[i]=extensions[i].concat(regexes[i]);}else{margedRegexes[i]=regexes[i];}}return margedRegexes},has:function(str1,str2){if(typeof str1==="string"){return str2.toLowerCase().indexOf(str1.toLowerCase())!==-1}else{return false}},lowerize:function(str){return str.toLowerCase()},major:function(version){return typeof version===STR_TYPE?version.replace(/[^\d\.]/g,"").split(".")[0]:undefined$1},trim:function(str){return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")}};var mapper={rgx:function(ua,arrays){var i=0,j,k,p,q,matches,match;while(i<arrays.length&&!matches){var regex=arrays[i],props=arrays[i+1];j=k=0;while(j<regex.length&&!matches){matches=regex[j++].exec(ua);if(!!matches){for(p=0;p<props.length;p++){match=matches[++k];q=props[p];if(typeof q===OBJ_TYPE&&q.length>0){if(q.length==2){if(typeof q[1]==FUNC_TYPE){this[q[0]]=q[1].call(this,match);}else{this[q[0]]=q[1];}}else if(q.length==3){if(typeof q[1]===FUNC_TYPE&&!(q[1].exec&&q[1].test)){this[q[0]]=match?q[1].call(this,match,q[2]):undefined$1;}else{this[q[0]]=match?match.replace(q[1],q[2]):undefined$1;}}else if(q.length==4){this[q[0]]=match?q[3].call(this,match.replace(q[1],q[2])):undefined$1;}}else{this[q]=match?match:undefined$1;}}}}i+=2;}},str:function(str,map){for(var i in map){if(typeof map[i]===OBJ_TYPE&&map[i].length>0){for(var j=0;j<map[i].length;j++){if(util.has(map[i][j],str)){return i===UNKNOWN?undefined$1:i}}}else if(util.has(map[i],str)){return i===UNKNOWN?undefined$1:i}}return str}};var maps={browser:{oldsafari:{version:{"1.0":"/8",1.2:"/1",1.3:"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}}},device:{amazon:{model:{"Fire Phone":["SD","KF"]}},sprint:{model:{"Evo Shift 4G":"7373KT"},vendor:{HTC:"APA",Sprint:"Sprint"}}},os:{windows:{version:{ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2000:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"}}}};var regexes={browser:[[/(opera\smini)\/([\w\.-]+)/i,/(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,/(opera).+version\/([\w\.]+)/i,/(opera)[\/\s]+([\w\.]+)/i],[NAME,VERSION],[/(opios)[\/\s]+([\w\.]+)/i],[[NAME,"Opera Mini"],VERSION],[/\s(opr)\/([\w\.]+)/i],[[NAME,"Opera"],VERSION],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,/(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,/(?:ms|\()(ie)\s([\w\.]+)/i,/(rekonq)\/([\w\.]*)/i,/(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark)\/([\w\.-]+)/i],[NAME,VERSION],[/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],[[NAME,"IE"],VERSION],[/(edge|edgios|edgea)\/((\d+)?[\w\.]+)/i],[[NAME,"Edge"],VERSION],[/(yabrowser)\/([\w\.]+)/i],[[NAME,"Yandex"],VERSION],[/(puffin)\/([\w\.]+)/i],[[NAME,"Puffin"],VERSION],[/((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i],[[NAME,"UCBrowser"],VERSION],[/(comodo_dragon)\/([\w\.]+)/i],[[NAME,/_/g," "],VERSION],[/(micromessenger)\/([\w\.]+)/i],[[NAME,"WeChat"],VERSION],[/(qqbrowserlite)\/([\w\.]+)/i],[NAME,VERSION],[/(QQ)\/([\d\.]+)/i],[NAME,VERSION],[/m?(qqbrowser)[\/\s]?([\w\.]+)/i],[NAME,VERSION],[/(BIDUBrowser)[\/\s]?([\w\.]+)/i],[NAME,VERSION],[/(2345Explorer)[\/\s]?([\w\.]+)/i],[NAME,VERSION],[/(MetaSr)[\/\s]?([\w\.]+)/i],[NAME],[/(LBBROWSER)/i],[NAME],[/xiaomi\/miuibrowser\/([\w\.]+)/i],[VERSION,[NAME,"MIUI Browser"]],[/;fbav\/([\w\.]+);/i],[VERSION,[NAME,"Facebook"]],[/headlesschrome(?:\/([\w\.]+)|\s)/i],[VERSION,[NAME,"Chrome Headless"]],[/\swv\).+(chrome)\/([\w\.]+)/i],[[NAME,/(.+)/,"$1 WebView"],VERSION],[/((?:oculus|samsung)browser)\/([\w\.]+)/i],[[NAME,/(.+(?:g|us))(.+)/,"$1 $2"],VERSION],[/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i],[VERSION,[NAME,"Android Browser"]],[/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i],[NAME,VERSION],[/(dolfin)\/([\w\.]+)/i],[[NAME,"Dolphin"],VERSION],[/((?:android.+)crmo|crios)\/([\w\.]+)/i],[[NAME,"Chrome"],VERSION],[/(coast)\/([\w\.]+)/i],[[NAME,"Opera Coast"],VERSION],[/fxios\/([\w\.-]+)/i],[VERSION,[NAME,"Firefox"]],[/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],[VERSION,[NAME,"Mobile Safari"]],[/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],[VERSION,NAME],[/webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i],[[NAME,"GSA"],VERSION],[/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],[NAME,[VERSION,mapper.str,maps.browser.oldsafari.version]],[/(konqueror)\/([\w\.]+)/i,/(webkit|khtml)\/([\w\.]+)/i],[NAME,VERSION],[/(navigator|netscape)\/([\w\.-]+)/i],[[NAME,"Netscape"],VERSION],[/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,/(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,/(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,/(links)\s\(([\w\.]+)/i,/(gobrowser)\/?([\w\.]*)/i,/(ice\s?browser)\/v?([\w\._]+)/i,/(mosaic)[\/\s]([\w\.]+)/i],[NAME,VERSION]],cpu:[[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],[[ARCHITECTURE,"amd64"]],[/(ia32(?=;))/i],[[ARCHITECTURE,util.lowerize]],[/((?:i[346]|x)86)[;\)]/i],[[ARCHITECTURE,"ia32"]],[/windows\s(ce|mobile);\sppc;/i],[[ARCHITECTURE,"arm"]],[/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],[[ARCHITECTURE,/ower/,"",util.lowerize]],[/(sun4\w)[;\)]/i],[[ARCHITECTURE,"sparc"]],[/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],[[ARCHITECTURE,util.lowerize]]],device:[[/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i],[MODEL,VENDOR,[TYPE,TABLET]],[/applecoremedia\/[\w\.]+ \((ipad)/],[MODEL,[VENDOR,"Apple"],[TYPE,TABLET]],[/(apple\s{0,1}tv)/i],[[MODEL,"Apple TV"],[VENDOR,"Apple"]],[/(archos)\s(gamepad2?)/i,/(hp).+(touchpad)/i,/(hp).+(tablet)/i,/(kindle)\/([\w\.]+)/i,/\s(nook)[\w\s]+build\/(\w+)/i,/(dell)\s(strea[kpr\s\d]*[\dko])/i],[VENDOR,MODEL,[TYPE,TABLET]],[/(kf[A-z]+)\sbuild\/.+silk\//i],[MODEL,[VENDOR,"Amazon"],[TYPE,TABLET]],[/(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i],[[MODEL,mapper.str,maps.device.amazon.model],[VENDOR,"Amazon"],[TYPE,MOBILE]],[/\((ip[honed|\s\w*]+);.+(apple)/i],[MODEL,VENDOR,[TYPE,MOBILE]],[/\((ip[honed|\s\w*]+);/i],[MODEL,[VENDOR,"Apple"],[TYPE,MOBILE]],[/(blackberry)[\s-]?(\w+)/i,/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,/(hp)\s([\w\s]+\w)/i,/(asus)-?(\w+)/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/\(bb10;\s(\w+)/i],[MODEL,[VENDOR,"BlackBerry"],[TYPE,MOBILE]],[/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i],[MODEL,[VENDOR,"Asus"],[TYPE,TABLET]],[/(sony)\s(tablet\s[ps])\sbuild\//i,/(sony)?(?:sgp.+)\sbuild\//i],[[VENDOR,"Sony"],[MODEL,"Xperia Tablet"],[TYPE,TABLET]],[/android.+\s([c-g]\d{4}|so[-l]\w+)\sbuild\//i],[MODEL,[VENDOR,"Sony"],[TYPE,MOBILE]],[/\s(ouya)\s/i,/(nintendo)\s([wids3u]+)/i],[VENDOR,MODEL,[TYPE,CONSOLE]],[/android.+;\s(shield)\sbuild/i],[MODEL,[VENDOR,"Nvidia"],[TYPE,CONSOLE]],[/(playstation\s[34portablevi]+)/i],[MODEL,[VENDOR,"Sony"],[TYPE,CONSOLE]],[/(sprint\s(\w+))/i],[[VENDOR,mapper.str,maps.device.sprint.vendor],[MODEL,mapper.str,maps.device.sprint.model],[TYPE,MOBILE]],[/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i],[VENDOR,MODEL,[TYPE,TABLET]],[/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,/(zte)-(\w*)/i,/(alcatel|geeksphone|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i],[VENDOR,[MODEL,/_/g," "],[TYPE,MOBILE]],[/(nexus\s9)/i],[MODEL,[VENDOR,"HTC"],[TYPE,TABLET]],[/d\/huawei([\w\s-]+)[;\)]/i,/(nexus\s6p)/i],[MODEL,[VENDOR,"Huawei"],[TYPE,MOBILE]],[/(microsoft);\s(lumia[\s\w]+)/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/[\s\(;](xbox(?:\sone)?)[\s\);]/i],[MODEL,[VENDOR,"Microsoft"],[TYPE,CONSOLE]],[/(kin\.[onetw]{3})/i],[[MODEL,/\./g," "],[VENDOR,"Microsoft"],[TYPE,MOBILE]],[/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i,/mot[\s-]?(\w*)/i,/(XT\d{3,4}) build\//i,/(nexus\s6)/i],[MODEL,[VENDOR,"Motorola"],[TYPE,MOBILE]],[/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],[MODEL,[VENDOR,"Motorola"],[TYPE,TABLET]],[/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],[[VENDOR,util.trim],[MODEL,util.trim],[TYPE,SMARTTV]],[/hbbtv.+maple;(\d+)/i],[[MODEL,/^/,"SmartTV"],[VENDOR,"Samsung"],[TYPE,SMARTTV]],[/\(dtv[\);].+(aquos)/i],[MODEL,[VENDOR,"Sharp"],[TYPE,SMARTTV]],[/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,/((SM-T\w+))/i],[[VENDOR,"Samsung"],MODEL,[TYPE,TABLET]],[/smart-tv.+(samsung)/i],[VENDOR,[TYPE,SMARTTV],MODEL],[/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,/(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i,/sec-((sgh\w+))/i],[[VENDOR,"Samsung"],MODEL,[TYPE,MOBILE]],[/sie-(\w*)/i],[MODEL,[VENDOR,"Siemens"],[TYPE,MOBILE]],[/(maemo|nokia).*(n900|lumia\s\d+)/i,/(nokia)[\s_-]?([\w-]*)/i],[[VENDOR,"Nokia"],MODEL,[TYPE,MOBILE]],[/android\s3\.[\s\w;-]{10}(a\d{3})/i],[MODEL,[VENDOR,"Acer"],[TYPE,TABLET]],[/android.+([vl]k\-?\d{3})\s+build/i],[MODEL,[VENDOR,"LG"],[TYPE,TABLET]],[/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],[[VENDOR,"LG"],MODEL,[TYPE,TABLET]],[/(lg) netcast\.tv/i],[VENDOR,MODEL,[TYPE,SMARTTV]],[/(nexus\s[45])/i,/lg[e;\s\/-]+(\w*)/i,/android.+lg(\-?[\d\w]+)\s+build/i],[MODEL,[VENDOR,"LG"],[TYPE,MOBILE]],[/android.+(ideatab[a-z0-9\-\s]+)/i],[MODEL,[VENDOR,"Lenovo"],[TYPE,TABLET]],[/linux;.+((jolla));/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/((pebble))app\/[\d\.]+\s/i],[VENDOR,MODEL,[TYPE,WEARABLE]],[/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/crkey/i],[[MODEL,"Chromecast"],[VENDOR,"Google"]],[/android.+;\s(glass)\s\d/i],[MODEL,[VENDOR,"Google"],[TYPE,WEARABLE]],[/android.+;\s(pixel c)\s/i],[MODEL,[VENDOR,"Google"],[TYPE,TABLET]],[/android.+;\s(pixel xl|pixel)\s/i],[MODEL,[VENDOR,"Google"],[TYPE,MOBILE]],[/android.+;\s(\w+)\s+build\/hm\1/i,/android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,/android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i,/android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i],[[MODEL,/_/g," "],[VENDOR,"Xiaomi"],[TYPE,MOBILE]],[/android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i],[[MODEL,/_/g," "],[VENDOR,"Xiaomi"],[TYPE,TABLET]],[/android.+;\s(m[1-5]\snote)\sbuild/i],[MODEL,[VENDOR,"Meizu"],[TYPE,TABLET]],[/android.+a000(1)\s+build/i,/android.+oneplus\s(a\d{4})\s+build/i],[MODEL,[VENDOR,"OnePlus"],[TYPE,MOBILE]],[/android.+[;\/]\s*(RCT[\d\w]+)\s+build/i],[MODEL,[VENDOR,"RCA"],[TYPE,TABLET]],[/android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i],[MODEL,[VENDOR,"Dell"],[TYPE,TABLET]],[/android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i],[MODEL,[VENDOR,"Verizon"],[TYPE,TABLET]],[/android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i],[[VENDOR,"Barnes & Noble"],MODEL,[TYPE,TABLET]],[/android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i],[MODEL,[VENDOR,"NuVision"],[TYPE,TABLET]],[/android.+;\s(k88)\sbuild/i],[MODEL,[VENDOR,"ZTE"],[TYPE,TABLET]],[/android.+[;\/]\s*(gen\d{3})\s+build.*49h/i],[MODEL,[VENDOR,"Swiss"],[TYPE,MOBILE]],[/android.+[;\/]\s*(zur\d{3})\s+build/i],[MODEL,[VENDOR,"Swiss"],[TYPE,TABLET]],[/android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i],[MODEL,[VENDOR,"Zeki"],[TYPE,TABLET]],[/(android).+[;\/]\s+([YR]\d{2})\s+build/i,/android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i],[[VENDOR,"Dragon Touch"],MODEL,[TYPE,TABLET]],[/android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i],[MODEL,[VENDOR,"Insignia"],[TYPE,TABLET]],[/android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i],[MODEL,[VENDOR,"NextBook"],[TYPE,TABLET]],[/android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i],[[VENDOR,"Voice"],MODEL,[TYPE,MOBILE]],[/android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i],[[VENDOR,"LvTel"],MODEL,[TYPE,MOBILE]],[/android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i],[MODEL,[VENDOR,"Envizen"],[TYPE,TABLET]],[/android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i],[VENDOR,MODEL,[TYPE,TABLET]],[/android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i],[MODEL,[VENDOR,"MachSpeed"],[TYPE,TABLET]],[/android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i],[VENDOR,MODEL,[TYPE,TABLET]],[/android.+[;\/]\s*TU_(1491)\s+build/i],[MODEL,[VENDOR,"Rotor"],[TYPE,TABLET]],[/android.+(KS(.+))\s+build/i],[MODEL,[VENDOR,"Amazon"],[TYPE,TABLET]],[/android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i],[VENDOR,MODEL,[TYPE,TABLET]],[/\s(tablet|tab)[;\/]/i,/\s(mobile)(?:[;\/]|\ssafari)/i],[[TYPE,util.lowerize],VENDOR,MODEL],[/(android[\w\.\s\-]{0,9});.+build/i],[MODEL,[VENDOR,"Generic"]]],engine:[[/windows.+\sedge\/([\w\.]+)/i],[VERSION,[NAME,"EdgeHTML"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,/(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,/(icab)[\/\s]([23]\.[\d\.]+)/i],[NAME,VERSION],[/rv\:([\w\.]{1,9}).+(gecko)/i],[VERSION,NAME]],os:[[/microsoft\s(windows)\s(vista|xp)/i],[NAME,VERSION],[/(windows)\snt\s6\.2;\s(arm)/i,/(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i,/(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],[NAME,[VERSION,mapper.str,maps.os.windows.version]],[/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],[[NAME,"Windows"],[VERSION,mapper.str,maps.os.windows.version]],[/\((bb)(10);/i],[[NAME,"BlackBerry"],VERSION],[/(blackberry)\w*\/?([\w\.]*)/i,/(tizen)[\/\s]([\w\.]+)/i,/(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]*)/i,/linux;.+(sailfish);/i],[NAME,VERSION],[/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i],[[NAME,"Symbian"],VERSION],[/\((series40);/i],[NAME],[/mozilla.+\(mobile;.+gecko.+firefox/i],[[NAME,"Firefox OS"],VERSION],[/(nintendo|playstation)\s([wids34portablevu]+)/i,/(mint)[\/\s\(]?(\w*)/i,/(mageia|vectorlinux)[;\s]/i,/(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,/(hurd|linux)\s?([\w\.]*)/i,/(gnu)\s?([\w\.]*)/i],[NAME,VERSION],[/(cros)\s[\w]+\s([\w\.]+\w)/i],[[NAME,"Chromium OS"],VERSION],[/(sunos)\s?([\w\.\d]*)/i],[[NAME,"Solaris"],VERSION],[/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i],[NAME,VERSION],[/(haiku)\s(\w+)/i],[NAME,VERSION],[/cfnetwork\/.+darwin/i,/ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i],[[VERSION,/_/g,"."],[NAME,"iOS"]],[/(mac\sos\sx)\s?([\w\s\.]*)/i,/(macintosh|mac(?=_powerpc)\s)/i],[[NAME,"Mac OS"],[VERSION,/_/g,"."]],[/((?:open)?solaris)[\/\s-]?([\w\.]*)/i,/(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i,/(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,/(unix)\s?([\w\.]*)/i],[NAME,VERSION]]};var UAParser=function(uastring,extensions){if(typeof uastring==="object"){extensions=uastring;uastring=undefined$1;}if(!(this instanceof UAParser)){return new UAParser(uastring,extensions).getResult()}var ua=uastring||(window&&window.navigator&&window.navigator.userAgent?window.navigator.userAgent:EMPTY);var rgxmap=extensions?util.extend(regexes,extensions):regexes;this.getBrowser=function(){var browser={name:undefined$1,version:undefined$1};mapper.rgx.call(browser,ua,rgxmap.browser);browser.major=util.major(browser.version);return browser};this.getCPU=function(){var cpu={architecture:undefined$1};mapper.rgx.call(cpu,ua,rgxmap.cpu);return cpu};this.getDevice=function(){var device={vendor:undefined$1,model:undefined$1,type:undefined$1};mapper.rgx.call(device,ua,rgxmap.device);return device};this.getEngine=function(){var engine={name:undefined$1,version:undefined$1};mapper.rgx.call(engine,ua,rgxmap.engine);return engine};this.getOS=function(){var os={name:undefined$1,version:undefined$1};mapper.rgx.call(os,ua,rgxmap.os);return os};this.getResult=function(){return {ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}};this.getUA=function(){return ua};this.setUA=function(uastring){ua=uastring;return this};return this};UAParser.VERSION=LIBVERSION;UAParser.BROWSER={NAME:NAME,MAJOR:MAJOR,VERSION:VERSION};UAParser.CPU={ARCHITECTURE:ARCHITECTURE};UAParser.DEVICE={MODEL:MODEL,VENDOR:VENDOR,TYPE:TYPE,CONSOLE:CONSOLE,MOBILE:MOBILE,SMARTTV:SMARTTV,TABLET:TABLET,WEARABLE:WEARABLE,EMBEDDED:EMBEDDED};UAParser.ENGINE={NAME:NAME,VERSION:VERSION};UAParser.OS={NAME:NAME,VERSION:VERSION};if(typeof exports!==UNDEF_TYPE){if(typeof module!==UNDEF_TYPE&&module.exports){exports=module.exports=UAParser;}exports.UAParser=UAParser;}else{if(__webpack_require__(2)){!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(){return UAParser}).call(exports, __webpack_require__, exports, module),
  				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined$1 && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));}else if(window){window.UAParser=UAParser;}}var $=window&&(window.jQuery||window.Zepto);if(typeof $!==UNDEF_TYPE){var parser=new UAParser;$.ua=parser.getResult();$.ua.get=function(){return parser.getUA()};$.ua.set=function(uastring){parser.setUA(uastring);var result=parser.getResult();for(var prop in result){$.ua[prop]=result[prop];}};}})(typeof window==="object"?window:this);

  /***/ }),
  /* 2 */
  /***/ (function(module, exports) {

  /* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
  module.exports = __webpack_amd_options__;

  /* WEBPACK VAR INJECTION */}.call(exports, {}));

  /***/ }),
  /* 3 */
  /***/ (function(module, exports, __webpack_require__) {


  var DEVICE_TYPES = {
    MOBILE: "mobile",
    TABLET: "tablet",
    SMART_TV: "smarttv",
    CONSOLE: "console",
    WEARABLE: "wearable",
    BROWSER: undefined
  };

  var BROWSER_TYPES = {
    CHROME: "Chrome",
    FIREFOX: "Firefox",
    OPERA: "Opera",
    YANDEX: "Yandex",
    SAFARI: "Safari",
    INTERNET_EXPLORER: "Internet Explorer",
    EDGE: "Edge",
    CHROMIUM: "Chromium",
    IE: "IE",
    MOBILE_SAFARI: "Mobile Safari"
  };

  var OS_TYPES = {
    IOS: "iOS",
    ANDROID: "Android",
    WINDOWS_PHONE: "Windows Phone"
  };

  var defaultData = {
    isMobile: false,
    isTablet: false,
    isBrowser: false,
    isSmartTV: false,
    isConsole: false,
    isWearable: false
  };

  module.exports = { BROWSER_TYPES: BROWSER_TYPES, DEVICE_TYPES: DEVICE_TYPES, OS_TYPES: OS_TYPES, defaultData: defaultData };

  /***/ })
  /******/ ]);
  });

  unwrapExports(dist);
  var dist_1 = dist.isMobile;

  var vueDragscroll_min = createCommonjsModule(function (module, exports) {
  !function(e,t){module.exports=t();}("undefined"!=typeof self?self:commonjsGlobal,function(){return function(e){function t(n){if(o[n])return o[n].exports;var r=o[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var o={};return t.m=e,t.c=o,t.d=function(e,o,n){t.o(e,o)||Object.defineProperty(e,o,{configurable:!1,enumerable:!0,get:n});},t.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(o,"a",o),o},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/dist/",t(t.s=0)}([function(e,t,o){Object.defineProperty(t,"__esModule",{value:!0}),t.dragscroll=void 0;var n=o(1),r=function(e){return e&&e.__esModule?e:{default:e}}(n),i={install:function(e,t){var o=Number(e.version.split(".")[0]),n=Number(e.version.split(".")[1]);if(o<2&&n<1)throw new Error("v-dragscroll supports vue version 2.1 and above. You are using Vue@"+e.version+". Please upgrade to the latest version of Vue.");e.directive("dragscroll",r.default);}};"undefined"!=typeof window&&window.Vue&&(window.VueDragscroll=i,window.Vue.use(i)),t.dragscroll=r.default,t.default=i;},function(e,t,o){Object.defineProperty(t,"__esModule",{value:!0});var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=o(2),i=function(e){return e&&e.__esModule?e:{default:e}}(r),l=["mousedown","touchstart"],d=["mousemove","touchmove"],s=["mouseup","touchend"],u=function(e,t,o){var r=e,u=!0;"boolean"==typeof t.value?u=t.value:"object"===n(t.value)?("string"==typeof t.value.target?(r=e.querySelector(t.value.target))||console.error("There is no element with the current target value."):void 0!==t.value.target&&console.error("The parameter \"target\" should be be either 'undefined' or 'string'."),"boolean"==typeof t.value.active?u=t.value.active:void 0!==t.value.active&&console.error("The parameter \"active\" value should be either 'undefined', 'true' or 'false'.")):void 0!==t.value&&console.error("The passed value should be either 'undefined', 'true' or 'false' or 'object'.");var a=function(){var e=void 0,n=void 0,u=void 0,a=!1,c=!1;r.md=function(o){o.preventDefault();var i=o instanceof window.MouseEvent,l=i?o.pageX:o.touches[0].pageX,d=i?o.pageY:o.touches[0].pageY,s=document.elementFromPoint(l-window.pageXOffset,d-window.pageYOffset),a="nochilddrag"===t.arg,f=t.modifiers.noleft,v=t.modifiers.noright,m=t.modifiers.nomiddle,p=t.modifiers.noback,w=t.modifiers.noforward,h="firstchilddrag"===t.arg,y=s===r,g=s===r.firstChild,b=a?void 0!==s.dataset.dragscroll:void 0===s.dataset.noDragscroll;(y||b&&(!h||g))&&(1===o.which&&f||2===o.which&&m||3===o.which&&v||4===o.which&&p||5===o.which&&w||(u=1,e=i?o.clientX:o.touches[0].clientX,n=i?o.clientY:o.touches[0].clientY,"touchstart"===o.type&&(c=!0)));},r.mu=function(e){u=0,a&&i.default.emitEvent(o,"dragscrollend"),a=!1,"touchend"===e.type&&!0===c?(e.target.click(),c=!1):e.target.focus();},r.mm=function(l){var d=l instanceof window.MouseEvent,s=void 0,c=void 0,f={};if(u){a||i.default.emitEvent(o,"dragscrollstart"),a=!0;var v=r.scrollLeft+r.clientWidth>=r.scrollWidth||0===r.scrollLeft,m=r.scrollTop+r.clientHeight>=r.scrollHeight||0===r.scrollTop;s=-e+(e=d?l.clientX:l.touches[0].clientX),c=-n+(n=d?l.clientY:l.touches[0].clientY),t.modifiers.pass?(r.scrollLeft-=t.modifiers.y?-0:s,r.scrollTop-=t.modifiers.x?-0:c,r===document.body&&(r.scrollLeft-=t.modifiers.y?-0:s,r.scrollTop-=t.modifiers.x?-0:c),(v||t.modifiers.y)&&window.scrollBy(-s,0),(m||t.modifiers.x)&&window.scrollBy(0,-c)):(t.modifiers.x&&(c=-0),t.modifiers.y&&(s=-0),r.scrollLeft-=s,r.scrollTop-=c,r===document.body&&(r.scrollLeft-=s,r.scrollTop-=c)),f.deltaX=-s,f.deltaY=-c,i.default.emitEvent(o,"dragscrollmove",f);}},i.default.addEventListeners(r,l,r.md),i.default.addEventListeners(window,s,r.mu),i.default.addEventListeners(window,d,r.mm);};u?"complete"===document.readyState?a():window.addEventListener("load",a):(i.default.removeEventListeners(r,l,r.md),i.default.removeEventListeners(window,s,r.mu),i.default.removeEventListeners(window,d,r.mm));};t.default={bind:function(e,t,o){u(e,t,o);},update:function(e,t,o,n){JSON.stringify(t.value)!==JSON.stringify(t.oldValue)&&u(e,t,o);},unbind:function(e,t,o){var n=e;i.default.removeEventListeners(n,l,n.md),i.default.removeEventListeners(window,s,n.mu),i.default.removeEventListeners(window,d,n.mm);}};},function(e,t,o){Object.defineProperty(t,"__esModule",{value:!0}),t.default={addEventListeners:function(e,t,o){for(var n=0,r=t.length;n<r;n++)e.addEventListener(t[n],o);},removeEventListeners:function(e,t,o){for(var n=0,r=t.length;n<r;n++)e.removeEventListener(t[n],o);},emitEvent:function(e,t,o){if(e.componentInstance)e.componentInstance.$emit(t,o);else{var n=void 0;"function"==typeof window.CustomEvent?n=new window.CustomEvent(t,{detail:o}):(n=document.createEvent("CustomEvent"),n.initCustomEvent(t,!0,!0,o)),e.elm.dispatchEvent(n);}}};}])});

  });

  unwrapExports(vueDragscroll_min);
  var vueDragscroll_min_1 = vueDragscroll_min.dragscroll;
  var vueDragscroll_min_2 = vueDragscroll_min.VueDragScroll;

  var DateSelectList = {
  render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"datepicker-list-wrapper noselect"},[_c('ul',{directives:[{name:"dragscroll",rawName:"v-dragscroll",value:(!_vm.isMobile && _vm.dragscrollEnabled),expression:"!isMobile && dragscrollEnabled"}],ref:"list",staticClass:"datepicker-dropdown-list",attrs:{"id":_vm.name + '-dropdown',"tabindex":"-1"},on:{"scroll":function($event){!_vm.clickActive && !_vm.dragscrollActive && _vm.scrolled($event);},"mousedown":_vm.mousewheelTriggered,"touchstart":_vm.mousewheelTriggered,"touchmove":_vm.mousewheelTriggered,"dragscrollmove":_vm.onDragscrollMove,"dragscrollend":_vm.selectByScrollPos,"mousewheel":_vm.mousewheelTriggered}},[_vm._l((3),function(i){return _c('li',{key:_vm.name + '-before-' + i,on:{"mousedown":function($event){$event.preventDefault();$event.stopPropagation();}}})}),_vm._v(" "),_vm._l((_vm.items),function(item,i){return _c('li',{key:_vm.name + '-' + i,staticClass:"item",class:{'focused-item': (item == _vm.selectedItem)},attrs:{"id":_vm.name + '-'+ i,"data-selectable":""},on:{"click":function($event){!_vm.dragscrollActive && _vm.selectByClick(item,i,$event);}}},[_c('span',[_vm._v(_vm._s(item))])])}),_vm._v(" "),_vm._l((3),function(i){return _c('li',{key:_vm.name + '-after-' + i,on:{"mousedown":function($event){$event.preventDefault();$event.stopPropagation();}}})})],2)])},
  staticRenderFns: [],
    directives: {
      dragscroll: vueDragscroll_min_1
    },
    props: {
      name: String,
      startingAt: Number,
      items: {
        type: Array,
        default: () => []
      },
      value: {
        type: [String, Number],
        default: null
      },
      valueType: {
        type: String,
        default: "value"
      },
      dropdownVisible: Boolean,
      dragscrollEnabled: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        selectedItem: null,
        selectedItemIndex: null,
        selectActive: false,
        selectionActive: false,
        scroll: scroller(),
        scrollTimeout: null,
        scrollCancel: null,
        scrollSelectionTimeout: null,
        dragscrollActive: false,
        clickActive: false,
        initialize: true,
        itemHeight: 35.703,
        isMobile: false
      };
    },
    mounted() {
      var self = this;
      self.isMobile = dist_1;
      // Polyfill for IE9
      // this.$refs.list.addEventListener("wheel", function() {
      //   self.mousewheelTriggered();
      // });
    },
    watch: {
      dropdownVisible: function(newval) {
        if (newval && this.initialize) {
          this.scrollToElementAt(this.startingAt);
        } else if (newval && this.selectedItem && this.selectedItemIndex) {
          this.scrollToElementAt(this.selectedItemIndex);
        } else if (!newval && this.scrollCancel) {
          this.scrollCancel();
          this.scrollCancel = null;
          this.selectByScrollPos();
        }
      }
    },
    methods: {
      selectByScrollPos: function() {
        var self = this;
        var list = self.$refs.list;
        var fromTop = list.scrollTop + self.itemHeight / 2;
        var itemId = Math.floor(fromTop / self.itemHeight);
        var item = self.items[itemId];
        self.select(item, itemId);
      },
      selectByClick: function(item, i, $event) {
        this.initialize = false;
        this.clickActive = true;
        this.select(item, i, $event);
      },
      select: function(item, i) {
        var self = this;
        // Reset everything
        self.resetTimeout();
        if (!self.dropdownVisible) return false;

        // If its first system-scroll then ignore the selection of the elements
        if (!self.initialize) {
          this.$nextTick(function() {
            self.scrollTimeout = setTimeout(function() {
              self.scrollToElementAt(i);
            }, 1);
            this.selectedItem = item;
            this.selectedItemIndex = i;
            this.$emit("input", self.valueType === "index" ? i + 1 : item);
          });
        }
      },
      scrollToElementAt: function(at) {
        var self = this;
        this.$nextTick(function() {
          var id = self.getIdForElementAt(at);

          self.scrollCancel = self.scroll(id, 300, {
            container: "#" + self.$refs.list.id,
            offset: -107.5,
            cancellable: true,
            onStart: function() {
              self.selectionActive = true;
            },
            onDone: function() {
              self.selectionActive = false;
              self.dragscrollActive = false;
              self.clickActive = false;
            },
            onCancel: function() {
              self.selectionActive = false;
              self.scrollCancel = null;
              self.dragscrollActive = false;
              self.clickActive = false;
            }
          });
        });
      },
      getIdForElementAt: function(at) {
        return "#" + this.name + "-" + at;
      },
      scrolled() {
        var self = this;
        self.resetTimeout();
        if (!self.selectionActive)
          self.scrollSelectionTimeout = setTimeout(function() {
            self.selectByScrollPos();
            if (self.initialize) self.initialize = !self.initialize;
          }, 150);
      },
      onDragscrollMove() {
        this.dragscrollActive = true;
      },
      clearScrollCancel() {
        if (this.scrollCancel) {
          this.scrollCancel();
          this.scrollCancel = null;
        }
      },
      mousewheelTriggered: function() {
        this.clearScrollCancel();
        // this.clickActive = false;
        this.initialize = false;
      },
      resetTimeout: function() {
        var self = this;

        if (self.scrollTimeout) {
          clearTimeout(self.scrollTimeout);
          self.scrollTimeout = null;
        }
        if (self.scrollSelectionTimeout) {
          clearTimeout(self.scrollSelectionTimeout);
          self.scrollSelectionTimeout = null;
        }
      }
    }
  };

  var months = {
    "de_DE": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    "en_EN": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  };

  var DateSelect = {
  render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"datepickerWrapper",staticClass:"datepicker-wrapper",staticStyle:{"position":"relative"},attrs:{"id":"datepicker-wrapper","tabindex":"-1"},on:{"focusout":_vm.focusOut}},[_c('div',{staticClass:"datepicker-inner row"},[_c('div',{staticClass:"datepicker-input-wrapper",class:(_vm.dropdownVisible)? 'open' : 'closed'},[_c('div',{staticClass:"datepicker form-control",class:{'has-error': _vm.hasError },attrs:{"id":"datepicker","type":"text","readonly":"true"},on:{"!click":function($event){return _vm.toggleDropdownVisible($event)}}},[_c('span',{staticClass:"caret"}),_vm._v("\n        "+_vm._s(_vm.datepickerValue)+"\n      ")])]),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.dropdownVisible),expression:"dropdownVisible"}],staticClass:"datepicker-dropdowns",staticStyle:{"display":"flex"}},[_c('DateSelectList',{ref:"daysList",style:(_vm.listStyles.daysList),attrs:{"name":"days","items":_vm.daysComputed,"startingAt":_vm.startDay - 1,"dropdownVisible":_vm.dropdownVisible,"dragscrollEnabled":_vm.dragscroll},model:{value:(_vm.value.day),callback:function ($$v) {_vm.$set(_vm.value, "day", $$v);},expression:"value.day"}}),_vm._v(" "),_c('DateSelectList',{ref:"monthsList",style:(_vm.listStyles.monthsList),attrs:{"name":"months","items":_vm.monthsComputed,"startingAt":_vm.startMonth - 1,"dropdownVisible":_vm.dropdownVisible,"value-type":"index","dragscrollEnabled":_vm.dragscroll},model:{value:(_vm.value.month),callback:function ($$v) {_vm.$set(_vm.value, "month", $$v);},expression:"value.month"}}),_vm._v(" "),_c('DateSelectList',{ref:"yearsList",style:(_vm.listStyles.yearsList),attrs:{"name":"years","items":_vm.yearsComputed,"startingAt":_vm.startYearComputed,"dropdownVisible":_vm.dropdownVisible,"dragscrollEnabled":_vm.dragscroll},model:{value:(_vm.value.year),callback:function ($$v) {_vm.$set(_vm.value, "year", $$v);},expression:"value.year"}}),_vm._v(" "),_c('div',{staticClass:"focused-liner"})],1)])])},
  staticRenderFns: [],
    components: {
      DateSelectList
    },
    props: {
      value: {
        type: Object,
        default: () => ({
          month: null,
          year: null,
          day: null
        })
      },
      dateFormat: {
        type: String,
        default: "dd.mm.yyyy"
      },
      yearRange: {
        type: [Number, Array],
        default: () => [1900, new Date().getFullYear()]
      },
      startDay: {
        type: Number,
        default: 15
      },
      startMonth: {
        type: Number,
        default: 6
      },
      startYear: {
        type: Number,
        default: 1965
      },
      locale: {
        type: String,
        default: "en_EN",
        validator: function(value) {
          return ["en_EN", "de_DE"].indexOf(value) !== -1;
        }
      },
      hasError: {
        type: Boolean,
        default: false
      },
      dragscroll: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        dropdownVisible: false,
        slotDeterminationRegex: /^(.*)[-/.\s](.*)[-/.\s](.{0,4})$/,
        separatorDeterminationRegex: /^.*([-/.\s]).*([-/.\s]).{0,4}$/,
        defaultSeparator: ["-", "-"]
      };
    },
    watch: {
      value(nv) {
        if (nv.day && nv.month && nv.year) this.$emit("complete", nv);
      }
    },
    beforeMount() {
      if (!this.value) {
        this.$emit("input", { day: null, month: null, year: null });
      }
    },
    methods: {
      toggleDropdownVisible() {
        this.dropdownVisible = !this.dropdownVisible;
      },
      close() {
        this.dropdownVisible = false;
      },
      datepickerFocused() {
        this.dropdownVisible = true;
      },
      isDescendant(parent, child) {
        var node = child.parentNode;
        while (node != null) {
          if (node == parent) {
            return true;
          }
          node = node.parentNode;
        }
        return false;
      },
      focusOut(e) {
        if (!e.relatedTarget) return this.close();
        else if (this.isDescendant(this.$refs.datepickerWrapper, e.relatedTarget))
          return false;
      }
    },
    computed: {
      yearsComputed: function() {
        var arr = [];
        let low = this.yearRange[0],
          high = this.yearRange[1];
        while (low <= high) arr.push(low++);

        return arr;
      },
      startYearComputed() {
        return this.yearsComputed.indexOf(this.startYear);
      },
      daysComputed: function() {
        var y = this.year,
          m = this.month;
        let mlength;
        if (m == null) mlength = 31;
        else if (m === "02")
          mlength = 28 + (!(y & 3) && (y % 100 !== 0 || !(y & 15)));
        else mlength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];

        var days = [];
        while (days.length != mlength) days[days.length] = days.length + 1;
        return days;
      },
      monthsComputed() {
        return months[this.locale];
      },
      dayMasked: function() {
        if (!this.value || !this.value.day) return "DD";
        else if (this.value.day < 10) return "0" + this.value.day.toString();
        else return this.value.day;
      },
      monthMasked: function() {
        if (!this.value || !this.value.month) return "MM";
        else if (this.value.month < 10) return "0" + this.value.month.toString();
        else return this.value.month;
      },
      yearMasked: function() {
        return !this.value || !this.value.year ? "YYYY" : this.value.year;
      },
      datepickerValue: function() {
        return [
          this[this.listOrder[0] + "Masked"],
          this.separators[0],
          this[this.listOrder[1] + "Masked"],
          this.separators[1],
          this[this.listOrder[2] + "Masked"]
        ].join("");
      },
      listStyles() {
        return {
          daysList: {
            order: this.listOrder.indexOf("day") + 1
          },
          monthsList: {
            order: this.listOrder.indexOf("month") + 1
          },
          yearsList: {
            order: this.listOrder.indexOf("year") + 1
          }
        };
      },
      listOrder() {
        let slots = new RegExp(this.slotDeterminationRegex).exec(this.dateFormat);
        let order;
        if (slots) {
          slots = slots.slice(1, 4);
          order = {
            days: slots.indexOf("dd"),
            months: slots.indexOf("mm"),
            years: slots.indexOf("yyyy")
          };
        }
        let arr = [];
        arr[order.days + "" || 0] = "day";
        arr[order.months + "" || 1] = "month";
        arr[order.years + "" || 2] = "year";

        return arr;
      },
      separators() {
        let separators = new RegExp(this.separatorDeterminationRegex).exec(
          this.dateFormat
        );
        if (separators) {
          return separators.slice(1, 3);
        }
        return this.defaultSeparator;
      }
    }
  };

  function install(Vue) {
    if (install.installed) return;
    install.installed = true;
    Vue.component('DateSelect', DateSelect);
  } // Create module definition for Vue.use()

  var plugin = {
    install: install
  }; // Auto-install when vue is found (eg. in browser via <script> tag)

  var GlobalVue = null;

  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(plugin);
  } // To allow use as module (npm/webpack/etc.) export component

  exports.DateSelect = DateSelect;
  exports.install = install;

  return exports;

}({}));
//# sourceMappingURL=vue-date-select.js.map
