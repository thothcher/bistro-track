/* ==========================================================================
   Le Bistro track: shared helpers for the L27–L31 decks
   - Schemas: <b class="wire" data-from="a" data-to="b"> inside a .schema becomes an SVG arrow
     between the nodes with those ids (it keeps data-step / data-on, so it can draw itself on a step).
     <b class="packet" data-wire="id"> rides along a wire when it gets the class "go" (use data-on).
   - Le Bistro data and a mini dish card for the live demos (data: _shared/bistro-data.js)
   Classic script, works from file://. Load it after deck.js and call Track.init() before Deck.init().
   ========================================================================== */
(function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var Track = window.Track = {};

  /* ---------- schemas ---------- */
  function posIn(el, root) {
    var x = 0, y = 0, n = el;
    while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight };
  }
  function anchor(box, side) {
    if (side === 't') return { x: box.x + box.w / 2, y: box.y, dx: 0, dy: -1 };
    if (side === 'b') return { x: box.x + box.w / 2, y: box.y + box.h, dx: 0, dy: 1 };
    if (side === 'l') return { x: box.x, y: box.y + box.h / 2, dx: -1, dy: 0 };
    return { x: box.x + box.w, y: box.y + box.h / 2, dx: 1, dy: 0 };
  }
  function autoSides(a, b) {
    var dx = (b.x + b.w / 2) - (a.x + a.w / 2), dy = (b.y + b.h / 2) - (a.y + a.h / 2);
    if (Math.abs(dy) > Math.abs(dx) * 0.55) return dy > 0 ? ['b', 't'] : ['t', 'b'];
    return dx > 0 ? ['r', 'l'] : ['l', 'r'];
  }
  function bez(p0, p1, p2, p3, t) {
    var u = 1 - t;
    return {
      x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
      y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y
    };
  }

  function buildSchema(schema) {
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'wires');
    svg.setAttribute('aria-hidden', 'true');
    schema.insertBefore(svg, schema.firstChild);
    var wires = $$('.wire', schema).map(function (spec) {
      var path = document.createElementNS(SVGNS, 'path');
      var head = document.createElementNS(SVGNS, 'path');
      var cls = (spec.getAttribute('class') || '').replace(/\bwire\b/, '').trim();
      path.setAttribute('class', cls);
      path.setAttribute('pathLength', '1');
      head.setAttribute('class', ('wire-head ' + cls).trim());
      ['data-step', 'data-on'].forEach(function (a) {
        if (spec.hasAttribute(a)) { path.setAttribute(a, spec.getAttribute(a)); head.setAttribute(a, spec.getAttribute(a)); }
      });
      // solid wires draw themselves; dashed ones fade in (the draw animation would erase the dashes)
      if (spec.hasAttribute('data-step') && !/\bis-dash\b/.test(cls)) path.setAttribute('data-fx', spec.getAttribute('data-fx') || 'draw');
      svg.appendChild(path);
      if (!spec.hasAttribute('data-nohead')) svg.appendChild(head);
      var label = null;
      if (spec.getAttribute('data-label')) {
        label = document.createElementNS(SVGNS, 'text');
        label.setAttribute('class', 'wire-label');
        label.textContent = spec.getAttribute('data-label');
        if (spec.hasAttribute('data-step')) label.setAttribute('data-step', spec.getAttribute('data-step'));
        svg.appendChild(label);
      }
      var w = {
        id: spec.getAttribute('data-id') || '', from: spec.getAttribute('data-from'), to: spec.getAttribute('data-to'),
        sides: (spec.getAttribute('data-sides') || '').split(/\s+/).filter(Boolean),
        bend: Number(spec.getAttribute('data-bend') || 0.5), gap: Number(spec.getAttribute('data-gap') || 8),
        nohead: spec.hasAttribute('data-nohead'), path: path, head: head, label: label, route: spec.getAttribute('data-route'),
        lx: Number(spec.getAttribute('data-lx') || 0), ly: Number(spec.getAttribute('data-ly') || -10)
      };
      spec.parentNode.removeChild(spec);
      return w;
    });
    schema._wires = wires;
  }

  function layoutSchema(schema) {
    var svg = $('svg.wires', schema);
    if (!svg) return;
    svg.setAttribute('width', schema.offsetWidth);
    svg.setAttribute('height', schema.offsetHeight);
    (schema._wires || []).forEach(function (w) {
      var a = document.getElementById(w.from), b = document.getElementById(w.to);
      if (!a || !b) return;
      var A = posIn(a, schema), B = posIn(b, schema);
      var preset = (schema.getAttribute('data-wire-sides') || '').split(/\s+/).filter(Boolean);
      var sides = w.sides.length === 2 ? w.sides : preset.length === 2 ? preset : autoSides(A, B);
      var p0 = anchor(A, sides[0]), p3 = anchor(B, sides[1]);
      var gap = w.gap, endGap = w.nohead ? gap : gap + 12;
      p0 = { x: p0.x + p0.dx * gap, y: p0.y + p0.dy * gap, dx: p0.dx, dy: p0.dy };
      p3 = { x: p3.x + p3.dx * endGap, y: p3.y + p3.dy * endGap, dx: p3.dx, dy: p3.dy };
      // curve strength follows the distance along the direction the wire leaves its node
      var along = p0.dx ? Math.abs(p3.x - p0.x) : Math.abs(p3.y - p0.y);
      var dist = Math.max(30, along * w.bend);
      var p1 = { x: p0.x + p0.dx * dist, y: p0.y + p0.dy * dist };
      var p2 = { x: p3.x + p3.dx * dist, y: p3.y + p3.dy * dist };
      var route = w.route || schema.getAttribute('data-wire-route') || 'curve';
      var f = function (n) { return n.toFixed(1); };
      var d;
      if (route === 'elbow' && !p0.dx && !p3.dx && Math.abs(p3.x - p0.x) > 2) {
        // org-chart style: down, across, down, with rounded corners
        var ym = (p0.y + p3.y) / 2, r = Math.min(14, Math.abs(p3.x - p0.x) / 2, Math.abs(p3.y - p0.y) / 4);
        var sx = p3.x > p0.x ? 1 : -1, sy = p3.y > p0.y ? 1 : -1;
        d = 'M' + f(p0.x) + ' ' + f(p0.y) + ' V' + f(ym - sy * r) + ' Q' + f(p0.x) + ' ' + f(ym) + ' ' + f(p0.x + sx * r) + ' ' + f(ym) +
          ' H' + f(p3.x - sx * r) + ' Q' + f(p3.x) + ' ' + f(ym) + ' ' + f(p3.x) + ' ' + f(ym + sy * r) + ' V' + f(p3.y);
        p1 = { x: p0.x, y: ym }; p2 = { x: p3.x, y: ym };
      } else {
        d = 'M' + f(p0.x) + ' ' + f(p0.y) + ' C' + f(p1.x) + ' ' + f(p1.y) + ' ' + f(p2.x) + ' ' + f(p2.y) + ' ' + f(p3.x) + ' ' + f(p3.y);
      }
      w.path.setAttribute('d', d);
      w.d = d;
      if (!w.nohead) {
        // a small arrowhead that points into the target node
        var tip = { x: p3.x - p3.dx * 12, y: p3.y - p3.dy * 12 };
        var ux = -p3.dx, uy = -p3.dy, px = -uy, py = ux;
        var bx = p3.x, by = p3.y;
        w.head.setAttribute('d', 'M' + tip.x + ' ' + tip.y + ' L' + (bx + px * 8) + ' ' + (by + py * 8) + ' L' + (bx - px * 8) + ' ' + (by - py * 8) + ' Z');
      }
      if (w.label) {
        var m = bez(p0, p1, p2, p3, 0.5);
        w.label.setAttribute('x', (m.x + w.lx).toFixed(1));
        w.label.setAttribute('y', (m.y + w.ly).toFixed(1));
        w.label.setAttribute('text-anchor', 'middle');
      }
      if (w.id) $$('.packet[data-wire="' + w.id + '"]', schema).forEach(function (pk) { pk.style.offsetPath = "path('" + d + "')"; });
    });
  }

  Track.layout = function () { $$('.schema').forEach(layoutSchema); };
  Track.init = function () {
    $$('.schema').forEach(buildSchema);
    Track.layout();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(Track.layout);
    window.addEventListener('load', Track.layout);
  };
  /* restart a CSS animation (for demos that can be replayed) */
  Track.replay = function (el, cls) {
    cls = cls || 'go';
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
  };

  /* ---------- Le Bistro data for live demos ---------- */
  var DATA = window.BISTRO || { dishes: [], categories: [] };
  Track.dishes = DATA.dishes;
  Track.categories = DATA.categories;
  Track.byId = function (id) { return DATA.dishes.filter(function (d) { return d.id === id; })[0]; };
  Track.imgBase = '../_shared/img/dishes/';
  Track.img = function (dish) { return Track.imgBase + String(dish.imageUrl || '').split('/').pop(); };
  Track.price = function (n) { return '₾' + (Number.isInteger(n) ? n : Number(n).toFixed(2)); };
  Track.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  /* a mini DishCard, the same look as our React DishCard */
  Track.card = function (dish, opts) {
    opts = opts || {};
    var foot = opts.foot !== undefined ? opts.foot
      : '<button type="button" class="mbtn"' + (dish.isAvailable === false ? ' disabled' : '') + '>Add to cart</button>';
    return '<article class="mcard" data-dish="' + dish.id + '">' +
      (opts.noImg ? '' : '<img src="' + Track.img(dish) + '" alt="">') +
      '<div class="mcard__body"><div class="mcard__title"><span>' + Track.esc(opts.name || dish.name) + '</span><span class="p">' + (opts.price || Track.price(dish.price)) + '</span></div>' +
      (opts.desc === false ? '' : '<div class="mcard__desc">' + Track.esc(dish.description) + '</div>') +
      (dish.isAvailable === false && opts.badge !== false ? '<div class="mcard__badge">Off the menu today</div>' : '') +
      '<div class="mcard__foot">' + foot + '</div></div></article>';
  };
  Track.sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  /* append a line to a fake DevTools panel */
  Track.log = function (panel, text, kind) {
    var body = $('.devtools__body', panel) || panel;
    var line = document.createElement('div');
    line.className = 'devtools__line' + (kind ? ' is-' + kind : '');
    line.textContent = text;
    body.appendChild(line);
    while (body.children.length > 40) body.removeChild(body.firstChild);
    return line;
  };
  Track.clear = function (panel) { var body = $('.devtools__body', panel) || panel; body.innerHTML = ''; };

  /* ---------- AI: copy a CRAFT prompt ---------- */
  Track.copy = function (text, btn, msg) {
    function done() {
      if (btn) {
        btn.classList.add('is-done');
        btn.innerHTML = Deck.icon('check') + 'Copied';
        setTimeout(function () { btn.classList.remove('is-done'); btn.innerHTML = Deck.icon('copy') + 'Copy'; }, 2200);
      }
      Deck.toast(msg || 'Prompt copied. Paste it into your AI tool.');
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { if (document.execCommand('copy')) done(); else Deck.toast('Copy failed. Select the prompt and press Ctrl+C.'); }
      catch (e) { Deck.toast('Copy failed. Select the prompt and press Ctrl+C.'); }
      ta.remove();
    }
    try {
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    } catch (e) { fallback(); }
  };
  /* the text a CRAFT box copies: "CONTEXT\n…\n\nROLE\n…" for the parts, the plain paragraph for the short version */
  Track.craftText = function (box) {
    var parts = $$('.craft__part', box);
    if (parts.length) {
      return parts.map(function (p) { return p.getAttribute('data-label') + '\n' + $('.craft__text', p).textContent.trim(); }).join('\n\n');
    }
    var short = $('.craft__short', box);
    return short ? short.textContent.replace(/\s+/g, ' ').trim() : '';
  };
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-craft-copy]');
    if (!btn) return;
    e.stopPropagation();
    Track.copy(Track.craftText(btn.closest('.craft')), btn);
  });
})();
