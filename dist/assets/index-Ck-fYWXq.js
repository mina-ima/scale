(function () {
  const o = document.createElement('link').relList;
  if (o && o.supports && o.supports('modulepreload')) return;
  for (const h of document.querySelectorAll('link[rel="modulepreload"]')) r(h);
  new MutationObserver((h) => {
    for (const g of h)
      if (g.type === 'childList')
        for (const E of g.addedNodes)
          E.tagName === 'LINK' && E.rel === 'modulepreload' && r(E);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(h) {
    const g = {};
    return (
      h.integrity && (g.integrity = h.integrity),
      h.referrerPolicy && (g.referrerPolicy = h.referrerPolicy),
      h.crossOrigin === 'use-credentials'
        ? (g.credentials = 'include')
        : h.crossOrigin === 'anonymous'
          ? (g.credentials = 'omit')
          : (g.credentials = 'same-origin'),
      g
    );
  }
  function r(h) {
    if (h.ep) return;
    h.ep = !0;
    const g = s(h);
    fetch(h.href, g);
  }
})();
function Jd(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, 'default')
    ? i.default
    : i;
}
var pf = { exports: {} },
  Ou = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var _d;
function N0() {
  if (_d) return Ou;
  _d = 1;
  var i = Symbol.for('react.transitional.element'),
    o = Symbol.for('react.fragment');
  function s(r, h, g) {
    var E = null;
    if (
      (g !== void 0 && (E = '' + g),
      h.key !== void 0 && (E = '' + h.key),
      'key' in h)
    ) {
      g = {};
      for (var O in h) O !== 'key' && (g[O] = h[O]);
    } else g = h;
    return (
      (h = g.ref),
      { $$typeof: i, type: r, key: E, ref: h !== void 0 ? h : null, props: g }
    );
  }
  return ((Ou.Fragment = o), (Ou.jsx = s), (Ou.jsxs = s), Ou);
}
var xd;
function H0() {
  return (xd || ((xd = 1), (pf.exports = N0())), pf.exports);
}
var nt = H0(),
  Ef = { exports: {} },
  tt = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ud;
function C0() {
  if (Ud) return tt;
  Ud = 1;
  var i = Symbol.for('react.transitional.element'),
    o = Symbol.for('react.portal'),
    s = Symbol.for('react.fragment'),
    r = Symbol.for('react.strict_mode'),
    h = Symbol.for('react.profiler'),
    g = Symbol.for('react.consumer'),
    E = Symbol.for('react.context'),
    O = Symbol.for('react.forward_ref'),
    b = Symbol.for('react.suspense'),
    m = Symbol.for('react.memo'),
    R = Symbol.for('react.lazy'),
    H = Symbol.iterator;
  function C(v) {
    return v === null || typeof v != 'object'
      ? null
      : ((v = (H && v[H]) || v['@@iterator']),
        typeof v == 'function' ? v : null);
  }
  var G = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    V = Object.assign,
    F = {};
  function L(v, N, X) {
    ((this.props = v),
      (this.context = N),
      (this.refs = F),
      (this.updater = X || G));
  }
  ((L.prototype.isReactComponent = {}),
    (L.prototype.setState = function (v, N) {
      if (typeof v != 'object' && typeof v != 'function' && v != null)
        throw Error(
          'takes an object of state variables to update or a function which returns an object of state variables.'
        );
      this.updater.enqueueSetState(this, v, N, 'setState');
    }),
    (L.prototype.forceUpdate = function (v) {
      this.updater.enqueueForceUpdate(this, v, 'forceUpdate');
    }));
  function Y() {}
  Y.prototype = L.prototype;
  function B(v, N, X) {
    ((this.props = v),
      (this.context = N),
      (this.refs = F),
      (this.updater = X || G));
  }
  var w = (B.prototype = new Y());
  ((w.constructor = B), V(w, L.prototype), (w.isPureReactComponent = !0));
  var ct = Array.isArray,
    K = { H: null, A: null, T: null, S: null, V: null },
    _t = Object.prototype.hasOwnProperty;
  function Ot(v, N, X, q, J, ft) {
    return (
      (X = ft.ref),
      { $$typeof: i, type: v, key: N, ref: X !== void 0 ? X : null, props: ft }
    );
  }
  function Ct(v, N) {
    return Ot(v.type, N, void 0, void 0, void 0, v.props);
  }
  function Rt(v) {
    return typeof v == 'object' && v !== null && v.$$typeof === i;
  }
  function It(v) {
    var N = { '=': '=0', ':': '=2' };
    return (
      '$' +
      v.replace(/[=:]/g, function (X) {
        return N[X];
      })
    );
  }
  var oe = /\/+/g;
  function Qt(v, N) {
    return typeof v == 'object' && v !== null && v.key != null
      ? It('' + v.key)
      : N.toString(36);
  }
  function El() {}
  function Tl(v) {
    switch (v.status) {
      case 'fulfilled':
        return v.value;
      case 'rejected':
        throw v.reason;
      default:
        switch (
          (typeof v.status == 'string'
            ? v.then(El, El)
            : ((v.status = 'pending'),
              v.then(
                function (N) {
                  v.status === 'pending' &&
                    ((v.status = 'fulfilled'), (v.value = N));
                },
                function (N) {
                  v.status === 'pending' &&
                    ((v.status = 'rejected'), (v.reason = N));
                }
              )),
          v.status)
        ) {
          case 'fulfilled':
            return v.value;
          case 'rejected':
            throw v.reason;
        }
    }
    throw v;
  }
  function Zt(v, N, X, q, J) {
    var ft = typeof v;
    (ft === 'undefined' || ft === 'boolean') && (v = null);
    var I = !1;
    if (v === null) I = !0;
    else
      switch (ft) {
        case 'bigint':
        case 'string':
        case 'number':
          I = !0;
          break;
        case 'object':
          switch (v.$$typeof) {
            case i:
            case o:
              I = !0;
              break;
            case R:
              return ((I = v._init), Zt(I(v._payload), N, X, q, J));
          }
      }
    if (I)
      return (
        (J = J(v)),
        (I = q === '' ? '.' + Qt(v, 0) : q),
        ct(J)
          ? ((X = ''),
            I != null && (X = I.replace(oe, '$&/') + '/'),
            Zt(J, N, X, '', function (ke) {
              return ke;
            }))
          : J != null &&
            (Rt(J) &&
              (J = Ct(
                J,
                X +
                  (J.key == null || (v && v.key === J.key)
                    ? ''
                    : ('' + J.key).replace(oe, '$&/') + '/') +
                  I
              )),
            N.push(J)),
        1
      );
    I = 0;
    var te = q === '' ? '.' : q + ':';
    if (ct(v))
      for (var bt = 0; bt < v.length; bt++)
        ((q = v[bt]), (ft = te + Qt(q, bt)), (I += Zt(q, N, X, ft, J)));
    else if (((bt = C(v)), typeof bt == 'function'))
      for (v = bt.call(v), bt = 0; !(q = v.next()).done; )
        ((q = q.value), (ft = te + Qt(q, bt++)), (I += Zt(q, N, X, ft, J)));
    else if (ft === 'object') {
      if (typeof v.then == 'function') return Zt(Tl(v), N, X, q, J);
      throw (
        (N = String(v)),
        Error(
          'Objects are not valid as a React child (found: ' +
            (N === '[object Object]'
              ? 'object with keys {' + Object.keys(v).join(', ') + '}'
              : N) +
            '). If you meant to render a collection of children, use an array instead.'
        )
      );
    }
    return I;
  }
  function D(v, N, X) {
    if (v == null) return v;
    var q = [],
      J = 0;
    return (
      Zt(v, q, '', '', function (ft) {
        return N.call(X, ft, J++);
      }),
      q
    );
  }
  function j(v) {
    if (v._status === -1) {
      var N = v._result;
      ((N = N()),
        N.then(
          function (X) {
            (v._status === 0 || v._status === -1) &&
              ((v._status = 1), (v._result = X));
          },
          function (X) {
            (v._status === 0 || v._status === -1) &&
              ((v._status = 2), (v._result = X));
          }
        ),
        v._status === -1 && ((v._status = 0), (v._result = N)));
    }
    if (v._status === 1) return v._result.default;
    throw v._result;
  }
  var W =
    typeof reportError == 'function'
      ? reportError
      : function (v) {
          if (
            typeof window == 'object' &&
            typeof window.ErrorEvent == 'function'
          ) {
            var N = new window.ErrorEvent('error', {
              bubbles: !0,
              cancelable: !0,
              message:
                typeof v == 'object' &&
                v !== null &&
                typeof v.message == 'string'
                  ? String(v.message)
                  : String(v),
              error: v,
            });
            if (!window.dispatchEvent(N)) return;
          } else if (
            typeof process == 'object' &&
            typeof process.emit == 'function'
          ) {
            process.emit('uncaughtException', v);
            return;
          }
          console.error(v);
        };
  function yt() {}
  return (
    (tt.Children = {
      map: D,
      forEach: function (v, N, X) {
        D(
          v,
          function () {
            N.apply(this, arguments);
          },
          X
        );
      },
      count: function (v) {
        var N = 0;
        return (
          D(v, function () {
            N++;
          }),
          N
        );
      },
      toArray: function (v) {
        return (
          D(v, function (N) {
            return N;
          }) || []
        );
      },
      only: function (v) {
        if (!Rt(v))
          throw Error(
            'React.Children.only expected to receive a single React element child.'
          );
        return v;
      },
    }),
    (tt.Component = L),
    (tt.Fragment = s),
    (tt.Profiler = h),
    (tt.PureComponent = B),
    (tt.StrictMode = r),
    (tt.Suspense = b),
    (tt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = K),
    (tt.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (v) {
        return K.H.useMemoCache(v);
      },
    }),
    (tt.cache = function (v) {
      return function () {
        return v.apply(null, arguments);
      };
    }),
    (tt.cloneElement = function (v, N, X) {
      if (v == null)
        throw Error(
          'The argument must be a React element, but you passed ' + v + '.'
        );
      var q = V({}, v.props),
        J = v.key,
        ft = void 0;
      if (N != null)
        for (I in (N.ref !== void 0 && (ft = void 0),
        N.key !== void 0 && (J = '' + N.key),
        N))
          !_t.call(N, I) ||
            I === 'key' ||
            I === '__self' ||
            I === '__source' ||
            (I === 'ref' && N.ref === void 0) ||
            (q[I] = N[I]);
      var I = arguments.length - 2;
      if (I === 1) q.children = X;
      else if (1 < I) {
        for (var te = Array(I), bt = 0; bt < I; bt++)
          te[bt] = arguments[bt + 2];
        q.children = te;
      }
      return Ot(v.type, J, void 0, void 0, ft, q);
    }),
    (tt.createContext = function (v) {
      return (
        (v = {
          $$typeof: E,
          _currentValue: v,
          _currentValue2: v,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (v.Provider = v),
        (v.Consumer = { $$typeof: g, _context: v }),
        v
      );
    }),
    (tt.createElement = function (v, N, X) {
      var q,
        J = {},
        ft = null;
      if (N != null)
        for (q in (N.key !== void 0 && (ft = '' + N.key), N))
          _t.call(N, q) &&
            q !== 'key' &&
            q !== '__self' &&
            q !== '__source' &&
            (J[q] = N[q]);
      var I = arguments.length - 2;
      if (I === 1) J.children = X;
      else if (1 < I) {
        for (var te = Array(I), bt = 0; bt < I; bt++)
          te[bt] = arguments[bt + 2];
        J.children = te;
      }
      if (v && v.defaultProps)
        for (q in ((I = v.defaultProps), I)) J[q] === void 0 && (J[q] = I[q]);
      return Ot(v, ft, void 0, void 0, null, J);
    }),
    (tt.createRef = function () {
      return { current: null };
    }),
    (tt.forwardRef = function (v) {
      return { $$typeof: O, render: v };
    }),
    (tt.isValidElement = Rt),
    (tt.lazy = function (v) {
      return { $$typeof: R, _payload: { _status: -1, _result: v }, _init: j };
    }),
    (tt.memo = function (v, N) {
      return { $$typeof: m, type: v, compare: N === void 0 ? null : N };
    }),
    (tt.startTransition = function (v) {
      var N = K.T,
        X = {};
      K.T = X;
      try {
        var q = v(),
          J = K.S;
        (J !== null && J(X, q),
          typeof q == 'object' &&
            q !== null &&
            typeof q.then == 'function' &&
            q.then(yt, W));
      } catch (ft) {
        W(ft);
      } finally {
        K.T = N;
      }
    }),
    (tt.unstable_useCacheRefresh = function () {
      return K.H.useCacheRefresh();
    }),
    (tt.use = function (v) {
      return K.H.use(v);
    }),
    (tt.useActionState = function (v, N, X) {
      return K.H.useActionState(v, N, X);
    }),
    (tt.useCallback = function (v, N) {
      return K.H.useCallback(v, N);
    }),
    (tt.useContext = function (v) {
      return K.H.useContext(v);
    }),
    (tt.useDebugValue = function () {}),
    (tt.useDeferredValue = function (v, N) {
      return K.H.useDeferredValue(v, N);
    }),
    (tt.useEffect = function (v, N, X) {
      var q = K.H;
      if (typeof X == 'function')
        throw Error(
          'useEffect CRUD overload is not enabled in this build of React.'
        );
      return q.useEffect(v, N);
    }),
    (tt.useId = function () {
      return K.H.useId();
    }),
    (tt.useImperativeHandle = function (v, N, X) {
      return K.H.useImperativeHandle(v, N, X);
    }),
    (tt.useInsertionEffect = function (v, N) {
      return K.H.useInsertionEffect(v, N);
    }),
    (tt.useLayoutEffect = function (v, N) {
      return K.H.useLayoutEffect(v, N);
    }),
    (tt.useMemo = function (v, N) {
      return K.H.useMemo(v, N);
    }),
    (tt.useOptimistic = function (v, N) {
      return K.H.useOptimistic(v, N);
    }),
    (tt.useReducer = function (v, N, X) {
      return K.H.useReducer(v, N, X);
    }),
    (tt.useRef = function (v) {
      return K.H.useRef(v);
    }),
    (tt.useState = function (v) {
      return K.H.useState(v);
    }),
    (tt.useSyncExternalStore = function (v, N, X) {
      return K.H.useSyncExternalStore(v, N, X);
    }),
    (tt.useTransition = function () {
      return K.H.useTransition();
    }),
    (tt.version = '19.1.1'),
    tt
  );
}
var Nd;
function xf() {
  return (Nd || ((Nd = 1), (Ef.exports = C0())), Ef.exports);
}
var _ = xf();
const _u = Jd(_);
var Tf = { exports: {} },
  zu = {},
  Rf = { exports: {} },
  Af = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Hd;
function B0() {
  return (
    Hd ||
      ((Hd = 1),
      (function (i) {
        function o(D, j) {
          var W = D.length;
          D.push(j);
          t: for (; 0 < W; ) {
            var yt = (W - 1) >>> 1,
              v = D[yt];
            if (0 < h(v, j)) ((D[yt] = j), (D[W] = v), (W = yt));
            else break t;
          }
        }
        function s(D) {
          return D.length === 0 ? null : D[0];
        }
        function r(D) {
          if (D.length === 0) return null;
          var j = D[0],
            W = D.pop();
          if (W !== j) {
            D[0] = W;
            t: for (var yt = 0, v = D.length, N = v >>> 1; yt < N; ) {
              var X = 2 * (yt + 1) - 1,
                q = D[X],
                J = X + 1,
                ft = D[J];
              if (0 > h(q, W))
                J < v && 0 > h(ft, q)
                  ? ((D[yt] = ft), (D[J] = W), (yt = J))
                  : ((D[yt] = q), (D[X] = W), (yt = X));
              else if (J < v && 0 > h(ft, W))
                ((D[yt] = ft), (D[J] = W), (yt = J));
              else break t;
            }
          }
          return j;
        }
        function h(D, j) {
          var W = D.sortIndex - j.sortIndex;
          return W !== 0 ? W : D.id - j.id;
        }
        if (
          ((i.unstable_now = void 0),
          typeof performance == 'object' &&
            typeof performance.now == 'function')
        ) {
          var g = performance;
          i.unstable_now = function () {
            return g.now();
          };
        } else {
          var E = Date,
            O = E.now();
          i.unstable_now = function () {
            return E.now() - O;
          };
        }
        var b = [],
          m = [],
          R = 1,
          H = null,
          C = 3,
          G = !1,
          V = !1,
          F = !1,
          L = !1,
          Y = typeof setTimeout == 'function' ? setTimeout : null,
          B = typeof clearTimeout == 'function' ? clearTimeout : null,
          w = typeof setImmediate < 'u' ? setImmediate : null;
        function ct(D) {
          for (var j = s(m); j !== null; ) {
            if (j.callback === null) r(m);
            else if (j.startTime <= D)
              (r(m), (j.sortIndex = j.expirationTime), o(b, j));
            else break;
            j = s(m);
          }
        }
        function K(D) {
          if (((F = !1), ct(D), !V))
            if (s(b) !== null) ((V = !0), _t || ((_t = !0), Qt()));
            else {
              var j = s(m);
              j !== null && Zt(K, j.startTime - D);
            }
        }
        var _t = !1,
          Ot = -1,
          Ct = 5,
          Rt = -1;
        function It() {
          return L ? !0 : !(i.unstable_now() - Rt < Ct);
        }
        function oe() {
          if (((L = !1), _t)) {
            var D = i.unstable_now();
            Rt = D;
            var j = !0;
            try {
              t: {
                ((V = !1), F && ((F = !1), B(Ot), (Ot = -1)), (G = !0));
                var W = C;
                try {
                  e: {
                    for (
                      ct(D), H = s(b);
                      H !== null && !(H.expirationTime > D && It());

                    ) {
                      var yt = H.callback;
                      if (typeof yt == 'function') {
                        ((H.callback = null), (C = H.priorityLevel));
                        var v = yt(H.expirationTime <= D);
                        if (((D = i.unstable_now()), typeof v == 'function')) {
                          ((H.callback = v), ct(D), (j = !0));
                          break e;
                        }
                        (H === s(b) && r(b), ct(D));
                      } else r(b);
                      H = s(b);
                    }
                    if (H !== null) j = !0;
                    else {
                      var N = s(m);
                      (N !== null && Zt(K, N.startTime - D), (j = !1));
                    }
                  }
                  break t;
                } finally {
                  ((H = null), (C = W), (G = !1));
                }
                j = void 0;
              }
            } finally {
              j ? Qt() : (_t = !1);
            }
          }
        }
        var Qt;
        if (typeof w == 'function')
          Qt = function () {
            w(oe);
          };
        else if (typeof MessageChannel < 'u') {
          var El = new MessageChannel(),
            Tl = El.port2;
          ((El.port1.onmessage = oe),
            (Qt = function () {
              Tl.postMessage(null);
            }));
        } else
          Qt = function () {
            Y(oe, 0);
          };
        function Zt(D, j) {
          Ot = Y(function () {
            D(i.unstable_now());
          }, j);
        }
        ((i.unstable_IdlePriority = 5),
          (i.unstable_ImmediatePriority = 1),
          (i.unstable_LowPriority = 4),
          (i.unstable_NormalPriority = 3),
          (i.unstable_Profiling = null),
          (i.unstable_UserBlockingPriority = 2),
          (i.unstable_cancelCallback = function (D) {
            D.callback = null;
          }),
          (i.unstable_forceFrameRate = function (D) {
            0 > D || 125 < D
              ? console.error(
                  'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported'
                )
              : (Ct = 0 < D ? Math.floor(1e3 / D) : 5);
          }),
          (i.unstable_getCurrentPriorityLevel = function () {
            return C;
          }),
          (i.unstable_next = function (D) {
            switch (C) {
              case 1:
              case 2:
              case 3:
                var j = 3;
                break;
              default:
                j = C;
            }
            var W = C;
            C = j;
            try {
              return D();
            } finally {
              C = W;
            }
          }),
          (i.unstable_requestPaint = function () {
            L = !0;
          }),
          (i.unstable_runWithPriority = function (D, j) {
            switch (D) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                D = 3;
            }
            var W = C;
            C = D;
            try {
              return j();
            } finally {
              C = W;
            }
          }),
          (i.unstable_scheduleCallback = function (D, j, W) {
            var yt = i.unstable_now();
            switch (
              (typeof W == 'object' && W !== null
                ? ((W = W.delay),
                  (W = typeof W == 'number' && 0 < W ? yt + W : yt))
                : (W = yt),
              D)
            ) {
              case 1:
                var v = -1;
                break;
              case 2:
                v = 250;
                break;
              case 5:
                v = 1073741823;
                break;
              case 4:
                v = 1e4;
                break;
              default:
                v = 5e3;
            }
            return (
              (v = W + v),
              (D = {
                id: R++,
                callback: j,
                priorityLevel: D,
                startTime: W,
                expirationTime: v,
                sortIndex: -1,
              }),
              W > yt
                ? ((D.sortIndex = W),
                  o(m, D),
                  s(b) === null &&
                    D === s(m) &&
                    (F ? (B(Ot), (Ot = -1)) : (F = !0), Zt(K, W - yt)))
                : ((D.sortIndex = v),
                  o(b, D),
                  V || G || ((V = !0), _t || ((_t = !0), Qt()))),
              D
            );
          }),
          (i.unstable_shouldYield = It),
          (i.unstable_wrapCallback = function (D) {
            var j = C;
            return function () {
              var W = C;
              C = j;
              try {
                return D.apply(this, arguments);
              } finally {
                C = W;
              }
            };
          }));
      })(Af)),
    Af
  );
}
var Cd;
function q0() {
  return (Cd || ((Cd = 1), (Rf.exports = B0())), Rf.exports);
}
var Mf = { exports: {} },
  Kt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Bd;
function Y0() {
  if (Bd) return Kt;
  Bd = 1;
  var i = xf();
  function o(b) {
    var m = 'https://react.dev/errors/' + b;
    if (1 < arguments.length) {
      m += '?args[]=' + encodeURIComponent(arguments[1]);
      for (var R = 2; R < arguments.length; R++)
        m += '&args[]=' + encodeURIComponent(arguments[R]);
    }
    return (
      'Minified React error #' +
      b +
      '; visit ' +
      m +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  function s() {}
  var r = {
      d: {
        f: s,
        r: function () {
          throw Error(o(522));
        },
        D: s,
        C: s,
        L: s,
        m: s,
        X: s,
        S: s,
        M: s,
      },
      p: 0,
      findDOMNode: null,
    },
    h = Symbol.for('react.portal');
  function g(b, m, R) {
    var H =
      3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: h,
      key: H == null ? null : '' + H,
      children: b,
      containerInfo: m,
      implementation: R,
    };
  }
  var E = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function O(b, m) {
    if (b === 'font') return '';
    if (typeof m == 'string') return m === 'use-credentials' ? m : '';
  }
  return (
    (Kt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r),
    (Kt.createPortal = function (b, m) {
      var R =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!m || (m.nodeType !== 1 && m.nodeType !== 9 && m.nodeType !== 11))
        throw Error(o(299));
      return g(b, m, null, R);
    }),
    (Kt.flushSync = function (b) {
      var m = E.T,
        R = r.p;
      try {
        if (((E.T = null), (r.p = 2), b)) return b();
      } finally {
        ((E.T = m), (r.p = R), r.d.f());
      }
    }),
    (Kt.preconnect = function (b, m) {
      typeof b == 'string' &&
        (m
          ? ((m = m.crossOrigin),
            (m =
              typeof m == 'string'
                ? m === 'use-credentials'
                  ? m
                  : ''
                : void 0))
          : (m = null),
        r.d.C(b, m));
    }),
    (Kt.prefetchDNS = function (b) {
      typeof b == 'string' && r.d.D(b);
    }),
    (Kt.preinit = function (b, m) {
      if (typeof b == 'string' && m && typeof m.as == 'string') {
        var R = m.as,
          H = O(R, m.crossOrigin),
          C = typeof m.integrity == 'string' ? m.integrity : void 0,
          G = typeof m.fetchPriority == 'string' ? m.fetchPriority : void 0;
        R === 'style'
          ? r.d.S(b, typeof m.precedence == 'string' ? m.precedence : void 0, {
              crossOrigin: H,
              integrity: C,
              fetchPriority: G,
            })
          : R === 'script' &&
            r.d.X(b, {
              crossOrigin: H,
              integrity: C,
              fetchPriority: G,
              nonce: typeof m.nonce == 'string' ? m.nonce : void 0,
            });
      }
    }),
    (Kt.preinitModule = function (b, m) {
      if (typeof b == 'string')
        if (typeof m == 'object' && m !== null) {
          if (m.as == null || m.as === 'script') {
            var R = O(m.as, m.crossOrigin);
            r.d.M(b, {
              crossOrigin: R,
              integrity: typeof m.integrity == 'string' ? m.integrity : void 0,
              nonce: typeof m.nonce == 'string' ? m.nonce : void 0,
            });
          }
        } else m == null && r.d.M(b);
    }),
    (Kt.preload = function (b, m) {
      if (
        typeof b == 'string' &&
        typeof m == 'object' &&
        m !== null &&
        typeof m.as == 'string'
      ) {
        var R = m.as,
          H = O(R, m.crossOrigin);
        r.d.L(b, R, {
          crossOrigin: H,
          integrity: typeof m.integrity == 'string' ? m.integrity : void 0,
          nonce: typeof m.nonce == 'string' ? m.nonce : void 0,
          type: typeof m.type == 'string' ? m.type : void 0,
          fetchPriority:
            typeof m.fetchPriority == 'string' ? m.fetchPriority : void 0,
          referrerPolicy:
            typeof m.referrerPolicy == 'string' ? m.referrerPolicy : void 0,
          imageSrcSet:
            typeof m.imageSrcSet == 'string' ? m.imageSrcSet : void 0,
          imageSizes: typeof m.imageSizes == 'string' ? m.imageSizes : void 0,
          media: typeof m.media == 'string' ? m.media : void 0,
        });
      }
    }),
    (Kt.preloadModule = function (b, m) {
      if (typeof b == 'string')
        if (m) {
          var R = O(m.as, m.crossOrigin);
          r.d.m(b, {
            as: typeof m.as == 'string' && m.as !== 'script' ? m.as : void 0,
            crossOrigin: R,
            integrity: typeof m.integrity == 'string' ? m.integrity : void 0,
          });
        } else r.d.m(b);
    }),
    (Kt.requestFormReset = function (b) {
      r.d.r(b);
    }),
    (Kt.unstable_batchedUpdates = function (b, m) {
      return b(m);
    }),
    (Kt.useFormState = function (b, m, R) {
      return E.H.useFormState(b, m, R);
    }),
    (Kt.useFormStatus = function () {
      return E.H.useHostTransitionStatus();
    }),
    (Kt.version = '19.1.1'),
    Kt
  );
}
var qd;
function j0() {
  if (qd) return Mf.exports;
  qd = 1;
  function i() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (o) {
        console.error(o);
      }
  }
  return (i(), (Mf.exports = Y0()), Mf.exports);
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Yd;
function G0() {
  if (Yd) return zu;
  Yd = 1;
  var i = q0(),
    o = xf(),
    s = j0();
  function r(t) {
    var e = 'https://react.dev/errors/' + t;
    if (1 < arguments.length) {
      e += '?args[]=' + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        e += '&args[]=' + encodeURIComponent(arguments[l]);
    }
    return (
      'Minified React error #' +
      t +
      '; visit ' +
      e +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  function h(t) {
    return !(!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11));
  }
  function g(t) {
    var e = t,
      l = t;
    if (t.alternate) for (; e.return; ) e = e.return;
    else {
      t = e;
      do ((e = t), (e.flags & 4098) !== 0 && (l = e.return), (t = e.return));
      while (t);
    }
    return e.tag === 3 ? l : null;
  }
  function E(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (
        (e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)),
        e !== null)
      )
        return e.dehydrated;
    }
    return null;
  }
  function O(t) {
    if (g(t) !== t) throw Error(r(188));
  }
  function b(t) {
    var e = t.alternate;
    if (!e) {
      if (((e = g(t)), e === null)) throw Error(r(188));
      return e !== t ? null : t;
    }
    for (var l = t, a = e; ; ) {
      var u = l.return;
      if (u === null) break;
      var n = u.alternate;
      if (n === null) {
        if (((a = u.return), a !== null)) {
          l = a;
          continue;
        }
        break;
      }
      if (u.child === n.child) {
        for (n = u.child; n; ) {
          if (n === l) return (O(u), t);
          if (n === a) return (O(u), e);
          n = n.sibling;
        }
        throw Error(r(188));
      }
      if (l.return !== a.return) ((l = u), (a = n));
      else {
        for (var c = !1, f = u.child; f; ) {
          if (f === l) {
            ((c = !0), (l = u), (a = n));
            break;
          }
          if (f === a) {
            ((c = !0), (a = u), (l = n));
            break;
          }
          f = f.sibling;
        }
        if (!c) {
          for (f = n.child; f; ) {
            if (f === l) {
              ((c = !0), (l = n), (a = u));
              break;
            }
            if (f === a) {
              ((c = !0), (a = n), (l = u));
              break;
            }
            f = f.sibling;
          }
          if (!c) throw Error(r(189));
        }
      }
      if (l.alternate !== a) throw Error(r(190));
    }
    if (l.tag !== 3) throw Error(r(188));
    return l.stateNode.current === l ? t : e;
  }
  function m(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (((e = m(t)), e !== null)) return e;
      t = t.sibling;
    }
    return null;
  }
  var R = Object.assign,
    H = Symbol.for('react.element'),
    C = Symbol.for('react.transitional.element'),
    G = Symbol.for('react.portal'),
    V = Symbol.for('react.fragment'),
    F = Symbol.for('react.strict_mode'),
    L = Symbol.for('react.profiler'),
    Y = Symbol.for('react.provider'),
    B = Symbol.for('react.consumer'),
    w = Symbol.for('react.context'),
    ct = Symbol.for('react.forward_ref'),
    K = Symbol.for('react.suspense'),
    _t = Symbol.for('react.suspense_list'),
    Ot = Symbol.for('react.memo'),
    Ct = Symbol.for('react.lazy'),
    Rt = Symbol.for('react.activity'),
    It = Symbol.for('react.memo_cache_sentinel'),
    oe = Symbol.iterator;
  function Qt(t) {
    return t === null || typeof t != 'object'
      ? null
      : ((t = (oe && t[oe]) || t['@@iterator']),
        typeof t == 'function' ? t : null);
  }
  var El = Symbol.for('react.client.reference');
  function Tl(t) {
    if (t == null) return null;
    if (typeof t == 'function')
      return t.$$typeof === El ? null : t.displayName || t.name || null;
    if (typeof t == 'string') return t;
    switch (t) {
      case V:
        return 'Fragment';
      case L:
        return 'Profiler';
      case F:
        return 'StrictMode';
      case K:
        return 'Suspense';
      case _t:
        return 'SuspenseList';
      case Rt:
        return 'Activity';
    }
    if (typeof t == 'object')
      switch (t.$$typeof) {
        case G:
          return 'Portal';
        case w:
          return (t.displayName || 'Context') + '.Provider';
        case B:
          return (t._context.displayName || 'Context') + '.Consumer';
        case ct:
          var e = t.render;
          return (
            (t = t.displayName),
            t ||
              ((t = e.displayName || e.name || ''),
              (t = t !== '' ? 'ForwardRef(' + t + ')' : 'ForwardRef')),
            t
          );
        case Ot:
          return (
            (e = t.displayName || null),
            e !== null ? e : Tl(t.type) || 'Memo'
          );
        case Ct:
          ((e = t._payload), (t = t._init));
          try {
            return Tl(t(e));
          } catch {}
      }
    return null;
  }
  var Zt = Array.isArray,
    D = o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    j = s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    W = { pending: !1, data: null, method: null, action: null },
    yt = [],
    v = -1;
  function N(t) {
    return { current: t };
  }
  function X(t) {
    0 > v || ((t.current = yt[v]), (yt[v] = null), v--);
  }
  function q(t, e) {
    (v++, (yt[v] = t.current), (t.current = e));
  }
  var J = N(null),
    ft = N(null),
    I = N(null),
    te = N(null);
  function bt(t, e) {
    switch ((q(I, e), q(ft, t), q(J, null), e.nodeType)) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? ad(t) : 0;
        break;
      default:
        if (((t = e.tagName), (e = e.namespaceURI)))
          ((e = ad(e)), (t = ud(e, t)));
        else
          switch (t) {
            case 'svg':
              t = 1;
              break;
            case 'math':
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    (X(J), q(J, t));
  }
  function ke() {
    (X(J), X(ft), X(I));
  }
  function ui(t) {
    t.memoizedState !== null && q(te, t);
    var e = J.current,
      l = ud(e, t.type);
    e !== l && (q(ft, t), q(J, l));
  }
  function Cu(t) {
    (ft.current === t && (X(J), X(ft)),
      te.current === t && (X(te), (Eu._currentValue = W)));
  }
  var ni = Object.prototype.hasOwnProperty,
    ii = i.unstable_scheduleCallback,
    ci = i.unstable_cancelCallback,
    oh = i.unstable_shouldYield,
    sh = i.unstable_requestPaint,
    Re = i.unstable_now,
    dh = i.unstable_getCurrentPriorityLevel,
    qf = i.unstable_ImmediatePriority,
    Yf = i.unstable_UserBlockingPriority,
    Bu = i.unstable_NormalPriority,
    hh = i.unstable_LowPriority,
    jf = i.unstable_IdlePriority,
    mh = i.log,
    vh = i.unstable_setDisableYieldValue,
    _a = null,
    ee = null;
  function We(t) {
    if (
      (typeof mh == 'function' && vh(t),
      ee && typeof ee.setStrictMode == 'function')
    )
      try {
        ee.setStrictMode(_a, t);
      } catch {}
  }
  var le = Math.clz32 ? Math.clz32 : Sh,
    yh = Math.log,
    gh = Math.LN2;
  function Sh(t) {
    return ((t >>>= 0), t === 0 ? 32 : (31 - ((yh(t) / gh) | 0)) | 0);
  }
  var qu = 256,
    Yu = 4194304;
  function Rl(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 4194048;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function ju(t, e, l) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var u = 0,
      n = t.suspendedLanes,
      c = t.pingedLanes;
    t = t.warmLanes;
    var f = a & 134217727;
    return (
      f !== 0
        ? ((a = f & ~n),
          a !== 0
            ? (u = Rl(a))
            : ((c &= f),
              c !== 0
                ? (u = Rl(c))
                : l || ((l = f & ~t), l !== 0 && (u = Rl(l)))))
        : ((f = a & ~n),
          f !== 0
            ? (u = Rl(f))
            : c !== 0
              ? (u = Rl(c))
              : l || ((l = a & ~t), l !== 0 && (u = Rl(l)))),
      u === 0
        ? 0
        : e !== 0 &&
            e !== u &&
            (e & n) === 0 &&
            ((n = u & -u),
            (l = e & -e),
            n >= l || (n === 32 && (l & 4194048) !== 0))
          ? e
          : u
    );
  }
  function xa(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function bh(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Gf() {
    var t = qu;
    return ((qu <<= 1), (qu & 4194048) === 0 && (qu = 256), t);
  }
  function Xf() {
    var t = Yu;
    return ((Yu <<= 1), (Yu & 62914560) === 0 && (Yu = 4194304), t);
  }
  function fi(t) {
    for (var e = [], l = 0; 31 > l; l++) e.push(t);
    return e;
  }
  function Ua(t, e) {
    ((t.pendingLanes |= e),
      e !== 268435456 &&
        ((t.suspendedLanes = 0), (t.pingedLanes = 0), (t.warmLanes = 0)));
  }
  function ph(t, e, l, a, u, n) {
    var c = t.pendingLanes;
    ((t.pendingLanes = l),
      (t.suspendedLanes = 0),
      (t.pingedLanes = 0),
      (t.warmLanes = 0),
      (t.expiredLanes &= l),
      (t.entangledLanes &= l),
      (t.errorRecoveryDisabledLanes &= l),
      (t.shellSuspendCounter = 0));
    var f = t.entanglements,
      d = t.expirationTimes,
      T = t.hiddenUpdates;
    for (l = c & ~l; 0 < l; ) {
      var z = 31 - le(l),
        U = 1 << z;
      ((f[z] = 0), (d[z] = -1));
      var A = T[z];
      if (A !== null)
        for (T[z] = null, z = 0; z < A.length; z++) {
          var M = A[z];
          M !== null && (M.lane &= -536870913);
        }
      l &= ~U;
    }
    (a !== 0 && Lf(t, a, 0),
      n !== 0 && u === 0 && t.tag !== 0 && (t.suspendedLanes |= n & ~(c & ~e)));
  }
  function Lf(t, e, l) {
    ((t.pendingLanes |= e), (t.suspendedLanes &= ~e));
    var a = 31 - le(e);
    ((t.entangledLanes |= e),
      (t.entanglements[a] = t.entanglements[a] | 1073741824 | (l & 4194090)));
  }
  function Qf(t, e) {
    var l = (t.entangledLanes |= e);
    for (t = t.entanglements; l; ) {
      var a = 31 - le(l),
        u = 1 << a;
      ((u & e) | (t[a] & e) && (t[a] |= e), (l &= ~u));
    }
  }
  function ri(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function oi(t) {
    return (
      (t &= -t),
      2 < t ? (8 < t ? ((t & 134217727) !== 0 ? 32 : 268435456) : 8) : 2
    );
  }
  function Zf() {
    var t = j.p;
    return t !== 0 ? t : ((t = window.event), t === void 0 ? 32 : Rd(t.type));
  }
  function Eh(t, e) {
    var l = j.p;
    try {
      return ((j.p = t), e());
    } finally {
      j.p = l;
    }
  }
  var Fe = Math.random().toString(36).slice(2),
    Vt = '__reactFiber$' + Fe,
    $t = '__reactProps$' + Fe,
    Ql = '__reactContainer$' + Fe,
    si = '__reactEvents$' + Fe,
    Th = '__reactListeners$' + Fe,
    Rh = '__reactHandles$' + Fe,
    Vf = '__reactResources$' + Fe,
    Na = '__reactMarker$' + Fe;
  function di(t) {
    (delete t[Vt], delete t[$t], delete t[si], delete t[Th], delete t[Rh]);
  }
  function Zl(t) {
    var e = t[Vt];
    if (e) return e;
    for (var l = t.parentNode; l; ) {
      if ((e = l[Ql] || l[Vt])) {
        if (
          ((l = e.alternate),
          e.child !== null || (l !== null && l.child !== null))
        )
          for (t = fd(t); t !== null; ) {
            if ((l = t[Vt])) return l;
            t = fd(t);
          }
        return e;
      }
      ((t = l), (l = t.parentNode));
    }
    return null;
  }
  function Vl(t) {
    if ((t = t[Vt] || t[Ql])) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 26 || e === 27 || e === 3)
        return t;
    }
    return null;
  }
  function Ha(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(r(33));
  }
  function wl(t) {
    var e = t[Vf];
    return (
      e ||
        (e = t[Vf] =
          { hoistableStyles: new Map(), hoistableScripts: new Map() }),
      e
    );
  }
  function Bt(t) {
    t[Na] = !0;
  }
  var wf = new Set(),
    Kf = {};
  function Al(t, e) {
    (Kl(t, e), Kl(t + 'Capture', e));
  }
  function Kl(t, e) {
    for (Kf[t] = e, t = 0; t < e.length; t++) wf.add(e[t]);
  }
  var Ah = RegExp(
      '^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$'
    ),
    Jf = {},
    $f = {};
  function Mh(t) {
    return ni.call($f, t)
      ? !0
      : ni.call(Jf, t)
        ? !1
        : Ah.test(t)
          ? ($f[t] = !0)
          : ((Jf[t] = !0), !1);
  }
  function Gu(t, e, l) {
    if (Mh(e))
      if (l === null) t.removeAttribute(e);
      else {
        switch (typeof l) {
          case 'undefined':
          case 'function':
          case 'symbol':
            t.removeAttribute(e);
            return;
          case 'boolean':
            var a = e.toLowerCase().slice(0, 5);
            if (a !== 'data-' && a !== 'aria-') {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, '' + l);
      }
  }
  function Xu(t, e, l) {
    if (l === null) t.removeAttribute(e);
    else {
      switch (typeof l) {
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'boolean':
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, '' + l);
    }
  }
  function Ue(t, e, l, a) {
    if (a === null) t.removeAttribute(l);
    else {
      switch (typeof a) {
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'boolean':
          t.removeAttribute(l);
          return;
      }
      t.setAttributeNS(e, l, '' + a);
    }
  }
  var hi, kf;
  function Jl(t) {
    if (hi === void 0)
      try {
        throw Error();
      } catch (l) {
        var e = l.stack.trim().match(/\n( *(at )?)/);
        ((hi = (e && e[1]) || ''),
          (kf =
            -1 <
            l.stack.indexOf(`
    at`)
              ? ' (<anonymous>)'
              : -1 < l.stack.indexOf('@')
                ? '@unknown:0:0'
                : ''));
      }
    return (
      `
` +
      hi +
      t +
      kf
    );
  }
  var mi = !1;
  function vi(t, e) {
    if (!t || mi) return '';
    mi = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function () {
          try {
            if (e) {
              var U = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(U.prototype, 'props', {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == 'object' && Reflect.construct)
              ) {
                try {
                  Reflect.construct(U, []);
                } catch (M) {
                  var A = M;
                }
                Reflect.construct(t, [], U);
              } else {
                try {
                  U.call();
                } catch (M) {
                  A = M;
                }
                t.call(U.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (M) {
                A = M;
              }
              (U = t()) &&
                typeof U.catch == 'function' &&
                U.catch(function () {});
            }
          } catch (M) {
            if (M && A && typeof M.stack == 'string') return [M.stack, A.stack];
          }
          return [null, null];
        },
      };
      a.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot';
      var u = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        'name'
      );
      u &&
        u.configurable &&
        Object.defineProperty(a.DetermineComponentFrameRoot, 'name', {
          value: 'DetermineComponentFrameRoot',
        });
      var n = a.DetermineComponentFrameRoot(),
        c = n[0],
        f = n[1];
      if (c && f) {
        var d = c.split(`
`),
          T = f.split(`
`);
        for (
          u = a = 0;
          a < d.length && !d[a].includes('DetermineComponentFrameRoot');

        )
          a++;
        for (; u < T.length && !T[u].includes('DetermineComponentFrameRoot'); )
          u++;
        if (a === d.length || u === T.length)
          for (
            a = d.length - 1, u = T.length - 1;
            1 <= a && 0 <= u && d[a] !== T[u];

          )
            u--;
        for (; 1 <= a && 0 <= u; a--, u--)
          if (d[a] !== T[u]) {
            if (a !== 1 || u !== 1)
              do
                if ((a--, u--, 0 > u || d[a] !== T[u])) {
                  var z =
                    `
` + d[a].replace(' at new ', ' at ');
                  return (
                    t.displayName &&
                      z.includes('<anonymous>') &&
                      (z = z.replace('<anonymous>', t.displayName)),
                    z
                  );
                }
              while (1 <= a && 0 <= u);
            break;
          }
      }
    } finally {
      ((mi = !1), (Error.prepareStackTrace = l));
    }
    return (l = t ? t.displayName || t.name : '') ? Jl(l) : '';
  }
  function Oh(t) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return Jl(t.type);
      case 16:
        return Jl('Lazy');
      case 13:
        return Jl('Suspense');
      case 19:
        return Jl('SuspenseList');
      case 0:
      case 15:
        return vi(t.type, !1);
      case 11:
        return vi(t.type.render, !1);
      case 1:
        return vi(t.type, !0);
      case 31:
        return Jl('Activity');
      default:
        return '';
    }
  }
  function Wf(t) {
    try {
      var e = '';
      do ((e += Oh(t)), (t = t.return));
      while (t);
      return e;
    } catch (l) {
      return (
        `
Error generating stack: ` +
        l.message +
        `
` +
        l.stack
      );
    }
  }
  function se(t) {
    switch (typeof t) {
      case 'bigint':
      case 'boolean':
      case 'number':
      case 'string':
      case 'undefined':
        return t;
      case 'object':
        return t;
      default:
        return '';
    }
  }
  function Ff(t) {
    var e = t.type;
    return (
      (t = t.nodeName) &&
      t.toLowerCase() === 'input' &&
      (e === 'checkbox' || e === 'radio')
    );
  }
  function zh(t) {
    var e = Ff(t) ? 'checked' : 'value',
      l = Object.getOwnPropertyDescriptor(t.constructor.prototype, e),
      a = '' + t[e];
    if (
      !t.hasOwnProperty(e) &&
      typeof l < 'u' &&
      typeof l.get == 'function' &&
      typeof l.set == 'function'
    ) {
      var u = l.get,
        n = l.set;
      return (
        Object.defineProperty(t, e, {
          configurable: !0,
          get: function () {
            return u.call(this);
          },
          set: function (c) {
            ((a = '' + c), n.call(this, c));
          },
        }),
        Object.defineProperty(t, e, { enumerable: l.enumerable }),
        {
          getValue: function () {
            return a;
          },
          setValue: function (c) {
            a = '' + c;
          },
          stopTracking: function () {
            ((t._valueTracker = null), delete t[e]);
          },
        }
      );
    }
  }
  function Lu(t) {
    t._valueTracker || (t._valueTracker = zh(t));
  }
  function Pf(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var l = e.getValue(),
      a = '';
    return (
      t && (a = Ff(t) ? (t.checked ? 'true' : 'false') : t.value),
      (t = a),
      t !== l ? (e.setValue(t), !0) : !1
    );
  }
  function Qu(t) {
    if (
      ((t = t || (typeof document < 'u' ? document : void 0)), typeof t > 'u')
    )
      return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var Dh = /[\n"\\]/g;
  function de(t) {
    return t.replace(Dh, function (e) {
      return '\\' + e.charCodeAt(0).toString(16) + ' ';
    });
  }
  function yi(t, e, l, a, u, n, c, f) {
    ((t.name = ''),
      c != null &&
      typeof c != 'function' &&
      typeof c != 'symbol' &&
      typeof c != 'boolean'
        ? (t.type = c)
        : t.removeAttribute('type'),
      e != null
        ? c === 'number'
          ? ((e === 0 && t.value === '') || t.value != e) &&
            (t.value = '' + se(e))
          : t.value !== '' + se(e) && (t.value = '' + se(e))
        : (c !== 'submit' && c !== 'reset') || t.removeAttribute('value'),
      e != null
        ? gi(t, c, se(e))
        : l != null
          ? gi(t, c, se(l))
          : a != null && t.removeAttribute('value'),
      u == null && n != null && (t.defaultChecked = !!n),
      u != null &&
        (t.checked = u && typeof u != 'function' && typeof u != 'symbol'),
      f != null &&
      typeof f != 'function' &&
      typeof f != 'symbol' &&
      typeof f != 'boolean'
        ? (t.name = '' + se(f))
        : t.removeAttribute('name'));
  }
  function If(t, e, l, a, u, n, c, f) {
    if (
      (n != null &&
        typeof n != 'function' &&
        typeof n != 'symbol' &&
        typeof n != 'boolean' &&
        (t.type = n),
      e != null || l != null)
    ) {
      if (!((n !== 'submit' && n !== 'reset') || e != null)) return;
      ((l = l != null ? '' + se(l) : ''),
        (e = e != null ? '' + se(e) : l),
        f || e === t.value || (t.value = e),
        (t.defaultValue = e));
    }
    ((a = a ?? u),
      (a = typeof a != 'function' && typeof a != 'symbol' && !!a),
      (t.checked = f ? t.checked : !!a),
      (t.defaultChecked = !!a),
      c != null &&
        typeof c != 'function' &&
        typeof c != 'symbol' &&
        typeof c != 'boolean' &&
        (t.name = c));
  }
  function gi(t, e, l) {
    (e === 'number' && Qu(t.ownerDocument) === t) ||
      t.defaultValue === '' + l ||
      (t.defaultValue = '' + l);
  }
  function $l(t, e, l, a) {
    if (((t = t.options), e)) {
      e = {};
      for (var u = 0; u < l.length; u++) e['$' + l[u]] = !0;
      for (l = 0; l < t.length; l++)
        ((u = e.hasOwnProperty('$' + t[l].value)),
          t[l].selected !== u && (t[l].selected = u),
          u && a && (t[l].defaultSelected = !0));
    } else {
      for (l = '' + se(l), e = null, u = 0; u < t.length; u++) {
        if (t[u].value === l) {
          ((t[u].selected = !0), a && (t[u].defaultSelected = !0));
          return;
        }
        e !== null || t[u].disabled || (e = t[u]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function tr(t, e, l) {
    if (
      e != null &&
      ((e = '' + se(e)), e !== t.value && (t.value = e), l == null)
    ) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = l != null ? '' + se(l) : '';
  }
  function er(t, e, l, a) {
    if (e == null) {
      if (a != null) {
        if (l != null) throw Error(r(92));
        if (Zt(a)) {
          if (1 < a.length) throw Error(r(93));
          a = a[0];
        }
        l = a;
      }
      (l == null && (l = ''), (e = l));
    }
    ((l = se(e)),
      (t.defaultValue = l),
      (a = t.textContent),
      a === l && a !== '' && a !== null && (t.value = a));
  }
  function kl(t, e) {
    if (e) {
      var l = t.firstChild;
      if (l && l === t.lastChild && l.nodeType === 3) {
        l.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var _h = new Set(
    'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp'.split(
      ' '
    )
  );
  function lr(t, e, l) {
    var a = e.indexOf('--') === 0;
    l == null || typeof l == 'boolean' || l === ''
      ? a
        ? t.setProperty(e, '')
        : e === 'float'
          ? (t.cssFloat = '')
          : (t[e] = '')
      : a
        ? t.setProperty(e, l)
        : typeof l != 'number' || l === 0 || _h.has(e)
          ? e === 'float'
            ? (t.cssFloat = l)
            : (t[e] = ('' + l).trim())
          : (t[e] = l + 'px');
  }
  function ar(t, e, l) {
    if (e != null && typeof e != 'object') throw Error(r(62));
    if (((t = t.style), l != null)) {
      for (var a in l)
        !l.hasOwnProperty(a) ||
          (e != null && e.hasOwnProperty(a)) ||
          (a.indexOf('--') === 0
            ? t.setProperty(a, '')
            : a === 'float'
              ? (t.cssFloat = '')
              : (t[a] = ''));
      for (var u in e)
        ((a = e[u]), e.hasOwnProperty(u) && l[u] !== a && lr(t, u, a));
    } else for (var n in e) e.hasOwnProperty(n) && lr(t, n, e[n]);
  }
  function Si(t) {
    if (t.indexOf('-') === -1) return !1;
    switch (t) {
      case 'annotation-xml':
      case 'color-profile':
      case 'font-face':
      case 'font-face-src':
      case 'font-face-uri':
      case 'font-face-format':
      case 'font-face-name':
      case 'missing-glyph':
        return !1;
      default:
        return !0;
    }
  }
  var xh = new Map([
      ['acceptCharset', 'accept-charset'],
      ['htmlFor', 'for'],
      ['httpEquiv', 'http-equiv'],
      ['crossOrigin', 'crossorigin'],
      ['accentHeight', 'accent-height'],
      ['alignmentBaseline', 'alignment-baseline'],
      ['arabicForm', 'arabic-form'],
      ['baselineShift', 'baseline-shift'],
      ['capHeight', 'cap-height'],
      ['clipPath', 'clip-path'],
      ['clipRule', 'clip-rule'],
      ['colorInterpolation', 'color-interpolation'],
      ['colorInterpolationFilters', 'color-interpolation-filters'],
      ['colorProfile', 'color-profile'],
      ['colorRendering', 'color-rendering'],
      ['dominantBaseline', 'dominant-baseline'],
      ['enableBackground', 'enable-background'],
      ['fillOpacity', 'fill-opacity'],
      ['fillRule', 'fill-rule'],
      ['floodColor', 'flood-color'],
      ['floodOpacity', 'flood-opacity'],
      ['fontFamily', 'font-family'],
      ['fontSize', 'font-size'],
      ['fontSizeAdjust', 'font-size-adjust'],
      ['fontStretch', 'font-stretch'],
      ['fontStyle', 'font-style'],
      ['fontVariant', 'font-variant'],
      ['fontWeight', 'font-weight'],
      ['glyphName', 'glyph-name'],
      ['glyphOrientationHorizontal', 'glyph-orientation-horizontal'],
      ['glyphOrientationVertical', 'glyph-orientation-vertical'],
      ['horizAdvX', 'horiz-adv-x'],
      ['horizOriginX', 'horiz-origin-x'],
      ['imageRendering', 'image-rendering'],
      ['letterSpacing', 'letter-spacing'],
      ['lightingColor', 'lighting-color'],
      ['markerEnd', 'marker-end'],
      ['markerMid', 'marker-mid'],
      ['markerStart', 'marker-start'],
      ['overlinePosition', 'overline-position'],
      ['overlineThickness', 'overline-thickness'],
      ['paintOrder', 'paint-order'],
      ['panose-1', 'panose-1'],
      ['pointerEvents', 'pointer-events'],
      ['renderingIntent', 'rendering-intent'],
      ['shapeRendering', 'shape-rendering'],
      ['stopColor', 'stop-color'],
      ['stopOpacity', 'stop-opacity'],
      ['strikethroughPosition', 'strikethrough-position'],
      ['strikethroughThickness', 'strikethrough-thickness'],
      ['strokeDasharray', 'stroke-dasharray'],
      ['strokeDashoffset', 'stroke-dashoffset'],
      ['strokeLinecap', 'stroke-linecap'],
      ['strokeLinejoin', 'stroke-linejoin'],
      ['strokeMiterlimit', 'stroke-miterlimit'],
      ['strokeOpacity', 'stroke-opacity'],
      ['strokeWidth', 'stroke-width'],
      ['textAnchor', 'text-anchor'],
      ['textDecoration', 'text-decoration'],
      ['textRendering', 'text-rendering'],
      ['transformOrigin', 'transform-origin'],
      ['underlinePosition', 'underline-position'],
      ['underlineThickness', 'underline-thickness'],
      ['unicodeBidi', 'unicode-bidi'],
      ['unicodeRange', 'unicode-range'],
      ['unitsPerEm', 'units-per-em'],
      ['vAlphabetic', 'v-alphabetic'],
      ['vHanging', 'v-hanging'],
      ['vIdeographic', 'v-ideographic'],
      ['vMathematical', 'v-mathematical'],
      ['vectorEffect', 'vector-effect'],
      ['vertAdvY', 'vert-adv-y'],
      ['vertOriginX', 'vert-origin-x'],
      ['vertOriginY', 'vert-origin-y'],
      ['wordSpacing', 'word-spacing'],
      ['writingMode', 'writing-mode'],
      ['xmlnsXlink', 'xmlns:xlink'],
      ['xHeight', 'x-height'],
    ]),
    Uh =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Zu(t) {
    return Uh.test('' + t)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : t;
  }
  var bi = null;
  function pi(t) {
    return (
      (t = t.target || t.srcElement || window),
      t.correspondingUseElement && (t = t.correspondingUseElement),
      t.nodeType === 3 ? t.parentNode : t
    );
  }
  var Wl = null,
    Fl = null;
  function ur(t) {
    var e = Vl(t);
    if (e && (t = e.stateNode)) {
      var l = t[$t] || null;
      t: switch (((t = e.stateNode), e.type)) {
        case 'input':
          if (
            (yi(
              t,
              l.value,
              l.defaultValue,
              l.defaultValue,
              l.checked,
              l.defaultChecked,
              l.type,
              l.name
            ),
            (e = l.name),
            l.type === 'radio' && e != null)
          ) {
            for (l = t; l.parentNode; ) l = l.parentNode;
            for (
              l = l.querySelectorAll(
                'input[name="' + de('' + e) + '"][type="radio"]'
              ),
                e = 0;
              e < l.length;
              e++
            ) {
              var a = l[e];
              if (a !== t && a.form === t.form) {
                var u = a[$t] || null;
                if (!u) throw Error(r(90));
                yi(
                  a,
                  u.value,
                  u.defaultValue,
                  u.defaultValue,
                  u.checked,
                  u.defaultChecked,
                  u.type,
                  u.name
                );
              }
            }
            for (e = 0; e < l.length; e++)
              ((a = l[e]), a.form === t.form && Pf(a));
          }
          break t;
        case 'textarea':
          tr(t, l.value, l.defaultValue);
          break t;
        case 'select':
          ((e = l.value), e != null && $l(t, !!l.multiple, e, !1));
      }
    }
  }
  var Ei = !1;
  function nr(t, e, l) {
    if (Ei) return t(e, l);
    Ei = !0;
    try {
      var a = t(e);
      return a;
    } finally {
      if (
        ((Ei = !1),
        (Wl !== null || Fl !== null) &&
          (_n(), Wl && ((e = Wl), (t = Fl), (Fl = Wl = null), ur(e), t)))
      )
        for (e = 0; e < t.length; e++) ur(t[e]);
    }
  }
  function Ca(t, e) {
    var l = t.stateNode;
    if (l === null) return null;
    var a = l[$t] || null;
    if (a === null) return null;
    l = a[e];
    t: switch (e) {
      case 'onClick':
      case 'onClickCapture':
      case 'onDoubleClick':
      case 'onDoubleClickCapture':
      case 'onMouseDown':
      case 'onMouseDownCapture':
      case 'onMouseMove':
      case 'onMouseMoveCapture':
      case 'onMouseUp':
      case 'onMouseUpCapture':
      case 'onMouseEnter':
        ((a = !a.disabled) ||
          ((t = t.type),
          (a = !(
            t === 'button' ||
            t === 'input' ||
            t === 'select' ||
            t === 'textarea'
          ))),
          (t = !a));
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (l && typeof l != 'function') throw Error(r(231, e, typeof l));
    return l;
  }
  var Ne = !(
      typeof window > 'u' ||
      typeof window.document > 'u' ||
      typeof window.document.createElement > 'u'
    ),
    Ti = !1;
  if (Ne)
    try {
      var Ba = {};
      (Object.defineProperty(Ba, 'passive', {
        get: function () {
          Ti = !0;
        },
      }),
        window.addEventListener('test', Ba, Ba),
        window.removeEventListener('test', Ba, Ba));
    } catch {
      Ti = !1;
    }
  var Pe = null,
    Ri = null,
    Vu = null;
  function ir() {
    if (Vu) return Vu;
    var t,
      e = Ri,
      l = e.length,
      a,
      u = 'value' in Pe ? Pe.value : Pe.textContent,
      n = u.length;
    for (t = 0; t < l && e[t] === u[t]; t++);
    var c = l - t;
    for (a = 1; a <= c && e[l - a] === u[n - a]; a++);
    return (Vu = u.slice(t, 1 < a ? 1 - a : void 0));
  }
  function wu(t) {
    var e = t.keyCode;
    return (
      'charCode' in t
        ? ((t = t.charCode), t === 0 && e === 13 && (t = 13))
        : (t = e),
      t === 10 && (t = 13),
      32 <= t || t === 13 ? t : 0
    );
  }
  function Ku() {
    return !0;
  }
  function cr() {
    return !1;
  }
  function kt(t) {
    function e(l, a, u, n, c) {
      ((this._reactName = l),
        (this._targetInst = u),
        (this.type = a),
        (this.nativeEvent = n),
        (this.target = c),
        (this.currentTarget = null));
      for (var f in t)
        t.hasOwnProperty(f) && ((l = t[f]), (this[f] = l ? l(n) : n[f]));
      return (
        (this.isDefaultPrevented = (
          n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1
        )
          ? Ku
          : cr),
        (this.isPropagationStopped = cr),
        this
      );
    }
    return (
      R(e.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var l = this.nativeEvent;
          l &&
            (l.preventDefault
              ? l.preventDefault()
              : typeof l.returnValue != 'unknown' && (l.returnValue = !1),
            (this.isDefaultPrevented = Ku));
        },
        stopPropagation: function () {
          var l = this.nativeEvent;
          l &&
            (l.stopPropagation
              ? l.stopPropagation()
              : typeof l.cancelBubble != 'unknown' && (l.cancelBubble = !0),
            (this.isPropagationStopped = Ku));
        },
        persist: function () {},
        isPersistent: Ku,
      }),
      e
    );
  }
  var Ml = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (t) {
        return t.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Ju = kt(Ml),
    qa = R({}, Ml, { view: 0, detail: 0 }),
    Nh = kt(qa),
    Ai,
    Mi,
    Ya,
    $u = R({}, qa, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: zi,
      button: 0,
      buttons: 0,
      relatedTarget: function (t) {
        return t.relatedTarget === void 0
          ? t.fromElement === t.srcElement
            ? t.toElement
            : t.fromElement
          : t.relatedTarget;
      },
      movementX: function (t) {
        return 'movementX' in t
          ? t.movementX
          : (t !== Ya &&
              (Ya && t.type === 'mousemove'
                ? ((Ai = t.screenX - Ya.screenX), (Mi = t.screenY - Ya.screenY))
                : (Mi = Ai = 0),
              (Ya = t)),
            Ai);
      },
      movementY: function (t) {
        return 'movementY' in t ? t.movementY : Mi;
      },
    }),
    fr = kt($u),
    Hh = R({}, $u, { dataTransfer: 0 }),
    Ch = kt(Hh),
    Bh = R({}, qa, { relatedTarget: 0 }),
    Oi = kt(Bh),
    qh = R({}, Ml, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Yh = kt(qh),
    jh = R({}, Ml, {
      clipboardData: function (t) {
        return 'clipboardData' in t ? t.clipboardData : window.clipboardData;
      },
    }),
    Gh = kt(jh),
    Xh = R({}, Ml, { data: 0 }),
    rr = kt(Xh),
    Lh = {
      Esc: 'Escape',
      Spacebar: ' ',
      Left: 'ArrowLeft',
      Up: 'ArrowUp',
      Right: 'ArrowRight',
      Down: 'ArrowDown',
      Del: 'Delete',
      Win: 'OS',
      Menu: 'ContextMenu',
      Apps: 'ContextMenu',
      Scroll: 'ScrollLock',
      MozPrintableKey: 'Unidentified',
    },
    Qh = {
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      45: 'Insert',
      46: 'Delete',
      112: 'F1',
      113: 'F2',
      114: 'F3',
      115: 'F4',
      116: 'F5',
      117: 'F6',
      118: 'F7',
      119: 'F8',
      120: 'F9',
      121: 'F10',
      122: 'F11',
      123: 'F12',
      144: 'NumLock',
      145: 'ScrollLock',
      224: 'Meta',
    },
    Zh = {
      Alt: 'altKey',
      Control: 'ctrlKey',
      Meta: 'metaKey',
      Shift: 'shiftKey',
    };
  function Vh(t) {
    var e = this.nativeEvent;
    return e.getModifierState
      ? e.getModifierState(t)
      : (t = Zh[t])
        ? !!e[t]
        : !1;
  }
  function zi() {
    return Vh;
  }
  var wh = R({}, qa, {
      key: function (t) {
        if (t.key) {
          var e = Lh[t.key] || t.key;
          if (e !== 'Unidentified') return e;
        }
        return t.type === 'keypress'
          ? ((t = wu(t)), t === 13 ? 'Enter' : String.fromCharCode(t))
          : t.type === 'keydown' || t.type === 'keyup'
            ? Qh[t.keyCode] || 'Unidentified'
            : '';
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: zi,
      charCode: function (t) {
        return t.type === 'keypress' ? wu(t) : 0;
      },
      keyCode: function (t) {
        return t.type === 'keydown' || t.type === 'keyup' ? t.keyCode : 0;
      },
      which: function (t) {
        return t.type === 'keypress'
          ? wu(t)
          : t.type === 'keydown' || t.type === 'keyup'
            ? t.keyCode
            : 0;
      },
    }),
    Kh = kt(wh),
    Jh = R({}, $u, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    or = kt(Jh),
    $h = R({}, qa, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: zi,
    }),
    kh = kt($h),
    Wh = R({}, Ml, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Fh = kt(Wh),
    Ph = R({}, $u, {
      deltaX: function (t) {
        return 'deltaX' in t
          ? t.deltaX
          : 'wheelDeltaX' in t
            ? -t.wheelDeltaX
            : 0;
      },
      deltaY: function (t) {
        return 'deltaY' in t
          ? t.deltaY
          : 'wheelDeltaY' in t
            ? -t.wheelDeltaY
            : 'wheelDelta' in t
              ? -t.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    Ih = kt(Ph),
    tm = R({}, Ml, { newState: 0, oldState: 0 }),
    em = kt(tm),
    lm = [9, 13, 27, 32],
    Di = Ne && 'CompositionEvent' in window,
    ja = null;
  Ne && 'documentMode' in document && (ja = document.documentMode);
  var am = Ne && 'TextEvent' in window && !ja,
    sr = Ne && (!Di || (ja && 8 < ja && 11 >= ja)),
    dr = ' ',
    hr = !1;
  function mr(t, e) {
    switch (t) {
      case 'keyup':
        return lm.indexOf(e.keyCode) !== -1;
      case 'keydown':
        return e.keyCode !== 229;
      case 'keypress':
      case 'mousedown':
      case 'focusout':
        return !0;
      default:
        return !1;
    }
  }
  function vr(t) {
    return (
      (t = t.detail),
      typeof t == 'object' && 'data' in t ? t.data : null
    );
  }
  var Pl = !1;
  function um(t, e) {
    switch (t) {
      case 'compositionend':
        return vr(e);
      case 'keypress':
        return e.which !== 32 ? null : ((hr = !0), dr);
      case 'textInput':
        return ((t = e.data), t === dr && hr ? null : t);
      default:
        return null;
    }
  }
  function nm(t, e) {
    if (Pl)
      return t === 'compositionend' || (!Di && mr(t, e))
        ? ((t = ir()), (Vu = Ri = Pe = null), (Pl = !1), t)
        : null;
    switch (t) {
      case 'paste':
        return null;
      case 'keypress':
        if (!(e.ctrlKey || e.altKey || e.metaKey) || (e.ctrlKey && e.altKey)) {
          if (e.char && 1 < e.char.length) return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case 'compositionend':
        return sr && e.locale !== 'ko' ? null : e.data;
      default:
        return null;
    }
  }
  var im = {
    color: !0,
    date: !0,
    datetime: !0,
    'datetime-local': !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function yr(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === 'input' ? !!im[t.type] : e === 'textarea';
  }
  function gr(t, e, l, a) {
    (Wl ? (Fl ? Fl.push(a) : (Fl = [a])) : (Wl = a),
      (e = Bn(e, 'onChange')),
      0 < e.length &&
        ((l = new Ju('onChange', 'change', null, l, a)),
        t.push({ event: l, listeners: e })));
  }
  var Ga = null,
    Xa = null;
  function cm(t) {
    Ps(t, 0);
  }
  function ku(t) {
    var e = Ha(t);
    if (Pf(e)) return t;
  }
  function Sr(t, e) {
    if (t === 'change') return e;
  }
  var br = !1;
  if (Ne) {
    var _i;
    if (Ne) {
      var xi = 'oninput' in document;
      if (!xi) {
        var pr = document.createElement('div');
        (pr.setAttribute('oninput', 'return;'),
          (xi = typeof pr.oninput == 'function'));
      }
      _i = xi;
    } else _i = !1;
    br = _i && (!document.documentMode || 9 < document.documentMode);
  }
  function Er() {
    Ga && (Ga.detachEvent('onpropertychange', Tr), (Xa = Ga = null));
  }
  function Tr(t) {
    if (t.propertyName === 'value' && ku(Xa)) {
      var e = [];
      (gr(e, Xa, t, pi(t)), nr(cm, e));
    }
  }
  function fm(t, e, l) {
    t === 'focusin'
      ? (Er(), (Ga = e), (Xa = l), Ga.attachEvent('onpropertychange', Tr))
      : t === 'focusout' && Er();
  }
  function rm(t) {
    if (t === 'selectionchange' || t === 'keyup' || t === 'keydown')
      return ku(Xa);
  }
  function om(t, e) {
    if (t === 'click') return ku(e);
  }
  function sm(t, e) {
    if (t === 'input' || t === 'change') return ku(e);
  }
  function dm(t, e) {
    return (t === e && (t !== 0 || 1 / t === 1 / e)) || (t !== t && e !== e);
  }
  var ae = typeof Object.is == 'function' ? Object.is : dm;
  function La(t, e) {
    if (ae(t, e)) return !0;
    if (
      typeof t != 'object' ||
      t === null ||
      typeof e != 'object' ||
      e === null
    )
      return !1;
    var l = Object.keys(t),
      a = Object.keys(e);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var u = l[a];
      if (!ni.call(e, u) || !ae(t[u], e[u])) return !1;
    }
    return !0;
  }
  function Rr(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function Ar(t, e) {
    var l = Rr(t);
    t = 0;
    for (var a; l; ) {
      if (l.nodeType === 3) {
        if (((a = t + l.textContent.length), t <= e && a >= e))
          return { node: l, offset: e - t };
        t = a;
      }
      t: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break t;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = Rr(l);
    }
  }
  function Mr(t, e) {
    return t && e
      ? t === e
        ? !0
        : t && t.nodeType === 3
          ? !1
          : e && e.nodeType === 3
            ? Mr(t, e.parentNode)
            : 'contains' in t
              ? t.contains(e)
              : t.compareDocumentPosition
                ? !!(t.compareDocumentPosition(e) & 16)
                : !1
      : !1;
  }
  function Or(t) {
    t =
      t != null &&
      t.ownerDocument != null &&
      t.ownerDocument.defaultView != null
        ? t.ownerDocument.defaultView
        : window;
    for (var e = Qu(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var l = typeof e.contentWindow.location.href == 'string';
      } catch {
        l = !1;
      }
      if (l) t = e.contentWindow;
      else break;
      e = Qu(t.document);
    }
    return e;
  }
  function Ui(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return (
      e &&
      ((e === 'input' &&
        (t.type === 'text' ||
          t.type === 'search' ||
          t.type === 'tel' ||
          t.type === 'url' ||
          t.type === 'password')) ||
        e === 'textarea' ||
        t.contentEditable === 'true')
    );
  }
  var hm = Ne && 'documentMode' in document && 11 >= document.documentMode,
    Il = null,
    Ni = null,
    Qa = null,
    Hi = !1;
  function zr(t, e, l) {
    var a =
      l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    Hi ||
      Il == null ||
      Il !== Qu(a) ||
      ((a = Il),
      'selectionStart' in a && Ui(a)
        ? (a = { start: a.selectionStart, end: a.selectionEnd })
        : ((a = (
            (a.ownerDocument && a.ownerDocument.defaultView) ||
            window
          ).getSelection()),
          (a = {
            anchorNode: a.anchorNode,
            anchorOffset: a.anchorOffset,
            focusNode: a.focusNode,
            focusOffset: a.focusOffset,
          })),
      (Qa && La(Qa, a)) ||
        ((Qa = a),
        (a = Bn(Ni, 'onSelect')),
        0 < a.length &&
          ((e = new Ju('onSelect', 'select', null, e, l)),
          t.push({ event: e, listeners: a }),
          (e.target = Il))));
  }
  function Ol(t, e) {
    var l = {};
    return (
      (l[t.toLowerCase()] = e.toLowerCase()),
      (l['Webkit' + t] = 'webkit' + e),
      (l['Moz' + t] = 'moz' + e),
      l
    );
  }
  var ta = {
      animationend: Ol('Animation', 'AnimationEnd'),
      animationiteration: Ol('Animation', 'AnimationIteration'),
      animationstart: Ol('Animation', 'AnimationStart'),
      transitionrun: Ol('Transition', 'TransitionRun'),
      transitionstart: Ol('Transition', 'TransitionStart'),
      transitioncancel: Ol('Transition', 'TransitionCancel'),
      transitionend: Ol('Transition', 'TransitionEnd'),
    },
    Ci = {},
    Dr = {};
  Ne &&
    ((Dr = document.createElement('div').style),
    'AnimationEvent' in window ||
      (delete ta.animationend.animation,
      delete ta.animationiteration.animation,
      delete ta.animationstart.animation),
    'TransitionEvent' in window || delete ta.transitionend.transition);
  function zl(t) {
    if (Ci[t]) return Ci[t];
    if (!ta[t]) return t;
    var e = ta[t],
      l;
    for (l in e) if (e.hasOwnProperty(l) && l in Dr) return (Ci[t] = e[l]);
    return t;
  }
  var _r = zl('animationend'),
    xr = zl('animationiteration'),
    Ur = zl('animationstart'),
    mm = zl('transitionrun'),
    vm = zl('transitionstart'),
    ym = zl('transitioncancel'),
    Nr = zl('transitionend'),
    Hr = new Map(),
    Bi =
      'abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
        ' '
      );
  Bi.push('scrollEnd');
  function pe(t, e) {
    (Hr.set(t, e), Al(e, [t]));
  }
  var Cr = new WeakMap();
  function he(t, e) {
    if (typeof t == 'object' && t !== null) {
      var l = Cr.get(t);
      return l !== void 0
        ? l
        : ((e = { value: t, source: e, stack: Wf(e) }), Cr.set(t, e), e);
    }
    return { value: t, source: e, stack: Wf(e) };
  }
  var me = [],
    ea = 0,
    qi = 0;
  function Wu() {
    for (var t = ea, e = (qi = ea = 0); e < t; ) {
      var l = me[e];
      me[e++] = null;
      var a = me[e];
      me[e++] = null;
      var u = me[e];
      me[e++] = null;
      var n = me[e];
      if (((me[e++] = null), a !== null && u !== null)) {
        var c = a.pending;
        (c === null ? (u.next = u) : ((u.next = c.next), (c.next = u)),
          (a.pending = u));
      }
      n !== 0 && Br(l, u, n);
    }
  }
  function Fu(t, e, l, a) {
    ((me[ea++] = t),
      (me[ea++] = e),
      (me[ea++] = l),
      (me[ea++] = a),
      (qi |= a),
      (t.lanes |= a),
      (t = t.alternate),
      t !== null && (t.lanes |= a));
  }
  function Yi(t, e, l, a) {
    return (Fu(t, e, l, a), Pu(t));
  }
  function la(t, e) {
    return (Fu(t, null, null, e), Pu(t));
  }
  function Br(t, e, l) {
    t.lanes |= l;
    var a = t.alternate;
    a !== null && (a.lanes |= l);
    for (var u = !1, n = t.return; n !== null; )
      ((n.childLanes |= l),
        (a = n.alternate),
        a !== null && (a.childLanes |= l),
        n.tag === 22 &&
          ((t = n.stateNode), t === null || t._visibility & 1 || (u = !0)),
        (t = n),
        (n = n.return));
    return t.tag === 3
      ? ((n = t.stateNode),
        u &&
          e !== null &&
          ((u = 31 - le(l)),
          (t = n.hiddenUpdates),
          (a = t[u]),
          a === null ? (t[u] = [e]) : a.push(e),
          (e.lane = l | 536870912)),
        n)
      : null;
  }
  function Pu(t) {
    if (50 < hu) throw ((hu = 0), (Zc = null), Error(r(185)));
    for (var e = t.return; e !== null; ) ((t = e), (e = t.return));
    return t.tag === 3 ? t.stateNode : null;
  }
  var aa = {};
  function gm(t, e, l, a) {
    ((this.tag = t),
      (this.key = l),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = e),
      (this.dependencies =
        this.memoizedState =
        this.updateQueue =
        this.memoizedProps =
          null),
      (this.mode = a),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function ue(t, e, l, a) {
    return new gm(t, e, l, a);
  }
  function ji(t) {
    return ((t = t.prototype), !(!t || !t.isReactComponent));
  }
  function He(t, e) {
    var l = t.alternate;
    return (
      l === null
        ? ((l = ue(t.tag, e, t.key, t.mode)),
          (l.elementType = t.elementType),
          (l.type = t.type),
          (l.stateNode = t.stateNode),
          (l.alternate = t),
          (t.alternate = l))
        : ((l.pendingProps = e),
          (l.type = t.type),
          (l.flags = 0),
          (l.subtreeFlags = 0),
          (l.deletions = null)),
      (l.flags = t.flags & 65011712),
      (l.childLanes = t.childLanes),
      (l.lanes = t.lanes),
      (l.child = t.child),
      (l.memoizedProps = t.memoizedProps),
      (l.memoizedState = t.memoizedState),
      (l.updateQueue = t.updateQueue),
      (e = t.dependencies),
      (l.dependencies =
        e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }),
      (l.sibling = t.sibling),
      (l.index = t.index),
      (l.ref = t.ref),
      (l.refCleanup = t.refCleanup),
      l
    );
  }
  function qr(t, e) {
    t.flags &= 65011714;
    var l = t.alternate;
    return (
      l === null
        ? ((t.childLanes = 0),
          (t.lanes = e),
          (t.child = null),
          (t.subtreeFlags = 0),
          (t.memoizedProps = null),
          (t.memoizedState = null),
          (t.updateQueue = null),
          (t.dependencies = null),
          (t.stateNode = null))
        : ((t.childLanes = l.childLanes),
          (t.lanes = l.lanes),
          (t.child = l.child),
          (t.subtreeFlags = 0),
          (t.deletions = null),
          (t.memoizedProps = l.memoizedProps),
          (t.memoizedState = l.memoizedState),
          (t.updateQueue = l.updateQueue),
          (t.type = l.type),
          (e = l.dependencies),
          (t.dependencies =
            e === null
              ? null
              : { lanes: e.lanes, firstContext: e.firstContext })),
      t
    );
  }
  function Iu(t, e, l, a, u, n) {
    var c = 0;
    if (((a = t), typeof t == 'function')) ji(t) && (c = 1);
    else if (typeof t == 'string')
      c = b0(t, l, J.current)
        ? 26
        : t === 'html' || t === 'head' || t === 'body'
          ? 27
          : 5;
    else
      t: switch (t) {
        case Rt:
          return (
            (t = ue(31, l, e, u)),
            (t.elementType = Rt),
            (t.lanes = n),
            t
          );
        case V:
          return Dl(l.children, u, n, e);
        case F:
          ((c = 8), (u |= 24));
          break;
        case L:
          return (
            (t = ue(12, l, e, u | 2)),
            (t.elementType = L),
            (t.lanes = n),
            t
          );
        case K:
          return ((t = ue(13, l, e, u)), (t.elementType = K), (t.lanes = n), t);
        case _t:
          return (
            (t = ue(19, l, e, u)),
            (t.elementType = _t),
            (t.lanes = n),
            t
          );
        default:
          if (typeof t == 'object' && t !== null)
            switch (t.$$typeof) {
              case Y:
              case w:
                c = 10;
                break t;
              case B:
                c = 9;
                break t;
              case ct:
                c = 11;
                break t;
              case Ot:
                c = 14;
                break t;
              case Ct:
                ((c = 16), (a = null));
                break t;
            }
          ((c = 29),
            (l = Error(r(130, t === null ? 'null' : typeof t, ''))),
            (a = null));
      }
    return (
      (e = ue(c, l, e, u)),
      (e.elementType = t),
      (e.type = a),
      (e.lanes = n),
      e
    );
  }
  function Dl(t, e, l, a) {
    return ((t = ue(7, t, a, e)), (t.lanes = l), t);
  }
  function Gi(t, e, l) {
    return ((t = ue(6, t, null, e)), (t.lanes = l), t);
  }
  function Xi(t, e, l) {
    return (
      (e = ue(4, t.children !== null ? t.children : [], t.key, e)),
      (e.lanes = l),
      (e.stateNode = {
        containerInfo: t.containerInfo,
        pendingChildren: null,
        implementation: t.implementation,
      }),
      e
    );
  }
  var ua = [],
    na = 0,
    tn = null,
    en = 0,
    ve = [],
    ye = 0,
    _l = null,
    Ce = 1,
    Be = '';
  function xl(t, e) {
    ((ua[na++] = en), (ua[na++] = tn), (tn = t), (en = e));
  }
  function Yr(t, e, l) {
    ((ve[ye++] = Ce), (ve[ye++] = Be), (ve[ye++] = _l), (_l = t));
    var a = Ce;
    t = Be;
    var u = 32 - le(a) - 1;
    ((a &= ~(1 << u)), (l += 1));
    var n = 32 - le(e) + u;
    if (30 < n) {
      var c = u - (u % 5);
      ((n = (a & ((1 << c) - 1)).toString(32)),
        (a >>= c),
        (u -= c),
        (Ce = (1 << (32 - le(e) + u)) | (l << u) | a),
        (Be = n + t));
    } else ((Ce = (1 << n) | (l << u) | a), (Be = t));
  }
  function Li(t) {
    t.return !== null && (xl(t, 1), Yr(t, 1, 0));
  }
  function Qi(t) {
    for (; t === tn; )
      ((tn = ua[--na]), (ua[na] = null), (en = ua[--na]), (ua[na] = null));
    for (; t === _l; )
      ((_l = ve[--ye]),
        (ve[ye] = null),
        (Be = ve[--ye]),
        (ve[ye] = null),
        (Ce = ve[--ye]),
        (ve[ye] = null));
  }
  var Jt = null,
    At = null,
    ot = !1,
    Ul = null,
    Ae = !1,
    Zi = Error(r(519));
  function Nl(t) {
    var e = Error(r(418, ''));
    throw (wa(he(e, t)), Zi);
  }
  function jr(t) {
    var e = t.stateNode,
      l = t.type,
      a = t.memoizedProps;
    switch (((e[Vt] = t), (e[$t] = a), l)) {
      case 'dialog':
        (ut('cancel', e), ut('close', e));
        break;
      case 'iframe':
      case 'object':
      case 'embed':
        ut('load', e);
        break;
      case 'video':
      case 'audio':
        for (l = 0; l < vu.length; l++) ut(vu[l], e);
        break;
      case 'source':
        ut('error', e);
        break;
      case 'img':
      case 'image':
      case 'link':
        (ut('error', e), ut('load', e));
        break;
      case 'details':
        ut('toggle', e);
        break;
      case 'input':
        (ut('invalid', e),
          If(
            e,
            a.value,
            a.defaultValue,
            a.checked,
            a.defaultChecked,
            a.type,
            a.name,
            !0
          ),
          Lu(e));
        break;
      case 'select':
        ut('invalid', e);
        break;
      case 'textarea':
        (ut('invalid', e), er(e, a.value, a.defaultValue, a.children), Lu(e));
    }
    ((l = a.children),
      (typeof l != 'string' && typeof l != 'number' && typeof l != 'bigint') ||
      e.textContent === '' + l ||
      a.suppressHydrationWarning === !0 ||
      ld(e.textContent, l)
        ? (a.popover != null && (ut('beforetoggle', e), ut('toggle', e)),
          a.onScroll != null && ut('scroll', e),
          a.onScrollEnd != null && ut('scrollend', e),
          a.onClick != null && (e.onclick = qn),
          (e = !0))
        : (e = !1),
      e || Nl(t));
  }
  function Gr(t) {
    for (Jt = t.return; Jt; )
      switch (Jt.tag) {
        case 5:
        case 13:
          Ae = !1;
          return;
        case 27:
        case 3:
          Ae = !0;
          return;
        default:
          Jt = Jt.return;
      }
  }
  function Za(t) {
    if (t !== Jt) return !1;
    if (!ot) return (Gr(t), (ot = !0), !1);
    var e = t.tag,
      l;
    if (
      ((l = e !== 3 && e !== 27) &&
        ((l = e === 5) &&
          ((l = t.type),
          (l =
            !(l !== 'form' && l !== 'button') || nf(t.type, t.memoizedProps))),
        (l = !l)),
      l && At && Nl(t),
      Gr(t),
      e === 13)
    ) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t))
        throw Error(r(317));
      t: {
        for (t = t.nextSibling, e = 0; t; ) {
          if (t.nodeType === 8)
            if (((l = t.data), l === '/$')) {
              if (e === 0) {
                At = Te(t.nextSibling);
                break t;
              }
              e--;
            } else (l !== '$' && l !== '$!' && l !== '$?') || e++;
          t = t.nextSibling;
        }
        At = null;
      }
    } else
      e === 27
        ? ((e = At), ml(t.type) ? ((t = of), (of = null), (At = t)) : (At = e))
        : (At = Jt ? Te(t.stateNode.nextSibling) : null);
    return !0;
  }
  function Va() {
    ((At = Jt = null), (ot = !1));
  }
  function Xr() {
    var t = Ul;
    return (
      t !== null &&
        (Pt === null ? (Pt = t) : Pt.push.apply(Pt, t), (Ul = null)),
      t
    );
  }
  function wa(t) {
    Ul === null ? (Ul = [t]) : Ul.push(t);
  }
  var Vi = N(null),
    Hl = null,
    qe = null;
  function Ie(t, e, l) {
    (q(Vi, e._currentValue), (e._currentValue = l));
  }
  function Ye(t) {
    ((t._currentValue = Vi.current), X(Vi));
  }
  function wi(t, e, l) {
    for (; t !== null; ) {
      var a = t.alternate;
      if (
        ((t.childLanes & e) !== e
          ? ((t.childLanes |= e), a !== null && (a.childLanes |= e))
          : a !== null && (a.childLanes & e) !== e && (a.childLanes |= e),
        t === l)
      )
        break;
      t = t.return;
    }
  }
  function Ki(t, e, l, a) {
    var u = t.child;
    for (u !== null && (u.return = t); u !== null; ) {
      var n = u.dependencies;
      if (n !== null) {
        var c = u.child;
        n = n.firstContext;
        t: for (; n !== null; ) {
          var f = n;
          n = u;
          for (var d = 0; d < e.length; d++)
            if (f.context === e[d]) {
              ((n.lanes |= l),
                (f = n.alternate),
                f !== null && (f.lanes |= l),
                wi(n.return, l, t),
                a || (c = null));
              break t;
            }
          n = f.next;
        }
      } else if (u.tag === 18) {
        if (((c = u.return), c === null)) throw Error(r(341));
        ((c.lanes |= l),
          (n = c.alternate),
          n !== null && (n.lanes |= l),
          wi(c, l, t),
          (c = null));
      } else c = u.child;
      if (c !== null) c.return = u;
      else
        for (c = u; c !== null; ) {
          if (c === t) {
            c = null;
            break;
          }
          if (((u = c.sibling), u !== null)) {
            ((u.return = c.return), (c = u));
            break;
          }
          c = c.return;
        }
      u = c;
    }
  }
  function Ka(t, e, l, a) {
    t = null;
    for (var u = e, n = !1; u !== null; ) {
      if (!n) {
        if ((u.flags & 524288) !== 0) n = !0;
        else if ((u.flags & 262144) !== 0) break;
      }
      if (u.tag === 10) {
        var c = u.alternate;
        if (c === null) throw Error(r(387));
        if (((c = c.memoizedProps), c !== null)) {
          var f = u.type;
          ae(u.pendingProps.value, c.value) ||
            (t !== null ? t.push(f) : (t = [f]));
        }
      } else if (u === te.current) {
        if (((c = u.alternate), c === null)) throw Error(r(387));
        c.memoizedState.memoizedState !== u.memoizedState.memoizedState &&
          (t !== null ? t.push(Eu) : (t = [Eu]));
      }
      u = u.return;
    }
    (t !== null && Ki(e, t, l, a), (e.flags |= 262144));
  }
  function ln(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!ae(t.context._currentValue, t.memoizedValue)) return !0;
      t = t.next;
    }
    return !1;
  }
  function Cl(t) {
    ((Hl = t),
      (qe = null),
      (t = t.dependencies),
      t !== null && (t.firstContext = null));
  }
  function wt(t) {
    return Lr(Hl, t);
  }
  function an(t, e) {
    return (Hl === null && Cl(t), Lr(t, e));
  }
  function Lr(t, e) {
    var l = e._currentValue;
    if (((e = { context: e, memoizedValue: l, next: null }), qe === null)) {
      if (t === null) throw Error(r(308));
      ((qe = e),
        (t.dependencies = { lanes: 0, firstContext: e }),
        (t.flags |= 524288));
    } else qe = qe.next = e;
    return l;
  }
  var Sm =
      typeof AbortController < 'u'
        ? AbortController
        : function () {
            var t = [],
              e = (this.signal = {
                aborted: !1,
                addEventListener: function (l, a) {
                  t.push(a);
                },
              });
            this.abort = function () {
              ((e.aborted = !0),
                t.forEach(function (l) {
                  return l();
                }));
            };
          },
    bm = i.unstable_scheduleCallback,
    pm = i.unstable_NormalPriority,
    Nt = {
      $$typeof: w,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function Ji() {
    return { controller: new Sm(), data: new Map(), refCount: 0 };
  }
  function Ja(t) {
    (t.refCount--,
      t.refCount === 0 &&
        bm(pm, function () {
          t.controller.abort();
        }));
  }
  var $a = null,
    $i = 0,
    ia = 0,
    ca = null;
  function Em(t, e) {
    if ($a === null) {
      var l = ($a = []);
      (($i = 0),
        (ia = Wc()),
        (ca = {
          status: 'pending',
          value: void 0,
          then: function (a) {
            l.push(a);
          },
        }));
    }
    return ($i++, e.then(Qr, Qr), e);
  }
  function Qr() {
    if (--$i === 0 && $a !== null) {
      ca !== null && (ca.status = 'fulfilled');
      var t = $a;
      (($a = null), (ia = 0), (ca = null));
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function Tm(t, e) {
    var l = [],
      a = {
        status: 'pending',
        value: null,
        reason: null,
        then: function (u) {
          l.push(u);
        },
      };
    return (
      t.then(
        function () {
          ((a.status = 'fulfilled'), (a.value = e));
          for (var u = 0; u < l.length; u++) (0, l[u])(e);
        },
        function (u) {
          for (a.status = 'rejected', a.reason = u, u = 0; u < l.length; u++)
            (0, l[u])(void 0);
        }
      ),
      a
    );
  }
  var Zr = D.S;
  D.S = function (t, e) {
    (typeof e == 'object' &&
      e !== null &&
      typeof e.then == 'function' &&
      Em(t, e),
      Zr !== null && Zr(t, e));
  };
  var Bl = N(null);
  function ki() {
    var t = Bl.current;
    return t !== null ? t : St.pooledCache;
  }
  function un(t, e) {
    e === null ? q(Bl, Bl.current) : q(Bl, e.pool);
  }
  function Vr() {
    var t = ki();
    return t === null ? null : { parent: Nt._currentValue, pool: t };
  }
  var ka = Error(r(460)),
    wr = Error(r(474)),
    nn = Error(r(542)),
    Wi = { then: function () {} };
  function Kr(t) {
    return ((t = t.status), t === 'fulfilled' || t === 'rejected');
  }
  function cn() {}
  function Jr(t, e, l) {
    switch (
      ((l = t[l]),
      l === void 0 ? t.push(e) : l !== e && (e.then(cn, cn), (e = l)),
      e.status)
    ) {
      case 'fulfilled':
        return e.value;
      case 'rejected':
        throw ((t = e.reason), kr(t), t);
      default:
        if (typeof e.status == 'string') e.then(cn, cn);
        else {
          if (((t = St), t !== null && 100 < t.shellSuspendCounter))
            throw Error(r(482));
          ((t = e),
            (t.status = 'pending'),
            t.then(
              function (a) {
                if (e.status === 'pending') {
                  var u = e;
                  ((u.status = 'fulfilled'), (u.value = a));
                }
              },
              function (a) {
                if (e.status === 'pending') {
                  var u = e;
                  ((u.status = 'rejected'), (u.reason = a));
                }
              }
            ));
        }
        switch (e.status) {
          case 'fulfilled':
            return e.value;
          case 'rejected':
            throw ((t = e.reason), kr(t), t);
        }
        throw ((Wa = e), ka);
    }
  }
  var Wa = null;
  function $r() {
    if (Wa === null) throw Error(r(459));
    var t = Wa;
    return ((Wa = null), t);
  }
  function kr(t) {
    if (t === ka || t === nn) throw Error(r(483));
  }
  var tl = !1;
  function Fi(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function Pi(t, e) {
    ((t = t.updateQueue),
      e.updateQueue === t &&
        (e.updateQueue = {
          baseState: t.baseState,
          firstBaseUpdate: t.firstBaseUpdate,
          lastBaseUpdate: t.lastBaseUpdate,
          shared: t.shared,
          callbacks: null,
        }));
  }
  function el(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function ll(t, e, l) {
    var a = t.updateQueue;
    if (a === null) return null;
    if (((a = a.shared), (st & 2) !== 0)) {
      var u = a.pending;
      return (
        u === null ? (e.next = e) : ((e.next = u.next), (u.next = e)),
        (a.pending = e),
        (e = Pu(t)),
        Br(t, null, l),
        e
      );
    }
    return (Fu(t, a, e, l), Pu(t));
  }
  function Fa(t, e, l) {
    if (
      ((e = e.updateQueue), e !== null && ((e = e.shared), (l & 4194048) !== 0))
    ) {
      var a = e.lanes;
      ((a &= t.pendingLanes), (l |= a), (e.lanes = l), Qf(t, l));
    }
  }
  function Ii(t, e) {
    var l = t.updateQueue,
      a = t.alternate;
    if (a !== null && ((a = a.updateQueue), l === a)) {
      var u = null,
        n = null;
      if (((l = l.firstBaseUpdate), l !== null)) {
        do {
          var c = {
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null,
          };
          (n === null ? (u = n = c) : (n = n.next = c), (l = l.next));
        } while (l !== null);
        n === null ? (u = n = e) : (n = n.next = e);
      } else u = n = e;
      ((l = {
        baseState: a.baseState,
        firstBaseUpdate: u,
        lastBaseUpdate: n,
        shared: a.shared,
        callbacks: a.callbacks,
      }),
        (t.updateQueue = l));
      return;
    }
    ((t = l.lastBaseUpdate),
      t === null ? (l.firstBaseUpdate = e) : (t.next = e),
      (l.lastBaseUpdate = e));
  }
  var tc = !1;
  function Pa() {
    if (tc) {
      var t = ca;
      if (t !== null) throw t;
    }
  }
  function Ia(t, e, l, a) {
    tc = !1;
    var u = t.updateQueue;
    tl = !1;
    var n = u.firstBaseUpdate,
      c = u.lastBaseUpdate,
      f = u.shared.pending;
    if (f !== null) {
      u.shared.pending = null;
      var d = f,
        T = d.next;
      ((d.next = null), c === null ? (n = T) : (c.next = T), (c = d));
      var z = t.alternate;
      z !== null &&
        ((z = z.updateQueue),
        (f = z.lastBaseUpdate),
        f !== c &&
          (f === null ? (z.firstBaseUpdate = T) : (f.next = T),
          (z.lastBaseUpdate = d)));
    }
    if (n !== null) {
      var U = u.baseState;
      ((c = 0), (z = T = d = null), (f = n));
      do {
        var A = f.lane & -536870913,
          M = A !== f.lane;
        if (M ? (it & A) === A : (a & A) === A) {
          (A !== 0 && A === ia && (tc = !0),
            z !== null &&
              (z = z.next =
                {
                  lane: 0,
                  tag: f.tag,
                  payload: f.payload,
                  callback: null,
                  next: null,
                }));
          t: {
            var P = t,
              $ = f;
            A = e;
            var vt = l;
            switch ($.tag) {
              case 1:
                if (((P = $.payload), typeof P == 'function')) {
                  U = P.call(vt, U, A);
                  break t;
                }
                U = P;
                break t;
              case 3:
                P.flags = (P.flags & -65537) | 128;
              case 0:
                if (
                  ((P = $.payload),
                  (A = typeof P == 'function' ? P.call(vt, U, A) : P),
                  A == null)
                )
                  break t;
                U = R({}, U, A);
                break t;
              case 2:
                tl = !0;
            }
          }
          ((A = f.callback),
            A !== null &&
              ((t.flags |= 64),
              M && (t.flags |= 8192),
              (M = u.callbacks),
              M === null ? (u.callbacks = [A]) : M.push(A)));
        } else
          ((M = {
            lane: A,
            tag: f.tag,
            payload: f.payload,
            callback: f.callback,
            next: null,
          }),
            z === null ? ((T = z = M), (d = U)) : (z = z.next = M),
            (c |= A));
        if (((f = f.next), f === null)) {
          if (((f = u.shared.pending), f === null)) break;
          ((M = f),
            (f = M.next),
            (M.next = null),
            (u.lastBaseUpdate = M),
            (u.shared.pending = null));
        }
      } while (!0);
      (z === null && (d = U),
        (u.baseState = d),
        (u.firstBaseUpdate = T),
        (u.lastBaseUpdate = z),
        n === null && (u.shared.lanes = 0),
        (ol |= c),
        (t.lanes = c),
        (t.memoizedState = U));
    }
  }
  function Wr(t, e) {
    if (typeof t != 'function') throw Error(r(191, t));
    t.call(e);
  }
  function Fr(t, e) {
    var l = t.callbacks;
    if (l !== null)
      for (t.callbacks = null, t = 0; t < l.length; t++) Wr(l[t], e);
  }
  var fa = N(null),
    fn = N(0);
  function Pr(t, e) {
    ((t = Ve), q(fn, t), q(fa, e), (Ve = t | e.baseLanes));
  }
  function ec() {
    (q(fn, Ve), q(fa, fa.current));
  }
  function lc() {
    ((Ve = fn.current), X(fa), X(fn));
  }
  var al = 0,
    et = null,
    ht = null,
    xt = null,
    rn = !1,
    ra = !1,
    ql = !1,
    on = 0,
    tu = 0,
    oa = null,
    Rm = 0;
  function zt() {
    throw Error(r(321));
  }
  function ac(t, e) {
    if (e === null) return !1;
    for (var l = 0; l < e.length && l < t.length; l++)
      if (!ae(t[l], e[l])) return !1;
    return !0;
  }
  function uc(t, e, l, a, u, n) {
    return (
      (al = n),
      (et = e),
      (e.memoizedState = null),
      (e.updateQueue = null),
      (e.lanes = 0),
      (D.H = t === null || t.memoizedState === null ? qo : Yo),
      (ql = !1),
      (n = l(a, u)),
      (ql = !1),
      ra && (n = to(e, l, a, u)),
      Ir(t),
      n
    );
  }
  function Ir(t) {
    D.H = yn;
    var e = ht !== null && ht.next !== null;
    if (((al = 0), (xt = ht = et = null), (rn = !1), (tu = 0), (oa = null), e))
      throw Error(r(300));
    t === null ||
      qt ||
      ((t = t.dependencies), t !== null && ln(t) && (qt = !0));
  }
  function to(t, e, l, a) {
    et = t;
    var u = 0;
    do {
      if ((ra && (oa = null), (tu = 0), (ra = !1), 25 <= u))
        throw Error(r(301));
      if (((u += 1), (xt = ht = null), t.updateQueue != null)) {
        var n = t.updateQueue;
        ((n.lastEffect = null),
          (n.events = null),
          (n.stores = null),
          n.memoCache != null && (n.memoCache.index = 0));
      }
      ((D.H = xm), (n = e(l, a)));
    } while (ra);
    return n;
  }
  function Am() {
    var t = D.H,
      e = t.useState()[0];
    return (
      (e = typeof e.then == 'function' ? eu(e) : e),
      (t = t.useState()[0]),
      (ht !== null ? ht.memoizedState : null) !== t && (et.flags |= 1024),
      e
    );
  }
  function nc() {
    var t = on !== 0;
    return ((on = 0), t);
  }
  function ic(t, e, l) {
    ((e.updateQueue = t.updateQueue), (e.flags &= -2053), (t.lanes &= ~l));
  }
  function cc(t) {
    if (rn) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        (e !== null && (e.pending = null), (t = t.next));
      }
      rn = !1;
    }
    ((al = 0), (xt = ht = et = null), (ra = !1), (tu = on = 0), (oa = null));
  }
  function Wt() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null,
    };
    return (xt === null ? (et.memoizedState = xt = t) : (xt = xt.next = t), xt);
  }
  function Ut() {
    if (ht === null) {
      var t = et.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = ht.next;
    var e = xt === null ? et.memoizedState : xt.next;
    if (e !== null) ((xt = e), (ht = t));
    else {
      if (t === null)
        throw et.alternate === null ? Error(r(467)) : Error(r(310));
      ((ht = t),
        (t = {
          memoizedState: ht.memoizedState,
          baseState: ht.baseState,
          baseQueue: ht.baseQueue,
          queue: ht.queue,
          next: null,
        }),
        xt === null ? (et.memoizedState = xt = t) : (xt = xt.next = t));
    }
    return xt;
  }
  function fc() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function eu(t) {
    var e = tu;
    return (
      (tu += 1),
      oa === null && (oa = []),
      (t = Jr(oa, t, e)),
      (e = et),
      (xt === null ? e.memoizedState : xt.next) === null &&
        ((e = e.alternate),
        (D.H = e === null || e.memoizedState === null ? qo : Yo)),
      t
    );
  }
  function sn(t) {
    if (t !== null && typeof t == 'object') {
      if (typeof t.then == 'function') return eu(t);
      if (t.$$typeof === w) return wt(t);
    }
    throw Error(r(438, String(t)));
  }
  function rc(t) {
    var e = null,
      l = et.updateQueue;
    if ((l !== null && (e = l.memoCache), e == null)) {
      var a = et.alternate;
      a !== null &&
        ((a = a.updateQueue),
        a !== null &&
          ((a = a.memoCache),
          a != null &&
            (e = {
              data: a.data.map(function (u) {
                return u.slice();
              }),
              index: 0,
            })));
    }
    if (
      (e == null && (e = { data: [], index: 0 }),
      l === null && ((l = fc()), (et.updateQueue = l)),
      (l.memoCache = e),
      (l = e.data[e.index]),
      l === void 0)
    )
      for (l = e.data[e.index] = Array(t), a = 0; a < t; a++) l[a] = It;
    return (e.index++, l);
  }
  function je(t, e) {
    return typeof e == 'function' ? e(t) : e;
  }
  function dn(t) {
    var e = Ut();
    return oc(e, ht, t);
  }
  function oc(t, e, l) {
    var a = t.queue;
    if (a === null) throw Error(r(311));
    a.lastRenderedReducer = l;
    var u = t.baseQueue,
      n = a.pending;
    if (n !== null) {
      if (u !== null) {
        var c = u.next;
        ((u.next = n.next), (n.next = c));
      }
      ((e.baseQueue = u = n), (a.pending = null));
    }
    if (((n = t.baseState), u === null)) t.memoizedState = n;
    else {
      e = u.next;
      var f = (c = null),
        d = null,
        T = e,
        z = !1;
      do {
        var U = T.lane & -536870913;
        if (U !== T.lane ? (it & U) === U : (al & U) === U) {
          var A = T.revertLane;
          if (A === 0)
            (d !== null &&
              (d = d.next =
                {
                  lane: 0,
                  revertLane: 0,
                  action: T.action,
                  hasEagerState: T.hasEagerState,
                  eagerState: T.eagerState,
                  next: null,
                }),
              U === ia && (z = !0));
          else if ((al & A) === A) {
            ((T = T.next), A === ia && (z = !0));
            continue;
          } else
            ((U = {
              lane: 0,
              revertLane: T.revertLane,
              action: T.action,
              hasEagerState: T.hasEagerState,
              eagerState: T.eagerState,
              next: null,
            }),
              d === null ? ((f = d = U), (c = n)) : (d = d.next = U),
              (et.lanes |= A),
              (ol |= A));
          ((U = T.action),
            ql && l(n, U),
            (n = T.hasEagerState ? T.eagerState : l(n, U)));
        } else
          ((A = {
            lane: U,
            revertLane: T.revertLane,
            action: T.action,
            hasEagerState: T.hasEagerState,
            eagerState: T.eagerState,
            next: null,
          }),
            d === null ? ((f = d = A), (c = n)) : (d = d.next = A),
            (et.lanes |= U),
            (ol |= U));
        T = T.next;
      } while (T !== null && T !== e);
      if (
        (d === null ? (c = n) : (d.next = f),
        !ae(n, t.memoizedState) && ((qt = !0), z && ((l = ca), l !== null)))
      )
        throw l;
      ((t.memoizedState = n),
        (t.baseState = c),
        (t.baseQueue = d),
        (a.lastRenderedState = n));
    }
    return (u === null && (a.lanes = 0), [t.memoizedState, a.dispatch]);
  }
  function sc(t) {
    var e = Ut(),
      l = e.queue;
    if (l === null) throw Error(r(311));
    l.lastRenderedReducer = t;
    var a = l.dispatch,
      u = l.pending,
      n = e.memoizedState;
    if (u !== null) {
      l.pending = null;
      var c = (u = u.next);
      do ((n = t(n, c.action)), (c = c.next));
      while (c !== u);
      (ae(n, e.memoizedState) || (qt = !0),
        (e.memoizedState = n),
        e.baseQueue === null && (e.baseState = n),
        (l.lastRenderedState = n));
    }
    return [n, a];
  }
  function eo(t, e, l) {
    var a = et,
      u = Ut(),
      n = ot;
    if (n) {
      if (l === void 0) throw Error(r(407));
      l = l();
    } else l = e();
    var c = !ae((ht || u).memoizedState, l);
    (c && ((u.memoizedState = l), (qt = !0)), (u = u.queue));
    var f = uo.bind(null, a, u, t);
    if (
      (lu(2048, 8, f, [t]),
      u.getSnapshot !== e || c || (xt !== null && xt.memoizedState.tag & 1))
    ) {
      if (
        ((a.flags |= 2048),
        sa(9, hn(), ao.bind(null, a, u, l, e), null),
        St === null)
      )
        throw Error(r(349));
      n || (al & 124) !== 0 || lo(a, e, l);
    }
    return l;
  }
  function lo(t, e, l) {
    ((t.flags |= 16384),
      (t = { getSnapshot: e, value: l }),
      (e = et.updateQueue),
      e === null
        ? ((e = fc()), (et.updateQueue = e), (e.stores = [t]))
        : ((l = e.stores), l === null ? (e.stores = [t]) : l.push(t)));
  }
  function ao(t, e, l, a) {
    ((e.value = l), (e.getSnapshot = a), no(e) && io(t));
  }
  function uo(t, e, l) {
    return l(function () {
      no(e) && io(t);
    });
  }
  function no(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var l = e();
      return !ae(t, l);
    } catch {
      return !0;
    }
  }
  function io(t) {
    var e = la(t, 2);
    e !== null && re(e, t, 2);
  }
  function dc(t) {
    var e = Wt();
    if (typeof t == 'function') {
      var l = t;
      if (((t = l()), ql)) {
        We(!0);
        try {
          l();
        } finally {
          We(!1);
        }
      }
    }
    return (
      (e.memoizedState = e.baseState = t),
      (e.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: je,
        lastRenderedState: t,
      }),
      e
    );
  }
  function co(t, e, l, a) {
    return ((t.baseState = l), oc(t, ht, typeof a == 'function' ? a : je));
  }
  function Mm(t, e, l, a, u) {
    if (vn(t)) throw Error(r(485));
    if (((t = e.action), t !== null)) {
      var n = {
        payload: u,
        action: t,
        next: null,
        isTransition: !0,
        status: 'pending',
        value: null,
        reason: null,
        listeners: [],
        then: function (c) {
          n.listeners.push(c);
        },
      };
      (D.T !== null ? l(!0) : (n.isTransition = !1),
        a(n),
        (l = e.pending),
        l === null
          ? ((n.next = e.pending = n), fo(e, n))
          : ((n.next = l.next), (e.pending = l.next = n)));
    }
  }
  function fo(t, e) {
    var l = e.action,
      a = e.payload,
      u = t.state;
    if (e.isTransition) {
      var n = D.T,
        c = {};
      D.T = c;
      try {
        var f = l(u, a),
          d = D.S;
        (d !== null && d(c, f), ro(t, e, f));
      } catch (T) {
        hc(t, e, T);
      } finally {
        D.T = n;
      }
    } else
      try {
        ((n = l(u, a)), ro(t, e, n));
      } catch (T) {
        hc(t, e, T);
      }
  }
  function ro(t, e, l) {
    l !== null && typeof l == 'object' && typeof l.then == 'function'
      ? l.then(
          function (a) {
            oo(t, e, a);
          },
          function (a) {
            return hc(t, e, a);
          }
        )
      : oo(t, e, l);
  }
  function oo(t, e, l) {
    ((e.status = 'fulfilled'),
      (e.value = l),
      so(e),
      (t.state = l),
      (e = t.pending),
      e !== null &&
        ((l = e.next),
        l === e ? (t.pending = null) : ((l = l.next), (e.next = l), fo(t, l))));
  }
  function hc(t, e, l) {
    var a = t.pending;
    if (((t.pending = null), a !== null)) {
      a = a.next;
      do ((e.status = 'rejected'), (e.reason = l), so(e), (e = e.next));
      while (e !== a);
    }
    t.action = null;
  }
  function so(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function ho(t, e) {
    return e;
  }
  function mo(t, e) {
    if (ot) {
      var l = St.formState;
      if (l !== null) {
        t: {
          var a = et;
          if (ot) {
            if (At) {
              e: {
                for (var u = At, n = Ae; u.nodeType !== 8; ) {
                  if (!n) {
                    u = null;
                    break e;
                  }
                  if (((u = Te(u.nextSibling)), u === null)) {
                    u = null;
                    break e;
                  }
                }
                ((n = u.data), (u = n === 'F!' || n === 'F' ? u : null));
              }
              if (u) {
                ((At = Te(u.nextSibling)), (a = u.data === 'F!'));
                break t;
              }
            }
            Nl(a);
          }
          a = !1;
        }
        a && (e = l[0]);
      }
    }
    return (
      (l = Wt()),
      (l.memoizedState = l.baseState = e),
      (a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: ho,
        lastRenderedState: e,
      }),
      (l.queue = a),
      (l = Ho.bind(null, et, a)),
      (a.dispatch = l),
      (a = dc(!1)),
      (n = Sc.bind(null, et, !1, a.queue)),
      (a = Wt()),
      (u = { state: e, dispatch: null, action: t, pending: null }),
      (a.queue = u),
      (l = Mm.bind(null, et, u, n, l)),
      (u.dispatch = l),
      (a.memoizedState = t),
      [e, l, !1]
    );
  }
  function vo(t) {
    var e = Ut();
    return yo(e, ht, t);
  }
  function yo(t, e, l) {
    if (
      ((e = oc(t, e, ho)[0]),
      (t = dn(je)[0]),
      typeof e == 'object' && e !== null && typeof e.then == 'function')
    )
      try {
        var a = eu(e);
      } catch (c) {
        throw c === ka ? nn : c;
      }
    else a = e;
    e = Ut();
    var u = e.queue,
      n = u.dispatch;
    return (
      l !== e.memoizedState &&
        ((et.flags |= 2048), sa(9, hn(), Om.bind(null, u, l), null)),
      [a, n, t]
    );
  }
  function Om(t, e) {
    t.action = e;
  }
  function go(t) {
    var e = Ut(),
      l = ht;
    if (l !== null) return yo(e, l, t);
    (Ut(), (e = e.memoizedState), (l = Ut()));
    var a = l.queue.dispatch;
    return ((l.memoizedState = t), [e, a, !1]);
  }
  function sa(t, e, l, a) {
    return (
      (t = { tag: t, create: l, deps: a, inst: e, next: null }),
      (e = et.updateQueue),
      e === null && ((e = fc()), (et.updateQueue = e)),
      (l = e.lastEffect),
      l === null
        ? (e.lastEffect = t.next = t)
        : ((a = l.next), (l.next = t), (t.next = a), (e.lastEffect = t)),
      t
    );
  }
  function hn() {
    return { destroy: void 0, resource: void 0 };
  }
  function So() {
    return Ut().memoizedState;
  }
  function mn(t, e, l, a) {
    var u = Wt();
    ((a = a === void 0 ? null : a),
      (et.flags |= t),
      (u.memoizedState = sa(1 | e, hn(), l, a)));
  }
  function lu(t, e, l, a) {
    var u = Ut();
    a = a === void 0 ? null : a;
    var n = u.memoizedState.inst;
    ht !== null && a !== null && ac(a, ht.memoizedState.deps)
      ? (u.memoizedState = sa(e, n, l, a))
      : ((et.flags |= t), (u.memoizedState = sa(1 | e, n, l, a)));
  }
  function bo(t, e) {
    mn(8390656, 8, t, e);
  }
  function po(t, e) {
    lu(2048, 8, t, e);
  }
  function Eo(t, e) {
    return lu(4, 2, t, e);
  }
  function To(t, e) {
    return lu(4, 4, t, e);
  }
  function Ro(t, e) {
    if (typeof e == 'function') {
      t = t();
      var l = e(t);
      return function () {
        typeof l == 'function' ? l() : e(null);
      };
    }
    if (e != null)
      return (
        (t = t()),
        (e.current = t),
        function () {
          e.current = null;
        }
      );
  }
  function Ao(t, e, l) {
    ((l = l != null ? l.concat([t]) : null), lu(4, 4, Ro.bind(null, e, t), l));
  }
  function mc() {}
  function Mo(t, e) {
    var l = Ut();
    e = e === void 0 ? null : e;
    var a = l.memoizedState;
    return e !== null && ac(e, a[1]) ? a[0] : ((l.memoizedState = [t, e]), t);
  }
  function Oo(t, e) {
    var l = Ut();
    e = e === void 0 ? null : e;
    var a = l.memoizedState;
    if (e !== null && ac(e, a[1])) return a[0];
    if (((a = t()), ql)) {
      We(!0);
      try {
        t();
      } finally {
        We(!1);
      }
    }
    return ((l.memoizedState = [a, e]), a);
  }
  function vc(t, e, l) {
    return l === void 0 || (al & 1073741824) !== 0
      ? (t.memoizedState = e)
      : ((t.memoizedState = l), (t = _s()), (et.lanes |= t), (ol |= t), l);
  }
  function zo(t, e, l, a) {
    return ae(l, e)
      ? l
      : fa.current !== null
        ? ((t = vc(t, l, a)), ae(t, e) || (qt = !0), t)
        : (al & 42) === 0
          ? ((qt = !0), (t.memoizedState = l))
          : ((t = _s()), (et.lanes |= t), (ol |= t), e);
  }
  function Do(t, e, l, a, u) {
    var n = j.p;
    j.p = n !== 0 && 8 > n ? n : 8;
    var c = D.T,
      f = {};
    ((D.T = f), Sc(t, !1, e, l));
    try {
      var d = u(),
        T = D.S;
      if (
        (T !== null && T(f, d),
        d !== null && typeof d == 'object' && typeof d.then == 'function')
      ) {
        var z = Tm(d, a);
        au(t, e, z, fe(t));
      } else au(t, e, a, fe(t));
    } catch (U) {
      au(t, e, { then: function () {}, status: 'rejected', reason: U }, fe());
    } finally {
      ((j.p = n), (D.T = c));
    }
  }
  function zm() {}
  function yc(t, e, l, a) {
    if (t.tag !== 5) throw Error(r(476));
    var u = _o(t).queue;
    Do(
      t,
      u,
      e,
      W,
      l === null
        ? zm
        : function () {
            return (xo(t), l(a));
          }
    );
  }
  function _o(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: W,
      baseState: W,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: je,
        lastRenderedState: W,
      },
      next: null,
    };
    var l = {};
    return (
      (e.next = {
        memoizedState: l,
        baseState: l,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: je,
          lastRenderedState: l,
        },
        next: null,
      }),
      (t.memoizedState = e),
      (t = t.alternate),
      t !== null && (t.memoizedState = e),
      e
    );
  }
  function xo(t) {
    var e = _o(t).next.queue;
    au(t, e, {}, fe());
  }
  function gc() {
    return wt(Eu);
  }
  function Uo() {
    return Ut().memoizedState;
  }
  function No() {
    return Ut().memoizedState;
  }
  function Dm(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var l = fe();
          t = el(l);
          var a = ll(e, t, l);
          (a !== null && (re(a, e, l), Fa(a, e, l)),
            (e = { cache: Ji() }),
            (t.payload = e));
          return;
      }
      e = e.return;
    }
  }
  function _m(t, e, l) {
    var a = fe();
    ((l = {
      lane: a,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      vn(t)
        ? Co(e, l)
        : ((l = Yi(t, e, l, a)), l !== null && (re(l, t, a), Bo(l, e, a))));
  }
  function Ho(t, e, l) {
    var a = fe();
    au(t, e, l, a);
  }
  function au(t, e, l, a) {
    var u = {
      lane: a,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (vn(t)) Co(e, u);
    else {
      var n = t.alternate;
      if (
        t.lanes === 0 &&
        (n === null || n.lanes === 0) &&
        ((n = e.lastRenderedReducer), n !== null)
      )
        try {
          var c = e.lastRenderedState,
            f = n(c, l);
          if (((u.hasEagerState = !0), (u.eagerState = f), ae(f, c)))
            return (Fu(t, e, u, 0), St === null && Wu(), !1);
        } catch {
        } finally {
        }
      if (((l = Yi(t, e, u, a)), l !== null))
        return (re(l, t, a), Bo(l, e, a), !0);
    }
    return !1;
  }
  function Sc(t, e, l, a) {
    if (
      ((a = {
        lane: 2,
        revertLane: Wc(),
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      vn(t))
    ) {
      if (e) throw Error(r(479));
    } else ((e = Yi(t, l, a, 2)), e !== null && re(e, t, 2));
  }
  function vn(t) {
    var e = t.alternate;
    return t === et || (e !== null && e === et);
  }
  function Co(t, e) {
    ra = rn = !0;
    var l = t.pending;
    (l === null ? (e.next = e) : ((e.next = l.next), (l.next = e)),
      (t.pending = e));
  }
  function Bo(t, e, l) {
    if ((l & 4194048) !== 0) {
      var a = e.lanes;
      ((a &= t.pendingLanes), (l |= a), (e.lanes = l), Qf(t, l));
    }
  }
  var yn = {
      readContext: wt,
      use: sn,
      useCallback: zt,
      useContext: zt,
      useEffect: zt,
      useImperativeHandle: zt,
      useLayoutEffect: zt,
      useInsertionEffect: zt,
      useMemo: zt,
      useReducer: zt,
      useRef: zt,
      useState: zt,
      useDebugValue: zt,
      useDeferredValue: zt,
      useTransition: zt,
      useSyncExternalStore: zt,
      useId: zt,
      useHostTransitionStatus: zt,
      useFormState: zt,
      useActionState: zt,
      useOptimistic: zt,
      useMemoCache: zt,
      useCacheRefresh: zt,
    },
    qo = {
      readContext: wt,
      use: sn,
      useCallback: function (t, e) {
        return ((Wt().memoizedState = [t, e === void 0 ? null : e]), t);
      },
      useContext: wt,
      useEffect: bo,
      useImperativeHandle: function (t, e, l) {
        ((l = l != null ? l.concat([t]) : null),
          mn(4194308, 4, Ro.bind(null, e, t), l));
      },
      useLayoutEffect: function (t, e) {
        return mn(4194308, 4, t, e);
      },
      useInsertionEffect: function (t, e) {
        mn(4, 2, t, e);
      },
      useMemo: function (t, e) {
        var l = Wt();
        e = e === void 0 ? null : e;
        var a = t();
        if (ql) {
          We(!0);
          try {
            t();
          } finally {
            We(!1);
          }
        }
        return ((l.memoizedState = [a, e]), a);
      },
      useReducer: function (t, e, l) {
        var a = Wt();
        if (l !== void 0) {
          var u = l(e);
          if (ql) {
            We(!0);
            try {
              l(e);
            } finally {
              We(!1);
            }
          }
        } else u = e;
        return (
          (a.memoizedState = a.baseState = u),
          (t = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: t,
            lastRenderedState: u,
          }),
          (a.queue = t),
          (t = t.dispatch = _m.bind(null, et, t)),
          [a.memoizedState, t]
        );
      },
      useRef: function (t) {
        var e = Wt();
        return ((t = { current: t }), (e.memoizedState = t));
      },
      useState: function (t) {
        t = dc(t);
        var e = t.queue,
          l = Ho.bind(null, et, e);
        return ((e.dispatch = l), [t.memoizedState, l]);
      },
      useDebugValue: mc,
      useDeferredValue: function (t, e) {
        var l = Wt();
        return vc(l, t, e);
      },
      useTransition: function () {
        var t = dc(!1);
        return (
          (t = Do.bind(null, et, t.queue, !0, !1)),
          (Wt().memoizedState = t),
          [!1, t]
        );
      },
      useSyncExternalStore: function (t, e, l) {
        var a = et,
          u = Wt();
        if (ot) {
          if (l === void 0) throw Error(r(407));
          l = l();
        } else {
          if (((l = e()), St === null)) throw Error(r(349));
          (it & 124) !== 0 || lo(a, e, l);
        }
        u.memoizedState = l;
        var n = { value: l, getSnapshot: e };
        return (
          (u.queue = n),
          bo(uo.bind(null, a, n, t), [t]),
          (a.flags |= 2048),
          sa(9, hn(), ao.bind(null, a, n, l, e), null),
          l
        );
      },
      useId: function () {
        var t = Wt(),
          e = St.identifierPrefix;
        if (ot) {
          var l = Be,
            a = Ce;
          ((l = (a & ~(1 << (32 - le(a) - 1))).toString(32) + l),
            (e = '«' + e + 'R' + l),
            (l = on++),
            0 < l && (e += 'H' + l.toString(32)),
            (e += '»'));
        } else ((l = Rm++), (e = '«' + e + 'r' + l.toString(32) + '»'));
        return (t.memoizedState = e);
      },
      useHostTransitionStatus: gc,
      useFormState: mo,
      useActionState: mo,
      useOptimistic: function (t) {
        var e = Wt();
        e.memoizedState = e.baseState = t;
        var l = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null,
        };
        return (
          (e.queue = l),
          (e = Sc.bind(null, et, !0, l)),
          (l.dispatch = e),
          [t, e]
        );
      },
      useMemoCache: rc,
      useCacheRefresh: function () {
        return (Wt().memoizedState = Dm.bind(null, et));
      },
    },
    Yo = {
      readContext: wt,
      use: sn,
      useCallback: Mo,
      useContext: wt,
      useEffect: po,
      useImperativeHandle: Ao,
      useInsertionEffect: Eo,
      useLayoutEffect: To,
      useMemo: Oo,
      useReducer: dn,
      useRef: So,
      useState: function () {
        return dn(je);
      },
      useDebugValue: mc,
      useDeferredValue: function (t, e) {
        var l = Ut();
        return zo(l, ht.memoizedState, t, e);
      },
      useTransition: function () {
        var t = dn(je)[0],
          e = Ut().memoizedState;
        return [typeof t == 'boolean' ? t : eu(t), e];
      },
      useSyncExternalStore: eo,
      useId: Uo,
      useHostTransitionStatus: gc,
      useFormState: vo,
      useActionState: vo,
      useOptimistic: function (t, e) {
        var l = Ut();
        return co(l, ht, t, e);
      },
      useMemoCache: rc,
      useCacheRefresh: No,
    },
    xm = {
      readContext: wt,
      use: sn,
      useCallback: Mo,
      useContext: wt,
      useEffect: po,
      useImperativeHandle: Ao,
      useInsertionEffect: Eo,
      useLayoutEffect: To,
      useMemo: Oo,
      useReducer: sc,
      useRef: So,
      useState: function () {
        return sc(je);
      },
      useDebugValue: mc,
      useDeferredValue: function (t, e) {
        var l = Ut();
        return ht === null ? vc(l, t, e) : zo(l, ht.memoizedState, t, e);
      },
      useTransition: function () {
        var t = sc(je)[0],
          e = Ut().memoizedState;
        return [typeof t == 'boolean' ? t : eu(t), e];
      },
      useSyncExternalStore: eo,
      useId: Uo,
      useHostTransitionStatus: gc,
      useFormState: go,
      useActionState: go,
      useOptimistic: function (t, e) {
        var l = Ut();
        return ht !== null
          ? co(l, ht, t, e)
          : ((l.baseState = t), [t, l.queue.dispatch]);
      },
      useMemoCache: rc,
      useCacheRefresh: No,
    },
    da = null,
    uu = 0;
  function gn(t) {
    var e = uu;
    return ((uu += 1), da === null && (da = []), Jr(da, t, e));
  }
  function nu(t, e) {
    ((e = e.props.ref), (t.ref = e !== void 0 ? e : null));
  }
  function Sn(t, e) {
    throw e.$$typeof === H
      ? Error(r(525))
      : ((t = Object.prototype.toString.call(e)),
        Error(
          r(
            31,
            t === '[object Object]'
              ? 'object with keys {' + Object.keys(e).join(', ') + '}'
              : t
          )
        ));
  }
  function jo(t) {
    var e = t._init;
    return e(t._payload);
  }
  function Go(t) {
    function e(S, y) {
      if (t) {
        var p = S.deletions;
        p === null ? ((S.deletions = [y]), (S.flags |= 16)) : p.push(y);
      }
    }
    function l(S, y) {
      if (!t) return null;
      for (; y !== null; ) (e(S, y), (y = y.sibling));
      return null;
    }
    function a(S) {
      for (var y = new Map(); S !== null; )
        (S.key !== null ? y.set(S.key, S) : y.set(S.index, S), (S = S.sibling));
      return y;
    }
    function u(S, y) {
      return ((S = He(S, y)), (S.index = 0), (S.sibling = null), S);
    }
    function n(S, y, p) {
      return (
        (S.index = p),
        t
          ? ((p = S.alternate),
            p !== null
              ? ((p = p.index), p < y ? ((S.flags |= 67108866), y) : p)
              : ((S.flags |= 67108866), y))
          : ((S.flags |= 1048576), y)
      );
    }
    function c(S) {
      return (t && S.alternate === null && (S.flags |= 67108866), S);
    }
    function f(S, y, p, x) {
      return y === null || y.tag !== 6
        ? ((y = Gi(p, S.mode, x)), (y.return = S), y)
        : ((y = u(y, p)), (y.return = S), y);
    }
    function d(S, y, p, x) {
      var Q = p.type;
      return Q === V
        ? z(S, y, p.props.children, x, p.key)
        : y !== null &&
            (y.elementType === Q ||
              (typeof Q == 'object' &&
                Q !== null &&
                Q.$$typeof === Ct &&
                jo(Q) === y.type))
          ? ((y = u(y, p.props)), nu(y, p), (y.return = S), y)
          : ((y = Iu(p.type, p.key, p.props, null, S.mode, x)),
            nu(y, p),
            (y.return = S),
            y);
    }
    function T(S, y, p, x) {
      return y === null ||
        y.tag !== 4 ||
        y.stateNode.containerInfo !== p.containerInfo ||
        y.stateNode.implementation !== p.implementation
        ? ((y = Xi(p, S.mode, x)), (y.return = S), y)
        : ((y = u(y, p.children || [])), (y.return = S), y);
    }
    function z(S, y, p, x, Q) {
      return y === null || y.tag !== 7
        ? ((y = Dl(p, S.mode, x, Q)), (y.return = S), y)
        : ((y = u(y, p)), (y.return = S), y);
    }
    function U(S, y, p) {
      if (
        (typeof y == 'string' && y !== '') ||
        typeof y == 'number' ||
        typeof y == 'bigint'
      )
        return ((y = Gi('' + y, S.mode, p)), (y.return = S), y);
      if (typeof y == 'object' && y !== null) {
        switch (y.$$typeof) {
          case C:
            return (
              (p = Iu(y.type, y.key, y.props, null, S.mode, p)),
              nu(p, y),
              (p.return = S),
              p
            );
          case G:
            return ((y = Xi(y, S.mode, p)), (y.return = S), y);
          case Ct:
            var x = y._init;
            return ((y = x(y._payload)), U(S, y, p));
        }
        if (Zt(y) || Qt(y))
          return ((y = Dl(y, S.mode, p, null)), (y.return = S), y);
        if (typeof y.then == 'function') return U(S, gn(y), p);
        if (y.$$typeof === w) return U(S, an(S, y), p);
        Sn(S, y);
      }
      return null;
    }
    function A(S, y, p, x) {
      var Q = y !== null ? y.key : null;
      if (
        (typeof p == 'string' && p !== '') ||
        typeof p == 'number' ||
        typeof p == 'bigint'
      )
        return Q !== null ? null : f(S, y, '' + p, x);
      if (typeof p == 'object' && p !== null) {
        switch (p.$$typeof) {
          case C:
            return p.key === Q ? d(S, y, p, x) : null;
          case G:
            return p.key === Q ? T(S, y, p, x) : null;
          case Ct:
            return ((Q = p._init), (p = Q(p._payload)), A(S, y, p, x));
        }
        if (Zt(p) || Qt(p)) return Q !== null ? null : z(S, y, p, x, null);
        if (typeof p.then == 'function') return A(S, y, gn(p), x);
        if (p.$$typeof === w) return A(S, y, an(S, p), x);
        Sn(S, p);
      }
      return null;
    }
    function M(S, y, p, x, Q) {
      if (
        (typeof x == 'string' && x !== '') ||
        typeof x == 'number' ||
        typeof x == 'bigint'
      )
        return ((S = S.get(p) || null), f(y, S, '' + x, Q));
      if (typeof x == 'object' && x !== null) {
        switch (x.$$typeof) {
          case C:
            return (
              (S = S.get(x.key === null ? p : x.key) || null),
              d(y, S, x, Q)
            );
          case G:
            return (
              (S = S.get(x.key === null ? p : x.key) || null),
              T(y, S, x, Q)
            );
          case Ct:
            var lt = x._init;
            return ((x = lt(x._payload)), M(S, y, p, x, Q));
        }
        if (Zt(x) || Qt(x))
          return ((S = S.get(p) || null), z(y, S, x, Q, null));
        if (typeof x.then == 'function') return M(S, y, p, gn(x), Q);
        if (x.$$typeof === w) return M(S, y, p, an(y, x), Q);
        Sn(y, x);
      }
      return null;
    }
    function P(S, y, p, x) {
      for (
        var Q = null, lt = null, Z = y, k = (y = 0), jt = null;
        Z !== null && k < p.length;
        k++
      ) {
        Z.index > k ? ((jt = Z), (Z = null)) : (jt = Z.sibling);
        var rt = A(S, Z, p[k], x);
        if (rt === null) {
          Z === null && (Z = jt);
          break;
        }
        (t && Z && rt.alternate === null && e(S, Z),
          (y = n(rt, y, k)),
          lt === null ? (Q = rt) : (lt.sibling = rt),
          (lt = rt),
          (Z = jt));
      }
      if (k === p.length) return (l(S, Z), ot && xl(S, k), Q);
      if (Z === null) {
        for (; k < p.length; k++)
          ((Z = U(S, p[k], x)),
            Z !== null &&
              ((y = n(Z, y, k)),
              lt === null ? (Q = Z) : (lt.sibling = Z),
              (lt = Z)));
        return (ot && xl(S, k), Q);
      }
      for (Z = a(Z); k < p.length; k++)
        ((jt = M(Z, S, k, p[k], x)),
          jt !== null &&
            (t &&
              jt.alternate !== null &&
              Z.delete(jt.key === null ? k : jt.key),
            (y = n(jt, y, k)),
            lt === null ? (Q = jt) : (lt.sibling = jt),
            (lt = jt)));
      return (
        t &&
          Z.forEach(function (bl) {
            return e(S, bl);
          }),
        ot && xl(S, k),
        Q
      );
    }
    function $(S, y, p, x) {
      if (p == null) throw Error(r(151));
      for (
        var Q = null, lt = null, Z = y, k = (y = 0), jt = null, rt = p.next();
        Z !== null && !rt.done;
        k++, rt = p.next()
      ) {
        Z.index > k ? ((jt = Z), (Z = null)) : (jt = Z.sibling);
        var bl = A(S, Z, rt.value, x);
        if (bl === null) {
          Z === null && (Z = jt);
          break;
        }
        (t && Z && bl.alternate === null && e(S, Z),
          (y = n(bl, y, k)),
          lt === null ? (Q = bl) : (lt.sibling = bl),
          (lt = bl),
          (Z = jt));
      }
      if (rt.done) return (l(S, Z), ot && xl(S, k), Q);
      if (Z === null) {
        for (; !rt.done; k++, rt = p.next())
          ((rt = U(S, rt.value, x)),
            rt !== null &&
              ((y = n(rt, y, k)),
              lt === null ? (Q = rt) : (lt.sibling = rt),
              (lt = rt)));
        return (ot && xl(S, k), Q);
      }
      for (Z = a(Z); !rt.done; k++, rt = p.next())
        ((rt = M(Z, S, k, rt.value, x)),
          rt !== null &&
            (t &&
              rt.alternate !== null &&
              Z.delete(rt.key === null ? k : rt.key),
            (y = n(rt, y, k)),
            lt === null ? (Q = rt) : (lt.sibling = rt),
            (lt = rt)));
      return (
        t &&
          Z.forEach(function (U0) {
            return e(S, U0);
          }),
        ot && xl(S, k),
        Q
      );
    }
    function vt(S, y, p, x) {
      if (
        (typeof p == 'object' &&
          p !== null &&
          p.type === V &&
          p.key === null &&
          (p = p.props.children),
        typeof p == 'object' && p !== null)
      ) {
        switch (p.$$typeof) {
          case C:
            t: {
              for (var Q = p.key; y !== null; ) {
                if (y.key === Q) {
                  if (((Q = p.type), Q === V)) {
                    if (y.tag === 7) {
                      (l(S, y.sibling),
                        (x = u(y, p.props.children)),
                        (x.return = S),
                        (S = x));
                      break t;
                    }
                  } else if (
                    y.elementType === Q ||
                    (typeof Q == 'object' &&
                      Q !== null &&
                      Q.$$typeof === Ct &&
                      jo(Q) === y.type)
                  ) {
                    (l(S, y.sibling),
                      (x = u(y, p.props)),
                      nu(x, p),
                      (x.return = S),
                      (S = x));
                    break t;
                  }
                  l(S, y);
                  break;
                } else e(S, y);
                y = y.sibling;
              }
              p.type === V
                ? ((x = Dl(p.props.children, S.mode, x, p.key)),
                  (x.return = S),
                  (S = x))
                : ((x = Iu(p.type, p.key, p.props, null, S.mode, x)),
                  nu(x, p),
                  (x.return = S),
                  (S = x));
            }
            return c(S);
          case G:
            t: {
              for (Q = p.key; y !== null; ) {
                if (y.key === Q)
                  if (
                    y.tag === 4 &&
                    y.stateNode.containerInfo === p.containerInfo &&
                    y.stateNode.implementation === p.implementation
                  ) {
                    (l(S, y.sibling),
                      (x = u(y, p.children || [])),
                      (x.return = S),
                      (S = x));
                    break t;
                  } else {
                    l(S, y);
                    break;
                  }
                else e(S, y);
                y = y.sibling;
              }
              ((x = Xi(p, S.mode, x)), (x.return = S), (S = x));
            }
            return c(S);
          case Ct:
            return ((Q = p._init), (p = Q(p._payload)), vt(S, y, p, x));
        }
        if (Zt(p)) return P(S, y, p, x);
        if (Qt(p)) {
          if (((Q = Qt(p)), typeof Q != 'function')) throw Error(r(150));
          return ((p = Q.call(p)), $(S, y, p, x));
        }
        if (typeof p.then == 'function') return vt(S, y, gn(p), x);
        if (p.$$typeof === w) return vt(S, y, an(S, p), x);
        Sn(S, p);
      }
      return (typeof p == 'string' && p !== '') ||
        typeof p == 'number' ||
        typeof p == 'bigint'
        ? ((p = '' + p),
          y !== null && y.tag === 6
            ? (l(S, y.sibling), (x = u(y, p)), (x.return = S), (S = x))
            : (l(S, y), (x = Gi(p, S.mode, x)), (x.return = S), (S = x)),
          c(S))
        : l(S, y);
    }
    return function (S, y, p, x) {
      try {
        uu = 0;
        var Q = vt(S, y, p, x);
        return ((da = null), Q);
      } catch (Z) {
        if (Z === ka || Z === nn) throw Z;
        var lt = ue(29, Z, null, S.mode);
        return ((lt.lanes = x), (lt.return = S), lt);
      } finally {
      }
    };
  }
  var ha = Go(!0),
    Xo = Go(!1),
    ge = N(null),
    Me = null;
  function ul(t) {
    var e = t.alternate;
    (q(Ht, Ht.current & 1),
      q(ge, t),
      Me === null &&
        (e === null || fa.current !== null || e.memoizedState !== null) &&
        (Me = t));
  }
  function Lo(t) {
    if (t.tag === 22) {
      if ((q(Ht, Ht.current), q(ge, t), Me === null)) {
        var e = t.alternate;
        e !== null && e.memoizedState !== null && (Me = t);
      }
    } else nl();
  }
  function nl() {
    (q(Ht, Ht.current), q(ge, ge.current));
  }
  function Ge(t) {
    (X(ge), Me === t && (Me = null), X(Ht));
  }
  var Ht = N(0);
  function bn(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var l = e.memoizedState;
        if (
          l !== null &&
          ((l = l.dehydrated), l === null || l.data === '$?' || rf(l))
        )
          return e;
      } else if (e.tag === 19 && e.memoizedProps.revealOrder !== void 0) {
        if ((e.flags & 128) !== 0) return e;
      } else if (e.child !== null) {
        ((e.child.return = e), (e = e.child));
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      ((e.sibling.return = e.return), (e = e.sibling));
    }
    return null;
  }
  function bc(t, e, l, a) {
    ((e = t.memoizedState),
      (l = l(a, e)),
      (l = l == null ? e : R({}, e, l)),
      (t.memoizedState = l),
      t.lanes === 0 && (t.updateQueue.baseState = l));
  }
  var pc = {
    enqueueSetState: function (t, e, l) {
      t = t._reactInternals;
      var a = fe(),
        u = el(a);
      ((u.payload = e),
        l != null && (u.callback = l),
        (e = ll(t, u, a)),
        e !== null && (re(e, t, a), Fa(e, t, a)));
    },
    enqueueReplaceState: function (t, e, l) {
      t = t._reactInternals;
      var a = fe(),
        u = el(a);
      ((u.tag = 1),
        (u.payload = e),
        l != null && (u.callback = l),
        (e = ll(t, u, a)),
        e !== null && (re(e, t, a), Fa(e, t, a)));
    },
    enqueueForceUpdate: function (t, e) {
      t = t._reactInternals;
      var l = fe(),
        a = el(l);
      ((a.tag = 2),
        e != null && (a.callback = e),
        (e = ll(t, a, l)),
        e !== null && (re(e, t, l), Fa(e, t, l)));
    },
  };
  function Qo(t, e, l, a, u, n, c) {
    return (
      (t = t.stateNode),
      typeof t.shouldComponentUpdate == 'function'
        ? t.shouldComponentUpdate(a, n, c)
        : e.prototype && e.prototype.isPureReactComponent
          ? !La(l, a) || !La(u, n)
          : !0
    );
  }
  function Zo(t, e, l, a) {
    ((t = e.state),
      typeof e.componentWillReceiveProps == 'function' &&
        e.componentWillReceiveProps(l, a),
      typeof e.UNSAFE_componentWillReceiveProps == 'function' &&
        e.UNSAFE_componentWillReceiveProps(l, a),
      e.state !== t && pc.enqueueReplaceState(e, e.state, null));
  }
  function Yl(t, e) {
    var l = e;
    if ('ref' in e) {
      l = {};
      for (var a in e) a !== 'ref' && (l[a] = e[a]);
    }
    if ((t = t.defaultProps)) {
      l === e && (l = R({}, l));
      for (var u in t) l[u] === void 0 && (l[u] = t[u]);
    }
    return l;
  }
  var pn =
    typeof reportError == 'function'
      ? reportError
      : function (t) {
          if (
            typeof window == 'object' &&
            typeof window.ErrorEvent == 'function'
          ) {
            var e = new window.ErrorEvent('error', {
              bubbles: !0,
              cancelable: !0,
              message:
                typeof t == 'object' &&
                t !== null &&
                typeof t.message == 'string'
                  ? String(t.message)
                  : String(t),
              error: t,
            });
            if (!window.dispatchEvent(e)) return;
          } else if (
            typeof process == 'object' &&
            typeof process.emit == 'function'
          ) {
            process.emit('uncaughtException', t);
            return;
          }
          console.error(t);
        };
  function Vo(t) {
    pn(t);
  }
  function wo(t) {
    console.error(t);
  }
  function Ko(t) {
    pn(t);
  }
  function En(t, e) {
    try {
      var l = t.onUncaughtError;
      l(e.value, { componentStack: e.stack });
    } catch (a) {
      setTimeout(function () {
        throw a;
      });
    }
  }
  function Jo(t, e, l) {
    try {
      var a = t.onCaughtError;
      a(l.value, {
        componentStack: l.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null,
      });
    } catch (u) {
      setTimeout(function () {
        throw u;
      });
    }
  }
  function Ec(t, e, l) {
    return (
      (l = el(l)),
      (l.tag = 3),
      (l.payload = { element: null }),
      (l.callback = function () {
        En(t, e);
      }),
      l
    );
  }
  function $o(t) {
    return ((t = el(t)), (t.tag = 3), t);
  }
  function ko(t, e, l, a) {
    var u = l.type.getDerivedStateFromError;
    if (typeof u == 'function') {
      var n = a.value;
      ((t.payload = function () {
        return u(n);
      }),
        (t.callback = function () {
          Jo(e, l, a);
        }));
    }
    var c = l.stateNode;
    c !== null &&
      typeof c.componentDidCatch == 'function' &&
      (t.callback = function () {
        (Jo(e, l, a),
          typeof u != 'function' &&
            (sl === null ? (sl = new Set([this])) : sl.add(this)));
        var f = a.stack;
        this.componentDidCatch(a.value, {
          componentStack: f !== null ? f : '',
        });
      });
  }
  function Um(t, e, l, a, u) {
    if (
      ((l.flags |= 32768),
      a !== null && typeof a == 'object' && typeof a.then == 'function')
    ) {
      if (
        ((e = l.alternate),
        e !== null && Ka(e, l, u, !0),
        (l = ge.current),
        l !== null)
      ) {
        switch (l.tag) {
          case 13:
            return (
              Me === null ? wc() : l.alternate === null && Mt === 0 && (Mt = 3),
              (l.flags &= -257),
              (l.flags |= 65536),
              (l.lanes = u),
              a === Wi
                ? (l.flags |= 16384)
                : ((e = l.updateQueue),
                  e === null ? (l.updateQueue = new Set([a])) : e.add(a),
                  Jc(t, a, u)),
              !1
            );
          case 22:
            return (
              (l.flags |= 65536),
              a === Wi
                ? (l.flags |= 16384)
                : ((e = l.updateQueue),
                  e === null
                    ? ((e = {
                        transitions: null,
                        markerInstances: null,
                        retryQueue: new Set([a]),
                      }),
                      (l.updateQueue = e))
                    : ((l = e.retryQueue),
                      l === null ? (e.retryQueue = new Set([a])) : l.add(a)),
                  Jc(t, a, u)),
              !1
            );
        }
        throw Error(r(435, l.tag));
      }
      return (Jc(t, a, u), wc(), !1);
    }
    if (ot)
      return (
        (e = ge.current),
        e !== null
          ? ((e.flags & 65536) === 0 && (e.flags |= 256),
            (e.flags |= 65536),
            (e.lanes = u),
            a !== Zi && ((t = Error(r(422), { cause: a })), wa(he(t, l))))
          : (a !== Zi && ((e = Error(r(423), { cause: a })), wa(he(e, l))),
            (t = t.current.alternate),
            (t.flags |= 65536),
            (u &= -u),
            (t.lanes |= u),
            (a = he(a, l)),
            (u = Ec(t.stateNode, a, u)),
            Ii(t, u),
            Mt !== 4 && (Mt = 2)),
        !1
      );
    var n = Error(r(520), { cause: a });
    if (
      ((n = he(n, l)),
      du === null ? (du = [n]) : du.push(n),
      Mt !== 4 && (Mt = 2),
      e === null)
    )
      return !0;
    ((a = he(a, l)), (l = e));
    do {
      switch (l.tag) {
        case 3:
          return (
            (l.flags |= 65536),
            (t = u & -u),
            (l.lanes |= t),
            (t = Ec(l.stateNode, a, t)),
            Ii(l, t),
            !1
          );
        case 1:
          if (
            ((e = l.type),
            (n = l.stateNode),
            (l.flags & 128) === 0 &&
              (typeof e.getDerivedStateFromError == 'function' ||
                (n !== null &&
                  typeof n.componentDidCatch == 'function' &&
                  (sl === null || !sl.has(n)))))
          )
            return (
              (l.flags |= 65536),
              (u &= -u),
              (l.lanes |= u),
              (u = $o(u)),
              ko(u, t, l, a),
              Ii(l, u),
              !1
            );
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var Wo = Error(r(461)),
    qt = !1;
  function Gt(t, e, l, a) {
    e.child = t === null ? Xo(e, null, l, a) : ha(e, t.child, l, a);
  }
  function Fo(t, e, l, a, u) {
    l = l.render;
    var n = e.ref;
    if ('ref' in a) {
      var c = {};
      for (var f in a) f !== 'ref' && (c[f] = a[f]);
    } else c = a;
    return (
      Cl(e),
      (a = uc(t, e, l, c, n, u)),
      (f = nc()),
      t !== null && !qt
        ? (ic(t, e, u), Xe(t, e, u))
        : (ot && f && Li(e), (e.flags |= 1), Gt(t, e, a, u), e.child)
    );
  }
  function Po(t, e, l, a, u) {
    if (t === null) {
      var n = l.type;
      return typeof n == 'function' &&
        !ji(n) &&
        n.defaultProps === void 0 &&
        l.compare === null
        ? ((e.tag = 15), (e.type = n), Io(t, e, n, a, u))
        : ((t = Iu(l.type, null, a, e, e.mode, u)),
          (t.ref = e.ref),
          (t.return = e),
          (e.child = t));
    }
    if (((n = t.child), !_c(t, u))) {
      var c = n.memoizedProps;
      if (
        ((l = l.compare), (l = l !== null ? l : La), l(c, a) && t.ref === e.ref)
      )
        return Xe(t, e, u);
    }
    return (
      (e.flags |= 1),
      (t = He(n, a)),
      (t.ref = e.ref),
      (t.return = e),
      (e.child = t)
    );
  }
  function Io(t, e, l, a, u) {
    if (t !== null) {
      var n = t.memoizedProps;
      if (La(n, a) && t.ref === e.ref)
        if (((qt = !1), (e.pendingProps = a = n), _c(t, u)))
          (t.flags & 131072) !== 0 && (qt = !0);
        else return ((e.lanes = t.lanes), Xe(t, e, u));
    }
    return Tc(t, e, l, a, u);
  }
  function ts(t, e, l) {
    var a = e.pendingProps,
      u = a.children,
      n = t !== null ? t.memoizedState : null;
    if (a.mode === 'hidden') {
      if ((e.flags & 128) !== 0) {
        if (((a = n !== null ? n.baseLanes | l : l), t !== null)) {
          for (u = e.child = t.child, n = 0; u !== null; )
            ((n = n | u.lanes | u.childLanes), (u = u.sibling));
          e.childLanes = n & ~a;
        } else ((e.childLanes = 0), (e.child = null));
        return es(t, e, a, l);
      }
      if ((l & 536870912) !== 0)
        ((e.memoizedState = { baseLanes: 0, cachePool: null }),
          t !== null && un(e, n !== null ? n.cachePool : null),
          n !== null ? Pr(e, n) : ec(),
          Lo(e));
      else
        return (
          (e.lanes = e.childLanes = 536870912),
          es(t, e, n !== null ? n.baseLanes | l : l, l)
        );
    } else
      n !== null
        ? (un(e, n.cachePool), Pr(e, n), nl(), (e.memoizedState = null))
        : (t !== null && un(e, null), ec(), nl());
    return (Gt(t, e, u, l), e.child);
  }
  function es(t, e, l, a) {
    var u = ki();
    return (
      (u = u === null ? null : { parent: Nt._currentValue, pool: u }),
      (e.memoizedState = { baseLanes: l, cachePool: u }),
      t !== null && un(e, null),
      ec(),
      Lo(e),
      t !== null && Ka(t, e, a, !0),
      null
    );
  }
  function Tn(t, e) {
    var l = e.ref;
    if (l === null) t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof l != 'function' && typeof l != 'object') throw Error(r(284));
      (t === null || t.ref !== l) && (e.flags |= 4194816);
    }
  }
  function Tc(t, e, l, a, u) {
    return (
      Cl(e),
      (l = uc(t, e, l, a, void 0, u)),
      (a = nc()),
      t !== null && !qt
        ? (ic(t, e, u), Xe(t, e, u))
        : (ot && a && Li(e), (e.flags |= 1), Gt(t, e, l, u), e.child)
    );
  }
  function ls(t, e, l, a, u, n) {
    return (
      Cl(e),
      (e.updateQueue = null),
      (l = to(e, a, l, u)),
      Ir(t),
      (a = nc()),
      t !== null && !qt
        ? (ic(t, e, n), Xe(t, e, n))
        : (ot && a && Li(e), (e.flags |= 1), Gt(t, e, l, n), e.child)
    );
  }
  function as(t, e, l, a, u) {
    if ((Cl(e), e.stateNode === null)) {
      var n = aa,
        c = l.contextType;
      (typeof c == 'object' && c !== null && (n = wt(c)),
        (n = new l(a, n)),
        (e.memoizedState =
          n.state !== null && n.state !== void 0 ? n.state : null),
        (n.updater = pc),
        (e.stateNode = n),
        (n._reactInternals = e),
        (n = e.stateNode),
        (n.props = a),
        (n.state = e.memoizedState),
        (n.refs = {}),
        Fi(e),
        (c = l.contextType),
        (n.context = typeof c == 'object' && c !== null ? wt(c) : aa),
        (n.state = e.memoizedState),
        (c = l.getDerivedStateFromProps),
        typeof c == 'function' && (bc(e, l, c, a), (n.state = e.memoizedState)),
        typeof l.getDerivedStateFromProps == 'function' ||
          typeof n.getSnapshotBeforeUpdate == 'function' ||
          (typeof n.UNSAFE_componentWillMount != 'function' &&
            typeof n.componentWillMount != 'function') ||
          ((c = n.state),
          typeof n.componentWillMount == 'function' && n.componentWillMount(),
          typeof n.UNSAFE_componentWillMount == 'function' &&
            n.UNSAFE_componentWillMount(),
          c !== n.state && pc.enqueueReplaceState(n, n.state, null),
          Ia(e, a, n, u),
          Pa(),
          (n.state = e.memoizedState)),
        typeof n.componentDidMount == 'function' && (e.flags |= 4194308),
        (a = !0));
    } else if (t === null) {
      n = e.stateNode;
      var f = e.memoizedProps,
        d = Yl(l, f);
      n.props = d;
      var T = n.context,
        z = l.contextType;
      ((c = aa), typeof z == 'object' && z !== null && (c = wt(z)));
      var U = l.getDerivedStateFromProps;
      ((z =
        typeof U == 'function' ||
        typeof n.getSnapshotBeforeUpdate == 'function'),
        (f = e.pendingProps !== f),
        z ||
          (typeof n.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof n.componentWillReceiveProps != 'function') ||
          ((f || T !== c) && Zo(e, n, a, c)),
        (tl = !1));
      var A = e.memoizedState;
      ((n.state = A),
        Ia(e, a, n, u),
        Pa(),
        (T = e.memoizedState),
        f || A !== T || tl
          ? (typeof U == 'function' && (bc(e, l, U, a), (T = e.memoizedState)),
            (d = tl || Qo(e, l, d, a, A, T, c))
              ? (z ||
                  (typeof n.UNSAFE_componentWillMount != 'function' &&
                    typeof n.componentWillMount != 'function') ||
                  (typeof n.componentWillMount == 'function' &&
                    n.componentWillMount(),
                  typeof n.UNSAFE_componentWillMount == 'function' &&
                    n.UNSAFE_componentWillMount()),
                typeof n.componentDidMount == 'function' &&
                  (e.flags |= 4194308))
              : (typeof n.componentDidMount == 'function' &&
                  (e.flags |= 4194308),
                (e.memoizedProps = a),
                (e.memoizedState = T)),
            (n.props = a),
            (n.state = T),
            (n.context = c),
            (a = d))
          : (typeof n.componentDidMount == 'function' && (e.flags |= 4194308),
            (a = !1)));
    } else {
      ((n = e.stateNode),
        Pi(t, e),
        (c = e.memoizedProps),
        (z = Yl(l, c)),
        (n.props = z),
        (U = e.pendingProps),
        (A = n.context),
        (T = l.contextType),
        (d = aa),
        typeof T == 'object' && T !== null && (d = wt(T)),
        (f = l.getDerivedStateFromProps),
        (T =
          typeof f == 'function' ||
          typeof n.getSnapshotBeforeUpdate == 'function') ||
          (typeof n.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof n.componentWillReceiveProps != 'function') ||
          ((c !== U || A !== d) && Zo(e, n, a, d)),
        (tl = !1),
        (A = e.memoizedState),
        (n.state = A),
        Ia(e, a, n, u),
        Pa());
      var M = e.memoizedState;
      c !== U ||
      A !== M ||
      tl ||
      (t !== null && t.dependencies !== null && ln(t.dependencies))
        ? (typeof f == 'function' && (bc(e, l, f, a), (M = e.memoizedState)),
          (z =
            tl ||
            Qo(e, l, z, a, A, M, d) ||
            (t !== null && t.dependencies !== null && ln(t.dependencies)))
            ? (T ||
                (typeof n.UNSAFE_componentWillUpdate != 'function' &&
                  typeof n.componentWillUpdate != 'function') ||
                (typeof n.componentWillUpdate == 'function' &&
                  n.componentWillUpdate(a, M, d),
                typeof n.UNSAFE_componentWillUpdate == 'function' &&
                  n.UNSAFE_componentWillUpdate(a, M, d)),
              typeof n.componentDidUpdate == 'function' && (e.flags |= 4),
              typeof n.getSnapshotBeforeUpdate == 'function' &&
                (e.flags |= 1024))
            : (typeof n.componentDidUpdate != 'function' ||
                (c === t.memoizedProps && A === t.memoizedState) ||
                (e.flags |= 4),
              typeof n.getSnapshotBeforeUpdate != 'function' ||
                (c === t.memoizedProps && A === t.memoizedState) ||
                (e.flags |= 1024),
              (e.memoizedProps = a),
              (e.memoizedState = M)),
          (n.props = a),
          (n.state = M),
          (n.context = d),
          (a = z))
        : (typeof n.componentDidUpdate != 'function' ||
            (c === t.memoizedProps && A === t.memoizedState) ||
            (e.flags |= 4),
          typeof n.getSnapshotBeforeUpdate != 'function' ||
            (c === t.memoizedProps && A === t.memoizedState) ||
            (e.flags |= 1024),
          (a = !1));
    }
    return (
      (n = a),
      Tn(t, e),
      (a = (e.flags & 128) !== 0),
      n || a
        ? ((n = e.stateNode),
          (l =
            a && typeof l.getDerivedStateFromError != 'function'
              ? null
              : n.render()),
          (e.flags |= 1),
          t !== null && a
            ? ((e.child = ha(e, t.child, null, u)),
              (e.child = ha(e, null, l, u)))
            : Gt(t, e, l, u),
          (e.memoizedState = n.state),
          (t = e.child))
        : (t = Xe(t, e, u)),
      t
    );
  }
  function us(t, e, l, a) {
    return (Va(), (e.flags |= 256), Gt(t, e, l, a), e.child);
  }
  var Rc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null,
  };
  function Ac(t) {
    return { baseLanes: t, cachePool: Vr() };
  }
  function Mc(t, e, l) {
    return ((t = t !== null ? t.childLanes & ~l : 0), e && (t |= Se), t);
  }
  function ns(t, e, l) {
    var a = e.pendingProps,
      u = !1,
      n = (e.flags & 128) !== 0,
      c;
    if (
      ((c = n) ||
        (c =
          t !== null && t.memoizedState === null ? !1 : (Ht.current & 2) !== 0),
      c && ((u = !0), (e.flags &= -129)),
      (c = (e.flags & 32) !== 0),
      (e.flags &= -33),
      t === null)
    ) {
      if (ot) {
        if ((u ? ul(e) : nl(), ot)) {
          var f = At,
            d;
          if ((d = f)) {
            t: {
              for (d = f, f = Ae; d.nodeType !== 8; ) {
                if (!f) {
                  f = null;
                  break t;
                }
                if (((d = Te(d.nextSibling)), d === null)) {
                  f = null;
                  break t;
                }
              }
              f = d;
            }
            f !== null
              ? ((e.memoizedState = {
                  dehydrated: f,
                  treeContext: _l !== null ? { id: Ce, overflow: Be } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (d = ue(18, null, null, 0)),
                (d.stateNode = f),
                (d.return = e),
                (e.child = d),
                (Jt = e),
                (At = null),
                (d = !0))
              : (d = !1);
          }
          d || Nl(e);
        }
        if (
          ((f = e.memoizedState),
          f !== null && ((f = f.dehydrated), f !== null))
        )
          return (rf(f) ? (e.lanes = 32) : (e.lanes = 536870912), null);
        Ge(e);
      }
      return (
        (f = a.children),
        (a = a.fallback),
        u
          ? (nl(),
            (u = e.mode),
            (f = Rn({ mode: 'hidden', children: f }, u)),
            (a = Dl(a, u, l, null)),
            (f.return = e),
            (a.return = e),
            (f.sibling = a),
            (e.child = f),
            (u = e.child),
            (u.memoizedState = Ac(l)),
            (u.childLanes = Mc(t, c, l)),
            (e.memoizedState = Rc),
            a)
          : (ul(e), Oc(e, f))
      );
    }
    if (
      ((d = t.memoizedState), d !== null && ((f = d.dehydrated), f !== null))
    ) {
      if (n)
        e.flags & 256
          ? (ul(e), (e.flags &= -257), (e = zc(t, e, l)))
          : e.memoizedState !== null
            ? (nl(), (e.child = t.child), (e.flags |= 128), (e = null))
            : (nl(),
              (u = a.fallback),
              (f = e.mode),
              (a = Rn({ mode: 'visible', children: a.children }, f)),
              (u = Dl(u, f, l, null)),
              (u.flags |= 2),
              (a.return = e),
              (u.return = e),
              (a.sibling = u),
              (e.child = a),
              ha(e, t.child, null, l),
              (a = e.child),
              (a.memoizedState = Ac(l)),
              (a.childLanes = Mc(t, c, l)),
              (e.memoizedState = Rc),
              (e = u));
      else if ((ul(e), rf(f))) {
        if (((c = f.nextSibling && f.nextSibling.dataset), c)) var T = c.dgst;
        ((c = T),
          (a = Error(r(419))),
          (a.stack = ''),
          (a.digest = c),
          wa({ value: a, source: null, stack: null }),
          (e = zc(t, e, l)));
      } else if (
        (qt || Ka(t, e, l, !1), (c = (l & t.childLanes) !== 0), qt || c)
      ) {
        if (
          ((c = St),
          c !== null &&
            ((a = l & -l),
            (a = (a & 42) !== 0 ? 1 : ri(a)),
            (a = (a & (c.suspendedLanes | l)) !== 0 ? 0 : a),
            a !== 0 && a !== d.retryLane))
        )
          throw ((d.retryLane = a), la(t, a), re(c, t, a), Wo);
        (f.data === '$?' || wc(), (e = zc(t, e, l)));
      } else
        f.data === '$?'
          ? ((e.flags |= 192), (e.child = t.child), (e = null))
          : ((t = d.treeContext),
            (At = Te(f.nextSibling)),
            (Jt = e),
            (ot = !0),
            (Ul = null),
            (Ae = !1),
            t !== null &&
              ((ve[ye++] = Ce),
              (ve[ye++] = Be),
              (ve[ye++] = _l),
              (Ce = t.id),
              (Be = t.overflow),
              (_l = e)),
            (e = Oc(e, a.children)),
            (e.flags |= 4096));
      return e;
    }
    return u
      ? (nl(),
        (u = a.fallback),
        (f = e.mode),
        (d = t.child),
        (T = d.sibling),
        (a = He(d, { mode: 'hidden', children: a.children })),
        (a.subtreeFlags = d.subtreeFlags & 65011712),
        T !== null ? (u = He(T, u)) : ((u = Dl(u, f, l, null)), (u.flags |= 2)),
        (u.return = e),
        (a.return = e),
        (a.sibling = u),
        (e.child = a),
        (a = u),
        (u = e.child),
        (f = t.child.memoizedState),
        f === null
          ? (f = Ac(l))
          : ((d = f.cachePool),
            d !== null
              ? ((T = Nt._currentValue),
                (d = d.parent !== T ? { parent: T, pool: T } : d))
              : (d = Vr()),
            (f = { baseLanes: f.baseLanes | l, cachePool: d })),
        (u.memoizedState = f),
        (u.childLanes = Mc(t, c, l)),
        (e.memoizedState = Rc),
        a)
      : (ul(e),
        (l = t.child),
        (t = l.sibling),
        (l = He(l, { mode: 'visible', children: a.children })),
        (l.return = e),
        (l.sibling = null),
        t !== null &&
          ((c = e.deletions),
          c === null ? ((e.deletions = [t]), (e.flags |= 16)) : c.push(t)),
        (e.child = l),
        (e.memoizedState = null),
        l);
  }
  function Oc(t, e) {
    return (
      (e = Rn({ mode: 'visible', children: e }, t.mode)),
      (e.return = t),
      (t.child = e)
    );
  }
  function Rn(t, e) {
    return (
      (t = ue(22, t, null, e)),
      (t.lanes = 0),
      (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null,
      }),
      t
    );
  }
  function zc(t, e, l) {
    return (
      ha(e, t.child, null, l),
      (t = Oc(e, e.pendingProps.children)),
      (t.flags |= 2),
      (e.memoizedState = null),
      t
    );
  }
  function is(t, e, l) {
    t.lanes |= e;
    var a = t.alternate;
    (a !== null && (a.lanes |= e), wi(t.return, e, l));
  }
  function Dc(t, e, l, a, u) {
    var n = t.memoizedState;
    n === null
      ? (t.memoizedState = {
          isBackwards: e,
          rendering: null,
          renderingStartTime: 0,
          last: a,
          tail: l,
          tailMode: u,
        })
      : ((n.isBackwards = e),
        (n.rendering = null),
        (n.renderingStartTime = 0),
        (n.last = a),
        (n.tail = l),
        (n.tailMode = u));
  }
  function cs(t, e, l) {
    var a = e.pendingProps,
      u = a.revealOrder,
      n = a.tail;
    if ((Gt(t, e, a.children, l), (a = Ht.current), (a & 2) !== 0))
      ((a = (a & 1) | 2), (e.flags |= 128));
    else {
      if (t !== null && (t.flags & 128) !== 0)
        t: for (t = e.child; t !== null; ) {
          if (t.tag === 13) t.memoizedState !== null && is(t, l, e);
          else if (t.tag === 19) is(t, l, e);
          else if (t.child !== null) {
            ((t.child.return = t), (t = t.child));
            continue;
          }
          if (t === e) break t;
          for (; t.sibling === null; ) {
            if (t.return === null || t.return === e) break t;
            t = t.return;
          }
          ((t.sibling.return = t.return), (t = t.sibling));
        }
      a &= 1;
    }
    switch ((q(Ht, a), u)) {
      case 'forwards':
        for (l = e.child, u = null; l !== null; )
          ((t = l.alternate),
            t !== null && bn(t) === null && (u = l),
            (l = l.sibling));
        ((l = u),
          l === null
            ? ((u = e.child), (e.child = null))
            : ((u = l.sibling), (l.sibling = null)),
          Dc(e, !1, u, l, n));
        break;
      case 'backwards':
        for (l = null, u = e.child, e.child = null; u !== null; ) {
          if (((t = u.alternate), t !== null && bn(t) === null)) {
            e.child = u;
            break;
          }
          ((t = u.sibling), (u.sibling = l), (l = u), (u = t));
        }
        Dc(e, !0, l, null, n);
        break;
      case 'together':
        Dc(e, !1, null, null, void 0);
        break;
      default:
        e.memoizedState = null;
    }
    return e.child;
  }
  function Xe(t, e, l) {
    if (
      (t !== null && (e.dependencies = t.dependencies),
      (ol |= e.lanes),
      (l & e.childLanes) === 0)
    )
      if (t !== null) {
        if ((Ka(t, e, l, !1), (l & e.childLanes) === 0)) return null;
      } else return null;
    if (t !== null && e.child !== t.child) throw Error(r(153));
    if (e.child !== null) {
      for (
        t = e.child, l = He(t, t.pendingProps), e.child = l, l.return = e;
        t.sibling !== null;

      )
        ((t = t.sibling),
          (l = l.sibling = He(t, t.pendingProps)),
          (l.return = e));
      l.sibling = null;
    }
    return e.child;
  }
  function _c(t, e) {
    return (t.lanes & e) !== 0
      ? !0
      : ((t = t.dependencies), !!(t !== null && ln(t)));
  }
  function Nm(t, e, l) {
    switch (e.tag) {
      case 3:
        (bt(e, e.stateNode.containerInfo),
          Ie(e, Nt, t.memoizedState.cache),
          Va());
        break;
      case 27:
      case 5:
        ui(e);
        break;
      case 4:
        bt(e, e.stateNode.containerInfo);
        break;
      case 10:
        Ie(e, e.type, e.memoizedProps.value);
        break;
      case 13:
        var a = e.memoizedState;
        if (a !== null)
          return a.dehydrated !== null
            ? (ul(e), (e.flags |= 128), null)
            : (l & e.child.childLanes) !== 0
              ? ns(t, e, l)
              : (ul(e), (t = Xe(t, e, l)), t !== null ? t.sibling : null);
        ul(e);
        break;
      case 19:
        var u = (t.flags & 128) !== 0;
        if (
          ((a = (l & e.childLanes) !== 0),
          a || (Ka(t, e, l, !1), (a = (l & e.childLanes) !== 0)),
          u)
        ) {
          if (a) return cs(t, e, l);
          e.flags |= 128;
        }
        if (
          ((u = e.memoizedState),
          u !== null &&
            ((u.rendering = null), (u.tail = null), (u.lastEffect = null)),
          q(Ht, Ht.current),
          a)
        )
          break;
        return null;
      case 22:
      case 23:
        return ((e.lanes = 0), ts(t, e, l));
      case 24:
        Ie(e, Nt, t.memoizedState.cache);
    }
    return Xe(t, e, l);
  }
  function fs(t, e, l) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps) qt = !0;
      else {
        if (!_c(t, l) && (e.flags & 128) === 0) return ((qt = !1), Nm(t, e, l));
        qt = (t.flags & 131072) !== 0;
      }
    else ((qt = !1), ot && (e.flags & 1048576) !== 0 && Yr(e, en, e.index));
    switch (((e.lanes = 0), e.tag)) {
      case 16:
        t: {
          t = e.pendingProps;
          var a = e.elementType,
            u = a._init;
          if (((a = u(a._payload)), (e.type = a), typeof a == 'function'))
            ji(a)
              ? ((t = Yl(a, t)), (e.tag = 1), (e = as(null, e, a, t, l)))
              : ((e.tag = 0), (e = Tc(null, e, a, t, l)));
          else {
            if (a != null) {
              if (((u = a.$$typeof), u === ct)) {
                ((e.tag = 11), (e = Fo(null, e, a, t, l)));
                break t;
              } else if (u === Ot) {
                ((e.tag = 14), (e = Po(null, e, a, t, l)));
                break t;
              }
            }
            throw ((e = Tl(a) || a), Error(r(306, e, '')));
          }
        }
        return e;
      case 0:
        return Tc(t, e, e.type, e.pendingProps, l);
      case 1:
        return ((a = e.type), (u = Yl(a, e.pendingProps)), as(t, e, a, u, l));
      case 3:
        t: {
          if ((bt(e, e.stateNode.containerInfo), t === null))
            throw Error(r(387));
          a = e.pendingProps;
          var n = e.memoizedState;
          ((u = n.element), Pi(t, e), Ia(e, a, null, l));
          var c = e.memoizedState;
          if (
            ((a = c.cache),
            Ie(e, Nt, a),
            a !== n.cache && Ki(e, [Nt], l, !0),
            Pa(),
            (a = c.element),
            n.isDehydrated)
          )
            if (
              ((n = { element: a, isDehydrated: !1, cache: c.cache }),
              (e.updateQueue.baseState = n),
              (e.memoizedState = n),
              e.flags & 256)
            ) {
              e = us(t, e, a, l);
              break t;
            } else if (a !== u) {
              ((u = he(Error(r(424)), e)), wa(u), (e = us(t, e, a, l)));
              break t;
            } else {
              switch (((t = e.stateNode.containerInfo), t.nodeType)) {
                case 9:
                  t = t.body;
                  break;
                default:
                  t = t.nodeName === 'HTML' ? t.ownerDocument.body : t;
              }
              for (
                At = Te(t.firstChild),
                  Jt = e,
                  ot = !0,
                  Ul = null,
                  Ae = !0,
                  l = Xo(e, null, a, l),
                  e.child = l;
                l;

              )
                ((l.flags = (l.flags & -3) | 4096), (l = l.sibling));
            }
          else {
            if ((Va(), a === u)) {
              e = Xe(t, e, l);
              break t;
            }
            Gt(t, e, a, l);
          }
          e = e.child;
        }
        return e;
      case 26:
        return (
          Tn(t, e),
          t === null
            ? (l = dd(e.type, null, e.pendingProps, null))
              ? (e.memoizedState = l)
              : ot ||
                ((l = e.type),
                (t = e.pendingProps),
                (a = Yn(I.current).createElement(l)),
                (a[Vt] = e),
                (a[$t] = t),
                Lt(a, l, t),
                Bt(a),
                (e.stateNode = a))
            : (e.memoizedState = dd(
                e.type,
                t.memoizedProps,
                e.pendingProps,
                t.memoizedState
              )),
          null
        );
      case 27:
        return (
          ui(e),
          t === null &&
            ot &&
            ((a = e.stateNode = rd(e.type, e.pendingProps, I.current)),
            (Jt = e),
            (Ae = !0),
            (u = At),
            ml(e.type) ? ((of = u), (At = Te(a.firstChild))) : (At = u)),
          Gt(t, e, e.pendingProps.children, l),
          Tn(t, e),
          t === null && (e.flags |= 4194304),
          e.child
        );
      case 5:
        return (
          t === null &&
            ot &&
            ((u = a = At) &&
              ((a = i0(a, e.type, e.pendingProps, Ae)),
              a !== null
                ? ((e.stateNode = a),
                  (Jt = e),
                  (At = Te(a.firstChild)),
                  (Ae = !1),
                  (u = !0))
                : (u = !1)),
            u || Nl(e)),
          ui(e),
          (u = e.type),
          (n = e.pendingProps),
          (c = t !== null ? t.memoizedProps : null),
          (a = n.children),
          nf(u, n) ? (a = null) : c !== null && nf(u, c) && (e.flags |= 32),
          e.memoizedState !== null &&
            ((u = uc(t, e, Am, null, null, l)), (Eu._currentValue = u)),
          Tn(t, e),
          Gt(t, e, a, l),
          e.child
        );
      case 6:
        return (
          t === null &&
            ot &&
            ((t = l = At) &&
              ((l = c0(l, e.pendingProps, Ae)),
              l !== null
                ? ((e.stateNode = l), (Jt = e), (At = null), (t = !0))
                : (t = !1)),
            t || Nl(e)),
          null
        );
      case 13:
        return ns(t, e, l);
      case 4:
        return (
          bt(e, e.stateNode.containerInfo),
          (a = e.pendingProps),
          t === null ? (e.child = ha(e, null, a, l)) : Gt(t, e, a, l),
          e.child
        );
      case 11:
        return Fo(t, e, e.type, e.pendingProps, l);
      case 7:
        return (Gt(t, e, e.pendingProps, l), e.child);
      case 8:
        return (Gt(t, e, e.pendingProps.children, l), e.child);
      case 12:
        return (Gt(t, e, e.pendingProps.children, l), e.child);
      case 10:
        return (
          (a = e.pendingProps),
          Ie(e, e.type, a.value),
          Gt(t, e, a.children, l),
          e.child
        );
      case 9:
        return (
          (u = e.type._context),
          (a = e.pendingProps.children),
          Cl(e),
          (u = wt(u)),
          (a = a(u)),
          (e.flags |= 1),
          Gt(t, e, a, l),
          e.child
        );
      case 14:
        return Po(t, e, e.type, e.pendingProps, l);
      case 15:
        return Io(t, e, e.type, e.pendingProps, l);
      case 19:
        return cs(t, e, l);
      case 31:
        return (
          (a = e.pendingProps),
          (l = e.mode),
          (a = { mode: a.mode, children: a.children }),
          t === null
            ? ((l = Rn(a, l)),
              (l.ref = e.ref),
              (e.child = l),
              (l.return = e),
              (e = l))
            : ((l = He(t.child, a)),
              (l.ref = e.ref),
              (e.child = l),
              (l.return = e),
              (e = l)),
          e
        );
      case 22:
        return ts(t, e, l);
      case 24:
        return (
          Cl(e),
          (a = wt(Nt)),
          t === null
            ? ((u = ki()),
              u === null &&
                ((u = St),
                (n = Ji()),
                (u.pooledCache = n),
                n.refCount++,
                n !== null && (u.pooledCacheLanes |= l),
                (u = n)),
              (e.memoizedState = { parent: a, cache: u }),
              Fi(e),
              Ie(e, Nt, u))
            : ((t.lanes & l) !== 0 && (Pi(t, e), Ia(e, null, null, l), Pa()),
              (u = t.memoizedState),
              (n = e.memoizedState),
              u.parent !== a
                ? ((u = { parent: a, cache: a }),
                  (e.memoizedState = u),
                  e.lanes === 0 &&
                    (e.memoizedState = e.updateQueue.baseState = u),
                  Ie(e, Nt, a))
                : ((a = n.cache),
                  Ie(e, Nt, a),
                  a !== u.cache && Ki(e, [Nt], l, !0))),
          Gt(t, e, e.pendingProps.children, l),
          e.child
        );
      case 29:
        throw e.pendingProps;
    }
    throw Error(r(156, e.tag));
  }
  function Le(t) {
    t.flags |= 4;
  }
  function rs(t, e) {
    if (e.type !== 'stylesheet' || (e.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (((t.flags |= 16777216), !gd(e))) {
      if (
        ((e = ge.current),
        e !== null &&
          ((it & 4194048) === it
            ? Me !== null
            : ((it & 62914560) !== it && (it & 536870912) === 0) || e !== Me))
      )
        throw ((Wa = Wi), wr);
      t.flags |= 8192;
    }
  }
  function An(t, e) {
    (e !== null && (t.flags |= 4),
      t.flags & 16384 &&
        ((e = t.tag !== 22 ? Xf() : 536870912), (t.lanes |= e), (ga |= e)));
  }
  function iu(t, e) {
    if (!ot)
      switch (t.tailMode) {
        case 'hidden':
          e = t.tail;
          for (var l = null; e !== null; )
            (e.alternate !== null && (l = e), (e = e.sibling));
          l === null ? (t.tail = null) : (l.sibling = null);
          break;
        case 'collapsed':
          l = t.tail;
          for (var a = null; l !== null; )
            (l.alternate !== null && (a = l), (l = l.sibling));
          a === null
            ? e || t.tail === null
              ? (t.tail = null)
              : (t.tail.sibling = null)
            : (a.sibling = null);
      }
  }
  function Et(t) {
    var e = t.alternate !== null && t.alternate.child === t.child,
      l = 0,
      a = 0;
    if (e)
      for (var u = t.child; u !== null; )
        ((l |= u.lanes | u.childLanes),
          (a |= u.subtreeFlags & 65011712),
          (a |= u.flags & 65011712),
          (u.return = t),
          (u = u.sibling));
    else
      for (u = t.child; u !== null; )
        ((l |= u.lanes | u.childLanes),
          (a |= u.subtreeFlags),
          (a |= u.flags),
          (u.return = t),
          (u = u.sibling));
    return ((t.subtreeFlags |= a), (t.childLanes = l), e);
  }
  function Hm(t, e, l) {
    var a = e.pendingProps;
    switch ((Qi(e), e.tag)) {
      case 31:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (Et(e), null);
      case 1:
        return (Et(e), null);
      case 3:
        return (
          (l = e.stateNode),
          (a = null),
          t !== null && (a = t.memoizedState.cache),
          e.memoizedState.cache !== a && (e.flags |= 2048),
          Ye(Nt),
          ke(),
          l.pendingContext &&
            ((l.context = l.pendingContext), (l.pendingContext = null)),
          (t === null || t.child === null) &&
            (Za(e)
              ? Le(e)
              : t === null ||
                (t.memoizedState.isDehydrated && (e.flags & 256) === 0) ||
                ((e.flags |= 1024), Xr())),
          Et(e),
          null
        );
      case 26:
        return (
          (l = e.memoizedState),
          t === null
            ? (Le(e),
              l !== null ? (Et(e), rs(e, l)) : (Et(e), (e.flags &= -16777217)))
            : l
              ? l !== t.memoizedState
                ? (Le(e), Et(e), rs(e, l))
                : (Et(e), (e.flags &= -16777217))
              : (t.memoizedProps !== a && Le(e), Et(e), (e.flags &= -16777217)),
          null
        );
      case 27:
        (Cu(e), (l = I.current));
        var u = e.type;
        if (t !== null && e.stateNode != null) t.memoizedProps !== a && Le(e);
        else {
          if (!a) {
            if (e.stateNode === null) throw Error(r(166));
            return (Et(e), null);
          }
          ((t = J.current),
            Za(e) ? jr(e) : ((t = rd(u, a, l)), (e.stateNode = t), Le(e)));
        }
        return (Et(e), null);
      case 5:
        if ((Cu(e), (l = e.type), t !== null && e.stateNode != null))
          t.memoizedProps !== a && Le(e);
        else {
          if (!a) {
            if (e.stateNode === null) throw Error(r(166));
            return (Et(e), null);
          }
          if (((t = J.current), Za(e))) jr(e);
          else {
            switch (((u = Yn(I.current)), t)) {
              case 1:
                t = u.createElementNS('http://www.w3.org/2000/svg', l);
                break;
              case 2:
                t = u.createElementNS('http://www.w3.org/1998/Math/MathML', l);
                break;
              default:
                switch (l) {
                  case 'svg':
                    t = u.createElementNS('http://www.w3.org/2000/svg', l);
                    break;
                  case 'math':
                    t = u.createElementNS(
                      'http://www.w3.org/1998/Math/MathML',
                      l
                    );
                    break;
                  case 'script':
                    ((t = u.createElement('div')),
                      (t.innerHTML = '<script><\/script>'),
                      (t = t.removeChild(t.firstChild)));
                    break;
                  case 'select':
                    ((t =
                      typeof a.is == 'string'
                        ? u.createElement('select', { is: a.is })
                        : u.createElement('select')),
                      a.multiple
                        ? (t.multiple = !0)
                        : a.size && (t.size = a.size));
                    break;
                  default:
                    t =
                      typeof a.is == 'string'
                        ? u.createElement(l, { is: a.is })
                        : u.createElement(l);
                }
            }
            ((t[Vt] = e), (t[$t] = a));
            t: for (u = e.child; u !== null; ) {
              if (u.tag === 5 || u.tag === 6) t.appendChild(u.stateNode);
              else if (u.tag !== 4 && u.tag !== 27 && u.child !== null) {
                ((u.child.return = u), (u = u.child));
                continue;
              }
              if (u === e) break t;
              for (; u.sibling === null; ) {
                if (u.return === null || u.return === e) break t;
                u = u.return;
              }
              ((u.sibling.return = u.return), (u = u.sibling));
            }
            e.stateNode = t;
            t: switch ((Lt(t, l, a), l)) {
              case 'button':
              case 'input':
              case 'select':
              case 'textarea':
                t = !!a.autoFocus;
                break t;
              case 'img':
                t = !0;
                break t;
              default:
                t = !1;
            }
            t && Le(e);
          }
        }
        return (Et(e), (e.flags &= -16777217), null);
      case 6:
        if (t && e.stateNode != null) t.memoizedProps !== a && Le(e);
        else {
          if (typeof a != 'string' && e.stateNode === null) throw Error(r(166));
          if (((t = I.current), Za(e))) {
            if (
              ((t = e.stateNode),
              (l = e.memoizedProps),
              (a = null),
              (u = Jt),
              u !== null)
            )
              switch (u.tag) {
                case 27:
                case 5:
                  a = u.memoizedProps;
              }
            ((t[Vt] = e),
              (t = !!(
                t.nodeValue === l ||
                (a !== null && a.suppressHydrationWarning === !0) ||
                ld(t.nodeValue, l)
              )),
              t || Nl(e));
          } else
            ((t = Yn(t).createTextNode(a)), (t[Vt] = e), (e.stateNode = t));
        }
        return (Et(e), null);
      case 13:
        if (
          ((a = e.memoizedState),
          t === null ||
            (t.memoizedState !== null && t.memoizedState.dehydrated !== null))
        ) {
          if (((u = Za(e)), a !== null && a.dehydrated !== null)) {
            if (t === null) {
              if (!u) throw Error(r(318));
              if (
                ((u = e.memoizedState),
                (u = u !== null ? u.dehydrated : null),
                !u)
              )
                throw Error(r(317));
              u[Vt] = e;
            } else
              (Va(),
                (e.flags & 128) === 0 && (e.memoizedState = null),
                (e.flags |= 4));
            (Et(e), (u = !1));
          } else
            ((u = Xr()),
              t !== null &&
                t.memoizedState !== null &&
                (t.memoizedState.hydrationErrors = u),
              (u = !0));
          if (!u) return e.flags & 256 ? (Ge(e), e) : (Ge(e), null);
        }
        if ((Ge(e), (e.flags & 128) !== 0)) return ((e.lanes = l), e);
        if (
          ((l = a !== null), (t = t !== null && t.memoizedState !== null), l)
        ) {
          ((a = e.child),
            (u = null),
            a.alternate !== null &&
              a.alternate.memoizedState !== null &&
              a.alternate.memoizedState.cachePool !== null &&
              (u = a.alternate.memoizedState.cachePool.pool));
          var n = null;
          (a.memoizedState !== null &&
            a.memoizedState.cachePool !== null &&
            (n = a.memoizedState.cachePool.pool),
            n !== u && (a.flags |= 2048));
        }
        return (
          l !== t && l && (e.child.flags |= 8192),
          An(e, e.updateQueue),
          Et(e),
          null
        );
      case 4:
        return (ke(), t === null && tf(e.stateNode.containerInfo), Et(e), null);
      case 10:
        return (Ye(e.type), Et(e), null);
      case 19:
        if ((X(Ht), (u = e.memoizedState), u === null)) return (Et(e), null);
        if (((a = (e.flags & 128) !== 0), (n = u.rendering), n === null))
          if (a) iu(u, !1);
          else {
            if (Mt !== 0 || (t !== null && (t.flags & 128) !== 0))
              for (t = e.child; t !== null; ) {
                if (((n = bn(t)), n !== null)) {
                  for (
                    e.flags |= 128,
                      iu(u, !1),
                      t = n.updateQueue,
                      e.updateQueue = t,
                      An(e, t),
                      e.subtreeFlags = 0,
                      t = l,
                      l = e.child;
                    l !== null;

                  )
                    (qr(l, t), (l = l.sibling));
                  return (q(Ht, (Ht.current & 1) | 2), e.child);
                }
                t = t.sibling;
              }
            u.tail !== null &&
              Re() > zn &&
              ((e.flags |= 128), (a = !0), iu(u, !1), (e.lanes = 4194304));
          }
        else {
          if (!a)
            if (((t = bn(n)), t !== null)) {
              if (
                ((e.flags |= 128),
                (a = !0),
                (t = t.updateQueue),
                (e.updateQueue = t),
                An(e, t),
                iu(u, !0),
                u.tail === null &&
                  u.tailMode === 'hidden' &&
                  !n.alternate &&
                  !ot)
              )
                return (Et(e), null);
            } else
              2 * Re() - u.renderingStartTime > zn &&
                l !== 536870912 &&
                ((e.flags |= 128), (a = !0), iu(u, !1), (e.lanes = 4194304));
          u.isBackwards
            ? ((n.sibling = e.child), (e.child = n))
            : ((t = u.last),
              t !== null ? (t.sibling = n) : (e.child = n),
              (u.last = n));
        }
        return u.tail !== null
          ? ((e = u.tail),
            (u.rendering = e),
            (u.tail = e.sibling),
            (u.renderingStartTime = Re()),
            (e.sibling = null),
            (t = Ht.current),
            q(Ht, a ? (t & 1) | 2 : t & 1),
            e)
          : (Et(e), null);
      case 22:
      case 23:
        return (
          Ge(e),
          lc(),
          (a = e.memoizedState !== null),
          t !== null
            ? (t.memoizedState !== null) !== a && (e.flags |= 8192)
            : a && (e.flags |= 8192),
          a
            ? (l & 536870912) !== 0 &&
              (e.flags & 128) === 0 &&
              (Et(e), e.subtreeFlags & 6 && (e.flags |= 8192))
            : Et(e),
          (l = e.updateQueue),
          l !== null && An(e, l.retryQueue),
          (l = null),
          t !== null &&
            t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (l = t.memoizedState.cachePool.pool),
          (a = null),
          e.memoizedState !== null &&
            e.memoizedState.cachePool !== null &&
            (a = e.memoizedState.cachePool.pool),
          a !== l && (e.flags |= 2048),
          t !== null && X(Bl),
          null
        );
      case 24:
        return (
          (l = null),
          t !== null && (l = t.memoizedState.cache),
          e.memoizedState.cache !== l && (e.flags |= 2048),
          Ye(Nt),
          Et(e),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(r(156, e.tag));
  }
  function Cm(t, e) {
    switch ((Qi(e), e.tag)) {
      case 1:
        return (
          (t = e.flags),
          t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 3:
        return (
          Ye(Nt),
          ke(),
          (t = e.flags),
          (t & 65536) !== 0 && (t & 128) === 0
            ? ((e.flags = (t & -65537) | 128), e)
            : null
        );
      case 26:
      case 27:
      case 5:
        return (Cu(e), null);
      case 13:
        if (
          (Ge(e), (t = e.memoizedState), t !== null && t.dehydrated !== null)
        ) {
          if (e.alternate === null) throw Error(r(340));
          Va();
        }
        return (
          (t = e.flags),
          t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 19:
        return (X(Ht), null);
      case 4:
        return (ke(), null);
      case 10:
        return (Ye(e.type), null);
      case 22:
      case 23:
        return (
          Ge(e),
          lc(),
          t !== null && X(Bl),
          (t = e.flags),
          t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 24:
        return (Ye(Nt), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function os(t, e) {
    switch ((Qi(e), e.tag)) {
      case 3:
        (Ye(Nt), ke());
        break;
      case 26:
      case 27:
      case 5:
        Cu(e);
        break;
      case 4:
        ke();
        break;
      case 13:
        Ge(e);
        break;
      case 19:
        X(Ht);
        break;
      case 10:
        Ye(e.type);
        break;
      case 22:
      case 23:
        (Ge(e), lc(), t !== null && X(Bl));
        break;
      case 24:
        Ye(Nt);
    }
  }
  function cu(t, e) {
    try {
      var l = e.updateQueue,
        a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var u = a.next;
        l = u;
        do {
          if ((l.tag & t) === t) {
            a = void 0;
            var n = l.create,
              c = l.inst;
            ((a = n()), (c.destroy = a));
          }
          l = l.next;
        } while (l !== u);
      }
    } catch (f) {
      gt(e, e.return, f);
    }
  }
  function il(t, e, l) {
    try {
      var a = e.updateQueue,
        u = a !== null ? a.lastEffect : null;
      if (u !== null) {
        var n = u.next;
        a = n;
        do {
          if ((a.tag & t) === t) {
            var c = a.inst,
              f = c.destroy;
            if (f !== void 0) {
              ((c.destroy = void 0), (u = e));
              var d = l,
                T = f;
              try {
                T();
              } catch (z) {
                gt(u, d, z);
              }
            }
          }
          a = a.next;
        } while (a !== n);
      }
    } catch (z) {
      gt(e, e.return, z);
    }
  }
  function ss(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var l = t.stateNode;
      try {
        Fr(e, l);
      } catch (a) {
        gt(t, t.return, a);
      }
    }
  }
  function ds(t, e, l) {
    ((l.props = Yl(t.type, t.memoizedProps)), (l.state = t.memoizedState));
    try {
      l.componentWillUnmount();
    } catch (a) {
      gt(t, e, a);
    }
  }
  function fu(t, e) {
    try {
      var l = t.ref;
      if (l !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var a = t.stateNode;
            break;
          case 30:
            a = t.stateNode;
            break;
          default:
            a = t.stateNode;
        }
        typeof l == 'function' ? (t.refCleanup = l(a)) : (l.current = a);
      }
    } catch (u) {
      gt(t, e, u);
    }
  }
  function Oe(t, e) {
    var l = t.ref,
      a = t.refCleanup;
    if (l !== null)
      if (typeof a == 'function')
        try {
          a();
        } catch (u) {
          gt(t, e, u);
        } finally {
          ((t.refCleanup = null),
            (t = t.alternate),
            t != null && (t.refCleanup = null));
        }
      else if (typeof l == 'function')
        try {
          l(null);
        } catch (u) {
          gt(t, e, u);
        }
      else l.current = null;
  }
  function hs(t) {
    var e = t.type,
      l = t.memoizedProps,
      a = t.stateNode;
    try {
      t: switch (e) {
        case 'button':
        case 'input':
        case 'select':
        case 'textarea':
          l.autoFocus && a.focus();
          break t;
        case 'img':
          l.src ? (a.src = l.src) : l.srcSet && (a.srcset = l.srcSet);
      }
    } catch (u) {
      gt(t, t.return, u);
    }
  }
  function xc(t, e, l) {
    try {
      var a = t.stateNode;
      (e0(a, t.type, l, e), (a[$t] = e));
    } catch (u) {
      gt(t, t.return, u);
    }
  }
  function ms(t) {
    return (
      t.tag === 5 ||
      t.tag === 3 ||
      t.tag === 26 ||
      (t.tag === 27 && ml(t.type)) ||
      t.tag === 4
    );
  }
  function Uc(t) {
    t: for (;;) {
      for (; t.sibling === null; ) {
        if (t.return === null || ms(t.return)) return null;
        t = t.return;
      }
      for (
        t.sibling.return = t.return, t = t.sibling;
        t.tag !== 5 && t.tag !== 6 && t.tag !== 18;

      ) {
        if (
          (t.tag === 27 && ml(t.type)) ||
          t.flags & 2 ||
          t.child === null ||
          t.tag === 4
        )
          continue t;
        ((t.child.return = t), (t = t.child));
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function Nc(t, e, l) {
    var a = t.tag;
    if (a === 5 || a === 6)
      ((t = t.stateNode),
        e
          ? (l.nodeType === 9
              ? l.body
              : l.nodeName === 'HTML'
                ? l.ownerDocument.body
                : l
            ).insertBefore(t, e)
          : ((e =
              l.nodeType === 9
                ? l.body
                : l.nodeName === 'HTML'
                  ? l.ownerDocument.body
                  : l),
            e.appendChild(t),
            (l = l._reactRootContainer),
            l != null || e.onclick !== null || (e.onclick = qn)));
    else if (
      a !== 4 &&
      (a === 27 && ml(t.type) && ((l = t.stateNode), (e = null)),
      (t = t.child),
      t !== null)
    )
      for (Nc(t, e, l), t = t.sibling; t !== null; )
        (Nc(t, e, l), (t = t.sibling));
  }
  function Mn(t, e, l) {
    var a = t.tag;
    if (a === 5 || a === 6)
      ((t = t.stateNode), e ? l.insertBefore(t, e) : l.appendChild(t));
    else if (
      a !== 4 &&
      (a === 27 && ml(t.type) && (l = t.stateNode), (t = t.child), t !== null)
    )
      for (Mn(t, e, l), t = t.sibling; t !== null; )
        (Mn(t, e, l), (t = t.sibling));
  }
  function vs(t) {
    var e = t.stateNode,
      l = t.memoizedProps;
    try {
      for (var a = t.type, u = e.attributes; u.length; )
        e.removeAttributeNode(u[0]);
      (Lt(e, a, l), (e[Vt] = t), (e[$t] = l));
    } catch (n) {
      gt(t, t.return, n);
    }
  }
  var Qe = !1,
    Dt = !1,
    Hc = !1,
    ys = typeof WeakSet == 'function' ? WeakSet : Set,
    Yt = null;
  function Bm(t, e) {
    if (((t = t.containerInfo), (af = Zn), (t = Or(t)), Ui(t))) {
      if ('selectionStart' in t)
        var l = { start: t.selectionStart, end: t.selectionEnd };
      else
        t: {
          l = ((l = t.ownerDocument) && l.defaultView) || window;
          var a = l.getSelection && l.getSelection();
          if (a && a.rangeCount !== 0) {
            l = a.anchorNode;
            var u = a.anchorOffset,
              n = a.focusNode;
            a = a.focusOffset;
            try {
              (l.nodeType, n.nodeType);
            } catch {
              l = null;
              break t;
            }
            var c = 0,
              f = -1,
              d = -1,
              T = 0,
              z = 0,
              U = t,
              A = null;
            e: for (;;) {
              for (
                var M;
                U !== l || (u !== 0 && U.nodeType !== 3) || (f = c + u),
                  U !== n || (a !== 0 && U.nodeType !== 3) || (d = c + a),
                  U.nodeType === 3 && (c += U.nodeValue.length),
                  (M = U.firstChild) !== null;

              )
                ((A = U), (U = M));
              for (;;) {
                if (U === t) break e;
                if (
                  (A === l && ++T === u && (f = c),
                  A === n && ++z === a && (d = c),
                  (M = U.nextSibling) !== null)
                )
                  break;
                ((U = A), (A = U.parentNode));
              }
              U = M;
            }
            l = f === -1 || d === -1 ? null : { start: f, end: d };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (
      uf = { focusedElem: t, selectionRange: l }, Zn = !1, Yt = e;
      Yt !== null;

    )
      if (
        ((e = Yt), (t = e.child), (e.subtreeFlags & 1024) !== 0 && t !== null)
      )
        ((t.return = e), (Yt = t));
      else
        for (; Yt !== null; ) {
          switch (((e = Yt), (n = e.alternate), (t = e.flags), e.tag)) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((t & 1024) !== 0 && n !== null) {
                ((t = void 0),
                  (l = e),
                  (u = n.memoizedProps),
                  (n = n.memoizedState),
                  (a = l.stateNode));
                try {
                  var P = Yl(l.type, u, l.elementType === l.type);
                  ((t = a.getSnapshotBeforeUpdate(P, n)),
                    (a.__reactInternalSnapshotBeforeUpdate = t));
                } catch ($) {
                  gt(l, l.return, $);
                }
              }
              break;
            case 3:
              if ((t & 1024) !== 0) {
                if (
                  ((t = e.stateNode.containerInfo), (l = t.nodeType), l === 9)
                )
                  ff(t);
                else if (l === 1)
                  switch (t.nodeName) {
                    case 'HEAD':
                    case 'HTML':
                    case 'BODY':
                      ff(t);
                      break;
                    default:
                      t.textContent = '';
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((t & 1024) !== 0) throw Error(r(163));
          }
          if (((t = e.sibling), t !== null)) {
            ((t.return = e.return), (Yt = t));
            break;
          }
          Yt = e.return;
        }
  }
  function gs(t, e, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        (cl(t, l), a & 4 && cu(5, l));
        break;
      case 1:
        if ((cl(t, l), a & 4))
          if (((t = l.stateNode), e === null))
            try {
              t.componentDidMount();
            } catch (c) {
              gt(l, l.return, c);
            }
          else {
            var u = Yl(l.type, e.memoizedProps);
            e = e.memoizedState;
            try {
              t.componentDidUpdate(u, e, t.__reactInternalSnapshotBeforeUpdate);
            } catch (c) {
              gt(l, l.return, c);
            }
          }
        (a & 64 && ss(l), a & 512 && fu(l, l.return));
        break;
      case 3:
        if ((cl(t, l), a & 64 && ((t = l.updateQueue), t !== null))) {
          if (((e = null), l.child !== null))
            switch (l.child.tag) {
              case 27:
              case 5:
                e = l.child.stateNode;
                break;
              case 1:
                e = l.child.stateNode;
            }
          try {
            Fr(t, e);
          } catch (c) {
            gt(l, l.return, c);
          }
        }
        break;
      case 27:
        e === null && a & 4 && vs(l);
      case 26:
      case 5:
        (cl(t, l), e === null && a & 4 && hs(l), a & 512 && fu(l, l.return));
        break;
      case 12:
        cl(t, l);
        break;
      case 13:
        (cl(t, l),
          a & 4 && ps(t, l),
          a & 64 &&
            ((t = l.memoizedState),
            t !== null &&
              ((t = t.dehydrated),
              t !== null && ((l = Vm.bind(null, l)), f0(t, l)))));
        break;
      case 22:
        if (((a = l.memoizedState !== null || Qe), !a)) {
          ((e = (e !== null && e.memoizedState !== null) || Dt), (u = Qe));
          var n = Dt;
          ((Qe = a),
            (Dt = e) && !n ? fl(t, l, (l.subtreeFlags & 8772) !== 0) : cl(t, l),
            (Qe = u),
            (Dt = n));
        }
        break;
      case 30:
        break;
      default:
        cl(t, l);
    }
  }
  function Ss(t) {
    var e = t.alternate;
    (e !== null && ((t.alternate = null), Ss(e)),
      (t.child = null),
      (t.deletions = null),
      (t.sibling = null),
      t.tag === 5 && ((e = t.stateNode), e !== null && di(e)),
      (t.stateNode = null),
      (t.return = null),
      (t.dependencies = null),
      (t.memoizedProps = null),
      (t.memoizedState = null),
      (t.pendingProps = null),
      (t.stateNode = null),
      (t.updateQueue = null));
  }
  var pt = null,
    Ft = !1;
  function Ze(t, e, l) {
    for (l = l.child; l !== null; ) (bs(t, e, l), (l = l.sibling));
  }
  function bs(t, e, l) {
    if (ee && typeof ee.onCommitFiberUnmount == 'function')
      try {
        ee.onCommitFiberUnmount(_a, l);
      } catch {}
    switch (l.tag) {
      case 26:
        (Dt || Oe(l, e),
          Ze(t, e, l),
          l.memoizedState
            ? l.memoizedState.count--
            : l.stateNode && ((l = l.stateNode), l.parentNode.removeChild(l)));
        break;
      case 27:
        Dt || Oe(l, e);
        var a = pt,
          u = Ft;
        (ml(l.type) && ((pt = l.stateNode), (Ft = !1)),
          Ze(t, e, l),
          gu(l.stateNode),
          (pt = a),
          (Ft = u));
        break;
      case 5:
        Dt || Oe(l, e);
      case 6:
        if (
          ((a = pt),
          (u = Ft),
          (pt = null),
          Ze(t, e, l),
          (pt = a),
          (Ft = u),
          pt !== null)
        )
          if (Ft)
            try {
              (pt.nodeType === 9
                ? pt.body
                : pt.nodeName === 'HTML'
                  ? pt.ownerDocument.body
                  : pt
              ).removeChild(l.stateNode);
            } catch (n) {
              gt(l, e, n);
            }
          else
            try {
              pt.removeChild(l.stateNode);
            } catch (n) {
              gt(l, e, n);
            }
        break;
      case 18:
        pt !== null &&
          (Ft
            ? ((t = pt),
              cd(
                t.nodeType === 9
                  ? t.body
                  : t.nodeName === 'HTML'
                    ? t.ownerDocument.body
                    : t,
                l.stateNode
              ),
              Mu(t))
            : cd(pt, l.stateNode));
        break;
      case 4:
        ((a = pt),
          (u = Ft),
          (pt = l.stateNode.containerInfo),
          (Ft = !0),
          Ze(t, e, l),
          (pt = a),
          (Ft = u));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (Dt || il(2, l, e), Dt || il(4, l, e), Ze(t, e, l));
        break;
      case 1:
        (Dt ||
          (Oe(l, e),
          (a = l.stateNode),
          typeof a.componentWillUnmount == 'function' && ds(l, e, a)),
          Ze(t, e, l));
        break;
      case 21:
        Ze(t, e, l);
        break;
      case 22:
        ((Dt = (a = Dt) || l.memoizedState !== null), Ze(t, e, l), (Dt = a));
        break;
      default:
        Ze(t, e, l);
    }
  }
  function ps(t, e) {
    if (
      e.memoizedState === null &&
      ((t = e.alternate),
      t !== null &&
        ((t = t.memoizedState), t !== null && ((t = t.dehydrated), t !== null)))
    )
      try {
        Mu(t);
      } catch (l) {
        gt(e, e.return, l);
      }
  }
  function qm(t) {
    switch (t.tag) {
      case 13:
      case 19:
        var e = t.stateNode;
        return (e === null && (e = t.stateNode = new ys()), e);
      case 22:
        return (
          (t = t.stateNode),
          (e = t._retryCache),
          e === null && (e = t._retryCache = new ys()),
          e
        );
      default:
        throw Error(r(435, t.tag));
    }
  }
  function Cc(t, e) {
    var l = qm(t);
    e.forEach(function (a) {
      var u = wm.bind(null, t, a);
      l.has(a) || (l.add(a), a.then(u, u));
    });
  }
  function ne(t, e) {
    var l = e.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var u = l[a],
          n = t,
          c = e,
          f = c;
        t: for (; f !== null; ) {
          switch (f.tag) {
            case 27:
              if (ml(f.type)) {
                ((pt = f.stateNode), (Ft = !1));
                break t;
              }
              break;
            case 5:
              ((pt = f.stateNode), (Ft = !1));
              break t;
            case 3:
            case 4:
              ((pt = f.stateNode.containerInfo), (Ft = !0));
              break t;
          }
          f = f.return;
        }
        if (pt === null) throw Error(r(160));
        (bs(n, c, u),
          (pt = null),
          (Ft = !1),
          (n = u.alternate),
          n !== null && (n.return = null),
          (u.return = null));
      }
    if (e.subtreeFlags & 13878)
      for (e = e.child; e !== null; ) (Es(e, t), (e = e.sibling));
  }
  var Ee = null;
  function Es(t, e) {
    var l = t.alternate,
      a = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (ne(e, t),
          ie(t),
          a & 4 && (il(3, t, t.return), cu(3, t), il(5, t, t.return)));
        break;
      case 1:
        (ne(e, t),
          ie(t),
          a & 512 && (Dt || l === null || Oe(l, l.return)),
          a & 64 &&
            Qe &&
            ((t = t.updateQueue),
            t !== null &&
              ((a = t.callbacks),
              a !== null &&
                ((l = t.shared.hiddenCallbacks),
                (t.shared.hiddenCallbacks = l === null ? a : l.concat(a))))));
        break;
      case 26:
        var u = Ee;
        if (
          (ne(e, t),
          ie(t),
          a & 512 && (Dt || l === null || Oe(l, l.return)),
          a & 4)
        ) {
          var n = l !== null ? l.memoizedState : null;
          if (((a = t.memoizedState), l === null))
            if (a === null)
              if (t.stateNode === null) {
                t: {
                  ((a = t.type),
                    (l = t.memoizedProps),
                    (u = u.ownerDocument || u));
                  e: switch (a) {
                    case 'title':
                      ((n = u.getElementsByTagName('title')[0]),
                        (!n ||
                          n[Na] ||
                          n[Vt] ||
                          n.namespaceURI === 'http://www.w3.org/2000/svg' ||
                          n.hasAttribute('itemprop')) &&
                          ((n = u.createElement(a)),
                          u.head.insertBefore(
                            n,
                            u.querySelector('head > title')
                          )),
                        Lt(n, a, l),
                        (n[Vt] = t),
                        Bt(n),
                        (a = n));
                      break t;
                    case 'link':
                      var c = vd('link', 'href', u).get(a + (l.href || ''));
                      if (c) {
                        for (var f = 0; f < c.length; f++)
                          if (
                            ((n = c[f]),
                            n.getAttribute('href') ===
                              (l.href == null || l.href === ''
                                ? null
                                : l.href) &&
                              n.getAttribute('rel') ===
                                (l.rel == null ? null : l.rel) &&
                              n.getAttribute('title') ===
                                (l.title == null ? null : l.title) &&
                              n.getAttribute('crossorigin') ===
                                (l.crossOrigin == null ? null : l.crossOrigin))
                          ) {
                            c.splice(f, 1);
                            break e;
                          }
                      }
                      ((n = u.createElement(a)),
                        Lt(n, a, l),
                        u.head.appendChild(n));
                      break;
                    case 'meta':
                      if (
                        (c = vd('meta', 'content', u).get(
                          a + (l.content || '')
                        ))
                      ) {
                        for (f = 0; f < c.length; f++)
                          if (
                            ((n = c[f]),
                            n.getAttribute('content') ===
                              (l.content == null ? null : '' + l.content) &&
                              n.getAttribute('name') ===
                                (l.name == null ? null : l.name) &&
                              n.getAttribute('property') ===
                                (l.property == null ? null : l.property) &&
                              n.getAttribute('http-equiv') ===
                                (l.httpEquiv == null ? null : l.httpEquiv) &&
                              n.getAttribute('charset') ===
                                (l.charSet == null ? null : l.charSet))
                          ) {
                            c.splice(f, 1);
                            break e;
                          }
                      }
                      ((n = u.createElement(a)),
                        Lt(n, a, l),
                        u.head.appendChild(n));
                      break;
                    default:
                      throw Error(r(468, a));
                  }
                  ((n[Vt] = t), Bt(n), (a = n));
                }
                t.stateNode = a;
              } else yd(u, t.type, t.stateNode);
            else t.stateNode = md(u, a, t.memoizedProps);
          else
            n !== a
              ? (n === null
                  ? l.stateNode !== null &&
                    ((l = l.stateNode), l.parentNode.removeChild(l))
                  : n.count--,
                a === null
                  ? yd(u, t.type, t.stateNode)
                  : md(u, a, t.memoizedProps))
              : a === null &&
                t.stateNode !== null &&
                xc(t, t.memoizedProps, l.memoizedProps);
        }
        break;
      case 27:
        (ne(e, t),
          ie(t),
          a & 512 && (Dt || l === null || Oe(l, l.return)),
          l !== null && a & 4 && xc(t, t.memoizedProps, l.memoizedProps));
        break;
      case 5:
        if (
          (ne(e, t),
          ie(t),
          a & 512 && (Dt || l === null || Oe(l, l.return)),
          t.flags & 32)
        ) {
          u = t.stateNode;
          try {
            kl(u, '');
          } catch (M) {
            gt(t, t.return, M);
          }
        }
        (a & 4 &&
          t.stateNode != null &&
          ((u = t.memoizedProps), xc(t, u, l !== null ? l.memoizedProps : u)),
          a & 1024 && (Hc = !0));
        break;
      case 6:
        if ((ne(e, t), ie(t), a & 4)) {
          if (t.stateNode === null) throw Error(r(162));
          ((a = t.memoizedProps), (l = t.stateNode));
          try {
            l.nodeValue = a;
          } catch (M) {
            gt(t, t.return, M);
          }
        }
        break;
      case 3:
        if (
          ((Xn = null),
          (u = Ee),
          (Ee = jn(e.containerInfo)),
          ne(e, t),
          (Ee = u),
          ie(t),
          a & 4 && l !== null && l.memoizedState.isDehydrated)
        )
          try {
            Mu(e.containerInfo);
          } catch (M) {
            gt(t, t.return, M);
          }
        Hc && ((Hc = !1), Ts(t));
        break;
      case 4:
        ((a = Ee),
          (Ee = jn(t.stateNode.containerInfo)),
          ne(e, t),
          ie(t),
          (Ee = a));
        break;
      case 12:
        (ne(e, t), ie(t));
        break;
      case 13:
        (ne(e, t),
          ie(t),
          t.child.flags & 8192 &&
            (t.memoizedState !== null) !=
              (l !== null && l.memoizedState !== null) &&
            (Xc = Re()),
          a & 4 &&
            ((a = t.updateQueue),
            a !== null && ((t.updateQueue = null), Cc(t, a))));
        break;
      case 22:
        u = t.memoizedState !== null;
        var d = l !== null && l.memoizedState !== null,
          T = Qe,
          z = Dt;
        if (
          ((Qe = T || u),
          (Dt = z || d),
          ne(e, t),
          (Dt = z),
          (Qe = T),
          ie(t),
          a & 8192)
        )
          t: for (
            e = t.stateNode,
              e._visibility = u ? e._visibility & -2 : e._visibility | 1,
              u && (l === null || d || Qe || Dt || jl(t)),
              l = null,
              e = t;
            ;

          ) {
            if (e.tag === 5 || e.tag === 26) {
              if (l === null) {
                d = l = e;
                try {
                  if (((n = d.stateNode), u))
                    ((c = n.style),
                      typeof c.setProperty == 'function'
                        ? c.setProperty('display', 'none', 'important')
                        : (c.display = 'none'));
                  else {
                    f = d.stateNode;
                    var U = d.memoizedProps.style,
                      A =
                        U != null && U.hasOwnProperty('display')
                          ? U.display
                          : null;
                    f.style.display =
                      A == null || typeof A == 'boolean' ? '' : ('' + A).trim();
                  }
                } catch (M) {
                  gt(d, d.return, M);
                }
              }
            } else if (e.tag === 6) {
              if (l === null) {
                d = e;
                try {
                  d.stateNode.nodeValue = u ? '' : d.memoizedProps;
                } catch (M) {
                  gt(d, d.return, M);
                }
              }
            } else if (
              ((e.tag !== 22 && e.tag !== 23) ||
                e.memoizedState === null ||
                e === t) &&
              e.child !== null
            ) {
              ((e.child.return = e), (e = e.child));
              continue;
            }
            if (e === t) break t;
            for (; e.sibling === null; ) {
              if (e.return === null || e.return === t) break t;
              (l === e && (l = null), (e = e.return));
            }
            (l === e && (l = null),
              (e.sibling.return = e.return),
              (e = e.sibling));
          }
        a & 4 &&
          ((a = t.updateQueue),
          a !== null &&
            ((l = a.retryQueue),
            l !== null && ((a.retryQueue = null), Cc(t, l))));
        break;
      case 19:
        (ne(e, t),
          ie(t),
          a & 4 &&
            ((a = t.updateQueue),
            a !== null && ((t.updateQueue = null), Cc(t, a))));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        (ne(e, t), ie(t));
    }
  }
  function ie(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var l, a = t.return; a !== null; ) {
          if (ms(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(r(160));
        switch (l.tag) {
          case 27:
            var u = l.stateNode,
              n = Uc(t);
            Mn(t, n, u);
            break;
          case 5:
            var c = l.stateNode;
            l.flags & 32 && (kl(c, ''), (l.flags &= -33));
            var f = Uc(t);
            Mn(t, f, c);
            break;
          case 3:
          case 4:
            var d = l.stateNode.containerInfo,
              T = Uc(t);
            Nc(t, T, d);
            break;
          default:
            throw Error(r(161));
        }
      } catch (z) {
        gt(t, t.return, z);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function Ts(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        (Ts(e),
          e.tag === 5 && e.flags & 1024 && e.stateNode.reset(),
          (t = t.sibling));
      }
  }
  function cl(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; ) (gs(t, e.alternate, e), (e = e.sibling));
  }
  function jl(t) {
    for (t = t.child; t !== null; ) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (il(4, e, e.return), jl(e));
          break;
        case 1:
          Oe(e, e.return);
          var l = e.stateNode;
          (typeof l.componentWillUnmount == 'function' && ds(e, e.return, l),
            jl(e));
          break;
        case 27:
          gu(e.stateNode);
        case 26:
        case 5:
          (Oe(e, e.return), jl(e));
          break;
        case 22:
          e.memoizedState === null && jl(e);
          break;
        case 30:
          jl(e);
          break;
        default:
          jl(e);
      }
      t = t.sibling;
    }
  }
  function fl(t, e, l) {
    for (l = l && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var a = e.alternate,
        u = t,
        n = e,
        c = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          (fl(u, n, l), cu(4, n));
          break;
        case 1:
          if (
            (fl(u, n, l),
            (a = n),
            (u = a.stateNode),
            typeof u.componentDidMount == 'function')
          )
            try {
              u.componentDidMount();
            } catch (T) {
              gt(a, a.return, T);
            }
          if (((a = n), (u = a.updateQueue), u !== null)) {
            var f = a.stateNode;
            try {
              var d = u.shared.hiddenCallbacks;
              if (d !== null)
                for (u.shared.hiddenCallbacks = null, u = 0; u < d.length; u++)
                  Wr(d[u], f);
            } catch (T) {
              gt(a, a.return, T);
            }
          }
          (l && c & 64 && ss(n), fu(n, n.return));
          break;
        case 27:
          vs(n);
        case 26:
        case 5:
          (fl(u, n, l), l && a === null && c & 4 && hs(n), fu(n, n.return));
          break;
        case 12:
          fl(u, n, l);
          break;
        case 13:
          (fl(u, n, l), l && c & 4 && ps(u, n));
          break;
        case 22:
          (n.memoizedState === null && fl(u, n, l), fu(n, n.return));
          break;
        case 30:
          break;
        default:
          fl(u, n, l);
      }
      e = e.sibling;
    }
  }
  function Bc(t, e) {
    var l = null;
    (t !== null &&
      t.memoizedState !== null &&
      t.memoizedState.cachePool !== null &&
      (l = t.memoizedState.cachePool.pool),
      (t = null),
      e.memoizedState !== null &&
        e.memoizedState.cachePool !== null &&
        (t = e.memoizedState.cachePool.pool),
      t !== l && (t != null && t.refCount++, l != null && Ja(l)));
  }
  function qc(t, e) {
    ((t = null),
      e.alternate !== null && (t = e.alternate.memoizedState.cache),
      (e = e.memoizedState.cache),
      e !== t && (e.refCount++, t != null && Ja(t)));
  }
  function ze(t, e, l, a) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) (Rs(t, e, l, a), (e = e.sibling));
  }
  function Rs(t, e, l, a) {
    var u = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (ze(t, e, l, a), u & 2048 && cu(9, e));
        break;
      case 1:
        ze(t, e, l, a);
        break;
      case 3:
        (ze(t, e, l, a),
          u & 2048 &&
            ((t = null),
            e.alternate !== null && (t = e.alternate.memoizedState.cache),
            (e = e.memoizedState.cache),
            e !== t && (e.refCount++, t != null && Ja(t))));
        break;
      case 12:
        if (u & 2048) {
          (ze(t, e, l, a), (t = e.stateNode));
          try {
            var n = e.memoizedProps,
              c = n.id,
              f = n.onPostCommit;
            typeof f == 'function' &&
              f(
                c,
                e.alternate === null ? 'mount' : 'update',
                t.passiveEffectDuration,
                -0
              );
          } catch (d) {
            gt(e, e.return, d);
          }
        } else ze(t, e, l, a);
        break;
      case 13:
        ze(t, e, l, a);
        break;
      case 23:
        break;
      case 22:
        ((n = e.stateNode),
          (c = e.alternate),
          e.memoizedState !== null
            ? n._visibility & 2
              ? ze(t, e, l, a)
              : ru(t, e)
            : n._visibility & 2
              ? ze(t, e, l, a)
              : ((n._visibility |= 2),
                ma(t, e, l, a, (e.subtreeFlags & 10256) !== 0)),
          u & 2048 && Bc(c, e));
        break;
      case 24:
        (ze(t, e, l, a), u & 2048 && qc(e.alternate, e));
        break;
      default:
        ze(t, e, l, a);
    }
  }
  function ma(t, e, l, a, u) {
    for (u = u && (e.subtreeFlags & 10256) !== 0, e = e.child; e !== null; ) {
      var n = t,
        c = e,
        f = l,
        d = a,
        T = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          (ma(n, c, f, d, u), cu(8, c));
          break;
        case 23:
          break;
        case 22:
          var z = c.stateNode;
          (c.memoizedState !== null
            ? z._visibility & 2
              ? ma(n, c, f, d, u)
              : ru(n, c)
            : ((z._visibility |= 2), ma(n, c, f, d, u)),
            u && T & 2048 && Bc(c.alternate, c));
          break;
        case 24:
          (ma(n, c, f, d, u), u && T & 2048 && qc(c.alternate, c));
          break;
        default:
          ma(n, c, f, d, u);
      }
      e = e.sibling;
    }
  }
  function ru(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var l = t,
          a = e,
          u = a.flags;
        switch (a.tag) {
          case 22:
            (ru(l, a), u & 2048 && Bc(a.alternate, a));
            break;
          case 24:
            (ru(l, a), u & 2048 && qc(a.alternate, a));
            break;
          default:
            ru(l, a);
        }
        e = e.sibling;
      }
  }
  var ou = 8192;
  function va(t) {
    if (t.subtreeFlags & ou)
      for (t = t.child; t !== null; ) (As(t), (t = t.sibling));
  }
  function As(t) {
    switch (t.tag) {
      case 26:
        (va(t),
          t.flags & ou &&
            t.memoizedState !== null &&
            E0(Ee, t.memoizedState, t.memoizedProps));
        break;
      case 5:
        va(t);
        break;
      case 3:
      case 4:
        var e = Ee;
        ((Ee = jn(t.stateNode.containerInfo)), va(t), (Ee = e));
        break;
      case 22:
        t.memoizedState === null &&
          ((e = t.alternate),
          e !== null && e.memoizedState !== null
            ? ((e = ou), (ou = 16777216), va(t), (ou = e))
            : va(t));
        break;
      default:
        va(t);
    }
  }
  function Ms(t) {
    var e = t.alternate;
    if (e !== null && ((t = e.child), t !== null)) {
      e.child = null;
      do ((e = t.sibling), (t.sibling = null), (t = e));
      while (t !== null);
    }
  }
  function su(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var a = e[l];
          ((Yt = a), zs(a, t));
        }
      Ms(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) (Os(t), (t = t.sibling));
  }
  function Os(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (su(t), t.flags & 2048 && il(9, t, t.return));
        break;
      case 3:
        su(t);
        break;
      case 12:
        su(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null &&
        e._visibility & 2 &&
        (t.return === null || t.return.tag !== 13)
          ? ((e._visibility &= -3), On(t))
          : su(t);
        break;
      default:
        su(t);
    }
  }
  function On(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var a = e[l];
          ((Yt = a), zs(a, t));
        }
      Ms(t);
    }
    for (t = t.child; t !== null; ) {
      switch (((e = t), e.tag)) {
        case 0:
        case 11:
        case 15:
          (il(8, e, e.return), On(e));
          break;
        case 22:
          ((l = e.stateNode),
            l._visibility & 2 && ((l._visibility &= -3), On(e)));
          break;
        default:
          On(e);
      }
      t = t.sibling;
    }
  }
  function zs(t, e) {
    for (; Yt !== null; ) {
      var l = Yt;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          il(8, l, e);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Ja(l.memoizedState.cache);
      }
      if (((a = l.child), a !== null)) ((a.return = l), (Yt = a));
      else
        t: for (l = t; Yt !== null; ) {
          a = Yt;
          var u = a.sibling,
            n = a.return;
          if ((Ss(a), a === l)) {
            Yt = null;
            break t;
          }
          if (u !== null) {
            ((u.return = n), (Yt = u));
            break t;
          }
          Yt = n;
        }
    }
  }
  var Ym = {
      getCacheForType: function (t) {
        var e = wt(Nt),
          l = e.data.get(t);
        return (l === void 0 && ((l = t()), e.data.set(t, l)), l);
      },
    },
    jm = typeof WeakMap == 'function' ? WeakMap : Map,
    st = 0,
    St = null,
    at = null,
    it = 0,
    dt = 0,
    ce = null,
    rl = !1,
    ya = !1,
    Yc = !1,
    Ve = 0,
    Mt = 0,
    ol = 0,
    Gl = 0,
    jc = 0,
    Se = 0,
    ga = 0,
    du = null,
    Pt = null,
    Gc = !1,
    Xc = 0,
    zn = 1 / 0,
    Dn = null,
    sl = null,
    Xt = 0,
    dl = null,
    Sa = null,
    ba = 0,
    Lc = 0,
    Qc = null,
    Ds = null,
    hu = 0,
    Zc = null;
  function fe() {
    if ((st & 2) !== 0 && it !== 0) return it & -it;
    if (D.T !== null) {
      var t = ia;
      return t !== 0 ? t : Wc();
    }
    return Zf();
  }
  function _s() {
    Se === 0 && (Se = (it & 536870912) === 0 || ot ? Gf() : 536870912);
    var t = ge.current;
    return (t !== null && (t.flags |= 32), Se);
  }
  function re(t, e, l) {
    (((t === St && (dt === 2 || dt === 9)) || t.cancelPendingCommit !== null) &&
      (pa(t, 0), hl(t, it, Se, !1)),
      Ua(t, l),
      ((st & 2) === 0 || t !== St) &&
        (t === St &&
          ((st & 2) === 0 && (Gl |= l), Mt === 4 && hl(t, it, Se, !1)),
        De(t)));
  }
  function xs(t, e, l) {
    if ((st & 6) !== 0) throw Error(r(327));
    var a = (!l && (e & 124) === 0 && (e & t.expiredLanes) === 0) || xa(t, e),
      u = a ? Lm(t, e) : Kc(t, e, !0),
      n = a;
    do {
      if (u === 0) {
        ya && !a && hl(t, e, 0, !1);
        break;
      } else {
        if (((l = t.current.alternate), n && !Gm(l))) {
          ((u = Kc(t, e, !1)), (n = !1));
          continue;
        }
        if (u === 2) {
          if (((n = e), t.errorRecoveryDisabledLanes & n)) var c = 0;
          else
            ((c = t.pendingLanes & -536870913),
              (c = c !== 0 ? c : c & 536870912 ? 536870912 : 0));
          if (c !== 0) {
            e = c;
            t: {
              var f = t;
              u = du;
              var d = f.current.memoizedState.isDehydrated;
              if ((d && (pa(f, c).flags |= 256), (c = Kc(f, c, !1)), c !== 2)) {
                if (Yc && !d) {
                  ((f.errorRecoveryDisabledLanes |= n), (Gl |= n), (u = 4));
                  break t;
                }
                ((n = Pt),
                  (Pt = u),
                  n !== null &&
                    (Pt === null ? (Pt = n) : Pt.push.apply(Pt, n)));
              }
              u = c;
            }
            if (((n = !1), u !== 2)) continue;
          }
        }
        if (u === 1) {
          (pa(t, 0), hl(t, e, 0, !0));
          break;
        }
        t: {
          switch (((a = t), (n = u), n)) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((e & 4194048) !== e) break;
            case 6:
              hl(a, e, Se, !rl);
              break t;
            case 2:
              Pt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((e & 62914560) === e && ((u = Xc + 300 - Re()), 10 < u)) {
            if ((hl(a, e, Se, !rl), ju(a, 0, !0) !== 0)) break t;
            a.timeoutHandle = nd(
              Us.bind(null, a, l, Pt, Dn, Gc, e, Se, Gl, ga, rl, n, 2, -0, 0),
              u
            );
            break t;
          }
          Us(a, l, Pt, Dn, Gc, e, Se, Gl, ga, rl, n, 0, -0, 0);
        }
      }
      break;
    } while (!0);
    De(t);
  }
  function Us(t, e, l, a, u, n, c, f, d, T, z, U, A, M) {
    if (
      ((t.timeoutHandle = -1),
      (U = e.subtreeFlags),
      (U & 8192 || (U & 16785408) === 16785408) &&
        ((pu = { stylesheets: null, count: 0, unsuspend: p0 }),
        As(e),
        (U = T0()),
        U !== null))
    ) {
      ((t.cancelPendingCommit = U(
        js.bind(null, t, e, n, l, a, u, c, f, d, z, 1, A, M)
      )),
        hl(t, n, c, !T));
      return;
    }
    js(t, e, n, l, a, u, c, f, d);
  }
  function Gm(t) {
    for (var e = t; ; ) {
      var l = e.tag;
      if (
        (l === 0 || l === 11 || l === 15) &&
        e.flags & 16384 &&
        ((l = e.updateQueue), l !== null && ((l = l.stores), l !== null))
      )
        for (var a = 0; a < l.length; a++) {
          var u = l[a],
            n = u.getSnapshot;
          u = u.value;
          try {
            if (!ae(n(), u)) return !1;
          } catch {
            return !1;
          }
        }
      if (((l = e.child), e.subtreeFlags & 16384 && l !== null))
        ((l.return = e), (e = l));
      else {
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return !0;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    }
    return !0;
  }
  function hl(t, e, l, a) {
    ((e &= ~jc),
      (e &= ~Gl),
      (t.suspendedLanes |= e),
      (t.pingedLanes &= ~e),
      a && (t.warmLanes |= e),
      (a = t.expirationTimes));
    for (var u = e; 0 < u; ) {
      var n = 31 - le(u),
        c = 1 << n;
      ((a[n] = -1), (u &= ~c));
    }
    l !== 0 && Lf(t, l, e);
  }
  function _n() {
    return (st & 6) === 0 ? (mu(0), !1) : !0;
  }
  function Vc() {
    if (at !== null) {
      if (dt === 0) var t = at.return;
      else ((t = at), (qe = Hl = null), cc(t), (da = null), (uu = 0), (t = at));
      for (; t !== null; ) (os(t.alternate, t), (t = t.return));
      at = null;
    }
  }
  function pa(t, e) {
    var l = t.timeoutHandle;
    (l !== -1 && ((t.timeoutHandle = -1), a0(l)),
      (l = t.cancelPendingCommit),
      l !== null && ((t.cancelPendingCommit = null), l()),
      Vc(),
      (St = t),
      (at = l = He(t.current, null)),
      (it = e),
      (dt = 0),
      (ce = null),
      (rl = !1),
      (ya = xa(t, e)),
      (Yc = !1),
      (ga = Se = jc = Gl = ol = Mt = 0),
      (Pt = du = null),
      (Gc = !1),
      (e & 8) !== 0 && (e |= e & 32));
    var a = t.entangledLanes;
    if (a !== 0)
      for (t = t.entanglements, a &= e; 0 < a; ) {
        var u = 31 - le(a),
          n = 1 << u;
        ((e |= t[u]), (a &= ~n));
      }
    return ((Ve = e), Wu(), l);
  }
  function Ns(t, e) {
    ((et = null),
      (D.H = yn),
      e === ka || e === nn
        ? ((e = $r()), (dt = 3))
        : e === wr
          ? ((e = $r()), (dt = 4))
          : (dt =
              e === Wo
                ? 8
                : e !== null &&
                    typeof e == 'object' &&
                    typeof e.then == 'function'
                  ? 6
                  : 1),
      (ce = e),
      at === null && ((Mt = 1), En(t, he(e, t.current))));
  }
  function Hs() {
    var t = D.H;
    return ((D.H = yn), t === null ? yn : t);
  }
  function Cs() {
    var t = D.A;
    return ((D.A = Ym), t);
  }
  function wc() {
    ((Mt = 4),
      rl || ((it & 4194048) !== it && ge.current !== null) || (ya = !0),
      ((ol & 134217727) === 0 && (Gl & 134217727) === 0) ||
        St === null ||
        hl(St, it, Se, !1));
  }
  function Kc(t, e, l) {
    var a = st;
    st |= 2;
    var u = Hs(),
      n = Cs();
    ((St !== t || it !== e) && ((Dn = null), pa(t, e)), (e = !1));
    var c = Mt;
    t: do
      try {
        if (dt !== 0 && at !== null) {
          var f = at,
            d = ce;
          switch (dt) {
            case 8:
              (Vc(), (c = 6));
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              ge.current === null && (e = !0);
              var T = dt;
              if (((dt = 0), (ce = null), Ea(t, f, d, T), l && ya)) {
                c = 0;
                break t;
              }
              break;
            default:
              ((T = dt), (dt = 0), (ce = null), Ea(t, f, d, T));
          }
        }
        (Xm(), (c = Mt));
        break;
      } catch (z) {
        Ns(t, z);
      }
    while (!0);
    return (
      e && t.shellSuspendCounter++,
      (qe = Hl = null),
      (st = a),
      (D.H = u),
      (D.A = n),
      at === null && ((St = null), (it = 0), Wu()),
      c
    );
  }
  function Xm() {
    for (; at !== null; ) Bs(at);
  }
  function Lm(t, e) {
    var l = st;
    st |= 2;
    var a = Hs(),
      u = Cs();
    St !== t || it !== e
      ? ((Dn = null), (zn = Re() + 500), pa(t, e))
      : (ya = xa(t, e));
    t: do
      try {
        if (dt !== 0 && at !== null) {
          e = at;
          var n = ce;
          e: switch (dt) {
            case 1:
              ((dt = 0), (ce = null), Ea(t, e, n, 1));
              break;
            case 2:
            case 9:
              if (Kr(n)) {
                ((dt = 0), (ce = null), qs(e));
                break;
              }
              ((e = function () {
                ((dt !== 2 && dt !== 9) || St !== t || (dt = 7), De(t));
              }),
                n.then(e, e));
              break t;
            case 3:
              dt = 7;
              break t;
            case 4:
              dt = 5;
              break t;
            case 7:
              Kr(n)
                ? ((dt = 0), (ce = null), qs(e))
                : ((dt = 0), (ce = null), Ea(t, e, n, 7));
              break;
            case 5:
              var c = null;
              switch (at.tag) {
                case 26:
                  c = at.memoizedState;
                case 5:
                case 27:
                  var f = at;
                  if (!c || gd(c)) {
                    ((dt = 0), (ce = null));
                    var d = f.sibling;
                    if (d !== null) at = d;
                    else {
                      var T = f.return;
                      T !== null ? ((at = T), xn(T)) : (at = null);
                    }
                    break e;
                  }
              }
              ((dt = 0), (ce = null), Ea(t, e, n, 5));
              break;
            case 6:
              ((dt = 0), (ce = null), Ea(t, e, n, 6));
              break;
            case 8:
              (Vc(), (Mt = 6));
              break t;
            default:
              throw Error(r(462));
          }
        }
        Qm();
        break;
      } catch (z) {
        Ns(t, z);
      }
    while (!0);
    return (
      (qe = Hl = null),
      (D.H = a),
      (D.A = u),
      (st = l),
      at !== null ? 0 : ((St = null), (it = 0), Wu(), Mt)
    );
  }
  function Qm() {
    for (; at !== null && !oh(); ) Bs(at);
  }
  function Bs(t) {
    var e = fs(t.alternate, t, Ve);
    ((t.memoizedProps = t.pendingProps), e === null ? xn(t) : (at = e));
  }
  function qs(t) {
    var e = t,
      l = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = ls(l, e, e.pendingProps, e.type, void 0, it);
        break;
      case 11:
        e = ls(l, e, e.pendingProps, e.type.render, e.ref, it);
        break;
      case 5:
        cc(e);
      default:
        (os(l, e), (e = at = qr(e, Ve)), (e = fs(l, e, Ve)));
    }
    ((t.memoizedProps = t.pendingProps), e === null ? xn(t) : (at = e));
  }
  function Ea(t, e, l, a) {
    ((qe = Hl = null), cc(e), (da = null), (uu = 0));
    var u = e.return;
    try {
      if (Um(t, u, e, l, it)) {
        ((Mt = 1), En(t, he(l, t.current)), (at = null));
        return;
      }
    } catch (n) {
      if (u !== null) throw ((at = u), n);
      ((Mt = 1), En(t, he(l, t.current)), (at = null));
      return;
    }
    e.flags & 32768
      ? (ot || a === 1
          ? (t = !0)
          : ya || (it & 536870912) !== 0
            ? (t = !1)
            : ((rl = t = !0),
              (a === 2 || a === 9 || a === 3 || a === 6) &&
                ((a = ge.current),
                a !== null && a.tag === 13 && (a.flags |= 16384))),
        Ys(e, t))
      : xn(e);
  }
  function xn(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        Ys(e, rl);
        return;
      }
      t = e.return;
      var l = Hm(e.alternate, e, Ve);
      if (l !== null) {
        at = l;
        return;
      }
      if (((e = e.sibling), e !== null)) {
        at = e;
        return;
      }
      at = e = t;
    } while (e !== null);
    Mt === 0 && (Mt = 5);
  }
  function Ys(t, e) {
    do {
      var l = Cm(t.alternate, t);
      if (l !== null) {
        ((l.flags &= 32767), (at = l));
        return;
      }
      if (
        ((l = t.return),
        l !== null &&
          ((l.flags |= 32768), (l.subtreeFlags = 0), (l.deletions = null)),
        !e && ((t = t.sibling), t !== null))
      ) {
        at = t;
        return;
      }
      at = t = l;
    } while (t !== null);
    ((Mt = 6), (at = null));
  }
  function js(t, e, l, a, u, n, c, f, d) {
    t.cancelPendingCommit = null;
    do Un();
    while (Xt !== 0);
    if ((st & 6) !== 0) throw Error(r(327));
    if (e !== null) {
      if (e === t.current) throw Error(r(177));
      if (
        ((n = e.lanes | e.childLanes),
        (n |= qi),
        ph(t, l, n, c, f, d),
        t === St && ((at = St = null), (it = 0)),
        (Sa = e),
        (dl = t),
        (ba = l),
        (Lc = n),
        (Qc = u),
        (Ds = a),
        (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
          ? ((t.callbackNode = null),
            (t.callbackPriority = 0),
            Km(Bu, function () {
              return (Zs(), null);
            }))
          : ((t.callbackNode = null), (t.callbackPriority = 0)),
        (a = (e.flags & 13878) !== 0),
        (e.subtreeFlags & 13878) !== 0 || a)
      ) {
        ((a = D.T), (D.T = null), (u = j.p), (j.p = 2), (c = st), (st |= 4));
        try {
          Bm(t, e, l);
        } finally {
          ((st = c), (j.p = u), (D.T = a));
        }
      }
      ((Xt = 1), Gs(), Xs(), Ls());
    }
  }
  function Gs() {
    if (Xt === 1) {
      Xt = 0;
      var t = dl,
        e = Sa,
        l = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || l) {
        ((l = D.T), (D.T = null));
        var a = j.p;
        j.p = 2;
        var u = st;
        st |= 4;
        try {
          Es(e, t);
          var n = uf,
            c = Or(t.containerInfo),
            f = n.focusedElem,
            d = n.selectionRange;
          if (
            c !== f &&
            f &&
            f.ownerDocument &&
            Mr(f.ownerDocument.documentElement, f)
          ) {
            if (d !== null && Ui(f)) {
              var T = d.start,
                z = d.end;
              if ((z === void 0 && (z = T), 'selectionStart' in f))
                ((f.selectionStart = T),
                  (f.selectionEnd = Math.min(z, f.value.length)));
              else {
                var U = f.ownerDocument || document,
                  A = (U && U.defaultView) || window;
                if (A.getSelection) {
                  var M = A.getSelection(),
                    P = f.textContent.length,
                    $ = Math.min(d.start, P),
                    vt = d.end === void 0 ? $ : Math.min(d.end, P);
                  !M.extend && $ > vt && ((c = vt), (vt = $), ($ = c));
                  var S = Ar(f, $),
                    y = Ar(f, vt);
                  if (
                    S &&
                    y &&
                    (M.rangeCount !== 1 ||
                      M.anchorNode !== S.node ||
                      M.anchorOffset !== S.offset ||
                      M.focusNode !== y.node ||
                      M.focusOffset !== y.offset)
                  ) {
                    var p = U.createRange();
                    (p.setStart(S.node, S.offset),
                      M.removeAllRanges(),
                      $ > vt
                        ? (M.addRange(p), M.extend(y.node, y.offset))
                        : (p.setEnd(y.node, y.offset), M.addRange(p)));
                  }
                }
              }
            }
            for (U = [], M = f; (M = M.parentNode); )
              M.nodeType === 1 &&
                U.push({ element: M, left: M.scrollLeft, top: M.scrollTop });
            for (
              typeof f.focus == 'function' && f.focus(), f = 0;
              f < U.length;
              f++
            ) {
              var x = U[f];
              ((x.element.scrollLeft = x.left), (x.element.scrollTop = x.top));
            }
          }
          ((Zn = !!af), (uf = af = null));
        } finally {
          ((st = u), (j.p = a), (D.T = l));
        }
      }
      ((t.current = e), (Xt = 2));
    }
  }
  function Xs() {
    if (Xt === 2) {
      Xt = 0;
      var t = dl,
        e = Sa,
        l = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || l) {
        ((l = D.T), (D.T = null));
        var a = j.p;
        j.p = 2;
        var u = st;
        st |= 4;
        try {
          gs(t, e.alternate, e);
        } finally {
          ((st = u), (j.p = a), (D.T = l));
        }
      }
      Xt = 3;
    }
  }
  function Ls() {
    if (Xt === 4 || Xt === 3) {
      ((Xt = 0), sh());
      var t = dl,
        e = Sa,
        l = ba,
        a = Ds;
      (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
        ? (Xt = 5)
        : ((Xt = 0), (Sa = dl = null), Qs(t, t.pendingLanes));
      var u = t.pendingLanes;
      if (
        (u === 0 && (sl = null),
        oi(l),
        (e = e.stateNode),
        ee && typeof ee.onCommitFiberRoot == 'function')
      )
        try {
          ee.onCommitFiberRoot(_a, e, void 0, (e.current.flags & 128) === 128);
        } catch {}
      if (a !== null) {
        ((e = D.T), (u = j.p), (j.p = 2), (D.T = null));
        try {
          for (var n = t.onRecoverableError, c = 0; c < a.length; c++) {
            var f = a[c];
            n(f.value, { componentStack: f.stack });
          }
        } finally {
          ((D.T = e), (j.p = u));
        }
      }
      ((ba & 3) !== 0 && Un(),
        De(t),
        (u = t.pendingLanes),
        (l & 4194090) !== 0 && (u & 42) !== 0
          ? t === Zc
            ? hu++
            : ((hu = 0), (Zc = t))
          : (hu = 0),
        mu(0));
    }
  }
  function Qs(t, e) {
    (t.pooledCacheLanes &= e) === 0 &&
      ((e = t.pooledCache), e != null && ((t.pooledCache = null), Ja(e)));
  }
  function Un(t) {
    return (Gs(), Xs(), Ls(), Zs());
  }
  function Zs() {
    if (Xt !== 5) return !1;
    var t = dl,
      e = Lc;
    Lc = 0;
    var l = oi(ba),
      a = D.T,
      u = j.p;
    try {
      ((j.p = 32 > l ? 32 : l), (D.T = null), (l = Qc), (Qc = null));
      var n = dl,
        c = ba;
      if (((Xt = 0), (Sa = dl = null), (ba = 0), (st & 6) !== 0))
        throw Error(r(331));
      var f = st;
      if (
        ((st |= 4),
        Os(n.current),
        Rs(n, n.current, c, l),
        (st = f),
        mu(0, !1),
        ee && typeof ee.onPostCommitFiberRoot == 'function')
      )
        try {
          ee.onPostCommitFiberRoot(_a, n);
        } catch {}
      return !0;
    } finally {
      ((j.p = u), (D.T = a), Qs(t, e));
    }
  }
  function Vs(t, e, l) {
    ((e = he(l, e)),
      (e = Ec(t.stateNode, e, 2)),
      (t = ll(t, e, 2)),
      t !== null && (Ua(t, 2), De(t)));
  }
  function gt(t, e, l) {
    if (t.tag === 3) Vs(t, t, l);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          Vs(e, t, l);
          break;
        } else if (e.tag === 1) {
          var a = e.stateNode;
          if (
            typeof e.type.getDerivedStateFromError == 'function' ||
            (typeof a.componentDidCatch == 'function' &&
              (sl === null || !sl.has(a)))
          ) {
            ((t = he(l, t)),
              (l = $o(2)),
              (a = ll(e, l, 2)),
              a !== null && (ko(l, a, e, t), Ua(a, 2), De(a)));
            break;
          }
        }
        e = e.return;
      }
  }
  function Jc(t, e, l) {
    var a = t.pingCache;
    if (a === null) {
      a = t.pingCache = new jm();
      var u = new Set();
      a.set(e, u);
    } else ((u = a.get(e)), u === void 0 && ((u = new Set()), a.set(e, u)));
    u.has(l) ||
      ((Yc = !0), u.add(l), (t = Zm.bind(null, t, e, l)), e.then(t, t));
  }
  function Zm(t, e, l) {
    var a = t.pingCache;
    (a !== null && a.delete(e),
      (t.pingedLanes |= t.suspendedLanes & l),
      (t.warmLanes &= ~l),
      St === t &&
        (it & l) === l &&
        (Mt === 4 || (Mt === 3 && (it & 62914560) === it && 300 > Re() - Xc)
          ? (st & 2) === 0 && pa(t, 0)
          : (jc |= l),
        ga === it && (ga = 0)),
      De(t));
  }
  function ws(t, e) {
    (e === 0 && (e = Xf()), (t = la(t, e)), t !== null && (Ua(t, e), De(t)));
  }
  function Vm(t) {
    var e = t.memoizedState,
      l = 0;
    (e !== null && (l = e.retryLane), ws(t, l));
  }
  function wm(t, e) {
    var l = 0;
    switch (t.tag) {
      case 13:
        var a = t.stateNode,
          u = t.memoizedState;
        u !== null && (l = u.retryLane);
        break;
      case 19:
        a = t.stateNode;
        break;
      case 22:
        a = t.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    (a !== null && a.delete(e), ws(t, l));
  }
  function Km(t, e) {
    return ii(t, e);
  }
  var Nn = null,
    Ta = null,
    $c = !1,
    Hn = !1,
    kc = !1,
    Xl = 0;
  function De(t) {
    (t !== Ta &&
      t.next === null &&
      (Ta === null ? (Nn = Ta = t) : (Ta = Ta.next = t)),
      (Hn = !0),
      $c || (($c = !0), $m()));
  }
  function mu(t, e) {
    if (!kc && Hn) {
      kc = !0;
      do
        for (var l = !1, a = Nn; a !== null; ) {
          if (t !== 0) {
            var u = a.pendingLanes;
            if (u === 0) var n = 0;
            else {
              var c = a.suspendedLanes,
                f = a.pingedLanes;
              ((n = (1 << (31 - le(42 | t) + 1)) - 1),
                (n &= u & ~(c & ~f)),
                (n = n & 201326741 ? (n & 201326741) | 1 : n ? n | 2 : 0));
            }
            n !== 0 && ((l = !0), ks(a, n));
          } else
            ((n = it),
              (n = ju(
                a,
                a === St ? n : 0,
                a.cancelPendingCommit !== null || a.timeoutHandle !== -1
              )),
              (n & 3) === 0 || xa(a, n) || ((l = !0), ks(a, n)));
          a = a.next;
        }
      while (l);
      kc = !1;
    }
  }
  function Jm() {
    Ks();
  }
  function Ks() {
    Hn = $c = !1;
    var t = 0;
    Xl !== 0 && (l0() && (t = Xl), (Xl = 0));
    for (var e = Re(), l = null, a = Nn; a !== null; ) {
      var u = a.next,
        n = Js(a, e);
      (n === 0
        ? ((a.next = null),
          l === null ? (Nn = u) : (l.next = u),
          u === null && (Ta = l))
        : ((l = a), (t !== 0 || (n & 3) !== 0) && (Hn = !0)),
        (a = u));
    }
    mu(t);
  }
  function Js(t, e) {
    for (
      var l = t.suspendedLanes,
        a = t.pingedLanes,
        u = t.expirationTimes,
        n = t.pendingLanes & -62914561;
      0 < n;

    ) {
      var c = 31 - le(n),
        f = 1 << c,
        d = u[c];
      (d === -1
        ? ((f & l) === 0 || (f & a) !== 0) && (u[c] = bh(f, e))
        : d <= e && (t.expiredLanes |= f),
        (n &= ~f));
    }
    if (
      ((e = St),
      (l = it),
      (l = ju(
        t,
        t === e ? l : 0,
        t.cancelPendingCommit !== null || t.timeoutHandle !== -1
      )),
      (a = t.callbackNode),
      l === 0 ||
        (t === e && (dt === 2 || dt === 9)) ||
        t.cancelPendingCommit !== null)
    )
      return (
        a !== null && a !== null && ci(a),
        (t.callbackNode = null),
        (t.callbackPriority = 0)
      );
    if ((l & 3) === 0 || xa(t, l)) {
      if (((e = l & -l), e === t.callbackPriority)) return e;
      switch ((a !== null && ci(a), oi(l))) {
        case 2:
        case 8:
          l = Yf;
          break;
        case 32:
          l = Bu;
          break;
        case 268435456:
          l = jf;
          break;
        default:
          l = Bu;
      }
      return (
        (a = $s.bind(null, t)),
        (l = ii(l, a)),
        (t.callbackPriority = e),
        (t.callbackNode = l),
        e
      );
    }
    return (
      a !== null && a !== null && ci(a),
      (t.callbackPriority = 2),
      (t.callbackNode = null),
      2
    );
  }
  function $s(t, e) {
    if (Xt !== 0 && Xt !== 5)
      return ((t.callbackNode = null), (t.callbackPriority = 0), null);
    var l = t.callbackNode;
    if (Un() && t.callbackNode !== l) return null;
    var a = it;
    return (
      (a = ju(
        t,
        t === St ? a : 0,
        t.cancelPendingCommit !== null || t.timeoutHandle !== -1
      )),
      a === 0
        ? null
        : (xs(t, a, e),
          Js(t, Re()),
          t.callbackNode != null && t.callbackNode === l
            ? $s.bind(null, t)
            : null)
    );
  }
  function ks(t, e) {
    if (Un()) return null;
    xs(t, e, !0);
  }
  function $m() {
    u0(function () {
      (st & 6) !== 0 ? ii(qf, Jm) : Ks();
    });
  }
  function Wc() {
    return (Xl === 0 && (Xl = Gf()), Xl);
  }
  function Ws(t) {
    return t == null || typeof t == 'symbol' || typeof t == 'boolean'
      ? null
      : typeof t == 'function'
        ? t
        : Zu('' + t);
  }
  function Fs(t, e) {
    var l = e.ownerDocument.createElement('input');
    return (
      (l.name = e.name),
      (l.value = e.value),
      t.id && l.setAttribute('form', t.id),
      e.parentNode.insertBefore(l, e),
      (t = new FormData(t)),
      l.parentNode.removeChild(l),
      t
    );
  }
  function km(t, e, l, a, u) {
    if (e === 'submit' && l && l.stateNode === u) {
      var n = Ws((u[$t] || null).action),
        c = a.submitter;
      c &&
        ((e = (e = c[$t] || null)
          ? Ws(e.formAction)
          : c.getAttribute('formAction')),
        e !== null && ((n = e), (c = null)));
      var f = new Ju('action', 'action', null, a, u);
      t.push({
        event: f,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (a.defaultPrevented) {
                if (Xl !== 0) {
                  var d = c ? Fs(u, c) : new FormData(u);
                  yc(
                    l,
                    { pending: !0, data: d, method: u.method, action: n },
                    null,
                    d
                  );
                }
              } else
                typeof n == 'function' &&
                  (f.preventDefault(),
                  (d = c ? Fs(u, c) : new FormData(u)),
                  yc(
                    l,
                    { pending: !0, data: d, method: u.method, action: n },
                    n,
                    d
                  ));
            },
            currentTarget: u,
          },
        ],
      });
    }
  }
  for (var Fc = 0; Fc < Bi.length; Fc++) {
    var Pc = Bi[Fc],
      Wm = Pc.toLowerCase(),
      Fm = Pc[0].toUpperCase() + Pc.slice(1);
    pe(Wm, 'on' + Fm);
  }
  (pe(_r, 'onAnimationEnd'),
    pe(xr, 'onAnimationIteration'),
    pe(Ur, 'onAnimationStart'),
    pe('dblclick', 'onDoubleClick'),
    pe('focusin', 'onFocus'),
    pe('focusout', 'onBlur'),
    pe(mm, 'onTransitionRun'),
    pe(vm, 'onTransitionStart'),
    pe(ym, 'onTransitionCancel'),
    pe(Nr, 'onTransitionEnd'),
    Kl('onMouseEnter', ['mouseout', 'mouseover']),
    Kl('onMouseLeave', ['mouseout', 'mouseover']),
    Kl('onPointerEnter', ['pointerout', 'pointerover']),
    Kl('onPointerLeave', ['pointerout', 'pointerover']),
    Al(
      'onChange',
      'change click focusin focusout input keydown keyup selectionchange'.split(
        ' '
      )
    ),
    Al(
      'onSelect',
      'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
        ' '
      )
    ),
    Al('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']),
    Al(
      'onCompositionEnd',
      'compositionend focusout keydown keypress keyup mousedown'.split(' ')
    ),
    Al(
      'onCompositionStart',
      'compositionstart focusout keydown keypress keyup mousedown'.split(' ')
    ),
    Al(
      'onCompositionUpdate',
      'compositionupdate focusout keydown keypress keyup mousedown'.split(' ')
    ));
  var vu =
      'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
        ' '
      ),
    Pm = new Set(
      'beforetoggle cancel close invalid load scroll scrollend toggle'
        .split(' ')
        .concat(vu)
    );
  function Ps(t, e) {
    e = (e & 4) !== 0;
    for (var l = 0; l < t.length; l++) {
      var a = t[l],
        u = a.event;
      a = a.listeners;
      t: {
        var n = void 0;
        if (e)
          for (var c = a.length - 1; 0 <= c; c--) {
            var f = a[c],
              d = f.instance,
              T = f.currentTarget;
            if (((f = f.listener), d !== n && u.isPropagationStopped()))
              break t;
            ((n = f), (u.currentTarget = T));
            try {
              n(u);
            } catch (z) {
              pn(z);
            }
            ((u.currentTarget = null), (n = d));
          }
        else
          for (c = 0; c < a.length; c++) {
            if (
              ((f = a[c]),
              (d = f.instance),
              (T = f.currentTarget),
              (f = f.listener),
              d !== n && u.isPropagationStopped())
            )
              break t;
            ((n = f), (u.currentTarget = T));
            try {
              n(u);
            } catch (z) {
              pn(z);
            }
            ((u.currentTarget = null), (n = d));
          }
      }
    }
  }
  function ut(t, e) {
    var l = e[si];
    l === void 0 && (l = e[si] = new Set());
    var a = t + '__bubble';
    l.has(a) || (Is(e, t, 2, !1), l.add(a));
  }
  function Ic(t, e, l) {
    var a = 0;
    (e && (a |= 4), Is(l, t, a, e));
  }
  var Cn = '_reactListening' + Math.random().toString(36).slice(2);
  function tf(t) {
    if (!t[Cn]) {
      ((t[Cn] = !0),
        wf.forEach(function (l) {
          l !== 'selectionchange' && (Pm.has(l) || Ic(l, !1, t), Ic(l, !0, t));
        }));
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Cn] || ((e[Cn] = !0), Ic('selectionchange', !1, e));
    }
  }
  function Is(t, e, l, a) {
    switch (Rd(e)) {
      case 2:
        var u = M0;
        break;
      case 8:
        u = O0;
        break;
      default:
        u = vf;
    }
    ((l = u.bind(null, e, l, t)),
      (u = void 0),
      !Ti ||
        (e !== 'touchstart' && e !== 'touchmove' && e !== 'wheel') ||
        (u = !0),
      a
        ? u !== void 0
          ? t.addEventListener(e, l, { capture: !0, passive: u })
          : t.addEventListener(e, l, !0)
        : u !== void 0
          ? t.addEventListener(e, l, { passive: u })
          : t.addEventListener(e, l, !1));
  }
  function ef(t, e, l, a, u) {
    var n = a;
    if ((e & 1) === 0 && (e & 2) === 0 && a !== null)
      t: for (;;) {
        if (a === null) return;
        var c = a.tag;
        if (c === 3 || c === 4) {
          var f = a.stateNode.containerInfo;
          if (f === u) break;
          if (c === 4)
            for (c = a.return; c !== null; ) {
              var d = c.tag;
              if ((d === 3 || d === 4) && c.stateNode.containerInfo === u)
                return;
              c = c.return;
            }
          for (; f !== null; ) {
            if (((c = Zl(f)), c === null)) return;
            if (((d = c.tag), d === 5 || d === 6 || d === 26 || d === 27)) {
              a = n = c;
              continue t;
            }
            f = f.parentNode;
          }
        }
        a = a.return;
      }
    nr(function () {
      var T = n,
        z = pi(l),
        U = [];
      t: {
        var A = Hr.get(t);
        if (A !== void 0) {
          var M = Ju,
            P = t;
          switch (t) {
            case 'keypress':
              if (wu(l) === 0) break t;
            case 'keydown':
            case 'keyup':
              M = Kh;
              break;
            case 'focusin':
              ((P = 'focus'), (M = Oi));
              break;
            case 'focusout':
              ((P = 'blur'), (M = Oi));
              break;
            case 'beforeblur':
            case 'afterblur':
              M = Oi;
              break;
            case 'click':
              if (l.button === 2) break t;
            case 'auxclick':
            case 'dblclick':
            case 'mousedown':
            case 'mousemove':
            case 'mouseup':
            case 'mouseout':
            case 'mouseover':
            case 'contextmenu':
              M = fr;
              break;
            case 'drag':
            case 'dragend':
            case 'dragenter':
            case 'dragexit':
            case 'dragleave':
            case 'dragover':
            case 'dragstart':
            case 'drop':
              M = Ch;
              break;
            case 'touchcancel':
            case 'touchend':
            case 'touchmove':
            case 'touchstart':
              M = kh;
              break;
            case _r:
            case xr:
            case Ur:
              M = Yh;
              break;
            case Nr:
              M = Fh;
              break;
            case 'scroll':
            case 'scrollend':
              M = Nh;
              break;
            case 'wheel':
              M = Ih;
              break;
            case 'copy':
            case 'cut':
            case 'paste':
              M = Gh;
              break;
            case 'gotpointercapture':
            case 'lostpointercapture':
            case 'pointercancel':
            case 'pointerdown':
            case 'pointermove':
            case 'pointerout':
            case 'pointerover':
            case 'pointerup':
              M = or;
              break;
            case 'toggle':
            case 'beforetoggle':
              M = em;
          }
          var $ = (e & 4) !== 0,
            vt = !$ && (t === 'scroll' || t === 'scrollend'),
            S = $ ? (A !== null ? A + 'Capture' : null) : A;
          $ = [];
          for (var y = T, p; y !== null; ) {
            var x = y;
            if (
              ((p = x.stateNode),
              (x = x.tag),
              (x !== 5 && x !== 26 && x !== 27) ||
                p === null ||
                S === null ||
                ((x = Ca(y, S)), x != null && $.push(yu(y, x, p))),
              vt)
            )
              break;
            y = y.return;
          }
          0 < $.length &&
            ((A = new M(A, P, null, l, z)), U.push({ event: A, listeners: $ }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (
            ((A = t === 'mouseover' || t === 'pointerover'),
            (M = t === 'mouseout' || t === 'pointerout'),
            A &&
              l !== bi &&
              (P = l.relatedTarget || l.fromElement) &&
              (Zl(P) || P[Ql]))
          )
            break t;
          if (
            (M || A) &&
            ((A =
              z.window === z
                ? z
                : (A = z.ownerDocument)
                  ? A.defaultView || A.parentWindow
                  : window),
            M
              ? ((P = l.relatedTarget || l.toElement),
                (M = T),
                (P = P ? Zl(P) : null),
                P !== null &&
                  ((vt = g(P)),
                  ($ = P.tag),
                  P !== vt || ($ !== 5 && $ !== 27 && $ !== 6)) &&
                  (P = null))
              : ((M = null), (P = T)),
            M !== P)
          ) {
            if (
              (($ = fr),
              (x = 'onMouseLeave'),
              (S = 'onMouseEnter'),
              (y = 'mouse'),
              (t === 'pointerout' || t === 'pointerover') &&
                (($ = or),
                (x = 'onPointerLeave'),
                (S = 'onPointerEnter'),
                (y = 'pointer')),
              (vt = M == null ? A : Ha(M)),
              (p = P == null ? A : Ha(P)),
              (A = new $(x, y + 'leave', M, l, z)),
              (A.target = vt),
              (A.relatedTarget = p),
              (x = null),
              Zl(z) === T &&
                (($ = new $(S, y + 'enter', P, l, z)),
                ($.target = p),
                ($.relatedTarget = vt),
                (x = $)),
              (vt = x),
              M && P)
            )
              e: {
                for ($ = M, S = P, y = 0, p = $; p; p = Ra(p)) y++;
                for (p = 0, x = S; x; x = Ra(x)) p++;
                for (; 0 < y - p; ) (($ = Ra($)), y--);
                for (; 0 < p - y; ) ((S = Ra(S)), p--);
                for (; y--; ) {
                  if ($ === S || (S !== null && $ === S.alternate)) break e;
                  (($ = Ra($)), (S = Ra(S)));
                }
                $ = null;
              }
            else $ = null;
            (M !== null && td(U, A, M, $, !1),
              P !== null && vt !== null && td(U, vt, P, $, !0));
          }
        }
        t: {
          if (
            ((A = T ? Ha(T) : window),
            (M = A.nodeName && A.nodeName.toLowerCase()),
            M === 'select' || (M === 'input' && A.type === 'file'))
          )
            var Q = Sr;
          else if (yr(A))
            if (br) Q = sm;
            else {
              Q = rm;
              var lt = fm;
            }
          else
            ((M = A.nodeName),
              !M ||
              M.toLowerCase() !== 'input' ||
              (A.type !== 'checkbox' && A.type !== 'radio')
                ? T && Si(T.elementType) && (Q = Sr)
                : (Q = om));
          if (Q && (Q = Q(t, T))) {
            gr(U, Q, l, z);
            break t;
          }
          (lt && lt(t, A, T),
            t === 'focusout' &&
              T &&
              A.type === 'number' &&
              T.memoizedProps.value != null &&
              gi(A, 'number', A.value));
        }
        switch (((lt = T ? Ha(T) : window), t)) {
          case 'focusin':
            (yr(lt) || lt.contentEditable === 'true') &&
              ((Il = lt), (Ni = T), (Qa = null));
            break;
          case 'focusout':
            Qa = Ni = Il = null;
            break;
          case 'mousedown':
            Hi = !0;
            break;
          case 'contextmenu':
          case 'mouseup':
          case 'dragend':
            ((Hi = !1), zr(U, l, z));
            break;
          case 'selectionchange':
            if (hm) break;
          case 'keydown':
          case 'keyup':
            zr(U, l, z);
        }
        var Z;
        if (Di)
          t: {
            switch (t) {
              case 'compositionstart':
                var k = 'onCompositionStart';
                break t;
              case 'compositionend':
                k = 'onCompositionEnd';
                break t;
              case 'compositionupdate':
                k = 'onCompositionUpdate';
                break t;
            }
            k = void 0;
          }
        else
          Pl
            ? mr(t, l) && (k = 'onCompositionEnd')
            : t === 'keydown' &&
              l.keyCode === 229 &&
              (k = 'onCompositionStart');
        (k &&
          (sr &&
            l.locale !== 'ko' &&
            (Pl || k !== 'onCompositionStart'
              ? k === 'onCompositionEnd' && Pl && (Z = ir())
              : ((Pe = z),
                (Ri = 'value' in Pe ? Pe.value : Pe.textContent),
                (Pl = !0))),
          (lt = Bn(T, k)),
          0 < lt.length &&
            ((k = new rr(k, t, null, l, z)),
            U.push({ event: k, listeners: lt }),
            Z ? (k.data = Z) : ((Z = vr(l)), Z !== null && (k.data = Z)))),
          (Z = am ? um(t, l) : nm(t, l)) &&
            ((k = Bn(T, 'onBeforeInput')),
            0 < k.length &&
              ((lt = new rr('onBeforeInput', 'beforeinput', null, l, z)),
              U.push({ event: lt, listeners: k }),
              (lt.data = Z))),
          km(U, t, T, l, z));
      }
      Ps(U, e);
    });
  }
  function yu(t, e, l) {
    return { instance: t, listener: e, currentTarget: l };
  }
  function Bn(t, e) {
    for (var l = e + 'Capture', a = []; t !== null; ) {
      var u = t,
        n = u.stateNode;
      if (
        ((u = u.tag),
        (u !== 5 && u !== 26 && u !== 27) ||
          n === null ||
          ((u = Ca(t, l)),
          u != null && a.unshift(yu(t, u, n)),
          (u = Ca(t, e)),
          u != null && a.push(yu(t, u, n))),
        t.tag === 3)
      )
        return a;
      t = t.return;
    }
    return [];
  }
  function Ra(t) {
    if (t === null) return null;
    do t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function td(t, e, l, a, u) {
    for (var n = e._reactName, c = []; l !== null && l !== a; ) {
      var f = l,
        d = f.alternate,
        T = f.stateNode;
      if (((f = f.tag), d !== null && d === a)) break;
      ((f !== 5 && f !== 26 && f !== 27) ||
        T === null ||
        ((d = T),
        u
          ? ((T = Ca(l, n)), T != null && c.unshift(yu(l, T, d)))
          : u || ((T = Ca(l, n)), T != null && c.push(yu(l, T, d)))),
        (l = l.return));
    }
    c.length !== 0 && t.push({ event: e, listeners: c });
  }
  var Im = /\r\n?/g,
    t0 = /\u0000|\uFFFD/g;
  function ed(t) {
    return (typeof t == 'string' ? t : '' + t)
      .replace(
        Im,
        `
`
      )
      .replace(t0, '');
  }
  function ld(t, e) {
    return ((e = ed(e)), ed(t) === e);
  }
  function qn() {}
  function mt(t, e, l, a, u, n) {
    switch (l) {
      case 'children':
        typeof a == 'string'
          ? e === 'body' || (e === 'textarea' && a === '') || kl(t, a)
          : (typeof a == 'number' || typeof a == 'bigint') &&
            e !== 'body' &&
            kl(t, '' + a);
        break;
      case 'className':
        Xu(t, 'class', a);
        break;
      case 'tabIndex':
        Xu(t, 'tabindex', a);
        break;
      case 'dir':
      case 'role':
      case 'viewBox':
      case 'width':
      case 'height':
        Xu(t, l, a);
        break;
      case 'style':
        ar(t, a, n);
        break;
      case 'data':
        if (e !== 'object') {
          Xu(t, 'data', a);
          break;
        }
      case 'src':
      case 'href':
        if (a === '' && (e !== 'a' || l !== 'href')) {
          t.removeAttribute(l);
          break;
        }
        if (
          a == null ||
          typeof a == 'function' ||
          typeof a == 'symbol' ||
          typeof a == 'boolean'
        ) {
          t.removeAttribute(l);
          break;
        }
        ((a = Zu('' + a)), t.setAttribute(l, a));
        break;
      case 'action':
      case 'formAction':
        if (typeof a == 'function') {
          t.setAttribute(
            l,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof n == 'function' &&
            (l === 'formAction'
              ? (e !== 'input' && mt(t, e, 'name', u.name, u, null),
                mt(t, e, 'formEncType', u.formEncType, u, null),
                mt(t, e, 'formMethod', u.formMethod, u, null),
                mt(t, e, 'formTarget', u.formTarget, u, null))
              : (mt(t, e, 'encType', u.encType, u, null),
                mt(t, e, 'method', u.method, u, null),
                mt(t, e, 'target', u.target, u, null)));
        if (a == null || typeof a == 'symbol' || typeof a == 'boolean') {
          t.removeAttribute(l);
          break;
        }
        ((a = Zu('' + a)), t.setAttribute(l, a));
        break;
      case 'onClick':
        a != null && (t.onclick = qn);
        break;
      case 'onScroll':
        a != null && ut('scroll', t);
        break;
      case 'onScrollEnd':
        a != null && ut('scrollend', t);
        break;
      case 'dangerouslySetInnerHTML':
        if (a != null) {
          if (typeof a != 'object' || !('__html' in a)) throw Error(r(61));
          if (((l = a.__html), l != null)) {
            if (u.children != null) throw Error(r(60));
            t.innerHTML = l;
          }
        }
        break;
      case 'multiple':
        t.multiple = a && typeof a != 'function' && typeof a != 'symbol';
        break;
      case 'muted':
        t.muted = a && typeof a != 'function' && typeof a != 'symbol';
        break;
      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'defaultValue':
      case 'defaultChecked':
      case 'innerHTML':
      case 'ref':
        break;
      case 'autoFocus':
        break;
      case 'xlinkHref':
        if (
          a == null ||
          typeof a == 'function' ||
          typeof a == 'boolean' ||
          typeof a == 'symbol'
        ) {
          t.removeAttribute('xlink:href');
          break;
        }
        ((l = Zu('' + a)),
          t.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', l));
        break;
      case 'contentEditable':
      case 'spellCheck':
      case 'draggable':
      case 'value':
      case 'autoReverse':
      case 'externalResourcesRequired':
      case 'focusable':
      case 'preserveAlpha':
        a != null && typeof a != 'function' && typeof a != 'symbol'
          ? t.setAttribute(l, '' + a)
          : t.removeAttribute(l);
        break;
      case 'inert':
      case 'allowFullScreen':
      case 'async':
      case 'autoPlay':
      case 'controls':
      case 'default':
      case 'defer':
      case 'disabled':
      case 'disablePictureInPicture':
      case 'disableRemotePlayback':
      case 'formNoValidate':
      case 'hidden':
      case 'loop':
      case 'noModule':
      case 'noValidate':
      case 'open':
      case 'playsInline':
      case 'readOnly':
      case 'required':
      case 'reversed':
      case 'scoped':
      case 'seamless':
      case 'itemScope':
        a && typeof a != 'function' && typeof a != 'symbol'
          ? t.setAttribute(l, '')
          : t.removeAttribute(l);
        break;
      case 'capture':
      case 'download':
        a === !0
          ? t.setAttribute(l, '')
          : a !== !1 &&
              a != null &&
              typeof a != 'function' &&
              typeof a != 'symbol'
            ? t.setAttribute(l, a)
            : t.removeAttribute(l);
        break;
      case 'cols':
      case 'rows':
      case 'size':
      case 'span':
        a != null &&
        typeof a != 'function' &&
        typeof a != 'symbol' &&
        !isNaN(a) &&
        1 <= a
          ? t.setAttribute(l, a)
          : t.removeAttribute(l);
        break;
      case 'rowSpan':
      case 'start':
        a == null || typeof a == 'function' || typeof a == 'symbol' || isNaN(a)
          ? t.removeAttribute(l)
          : t.setAttribute(l, a);
        break;
      case 'popover':
        (ut('beforetoggle', t), ut('toggle', t), Gu(t, 'popover', a));
        break;
      case 'xlinkActuate':
        Ue(t, 'http://www.w3.org/1999/xlink', 'xlink:actuate', a);
        break;
      case 'xlinkArcrole':
        Ue(t, 'http://www.w3.org/1999/xlink', 'xlink:arcrole', a);
        break;
      case 'xlinkRole':
        Ue(t, 'http://www.w3.org/1999/xlink', 'xlink:role', a);
        break;
      case 'xlinkShow':
        Ue(t, 'http://www.w3.org/1999/xlink', 'xlink:show', a);
        break;
      case 'xlinkTitle':
        Ue(t, 'http://www.w3.org/1999/xlink', 'xlink:title', a);
        break;
      case 'xlinkType':
        Ue(t, 'http://www.w3.org/1999/xlink', 'xlink:type', a);
        break;
      case 'xmlBase':
        Ue(t, 'http://www.w3.org/XML/1998/namespace', 'xml:base', a);
        break;
      case 'xmlLang':
        Ue(t, 'http://www.w3.org/XML/1998/namespace', 'xml:lang', a);
        break;
      case 'xmlSpace':
        Ue(t, 'http://www.w3.org/XML/1998/namespace', 'xml:space', a);
        break;
      case 'is':
        Gu(t, 'is', a);
        break;
      case 'innerText':
      case 'textContent':
        break;
      default:
        (!(2 < l.length) ||
          (l[0] !== 'o' && l[0] !== 'O') ||
          (l[1] !== 'n' && l[1] !== 'N')) &&
          ((l = xh.get(l) || l), Gu(t, l, a));
    }
  }
  function lf(t, e, l, a, u, n) {
    switch (l) {
      case 'style':
        ar(t, a, n);
        break;
      case 'dangerouslySetInnerHTML':
        if (a != null) {
          if (typeof a != 'object' || !('__html' in a)) throw Error(r(61));
          if (((l = a.__html), l != null)) {
            if (u.children != null) throw Error(r(60));
            t.innerHTML = l;
          }
        }
        break;
      case 'children':
        typeof a == 'string'
          ? kl(t, a)
          : (typeof a == 'number' || typeof a == 'bigint') && kl(t, '' + a);
        break;
      case 'onScroll':
        a != null && ut('scroll', t);
        break;
      case 'onScrollEnd':
        a != null && ut('scrollend', t);
        break;
      case 'onClick':
        a != null && (t.onclick = qn);
        break;
      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'innerHTML':
      case 'ref':
        break;
      case 'innerText':
      case 'textContent':
        break;
      default:
        if (!Kf.hasOwnProperty(l))
          t: {
            if (
              l[0] === 'o' &&
              l[1] === 'n' &&
              ((u = l.endsWith('Capture')),
              (e = l.slice(2, u ? l.length - 7 : void 0)),
              (n = t[$t] || null),
              (n = n != null ? n[l] : null),
              typeof n == 'function' && t.removeEventListener(e, n, u),
              typeof a == 'function')
            ) {
              (typeof n != 'function' &&
                n !== null &&
                (l in t
                  ? (t[l] = null)
                  : t.hasAttribute(l) && t.removeAttribute(l)),
                t.addEventListener(e, a, u));
              break t;
            }
            l in t
              ? (t[l] = a)
              : a === !0
                ? t.setAttribute(l, '')
                : Gu(t, l, a);
          }
    }
  }
  function Lt(t, e, l) {
    switch (e) {
      case 'div':
      case 'span':
      case 'svg':
      case 'path':
      case 'a':
      case 'g':
      case 'p':
      case 'li':
        break;
      case 'img':
        (ut('error', t), ut('load', t));
        var a = !1,
          u = !1,
          n;
        for (n in l)
          if (l.hasOwnProperty(n)) {
            var c = l[n];
            if (c != null)
              switch (n) {
                case 'src':
                  a = !0;
                  break;
                case 'srcSet':
                  u = !0;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  throw Error(r(137, e));
                default:
                  mt(t, e, n, c, l, null);
              }
          }
        (u && mt(t, e, 'srcSet', l.srcSet, l, null),
          a && mt(t, e, 'src', l.src, l, null));
        return;
      case 'input':
        ut('invalid', t);
        var f = (n = c = u = null),
          d = null,
          T = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var z = l[a];
            if (z != null)
              switch (a) {
                case 'name':
                  u = z;
                  break;
                case 'type':
                  c = z;
                  break;
                case 'checked':
                  d = z;
                  break;
                case 'defaultChecked':
                  T = z;
                  break;
                case 'value':
                  n = z;
                  break;
                case 'defaultValue':
                  f = z;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  if (z != null) throw Error(r(137, e));
                  break;
                default:
                  mt(t, e, a, z, l, null);
              }
          }
        (If(t, n, f, d, T, c, u, !1), Lu(t));
        return;
      case 'select':
        (ut('invalid', t), (a = c = n = null));
        for (u in l)
          if (l.hasOwnProperty(u) && ((f = l[u]), f != null))
            switch (u) {
              case 'value':
                n = f;
                break;
              case 'defaultValue':
                c = f;
                break;
              case 'multiple':
                a = f;
              default:
                mt(t, e, u, f, l, null);
            }
        ((e = n),
          (l = c),
          (t.multiple = !!a),
          e != null ? $l(t, !!a, e, !1) : l != null && $l(t, !!a, l, !0));
        return;
      case 'textarea':
        (ut('invalid', t), (n = u = a = null));
        for (c in l)
          if (l.hasOwnProperty(c) && ((f = l[c]), f != null))
            switch (c) {
              case 'value':
                a = f;
                break;
              case 'defaultValue':
                u = f;
                break;
              case 'children':
                n = f;
                break;
              case 'dangerouslySetInnerHTML':
                if (f != null) throw Error(r(91));
                break;
              default:
                mt(t, e, c, f, l, null);
            }
        (er(t, a, u, n), Lu(t));
        return;
      case 'option':
        for (d in l)
          if (l.hasOwnProperty(d) && ((a = l[d]), a != null))
            switch (d) {
              case 'selected':
                t.selected =
                  a && typeof a != 'function' && typeof a != 'symbol';
                break;
              default:
                mt(t, e, d, a, l, null);
            }
        return;
      case 'dialog':
        (ut('beforetoggle', t),
          ut('toggle', t),
          ut('cancel', t),
          ut('close', t));
        break;
      case 'iframe':
      case 'object':
        ut('load', t);
        break;
      case 'video':
      case 'audio':
        for (a = 0; a < vu.length; a++) ut(vu[a], t);
        break;
      case 'image':
        (ut('error', t), ut('load', t));
        break;
      case 'details':
        ut('toggle', t);
        break;
      case 'embed':
      case 'source':
      case 'link':
        (ut('error', t), ut('load', t));
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'hr':
      case 'keygen':
      case 'meta':
      case 'param':
      case 'track':
      case 'wbr':
      case 'menuitem':
        for (T in l)
          if (l.hasOwnProperty(T) && ((a = l[T]), a != null))
            switch (T) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                throw Error(r(137, e));
              default:
                mt(t, e, T, a, l, null);
            }
        return;
      default:
        if (Si(e)) {
          for (z in l)
            l.hasOwnProperty(z) &&
              ((a = l[z]), a !== void 0 && lf(t, e, z, a, l, void 0));
          return;
        }
    }
    for (f in l)
      l.hasOwnProperty(f) && ((a = l[f]), a != null && mt(t, e, f, a, l, null));
  }
  function e0(t, e, l, a) {
    switch (e) {
      case 'div':
      case 'span':
      case 'svg':
      case 'path':
      case 'a':
      case 'g':
      case 'p':
      case 'li':
        break;
      case 'input':
        var u = null,
          n = null,
          c = null,
          f = null,
          d = null,
          T = null,
          z = null;
        for (M in l) {
          var U = l[M];
          if (l.hasOwnProperty(M) && U != null)
            switch (M) {
              case 'checked':
                break;
              case 'value':
                break;
              case 'defaultValue':
                d = U;
              default:
                a.hasOwnProperty(M) || mt(t, e, M, null, a, U);
            }
        }
        for (var A in a) {
          var M = a[A];
          if (((U = l[A]), a.hasOwnProperty(A) && (M != null || U != null)))
            switch (A) {
              case 'type':
                n = M;
                break;
              case 'name':
                u = M;
                break;
              case 'checked':
                T = M;
                break;
              case 'defaultChecked':
                z = M;
                break;
              case 'value':
                c = M;
                break;
              case 'defaultValue':
                f = M;
                break;
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (M != null) throw Error(r(137, e));
                break;
              default:
                M !== U && mt(t, e, A, M, a, U);
            }
        }
        yi(t, c, f, d, T, z, n, u);
        return;
      case 'select':
        M = c = f = A = null;
        for (n in l)
          if (((d = l[n]), l.hasOwnProperty(n) && d != null))
            switch (n) {
              case 'value':
                break;
              case 'multiple':
                M = d;
              default:
                a.hasOwnProperty(n) || mt(t, e, n, null, a, d);
            }
        for (u in a)
          if (
            ((n = a[u]),
            (d = l[u]),
            a.hasOwnProperty(u) && (n != null || d != null))
          )
            switch (u) {
              case 'value':
                A = n;
                break;
              case 'defaultValue':
                f = n;
                break;
              case 'multiple':
                c = n;
              default:
                n !== d && mt(t, e, u, n, a, d);
            }
        ((e = f),
          (l = c),
          (a = M),
          A != null
            ? $l(t, !!l, A, !1)
            : !!a != !!l &&
              (e != null ? $l(t, !!l, e, !0) : $l(t, !!l, l ? [] : '', !1)));
        return;
      case 'textarea':
        M = A = null;
        for (f in l)
          if (
            ((u = l[f]),
            l.hasOwnProperty(f) && u != null && !a.hasOwnProperty(f))
          )
            switch (f) {
              case 'value':
                break;
              case 'children':
                break;
              default:
                mt(t, e, f, null, a, u);
            }
        for (c in a)
          if (
            ((u = a[c]),
            (n = l[c]),
            a.hasOwnProperty(c) && (u != null || n != null))
          )
            switch (c) {
              case 'value':
                A = u;
                break;
              case 'defaultValue':
                M = u;
                break;
              case 'children':
                break;
              case 'dangerouslySetInnerHTML':
                if (u != null) throw Error(r(91));
                break;
              default:
                u !== n && mt(t, e, c, u, a, n);
            }
        tr(t, A, M);
        return;
      case 'option':
        for (var P in l)
          if (
            ((A = l[P]),
            l.hasOwnProperty(P) && A != null && !a.hasOwnProperty(P))
          )
            switch (P) {
              case 'selected':
                t.selected = !1;
                break;
              default:
                mt(t, e, P, null, a, A);
            }
        for (d in a)
          if (
            ((A = a[d]),
            (M = l[d]),
            a.hasOwnProperty(d) && A !== M && (A != null || M != null))
          )
            switch (d) {
              case 'selected':
                t.selected =
                  A && typeof A != 'function' && typeof A != 'symbol';
                break;
              default:
                mt(t, e, d, A, a, M);
            }
        return;
      case 'img':
      case 'link':
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'embed':
      case 'hr':
      case 'keygen':
      case 'meta':
      case 'param':
      case 'source':
      case 'track':
      case 'wbr':
      case 'menuitem':
        for (var $ in l)
          ((A = l[$]),
            l.hasOwnProperty($) &&
              A != null &&
              !a.hasOwnProperty($) &&
              mt(t, e, $, null, a, A));
        for (T in a)
          if (
            ((A = a[T]),
            (M = l[T]),
            a.hasOwnProperty(T) && A !== M && (A != null || M != null))
          )
            switch (T) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (A != null) throw Error(r(137, e));
                break;
              default:
                mt(t, e, T, A, a, M);
            }
        return;
      default:
        if (Si(e)) {
          for (var vt in l)
            ((A = l[vt]),
              l.hasOwnProperty(vt) &&
                A !== void 0 &&
                !a.hasOwnProperty(vt) &&
                lf(t, e, vt, void 0, a, A));
          for (z in a)
            ((A = a[z]),
              (M = l[z]),
              !a.hasOwnProperty(z) ||
                A === M ||
                (A === void 0 && M === void 0) ||
                lf(t, e, z, A, a, M));
          return;
        }
    }
    for (var S in l)
      ((A = l[S]),
        l.hasOwnProperty(S) &&
          A != null &&
          !a.hasOwnProperty(S) &&
          mt(t, e, S, null, a, A));
    for (U in a)
      ((A = a[U]),
        (M = l[U]),
        !a.hasOwnProperty(U) ||
          A === M ||
          (A == null && M == null) ||
          mt(t, e, U, A, a, M));
  }
  var af = null,
    uf = null;
  function Yn(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function ad(t) {
    switch (t) {
      case 'http://www.w3.org/2000/svg':
        return 1;
      case 'http://www.w3.org/1998/Math/MathML':
        return 2;
      default:
        return 0;
    }
  }
  function ud(t, e) {
    if (t === 0)
      switch (e) {
        case 'svg':
          return 1;
        case 'math':
          return 2;
        default:
          return 0;
      }
    return t === 1 && e === 'foreignObject' ? 0 : t;
  }
  function nf(t, e) {
    return (
      t === 'textarea' ||
      t === 'noscript' ||
      typeof e.children == 'string' ||
      typeof e.children == 'number' ||
      typeof e.children == 'bigint' ||
      (typeof e.dangerouslySetInnerHTML == 'object' &&
        e.dangerouslySetInnerHTML !== null &&
        e.dangerouslySetInnerHTML.__html != null)
    );
  }
  var cf = null;
  function l0() {
    var t = window.event;
    return t && t.type === 'popstate'
      ? t === cf
        ? !1
        : ((cf = t), !0)
      : ((cf = null), !1);
  }
  var nd = typeof setTimeout == 'function' ? setTimeout : void 0,
    a0 = typeof clearTimeout == 'function' ? clearTimeout : void 0,
    id = typeof Promise == 'function' ? Promise : void 0,
    u0 =
      typeof queueMicrotask == 'function'
        ? queueMicrotask
        : typeof id < 'u'
          ? function (t) {
              return id.resolve(null).then(t).catch(n0);
            }
          : nd;
  function n0(t) {
    setTimeout(function () {
      throw t;
    });
  }
  function ml(t) {
    return t === 'head';
  }
  function cd(t, e) {
    var l = e,
      a = 0,
      u = 0;
    do {
      var n = l.nextSibling;
      if ((t.removeChild(l), n && n.nodeType === 8))
        if (((l = n.data), l === '/$')) {
          if (0 < a && 8 > a) {
            l = a;
            var c = t.ownerDocument;
            if ((l & 1 && gu(c.documentElement), l & 2 && gu(c.body), l & 4))
              for (l = c.head, gu(l), c = l.firstChild; c; ) {
                var f = c.nextSibling,
                  d = c.nodeName;
                (c[Na] ||
                  d === 'SCRIPT' ||
                  d === 'STYLE' ||
                  (d === 'LINK' && c.rel.toLowerCase() === 'stylesheet') ||
                  l.removeChild(c),
                  (c = f));
              }
          }
          if (u === 0) {
            (t.removeChild(n), Mu(e));
            return;
          }
          u--;
        } else
          l === '$' || l === '$?' || l === '$!'
            ? u++
            : (a = l.charCodeAt(0) - 48);
      else a = 0;
      l = n;
    } while (l);
    Mu(e);
  }
  function ff(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var l = e;
      switch (((e = e.nextSibling), l.nodeName)) {
        case 'HTML':
        case 'HEAD':
        case 'BODY':
          (ff(l), di(l));
          continue;
        case 'SCRIPT':
        case 'STYLE':
          continue;
        case 'LINK':
          if (l.rel.toLowerCase() === 'stylesheet') continue;
      }
      t.removeChild(l);
    }
  }
  function i0(t, e, l, a) {
    for (; t.nodeType === 1; ) {
      var u = l;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!a && (t.nodeName !== 'INPUT' || t.type !== 'hidden')) break;
      } else if (a) {
        if (!t[Na])
          switch (e) {
            case 'meta':
              if (!t.hasAttribute('itemprop')) break;
              return t;
            case 'link':
              if (
                ((n = t.getAttribute('rel')),
                n === 'stylesheet' && t.hasAttribute('data-precedence'))
              )
                break;
              if (
                n !== u.rel ||
                t.getAttribute('href') !==
                  (u.href == null || u.href === '' ? null : u.href) ||
                t.getAttribute('crossorigin') !==
                  (u.crossOrigin == null ? null : u.crossOrigin) ||
                t.getAttribute('title') !== (u.title == null ? null : u.title)
              )
                break;
              return t;
            case 'style':
              if (t.hasAttribute('data-precedence')) break;
              return t;
            case 'script':
              if (
                ((n = t.getAttribute('src')),
                (n !== (u.src == null ? null : u.src) ||
                  t.getAttribute('type') !== (u.type == null ? null : u.type) ||
                  t.getAttribute('crossorigin') !==
                    (u.crossOrigin == null ? null : u.crossOrigin)) &&
                  n &&
                  t.hasAttribute('async') &&
                  !t.hasAttribute('itemprop'))
              )
                break;
              return t;
            default:
              return t;
          }
      } else if (e === 'input' && t.type === 'hidden') {
        var n = u.name == null ? null : '' + u.name;
        if (u.type === 'hidden' && t.getAttribute('name') === n) return t;
      } else return t;
      if (((t = Te(t.nextSibling)), t === null)) break;
    }
    return null;
  }
  function c0(t, e, l) {
    if (e === '') return null;
    for (; t.nodeType !== 3; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== 'INPUT' || t.type !== 'hidden') &&
          !l) ||
        ((t = Te(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function rf(t) {
    return (
      t.data === '$!' ||
      (t.data === '$?' && t.ownerDocument.readyState === 'complete')
    );
  }
  function f0(t, e) {
    var l = t.ownerDocument;
    if (t.data !== '$?' || l.readyState === 'complete') e();
    else {
      var a = function () {
        (e(), l.removeEventListener('DOMContentLoaded', a));
      };
      (l.addEventListener('DOMContentLoaded', a), (t._reactRetry = a));
    }
  }
  function Te(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (
          ((e = t.data),
          e === '$' || e === '$!' || e === '$?' || e === 'F!' || e === 'F')
        )
          break;
        if (e === '/$') return null;
      }
    }
    return t;
  }
  var of = null;
  function fd(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var l = t.data;
        if (l === '$' || l === '$!' || l === '$?') {
          if (e === 0) return t;
          e--;
        } else l === '/$' && e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function rd(t, e, l) {
    switch (((e = Yn(l)), t)) {
      case 'html':
        if (((t = e.documentElement), !t)) throw Error(r(452));
        return t;
      case 'head':
        if (((t = e.head), !t)) throw Error(r(453));
        return t;
      case 'body':
        if (((t = e.body), !t)) throw Error(r(454));
        return t;
      default:
        throw Error(r(451));
    }
  }
  function gu(t) {
    for (var e = t.attributes; e.length; ) t.removeAttributeNode(e[0]);
    di(t);
  }
  var be = new Map(),
    od = new Set();
  function jn(t) {
    return typeof t.getRootNode == 'function'
      ? t.getRootNode()
      : t.nodeType === 9
        ? t
        : t.ownerDocument;
  }
  var we = j.d;
  j.d = { f: r0, r: o0, D: s0, C: d0, L: h0, m: m0, X: y0, S: v0, M: g0 };
  function r0() {
    var t = we.f(),
      e = _n();
    return t || e;
  }
  function o0(t) {
    var e = Vl(t);
    e !== null && e.tag === 5 && e.type === 'form' ? xo(e) : we.r(t);
  }
  var Aa = typeof document > 'u' ? null : document;
  function sd(t, e, l) {
    var a = Aa;
    if (a && typeof e == 'string' && e) {
      var u = de(e);
      ((u = 'link[rel="' + t + '"][href="' + u + '"]'),
        typeof l == 'string' && (u += '[crossorigin="' + l + '"]'),
        od.has(u) ||
          (od.add(u),
          (t = { rel: t, crossOrigin: l, href: e }),
          a.querySelector(u) === null &&
            ((e = a.createElement('link')),
            Lt(e, 'link', t),
            Bt(e),
            a.head.appendChild(e))));
    }
  }
  function s0(t) {
    (we.D(t), sd('dns-prefetch', t, null));
  }
  function d0(t, e) {
    (we.C(t, e), sd('preconnect', t, e));
  }
  function h0(t, e, l) {
    we.L(t, e, l);
    var a = Aa;
    if (a && t && e) {
      var u = 'link[rel="preload"][as="' + de(e) + '"]';
      e === 'image' && l && l.imageSrcSet
        ? ((u += '[imagesrcset="' + de(l.imageSrcSet) + '"]'),
          typeof l.imageSizes == 'string' &&
            (u += '[imagesizes="' + de(l.imageSizes) + '"]'))
        : (u += '[href="' + de(t) + '"]');
      var n = u;
      switch (e) {
        case 'style':
          n = Ma(t);
          break;
        case 'script':
          n = Oa(t);
      }
      be.has(n) ||
        ((t = R(
          {
            rel: 'preload',
            href: e === 'image' && l && l.imageSrcSet ? void 0 : t,
            as: e,
          },
          l
        )),
        be.set(n, t),
        a.querySelector(u) !== null ||
          (e === 'style' && a.querySelector(Su(n))) ||
          (e === 'script' && a.querySelector(bu(n))) ||
          ((e = a.createElement('link')),
          Lt(e, 'link', t),
          Bt(e),
          a.head.appendChild(e)));
    }
  }
  function m0(t, e) {
    we.m(t, e);
    var l = Aa;
    if (l && t) {
      var a = e && typeof e.as == 'string' ? e.as : 'script',
        u =
          'link[rel="modulepreload"][as="' + de(a) + '"][href="' + de(t) + '"]',
        n = u;
      switch (a) {
        case 'audioworklet':
        case 'paintworklet':
        case 'serviceworker':
        case 'sharedworker':
        case 'worker':
        case 'script':
          n = Oa(t);
      }
      if (
        !be.has(n) &&
        ((t = R({ rel: 'modulepreload', href: t }, e)),
        be.set(n, t),
        l.querySelector(u) === null)
      ) {
        switch (a) {
          case 'audioworklet':
          case 'paintworklet':
          case 'serviceworker':
          case 'sharedworker':
          case 'worker':
          case 'script':
            if (l.querySelector(bu(n))) return;
        }
        ((a = l.createElement('link')),
          Lt(a, 'link', t),
          Bt(a),
          l.head.appendChild(a));
      }
    }
  }
  function v0(t, e, l) {
    we.S(t, e, l);
    var a = Aa;
    if (a && t) {
      var u = wl(a).hoistableStyles,
        n = Ma(t);
      e = e || 'default';
      var c = u.get(n);
      if (!c) {
        var f = { loading: 0, preload: null };
        if ((c = a.querySelector(Su(n)))) f.loading = 5;
        else {
          ((t = R({ rel: 'stylesheet', href: t, 'data-precedence': e }, l)),
            (l = be.get(n)) && sf(t, l));
          var d = (c = a.createElement('link'));
          (Bt(d),
            Lt(d, 'link', t),
            (d._p = new Promise(function (T, z) {
              ((d.onload = T), (d.onerror = z));
            })),
            d.addEventListener('load', function () {
              f.loading |= 1;
            }),
            d.addEventListener('error', function () {
              f.loading |= 2;
            }),
            (f.loading |= 4),
            Gn(c, e, a));
        }
        ((c = { type: 'stylesheet', instance: c, count: 1, state: f }),
          u.set(n, c));
      }
    }
  }
  function y0(t, e) {
    we.X(t, e);
    var l = Aa;
    if (l && t) {
      var a = wl(l).hoistableScripts,
        u = Oa(t),
        n = a.get(u);
      n ||
        ((n = l.querySelector(bu(u))),
        n ||
          ((t = R({ src: t, async: !0 }, e)),
          (e = be.get(u)) && df(t, e),
          (n = l.createElement('script')),
          Bt(n),
          Lt(n, 'link', t),
          l.head.appendChild(n)),
        (n = { type: 'script', instance: n, count: 1, state: null }),
        a.set(u, n));
    }
  }
  function g0(t, e) {
    we.M(t, e);
    var l = Aa;
    if (l && t) {
      var a = wl(l).hoistableScripts,
        u = Oa(t),
        n = a.get(u);
      n ||
        ((n = l.querySelector(bu(u))),
        n ||
          ((t = R({ src: t, async: !0, type: 'module' }, e)),
          (e = be.get(u)) && df(t, e),
          (n = l.createElement('script')),
          Bt(n),
          Lt(n, 'link', t),
          l.head.appendChild(n)),
        (n = { type: 'script', instance: n, count: 1, state: null }),
        a.set(u, n));
    }
  }
  function dd(t, e, l, a) {
    var u = (u = I.current) ? jn(u) : null;
    if (!u) throw Error(r(446));
    switch (t) {
      case 'meta':
      case 'title':
        return null;
      case 'style':
        return typeof l.precedence == 'string' && typeof l.href == 'string'
          ? ((e = Ma(l.href)),
            (l = wl(u).hoistableStyles),
            (a = l.get(e)),
            a ||
              ((a = { type: 'style', instance: null, count: 0, state: null }),
              l.set(e, a)),
            a)
          : { type: 'void', instance: null, count: 0, state: null };
      case 'link':
        if (
          l.rel === 'stylesheet' &&
          typeof l.href == 'string' &&
          typeof l.precedence == 'string'
        ) {
          t = Ma(l.href);
          var n = wl(u).hoistableStyles,
            c = n.get(t);
          if (
            (c ||
              ((u = u.ownerDocument || u),
              (c = {
                type: 'stylesheet',
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              n.set(t, c),
              (n = u.querySelector(Su(t))) &&
                !n._p &&
                ((c.instance = n), (c.state.loading = 5)),
              be.has(t) ||
                ((l = {
                  rel: 'preload',
                  as: 'style',
                  href: l.href,
                  crossOrigin: l.crossOrigin,
                  integrity: l.integrity,
                  media: l.media,
                  hrefLang: l.hrefLang,
                  referrerPolicy: l.referrerPolicy,
                }),
                be.set(t, l),
                n || S0(u, t, l, c.state))),
            e && a === null)
          )
            throw Error(r(528, ''));
          return c;
        }
        if (e && a !== null) throw Error(r(529, ''));
        return null;
      case 'script':
        return (
          (e = l.async),
          (l = l.src),
          typeof l == 'string' &&
          e &&
          typeof e != 'function' &&
          typeof e != 'symbol'
            ? ((e = Oa(l)),
              (l = wl(u).hoistableScripts),
              (a = l.get(e)),
              a ||
                ((a = {
                  type: 'script',
                  instance: null,
                  count: 0,
                  state: null,
                }),
                l.set(e, a)),
              a)
            : { type: 'void', instance: null, count: 0, state: null }
        );
      default:
        throw Error(r(444, t));
    }
  }
  function Ma(t) {
    return 'href="' + de(t) + '"';
  }
  function Su(t) {
    return 'link[rel="stylesheet"][' + t + ']';
  }
  function hd(t) {
    return R({}, t, { 'data-precedence': t.precedence, precedence: null });
  }
  function S0(t, e, l, a) {
    t.querySelector('link[rel="preload"][as="style"][' + e + ']')
      ? (a.loading = 1)
      : ((e = t.createElement('link')),
        (a.preload = e),
        e.addEventListener('load', function () {
          return (a.loading |= 1);
        }),
        e.addEventListener('error', function () {
          return (a.loading |= 2);
        }),
        Lt(e, 'link', l),
        Bt(e),
        t.head.appendChild(e));
  }
  function Oa(t) {
    return '[src="' + de(t) + '"]';
  }
  function bu(t) {
    return 'script[async]' + t;
  }
  function md(t, e, l) {
    if ((e.count++, e.instance === null))
      switch (e.type) {
        case 'style':
          var a = t.querySelector('style[data-href~="' + de(l.href) + '"]');
          if (a) return ((e.instance = a), Bt(a), a);
          var u = R({}, l, {
            'data-href': l.href,
            'data-precedence': l.precedence,
            href: null,
            precedence: null,
          });
          return (
            (a = (t.ownerDocument || t).createElement('style')),
            Bt(a),
            Lt(a, 'style', u),
            Gn(a, l.precedence, t),
            (e.instance = a)
          );
        case 'stylesheet':
          u = Ma(l.href);
          var n = t.querySelector(Su(u));
          if (n) return ((e.state.loading |= 4), (e.instance = n), Bt(n), n);
          ((a = hd(l)),
            (u = be.get(u)) && sf(a, u),
            (n = (t.ownerDocument || t).createElement('link')),
            Bt(n));
          var c = n;
          return (
            (c._p = new Promise(function (f, d) {
              ((c.onload = f), (c.onerror = d));
            })),
            Lt(n, 'link', a),
            (e.state.loading |= 4),
            Gn(n, l.precedence, t),
            (e.instance = n)
          );
        case 'script':
          return (
            (n = Oa(l.src)),
            (u = t.querySelector(bu(n)))
              ? ((e.instance = u), Bt(u), u)
              : ((a = l),
                (u = be.get(n)) && ((a = R({}, l)), df(a, u)),
                (t = t.ownerDocument || t),
                (u = t.createElement('script')),
                Bt(u),
                Lt(u, 'link', a),
                t.head.appendChild(u),
                (e.instance = u))
          );
        case 'void':
          return null;
        default:
          throw Error(r(443, e.type));
      }
    else
      e.type === 'stylesheet' &&
        (e.state.loading & 4) === 0 &&
        ((a = e.instance), (e.state.loading |= 4), Gn(a, l.precedence, t));
    return e.instance;
  }
  function Gn(t, e, l) {
    for (
      var a = l.querySelectorAll(
          'link[rel="stylesheet"][data-precedence],style[data-precedence]'
        ),
        u = a.length ? a[a.length - 1] : null,
        n = u,
        c = 0;
      c < a.length;
      c++
    ) {
      var f = a[c];
      if (f.dataset.precedence === e) n = f;
      else if (n !== u) break;
    }
    n
      ? n.parentNode.insertBefore(t, n.nextSibling)
      : ((e = l.nodeType === 9 ? l.head : l), e.insertBefore(t, e.firstChild));
  }
  function sf(t, e) {
    (t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.title == null && (t.title = e.title));
  }
  function df(t, e) {
    (t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.integrity == null && (t.integrity = e.integrity));
  }
  var Xn = null;
  function vd(t, e, l) {
    if (Xn === null) {
      var a = new Map(),
        u = (Xn = new Map());
      u.set(l, a);
    } else ((u = Xn), (a = u.get(l)), a || ((a = new Map()), u.set(l, a)));
    if (a.has(t)) return a;
    for (
      a.set(t, null), l = l.getElementsByTagName(t), u = 0;
      u < l.length;
      u++
    ) {
      var n = l[u];
      if (
        !(
          n[Na] ||
          n[Vt] ||
          (t === 'link' && n.getAttribute('rel') === 'stylesheet')
        ) &&
        n.namespaceURI !== 'http://www.w3.org/2000/svg'
      ) {
        var c = n.getAttribute(e) || '';
        c = t + c;
        var f = a.get(c);
        f ? f.push(n) : a.set(c, [n]);
      }
    }
    return a;
  }
  function yd(t, e, l) {
    ((t = t.ownerDocument || t),
      t.head.insertBefore(
        l,
        e === 'title' ? t.querySelector('head > title') : null
      ));
  }
  function b0(t, e, l) {
    if (l === 1 || e.itemProp != null) return !1;
    switch (t) {
      case 'meta':
      case 'title':
        return !0;
      case 'style':
        if (
          typeof e.precedence != 'string' ||
          typeof e.href != 'string' ||
          e.href === ''
        )
          break;
        return !0;
      case 'link':
        if (
          typeof e.rel != 'string' ||
          typeof e.href != 'string' ||
          e.href === '' ||
          e.onLoad ||
          e.onError
        )
          break;
        switch (e.rel) {
          case 'stylesheet':
            return (
              (t = e.disabled),
              typeof e.precedence == 'string' && t == null
            );
          default:
            return !0;
        }
      case 'script':
        if (
          e.async &&
          typeof e.async != 'function' &&
          typeof e.async != 'symbol' &&
          !e.onLoad &&
          !e.onError &&
          e.src &&
          typeof e.src == 'string'
        )
          return !0;
    }
    return !1;
  }
  function gd(t) {
    return !(t.type === 'stylesheet' && (t.state.loading & 3) === 0);
  }
  var pu = null;
  function p0() {}
  function E0(t, e, l) {
    if (pu === null) throw Error(r(475));
    var a = pu;
    if (
      e.type === 'stylesheet' &&
      (typeof l.media != 'string' || matchMedia(l.media).matches !== !1) &&
      (e.state.loading & 4) === 0
    ) {
      if (e.instance === null) {
        var u = Ma(l.href),
          n = t.querySelector(Su(u));
        if (n) {
          ((t = n._p),
            t !== null &&
              typeof t == 'object' &&
              typeof t.then == 'function' &&
              (a.count++, (a = Ln.bind(a)), t.then(a, a)),
            (e.state.loading |= 4),
            (e.instance = n),
            Bt(n));
          return;
        }
        ((n = t.ownerDocument || t),
          (l = hd(l)),
          (u = be.get(u)) && sf(l, u),
          (n = n.createElement('link')),
          Bt(n));
        var c = n;
        ((c._p = new Promise(function (f, d) {
          ((c.onload = f), (c.onerror = d));
        })),
          Lt(n, 'link', l),
          (e.instance = n));
      }
      (a.stylesheets === null && (a.stylesheets = new Map()),
        a.stylesheets.set(e, t),
        (t = e.state.preload) &&
          (e.state.loading & 3) === 0 &&
          (a.count++,
          (e = Ln.bind(a)),
          t.addEventListener('load', e),
          t.addEventListener('error', e)));
    }
  }
  function T0() {
    if (pu === null) throw Error(r(475));
    var t = pu;
    return (
      t.stylesheets && t.count === 0 && hf(t, t.stylesheets),
      0 < t.count
        ? function (e) {
            var l = setTimeout(function () {
              if ((t.stylesheets && hf(t, t.stylesheets), t.unsuspend)) {
                var a = t.unsuspend;
                ((t.unsuspend = null), a());
              }
            }, 6e4);
            return (
              (t.unsuspend = e),
              function () {
                ((t.unsuspend = null), clearTimeout(l));
              }
            );
          }
        : null
    );
  }
  function Ln() {
    if ((this.count--, this.count === 0)) {
      if (this.stylesheets) hf(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        ((this.unsuspend = null), t());
      }
    }
  }
  var Qn = null;
  function hf(t, e) {
    ((t.stylesheets = null),
      t.unsuspend !== null &&
        (t.count++,
        (Qn = new Map()),
        e.forEach(R0, t),
        (Qn = null),
        Ln.call(t)));
  }
  function R0(t, e) {
    if (!(e.state.loading & 4)) {
      var l = Qn.get(t);
      if (l) var a = l.get(null);
      else {
        ((l = new Map()), Qn.set(t, l));
        for (
          var u = t.querySelectorAll(
              'link[data-precedence],style[data-precedence]'
            ),
            n = 0;
          n < u.length;
          n++
        ) {
          var c = u[n];
          (c.nodeName === 'LINK' || c.getAttribute('media') !== 'not all') &&
            (l.set(c.dataset.precedence, c), (a = c));
        }
        a && l.set(null, a);
      }
      ((u = e.instance),
        (c = u.getAttribute('data-precedence')),
        (n = l.get(c) || a),
        n === a && l.set(null, u),
        l.set(c, u),
        this.count++,
        (a = Ln.bind(this)),
        u.addEventListener('load', a),
        u.addEventListener('error', a),
        n
          ? n.parentNode.insertBefore(u, n.nextSibling)
          : ((t = t.nodeType === 9 ? t.head : t),
            t.insertBefore(u, t.firstChild)),
        (e.state.loading |= 4));
    }
  }
  var Eu = {
    $$typeof: w,
    Provider: null,
    Consumer: null,
    _currentValue: W,
    _currentValue2: W,
    _threadCount: 0,
  };
  function A0(t, e, l, a, u, n, c, f) {
    ((this.tag = 1),
      (this.containerInfo = t),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode =
        this.next =
        this.pendingContext =
        this.context =
        this.cancelPendingCommit =
          null),
      (this.callbackPriority = 0),
      (this.expirationTimes = fi(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = fi(0)),
      (this.hiddenUpdates = fi(null)),
      (this.identifierPrefix = a),
      (this.onUncaughtError = u),
      (this.onCaughtError = n),
      (this.onRecoverableError = c),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = f),
      (this.incompleteTransitions = new Map()));
  }
  function Sd(t, e, l, a, u, n, c, f, d, T, z, U) {
    return (
      (t = new A0(t, e, l, c, f, d, T, U)),
      (e = 1),
      n === !0 && (e |= 24),
      (n = ue(3, null, null, e)),
      (t.current = n),
      (n.stateNode = t),
      (e = Ji()),
      e.refCount++,
      (t.pooledCache = e),
      e.refCount++,
      (n.memoizedState = { element: a, isDehydrated: l, cache: e }),
      Fi(n),
      t
    );
  }
  function bd(t) {
    return t ? ((t = aa), t) : aa;
  }
  function pd(t, e, l, a, u, n) {
    ((u = bd(u)),
      a.context === null ? (a.context = u) : (a.pendingContext = u),
      (a = el(e)),
      (a.payload = { element: l }),
      (n = n === void 0 ? null : n),
      n !== null && (a.callback = n),
      (l = ll(t, a, e)),
      l !== null && (re(l, t, e), Fa(l, t, e)));
  }
  function Ed(t, e) {
    if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
      var l = t.retryLane;
      t.retryLane = l !== 0 && l < e ? l : e;
    }
  }
  function mf(t, e) {
    (Ed(t, e), (t = t.alternate) && Ed(t, e));
  }
  function Td(t) {
    if (t.tag === 13) {
      var e = la(t, 67108864);
      (e !== null && re(e, t, 67108864), mf(t, 67108864));
    }
  }
  var Zn = !0;
  function M0(t, e, l, a) {
    var u = D.T;
    D.T = null;
    var n = j.p;
    try {
      ((j.p = 2), vf(t, e, l, a));
    } finally {
      ((j.p = n), (D.T = u));
    }
  }
  function O0(t, e, l, a) {
    var u = D.T;
    D.T = null;
    var n = j.p;
    try {
      ((j.p = 8), vf(t, e, l, a));
    } finally {
      ((j.p = n), (D.T = u));
    }
  }
  function vf(t, e, l, a) {
    if (Zn) {
      var u = yf(a);
      if (u === null) (ef(t, e, a, Vn, l), Ad(t, a));
      else if (D0(u, t, e, l, a)) a.stopPropagation();
      else if ((Ad(t, a), e & 4 && -1 < z0.indexOf(t))) {
        for (; u !== null; ) {
          var n = Vl(u);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (((n = n.stateNode), n.current.memoizedState.isDehydrated)) {
                  var c = Rl(n.pendingLanes);
                  if (c !== 0) {
                    var f = n;
                    for (f.pendingLanes |= 2, f.entangledLanes |= 2; c; ) {
                      var d = 1 << (31 - le(c));
                      ((f.entanglements[1] |= d), (c &= ~d));
                    }
                    (De(n), (st & 6) === 0 && ((zn = Re() + 500), mu(0)));
                  }
                }
                break;
              case 13:
                ((f = la(n, 2)), f !== null && re(f, n, 2), _n(), mf(n, 2));
            }
          if (((n = yf(a)), n === null && ef(t, e, a, Vn, l), n === u)) break;
          u = n;
        }
        u !== null && a.stopPropagation();
      } else ef(t, e, a, null, l);
    }
  }
  function yf(t) {
    return ((t = pi(t)), gf(t));
  }
  var Vn = null;
  function gf(t) {
    if (((Vn = null), (t = Zl(t)), t !== null)) {
      var e = g(t);
      if (e === null) t = null;
      else {
        var l = e.tag;
        if (l === 13) {
          if (((t = E(e)), t !== null)) return t;
          t = null;
        } else if (l === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return ((Vn = t), null);
  }
  function Rd(t) {
    switch (t) {
      case 'beforetoggle':
      case 'cancel':
      case 'click':
      case 'close':
      case 'contextmenu':
      case 'copy':
      case 'cut':
      case 'auxclick':
      case 'dblclick':
      case 'dragend':
      case 'dragstart':
      case 'drop':
      case 'focusin':
      case 'focusout':
      case 'input':
      case 'invalid':
      case 'keydown':
      case 'keypress':
      case 'keyup':
      case 'mousedown':
      case 'mouseup':
      case 'paste':
      case 'pause':
      case 'play':
      case 'pointercancel':
      case 'pointerdown':
      case 'pointerup':
      case 'ratechange':
      case 'reset':
      case 'resize':
      case 'seeked':
      case 'submit':
      case 'toggle':
      case 'touchcancel':
      case 'touchend':
      case 'touchstart':
      case 'volumechange':
      case 'change':
      case 'selectionchange':
      case 'textInput':
      case 'compositionstart':
      case 'compositionend':
      case 'compositionupdate':
      case 'beforeblur':
      case 'afterblur':
      case 'beforeinput':
      case 'blur':
      case 'fullscreenchange':
      case 'focus':
      case 'hashchange':
      case 'popstate':
      case 'select':
      case 'selectstart':
        return 2;
      case 'drag':
      case 'dragenter':
      case 'dragexit':
      case 'dragleave':
      case 'dragover':
      case 'mousemove':
      case 'mouseout':
      case 'mouseover':
      case 'pointermove':
      case 'pointerout':
      case 'pointerover':
      case 'scroll':
      case 'touchmove':
      case 'wheel':
      case 'mouseenter':
      case 'mouseleave':
      case 'pointerenter':
      case 'pointerleave':
        return 8;
      case 'message':
        switch (dh()) {
          case qf:
            return 2;
          case Yf:
            return 8;
          case Bu:
          case hh:
            return 32;
          case jf:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Sf = !1,
    vl = null,
    yl = null,
    gl = null,
    Tu = new Map(),
    Ru = new Map(),
    Sl = [],
    z0 =
      'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset'.split(
        ' '
      );
  function Ad(t, e) {
    switch (t) {
      case 'focusin':
      case 'focusout':
        vl = null;
        break;
      case 'dragenter':
      case 'dragleave':
        yl = null;
        break;
      case 'mouseover':
      case 'mouseout':
        gl = null;
        break;
      case 'pointerover':
      case 'pointerout':
        Tu.delete(e.pointerId);
        break;
      case 'gotpointercapture':
      case 'lostpointercapture':
        Ru.delete(e.pointerId);
    }
  }
  function Au(t, e, l, a, u, n) {
    return t === null || t.nativeEvent !== n
      ? ((t = {
          blockedOn: e,
          domEventName: l,
          eventSystemFlags: a,
          nativeEvent: n,
          targetContainers: [u],
        }),
        e !== null && ((e = Vl(e)), e !== null && Td(e)),
        t)
      : ((t.eventSystemFlags |= a),
        (e = t.targetContainers),
        u !== null && e.indexOf(u) === -1 && e.push(u),
        t);
  }
  function D0(t, e, l, a, u) {
    switch (e) {
      case 'focusin':
        return ((vl = Au(vl, t, e, l, a, u)), !0);
      case 'dragenter':
        return ((yl = Au(yl, t, e, l, a, u)), !0);
      case 'mouseover':
        return ((gl = Au(gl, t, e, l, a, u)), !0);
      case 'pointerover':
        var n = u.pointerId;
        return (Tu.set(n, Au(Tu.get(n) || null, t, e, l, a, u)), !0);
      case 'gotpointercapture':
        return (
          (n = u.pointerId),
          Ru.set(n, Au(Ru.get(n) || null, t, e, l, a, u)),
          !0
        );
    }
    return !1;
  }
  function Md(t) {
    var e = Zl(t.target);
    if (e !== null) {
      var l = g(e);
      if (l !== null) {
        if (((e = l.tag), e === 13)) {
          if (((e = E(l)), e !== null)) {
            ((t.blockedOn = e),
              Eh(t.priority, function () {
                if (l.tag === 13) {
                  var a = fe();
                  a = ri(a);
                  var u = la(l, a);
                  (u !== null && re(u, l, a), mf(l, a));
                }
              }));
            return;
          }
        } else if (e === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function wn(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var l = yf(t.nativeEvent);
      if (l === null) {
        l = t.nativeEvent;
        var a = new l.constructor(l.type, l);
        ((bi = a), l.target.dispatchEvent(a), (bi = null));
      } else return ((e = Vl(l)), e !== null && Td(e), (t.blockedOn = l), !1);
      e.shift();
    }
    return !0;
  }
  function Od(t, e, l) {
    wn(t) && l.delete(e);
  }
  function _0() {
    ((Sf = !1),
      vl !== null && wn(vl) && (vl = null),
      yl !== null && wn(yl) && (yl = null),
      gl !== null && wn(gl) && (gl = null),
      Tu.forEach(Od),
      Ru.forEach(Od));
  }
  function Kn(t, e) {
    t.blockedOn === e &&
      ((t.blockedOn = null),
      Sf ||
        ((Sf = !0),
        i.unstable_scheduleCallback(i.unstable_NormalPriority, _0)));
  }
  var Jn = null;
  function zd(t) {
    Jn !== t &&
      ((Jn = t),
      i.unstable_scheduleCallback(i.unstable_NormalPriority, function () {
        Jn === t && (Jn = null);
        for (var e = 0; e < t.length; e += 3) {
          var l = t[e],
            a = t[e + 1],
            u = t[e + 2];
          if (typeof a != 'function') {
            if (gf(a || l) === null) continue;
            break;
          }
          var n = Vl(l);
          n !== null &&
            (t.splice(e, 3),
            (e -= 3),
            yc(n, { pending: !0, data: u, method: l.method, action: a }, a, u));
        }
      }));
  }
  function Mu(t) {
    function e(d) {
      return Kn(d, t);
    }
    (vl !== null && Kn(vl, t),
      yl !== null && Kn(yl, t),
      gl !== null && Kn(gl, t),
      Tu.forEach(e),
      Ru.forEach(e));
    for (var l = 0; l < Sl.length; l++) {
      var a = Sl[l];
      a.blockedOn === t && (a.blockedOn = null);
    }
    for (; 0 < Sl.length && ((l = Sl[0]), l.blockedOn === null); )
      (Md(l), l.blockedOn === null && Sl.shift());
    if (((l = (t.ownerDocument || t).$$reactFormReplay), l != null))
      for (a = 0; a < l.length; a += 3) {
        var u = l[a],
          n = l[a + 1],
          c = u[$t] || null;
        if (typeof n == 'function') c || zd(l);
        else if (c) {
          var f = null;
          if (n && n.hasAttribute('formAction')) {
            if (((u = n), (c = n[$t] || null))) f = c.formAction;
            else if (gf(u) !== null) continue;
          } else f = c.action;
          (typeof f == 'function' ? (l[a + 1] = f) : (l.splice(a, 3), (a -= 3)),
            zd(l));
        }
      }
  }
  function bf(t) {
    this._internalRoot = t;
  }
  (($n.prototype.render = bf.prototype.render =
    function (t) {
      var e = this._internalRoot;
      if (e === null) throw Error(r(409));
      var l = e.current,
        a = fe();
      pd(l, a, t, e, null, null);
    }),
    ($n.prototype.unmount = bf.prototype.unmount =
      function () {
        var t = this._internalRoot;
        if (t !== null) {
          this._internalRoot = null;
          var e = t.containerInfo;
          (pd(t.current, 2, null, t, null, null), _n(), (e[Ql] = null));
        }
      }));
  function $n(t) {
    this._internalRoot = t;
  }
  $n.prototype.unstable_scheduleHydration = function (t) {
    if (t) {
      var e = Zf();
      t = { blockedOn: null, target: t, priority: e };
      for (var l = 0; l < Sl.length && e !== 0 && e < Sl[l].priority; l++);
      (Sl.splice(l, 0, t), l === 0 && Md(t));
    }
  };
  var Dd = o.version;
  if (Dd !== '19.1.1') throw Error(r(527, Dd, '19.1.1'));
  j.findDOMNode = function (t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == 'function'
        ? Error(r(188))
        : ((t = Object.keys(t).join(',')), Error(r(268, t)));
    return (
      (t = b(e)),
      (t = t !== null ? m(t) : null),
      (t = t === null ? null : t.stateNode),
      t
    );
  };
  var x0 = {
    bundleType: 0,
    version: '19.1.1',
    rendererPackageName: 'react-dom',
    currentDispatcherRef: D,
    reconcilerVersion: '19.1.1',
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
    var kn = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!kn.isDisabled && kn.supportsFiber)
      try {
        ((_a = kn.inject(x0)), (ee = kn));
      } catch {}
  }
  return (
    (zu.createRoot = function (t, e) {
      if (!h(t)) throw Error(r(299));
      var l = !1,
        a = '',
        u = Vo,
        n = wo,
        c = Ko,
        f = null;
      return (
        e != null &&
          (e.unstable_strictMode === !0 && (l = !0),
          e.identifierPrefix !== void 0 && (a = e.identifierPrefix),
          e.onUncaughtError !== void 0 && (u = e.onUncaughtError),
          e.onCaughtError !== void 0 && (n = e.onCaughtError),
          e.onRecoverableError !== void 0 && (c = e.onRecoverableError),
          e.unstable_transitionCallbacks !== void 0 &&
            (f = e.unstable_transitionCallbacks)),
        (e = Sd(t, 1, !1, null, null, l, a, u, n, c, f, null)),
        (t[Ql] = e.current),
        tf(t),
        new bf(e)
      );
    }),
    (zu.hydrateRoot = function (t, e, l) {
      if (!h(t)) throw Error(r(299));
      var a = !1,
        u = '',
        n = Vo,
        c = wo,
        f = Ko,
        d = null,
        T = null;
      return (
        l != null &&
          (l.unstable_strictMode === !0 && (a = !0),
          l.identifierPrefix !== void 0 && (u = l.identifierPrefix),
          l.onUncaughtError !== void 0 && (n = l.onUncaughtError),
          l.onCaughtError !== void 0 && (c = l.onCaughtError),
          l.onRecoverableError !== void 0 && (f = l.onRecoverableError),
          l.unstable_transitionCallbacks !== void 0 &&
            (d = l.unstable_transitionCallbacks),
          l.formState !== void 0 && (T = l.formState)),
        (e = Sd(t, 1, !0, e, l ?? null, a, u, n, c, f, d, T)),
        (e.context = bd(null)),
        (l = e.current),
        (a = fe()),
        (a = ri(a)),
        (u = el(a)),
        (u.callback = null),
        ll(l, u, a),
        (l = a),
        (e.current.lanes = l),
        Ua(e, l),
        De(e),
        (t[Ql] = e.current),
        tf(t),
        new $n(e)
      );
    }),
    (zu.version = '19.1.1'),
    zu
  );
}
var jd;
function X0() {
  if (jd) return Tf.exports;
  jd = 1;
  function i() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (o) {
        console.error(o);
      }
  }
  return (i(), (Tf.exports = G0()), Tf.exports);
}
var L0 = X0();
const Q0 = Jd(L0);
/**
 * react-router v7.9.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ var Gd = 'popstate';
function Z0(i = {}) {
  function o(r, h) {
    let { pathname: g, search: E, hash: O } = r.location;
    return Df(
      '',
      { pathname: g, search: E, hash: O },
      (h.state && h.state.usr) || null,
      (h.state && h.state.key) || 'default'
    );
  }
  function s(r, h) {
    return typeof h == 'string' ? h : xu(h);
  }
  return w0(o, s, null, i);
}
function Tt(i, o) {
  if (i === !1 || i === null || typeof i > 'u') throw new Error(o);
}
function _e(i, o) {
  if (!i) {
    typeof console < 'u' && console.warn(o);
    try {
      throw new Error(o);
    } catch {}
  }
}
function V0() {
  return Math.random().toString(36).substring(2, 10);
}
function Xd(i, o) {
  return { usr: i.state, key: i.key, idx: o };
}
function Df(i, o, s = null, r) {
  return {
    pathname: typeof i == 'string' ? i : i.pathname,
    search: '',
    hash: '',
    ...(typeof o == 'string' ? za(o) : o),
    state: s,
    key: (o && o.key) || r || V0(),
  };
}
function xu({ pathname: i = '/', search: o = '', hash: s = '' }) {
  return (
    o && o !== '?' && (i += o.charAt(0) === '?' ? o : '?' + o),
    s && s !== '#' && (i += s.charAt(0) === '#' ? s : '#' + s),
    i
  );
}
function za(i) {
  let o = {};
  if (i) {
    let s = i.indexOf('#');
    s >= 0 && ((o.hash = i.substring(s)), (i = i.substring(0, s)));
    let r = i.indexOf('?');
    (r >= 0 && ((o.search = i.substring(r)), (i = i.substring(0, r))),
      i && (o.pathname = i));
  }
  return o;
}
function w0(i, o, s, r = {}) {
  let { window: h = document.defaultView, v5Compat: g = !1 } = r,
    E = h.history,
    O = 'POP',
    b = null,
    m = R();
  m == null && ((m = 0), E.replaceState({ ...E.state, idx: m }, ''));
  function R() {
    return (E.state || { idx: null }).idx;
  }
  function H() {
    O = 'POP';
    let L = R(),
      Y = L == null ? null : L - m;
    ((m = L), b && b({ action: O, location: F.location, delta: Y }));
  }
  function C(L, Y) {
    O = 'PUSH';
    let B = Df(F.location, L, Y);
    m = R() + 1;
    let w = Xd(B, m),
      ct = F.createHref(B);
    try {
      E.pushState(w, '', ct);
    } catch (K) {
      if (K instanceof DOMException && K.name === 'DataCloneError') throw K;
      h.location.assign(ct);
    }
    g && b && b({ action: O, location: F.location, delta: 1 });
  }
  function G(L, Y) {
    O = 'REPLACE';
    let B = Df(F.location, L, Y);
    m = R();
    let w = Xd(B, m),
      ct = F.createHref(B);
    (E.replaceState(w, '', ct),
      g && b && b({ action: O, location: F.location, delta: 0 }));
  }
  function V(L) {
    return K0(L);
  }
  let F = {
    get action() {
      return O;
    },
    get location() {
      return i(h, E);
    },
    listen(L) {
      if (b) throw new Error('A history only accepts one active listener');
      return (
        h.addEventListener(Gd, H),
        (b = L),
        () => {
          (h.removeEventListener(Gd, H), (b = null));
        }
      );
    },
    createHref(L) {
      return o(h, L);
    },
    createURL: V,
    encodeLocation(L) {
      let Y = V(L);
      return { pathname: Y.pathname, search: Y.search, hash: Y.hash };
    },
    push: C,
    replace: G,
    go(L) {
      return E.go(L);
    },
  };
  return F;
}
function K0(i, o = !1) {
  let s = 'http://localhost';
  (typeof window < 'u' &&
    (s =
      window.location.origin !== 'null'
        ? window.location.origin
        : window.location.href),
    Tt(s, 'No window.location.(origin|href) available to create URL'));
  let r = typeof i == 'string' ? i : xu(i);
  return (
    (r = r.replace(/ $/, '%20')),
    !o && r.startsWith('//') && (r = s + r),
    new URL(r, s)
  );
}
function $d(i, o, s = '/') {
  return J0(i, o, s, !1);
}
function J0(i, o, s, r) {
  let h = typeof o == 'string' ? za(o) : o,
    g = Je(h.pathname || '/', s);
  if (g == null) return null;
  let E = kd(i);
  $0(E);
  let O = null;
  for (let b = 0; O == null && b < E.length; ++b) {
    let m = nv(g);
    O = av(E[b], m, r);
  }
  return O;
}
function kd(i, o = [], s = [], r = '', h = !1) {
  let g = (E, O, b = h, m) => {
    let R = {
      relativePath: m === void 0 ? E.path || '' : m,
      caseSensitive: E.caseSensitive === !0,
      childrenIndex: O,
      route: E,
    };
    if (R.relativePath.startsWith('/')) {
      if (!R.relativePath.startsWith(r) && b) return;
      (Tt(
        R.relativePath.startsWith(r),
        `Absolute route path "${R.relativePath}" nested under path "${r}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ),
        (R.relativePath = R.relativePath.slice(r.length)));
    }
    let H = Ke([r, R.relativePath]),
      C = s.concat(R);
    (E.children &&
      E.children.length > 0 &&
      (Tt(
        E.index !== !0,
        `Index routes must not have child routes. Please remove all child routes from route path "${H}".`
      ),
      kd(E.children, o, C, H, b)),
      !(E.path == null && !E.index) &&
        o.push({ path: H, score: ev(H, E.index), routesMeta: C }));
  };
  return (
    i.forEach((E, O) => {
      if (E.path === '' || !E.path?.includes('?')) g(E, O);
      else for (let b of Wd(E.path)) g(E, O, !0, b);
    }),
    o
  );
}
function Wd(i) {
  let o = i.split('/');
  if (o.length === 0) return [];
  let [s, ...r] = o,
    h = s.endsWith('?'),
    g = s.replace(/\?$/, '');
  if (r.length === 0) return h ? [g, ''] : [g];
  let E = Wd(r.join('/')),
    O = [];
  return (
    O.push(...E.map((b) => (b === '' ? g : [g, b].join('/')))),
    h && O.push(...E),
    O.map((b) => (i.startsWith('/') && b === '' ? '/' : b))
  );
}
function $0(i) {
  i.sort((o, s) =>
    o.score !== s.score
      ? s.score - o.score
      : lv(
          o.routesMeta.map((r) => r.childrenIndex),
          s.routesMeta.map((r) => r.childrenIndex)
        )
  );
}
var k0 = /^:[\w-]+$/,
  W0 = 3,
  F0 = 2,
  P0 = 1,
  I0 = 10,
  tv = -2,
  Ld = (i) => i === '*';
function ev(i, o) {
  let s = i.split('/'),
    r = s.length;
  return (
    s.some(Ld) && (r += tv),
    o && (r += F0),
    s
      .filter((h) => !Ld(h))
      .reduce((h, g) => h + (k0.test(g) ? W0 : g === '' ? P0 : I0), r)
  );
}
function lv(i, o) {
  return i.length === o.length && i.slice(0, -1).every((r, h) => r === o[h])
    ? i[i.length - 1] - o[o.length - 1]
    : 0;
}
function av(i, o, s = !1) {
  let { routesMeta: r } = i,
    h = {},
    g = '/',
    E = [];
  for (let O = 0; O < r.length; ++O) {
    let b = r[O],
      m = O === r.length - 1,
      R = g === '/' ? o : o.slice(g.length) || '/',
      H = ti(
        { path: b.relativePath, caseSensitive: b.caseSensitive, end: m },
        R
      ),
      C = b.route;
    if (
      (!H &&
        m &&
        s &&
        !r[r.length - 1].route.index &&
        (H = ti(
          { path: b.relativePath, caseSensitive: b.caseSensitive, end: !1 },
          R
        )),
      !H)
    )
      return null;
    (Object.assign(h, H.params),
      E.push({
        params: h,
        pathname: Ke([g, H.pathname]),
        pathnameBase: rv(Ke([g, H.pathnameBase])),
        route: C,
      }),
      H.pathnameBase !== '/' && (g = Ke([g, H.pathnameBase])));
  }
  return E;
}
function ti(i, o) {
  typeof i == 'string' && (i = { path: i, caseSensitive: !1, end: !0 });
  let [s, r] = uv(i.path, i.caseSensitive, i.end),
    h = o.match(s);
  if (!h) return null;
  let g = h[0],
    E = g.replace(/(.)\/+$/, '$1'),
    O = h.slice(1);
  return {
    params: r.reduce((m, { paramName: R, isOptional: H }, C) => {
      if (R === '*') {
        let V = O[C] || '';
        E = g.slice(0, g.length - V.length).replace(/(.)\/+$/, '$1');
      }
      const G = O[C];
      return (
        H && !G ? (m[R] = void 0) : (m[R] = (G || '').replace(/%2F/g, '/')),
        m
      );
    }, {}),
    pathname: g,
    pathnameBase: E,
    pattern: i,
  };
}
function uv(i, o = !1, s = !0) {
  _e(
    i === '*' || !i.endsWith('*') || i.endsWith('/*'),
    `Route path "${i}" will be treated as if it were "${i.replace(/\*$/, '/*')}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${i.replace(/\*$/, '/*')}".`
  );
  let r = [],
    h =
      '^' +
      i
        .replace(/\/*\*?$/, '')
        .replace(/^\/*/, '/')
        .replace(/[\\.*+^${}|()[\]]/g, '\\$&')
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (E, O, b) => (
            r.push({ paramName: O, isOptional: b != null }),
            b ? '/?([^\\/]+)?' : '/([^\\/]+)'
          )
        )
        .replace(/\/([\w-]+)\?(\/|$)/g, '(/$1)?$2');
  return (
    i.endsWith('*')
      ? (r.push({ paramName: '*' }),
        (h += i === '*' || i === '/*' ? '(.*)$' : '(?:\\/(.+)|\\/*)$'))
      : s
        ? (h += '\\/*$')
        : i !== '' && i !== '/' && (h += '(?:(?=\\/|$))'),
    [new RegExp(h, o ? void 0 : 'i'), r]
  );
}
function nv(i) {
  try {
    return i
      .split('/')
      .map((o) => decodeURIComponent(o).replace(/\//g, '%2F'))
      .join('/');
  } catch (o) {
    return (
      _e(
        !1,
        `The URL path "${i}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${o}).`
      ),
      i
    );
  }
}
function Je(i, o) {
  if (o === '/') return i;
  if (!i.toLowerCase().startsWith(o.toLowerCase())) return null;
  let s = o.endsWith('/') ? o.length - 1 : o.length,
    r = i.charAt(s);
  return r && r !== '/' ? null : i.slice(s) || '/';
}
function iv(i, o = '/') {
  let {
    pathname: s,
    search: r = '',
    hash: h = '',
  } = typeof i == 'string' ? za(i) : i;
  return {
    pathname: s ? (s.startsWith('/') ? s : cv(s, o)) : o,
    search: ov(r),
    hash: sv(h),
  };
}
function cv(i, o) {
  let s = o.replace(/\/+$/, '').split('/');
  return (
    i.split('/').forEach((h) => {
      h === '..' ? s.length > 1 && s.pop() : h !== '.' && s.push(h);
    }),
    s.length > 1 ? s.join('/') : '/'
  );
}
function Of(i, o, s, r) {
  return `Cannot include a '${i}' character in a manually specified \`to.${o}\` field [${JSON.stringify(r)}].  Please separate it out to the \`to.${s}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function fv(i) {
  return i.filter(
    (o, s) => s === 0 || (o.route.path && o.route.path.length > 0)
  );
}
function Fd(i) {
  let o = fv(i);
  return o.map((s, r) => (r === o.length - 1 ? s.pathname : s.pathnameBase));
}
function Pd(i, o, s, r = !1) {
  let h;
  typeof i == 'string'
    ? (h = za(i))
    : ((h = { ...i }),
      Tt(
        !h.pathname || !h.pathname.includes('?'),
        Of('?', 'pathname', 'search', h)
      ),
      Tt(
        !h.pathname || !h.pathname.includes('#'),
        Of('#', 'pathname', 'hash', h)
      ),
      Tt(!h.search || !h.search.includes('#'), Of('#', 'search', 'hash', h)));
  let g = i === '' || h.pathname === '',
    E = g ? '/' : h.pathname,
    O;
  if (E == null) O = s;
  else {
    let H = o.length - 1;
    if (!r && E.startsWith('..')) {
      let C = E.split('/');
      for (; C[0] === '..'; ) (C.shift(), (H -= 1));
      h.pathname = C.join('/');
    }
    O = H >= 0 ? o[H] : '/';
  }
  let b = iv(h, O),
    m = E && E !== '/' && E.endsWith('/'),
    R = (g || E === '.') && s.endsWith('/');
  return (!b.pathname.endsWith('/') && (m || R) && (b.pathname += '/'), b);
}
var Ke = (i) => i.join('/').replace(/\/\/+/g, '/'),
  rv = (i) => i.replace(/\/+$/, '').replace(/^\/*/, '/'),
  ov = (i) => (!i || i === '?' ? '' : i.startsWith('?') ? i : '?' + i),
  sv = (i) => (!i || i === '#' ? '' : i.startsWith('#') ? i : '#' + i);
function dv(i) {
  return (
    i != null &&
    typeof i.status == 'number' &&
    typeof i.statusText == 'string' &&
    typeof i.internal == 'boolean' &&
    'data' in i
  );
}
var Id = ['POST', 'PUT', 'PATCH', 'DELETE'];
new Set(Id);
var hv = ['GET', ...Id];
new Set(hv);
var Da = _.createContext(null);
Da.displayName = 'DataRouter';
var li = _.createContext(null);
li.displayName = 'DataRouterState';
_.createContext(!1);
var th = _.createContext({ isTransitioning: !1 });
th.displayName = 'ViewTransition';
var mv = _.createContext(new Map());
mv.displayName = 'Fetchers';
var vv = _.createContext(null);
vv.displayName = 'Await';
var xe = _.createContext(null);
xe.displayName = 'Navigation';
var Uu = _.createContext(null);
Uu.displayName = 'Location';
var $e = _.createContext({ outlet: null, matches: [], isDataRoute: !1 });
$e.displayName = 'Route';
var Uf = _.createContext(null);
Uf.displayName = 'RouteError';
function yv(i, { relative: o } = {}) {
  Tt(
    Nu(),
    'useHref() may be used only in the context of a <Router> component.'
  );
  let { basename: s, navigator: r } = _.useContext(xe),
    { hash: h, pathname: g, search: E } = Hu(i, { relative: o }),
    O = g;
  return (
    s !== '/' && (O = g === '/' ? s : Ke([s, g])),
    r.createHref({ pathname: O, search: E, hash: h })
  );
}
function Nu() {
  return _.useContext(Uu) != null;
}
function Ll() {
  return (
    Tt(
      Nu(),
      'useLocation() may be used only in the context of a <Router> component.'
    ),
    _.useContext(Uu).location
  );
}
var eh =
  'You should call navigate() in a React.useEffect(), not when your component is first rendered.';
function lh(i) {
  _.useContext(xe).static || _.useLayoutEffect(i);
}
function gv() {
  let { isDataRoute: i } = _.useContext($e);
  return i ? xv() : Sv();
}
function Sv() {
  Tt(
    Nu(),
    'useNavigate() may be used only in the context of a <Router> component.'
  );
  let i = _.useContext(Da),
    { basename: o, navigator: s } = _.useContext(xe),
    { matches: r } = _.useContext($e),
    { pathname: h } = Ll(),
    g = JSON.stringify(Fd(r)),
    E = _.useRef(!1);
  return (
    lh(() => {
      E.current = !0;
    }),
    _.useCallback(
      (b, m = {}) => {
        if ((_e(E.current, eh), !E.current)) return;
        if (typeof b == 'number') {
          s.go(b);
          return;
        }
        let R = Pd(b, JSON.parse(g), h, m.relative === 'path');
        (i == null &&
          o !== '/' &&
          (R.pathname = R.pathname === '/' ? o : Ke([o, R.pathname])),
          (m.replace ? s.replace : s.push)(R, m.state, m));
      },
      [o, s, g, h, i]
    )
  );
}
_.createContext(null);
function Hu(i, { relative: o } = {}) {
  let { matches: s } = _.useContext($e),
    { pathname: r } = Ll(),
    h = JSON.stringify(Fd(s));
  return _.useMemo(() => Pd(i, JSON.parse(h), r, o === 'path'), [i, h, r, o]);
}
function bv(i, o) {
  return ah(i, o);
}
function ah(i, o, s, r, h) {
  Tt(
    Nu(),
    'useRoutes() may be used only in the context of a <Router> component.'
  );
  let { navigator: g } = _.useContext(xe),
    { matches: E } = _.useContext($e),
    O = E[E.length - 1],
    b = O ? O.params : {},
    m = O ? O.pathname : '/',
    R = O ? O.pathnameBase : '/',
    H = O && O.route;
  {
    let B = (H && H.path) || '';
    uh(
      m,
      !H || B.endsWith('*') || B.endsWith('*?'),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${m}" (under <Route path="${B}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${B}"> to <Route path="${B === '/' ? '*' : `${B}/*`}">.`
    );
  }
  let C = Ll(),
    G;
  if (o) {
    let B = typeof o == 'string' ? za(o) : o;
    (Tt(
      R === '/' || B.pathname?.startsWith(R),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${R}" but pathname "${B.pathname}" was given in the \`location\` prop.`
    ),
      (G = B));
  } else G = C;
  let V = G.pathname || '/',
    F = V;
  if (R !== '/') {
    let B = R.replace(/^\//, '').split('/');
    F = '/' + V.replace(/^\//, '').split('/').slice(B.length).join('/');
  }
  let L = $d(i, { pathname: F });
  (_e(
    H || L != null,
    `No routes matched location "${G.pathname}${G.search}${G.hash}" `
  ),
    _e(
      L == null ||
        L[L.length - 1].route.element !== void 0 ||
        L[L.length - 1].route.Component !== void 0 ||
        L[L.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${G.pathname}${G.search}${G.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
    ));
  let Y = Av(
    L &&
      L.map((B) =>
        Object.assign({}, B, {
          params: Object.assign({}, b, B.params),
          pathname: Ke([
            R,
            g.encodeLocation
              ? g.encodeLocation(
                  B.pathname.replace(/\?/g, '%3F').replace(/#/g, '%23')
                ).pathname
              : B.pathname,
          ]),
          pathnameBase:
            B.pathnameBase === '/'
              ? R
              : Ke([
                  R,
                  g.encodeLocation
                    ? g.encodeLocation(
                        B.pathnameBase
                          .replace(/\?/g, '%3F')
                          .replace(/#/g, '%23')
                      ).pathname
                    : B.pathnameBase,
                ]),
        })
      ),
    E,
    s,
    r,
    h
  );
  return o && Y
    ? _.createElement(
        Uu.Provider,
        {
          value: {
            location: {
              pathname: '/',
              search: '',
              hash: '',
              state: null,
              key: 'default',
              ...G,
            },
            navigationType: 'POP',
          },
        },
        Y
      )
    : Y;
}
function pv() {
  let i = _v(),
    o = dv(i)
      ? `${i.status} ${i.statusText}`
      : i instanceof Error
        ? i.message
        : JSON.stringify(i),
    s = i instanceof Error ? i.stack : null,
    r = 'rgba(200,200,200, 0.5)',
    h = { padding: '0.5rem', backgroundColor: r },
    g = { padding: '2px 4px', backgroundColor: r },
    E = null;
  return (
    console.error('Error handled by React Router default ErrorBoundary:', i),
    (E = _.createElement(
      _.Fragment,
      null,
      _.createElement('p', null, '💿 Hey developer 👋'),
      _.createElement(
        'p',
        null,
        'You can provide a way better UX than this when your app throws errors by providing your own ',
        _.createElement('code', { style: g }, 'ErrorBoundary'),
        ' or',
        ' ',
        _.createElement('code', { style: g }, 'errorElement'),
        ' prop on your route.'
      )
    )),
    _.createElement(
      _.Fragment,
      null,
      _.createElement('h2', null, 'Unexpected Application Error!'),
      _.createElement('h3', { style: { fontStyle: 'italic' } }, o),
      s ? _.createElement('pre', { style: h }, s) : null,
      E
    )
  );
}
var Ev = _.createElement(pv, null),
  Tv = class extends _.Component {
    constructor(i) {
      (super(i),
        (this.state = {
          location: i.location,
          revalidation: i.revalidation,
          error: i.error,
        }));
    }
    static getDerivedStateFromError(i) {
      return { error: i };
    }
    static getDerivedStateFromProps(i, o) {
      return o.location !== i.location ||
        (o.revalidation !== 'idle' && i.revalidation === 'idle')
        ? { error: i.error, location: i.location, revalidation: i.revalidation }
        : {
            error: i.error !== void 0 ? i.error : o.error,
            location: o.location,
            revalidation: i.revalidation || o.revalidation,
          };
    }
    componentDidCatch(i, o) {
      this.props.unstable_onError
        ? this.props.unstable_onError(i, o)
        : console.error(
            'React Router caught the following error during render',
            i
          );
    }
    render() {
      return this.state.error !== void 0
        ? _.createElement(
            $e.Provider,
            { value: this.props.routeContext },
            _.createElement(Uf.Provider, {
              value: this.state.error,
              children: this.props.component,
            })
          )
        : this.props.children;
    }
  };
function Rv({ routeContext: i, match: o, children: s }) {
  let r = _.useContext(Da);
  return (
    r &&
      r.static &&
      r.staticContext &&
      (o.route.errorElement || o.route.ErrorBoundary) &&
      (r.staticContext._deepestRenderedBoundaryId = o.route.id),
    _.createElement($e.Provider, { value: i }, s)
  );
}
function Av(i, o = [], s = null, r = null, h = null) {
  if (i == null) {
    if (!s) return null;
    if (s.errors) i = s.matches;
    else if (o.length === 0 && !s.initialized && s.matches.length > 0)
      i = s.matches;
    else return null;
  }
  let g = i,
    E = s?.errors;
  if (E != null) {
    let m = g.findIndex((R) => R.route.id && E?.[R.route.id] !== void 0);
    (Tt(
      m >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(E).join(',')}`
    ),
      (g = g.slice(0, Math.min(g.length, m + 1))));
  }
  let O = !1,
    b = -1;
  if (s)
    for (let m = 0; m < g.length; m++) {
      let R = g[m];
      if (
        ((R.route.HydrateFallback || R.route.hydrateFallbackElement) && (b = m),
        R.route.id)
      ) {
        let { loaderData: H, errors: C } = s,
          G =
            R.route.loader &&
            !H.hasOwnProperty(R.route.id) &&
            (!C || C[R.route.id] === void 0);
        if (R.route.lazy || G) {
          ((O = !0), b >= 0 ? (g = g.slice(0, b + 1)) : (g = [g[0]]));
          break;
        }
      }
    }
  return g.reduceRight((m, R, H) => {
    let C,
      G = !1,
      V = null,
      F = null;
    s &&
      ((C = E && R.route.id ? E[R.route.id] : void 0),
      (V = R.route.errorElement || Ev),
      O &&
        (b < 0 && H === 0
          ? (uh(
              'route-fallback',
              !1,
              'No `HydrateFallback` element provided to render during initial hydration'
            ),
            (G = !0),
            (F = null))
          : b === H &&
            ((G = !0), (F = R.route.hydrateFallbackElement || null))));
    let L = o.concat(g.slice(0, H + 1)),
      Y = () => {
        let B;
        return (
          C
            ? (B = V)
            : G
              ? (B = F)
              : R.route.Component
                ? (B = _.createElement(R.route.Component, null))
                : R.route.element
                  ? (B = R.route.element)
                  : (B = m),
          _.createElement(Rv, {
            match: R,
            routeContext: { outlet: m, matches: L, isDataRoute: s != null },
            children: B,
          })
        );
      };
    return s && (R.route.ErrorBoundary || R.route.errorElement || H === 0)
      ? _.createElement(Tv, {
          location: s.location,
          revalidation: s.revalidation,
          component: V,
          error: C,
          children: Y(),
          routeContext: { outlet: null, matches: L, isDataRoute: !0 },
          unstable_onError: r,
        })
      : Y();
  }, null);
}
function Nf(i) {
  return `${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function Mv(i) {
  let o = _.useContext(Da);
  return (Tt(o, Nf(i)), o);
}
function Ov(i) {
  let o = _.useContext(li);
  return (Tt(o, Nf(i)), o);
}
function zv(i) {
  let o = _.useContext($e);
  return (Tt(o, Nf(i)), o);
}
function Hf(i) {
  let o = zv(i),
    s = o.matches[o.matches.length - 1];
  return (
    Tt(
      s.route.id,
      `${i} can only be used on routes that contain a unique "id"`
    ),
    s.route.id
  );
}
function Dv() {
  return Hf('useRouteId');
}
function _v() {
  let i = _.useContext(Uf),
    o = Ov('useRouteError'),
    s = Hf('useRouteError');
  return i !== void 0 ? i : o.errors?.[s];
}
function xv() {
  let { router: i } = Mv('useNavigate'),
    o = Hf('useNavigate'),
    s = _.useRef(!1);
  return (
    lh(() => {
      s.current = !0;
    }),
    _.useCallback(
      async (h, g = {}) => {
        (_e(s.current, eh),
          s.current &&
            (typeof h == 'number'
              ? i.navigate(h)
              : await i.navigate(h, { fromRouteId: o, ...g })));
      },
      [i, o]
    )
  );
}
var Qd = {};
function uh(i, o, s) {
  !o && !Qd[i] && ((Qd[i] = !0), _e(!1, s));
}
_.memo(Uv);
function Uv({ routes: i, future: o, state: s, unstable_onError: r }) {
  return ah(i, void 0, s, r, o);
}
function Fn(i) {
  Tt(
    !1,
    'A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.'
  );
}
function Nv({
  basename: i = '/',
  children: o = null,
  location: s,
  navigationType: r = 'POP',
  navigator: h,
  static: g = !1,
}) {
  Tt(
    !Nu(),
    'You cannot render a <Router> inside another <Router>. You should never have more than one in your app.'
  );
  let E = i.replace(/^\/*/, '/'),
    O = _.useMemo(
      () => ({ basename: E, navigator: h, static: g, future: {} }),
      [E, h, g]
    );
  typeof s == 'string' && (s = za(s));
  let {
      pathname: b = '/',
      search: m = '',
      hash: R = '',
      state: H = null,
      key: C = 'default',
    } = s,
    G = _.useMemo(() => {
      let V = Je(b, E);
      return V == null
        ? null
        : {
            location: { pathname: V, search: m, hash: R, state: H, key: C },
            navigationType: r,
          };
    }, [E, b, m, R, H, C, r]);
  return (
    _e(
      G != null,
      `<Router basename="${E}"> is not able to match the URL "${b}${m}${R}" because it does not start with the basename, so the <Router> won't render anything.`
    ),
    G == null
      ? null
      : _.createElement(
          xe.Provider,
          { value: O },
          _.createElement(Uu.Provider, { children: o, value: G })
        )
  );
}
function Hv({ children: i, location: o }) {
  return bv(_f(i), o);
}
function _f(i, o = []) {
  let s = [];
  return (
    _.Children.forEach(i, (r, h) => {
      if (!_.isValidElement(r)) return;
      let g = [...o, h];
      if (r.type === _.Fragment) {
        s.push.apply(s, _f(r.props.children, g));
        return;
      }
      (Tt(
        r.type === Fn,
        `[${typeof r.type == 'string' ? r.type : r.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
      ),
        Tt(
          !r.props.index || !r.props.children,
          'An index route cannot have child routes.'
        ));
      let E = {
        id: r.props.id || g.join('-'),
        caseSensitive: r.props.caseSensitive,
        element: r.props.element,
        Component: r.props.Component,
        index: r.props.index,
        path: r.props.path,
        middleware: r.props.middleware,
        loader: r.props.loader,
        action: r.props.action,
        hydrateFallbackElement: r.props.hydrateFallbackElement,
        HydrateFallback: r.props.HydrateFallback,
        errorElement: r.props.errorElement,
        ErrorBoundary: r.props.ErrorBoundary,
        hasErrorBoundary:
          r.props.hasErrorBoundary === !0 ||
          r.props.ErrorBoundary != null ||
          r.props.errorElement != null,
        shouldRevalidate: r.props.shouldRevalidate,
        handle: r.props.handle,
        lazy: r.props.lazy,
      };
      (r.props.children && (E.children = _f(r.props.children, g)), s.push(E));
    }),
    s
  );
}
var Pn = 'get',
  In = 'application/x-www-form-urlencoded';
function ai(i) {
  return i != null && typeof i.tagName == 'string';
}
function Cv(i) {
  return ai(i) && i.tagName.toLowerCase() === 'button';
}
function Bv(i) {
  return ai(i) && i.tagName.toLowerCase() === 'form';
}
function qv(i) {
  return ai(i) && i.tagName.toLowerCase() === 'input';
}
function Yv(i) {
  return !!(i.metaKey || i.altKey || i.ctrlKey || i.shiftKey);
}
function jv(i, o) {
  return i.button === 0 && (!o || o === '_self') && !Yv(i);
}
var Wn = null;
function Gv() {
  if (Wn === null)
    try {
      (new FormData(document.createElement('form'), 0), (Wn = !1));
    } catch {
      Wn = !0;
    }
  return Wn;
}
var Xv = new Set([
  'application/x-www-form-urlencoded',
  'multipart/form-data',
  'text/plain',
]);
function zf(i) {
  return i != null && !Xv.has(i)
    ? (_e(
        !1,
        `"${i}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${In}"`
      ),
      null)
    : i;
}
function Lv(i, o) {
  let s, r, h, g, E;
  if (Bv(i)) {
    let O = i.getAttribute('action');
    ((r = O ? Je(O, o) : null),
      (s = i.getAttribute('method') || Pn),
      (h = zf(i.getAttribute('enctype')) || In),
      (g = new FormData(i)));
  } else if (Cv(i) || (qv(i) && (i.type === 'submit' || i.type === 'image'))) {
    let O = i.form;
    if (O == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let b = i.getAttribute('formaction') || O.getAttribute('action');
    if (
      ((r = b ? Je(b, o) : null),
      (s = i.getAttribute('formmethod') || O.getAttribute('method') || Pn),
      (h =
        zf(i.getAttribute('formenctype')) ||
        zf(O.getAttribute('enctype')) ||
        In),
      (g = new FormData(O, i)),
      !Gv())
    ) {
      let { name: m, type: R, value: H } = i;
      if (R === 'image') {
        let C = m ? `${m}.` : '';
        (g.append(`${C}x`, '0'), g.append(`${C}y`, '0'));
      } else m && g.append(m, H);
    }
  } else {
    if (ai(i))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    ((s = Pn), (r = null), (h = In), (E = i));
  }
  return (
    g && h === 'text/plain' && ((E = g), (g = void 0)),
    { action: r, method: s.toLowerCase(), encType: h, formData: g, body: E }
  );
}
Object.getOwnPropertyNames(Object.prototype).sort().join('\0');
function Cf(i, o) {
  if (i === !1 || i === null || typeof i > 'u') throw new Error(o);
}
function Qv(i, o, s) {
  let r =
    typeof i == 'string'
      ? new URL(
          i,
          typeof window > 'u' ? 'server://singlefetch/' : window.location.origin
        )
      : i;
  return (
    r.pathname === '/'
      ? (r.pathname = `_root.${s}`)
      : o && Je(r.pathname, o) === '/'
        ? (r.pathname = `${o.replace(/\/$/, '')}/_root.${s}`)
        : (r.pathname = `${r.pathname.replace(/\/$/, '')}.${s}`),
    r
  );
}
async function Zv(i, o) {
  if (i.id in o) return o[i.id];
  try {
    let s = await import(i.module);
    return ((o[i.id] = s), s);
  } catch (s) {
    return (
      console.error(
        `Error loading route module \`${i.module}\`, reloading page...`
      ),
      console.error(s),
      window.__reactRouterContext && window.__reactRouterContext.isSpaMode,
      window.location.reload(),
      new Promise(() => {})
    );
  }
}
function Vv(i) {
  return i == null
    ? !1
    : i.href == null
      ? i.rel === 'preload' &&
        typeof i.imageSrcSet == 'string' &&
        typeof i.imageSizes == 'string'
      : typeof i.rel == 'string' && typeof i.href == 'string';
}
async function wv(i, o, s) {
  let r = await Promise.all(
    i.map(async (h) => {
      let g = o.routes[h.route.id];
      if (g) {
        let E = await Zv(g, s);
        return E.links ? E.links() : [];
      }
      return [];
    })
  );
  return kv(
    r
      .flat(1)
      .filter(Vv)
      .filter((h) => h.rel === 'stylesheet' || h.rel === 'preload')
      .map((h) =>
        h.rel === 'stylesheet'
          ? { ...h, rel: 'prefetch', as: 'style' }
          : { ...h, rel: 'prefetch' }
      )
  );
}
function Zd(i, o, s, r, h, g) {
  let E = (b, m) => (s[m] ? b.route.id !== s[m].route.id : !0),
    O = (b, m) =>
      s[m].pathname !== b.pathname ||
      (s[m].route.path?.endsWith('*') && s[m].params['*'] !== b.params['*']);
  return g === 'assets'
    ? o.filter((b, m) => E(b, m) || O(b, m))
    : g === 'data'
      ? o.filter((b, m) => {
          let R = r.routes[b.route.id];
          if (!R || !R.hasLoader) return !1;
          if (E(b, m) || O(b, m)) return !0;
          if (b.route.shouldRevalidate) {
            let H = b.route.shouldRevalidate({
              currentUrl: new URL(
                h.pathname + h.search + h.hash,
                window.origin
              ),
              currentParams: s[0]?.params || {},
              nextUrl: new URL(i, window.origin),
              nextParams: b.params,
              defaultShouldRevalidate: !0,
            });
            if (typeof H == 'boolean') return H;
          }
          return !0;
        })
      : [];
}
function Kv(i, o, { includeHydrateFallback: s } = {}) {
  return Jv(
    i
      .map((r) => {
        let h = o.routes[r.route.id];
        if (!h) return [];
        let g = [h.module];
        return (
          h.clientActionModule && (g = g.concat(h.clientActionModule)),
          h.clientLoaderModule && (g = g.concat(h.clientLoaderModule)),
          s &&
            h.hydrateFallbackModule &&
            (g = g.concat(h.hydrateFallbackModule)),
          h.imports && (g = g.concat(h.imports)),
          g
        );
      })
      .flat(1)
  );
}
function Jv(i) {
  return [...new Set(i)];
}
function $v(i) {
  let o = {},
    s = Object.keys(i).sort();
  for (let r of s) o[r] = i[r];
  return o;
}
function kv(i, o) {
  let s = new Set();
  return (
    new Set(o),
    i.reduce((r, h) => {
      let g = JSON.stringify($v(h));
      return (s.has(g) || (s.add(g), r.push({ key: g, link: h })), r);
    }, [])
  );
}
function nh() {
  let i = _.useContext(Da);
  return (
    Cf(
      i,
      'You must render this element inside a <DataRouterContext.Provider> element'
    ),
    i
  );
}
function Wv() {
  let i = _.useContext(li);
  return (
    Cf(
      i,
      'You must render this element inside a <DataRouterStateContext.Provider> element'
    ),
    i
  );
}
var Bf = _.createContext(void 0);
Bf.displayName = 'FrameworkContext';
function ih() {
  let i = _.useContext(Bf);
  return (
    Cf(i, 'You must render this element inside a <HydratedRouter> element'),
    i
  );
}
function Fv(i, o) {
  let s = _.useContext(Bf),
    [r, h] = _.useState(!1),
    [g, E] = _.useState(!1),
    {
      onFocus: O,
      onBlur: b,
      onMouseEnter: m,
      onMouseLeave: R,
      onTouchStart: H,
    } = o,
    C = _.useRef(null);
  (_.useEffect(() => {
    if ((i === 'render' && E(!0), i === 'viewport')) {
      let F = (Y) => {
          Y.forEach((B) => {
            E(B.isIntersecting);
          });
        },
        L = new IntersectionObserver(F, { threshold: 0.5 });
      return (
        C.current && L.observe(C.current),
        () => {
          L.disconnect();
        }
      );
    }
  }, [i]),
    _.useEffect(() => {
      if (r) {
        let F = setTimeout(() => {
          E(!0);
        }, 100);
        return () => {
          clearTimeout(F);
        };
      }
    }, [r]));
  let G = () => {
      h(!0);
    },
    V = () => {
      (h(!1), E(!1));
    };
  return s
    ? i !== 'intent'
      ? [g, C, {}]
      : [
          g,
          C,
          {
            onFocus: Du(O, G),
            onBlur: Du(b, V),
            onMouseEnter: Du(m, G),
            onMouseLeave: Du(R, V),
            onTouchStart: Du(H, G),
          },
        ]
    : [!1, C, {}];
}
function Du(i, o) {
  return (s) => {
    (i && i(s), s.defaultPrevented || o(s));
  };
}
function Pv({ page: i, ...o }) {
  let { router: s } = nh(),
    r = _.useMemo(() => $d(s.routes, i, s.basename), [s.routes, i, s.basename]);
  return r ? _.createElement(ty, { page: i, matches: r, ...o }) : null;
}
function Iv(i) {
  let { manifest: o, routeModules: s } = ih(),
    [r, h] = _.useState([]);
  return (
    _.useEffect(() => {
      let g = !1;
      return (
        wv(i, o, s).then((E) => {
          g || h(E);
        }),
        () => {
          g = !0;
        }
      );
    }, [i, o, s]),
    r
  );
}
function ty({ page: i, matches: o, ...s }) {
  let r = Ll(),
    { manifest: h, routeModules: g } = ih(),
    { basename: E } = nh(),
    { loaderData: O, matches: b } = Wv(),
    m = _.useMemo(() => Zd(i, o, b, h, r, 'data'), [i, o, b, h, r]),
    R = _.useMemo(() => Zd(i, o, b, h, r, 'assets'), [i, o, b, h, r]),
    H = _.useMemo(() => {
      if (i === r.pathname + r.search + r.hash) return [];
      let V = new Set(),
        F = !1;
      if (
        (o.forEach((Y) => {
          let B = h.routes[Y.route.id];
          !B ||
            !B.hasLoader ||
            ((!m.some((w) => w.route.id === Y.route.id) &&
              Y.route.id in O &&
              g[Y.route.id]?.shouldRevalidate) ||
            B.hasClientLoader
              ? (F = !0)
              : V.add(Y.route.id));
        }),
        V.size === 0)
      )
        return [];
      let L = Qv(i, E, 'data');
      return (
        F &&
          V.size > 0 &&
          L.searchParams.set(
            '_routes',
            o
              .filter((Y) => V.has(Y.route.id))
              .map((Y) => Y.route.id)
              .join(',')
          ),
        [L.pathname + L.search]
      );
    }, [E, O, r, h, m, o, i, g]),
    C = _.useMemo(() => Kv(R, h), [R, h]),
    G = Iv(R);
  return _.createElement(
    _.Fragment,
    null,
    H.map((V) =>
      _.createElement('link', {
        key: V,
        rel: 'prefetch',
        as: 'fetch',
        href: V,
        ...s,
      })
    ),
    C.map((V) =>
      _.createElement('link', { key: V, rel: 'modulepreload', href: V, ...s })
    ),
    G.map(({ key: V, link: F }) =>
      _.createElement('link', { key: V, nonce: s.nonce, ...F })
    )
  );
}
function ey(...i) {
  return (o) => {
    i.forEach((s) => {
      typeof s == 'function' ? s(o) : s != null && (s.current = o);
    });
  };
}
var ch =
  typeof window < 'u' &&
  typeof window.document < 'u' &&
  typeof window.document.createElement < 'u';
try {
  ch && (window.__reactRouterVersion = '7.9.3');
} catch {}
function ly({ basename: i, children: o, window: s }) {
  let r = _.useRef();
  r.current == null && (r.current = Z0({ window: s, v5Compat: !0 }));
  let h = r.current,
    [g, E] = _.useState({ action: h.action, location: h.location }),
    O = _.useCallback(
      (b) => {
        _.startTransition(() => E(b));
      },
      [E]
    );
  return (
    _.useLayoutEffect(() => h.listen(O), [h, O]),
    _.createElement(Nv, {
      basename: i,
      children: o,
      location: g.location,
      navigationType: g.action,
      navigator: h,
    })
  );
}
var fh = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  ei = _.forwardRef(function (
    {
      onClick: o,
      discover: s = 'render',
      prefetch: r = 'none',
      relative: h,
      reloadDocument: g,
      replace: E,
      state: O,
      target: b,
      to: m,
      preventScrollReset: R,
      viewTransition: H,
      ...C
    },
    G
  ) {
    let { basename: V } = _.useContext(xe),
      F = typeof m == 'string' && fh.test(m),
      L,
      Y = !1;
    if (typeof m == 'string' && F && ((L = m), ch))
      try {
        let Rt = new URL(window.location.href),
          It = m.startsWith('//') ? new URL(Rt.protocol + m) : new URL(m),
          oe = Je(It.pathname, V);
        It.origin === Rt.origin && oe != null
          ? (m = oe + It.search + It.hash)
          : (Y = !0);
      } catch {
        _e(
          !1,
          `<Link to="${m}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
        );
      }
    let B = yv(m, { relative: h }),
      [w, ct, K] = Fv(r, C),
      _t = iy(m, {
        replace: E,
        state: O,
        target: b,
        preventScrollReset: R,
        relative: h,
        viewTransition: H,
      });
    function Ot(Rt) {
      (o && o(Rt), Rt.defaultPrevented || _t(Rt));
    }
    let Ct = _.createElement('a', {
      ...C,
      ...K,
      href: L || B,
      onClick: Y || g ? o : Ot,
      ref: ey(G, ct),
      target: b,
      'data-discover': !F && s === 'render' ? 'true' : void 0,
    });
    return w && !F
      ? _.createElement(_.Fragment, null, Ct, _.createElement(Pv, { page: B }))
      : Ct;
  });
ei.displayName = 'Link';
var ay = _.forwardRef(function (
  {
    'aria-current': o = 'page',
    caseSensitive: s = !1,
    className: r = '',
    end: h = !1,
    style: g,
    to: E,
    viewTransition: O,
    children: b,
    ...m
  },
  R
) {
  let H = Hu(E, { relative: m.relative }),
    C = Ll(),
    G = _.useContext(li),
    { navigator: V, basename: F } = _.useContext(xe),
    L = G != null && sy(H) && O === !0,
    Y = V.encodeLocation ? V.encodeLocation(H).pathname : H.pathname,
    B = C.pathname,
    w =
      G && G.navigation && G.navigation.location
        ? G.navigation.location.pathname
        : null;
  (s ||
    ((B = B.toLowerCase()),
    (w = w ? w.toLowerCase() : null),
    (Y = Y.toLowerCase())),
    w && F && (w = Je(w, F) || w));
  const ct = Y !== '/' && Y.endsWith('/') ? Y.length - 1 : Y.length;
  let K = B === Y || (!h && B.startsWith(Y) && B.charAt(ct) === '/'),
    _t =
      w != null &&
      (w === Y || (!h && w.startsWith(Y) && w.charAt(Y.length) === '/')),
    Ot = { isActive: K, isPending: _t, isTransitioning: L },
    Ct = K ? o : void 0,
    Rt;
  typeof r == 'function'
    ? (Rt = r(Ot))
    : (Rt = [
        r,
        K ? 'active' : null,
        _t ? 'pending' : null,
        L ? 'transitioning' : null,
      ]
        .filter(Boolean)
        .join(' '));
  let It = typeof g == 'function' ? g(Ot) : g;
  return _.createElement(
    ei,
    {
      ...m,
      'aria-current': Ct,
      className: Rt,
      ref: R,
      style: It,
      to: E,
      viewTransition: O,
    },
    typeof b == 'function' ? b(Ot) : b
  );
});
ay.displayName = 'NavLink';
var uy = _.forwardRef(
  (
    {
      discover: i = 'render',
      fetcherKey: o,
      navigate: s,
      reloadDocument: r,
      replace: h,
      state: g,
      method: E = Pn,
      action: O,
      onSubmit: b,
      relative: m,
      preventScrollReset: R,
      viewTransition: H,
      ...C
    },
    G
  ) => {
    let V = ry(),
      F = oy(O, { relative: m }),
      L = E.toLowerCase() === 'get' ? 'get' : 'post',
      Y = typeof O == 'string' && fh.test(O),
      B = (w) => {
        if ((b && b(w), w.defaultPrevented)) return;
        w.preventDefault();
        let ct = w.nativeEvent.submitter,
          K = ct?.getAttribute('formmethod') || E;
        V(ct || w.currentTarget, {
          fetcherKey: o,
          method: K,
          navigate: s,
          replace: h,
          state: g,
          relative: m,
          preventScrollReset: R,
          viewTransition: H,
        });
      };
    return _.createElement('form', {
      ref: G,
      method: L,
      action: F,
      onSubmit: r ? b : B,
      ...C,
      'data-discover': !Y && i === 'render' ? 'true' : void 0,
    });
  }
);
uy.displayName = 'Form';
function ny(i) {
  return `${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function rh(i) {
  let o = _.useContext(Da);
  return (Tt(o, ny(i)), o);
}
function iy(
  i,
  {
    target: o,
    replace: s,
    state: r,
    preventScrollReset: h,
    relative: g,
    viewTransition: E,
  } = {}
) {
  let O = gv(),
    b = Ll(),
    m = Hu(i, { relative: g });
  return _.useCallback(
    (R) => {
      if (jv(R, o)) {
        R.preventDefault();
        let H = s !== void 0 ? s : xu(b) === xu(m);
        O(i, {
          replace: H,
          state: r,
          preventScrollReset: h,
          relative: g,
          viewTransition: E,
        });
      }
    },
    [b, O, m, s, r, o, i, h, g, E]
  );
}
var cy = 0,
  fy = () => `__${String(++cy)}__`;
function ry() {
  let { router: i } = rh('useSubmit'),
    { basename: o } = _.useContext(xe),
    s = Dv();
  return _.useCallback(
    async (r, h = {}) => {
      let { action: g, method: E, encType: O, formData: b, body: m } = Lv(r, o);
      if (h.navigate === !1) {
        let R = h.fetcherKey || fy();
        await i.fetch(R, s, h.action || g, {
          preventScrollReset: h.preventScrollReset,
          formData: b,
          body: m,
          formMethod: h.method || E,
          formEncType: h.encType || O,
          flushSync: h.flushSync,
        });
      } else
        await i.navigate(h.action || g, {
          preventScrollReset: h.preventScrollReset,
          formData: b,
          body: m,
          formMethod: h.method || E,
          formEncType: h.encType || O,
          replace: h.replace,
          state: h.state,
          fromRouteId: s,
          flushSync: h.flushSync,
          viewTransition: h.viewTransition,
        });
    },
    [i, o, s]
  );
}
function oy(i, { relative: o } = {}) {
  let { basename: s } = _.useContext(xe),
    r = _.useContext($e);
  Tt(r, 'useFormAction must be used inside a RouteContext');
  let [h] = r.matches.slice(-1),
    g = { ...Hu(i || '.', { relative: o }) },
    E = Ll();
  if (i == null) {
    g.search = E.search;
    let O = new URLSearchParams(g.search),
      b = O.getAll('index');
    if (b.some((R) => R === '')) {
      (O.delete('index'),
        b.filter((H) => H).forEach((H) => O.append('index', H)));
      let R = O.toString();
      g.search = R ? `?${R}` : '';
    }
  }
  return (
    (!i || i === '.') &&
      h.route.index &&
      (g.search = g.search ? g.search.replace(/^\?/, '?index&') : '?index'),
    s !== '/' && (g.pathname = g.pathname === '/' ? s : Ke([s, g.pathname])),
    xu(g)
  );
}
function sy(i, { relative: o } = {}) {
  let s = _.useContext(th);
  Tt(
    s != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: r } = rh('useViewTransitionState'),
    h = Hu(i, { relative: o });
  if (!s.isTransitioning) return !1;
  let g = Je(s.currentLocation.pathname, r) || s.currentLocation.pathname,
    E = Je(s.nextLocation.pathname, r) || s.nextLocation.pathname;
  return ti(h.pathname, E) != null || ti(h.pathname, g) != null;
}
const dy = () =>
    nt.jsxs('div', {
      className: 'container mx-auto p-4 text-center',
      children: [
        nt.jsx('h1', {
          className: 'text-3xl font-bold mb-6',
          children: 'はかったけ',
        }),
        nt.jsx('p', {
          className: 'mb-8',
          children: 'ブラウザで手軽に測定・記録',
        }),
        nt.jsxs('div', {
          className: 'space-y-4',
          children: [
            nt.jsx(ei, {
              to: '/measure',
              className: 'btn btn-primary btn-lg w-full',
              children: '計測モード',
            }),
            nt.jsx(ei, {
              to: '/growth-record',
              className: 'btn btn-secondary btn-lg w-full',
              children: '成長記録モード',
            }),
          ],
        }),
      ],
    }),
  Vd = (i) => {
    let o;
    const s = new Set(),
      r = (m, R) => {
        const H = typeof m == 'function' ? m(o) : m;
        if (!Object.is(H, o)) {
          const C = o;
          ((o =
            (R ?? (typeof H != 'object' || H === null))
              ? H
              : Object.assign({}, o, H)),
            s.forEach((G) => G(o, C)));
        }
      },
      h = () => o,
      O = {
        setState: r,
        getState: h,
        getInitialState: () => b,
        subscribe: (m) => (s.add(m), () => s.delete(m)),
      },
      b = (o = i(r, h, O));
    return O;
  },
  hy = (i) => (i ? Vd(i) : Vd),
  my = (i) => i;
function vy(i, o = my) {
  const s = _u.useSyncExternalStore(
    i.subscribe,
    _u.useCallback(() => o(i.getState()), [i, o]),
    _u.useCallback(() => o(i.getInitialState()), [i, o])
  );
  return (_u.useDebugValue(s), s);
}
const wd = (i) => {
    const o = hy(i),
      s = (r) => vy(o, r);
    return (Object.assign(s, o), s);
  },
  yy = (i) => (i ? wd(i) : wd),
  gy = yy((i) => ({
    measureMode: 'furniture',
    scale: null,
    error: null,
    points: [],
    measurement: null,
    unit: 'cm',
    setMeasureMode: (o) => i({ measureMode: o }),
    setScale: (o) => i({ scale: o }),
    setError: (o) => i({ error: o }),
    addPoint: (o) => i((s) => ({ points: [...s.points, o] })),
    clearPoints: () => i({ points: [], measurement: null }),
    setMeasurement: (o) => i({ measurement: o }),
    setUnit: (o) => i({ unit: o }),
  })),
  Sy = (i, o) => {
    const s = o.getBoundingClientRect(),
      r = o.naturalWidth ?? o.videoWidth ?? 0,
      h = o.naturalHeight ?? o.videoHeight ?? 0,
      g = r / s.width,
      E = h / s.height,
      O = (i.clientX - s.left) * g,
      b = (i.clientY - s.top) * E;
    return { x: O, y: b };
  },
  by = (i, o, s) => {
    const r = o.x - i.x,
      h = o.y - i.y;
    return Math.sqrt(r * r + h * h) * s;
  },
  Kd = (i, o) => {
    let s;
    switch (o) {
      case 'cm':
        s = i / 10;
        break;
      case 'm':
        s = i / 1e3;
        break;
      default:
        return '';
    }
    return `${(Math.round(s * 10) / 10).toFixed(1)} ${o}`;
  },
  py = (i) => {
    const o = i.data;
    let s = 0;
    const r = o.length / 4;
    for (let g = 0; g < o.length; g += 4) {
      const E = o[g],
        O = o[g + 1],
        b = o[g + 2],
        m = (E * 299 + O * 587 + b * 114) / 1e3;
      s += m;
    }
    return s / r >= 128 ? '#000000' : '#FFFFFF';
  },
  Ey = 'rgba(255, 255, 255, 0.7)',
  pl = 10,
  Ty = (i, o, s, r = '#FF007F', h = 5, g = 10) => {
    (i.beginPath(),
      (i.strokeStyle = r),
      (i.fillStyle = r),
      (i.lineWidth = h),
      i.moveTo(o.x, o.y),
      i.lineTo(s.x, s.y),
      i.stroke(),
      i.beginPath(),
      i.arc(o.x, o.y, g, 0, Math.PI * 2),
      i.fill(),
      i.beginPath(),
      i.arc(s.x, s.y, g, 0, Math.PI * 2),
      i.fill());
  },
  Ry = (i, o, s, r, h = 48, g = 'sans-serif') => {
    i.font = `${h}px ${g}`;
    const O = i.measureText(o).width,
      b = h,
      m = s - O / 2,
      R = r - b / 2,
      H = i.getImageData(m - pl, R - pl, O + pl * 2, b + pl * 2),
      C = py(H);
    ((i.fillStyle = Ey),
      i.fillRect(m - pl, R - pl, O + pl * 2, b + pl * 2),
      (i.fillStyle = C),
      (i.textAlign = 'center'),
      (i.textBaseline = 'middle'),
      i.fillText(o, s, r));
  },
  Ay = () => {
    const i = _.useRef(null),
      o = _.useRef(null),
      [s, r] = _.useState(!0),
      [h, g] = _.useState(null),
      {
        points: E,
        measurement: O,
        scale: b,
        addPoint: m,
        clearPoints: R,
        setMeasurement: H,
        measureMode: C,
        unit: G,
        setUnit: V,
      } = gy();
    _.useEffect(() => {
      navigator.xr || r(!1);
    }, []);
    const F = _.useCallback(
        (Y) => {
          if (!b) {
            console.warn('Scale is not set. Measurement will be inaccurate.');
            return;
          }
          const B = i.current;
          if (!B) return;
          const w = Sy(Y.nativeEvent, B);
          if (E.length >= 2) {
            (R(), m(w));
            return;
          }
          m(w);
        },
        [m, R, E.length, b]
      ),
      L = (Y) => {
        const B = Y.target.files?.[0];
        if (B) {
          R();
          const w = new FileReader();
          ((w.onload = (ct) => {
            const K = new Image();
            ((K.onload = () => {
              g(K);
            }),
              (K.src = ct.target?.result));
          }),
            w.readAsDataURL(B));
        }
      };
    return (
      _.useEffect(() => {
        if (E.length === 2) {
          const Y = b ?? { mmPerPx: 1 },
            B = by(E[0], E[1], Y.mmPerPx),
            w = {
              mode: C,
              valueMm: B,
              unit: G,
              dateISO: new Date().toISOString(),
            };
          H(w);
        }
      }, [E, b, H, C, G]),
      _.useEffect(() => {
        const Y = i.current,
          B = Y?.getContext('2d');
        if (!(!B || !Y)) {
          if ((B.clearRect(0, 0, Y.width, Y.height), h)) {
            const w = h.width / h.height;
            let ct = Y.width,
              K = Y.width / w;
            K > Y.height && ((K = Y.height), (ct = Y.height * w));
            const _t = (Y.width - ct) / 2,
              Ot = (Y.height - K) / 2;
            B.drawImage(h, _t, Ot, ct, K);
          }
          if (
            (E.length === 2 && Ty(B, E[0], E[1]), O?.valueMm && E.length === 2)
          ) {
            const w = Kd(O.valueMm, G),
              ct = { x: (E[0].x + E[1].x) / 2, y: (E[0].y + E[1].y) / 2 };
            Ry(B, w, ct.x, ct.y);
          }
        }
      }, [E, O, G, h]),
      nt.jsxs('div', {
        className: 'relative w-full h-screen',
        'data-testid': 'measure-page-container',
        children: [
          nt.jsx('video', {
            ref: o,
            className: 'absolute top-0 left-0 w-full h-full object-cover',
            autoPlay: !0,
            muted: !0,
            playsInline: !0,
          }),
          nt.jsx('canvas', {
            ref: i,
            'data-testid': 'measure-canvas',
            className: 'absolute top-0 left-0 w-full h-full',
            onClick: F,
            width: window.innerWidth,
            height: window.innerHeight,
          }),
          nt.jsxs('div', {
            className:
              'absolute top-4 left-4 bg-white bg-opacity-75 p-2 rounded',
            children: [
              nt.jsx('h1', {
                className: 'text-xl font-bold',
                children: '計測モード',
              }),
              !s &&
                nt.jsx('p', {
                  className: 'text-red-500 text-sm mb-2',
                  children: 'WebXR (AR) is not supported on this device.',
                }),
              O?.valueMm &&
                nt.jsx('p', {
                  className: 'text-lg',
                  children: Kd(O.valueMm, G),
                }),
              nt.jsxs('div', {
                className: 'flex space-x-2 mt-2',
                children: [
                  nt.jsxs('label', {
                    className: 'inline-flex items-center',
                    children: [
                      nt.jsx('input', {
                        type: 'radio',
                        className: 'form-radio',
                        name: 'unit',
                        value: 'cm',
                        checked: G === 'cm',
                        onChange: () => V('cm'),
                      }),
                      nt.jsx('span', { className: 'ml-2', children: 'cm' }),
                    ],
                  }),
                  nt.jsxs('label', {
                    className: 'inline-flex items-center',
                    children: [
                      nt.jsx('input', {
                        type: 'radio',
                        className: 'form-radio',
                        name: 'unit',
                        value: 'm',
                        checked: G === 'm',
                        onChange: () => V('m'),
                      }),
                      nt.jsx('span', { className: 'ml-2', children: 'm' }),
                    ],
                  }),
                ],
              }),
              nt.jsx('button', {
                className:
                  'mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600',
                onClick: R,
                children: 'リセット',
              }),
              nt.jsxs('div', {
                className: 'mt-2',
                children: [
                  nt.jsx('label', {
                    htmlFor: 'photo-upload',
                    className: 'block text-sm font-medium text-gray-700',
                    children: '写真を選択',
                  }),
                  nt.jsx('input', {
                    id: 'photo-upload',
                    name: 'photo-upload',
                    type: 'file',
                    accept: 'image/*',
                    className: `mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100`,
                    onChange: L,
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  },
  My = () =>
    nt.jsxs('div', {
      className: 'container mx-auto p-4',
      children: [
        nt.jsx('h1', {
          className: 'text-2xl font-bold mb-4',
          children: '成長記録モード',
        }),
        nt.jsx('p', {
          children: '成長記録モードのコンテンツがここに表示されます。',
        }),
      ],
    });
function Oy() {
  return nt.jsxs(Hv, {
    children: [
      nt.jsx(Fn, { path: '/', element: nt.jsx(dy, {}) }),
      nt.jsx(Fn, { path: '/measure', element: nt.jsx(Ay, {}) }),
      nt.jsx(Fn, { path: '/growth-record', element: nt.jsx(My, {}) }),
    ],
  });
}
Q0.createRoot(document.getElementById('root')).render(
  nt.jsx(_u.StrictMode, { children: nt.jsx(ly, { children: nt.jsx(Oy, {}) }) })
);
