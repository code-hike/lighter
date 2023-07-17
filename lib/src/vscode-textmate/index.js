// from https://github.com/microsoft/vscode-textmate but ESM
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
var e = {
    d: (t, n) => {
      for (var s in n)
        e.o(n, s) &&
          !e.o(t, s) &&
          Object.defineProperty(t, s, { enumerable: !0, get: n[s] });
    },
    o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
  },
  t = {};
e.d(t, {
  _X: () => Pe,
  Bz: () => Ae,
  ot: () => we,
  u: () => Se,
  jG: () => o,
  Pn: () => Re,
});
const n = "undefined" != typeof process && !!process.env.VSCODE_TEXTMATE_DEBUG;
var s;
function r(e, t) {
  const n = [],
    s = (function (e) {
      let t = /([LR]:|[\w\.:][\w\.:\-]*|[\,\|\-\(\)])/g,
        n = t.exec(e);
      return {
        next: () => {
          if (!n) return null;
          const s = n[0];
          return (n = t.exec(e)), s;
        },
      };
    })(e);
  let r = s.next();
  for (; null !== r; ) {
    let e = 0;
    if (2 === r.length && ":" === r.charAt(1)) {
      switch (r.charAt(0)) {
        case "R":
          e = 1;
          break;
        case "L":
          e = -1;
          break;
        default:
          console.log(`Unknown priority ${r} in scope selector`);
      }
      r = s.next();
    }
    let t = a();
    if ((n.push({ matcher: t, priority: e }), "," !== r)) break;
    r = s.next();
  }
  return n;
  function o() {
    if ("-" === r) {
      r = s.next();
      const e = o();
      return (t) => !!e && !e(t);
    }
    if ("(" === r) {
      r = s.next();
      const e = (function () {
        const e = [];
        let t = a();
        for (; t && (e.push(t), "|" === r || "," === r); ) {
          do {
            r = s.next();
          } while ("|" === r || "," === r);
          t = a();
        }
        return (t) => e.some((e) => e(t));
      })();
      return ")" === r && (r = s.next()), e;
    }
    if (i(r)) {
      const e = [];
      do {
        e.push(r), (r = s.next());
      } while (i(r));
      return (n) => t(e, n);
    }
    return null;
  }
  function a() {
    const e = [];
    let t = o();
    for (; t; ) e.push(t), (t = o());
    return (t) => e.every((e) => e(t));
  }
}
function i(e) {
  return !!e && !!e.match(/[\w\.:]+/);
}
function o(e) {
  "function" == typeof e.dispose && e.dispose();
}
function a(e) {
  return Array.isArray(e)
    ? (function (e) {
        let t = [];
        for (let n = 0, s = e.length; n < s; n++) t[n] = a(e[n]);
        return t;
      })(e)
    : "object" == typeof e
    ? (function (e) {
        let t = {};
        for (let n in e) t[n] = a(e[n]);
        return t;
      })(e)
    : e;
}
function c(e, ...t) {
  return (
    t.forEach((t) => {
      for (let n in t) e[n] = t[n];
    }),
    e
  );
}
function l(e) {
  const t = ~e.lastIndexOf("/") || ~e.lastIndexOf("\\");
  return 0 === t
    ? e
    : ~t == e.length - 1
    ? l(e.substring(0, e.length - 1))
    : e.substr(1 + ~t);
}
!(function (e) {
  (e.toBinaryStr = function (e) {
    let t = e.toString(2);
    for (; t.length < 32; ) t = "0" + t;
    return t;
  }),
    (e.print = function (t) {
      const n = e.getLanguageId(t),
        s = e.getTokenType(t),
        r = e.getFontStyle(t),
        i = e.getForeground(t),
        o = e.getBackground(t);
      console.log({
        languageId: n,
        tokenType: s,
        fontStyle: r,
        foreground: i,
        background: o,
      });
    }),
    (e.getLanguageId = function (e) {
      return (255 & e) >>> 0;
    }),
    (e.getTokenType = function (e) {
      return (768 & e) >>> 8;
    }),
    (e.containsBalancedBrackets = function (e) {
      return 0 != (1024 & e);
    }),
    (e.getFontStyle = function (e) {
      return (30720 & e) >>> 11;
    }),
    (e.getForeground = function (e) {
      return (16744448 & e) >>> 15;
    }),
    (e.getBackground = function (e) {
      return (4278190080 & e) >>> 24;
    }),
    (e.set = function (t, n, s, r, i, o, a) {
      let c = e.getLanguageId(t),
        l = e.getTokenType(t),
        h = e.containsBalancedBrackets(t) ? 1 : 0,
        u = e.getFontStyle(t),
        p = e.getForeground(t),
        d = e.getBackground(t);
      return (
        0 !== n && (c = n),
        8 !== s && (l = s),
        null !== r && (h = r ? 1 : 0),
        -1 !== i && (u = i),
        0 !== o && (p = o),
        0 !== a && (d = a),
        ((c << 0) |
          (l << 8) |
          (h << 10) |
          (u << 11) |
          (p << 15) |
          (d << 24)) >>>
          0
      );
    });
})(s || (s = {}));
let h = /\$(\d+)|\${(\d+):\/(downcase|upcase)}/g;
class u {
  static hasCaptures(e) {
    return null !== e && ((h.lastIndex = 0), h.test(e));
  }
  static replaceCaptures(e, t, n) {
    return e.replace(h, (e, s, r, i) => {
      let o = n[parseInt(s || r, 10)];
      if (!o) return e;
      {
        let e = t.substring(o.start, o.end);
        for (; "." === e[0]; ) e = e.substring(1);
        switch (i) {
          case "downcase":
            return e.toLowerCase();
          case "upcase":
            return e.toUpperCase();
          default:
            return e;
        }
      }
    });
  }
}
function p(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
function d(e, t) {
  if (null === e && null === t) return 0;
  if (!e) return -1;
  if (!t) return 1;
  let n = e.length,
    s = t.length;
  if (n === s) {
    for (let s = 0; s < n; s++) {
      let n = p(e[s], t[s]);
      if (0 !== n) return n;
    }
    return 0;
  }
  return n - s;
}
function f(e) {
  return !!(
    /^#[0-9a-f]{6}$/i.test(e) ||
    /^#[0-9a-f]{8}$/i.test(e) ||
    /^#[0-9a-f]{3}$/i.test(e) ||
    /^#[0-9a-f]{4}$/i.test(e)
  );
}
function m(e) {
  return e.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&");
}
class g {
  constructor(e) {
    (this.fn = e), (this.cache = new Map());
  }
  get(e) {
    if (this.cache.has(e)) return this.cache.get(e);
    const t = this.fn(e);
    return this.cache.set(e, t), t;
  }
}
const _ =
  "undefined" == typeof performance
    ? function () {
        return Date.now();
      }
    : function () {
        return performance.now();
      };
class y {
  constructor(e) {
    this.scopeName = e;
  }
  toKey() {
    return this.scopeName;
  }
}
class C {
  constructor(e, t) {
    (this.scopeName = e), (this.ruleName = t);
  }
  toKey() {
    return `${this.scopeName}#${this.ruleName}`;
  }
}
class k {
  constructor() {
    (this._references = []),
      (this._seenReferenceKeys = new Set()),
      (this.visitedRule = new Set());
  }
  get references() {
    return this._references;
  }
  add(e) {
    const t = e.toKey();
    this._seenReferenceKeys.has(t) ||
      (this._seenReferenceKeys.add(t), this._references.push(e));
  }
}
class b {
  constructor(e, t) {
    (this.repo = e),
      (this.initialScopeName = t),
      (this.seenFullScopeRequests = new Set()),
      (this.seenPartialScopeRequests = new Set()),
      this.seenFullScopeRequests.add(this.initialScopeName),
      (this.Q = [new y(this.initialScopeName)]);
  }
  processQueue() {
    const e = this.Q;
    this.Q = [];
    const t = new k();
    for (const n of e) S(n, this.initialScopeName, this.repo, t);
    for (const e of t.references)
      if (e instanceof y) {
        if (this.seenFullScopeRequests.has(e.scopeName)) continue;
        this.seenFullScopeRequests.add(e.scopeName), this.Q.push(e);
      } else {
        if (this.seenFullScopeRequests.has(e.scopeName)) continue;
        if (this.seenPartialScopeRequests.has(e.toKey())) continue;
        this.seenPartialScopeRequests.add(e.toKey()), this.Q.push(e);
      }
  }
}
function S(e, t, n, s) {
  const r = n.lookup(e.scopeName);
  if (!r) {
    if (e.scopeName === t) throw new Error(`No grammar provided for <${t}>`);
    return;
  }
  const i = n.lookup(t);
  e instanceof y
    ? A({ baseGrammar: i, selfGrammar: r }, s)
    : w(
        e.ruleName,
        { baseGrammar: i, selfGrammar: r, repository: r.repository },
        s
      );
  const o = n.injections(e.scopeName);
  if (o) for (const e of o) s.add(new y(e));
}
function w(e, t, n) {
  t.repository && t.repository[e] && P([t.repository[e]], t, n);
}
function A(e, t) {
  e.selfGrammar.patterns &&
    Array.isArray(e.selfGrammar.patterns) &&
    P(
      e.selfGrammar.patterns,
      { ...e, repository: e.selfGrammar.repository },
      t
    ),
    e.selfGrammar.injections &&
      P(
        Object.values(e.selfGrammar.injections),
        { ...e, repository: e.selfGrammar.repository },
        t
      );
}
function P(e, t, n) {
  for (const s of e) {
    if (n.visitedRule.has(s)) continue;
    n.visitedRule.add(s);
    const e = s.repository ? c({}, t.repository, s.repository) : t.repository;
    Array.isArray(s.patterns) && P(s.patterns, { ...t, repository: e }, n);
    const r = s.include;
    if (!r) continue;
    const i = v(r);
    switch (i.kind) {
      case 0:
        A({ ...t, selfGrammar: t.baseGrammar }, n);
        break;
      case 1:
        A(t, n);
        break;
      case 2:
        w(i.ruleName, { ...t, repository: e }, n);
        break;
      case 3:
      case 4:
        const s =
          i.scopeName === t.selfGrammar.scopeName
            ? t.selfGrammar
            : i.scopeName === t.baseGrammar.scopeName
            ? t.baseGrammar
            : void 0;
        if (s) {
          const r = {
            baseGrammar: t.baseGrammar,
            selfGrammar: s,
            repository: e,
          };
          4 === i.kind ? w(i.ruleName, r, n) : A(r, n);
        } else
          4 === i.kind
            ? n.add(new C(i.scopeName, i.ruleName))
            : n.add(new y(i.scopeName));
    }
  }
}
class R {
  constructor() {
    this.kind = 0;
  }
}
class N {
  constructor() {
    this.kind = 1;
  }
}
class I {
  constructor(e) {
    (this.ruleName = e), (this.kind = 2);
  }
}
class G {
  constructor(e) {
    (this.scopeName = e), (this.kind = 3);
  }
}
class x {
  constructor(e, t) {
    (this.scopeName = e), (this.ruleName = t), (this.kind = 4);
  }
}
function v(e) {
  if ("$base" === e) return new R();
  if ("$self" === e) return new N();
  const t = e.indexOf("#");
  if (-1 === t) return new G(e);
  if (0 === t) return new I(e.substring(1));
  {
    const n = e.substring(0, t),
      s = e.substring(t + 1);
    return new x(n, s);
  }
}
const E = /\\(\d+)/,
  L = /\\(\d+)/g;
Symbol("RuleId");
class T {
  constructor(e, t, n, s) {
    (this.$location = e),
      (this.id = t),
      (this._name = n || null),
      (this._nameIsCapturing = u.hasCaptures(this._name)),
      (this._contentName = s || null),
      (this._contentNameIsCapturing = u.hasCaptures(this._contentName));
  }
  get debugName() {
    const e = this.$location
      ? `${l(this.$location.filename)}:${this.$location.line}`
      : "unknown";
    return `${this.constructor.name}#${this.id} @ ${e}`;
  }
  getName(e, t) {
    return this._nameIsCapturing &&
      null !== this._name &&
      null !== e &&
      null !== t
      ? u.replaceCaptures(this._name, e, t)
      : this._name;
  }
  getContentName(e, t) {
    return this._contentNameIsCapturing && null !== this._contentName
      ? u.replaceCaptures(this._contentName, e, t)
      : this._contentName;
  }
}
class $ extends T {
  constructor(e, t, n, s, r) {
    super(e, t, n, s), (this.retokenizeCapturedWithRuleId = r);
  }
  dispose() {}
  collectPatterns(e, t) {
    throw new Error("Not supported!");
  }
  compile(e, t) {
    throw new Error("Not supported!");
  }
  compileAG(e, t, n, s) {
    throw new Error("Not supported!");
  }
}
class B extends T {
  constructor(e, t, n, s, r) {
    super(e, t, n, null),
      (this._match = new W(s, this.id)),
      (this.captures = r),
      (this._cachedCompiledPatterns = null);
  }
  dispose() {
    this._cachedCompiledPatterns &&
      (this._cachedCompiledPatterns.dispose(),
      (this._cachedCompiledPatterns = null));
  }
  get debugMatchRegExp() {
    return `${this._match.source}`;
  }
  collectPatterns(e, t) {
    t.push(this._match);
  }
  compile(e, t) {
    return this._getCachedCompiledPatterns(e).compile(e);
  }
  compileAG(e, t, n, s) {
    return this._getCachedCompiledPatterns(e).compileAG(e, n, s);
  }
  _getCachedCompiledPatterns(e) {
    return (
      this._cachedCompiledPatterns ||
        ((this._cachedCompiledPatterns = new D()),
        this.collectPatterns(e, this._cachedCompiledPatterns)),
      this._cachedCompiledPatterns
    );
  }
}
class M extends T {
  constructor(e, t, n, s, r) {
    super(e, t, n, s),
      (this.patterns = r.patterns),
      (this.hasMissingPatterns = r.hasMissingPatterns),
      (this._cachedCompiledPatterns = null);
  }
  dispose() {
    this._cachedCompiledPatterns &&
      (this._cachedCompiledPatterns.dispose(),
      (this._cachedCompiledPatterns = null));
  }
  collectPatterns(e, t) {
    for (const n of this.patterns) e.getRule(n).collectPatterns(e, t);
  }
  compile(e, t) {
    return this._getCachedCompiledPatterns(e).compile(e);
  }
  compileAG(e, t, n, s) {
    return this._getCachedCompiledPatterns(e).compileAG(e, n, s);
  }
  _getCachedCompiledPatterns(e) {
    return (
      this._cachedCompiledPatterns ||
        ((this._cachedCompiledPatterns = new D()),
        this.collectPatterns(e, this._cachedCompiledPatterns)),
      this._cachedCompiledPatterns
    );
  }
}
class O extends T {
  constructor(e, t, n, s, r, i, o, a, c, l) {
    super(e, t, n, s),
      (this._begin = new W(r, this.id)),
      (this.beginCaptures = i),
      (this._end = new W(o || "￿", -1)),
      (this.endHasBackReferences = this._end.hasBackReferences),
      (this.endCaptures = a),
      (this.applyEndPatternLast = c || !1),
      (this.patterns = l.patterns),
      (this.hasMissingPatterns = l.hasMissingPatterns),
      (this._cachedCompiledPatterns = null);
  }
  dispose() {
    this._cachedCompiledPatterns &&
      (this._cachedCompiledPatterns.dispose(),
      (this._cachedCompiledPatterns = null));
  }
  get debugBeginRegExp() {
    return `${this._begin.source}`;
  }
  get debugEndRegExp() {
    return `${this._end.source}`;
  }
  getEndWithResolvedBackReferences(e, t) {
    return this._end.resolveBackReferences(e, t);
  }
  collectPatterns(e, t) {
    t.push(this._begin);
  }
  compile(e, t) {
    return this._getCachedCompiledPatterns(e, t).compile(e);
  }
  compileAG(e, t, n, s) {
    return this._getCachedCompiledPatterns(e, t).compileAG(e, n, s);
  }
  _getCachedCompiledPatterns(e, t) {
    if (!this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns = new D();
      for (const t of this.patterns)
        e.getRule(t).collectPatterns(e, this._cachedCompiledPatterns);
      this.applyEndPatternLast
        ? this._cachedCompiledPatterns.push(
            this._end.hasBackReferences ? this._end.clone() : this._end
          )
        : this._cachedCompiledPatterns.unshift(
            this._end.hasBackReferences ? this._end.clone() : this._end
          );
    }
    return (
      this._end.hasBackReferences &&
        (this.applyEndPatternLast
          ? this._cachedCompiledPatterns.setSource(
              this._cachedCompiledPatterns.length() - 1,
              t
            )
          : this._cachedCompiledPatterns.setSource(0, t)),
      this._cachedCompiledPatterns
    );
  }
}
class j extends T {
  constructor(e, t, n, s, r, i, o, a, c) {
    super(e, t, n, s),
      (this._begin = new W(r, this.id)),
      (this.beginCaptures = i),
      (this.whileCaptures = a),
      (this._while = new W(o, -2)),
      (this.whileHasBackReferences = this._while.hasBackReferences),
      (this.patterns = c.patterns),
      (this.hasMissingPatterns = c.hasMissingPatterns),
      (this._cachedCompiledPatterns = null),
      (this._cachedCompiledWhilePatterns = null);
  }
  dispose() {
    this._cachedCompiledPatterns &&
      (this._cachedCompiledPatterns.dispose(),
      (this._cachedCompiledPatterns = null)),
      this._cachedCompiledWhilePatterns &&
        (this._cachedCompiledWhilePatterns.dispose(),
        (this._cachedCompiledWhilePatterns = null));
  }
  get debugBeginRegExp() {
    return `${this._begin.source}`;
  }
  get debugWhileRegExp() {
    return `${this._while.source}`;
  }
  getWhileWithResolvedBackReferences(e, t) {
    return this._while.resolveBackReferences(e, t);
  }
  collectPatterns(e, t) {
    t.push(this._begin);
  }
  compile(e, t) {
    return this._getCachedCompiledPatterns(e).compile(e);
  }
  compileAG(e, t, n, s) {
    return this._getCachedCompiledPatterns(e).compileAG(e, n, s);
  }
  _getCachedCompiledPatterns(e) {
    if (!this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns = new D();
      for (const t of this.patterns)
        e.getRule(t).collectPatterns(e, this._cachedCompiledPatterns);
    }
    return this._cachedCompiledPatterns;
  }
  compileWhile(e, t) {
    return this._getCachedCompiledWhilePatterns(e, t).compile(e);
  }
  compileWhileAG(e, t, n, s) {
    return this._getCachedCompiledWhilePatterns(e, t).compileAG(e, n, s);
  }
  _getCachedCompiledWhilePatterns(e, t) {
    return (
      this._cachedCompiledWhilePatterns ||
        ((this._cachedCompiledWhilePatterns = new D()),
        this._cachedCompiledWhilePatterns.push(
          this._while.hasBackReferences ? this._while.clone() : this._while
        )),
      this._while.hasBackReferences &&
        this._cachedCompiledWhilePatterns.setSource(0, t || "￿"),
      this._cachedCompiledWhilePatterns
    );
  }
}
class F {
  static createCaptureRule(e, t, n, s, r) {
    return e.registerRule((e) => new $(t, e, n, s, r));
  }
  static getCompiledRuleId(e, t, n) {
    return (
      e.id ||
        t.registerRule((s) => {
          if (((e.id = s), e.match))
            return new B(
              e.$vscodeTextmateLocation,
              e.id,
              e.name,
              e.match,
              F._compileCaptures(e.captures, t, n)
            );
          if (void 0 === e.begin) {
            e.repository && (n = c({}, n, e.repository));
            let s = e.patterns;
            return (
              void 0 === s && e.include && (s = [{ include: e.include }]),
              new M(
                e.$vscodeTextmateLocation,
                e.id,
                e.name,
                e.contentName,
                F._compilePatterns(s, t, n)
              )
            );
          }
          return e.while
            ? new j(
                e.$vscodeTextmateLocation,
                e.id,
                e.name,
                e.contentName,
                e.begin,
                F._compileCaptures(e.beginCaptures || e.captures, t, n),
                e.while,
                F._compileCaptures(e.whileCaptures || e.captures, t, n),
                F._compilePatterns(e.patterns, t, n)
              )
            : new O(
                e.$vscodeTextmateLocation,
                e.id,
                e.name,
                e.contentName,
                e.begin,
                F._compileCaptures(e.beginCaptures || e.captures, t, n),
                e.end,
                F._compileCaptures(e.endCaptures || e.captures, t, n),
                e.applyEndPatternLast,
                F._compilePatterns(e.patterns, t, n)
              );
        }),
      e.id
    );
  }
  static _compileCaptures(e, t, n) {
    let s = [];
    if (e) {
      let r = 0;
      for (const t in e) {
        if ("$vscodeTextmateLocation" === t) continue;
        const e = parseInt(t, 10);
        e > r && (r = e);
      }
      for (let e = 0; e <= r; e++) s[e] = null;
      for (const r in e) {
        if ("$vscodeTextmateLocation" === r) continue;
        const i = parseInt(r, 10);
        let o = 0;
        e[r].patterns && (o = F.getCompiledRuleId(e[r], t, n)),
          (s[i] = F.createCaptureRule(
            t,
            e[r].$vscodeTextmateLocation,
            e[r].name,
            e[r].contentName,
            o
          ));
      }
    }
    return s;
  }
  static _compilePatterns(e, t, n) {
    let s = [];
    if (e)
      for (let r = 0, i = e.length; r < i; r++) {
        const i = e[r];
        let o = -1;
        if (i.include) {
          const e = v(i.include);
          switch (e.kind) {
            case 0:
            case 1:
              o = F.getCompiledRuleId(n[i.include], t, n);
              break;
            case 2:
              let s = n[e.ruleName];
              s && (o = F.getCompiledRuleId(s, t, n));
              break;
            case 3:
            case 4:
              const r = e.scopeName,
                a = 4 === e.kind ? e.ruleName : null,
                c = t.getExternalGrammar(r, n);
              if (c)
                if (a) {
                  let e = c.repository[a];
                  e && (o = F.getCompiledRuleId(e, t, c.repository));
                } else
                  o = F.getCompiledRuleId(c.repository.$self, t, c.repository);
          }
        } else o = F.getCompiledRuleId(i, t, n);
        if (-1 !== o) {
          const e = t.getRule(o);
          let n = !1;
          if (
            ((e instanceof M || e instanceof O || e instanceof j) &&
              e.hasMissingPatterns &&
              0 === e.patterns.length &&
              (n = !0),
            n)
          )
            continue;
          s.push(o);
        }
      }
    return { patterns: s, hasMissingPatterns: (e ? e.length : 0) !== s.length };
  }
}
class W {
  constructor(e, t) {
    if (e) {
      const t = e.length;
      let n = 0,
        s = [],
        r = !1;
      for (let i = 0; i < t; i++)
        if ("\\" === e.charAt(i) && i + 1 < t) {
          const t = e.charAt(i + 1);
          "z" === t
            ? (s.push(e.substring(n, i)),
              s.push("$(?!\\n)(?<!\\n)"),
              (n = i + 2))
            : ("A" !== t && "G" !== t) || (r = !0),
            i++;
        }
      (this.hasAnchor = r),
        0 === n
          ? (this.source = e)
          : (s.push(e.substring(n, t)), (this.source = s.join("")));
    } else (this.hasAnchor = !1), (this.source = e);
    this.hasAnchor
      ? (this._anchorCache = this._buildAnchorCache())
      : (this._anchorCache = null),
      (this.ruleId = t),
      (this.hasBackReferences = E.test(this.source));
  }
  clone() {
    return new W(this.source, this.ruleId);
  }
  setSource(e) {
    this.source !== e &&
      ((this.source = e),
      this.hasAnchor && (this._anchorCache = this._buildAnchorCache()));
  }
  resolveBackReferences(e, t) {
    let n = t.map((t) => e.substring(t.start, t.end));
    return (
      (L.lastIndex = 0),
      this.source.replace(L, (e, t) => m(n[parseInt(t, 10)] || ""))
    );
  }
  _buildAnchorCache() {
    let e,
      t,
      n,
      s,
      r = [],
      i = [],
      o = [],
      a = [];
    for (e = 0, t = this.source.length; e < t; e++)
      (n = this.source.charAt(e)),
        (r[e] = n),
        (i[e] = n),
        (o[e] = n),
        (a[e] = n),
        "\\" === n &&
          e + 1 < t &&
          ((s = this.source.charAt(e + 1)),
          "A" === s
            ? ((r[e + 1] = "￿"),
              (i[e + 1] = "￿"),
              (o[e + 1] = "A"),
              (a[e + 1] = "A"))
            : "G" === s
            ? ((r[e + 1] = "￿"),
              (i[e + 1] = "G"),
              (o[e + 1] = "￿"),
              (a[e + 1] = "G"))
            : ((r[e + 1] = s), (i[e + 1] = s), (o[e + 1] = s), (a[e + 1] = s)),
          e++);
    return {
      A0_G0: r.join(""),
      A0_G1: i.join(""),
      A1_G0: o.join(""),
      A1_G1: a.join(""),
    };
  }
  resolveAnchors(e, t) {
    return this.hasAnchor && this._anchorCache
      ? e
        ? t
          ? this._anchorCache.A1_G1
          : this._anchorCache.A1_G0
        : t
        ? this._anchorCache.A0_G1
        : this._anchorCache.A0_G0
      : this.source;
  }
}
class D {
  constructor() {
    (this._items = []),
      (this._hasAnchors = !1),
      (this._cached = null),
      (this._anchorCache = {
        A0_G0: null,
        A0_G1: null,
        A1_G0: null,
        A1_G1: null,
      });
  }
  dispose() {
    this._disposeCaches();
  }
  _disposeCaches() {
    this._cached && (this._cached.dispose(), (this._cached = null)),
      this._anchorCache.A0_G0 &&
        (this._anchorCache.A0_G0.dispose(), (this._anchorCache.A0_G0 = null)),
      this._anchorCache.A0_G1 &&
        (this._anchorCache.A0_G1.dispose(), (this._anchorCache.A0_G1 = null)),
      this._anchorCache.A1_G0 &&
        (this._anchorCache.A1_G0.dispose(), (this._anchorCache.A1_G0 = null)),
      this._anchorCache.A1_G1 &&
        (this._anchorCache.A1_G1.dispose(), (this._anchorCache.A1_G1 = null));
  }
  push(e) {
    this._items.push(e), (this._hasAnchors = this._hasAnchors || e.hasAnchor);
  }
  unshift(e) {
    this._items.unshift(e),
      (this._hasAnchors = this._hasAnchors || e.hasAnchor);
  }
  length() {
    return this._items.length;
  }
  setSource(e, t) {
    this._items[e].source !== t &&
      (this._disposeCaches(), this._items[e].setSource(t));
  }
  compile(e) {
    if (!this._cached) {
      let t = this._items.map((e) => e.source);
      this._cached = new q(
        e,
        t,
        this._items.map((e) => e.ruleId)
      );
    }
    return this._cached;
  }
  compileAG(e, t, n) {
    return this._hasAnchors
      ? t
        ? n
          ? (this._anchorCache.A1_G1 ||
              (this._anchorCache.A1_G1 = this._resolveAnchors(e, t, n)),
            this._anchorCache.A1_G1)
          : (this._anchorCache.A1_G0 ||
              (this._anchorCache.A1_G0 = this._resolveAnchors(e, t, n)),
            this._anchorCache.A1_G0)
        : n
        ? (this._anchorCache.A0_G1 ||
            (this._anchorCache.A0_G1 = this._resolveAnchors(e, t, n)),
          this._anchorCache.A0_G1)
        : (this._anchorCache.A0_G0 ||
            (this._anchorCache.A0_G0 = this._resolveAnchors(e, t, n)),
          this._anchorCache.A0_G0)
      : this.compile(e);
  }
  _resolveAnchors(e, t, n) {
    let s = this._items.map((e) => e.resolveAnchors(t, n));
    return new q(
      e,
      s,
      this._items.map((e) => e.ruleId)
    );
  }
}
class q {
  constructor(e, t, n) {
    (this.regExps = t),
      (this.rules = n),
      (this.scanner = e.createOnigScanner(t));
  }
  dispose() {
    "function" == typeof this.scanner.dispose && this.scanner.dispose();
  }
  toString() {
    const e = [];
    for (let t = 0, n = this.rules.length; t < n; t++)
      e.push("   - " + this.rules[t] + ": " + this.regExps[t]);
    return e.join("\n");
  }
  findNextMatchSync(e, t, n) {
    const s = this.scanner.findNextMatchSync(e, t, n);
    return s
      ? { ruleId: this.rules[s.index], captureIndices: s.captureIndices }
      : null;
  }
}
class z {
  constructor(e, t, n) {
    (this._colorMap = e),
      (this._defaults = t),
      (this._root = n),
      (this._cachedMatchRoot = new g((e) => this._root.match(e)));
  }
  static createFromRawTheme(e, t) {
    return this.createFromParsedTheme(
      (function (e) {
        if (!e) return [];
        if (!e.settings || !Array.isArray(e.settings)) return [];
        let t = e.settings,
          n = [],
          s = 0;
        for (let e = 0, r = t.length; e < r; e++) {
          let r,
            i = t[e];
          if (!i.settings) continue;
          if ("string" == typeof i.scope) {
            let e = i.scope;
            (e = e.replace(/^[,]+/, "")),
              (e = e.replace(/[,]+$/, "")),
              (r = e.split(","));
          } else r = Array.isArray(i.scope) ? i.scope : [""];
          let o = -1;
          if ("string" == typeof i.settings.fontStyle) {
            o = 0;
            let e = i.settings.fontStyle.split(" ");
            for (let t = 0, n = e.length; t < n; t++)
              switch (e[t]) {
                case "italic":
                  o |= 1;
                  break;
                case "bold":
                  o |= 2;
                  break;
                case "underline":
                  o |= 4;
                  break;
                case "strikethrough":
                  o |= 8;
              }
          }
          let a = null;
          "string" == typeof i.settings.foreground &&
            f(i.settings.foreground) &&
            (a = i.settings.foreground);
          let c = null;
          "string" == typeof i.settings.background &&
            f(i.settings.background) &&
            (c = i.settings.background);
          for (let t = 0, i = r.length; t < i; t++) {
            let i = r[t].trim().split(" "),
              l = i[i.length - 1],
              h = null;
            i.length > 1 && ((h = i.slice(0, i.length - 1)), h.reverse()),
              (n[s++] = new H(l, h, e, o, a, c));
          }
        }
        return n;
      })(e),
      t
    );
  }
  static createFromParsedTheme(e, t) {
    return (function (e, t) {
      e.sort((e, t) => {
        let n = p(e.scope, t.scope);
        return 0 !== n
          ? n
          : ((n = d(e.parentScopes, t.parentScopes)),
            0 !== n ? n : e.index - t.index);
      });
      let n = 0,
        s = "#000000",
        r = "#ffffff";
      for (; e.length >= 1 && "" === e[0].scope; ) {
        let t = e.shift();
        -1 !== t.fontStyle && (n = t.fontStyle),
          null !== t.foreground && (s = t.foreground),
          null !== t.background && (r = t.background);
      }
      let i = new X(t),
        o = new Q(n, i.getId(s), i.getId(r)),
        a = new Y(new V(0, null, -1, 0, 0), []);
      for (let t = 0, n = e.length; t < n; t++) {
        let n = e[t];
        a.insert(
          0,
          n.scope,
          n.parentScopes,
          n.fontStyle,
          i.getId(n.foreground),
          i.getId(n.background)
        );
      }
      return new z(i, o, a);
    })(e, t);
  }
  getColorMap() {
    return this._colorMap.getColorMap();
  }
  getDefaults() {
    return this._defaults;
  }
  match(e) {
    if (null === e) return this._defaults;
    const t = e.scopeName,
      n = this._cachedMatchRoot.get(t).find((t) =>
        (function (e, t) {
          if (null === t) return !0;
          let n = 0,
            s = t[n];
          for (; e; ) {
            if (K(e.scopeName, s)) {
              if ((n++, n === t.length)) return !0;
              s = t[n];
            }
            e = e.parent;
          }
          return !1;
        })(e.parent, t.parentScopes)
      );
    return n ? new Q(n.fontStyle, n.foreground, n.background) : null;
  }
}
class U {
  constructor(e, t) {
    (this.parent = e), (this.scopeName = t);
  }
  static push(e, t) {
    for (const n of t) e = new U(e, n);
    return e;
  }
  static from(...e) {
    let t = null;
    for (let n = 0; n < e.length; n++) t = new U(t, e[n]);
    return t;
  }
  push(e) {
    return new U(this, e);
  }
  getSegments() {
    let e = this;
    const t = [];
    for (; e; ) t.push(e.scopeName), (e = e.parent);
    return t.reverse(), t;
  }
  toString() {
    return this.getSegments().join(" ");
  }
  extends(e) {
    return this === e || (null !== this.parent && this.parent.extends(e));
  }
  getExtensionIfDefined(e) {
    const t = [];
    let n = this;
    for (; n && n !== e; ) t.push(n.scopeName), (n = n.parent);
    return n === e ? t.reverse() : void 0;
  }
}
function K(e, t) {
  return t === e || (e.startsWith(t) && "." === e[t.length]);
}
class Q {
  constructor(e, t, n) {
    (this.fontStyle = e), (this.foregroundId = t), (this.backgroundId = n);
  }
}
class H {
  constructor(e, t, n, s, r, i) {
    (this.scope = e),
      (this.parentScopes = t),
      (this.index = n),
      (this.fontStyle = s),
      (this.foreground = r),
      (this.background = i);
  }
}
class X {
  constructor(e) {
    if (
      ((this._lastColorId = 0),
      (this._id2color = []),
      (this._color2id = Object.create(null)),
      Array.isArray(e))
    ) {
      this._isFrozen = !0;
      for (let t = 0, n = e.length; t < n; t++)
        (this._color2id[e[t]] = t), (this._id2color[t] = e[t]);
    } else this._isFrozen = !1;
  }
  getId(e) {
    if (null === e) return 0;
    e = e.toUpperCase();
    let t = this._color2id[e];
    if (t) return t;
    if (this._isFrozen) throw new Error(`Missing color in color map - ${e}`);
    return (
      (t = ++this._lastColorId),
      (this._color2id[e] = t),
      (this._id2color[t] = e),
      t
    );
  }
  getColorMap() {
    return this._id2color.slice(0);
  }
}
class V {
  constructor(e, t, n, s, r) {
    (this.scopeDepth = e),
      (this.parentScopes = t),
      (this.fontStyle = n),
      (this.foreground = s),
      (this.background = r);
  }
  clone() {
    return new V(
      this.scopeDepth,
      this.parentScopes,
      this.fontStyle,
      this.foreground,
      this.background
    );
  }
  static cloneArr(e) {
    let t = [];
    for (let n = 0, s = e.length; n < s; n++) t[n] = e[n].clone();
    return t;
  }
  acceptOverwrite(e, t, n, s) {
    this.scopeDepth > e
      ? console.log("how did this happen?")
      : (this.scopeDepth = e),
      -1 !== t && (this.fontStyle = t),
      0 !== n && (this.foreground = n),
      0 !== s && (this.background = s);
  }
}
class Y {
  constructor(e, t = [], n = {}) {
    (this._mainRule = e),
      (this._children = n),
      (this._rulesWithParentScopes = t);
  }
  static _sortBySpecificity(e) {
    return 1 === e.length || e.sort(this._cmpBySpecificity), e;
  }
  static _cmpBySpecificity(e, t) {
    if (e.scopeDepth === t.scopeDepth) {
      const n = e.parentScopes,
        s = t.parentScopes;
      let r = null === n ? 0 : n.length,
        i = null === s ? 0 : s.length;
      if (r === i)
        for (let e = 0; e < r; e++) {
          const t = n[e].length,
            r = s[e].length;
          if (t !== r) return r - t;
        }
      return i - r;
    }
    return t.scopeDepth - e.scopeDepth;
  }
  match(e) {
    if ("" === e)
      return Y._sortBySpecificity(
        [].concat(this._mainRule).concat(this._rulesWithParentScopes)
      );
    let t,
      n,
      s = e.indexOf(".");
    return (
      -1 === s
        ? ((t = e), (n = ""))
        : ((t = e.substring(0, s)), (n = e.substring(s + 1))),
      this._children.hasOwnProperty(t)
        ? this._children[t].match(n)
        : Y._sortBySpecificity(
            [].concat(this._mainRule).concat(this._rulesWithParentScopes)
          )
    );
  }
  insert(e, t, n, s, r, i) {
    if ("" === t) return void this._doInsertHere(e, n, s, r, i);
    let o,
      a,
      c,
      l = t.indexOf(".");
    -1 === l
      ? ((o = t), (a = ""))
      : ((o = t.substring(0, l)), (a = t.substring(l + 1))),
      this._children.hasOwnProperty(o)
        ? (c = this._children[o])
        : ((c = new Y(
            this._mainRule.clone(),
            V.cloneArr(this._rulesWithParentScopes)
          )),
          (this._children[o] = c)),
      c.insert(e + 1, a, n, s, r, i);
  }
  _doInsertHere(e, t, n, s, r) {
    if (null !== t) {
      for (let i = 0, o = this._rulesWithParentScopes.length; i < o; i++) {
        let o = this._rulesWithParentScopes[i];
        if (0 === d(o.parentScopes, t))
          return void o.acceptOverwrite(e, n, s, r);
      }
      -1 === n && (n = this._mainRule.fontStyle),
        0 === s && (s = this._mainRule.foreground),
        0 === r && (r = this._mainRule.background),
        this._rulesWithParentScopes.push(new V(e, t, n, s, r));
    } else this._mainRule.acceptOverwrite(e, n, s, r);
  }
}
class J {
  constructor(e, t) {
    (this.languageId = e), (this.tokenType = t);
  }
}
class Z {
  constructor(e, t) {
    (this._getBasicScopeAttributes = new g((e) => {
      const t = this._scopeToLanguage(e),
        n = this._toStandardTokenType(e);
      return new J(t, n);
    })),
      (this._defaultAttributes = new J(e, 8)),
      (this._embeddedLanguagesMatcher = new ee(Object.entries(t || {})));
  }
  getDefaultAttributes() {
    return this._defaultAttributes;
  }
  getBasicScopeAttributes(e) {
    return null === e
      ? Z._NULL_SCOPE_METADATA
      : this._getBasicScopeAttributes.get(e);
  }
  _scopeToLanguage(e) {
    return this._embeddedLanguagesMatcher.match(e) || 0;
  }
  _toStandardTokenType(e) {
    const t = e.match(Z.STANDARD_TOKEN_TYPE_REGEXP);
    if (!t) return 8;
    switch (t[1]) {
      case "comment":
        return 1;
      case "string":
        return 2;
      case "regex":
        return 3;
      case "meta.embedded":
        return 0;
    }
    throw new Error("Unexpected match for standard token type!");
  }
}
(Z._NULL_SCOPE_METADATA = new J(0, 0)),
  (Z.STANDARD_TOKEN_TYPE_REGEXP = /\b(comment|string|regex|meta\.embedded)\b/);
class ee {
  constructor(e) {
    if (0 === e.length) (this.values = null), (this.scopesRegExp = null);
    else {
      this.values = new Map(e);
      const t = e.map(([e, t]) => m(e));
      t.sort(),
        t.reverse(),
        (this.scopesRegExp = new RegExp(`^((${t.join(")|(")}))($|\\.)`, ""));
    }
  }
  match(e) {
    if (!this.scopesRegExp) return;
    const t = e.match(this.scopesRegExp);
    return t ? this.values.get(t[1]) : void 0;
  }
}
class te {
  constructor(e, t) {
    (this.stack = e), (this.stoppedEarly = t);
  }
}
function ne(e, t, s, r, i, o, a, c) {
  const l = t.content.length;
  let h = !1,
    u = -1;
  if (a) {
    const a = (function (e, t, s, r, i, o) {
      let a = i.beginRuleCapturedEOL ? 0 : -1;
      const c = [];
      for (let t = i; t; t = t.pop()) {
        const n = t.getRule(e);
        n instanceof j && c.push({ rule: n, stack: t });
      }
      for (let l = c.pop(); l; l = c.pop()) {
        const { ruleScanner: c, findOptions: h } = re(
            l.rule,
            e,
            l.stack.endRule,
            s,
            r === a
          ),
          u = c.findNextMatchSync(t, r, h);
        if (
          (n &&
            (console.log("  scanning for while rule"),
            console.log(c.toString())),
          !u)
        ) {
          n &&
            console.log(
              "  popping " + l.rule.debugName + " - " + l.rule.debugWhileRegExp
            ),
            (i = l.stack.pop());
          break;
        }
        if (-2 !== u.ruleId) {
          i = l.stack.pop();
          break;
        }
        u.captureIndices &&
          u.captureIndices.length &&
          (o.produce(l.stack, u.captureIndices[0].start),
          ie(e, t, s, l.stack, o, l.rule.whileCaptures, u.captureIndices),
          o.produce(l.stack, u.captureIndices[0].end),
          (a = u.captureIndices[0].end),
          u.captureIndices[0].end > r &&
            ((r = u.captureIndices[0].end), (s = !1)));
      }
      return { stack: i, linePos: r, anchorPosition: a, isFirstLine: s };
    })(e, t, s, r, i, o);
    (i = a.stack), (r = a.linePos), (s = a.isFirstLine), (u = a.anchorPosition);
  }
  const p = Date.now();
  for (; !h; ) {
    if (0 !== c && Date.now() - p > c) return new te(i, !0);
    d();
  }
  return new te(i, !1);
  function d() {
    n &&
      (console.log(""),
      console.log(
        `@@scanNext ${r}: |${t.content.substr(r).replace(/\n$/, "\\n")}|`
      ));
    const a = (function (e, t, s, r, i, o) {
      const a = (function (e, t, s, r, i, o) {
          const a = i.getRule(e),
            { ruleScanner: c, findOptions: l } = se(
              a,
              e,
              i.endRule,
              s,
              r === o
            );
          let h = 0;
          n && (h = _());
          const u = c.findNextMatchSync(t, r, l);
          if (n) {
            const e = _() - h;
            e > 5 &&
              console.warn(
                `Rule ${a.debugName} (${a.id}) matching took ${e} against '${t}'`
              ),
              console.log(
                `  scanning for (linePos: ${r}, anchorPosition: ${o})`
              ),
              console.log(c.toString()),
              u &&
                console.log(
                  `matched rule id: ${u.ruleId} from ${u.captureIndices[0].start} to ${u.captureIndices[0].end}`
                );
          }
          return u
            ? { captureIndices: u.captureIndices, matchedRuleId: u.ruleId }
            : null;
        })(e, t, s, r, i, o),
        c = e.getInjections();
      if (0 === c.length) return a;
      const l = (function (e, t, s, r, i, o, a) {
        let c,
          l = Number.MAX_VALUE,
          h = null,
          u = 0;
        const p = o.contentNameScopesList.getScopeNames();
        for (let o = 0, d = e.length; o < d; o++) {
          const d = e[o];
          if (!d.matcher(p)) continue;
          const f = t.getRule(d.ruleId),
            { ruleScanner: m, findOptions: g } = se(f, t, null, r, i === a),
            _ = m.findNextMatchSync(s, i, g);
          if (!_) continue;
          n &&
            (console.log(`  matched injection: ${d.debugSelector}`),
            console.log(m.toString()));
          const y = _.captureIndices[0].start;
          if (
            !(y >= l) &&
            ((l = y),
            (h = _.captureIndices),
            (c = _.ruleId),
            (u = d.priority),
            l === i)
          )
            break;
        }
        return h
          ? { priorityMatch: -1 === u, captureIndices: h, matchedRuleId: c }
          : null;
      })(c, e, t, s, r, i, o);
      if (!l) return a;
      if (!a) return l;
      const h = a.captureIndices[0].start,
        u = l.captureIndices[0].start;
      return u < h || (l.priorityMatch && u === h) ? l : a;
    })(e, t, s, r, i, u);
    if (!a)
      return (
        n && console.log("  no more matches."), o.produce(i, l), void (h = !0)
      );
    const c = a.captureIndices,
      p = a.matchedRuleId,
      d = !!(c && c.length > 0) && c[0].end > r;
    if (-1 === p) {
      const a = i.getRule(e);
      n && console.log("  popping " + a.debugName + " - " + a.debugEndRegExp),
        o.produce(i, c[0].start),
        (i = i.withContentNameScopesList(i.nameScopesList)),
        ie(e, t, s, i, o, a.endCaptures, c),
        o.produce(i, c[0].end);
      const p = i;
      if (((i = i.parent), (u = p.getAnchorPos()), !d && p.getEnterPos() === r))
        return (
          n &&
            console.error(
              "[1] - Grammar is in an endless loop - Grammar pushed & popped a rule without advancing"
            ),
          (i = p),
          o.produce(i, l),
          void (h = !0)
        );
    } else {
      const a = e.getRule(p);
      o.produce(i, c[0].start);
      const f = i,
        m = a.getName(t.content, c),
        g = i.contentNameScopesList.pushAttributed(m, e);
      if (((i = i.push(p, r, u, c[0].end === l, null, g, g)), a instanceof O)) {
        const r = a;
        n &&
          console.log("  pushing " + r.debugName + " - " + r.debugBeginRegExp),
          ie(e, t, s, i, o, r.beginCaptures, c),
          o.produce(i, c[0].end),
          (u = c[0].end);
        const p = r.getContentName(t.content, c),
          m = g.pushAttributed(p, e);
        if (
          ((i = i.withContentNameScopesList(m)),
          r.endHasBackReferences &&
            (i = i.withEndRule(
              r.getEndWithResolvedBackReferences(t.content, c)
            )),
          !d && f.hasSameRuleAs(i))
        )
          return (
            n &&
              console.error(
                "[2] - Grammar is in an endless loop - Grammar pushed the same rule without advancing"
              ),
            (i = i.pop()),
            o.produce(i, l),
            void (h = !0)
          );
      } else if (a instanceof j) {
        const r = a;
        n && console.log("  pushing " + r.debugName),
          ie(e, t, s, i, o, r.beginCaptures, c),
          o.produce(i, c[0].end),
          (u = c[0].end);
        const p = r.getContentName(t.content, c),
          m = g.pushAttributed(p, e);
        if (
          ((i = i.withContentNameScopesList(m)),
          r.whileHasBackReferences &&
            (i = i.withEndRule(
              r.getWhileWithResolvedBackReferences(t.content, c)
            )),
          !d && f.hasSameRuleAs(i))
        )
          return (
            n &&
              console.error(
                "[3] - Grammar is in an endless loop - Grammar pushed the same rule without advancing"
              ),
            (i = i.pop()),
            o.produce(i, l),
            void (h = !0)
          );
      } else {
        const r = a;
        if (
          (n &&
            console.log(
              "  matched " + r.debugName + " - " + r.debugMatchRegExp
            ),
          ie(e, t, s, i, o, r.captures, c),
          o.produce(i, c[0].end),
          (i = i.pop()),
          !d)
        )
          return (
            n &&
              console.error(
                "[4] - Grammar is in an endless loop - Grammar is not advancing, nor is it pushing/popping"
              ),
            (i = i.safePop()),
            o.produce(i, l),
            void (h = !0)
          );
      }
    }
    c[0].end > r && ((r = c[0].end), (s = !1));
  }
}
function se(e, t, n, s, r) {
  return { ruleScanner: e.compileAG(t, n, s, r), findOptions: 0 };
}
function re(e, t, n, s, r) {
  return { ruleScanner: e.compileWhileAG(t, n, s, r), findOptions: 0 };
}
function ie(e, t, n, s, r, i, a) {
  if (0 === i.length) return;
  const c = t.content,
    l = Math.min(i.length, a.length),
    h = [],
    u = a[0].end;
  for (let t = 0; t < l; t++) {
    const l = i[t];
    if (null === l) continue;
    const p = a[t];
    if (0 === p.length) continue;
    if (p.start > u) break;
    for (; h.length > 0 && h[h.length - 1].endPos <= p.start; )
      r.produceFromScopes(h[h.length - 1].scopes, h[h.length - 1].endPos),
        h.pop();
    if (
      (h.length > 0
        ? r.produceFromScopes(h[h.length - 1].scopes, p.start)
        : r.produce(s, p.start),
      l.retokenizeCapturedWithRuleId)
    ) {
      const t = l.getName(c, a),
        i = s.contentNameScopesList.pushAttributed(t, e),
        h = l.getContentName(c, a),
        u = i.pushAttributed(h, e),
        d = s.push(l.retokenizeCapturedWithRuleId, p.start, -1, !1, null, i, u),
        f = e.createOnigString(c.substring(0, p.end));
      ne(e, f, n && 0 === p.start, p.start, d, r, !1, 0), o(f);
      continue;
    }
    const d = l.getName(c, a);
    if (null !== d) {
      const t = (
        h.length > 0 ? h[h.length - 1].scopes : s.contentNameScopesList
      ).pushAttributed(d, e);
      h.push(new oe(t, p.end));
    }
  }
  for (; h.length > 0; )
    r.produceFromScopes(h[h.length - 1].scopes, h[h.length - 1].endPos),
      h.pop();
}
class oe {
  constructor(e, t) {
    (this.scopes = e), (this.endPos = t);
  }
}
function ae(e, t, n, s, i) {
  const o = r(t, ce),
    a = F.getCompiledRuleId(n, s, i.repository);
  for (const n of o)
    e.push({
      debugSelector: t,
      matcher: n.matcher,
      ruleId: a,
      grammar: i,
      priority: n.priority,
    });
}
function ce(e, t) {
  if (t.length < e.length) return !1;
  let n = 0;
  return e.every((e) => {
    for (let s = n; s < t.length; s++) if (le(t[s], e)) return (n = s + 1), !0;
    return !1;
  });
}
function le(e, t) {
  if (!e) return !1;
  if (e === t) return !0;
  const n = t.length;
  return e.length > n && e.substr(0, n) === t && "." === e[n];
}
class he {
  constructor(e, t, n, s, i, o, a, c) {
    if (
      ((this._rootScopeName = e),
      (this.balancedBracketSelectors = o),
      (this._onigLib = c),
      (this._basicScopeAttributesProvider = new Z(n, s)),
      (this._rootId = -1),
      (this._lastRuleId = 0),
      (this._ruleId2desc = [null]),
      (this._includedGrammars = {}),
      (this._grammarRepository = a),
      (this._grammar = ue(t, null)),
      (this._injections = null),
      (this._tokenTypeMatchers = []),
      i)
    )
      for (const e of Object.keys(i)) {
        const t = r(e, ce);
        for (const n of t)
          this._tokenTypeMatchers.push({ matcher: n.matcher, type: i[e] });
      }
  }
  get themeProvider() {
    return this._grammarRepository;
  }
  dispose() {
    for (const e of this._ruleId2desc) e && e.dispose();
  }
  createOnigScanner(e) {
    return this._onigLib.createOnigScanner(e);
  }
  createOnigString(e) {
    return this._onigLib.createOnigString(e);
  }
  getMetadataForScope(e) {
    return this._basicScopeAttributesProvider.getBasicScopeAttributes(e);
  }
  _collectInjections() {
    const e = [],
      t = this._rootScopeName,
      n = ((e) =>
        e === this._rootScopeName ? this._grammar : this.getExternalGrammar(e))(
        t
      );
    if (n) {
      const s = n.injections;
      if (s) for (let t in s) ae(e, t, s[t], this, n);
      const r = this._grammarRepository.injections(t);
      r &&
        r.forEach((t) => {
          const n = this.getExternalGrammar(t);
          if (n) {
            const t = n.injectionSelector;
            t && ae(e, t, n, this, n);
          }
        });
    }
    return e.sort((e, t) => e.priority - t.priority), e;
  }
  getInjections() {
    if (
      null === this._injections &&
      ((this._injections = this._collectInjections()),
      n && this._injections.length > 0)
    ) {
      console.log(
        `Grammar ${this._rootScopeName} contains the following injections:`
      );
      for (const e of this._injections) console.log(`  - ${e.debugSelector}`);
    }
    return this._injections;
  }
  registerRule(e) {
    const t = ++this._lastRuleId,
      n = e(t);
    return (this._ruleId2desc[t] = n), n;
  }
  getRule(e) {
    return this._ruleId2desc[e];
  }
  getExternalGrammar(e, t) {
    if (this._includedGrammars[e]) return this._includedGrammars[e];
    if (this._grammarRepository) {
      const n = this._grammarRepository.lookup(e);
      if (n)
        return (
          (this._includedGrammars[e] = ue(n, t && t.$base)),
          this._includedGrammars[e]
        );
    }
  }
  tokenizeLine(e, t, n = 0) {
    const s = this._tokenize(e, t, !1, n);
    return {
      tokens: s.lineTokens.getResult(s.ruleStack, s.lineLength),
      ruleStack: s.ruleStack,
      stoppedEarly: s.stoppedEarly,
    };
  }
  tokenizeLine2(e, t, n = 0) {
    const s = this._tokenize(e, t, !0, n);
    return {
      tokens: s.lineTokens.getBinaryResult(s.ruleStack, s.lineLength),
      ruleStack: s.ruleStack,
      stoppedEarly: s.stoppedEarly,
    };
  }
  _tokenize(e, t, n, r) {
    let i;
    if (
      (-1 === this._rootId &&
        ((this._rootId = F.getCompiledRuleId(
          this._grammar.repository.$self,
          this,
          this._grammar.repository
        )),
        this.getInjections()),
      t && t !== de.NULL)
    )
      (i = !1), t.reset();
    else {
      i = !0;
      const e = this._basicScopeAttributesProvider.getDefaultAttributes(),
        n = this.themeProvider.getDefaults(),
        r = s.set(
          0,
          e.languageId,
          e.tokenType,
          null,
          n.fontStyle,
          n.foregroundId,
          n.backgroundId
        ),
        o = this.getRule(this._rootId).getName(null, null);
      let a;
      (a = o
        ? pe.createRootAndLookUpScopeName(o, r, this)
        : pe.createRoot("unknown", r)),
        (t = new de(null, this._rootId, -1, -1, !1, null, a, a));
    }
    e += "\n";
    const a = this.createOnigString(e),
      c = a.content.length,
      l = new me(n, e, this._tokenTypeMatchers, this.balancedBracketSelectors),
      h = ne(this, a, i, 0, t, l, !0, r);
    return (
      o(a),
      {
        lineLength: c,
        lineTokens: l,
        ruleStack: h.stack,
        stoppedEarly: h.stoppedEarly,
      }
    );
  }
}
function ue(e, t) {
  return (
    ((e = a(e)).repository = e.repository || {}),
    (e.repository.$self = {
      $vscodeTextmateLocation: e.$vscodeTextmateLocation,
      patterns: e.patterns,
      name: e.scopeName,
    }),
    (e.repository.$base = t || e.repository.$self),
    e
  );
}
class pe {
  constructor(e, t, n) {
    (this.parent = e), (this.scopePath = t), (this.tokenAttributes = n);
  }
  static fromExtension(e, t) {
    let n = e,
      s = e?.scopePath ?? null;
    for (const e of t)
      (s = U.push(s, e.scopeNames)),
        (n = new pe(n, s, e.encodedTokenAttributes));
    return n;
  }
  static createRoot(e, t) {
    return new pe(null, new U(null, e), t);
  }
  static createRootAndLookUpScopeName(e, t, n) {
    const s = n.getMetadataForScope(e),
      r = new U(null, e),
      i = n.themeProvider.themeMatch(r),
      o = pe.mergeAttributes(t, s, i);
    return new pe(null, r, o);
  }
  get scopeName() {
    return this.scopePath.scopeName;
  }
  toString() {
    return this.getScopeNames().join(" ");
  }
  equals(e) {
    return pe.equals(this, e);
  }
  static equals(e, t) {
    for (;;) {
      if (e === t) return !0;
      if (!e && !t) return !0;
      if (!e || !t) return !1;
      if (
        e.scopeName !== t.scopeName ||
        e.tokenAttributes !== t.tokenAttributes
      )
        return !1;
      (e = e.parent), (t = t.parent);
    }
  }
  static mergeAttributes(e, t, n) {
    let r = -1,
      i = 0,
      o = 0;
    return (
      null !== n &&
        ((r = n.fontStyle), (i = n.foregroundId), (o = n.backgroundId)),
      s.set(e, t.languageId, t.tokenType, null, r, i, o)
    );
  }
  pushAttributed(e, t) {
    if (null === e) return this;
    if (-1 === e.indexOf(" ")) return pe._pushAttributed(this, e, t);
    const n = e.split(/ /g);
    let s = this;
    for (const e of n) s = pe._pushAttributed(s, e, t);
    return s;
  }
  static _pushAttributed(e, t, n) {
    const s = n.getMetadataForScope(t),
      r = e.scopePath.push(t),
      i = n.themeProvider.themeMatch(r),
      o = pe.mergeAttributes(e.tokenAttributes, s, i);
    return new pe(e, r, o);
  }
  getScopeNames() {
    return this.scopePath.getSegments();
  }
  getExtensionIfDefined(e) {
    const t = [];
    let n = this;
    for (; n && n !== e; )
      t.push({
        encodedTokenAttributes: n.tokenAttributes,
        scopeNames: n.scopePath.getExtensionIfDefined(
          n.parent?.scopePath ?? null
        ),
      }),
        (n = n.parent);
    return n === e ? t.reverse() : void 0;
  }
}
class de {
  constructor(e, t, n, s, r, i, o, a) {
    (this.parent = e),
      (this.ruleId = t),
      (this.beginRuleCapturedEOL = r),
      (this.endRule = i),
      (this.nameScopesList = o),
      (this.contentNameScopesList = a),
      (this._stackElementBrand = void 0),
      (this.depth = this.parent ? this.parent.depth + 1 : 1),
      (this._enterPos = n),
      (this._anchorPos = s);
  }
  equals(e) {
    return null !== e && de._equals(this, e);
  }
  static _equals(e, t) {
    return (
      e === t ||
      (!!this._structuralEquals(e, t) &&
        pe.equals(e.contentNameScopesList, t.contentNameScopesList))
    );
  }
  static _structuralEquals(e, t) {
    for (;;) {
      if (e === t) return !0;
      if (!e && !t) return !0;
      if (!e || !t) return !1;
      if (
        e.depth !== t.depth ||
        e.ruleId !== t.ruleId ||
        e.endRule !== t.endRule
      )
        return !1;
      (e = e.parent), (t = t.parent);
    }
  }
  clone() {
    return this;
  }
  static _reset(e) {
    for (; e; ) (e._enterPos = -1), (e._anchorPos = -1), (e = e.parent);
  }
  reset() {
    de._reset(this);
  }
  pop() {
    return this.parent;
  }
  safePop() {
    return this.parent ? this.parent : this;
  }
  push(e, t, n, s, r, i, o) {
    return new de(this, e, t, n, s, r, i, o);
  }
  getEnterPos() {
    return this._enterPos;
  }
  getAnchorPos() {
    return this._anchorPos;
  }
  getRule(e) {
    return e.getRule(this.ruleId);
  }
  toString() {
    const e = [];
    return this._writeString(e, 0), "[" + e.join(",") + "]";
  }
  _writeString(e, t) {
    return (
      this.parent && (t = this.parent._writeString(e, t)),
      (e[t++] = `(${
        this.ruleId
      }, ${this.nameScopesList?.toString()}, ${this.contentNameScopesList?.toString()})`),
      t
    );
  }
  withContentNameScopesList(e) {
    return this.contentNameScopesList === e
      ? this
      : this.parent.push(
          this.ruleId,
          this._enterPos,
          this._anchorPos,
          this.beginRuleCapturedEOL,
          this.endRule,
          this.nameScopesList,
          e
        );
  }
  withEndRule(e) {
    return this.endRule === e
      ? this
      : new de(
          this.parent,
          this.ruleId,
          this._enterPos,
          this._anchorPos,
          this.beginRuleCapturedEOL,
          e,
          this.nameScopesList,
          this.contentNameScopesList
        );
  }
  hasSameRuleAs(e) {
    let t = this;
    for (; t && t._enterPos === e._enterPos; ) {
      if (t.ruleId === e.ruleId) return !0;
      t = t.parent;
    }
    return !1;
  }
  toStateStackFrame() {
    return {
      ruleId: this.ruleId,
      beginRuleCapturedEOL: this.beginRuleCapturedEOL,
      endRule: this.endRule,
      nameScopesList:
        this.nameScopesList?.getExtensionIfDefined(
          this.parent?.nameScopesList ?? null
        ) ?? [],
      contentNameScopesList:
        this.contentNameScopesList?.getExtensionIfDefined(
          this.nameScopesList
        ) ?? [],
    };
  }
  static pushFrame(e, t) {
    const n = pe.fromExtension(e?.nameScopesList ?? null, t.nameScopesList);
    return new de(
      e,
      t.ruleId,
      t.enterPos ?? -1,
      t.anchorPos ?? -1,
      t.beginRuleCapturedEOL,
      t.endRule,
      n,
      pe.fromExtension(n, t.contentNameScopesList)
    );
  }
}
de.NULL = new de(null, 0, 0, 0, !1, null, null, null);
class fe {
  constructor(e, t) {
    (this.allowAny = !1),
      (this.balancedBracketScopes = e.flatMap((e) =>
        "*" === e ? ((this.allowAny = !0), []) : r(e, ce).map((e) => e.matcher)
      )),
      (this.unbalancedBracketScopes = t.flatMap((e) =>
        r(e, ce).map((e) => e.matcher)
      ));
  }
  get matchesAlways() {
    return this.allowAny && 0 === this.unbalancedBracketScopes.length;
  }
  get matchesNever() {
    return 0 === this.balancedBracketScopes.length && !this.allowAny;
  }
  match(e) {
    for (const t of this.unbalancedBracketScopes) if (t(e)) return !1;
    for (const t of this.balancedBracketScopes) if (t(e)) return !0;
    return this.allowAny;
  }
}
class me {
  constructor(e, t, s, r) {
    (this.balancedBracketSelectors = r),
      (this._emitBinaryTokens = e),
      (this._tokenTypeOverrides = s),
      (this._lineText = n ? t : null),
      (this._tokens = []),
      (this._binaryTokens = []),
      (this._lastTokenEndIndex = 0);
  }
  produce(e, t) {
    this.produceFromScopes(e.contentNameScopesList, t);
  }
  produceFromScopes(e, t) {
    if (this._lastTokenEndIndex >= t) return;
    if (this._emitBinaryTokens) {
      let r = e?.tokenAttributes ?? 0,
        i = !1;
      if (
        (this.balancedBracketSelectors?.matchesAlways && (i = !0),
        this._tokenTypeOverrides.length > 0 ||
          (this.balancedBracketSelectors &&
            !this.balancedBracketSelectors.matchesAlways &&
            !this.balancedBracketSelectors.matchesNever))
      ) {
        const t = e?.getScopeNames() ?? [];
        for (const e of this._tokenTypeOverrides)
          e.matcher(t) && (r = s.set(r, 0, e.type, null, -1, 0, 0));
        this.balancedBracketSelectors &&
          (i = this.balancedBracketSelectors.match(t));
      }
      if (
        (i && (r = s.set(r, 0, 8, i, -1, 0, 0)),
        this._binaryTokens.length > 0 &&
          this._binaryTokens[this._binaryTokens.length - 1] === r)
      )
        return void (this._lastTokenEndIndex = t);
      if (n) {
        const n = e?.getScopeNames() ?? [];
        console.log(
          "  token: |" +
            this._lineText
              .substring(this._lastTokenEndIndex, t)
              .replace(/\n$/, "\\n") +
            "|"
        );
        for (let e = 0; e < n.length; e++) console.log("      * " + n[e]);
      }
      return (
        this._binaryTokens.push(this._lastTokenEndIndex),
        this._binaryTokens.push(r),
        void (this._lastTokenEndIndex = t)
      );
    }
    const r = e?.getScopeNames() ?? [];
    if (n) {
      console.log(
        "  token: |" +
          this._lineText
            .substring(this._lastTokenEndIndex, t)
            .replace(/\n$/, "\\n") +
          "|"
      );
      for (let e = 0; e < r.length; e++) console.log("      * " + r[e]);
    }
    this._tokens.push({
      startIndex: this._lastTokenEndIndex,
      endIndex: t,
      scopes: r,
    }),
      (this._lastTokenEndIndex = t);
  }
  getResult(e, t) {
    return (
      this._tokens.length > 0 &&
        this._tokens[this._tokens.length - 1].startIndex === t - 1 &&
        this._tokens.pop(),
      0 === this._tokens.length &&
        ((this._lastTokenEndIndex = -1),
        this.produce(e, t),
        (this._tokens[this._tokens.length - 1].startIndex = 0)),
      this._tokens
    );
  }
  getBinaryResult(e, t) {
    this._binaryTokens.length > 0 &&
      this._binaryTokens[this._binaryTokens.length - 2] === t - 1 &&
      (this._binaryTokens.pop(), this._binaryTokens.pop()),
      0 === this._binaryTokens.length &&
        ((this._lastTokenEndIndex = -1),
        this.produce(e, t),
        (this._binaryTokens[this._binaryTokens.length - 2] = 0));
    const n = new Uint32Array(this._binaryTokens.length);
    for (let e = 0, t = this._binaryTokens.length; e < t; e++)
      n[e] = this._binaryTokens[e];
    return n;
  }
}
function ge(e, t, n) {
  const s = e.length;
  let r = 0,
    i = 1,
    o = 0;
  function a(t) {
    if (null === n) r += t;
    else
      for (; t > 0; )
        10 === e.charCodeAt(r) ? (r++, i++, (o = 0)) : (r++, o++), t--;
  }
  function c(e) {
    null === n ? (r = e) : a(e - r);
  }
  function l() {
    for (; r < s; ) {
      let t = e.charCodeAt(r);
      if (32 !== t && 9 !== t && 13 !== t && 10 !== t) break;
      a(1);
    }
  }
  function h(t) {
    return e.substr(r, t.length) === t && (a(t.length), !0);
  }
  function u(t) {
    let n = e.indexOf(t, r);
    c(-1 !== n ? n + t.length : s);
  }
  function p(t) {
    let n = e.indexOf(t, r);
    if (-1 !== n) {
      let s = e.substring(r, n);
      return c(n + t.length), s;
    }
    {
      let t = e.substr(r);
      return c(s), t;
    }
  }
  s > 0 && 65279 === e.charCodeAt(0) && (r = 1);
  let d = 0,
    f = null,
    m = [],
    g = [],
    _ = null;
  function y(e, t) {
    m.push(d), g.push(f), (d = e), (f = t);
  }
  function C() {
    if (0 === m.length) return k("illegal state stack");
    (d = m.pop()), (f = g.pop());
  }
  function k(t) {
    throw new Error(
      "Near offset " + r + ": " + t + " ~~~" + e.substr(r, 50) + "~~~"
    );
  }
  const b = function () {
      if (null === _) return k("missing <key>");
      let e = {};
      null !== n && (e[n] = { filename: t, line: i, char: o }),
        (f[_] = e),
        (_ = null),
        y(1, e);
    },
    S = function () {
      if (null === _) return k("missing <key>");
      let e = [];
      (f[_] = e), (_ = null), y(2, e);
    },
    w = function () {
      let e = {};
      null !== n && (e[n] = { filename: t, line: i, char: o }),
        f.push(e),
        y(1, e);
    },
    A = function () {
      let e = [];
      f.push(e), y(2, e);
    };
  function P() {
    if (1 !== d) return k("unexpected </dict>");
    C();
  }
  function R() {
    return 1 === d || 2 !== d ? k("unexpected </array>") : void C();
  }
  function N(e) {
    if (1 === d) {
      if (null === _) return k("missing <key>");
      (f[_] = e), (_ = null);
    } else 2 === d ? f.push(e) : (f = e);
  }
  function I(e) {
    if (isNaN(e)) return k("cannot parse float");
    if (1 === d) {
      if (null === _) return k("missing <key>");
      (f[_] = e), (_ = null);
    } else 2 === d ? f.push(e) : (f = e);
  }
  function G(e) {
    if (isNaN(e)) return k("cannot parse integer");
    if (1 === d) {
      if (null === _) return k("missing <key>");
      (f[_] = e), (_ = null);
    } else 2 === d ? f.push(e) : (f = e);
  }
  function x(e) {
    if (1 === d) {
      if (null === _) return k("missing <key>");
      (f[_] = e), (_ = null);
    } else 2 === d ? f.push(e) : (f = e);
  }
  function v(e) {
    if (1 === d) {
      if (null === _) return k("missing <key>");
      (f[_] = e), (_ = null);
    } else 2 === d ? f.push(e) : (f = e);
  }
  function E(e) {
    if (1 === d) {
      if (null === _) return k("missing <key>");
      (f[_] = e), (_ = null);
    } else 2 === d ? f.push(e) : (f = e);
  }
  function L() {
    let e = p(">"),
      t = !1;
    return (
      47 === e.charCodeAt(e.length - 1) &&
        ((t = !0), (e = e.substring(0, e.length - 1))),
      { name: e.trim(), isClosed: t }
    );
  }
  function T(e) {
    if (e.isClosed) return "";
    let t = p("</");
    return (
      u(">"),
      t
        .replace(/&#([0-9]+);/g, function (e, t) {
          return String.fromCodePoint(parseInt(t, 10));
        })
        .replace(/&#x([0-9a-f]+);/g, function (e, t) {
          return String.fromCodePoint(parseInt(t, 16));
        })
        .replace(/&amp;|&lt;|&gt;|&quot;|&apos;/g, function (e) {
          switch (e) {
            case "&amp;":
              return "&";
            case "&lt;":
              return "<";
            case "&gt;":
              return ">";
            case "&quot;":
              return '"';
            case "&apos;":
              return "'";
          }
          return e;
        })
    );
  }
  for (; r < s && (l(), !(r >= s)); ) {
    const c = e.charCodeAt(r);
    if ((a(1), 60 !== c)) return k("expected <");
    if (r >= s) return k("unexpected end of input");
    const p = e.charCodeAt(r);
    if (63 === p) {
      a(1), u("?>");
      continue;
    }
    if (33 === p) {
      if ((a(1), h("--"))) {
        u("--\x3e");
        continue;
      }
      u(">");
      continue;
    }
    if (47 === p) {
      if ((a(1), l(), h("plist"))) {
        u(">");
        continue;
      }
      if (h("dict")) {
        u(">"), P();
        continue;
      }
      if (h("array")) {
        u(">"), R();
        continue;
      }
      return k("unexpected closed tag");
    }
    let m = L();
    switch (m.name) {
      case "dict":
        1 === d
          ? b()
          : 2 === d
          ? w()
          : ((f = {}),
            null !== n && (f[n] = { filename: t, line: i, char: o }),
            y(1, f)),
          m.isClosed && P();
        continue;
      case "array":
        1 === d ? S() : 2 === d ? A() : ((f = []), y(2, f)), m.isClosed && R();
        continue;
      case "key":
        ($ = T(m)),
          1 !== d
            ? k("unexpected <key>")
            : null !== _
            ? k("too many <key>")
            : (_ = $);
        continue;
      case "string":
        N(T(m));
        continue;
      case "real":
        I(parseFloat(T(m)));
        continue;
      case "integer":
        G(parseInt(T(m), 10));
        continue;
      case "date":
        x(new Date(T(m)));
        continue;
      case "data":
        v(T(m));
        continue;
      case "true":
        T(m), E(!0);
        continue;
      case "false":
        T(m), E(!1);
        continue;
    }
    if (!/^plist/.test(m.name)) return k("unexpected opened tag " + m.name);
  }
  var $;
  return f;
}
function _e(e, t) {
  throw new Error(
    "Near offset " +
      e.pos +
      ": " +
      t +
      " ~~~" +
      e.source.substr(e.pos, 50) +
      "~~~"
  );
}
class ye {
  constructor(e) {
    (this.source = e),
      (this.pos = 0),
      (this.len = e.length),
      (this.line = 1),
      (this.char = 0);
  }
}
class Ce {
  constructor() {
    (this.value = null),
      (this.type = 0),
      (this.offset = -1),
      (this.len = -1),
      (this.line = -1),
      (this.char = -1);
  }
  toLocation(e) {
    return { filename: e, line: this.line, char: this.char };
  }
}
function ke(e, t) {
  (t.value = null),
    (t.type = 0),
    (t.offset = -1),
    (t.len = -1),
    (t.line = -1),
    (t.char = -1);
  let n,
    s = e.source,
    r = e.pos,
    i = e.len,
    o = e.line,
    a = e.char;
  for (;;) {
    if (r >= i) return !1;
    if (((n = s.charCodeAt(r)), 32 !== n && 9 !== n && 13 !== n)) {
      if (10 !== n) break;
      r++, o++, (a = 0);
    } else r++, a++;
  }
  if (((t.offset = r), (t.line = o), (t.char = a), 34 === n)) {
    for (t.type = 1, r++, a++; ; ) {
      if (r >= i) return !1;
      if (((n = s.charCodeAt(r)), r++, a++, 92 !== n)) {
        if (34 === n) break;
      } else r++, a++;
    }
    t.value = s
      .substring(t.offset + 1, r - 1)
      .replace(/\\u([0-9A-Fa-f]{4})/g, (e, t) =>
        String.fromCodePoint(parseInt(t, 16))
      )
      .replace(/\\(.)/g, (t, n) => {
        switch (n) {
          case '"':
            return '"';
          case "\\":
            return "\\";
          case "/":
            return "/";
          case "b":
            return "\b";
          case "f":
            return "\f";
          case "n":
            return "\n";
          case "r":
            return "\r";
          case "t":
            return "\t";
          default:
            _e(e, "invalid escape sequence");
        }
        throw new Error("unreachable");
      });
  } else if (91 === n) (t.type = 2), r++, a++;
  else if (123 === n) (t.type = 3), r++, a++;
  else if (93 === n) (t.type = 4), r++, a++;
  else if (125 === n) (t.type = 5), r++, a++;
  else if (58 === n) (t.type = 6), r++, a++;
  else if (44 === n) (t.type = 7), r++, a++;
  else if (110 === n) {
    if (((t.type = 8), r++, a++, (n = s.charCodeAt(r)), 117 !== n)) return !1;
    if ((r++, a++, (n = s.charCodeAt(r)), 108 !== n)) return !1;
    if ((r++, a++, (n = s.charCodeAt(r)), 108 !== n)) return !1;
    r++, a++;
  } else if (116 === n) {
    if (((t.type = 9), r++, a++, (n = s.charCodeAt(r)), 114 !== n)) return !1;
    if ((r++, a++, (n = s.charCodeAt(r)), 117 !== n)) return !1;
    if ((r++, a++, (n = s.charCodeAt(r)), 101 !== n)) return !1;
    r++, a++;
  } else if (102 === n) {
    if (((t.type = 10), r++, a++, (n = s.charCodeAt(r)), 97 !== n)) return !1;
    if ((r++, a++, (n = s.charCodeAt(r)), 108 !== n)) return !1;
    if ((r++, a++, (n = s.charCodeAt(r)), 115 !== n)) return !1;
    if ((r++, a++, (n = s.charCodeAt(r)), 101 !== n)) return !1;
    r++, a++;
  } else
    for (t.type = 11; ; ) {
      if (r >= i) return !1;
      if (
        ((n = s.charCodeAt(r)),
        !(
          46 === n ||
          (n >= 48 && n <= 57) ||
          101 === n ||
          69 === n ||
          45 === n ||
          43 === n
        ))
      )
        break;
      r++, a++;
    }
  return (
    (t.len = r - t.offset),
    null === t.value && (t.value = s.substr(t.offset, t.len)),
    (e.pos = r),
    (e.line = o),
    (e.char = a),
    !0
  );
}
class be {
  constructor(e, t) {
    (this._onigLibPromise = t),
      (this._grammars = new Map()),
      (this._rawGrammars = new Map()),
      (this._injectionGrammars = new Map()),
      (this._theme = e);
  }
  dispose() {
    for (const e of this._grammars.values()) e.dispose();
  }
  setTheme(e) {
    this._theme = e;
  }
  getColorMap() {
    return this._theme.getColorMap();
  }
  addGrammar(e, t) {
    this._rawGrammars.set(e.scopeName, e),
      t && this._injectionGrammars.set(e.scopeName, t);
  }
  lookup(e) {
    return this._rawGrammars.get(e);
  }
  injections(e) {
    return this._injectionGrammars.get(e);
  }
  getDefaults() {
    return this._theme.getDefaults();
  }
  themeMatch(e) {
    return this._theme.match(e);
  }
  async grammarForScopeName(e, t, n, s, r) {
    if (!this._grammars.has(e)) {
      let i = this._rawGrammars.get(e);
      if (!i) return null;
      this._grammars.set(
        e,
        (function (e, t, n, s, r, i, o, a) {
          return new he(e, t, n, s, r, i, o, a);
        })(e, i, t, n, s, r, this, await this._onigLibPromise)
      );
    }
    return this._grammars.get(e);
  }
}
function Se(e, t) {
  let n = 0;
  const s = [];
  let r = e,
    i = t;
  for (; r !== i; )
    r && (!i || r.depth >= i.depth)
      ? (n++, (r = r.parent))
      : (s.push(i.toStateStackFrame()), (i = i.parent));
  return { pops: n, newFrames: s.reverse() };
}
function we(e, t) {
  let n = e;
  for (let e = 0; e < t.pops; e++) n = n.parent;
  for (const e of t.newFrames) n = de.pushFrame(n, e);
  return n;
}
class Ae {
  constructor(e) {
    (this._options = e),
      (this._syncRegistry = new be(
        z.createFromRawTheme(e.theme, e.colorMap),
        e.onigLib
      )),
      (this._ensureGrammarCache = new Map());
  }
  dispose() {
    this._syncRegistry.dispose();
  }
  setTheme(e, t) {
    this._syncRegistry.setTheme(z.createFromRawTheme(e, t));
  }
  getColorMap() {
    return this._syncRegistry.getColorMap();
  }
  loadGrammarWithEmbeddedLanguages(e, t, n) {
    return this.loadGrammarWithConfiguration(e, t, { embeddedLanguages: n });
  }
  loadGrammarWithConfiguration(e, t, n) {
    return this._loadGrammar(
      e,
      t,
      n.embeddedLanguages,
      n.tokenTypes,
      new fe(
        n.balancedBracketSelectors || [],
        n.unbalancedBracketSelectors || []
      )
    );
  }
  loadGrammar(e) {
    return this._loadGrammar(e, 0, null, null, null);
  }
  async _loadGrammar(e, t, n, s, r) {
    const i = new b(this._syncRegistry, e);
    for (; i.Q.length > 0; )
      await Promise.all(i.Q.map((e) => this._loadSingleGrammar(e.scopeName))),
        i.processQueue();
    return this._grammarForScopeName(e, t, n, s, r);
  }
  async _loadSingleGrammar(e) {
    return (
      this._ensureGrammarCache.has(e) ||
        this._ensureGrammarCache.set(e, this._doLoadSingleGrammar(e)),
      this._ensureGrammarCache.get(e)
    );
  }
  async _doLoadSingleGrammar(e) {
    const t = await this._options.loadGrammar(e);
    if (t) {
      const n =
        "function" == typeof this._options.getInjections
          ? this._options.getInjections(e)
          : void 0;
      this._syncRegistry.addGrammar(t, n);
    }
  }
  async addGrammar(e, t = [], n = 0, s = null) {
    return (
      this._syncRegistry.addGrammar(e, t),
      await this._grammarForScopeName(e.scopeName, n, s)
    );
  }
  _grammarForScopeName(e, t = 0, n = null, s = null, r = null) {
    return this._syncRegistry.grammarForScopeName(e, t, n, s, r);
  }
}
const Pe = de.NULL,
  Re = function (e, t = null) {
    return null !== t && /\.json$/.test(t)
      ? ((s = e),
        (r = t),
        n
          ? (function (e, t, n) {
              let s = new ye(e),
                r = new Ce(),
                i = 0,
                o = null,
                a = [],
                c = [];
              function l() {
                a.push(i), c.push(o);
              }
              function h() {
                (i = a.pop()), (o = c.pop());
              }
              function u(e) {
                _e(s, e);
              }
              for (; ke(s, r); ) {
                if (0 === i) {
                  if (
                    (null !== o && u("too many constructs in root"),
                    3 === r.type)
                  ) {
                    (o = {}),
                      (o.$vscodeTextmateLocation = r.toLocation(t)),
                      l(),
                      (i = 1);
                    continue;
                  }
                  if (2 === r.type) {
                    (o = []), l(), (i = 4);
                    continue;
                  }
                  u("unexpected token in root");
                }
                if (2 === i) {
                  if (5 === r.type) {
                    h();
                    continue;
                  }
                  if (7 === r.type) {
                    i = 3;
                    continue;
                  }
                  u("expected , or }");
                }
                if (1 === i || 3 === i) {
                  if (1 === i && 5 === r.type) {
                    h();
                    continue;
                  }
                  if (1 === r.type) {
                    let e = r.value;
                    if (
                      ((ke(s, r) && 6 === r.type) || u("expected colon"),
                      ke(s, r) || u("expected value"),
                      (i = 2),
                      1 === r.type)
                    ) {
                      o[e] = r.value;
                      continue;
                    }
                    if (8 === r.type) {
                      o[e] = null;
                      continue;
                    }
                    if (9 === r.type) {
                      o[e] = !0;
                      continue;
                    }
                    if (10 === r.type) {
                      o[e] = !1;
                      continue;
                    }
                    if (11 === r.type) {
                      o[e] = parseFloat(r.value);
                      continue;
                    }
                    if (2 === r.type) {
                      let t = [];
                      (o[e] = t), l(), (i = 4), (o = t);
                      continue;
                    }
                    if (3 === r.type) {
                      let n = {};
                      (n.$vscodeTextmateLocation = r.toLocation(t)),
                        (o[e] = n),
                        l(),
                        (i = 1),
                        (o = n);
                      continue;
                    }
                  }
                  u("unexpected token in dict");
                }
                if (5 === i) {
                  if (4 === r.type) {
                    h();
                    continue;
                  }
                  if (7 === r.type) {
                    i = 6;
                    continue;
                  }
                  u("expected , or ]");
                }
                if (4 === i || 6 === i) {
                  if (4 === i && 4 === r.type) {
                    h();
                    continue;
                  }
                  if (((i = 5), 1 === r.type)) {
                    o.push(r.value);
                    continue;
                  }
                  if (8 === r.type) {
                    o.push(null);
                    continue;
                  }
                  if (9 === r.type) {
                    o.push(!0);
                    continue;
                  }
                  if (10 === r.type) {
                    o.push(!1);
                    continue;
                  }
                  if (11 === r.type) {
                    o.push(parseFloat(r.value));
                    continue;
                  }
                  if (2 === r.type) {
                    let e = [];
                    o.push(e), l(), (i = 4), (o = e);
                    continue;
                  }
                  if (3 === r.type) {
                    let e = {};
                    (e.$vscodeTextmateLocation = r.toLocation(t)),
                      o.push(e),
                      l(),
                      (i = 1),
                      (o = e);
                    continue;
                  }
                  u("unexpected token in array");
                }
                u("unknown state");
              }
              return 0 !== c.length && u("unclosed constructs"), o;
            })(s, r)
          : JSON.parse(s))
      : (function (e, t) {
          return n
            ? (function (e, t, n) {
                return ge(e, t, "$vscodeTextmateLocation");
              })(e, t)
            : (function (e) {
                return ge(e, null, null);
              })(e);
        })(e, t);
    var s, r;
  };
var Ne = t._X,
  Ie = t.Bz,
  Ge = t.ot,
  xe = t.u,
  ve = t.jG,
  Ee = t.Pn;
export {
  Ne as INITIAL,
  Ie as Registry,
  Ge as applyStateStackDiff,
  xe as diffStateStacksRefEq,
  ve as disposeOnigString,
  Ee as parseRawGrammar,
};
