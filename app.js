/* build: 2027-close-tab-overlay
   ==========================================================================
   Nhật Ký Lính Thông Tin — app logic
   Reads the `chapters` array from data.js, builds the sidebar table of
   contents, renders whichever chapter is selected into #reader, and drives
   the search box + reading-progress bar. You shouldn't need to edit this
   file to add/change diary content — see data.js for that.
   ========================================================================== */

(function () {
  var readerEl = document.getElementById('reader');
  var tocEl = document.getElementById('toc');
  var sidebarEl = document.getElementById('sidebar');
  var scrimEl = document.getElementById('scrim');
  var toggleEl = document.getElementById('drawerToggle');
  var searchEl = document.getElementById('searchInput');
  var progressFillEl = document.getElementById('progressFill');
  var mastheadCountEl = document.getElementById('mastheadCount');

  // Published as a Claude Artifact, this page runs inside a sandboxed iframe
  // whose address/history is invisible to the browser's real URL bar and
  // Back/Forward — only the outer claude.ai page is a real history entry.
  // So on that host, a hash in the URL survives clicks but not a real
  // reload (the iframe just re-loads the bare document). localStorage on
  // the iframe's own origin does survive a reload, so it's used as a
  // fallback "last chapter read" when there's no hash to go on.
  var LAST_CHAPTER_KEY = 'nkltt:lastChapter';
  function saveLastChapter(id) {
    try { localStorage.setItem(LAST_CHAPTER_KEY, id); } catch (e) {}
  }
  function loadLastChapter() {
    try { return localStorage.getItem(LAST_CHAPTER_KEY); } catch (e) { return null; }
  }

  // Reader text size (A− / A+ under the chapter title). One multiplier,
  // --text-scale on <html>, scales the diary text, the "Ghi chú" note and
  // the signature (see styles.css). Remembered per browser.
  var TEXT_SCALE_KEY = 'nkltt:textScale';
  var TEXT_SCALES = [0.85, 0.92, 1, 1.1, 1.2, 1.32, 1.45];
  var _textScaleIdx = 2;
  (function () {
    var saved = null;
    try { saved = parseFloat(localStorage.getItem(TEXT_SCALE_KEY)); } catch (e) {}
    var i = TEXT_SCALES.indexOf(saved);
    if (i !== -1) _textScaleIdx = i;
    applyTextScale();
  })();
  function applyTextScale() {
    document.documentElement.style.setProperty('--text-scale', TEXT_SCALES[_textScaleIdx]);
    var pct = document.getElementById('fsValue');
    if (pct) pct.textContent = Math.round(TEXT_SCALES[_textScaleIdx] * 100) + '%';
    var dec = document.getElementById('fsDec');
    var inc = document.getElementById('fsInc');
    if (dec) dec.disabled = _textScaleIdx === 0;
    if (inc) inc.disabled = _textScaleIdx === TEXT_SCALES.length - 1;
  }
  function stepTextScale(d) {
    if (d === 0) _textScaleIdx = 2;
    else _textScaleIdx = Math.max(0, Math.min(TEXT_SCALES.length - 1, _textScaleIdx + d));
    applyTextScale();
    try { localStorage.setItem(TEXT_SCALE_KEY, String(TEXT_SCALES[_textScaleIdx])); } catch (e) {}
  }
  function textSizeControlHtml() {
    return '<div class="fs-control" role="group" aria-label="Cỡ chữ">' +
        '<button type="button" class="fs-btn" id="fsDec" data-fs="-1" aria-label="Giảm cỡ chữ" title="Giảm cỡ chữ">' +
          '<span class="fs-a fs-a-sm">A</span><span class="fs-sign">−</span></button>' +
        '<button type="button" class="fs-value" id="fsValue" data-fs="0" title="Cỡ chữ mặc định">100%</button>' +
        '<button type="button" class="fs-btn" id="fsInc" data-fs="1" aria-label="Tăng cỡ chữ" title="Tăng cỡ chữ">' +
          '<span class="fs-a fs-a-lg">A</span><span class="fs-sign">+</span></button>' +
      '</div>';
  }
  readerEl.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('[data-fs]');
    if (b && !b.disabled) stepTextScale(parseInt(b.getAttribute('data-fs'), 10));
  });

  // The admin inbox isn't a chapter, but it reuses the same "last place"
  // storage/hash so leaving the site and coming back restores it too,
  // instead of always falling through to chapter 1 (see routing near the
  // bottom of this file and renderAdminInbox's history/localStorage calls).
  var ADMIN_INBOX_ROUTE = 'admin-inbox';
  // Same idea for the admin's "Người dùng" (user list) page.
  var ADMIN_USERS_ROUTE = 'admin-users';

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // The diary text sometimes arrives as "decomposed" Unicode (a base letter
  // plus a separate floating accent mark, e.g. "â" + a combining grave).
  // Well-built fonts stack those correctly, but plainer fallback fonts show
  // the mark detached next to the letter (e.g. "Lâ`n" instead of "Lần").
  // Normalizing to NFC merges each pair into the single precomposed
  // character every font supports natively, so this fixes rendering no
  // matter which font ends up loading.
  function normalizeDeep(value) {
    if (typeof value === 'string') return value.normalize('NFC');
    if (Array.isArray(value)) return value.map(normalizeDeep);
    if (value && typeof value === 'object') {
      var out = {};
      for (var k in value) {
        if (Object.prototype.hasOwnProperty.call(value, k)) out[k] = normalizeDeep(value[k]);
      }
      return out;
    }
    return value;
  }
  chapters.forEach(function (ch, i) { chapters[i] = normalizeDeep(ch); });

  function paragraphsHtml(arr) {
    return arr.map(function (p) { return '<p>' + escapeHtml(p) + '</p>'; }).join('');
  }

  // Renders a chapter's optional "Ghi chú" (P/S) note box, in either
  // paragraph form (chapter.ps) or definition-list form (chapter.psList).
  function noteHtml(chapter) {
    var out = '';
    if (chapter.ps) {
      out += '<div class="note"><p class="note-label">Ghi chú</p>' + paragraphsHtml(chapter.ps) + '</div>';
    }
    if (chapter.psList) {
      var rows = chapter.psList.map(function (row) {
        return '<div><dt>' + escapeHtml(row[0]) + '</dt><dd>&mdash; ' + escapeHtml(row[1]) + '</dd></div>';
      }).join('');
      var after = chapter.psAfterList ? '<p style="margin-top:.85em;">' + escapeHtml(chapter.psAfterList) + '</p>' : '';
      out += '<div class="note"><p class="note-label">Ghi chú</p><dl>' + rows + '</dl>' + after + '</div>';
    }
    return out;
  }

  // Flat searchable text blob per chapter, built once — chapter number and
  // title only (not body content). Both "1" and the zero-padded "01" shown
  // in the sidebar are indexed, so typing either form matches.
  function chapterSearchText(ch, idx) {
    var num = String(idx + 1);
    var padded = num.padStart(2, '0');
    var parts = [num, padded, 'chương ' + num, 'chương ' + padded, ch.title];
    if (ch.subentries) {
      ch.subentries.forEach(function (se) { parts.push(se.heading); });
    }
    return parts.join(' ␟ ').toLowerCase();
  }

  chapters.forEach(function (ch, idx) { ch._search = chapterSearchText(ch, idx); });

  function buildTOC() {
    tocEl.innerHTML = chapters.map(function (ch, i) {
      var num = String(i + 1).padStart(2, '0');
      return '<li><button class="toc-item" data-id="' + ch.id + '" data-index="' + i + '">' +
        '<span class="toc-num">' + num + '</span>' +
        '<span class="toc-text"><span class="toc-title">' + escapeHtml(ch.title) + '</span></span>' +
        '<span class="toc-views" data-id="' + ch.id + '" hidden></span>' +
        '</button></li>';
    }).join('') + '<li class="toc-empty" id="tocEmpty" style="display:none;">Không tìm thấy chương nào phù hợp.</li>';

    Array.prototype.forEach.call(tocEl.querySelectorAll('.toc-item'), function (btn) {
      btn.addEventListener('click', function () {
        renderChapter(btn.getAttribute('data-id'), { push: true });
        closeDrawer();
      });
    });
  }

  // Fill the little eye+count on each sidebar chapter from one grouped query.
  function loadTocViewCounts() {
    if (!sb || !sb.rpc) return;
    sb.rpc('chapter_view_counts').then(function (res) {
      if (!res || res.error || !Array.isArray(res.data)) return;
      var byId = {};
      res.data.forEach(function (row) { byId[row.chapter_id] = row.n; });
      chapters.forEach(function (ch) { setTocViewCount(ch.id, byId[ch.id] || 0); });
    });
  }

  function setTocViewCount(chapterId, n) {
    var el = tocEl.querySelector('.toc-views[data-id="' + chapterId + '"]');
    if (!el) return;
    if (!n) { el.hidden = true; el.textContent = ''; return; }
    el.innerHTML = EYE_SVG + '<span>' + Number(n).toLocaleString('vi-VN') + '</span>';
    el.hidden = false;
  }

  // #reader scrolls internally on wide screens (height: 100vh), but on
  // narrow screens it switches to height: auto and the page/window scrolls
  // instead (see the max-width: 860px block in styles.css). Detect which
  // one is actually scrollable rather than assuming either.
  function updateProgress() {
    if (!progressFillEl) return;
    var top, max;
    if (readerEl.scrollHeight > readerEl.clientHeight + 1) {
      top = readerEl.scrollTop;
      max = readerEl.scrollHeight - readerEl.clientHeight;
    } else {
      var doc = document.documentElement;
      top = window.scrollY || doc.scrollTop;
      max = doc.scrollHeight - doc.clientHeight;
    }
    var pct = max > 0 ? (top / max) * 100 : 0;
    progressFillEl.style.width = Math.min(100, Math.max(0, pct)) + '%';
    updateChapterBar();
    updateToTop(top);
  }

  // "Lên đầu trang" button: fades in above the "previous chapter" circle
  // once the reader has scrolled down a screen or so (styles.css .to-top).
  function updateToTop(top) {
    var btn = document.getElementById('toTop');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'toTop';
      btn.className = 'to-top';
      btn.setAttribute('aria-label', 'Lên đầu trang');
      btn.title = 'Lên đầu trang';
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="none" stroke="currentColor" ' +
        'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
      btn.addEventListener('click', function () {
        var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var opts = { top: 0, behavior: smooth ? 'smooth' : 'auto' };
        if (readerEl.scrollHeight > readerEl.clientHeight + 1) readerEl.scrollTo(opts);
        else window.scrollTo(opts);
      });
      (document.querySelector('.app') || document.body).appendChild(btn);
    }
    var show = top > Math.min(600, window.innerHeight * 0.8);
    btn.classList.toggle('show', show);
    btn.tabIndex = show ? 0 : -1;
  }

  // Jumps to the top of whichever container is actually scrolling (same
  // detection as updateProgress). Forces an instant jump rather than an
  // animated one: #reader has scroll-behavior:smooth in CSS, and setting
  // .scrollTop on a smooth-scrolling box animates instead of snapping,
  // which can visibly land mid-chapter if anything interrupts it.
  function scrollReaderToTop() {
    if (readerEl.scrollHeight > readerEl.clientHeight + 1) {
      var prevBehavior = readerEl.style.scrollBehavior;
      readerEl.style.scrollBehavior = 'auto';
      readerEl.scrollTop = 0;
      readerEl.style.scrollBehavior = prevBehavior;
    } else {
      window.scrollTo(0, 0);
    }
  }

  // ---- floating prev/next: always on screen at the bottom of the reader ----
  //
  // Two round blue buttons with a white triangle, fixed at the bottom centre
  // of the reading area (centred so they never sit under the chat button in
  // the bottom-right corner). One persistent element, re-pointed by every
  // renderChapter; hidden on the admin pages. Created from JS, so the
  // Artifact build gets it without any change to build-artifact.ps1's template.
  var _floatNavIdx = -1;

  function ensureFloatNav() {
    var nav = document.getElementById('floatNav');
    if (nav) return nav;
    var tri = function (pts) {
      return '<svg viewBox="0 0 24 24" width="1.25em" height="1.25em" aria-hidden="true">' +
        '<polygon points="' + pts + '" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
    };
    nav = document.createElement('nav');
    nav.id = 'floatNav';
    nav.className = 'float-nav';
    nav.setAttribute('aria-label', 'Chuyển chương');
    nav.innerHTML =
      '<button type="button" class="float-nav-btn prev" data-dir="-1" aria-label="Chương trước">' + tri('16,5 16,19 6,12') + '</button>' +
      '<button type="button" class="float-nav-btn next" data-dir="1" aria-label="Chương tiếp">' + tri('8,5 8,19 18,12') + '</button>';
    nav.addEventListener('click', function (ev) {
      var btn = ev.target.closest('.float-nav-btn');
      if (!btn || btn.disabled || _floatNavIdx < 0) return;
      var target = chapters[_floatNavIdx + Number(btn.getAttribute('data-dir'))];
      if (target) renderChapter(target.id, { push: true });
    });
    (document.querySelector('.app') || document.body).appendChild(nav);
    return nav;
  }

  function updateFloatNav(idx) {
    var nav = ensureFloatNav();
    _floatNavIdx = idx;
    nav.hidden = idx < 0;
    if (idx < 0) return;
    var prev = chapters[idx - 1];
    var next = chapters[idx + 1];
    var pb = nav.querySelector('.prev');
    var nb = nav.querySelector('.next');
    pb.disabled = !prev;
    nb.disabled = !next;
    pb.title = prev ? 'Chương ' + String(idx).padStart(2, '0') + ': ' + prev.title : '';
    nb.title = next ? 'Chương ' + String(idx + 2).padStart(2, '0') + ': ' + next.title : '';
  }

  // White "×" drawn as two strokes, for the red round close buttons on every
  // popup (sign-in, profile, chat panel, sign-in reminder).
  var CLOSE_X_SVG = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" ' +
    'stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  // ---- floating chapter title: slim bar at the top while scrolling ---------
  //
  // Once the chapter's own big title scrolls off the top, a slim bar slides
  // in with "Chương NN · title"; it hides again when the real title is back
  // in view. Driven from updateProgress (already wired to both the reader's
  // and the window's scroll), hidden on the admin pages. Built from JS like
  // the float nav, so the Artifact build needs no template change.
  function ensureChapterBar() {
    var bar = document.getElementById('chapterBar');
    if (bar) return bar;
    bar = document.createElement('div');
    bar.id = 'chapterBar';
    bar.className = 'chapter-bar';
    // Tap / click the bar → a small card under it with the full title (the
    // bar itself cuts long titles off with "…").
    bar.innerHTML = '<button type="button" class="chapter-bar-inner" data-action="chapter-bar-pop" ' +
        'aria-expanded="false" aria-controls="chapterBarPop" title="Xem tên chương đầy đủ">' +
        '<span class="chapter-bar-kicker"></span><span class="chapter-bar-title"></span></button>' +
      '<div class="chapter-bar-pop" id="chapterBarPop" role="dialog" aria-label="Tên chương" hidden>' +
        '<p class="chapter-bar-pop-kicker"></p><p class="chapter-bar-pop-title"></p></div>';
    (document.querySelector('.app') || document.body).appendChild(bar);
    return bar;
  }

  // .is-truncated when the title doesn't fit (ends in "…"). On large screens
  // the bar only opens the full-title card then (see the click handler).
  function markChapterBarTruncated(bar) {
    var t = bar.querySelector('.chapter-bar-title');
    var cut = !!t && t.scrollWidth > t.clientWidth + 1;
    bar.classList.toggle('is-truncated', cut);
    var btn = bar.querySelector('.chapter-bar-inner');
    var active = cut || window.innerWidth <= 860;
    btn.title = active ? 'Xem tên chương đầy đủ' : '';
    btn.tabIndex = active ? 0 : -1;
  }
  window.addEventListener('resize', function () {
    var bar = document.getElementById('chapterBar');
    if (bar && bar.classList.contains('show')) markChapterBarTruncated(bar);
  });

  function toggleChapterBarPop(open) {
    var bar = document.getElementById('chapterBar');
    if (!bar) return;
    var pop = bar.querySelector('.chapter-bar-pop');
    var btn = bar.querySelector('.chapter-bar-inner');
    if (open == null) open = pop.hidden;
    if (open) {
      pop.querySelector('.chapter-bar-pop-kicker').textContent = bar.querySelector('.chapter-bar-kicker').textContent;
      pop.querySelector('.chapter-bar-pop-title').textContent = bar.querySelector('.chapter-bar-title').textContent;
    }
    pop.hidden = !open;
    btn.setAttribute('aria-expanded', String(!!open));
  }
  document.addEventListener('click', function (ev) {
    var bar = document.getElementById('chapterBar');
    if (!bar) return;
    if (ev.target.closest && ev.target.closest('.chapter-bar-inner')) {
      // large screens: only when the bar actually cuts the title off
      if (window.innerWidth > 860 && !bar.classList.contains('is-truncated')) return;
      toggleChapterBarPop();
      return;
    }
    if (!(ev.target.closest && ev.target.closest('.chapter-bar-pop'))) toggleChapterBarPop(false);
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape') return;
    var pop = document.getElementById('chapterBarPop');
    if (pop && !pop.hidden) { toggleChapterBarPop(false); ev.stopPropagation(); }
  }, true);

  function setChapterBar(idx) {
    var bar = ensureChapterBar();
    toggleChapterBarPop(false);
    bar.classList.remove('show');
    document.body.classList.remove('chapter-bar-on');
    bar.hidden = idx < 0;
    if (idx < 0) return;
    bar.querySelector('.chapter-bar-kicker').textContent = 'Chương ' + String(idx + 1).padStart(2, '0');
    bar.querySelector('.chapter-bar-title').textContent = chapters[idx].title;
  }

  function updateChapterBar() {
    var bar = document.getElementById('chapterBar');
    if (!bar || bar.hidden) return;
    var title = readerEl.querySelector('.chapter-title');
    var show = !!title && title.getBoundingClientRect().bottom < bar.offsetHeight;
    bar.classList.toggle('show', show);
    if (!show) toggleChapterBarPop(false);
    else markChapterBarTruncated(bar);
    // lets CSS shrink the mobile "Mục lục" pill to just its icon meanwhile
    document.body.classList.toggle('chapter-bar-on', show);
  }

  function renderChapter(id, opts) {
    var push = !!(opts && opts.push);
    // A throwaway placeholder render (chapter 1 shown while the restored
    // admin-inbox route is still waiting on _pendingAdminInboxRoute/
    // _authSettled) must not persist itself as "the last place" — that
    // would clobber the saved admin-inbox route before refresh() gets a
    // chance to redirect into it.
    var silent = !!(opts && opts.silent);
    var idx = chapters.findIndex(function (c) { return c.id === id; });
    if (idx === -1) idx = 0;
    var ch = chapters[idx];

    var html = '<article class="chapter">';
    html += '<p class="chapter-kicker">Chương ' + String(idx + 1).padStart(2, '0') + '</p>';
    html += '<h2 class="chapter-title">' + escapeHtml(ch.title) + '</h2>';
    html += '<div class="chapter-lead"><hr class="chapter-lead-rule">' +
      '<div class="chapter-tools">' + (sb ? saveChapterBtnHtml() : '') + textSizeControlHtml() + '</div></div>';

    // Simple chapters: a flat "intro" array of paragraphs.
    if (ch.intro) {
      html += '<div class="entry-body">' + paragraphsHtml(ch.intro) + '</div>';
      if (ch.signature) html += '<p class="signature">' + escapeHtml(ch.signature) + '</p>';
      html += noteHtml(ch);
    }

    // Composite chapters: several dated sub-entries, separated by a divider.
    if (ch.subentries) {
      ch.subentries.forEach(function (se, i) {
        if (i > 0) html += '<div class="divider">&middot; &middot; &middot;</div>';
        html += '<div class="subentry">';
        html += '<h3 class="subentry-heading">' + (se.tag ? '<span class="tag">' + escapeHtml(se.tag) + '</span>' : '') + escapeHtml(se.heading) + '</h3>';
        html += '<div class="entry-body">' + paragraphsHtml(se.paragraphs) + '</div>';
        if (se.signature) html += '<p class="signature">' + escapeHtml(se.signature) + '</p>';
        if (se.ps) html += '<div class="note"><p class="note-label">Ghi chú</p>' + paragraphsHtml(se.ps) + '</div>';
        html += '</div>';
      });
    }

    var prev = chapters[idx - 1];
    var next = chapters[idx + 1];
    html += '<nav class="chapter-nav">';
    html += '<button class="nav-btn prev" id="prevBtn"' + (prev ? '' : ' disabled') + '>';
    if (prev) html += '<span class="nav-arrow" aria-hidden="true">' + NAV_ARROW_LEFT + '</span>' +
      '<span class="nav-text"><span class="nav-dir">Chương trước · ' + String(idx).padStart(2, '0') + '</span>' +
      '<span class="nav-title">' + escapeHtml(prev.title) + '</span></span>';
    html += '</button>';
    html += '<button class="nav-btn next" id="nextBtn"' + (next ? '' : ' disabled') + '>';
    if (next) html += '<span class="nav-text"><span class="nav-dir">Chương tiếp · ' + String(idx + 2).padStart(2, '0') + '</span>' +
      '<span class="nav-title">' + escapeHtml(next.title) + '</span></span>' +
      '<span class="nav-arrow" aria-hidden="true">' + NAV_ARROW_RIGHT + '</span>';
    html += '</button>';
    html += '</nav>';

    if (sb) html += engagementShellHtml();

    html += '</article>';

    readerEl.innerHTML = html;
    readerEl.setAttribute('data-chapter-id', ch.id);
    applyTextScale();   // fill in the new control's % and disabled states
    syncSaveChapterBtn();
    hideQuotePop();
    updateFloatNav(idx);
    setChapterBar(idx);
    scrollReaderToTop();
    updateProgress();

    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    if (prev && prevBtn) prevBtn.addEventListener('click', function () { renderChapter(prev.id, { push: true }); });
    if (next && nextBtn) nextBtn.addEventListener('click', function () { renderChapter(next.id, { push: true }); });

    Array.prototype.forEach.call(tocEl.querySelectorAll('.toc-item'), function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-id') === ch.id);
    });

    if (!silent) { saveLastChapter(ch.id); _lastReadChapterId = ch.id; }

    // A dragged chat button only lasts as long as you stay on one page —
    // reading a different chapter (or a reload) puts it back in its default
    // corner. renderAdminInbox resets it too.
    if (!silent) resetChatFabPos();

    if (sb) renderEngagement(ch.id);

    // Push a history entry per chapter switch (not the initial load) so the
    // device/browser Back button steps back through previously-read
    // chapters instead of immediately leaving the page.
    if (silent) {
      centerActiveTocItem();
    } else if (push) {
      history.pushState({ chapterId: ch.id }, '', '#' + ch.id);
    } else {
      history.replaceState({ chapterId: ch.id }, '', '#' + ch.id);
      // Only re-center on loads we didn't just navigate to ourselves via a
      // sidebar/prev-next click (those are already in view) — i.e. on the
      // initial page load/refresh and on popstate (Back/Forward).
      centerActiveTocItem();
    }
  }

  // Centers the active sidebar item within the (independently-scrolling)
  // chapter list, so a reload / back / forward lands with the current
  // chapter in the middle of the visible list rather than wherever it was
  // last scrolled to.
  function centerActiveTocItem() {
    var active = tocEl.querySelector('.toc-item.active');
    if (!active) return;
    // Measured via getBoundingClientRect rather than offsetTop: .sidebar is
    // position:sticky, which makes it (not .toc) the offsetParent for these
    // buttons, so offsetTop would include the masthead/search-box height
    // above .toc and center against the whole sidebar instead of just the
    // scrollable chapter list.
    var tocRect = tocEl.getBoundingClientRect();
    var activeRect = active.getBoundingClientRect();
    var activeTopWithinToc = (activeRect.top - tocRect.top) + tocEl.scrollTop;
    var target = activeTopWithinToc - (tocEl.clientHeight / 2) + (activeRect.height / 2);
    tocEl.scrollTop = Math.max(0, target);
  }

  // ==========================================================================
  //  Reactions + comments (Supabase backend, Google / email accounts)
  //  --------------------------------------------------------------------------
  //  The whole block is dormant unless supabase-config.js holds real
  //  credentials AND the supabase-js library loaded from the CDN. The published
  //  Claude Artifact has neither (its build omits those <script> tags and its
  //  sandbox blocks the API), so nothing here ever renders there.
  // ==========================================================================

  var REACTIONS = [
    { emoji: '👍', label: 'Thích' },
    { emoji: '❤️', label: 'Yêu thích' },
    { emoji: '😂', label: 'Haha' },
    { emoji: '😮', label: 'Ngạc nhiên' },
    { emoji: '😢', label: 'Buồn' }
  ];

  // Emojis are drawn as Google's Noto emoji artwork (static SVG from the
  // Google Fonts CDN) instead of the OS emoji font, so they look the same —
  // and modern — on every device. Only the emojis the site itself offers
  // (REACTIONS, CHAT_EMOJIS, the 🙂 / 📎 buttons) are swapped; anything else
  // stays plain text, so an unknown emoji can never show a broken image.
  var NOTO_EMOJI_BASE = 'https://fonts.gstatic.com/s/e/notoemoji/latest/';
  function emojiCode(e) {
    var out = [];
    for (var i = 0; i < e.length; i++) {
      var cp = e.codePointAt(i);
      if (cp > 0xffff) i++;
      out.push(cp.toString(16));
    }
    return out.join('_');
  }
  function knownEmojis() {
    return REACTIONS.map(function (r) { return r.emoji; }).concat(CHAT_EMOJIS, ['🙂', '📎']);
  }
  function emojiImg(e) {
    if (knownEmojis().indexOf(e) === -1) return escapeHtml(e);
    return '<img class="emoji-img" src="' + NOTO_EMOJI_BASE + emojiCode(e) + '/emoji.svg" alt="' +
      escapeAttr(e) + '" draggable="false">';
  }
  // Swap the site's known emojis inside already-escaped text (chat messages).
  // A bare "❤" (no U+FE0F selector) is matched as "❤️" too.
  var _emojiRe = null;
  function bareEmoji(e) { return e.replace(/\uFE0F/g, ''); }
  function emojifyHtml(html) {
    var list = knownEmojis();
    if (!_emojiRe) {
      _emojiRe = new RegExp(list.slice().sort(function (a, b) { return b.length - a.length; })
        .map(function (e) { return bareEmoji(e) + '\uFE0F?'; }).join('|'), 'g');
    }
    return html.replace(_emojiRe, function (m) {
      var hit = list.filter(function (k) { return bareEmoji(k) === bareEmoji(m); })[0];
      return hit ? emojiImg(hit) : m;
    });
  }
  var COMMENT_MAX = 2000;
  var NAME_MAX = 60;

  // Reaction state for the chapter currently on screen
  var _reactors = {};        // emoji -> [ {id, name, avatar, hue} ]
  var _myEmojis = [];        // emoji strings the signed-in user reacted with
  var _pickerOpen = false;   // is the emoji picker showing
  var _whoOpenEmoji = null;  // which pill's "who reacted" list is showing

  // Chat widget state (private messages to the site owner) — see the
  // "chat widget" section below for the functions that use these.
  var _chatAdmin = { name: 'tác giả', avatar: null, hue: null, bubbleHue: null };
  var _chatMessages = [];      // the signed-in user's own sent messages, oldest first
  var _chatLoadedFor = null;   // authUser.id the _chatMessages cache belongs to
  var _chatOpen = false;
  var _chatAuthKey;            // authUser.id (or null) last rendered into the panel body
  var _chatPendingFile = null;   // File chosen but not yet sent, in the reader's chat widget
  var _inboxPendingFile = null;  // same, in the admin inbox's reply box

  var sb = null;
  try {
    var _cfg = window.NKLTT_SUPABASE;
    if (_cfg && _cfg.url && _cfg.anonKey &&
        _cfg.url.indexOf('YOUR_') === -1 && _cfg.anonKey.indexOf('YOUR_') === -1 &&
        window.supabase && window.supabase.createClient) {
      sb = window.supabase.createClient(_cfg.url, _cfg.anonKey);
    }
  } catch (e) { sb = null; }

  var authUser = null;   // { id, name } while signed in, else null
  var engToken = 0;      // bumped per chapter render; guards stale async results
  // Set at initial load when the restored route was the admin inbox, whose
  // access we can't check until auth resolves — consumed once by refresh()
  // below (only once _authSettled, see applyAuthUser), not re-checked on
  // every later auth event.
  var _pendingAdminInboxRoute = false;
  var _authSettled = false;   // true once applyAuthUser has resolved is_admin (or found no session)

  // A Supabase OAuth redirect can return with #access_token=... in the URL
  // (implicit flow). Until supabase-js strips it, the hash router must not read
  // it as a chapter id. (PKCE flow returns ?code=... in the query string, which
  // never collides with our #ch-N hashes.)
  function hashIsAuthCallback() {
    var h = '';
    try { h = location.hash || ''; } catch (e) {}
    return /access_token=|refresh_token=|[?&#]error=|type=recovery/.test(h);
  }
  function routeHash() {
    if (hashIsAuthCallback()) return '';
    try { return (location.hash || '').replace('#', ''); } catch (e) { return ''; }
  }

  function fieldVal(scope, sel) {
    var el = scope.querySelector(sel);
    return el ? (el.value || '').trim() : '';
  }

  // Records a visit and shows the total next to © in the sidebar footer.
  // The server-side RPC identifies the visitor by a per-day hash of IP +
  // User-Agent, so Incognito on the same machine counts once, and it returns
  // the running total. One count per visitor per day.
  function recordVisit() {
    if (!sb || !sb.rpc) return;
    sb.rpc('record_visit').then(function (res) {
      var n = res && !res.error && typeof res.data === 'number' ? res.data : null;
      if (n === null) return;
      var el = document.querySelector('.sidebar-footer .copyright');
      if (!el || el.querySelector('.visit-count')) return;
      var pill = document.createElement('span');
      pill.className = 'visit-count';
      pill.setAttribute('aria-label', n.toLocaleString('vi-VN') + ' lượt xem');
      // " lượt xem" is hidden on mobile (styles.css) to keep the footer short
      pill.innerHTML = EYE_SVG + '<span>' + n.toLocaleString('vi-VN') +
        '<span class="visit-count-label"> lượt xem</span></span>';
      el.appendChild(pill);
    });
  }

  function relTime(iso) {
    var then = Date.parse(iso);
    if (isNaN(then)) return '';
    var s = Math.max(0, Math.round((Date.now() - then) / 1000));
    if (s < 45) return 'vừa xong';
    var m = Math.round(s / 60);
    if (m < 60) return m + ' phút trước';
    var h = Math.round(m / 60);
    if (h < 24) return h + ' giờ trước';
    var d = Math.round(h / 24);
    if (d < 30) return d + ' ngày trước';
    var dt = new Date(then);
    return dt.getDate() + '/' + (dt.getMonth() + 1) + '/' + dt.getFullYear();
  }

  function displayNameFromUser(u) {
    if (!u) return 'Người đọc';
    var m = u.user_metadata || {};
    if (m.full_name || m.name) return m.full_name || m.name;
    if (u.email && /@phone\.nkltt$/i.test(u.email)) {
      return '+' + u.email.replace(/@.*$/, '').replace(/^p/, '');  // p61… → +61…
    }
    return u.email ? u.email.split('@')[0] : 'Người đọc';
  }
  // ---- where a reader comes from (flag on the admin pages) ---------------
  //
  // Two sources, best first:
  //  1. profiles.country — the 2-letter country of the reader's IP, read by
  //     /api/geo (Vercel's X-Vercel-IP-Country header) and saved by the reader's
  //     own browser after sign-in (syncMyCountry). Needs the `country` column
  //     from comments-setup.sql; until it exists the query just fails quietly.
  //  2. the calling code of a phone sign-up (+61… → AU), as a fallback.
  // Every country's calling code ('VN84' = Việt Nam, +84), from Google's
  // libphonenumber. Ordered by code; where several countries share one (+1,
  // +7, +44…) the main one comes first. Names come from Intl.DisplayNames.
  var CALLING_CODE_DATA =
    'US1,AG1,AI1,AS1,BB1,BM1,BS1,CA1,DM1,DO1,GD1,GU1,JM1,KN1,KY1,LC1,MP1,MS1,PR1,SX1,TC1,TT1,VC1,VG1,' +
    'VI1,RU7,KZ7,EG20,ZA27,GR30,NL31,BE32,FR33,ES34,HU36,IT39,VA39,RO40,CH41,AT43,GB44,GG44,IM44,JE44,' +
    'DK45,SE46,NO47,SJ47,PL48,DE49,PE51,MX52,CU53,AR54,BR55,CL56,CO57,VE58,MY60,AU61,CC61,CX61,ID62,' +
    'PH63,NZ64,SG65,TH66,JP81,KR82,VN84,CN86,TR90,IN91,PK92,AF93,LK94,MM95,IR98,SS211,MA212,EH212,' +
    'DZ213,TN216,LY218,GM220,SN221,MR222,ML223,GN224,CI225,BF226,NE227,TG228,BJ229,MU230,LR231,SL232,' +
    'GH233,NG234,TD235,CF236,CM237,CV238,ST239,GQ240,GA241,CG242,CD243,AO244,GW245,IO246,AC247,SC248,' +
    'SD249,RW250,ET251,SO252,DJ253,KE254,TZ255,UG256,BI257,MZ258,ZM260,MG261,RE262,YT262,ZW263,NA264,' +
    'MW265,LS266,BW267,SZ268,KM269,SH290,TA290,ER291,AW297,FO298,GL299,GI350,PT351,LU352,IE353,IS354,' +
    'AL355,MT356,CY357,FI358,AX358,BG359,LT370,LV371,EE372,MD373,AM374,BY375,AD376,MC377,SM378,UA380,' +
    'RS381,ME382,XK383,HR385,SI386,BA387,MK389,CZ420,SK421,LI423,FK500,BZ501,GT502,SV503,HN504,NI505,' +
    'CR506,PA507,PM508,HT509,GP590,BL590,MF590,BO591,GY592,EC593,GF594,PY595,MQ596,SR597,UY598,CW599,' +
    'BQ599,TL670,NF672,BN673,NR674,PG675,TO676,SB677,VU678,FJ679,PW680,WF681,CK682,NU683,WS685,KI686,' +
    'NC687,TV688,PF689,TK690,FM691,MH692,KP850,HK852,MO853,KH855,LA856,BD880,TW886,MV960,LB961,JO962,' +
    'SY963,IQ964,KW965,SA966,YE967,OM968,PS970,AE971,IL972,BH973,QA974,BT975,MN976,NP977,TJ992,TM993,' +
    'AZ994,GE995,KG996,UZ998';
  var PHONE_COUNTRIES = [];        // [{ iso: 'VN', code: '84' }, …]
  var CALLING_CODES = {};          // '84' → 'VN' (main country for each code)
  CALLING_CODE_DATA.split(',').forEach(function (e) {
    var iso = e.slice(0, 2), code = e.slice(2);
    PHONE_COUNTRIES.push({ iso: iso, code: code });
    if (!CALLING_CODES[code]) CALLING_CODES[code] = iso;
  });
  function countryFromPhoneEmail(email) {
    var m = /^p(\d+)@phone\.nkltt$/i.exec(email || '');
    if (!m) return null;
    for (var n = 3; n >= 1; n--) {
      var c = CALLING_CODES[m[1].slice(0, n)];
      if (c) return c;
    }
    return null;
  }
  var _regionNames = null;
  function countryName(code) {
    try {
      if (!_regionNames) _regionNames = new Intl.DisplayNames(['vi'], { type: 'region' });
      return _regionNames.of(code) || code;
    } catch (e) { return code; }
  }
  // Flag as a small image (flagcdn.com) rather than an emoji: Windows has no
  // flag emoji and would show the bare letters "VN".
  function flagHtml(code, cls) {
    if (!code || !/^[A-Z]{2}$/i.test(code)) return '';
    var c = code.toLowerCase();
    var name = countryName(code.toUpperCase());
    return '<img class="flag' + (cls ? ' ' + cls : '') + '" src="https://flagcdn.com/w40/' + c + '.png" ' +
      'srcset="https://flagcdn.com/w80/' + c + '.png 2x" alt="' + escapeAttr(name) + '" title="' + escapeAttr(name) +
      '" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.visibility=\'hidden\'">';
  }
  // Avatar with the flag pinned to its bottom-right corner.
  function avatarFlagHtml(name, url, id, cls, idx, country) {
    return '<span class="avatar-wrap">' + avatarHtml(name, url, id, cls, idx) +
      flagHtml(country, 'avatar-flag') + '</span>';
  }
  // id → country for the given profile ids, merged into `into`. Quietly does
  // nothing until the profiles.country column exists.
  function loadCountries(ids, into, done) {
    if (!sb || !ids.length) { if (done) done(); return; }
    sb.from('profiles').select('id, country').in('id', ids).then(function (res) {
      if (res && !res.error && res.data) {
        res.data.forEach(function (r) { if (r.country) into[r.id] = String(r.country).toUpperCase(); });
      }
      if (done) done();
    });
  }
  // After sign-in: ask /api/geo where this browser is and save it on the
  // reader's own profile. At most once a day per browser.
  var _countries = {};      // profile id → 'VN' (admin pages)
  var _emailById = {};      // profile id → email, from admin_list_users (phone fallback)
  function countryOf(uid) { return _countries[uid] || countryFromPhoneEmail(_emailById[uid]) || null; }
  // Admin only: fills _emailById once from admin_list_users so phone sign-ups
  // get a flag in the inbox too.
  var _emailsLoaded = false;
  function ensureAdminEmails(done) {
    if (_emailsLoaded || !sb) { if (done) done(); return; }
    sb.rpc('admin_list_users').then(function (res) {
      if (res && !res.error && res.data) {
        _emailsLoaded = true;
        res.data.forEach(function (u) { _emailById[u.id] = u.email || ''; });
      }
      if (done) done();
    });
  }
  var GEO_KEY = 'nkltt:geoSynced';
  function syncMyCountry(uid) {
    if (!sb || !uid || !window.fetch) return;
    var today = new Date().toISOString().slice(0, 10);
    try { if (localStorage.getItem(GEO_KEY) === uid + ':' + today) return; } catch (e) {}
    fetch('/api/geo', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var c = j && j.country;
        if (!c || !/^[A-Z]{2}$/i.test(c)) return;
        sb.from('profiles').update({ country: c.toUpperCase() }).eq('id', uid).then(function (res) {
          if (res && !res.error) { try { localStorage.setItem(GEO_KEY, uid + ':' + today); } catch (e) {} }
        });
      })
      .catch(function () {});
  }

  // Sets `authUser` from the session, then fills in the display name, avatar and
  // is_admin flag from the profiles row (calls `done` again once that lands).
  function applyAuthUser(u, done) {
    if (!u) { authUser = null; _authSettled = true; if (done) done(); return; }
    var m = u.user_metadata || {};
    authUser = {
      id: u.id,
      email: (u.email || '').toLowerCase(),
      name: displayNameFromUser(u),
      avatar: m.avatar_url || m.picture || null,   // Google photo, if any
      avatarHue: null,
      bubbleHue: null,
      isAdmin: false
    };
    // Supabase fires both getSession() and an onAuthStateChange
    // "INITIAL_SESSION" event on load — each calls applyAuthUser again for
    // the same user, briefly resetting authUser.isAdmin to this
    // provisional false before its own profile fetch resolves. Without
    // this reset, refresh()'s safety net (below) would see that dip as a
    // real "not admin anymore" and kick an actual admin straight back out
    // of the inbox it was just correctly routed into.
    _authSettled = false;
    function fill(d) {
      if (authUser && d) {
        if (d.display_name) authUser.name = d.display_name;
        if (d.avatar_url) authUser.avatar = d.avatar_url;
        if (d.avatar_hue != null) authUser.avatarHue = d.avatar_hue;
        if (d.bubble_hue != null) authUser.bubbleHue = d.bubble_hue;
        authUser.isAdmin = !!d.is_admin;
      }
      _authSettled = true;
      syncMyCountry(u.id);
      if (done) done();
    }
    sb.from('profiles').select('display_name, avatar_url, avatar_hue, bubble_hue, is_admin').eq('id', u.id).single().then(function (res) {
      if (res.error) {
        // schema may not have the avatar / bubble / is_admin columns yet
        sb.from('profiles').select('display_name').eq('id', u.id).single().then(function (r2) {
          fill(r2 && r2.data);
        });
        return;
      }
      fill(res.data);
    });
  }

  function escapeAttr(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Avatar + chat bubble colours: vivid two-tone gradients (Messenger-style)
  // followed by a few bright pastel ones. The stored `avatar_hue` /
  // `bubble_hue` is an INDEX into this list (0..N-1), so keep the length and
  // only swap entries in place. `fg` is the text colour that reads on it.
  function grad(a, b) { return 'linear-gradient(135deg, ' + a + ', ' + b + ')'; }
  var AVATAR_PALETTE = [
    { bg: grad('#2563eb', '#0891b2'), fg: '#fff' },  // ocean
    { bg: grad('#7c3aed', '#db2777'), fg: '#fff' },  // violet → pink
    { bg: grad('#e11d48', '#ea580c'), fg: '#fff' },  // sunset
    { bg: grad('#047857', '#0d9488'), fg: '#fff' },  // emerald
    { bg: grad('#4f46e5', '#9333ea'), fg: '#fff' },  // indigo
    { bg: grad('#be185d', '#7c3aed'), fg: '#fff' },  // berry
    { bg: grad('#0369a1', '#4f46e5'), fg: '#fff' },  // aurora
    { bg: grad('#1e293b', '#475569'), fg: '#fff' },  // midnight
    { bg: grad('#c2410c', '#be123c'), fg: '#fff' },  // ember
    { bg: grad('#0f766e', '#2563eb'), fg: '#fff' },  // lagoon
    { bg: grad('#a21caf', '#e11d48'), fg: '#fff' },  // magenta
    { bg: grad('#a3e635', '#facc15'), fg: '#1b2436' },  // lime → lemon
    { bg: grad('#fdba74', '#fda4af'), fg: '#1b2436' },  // peach
    { bg: grad('#6ee7b7', '#67e8f9'), fg: '#1b2436' },  // mint
    { bg: grad('#c4b5fd', '#f9a8d4'), fg: '#1b2436' },  // lavender
    { bg: grad('#fde68a', '#fca5a5'), fg: '#1b2436' }   // apricot
  ];

  // Shared by avatarVars (avatar initials circle) and chat bubble colors —
  // both are just "a color from this palette, by index".
  function paletteColor(idx) {
    var n = AVATAR_PALETTE.length;
    return AVATAR_PALETTE[((idx % n) + n) % n];
  }

  function avatarVars(idx) {
    var c = paletteColor(idx);
    return '--avatar-bg:' + c.bg + ';--avatar-fg:' + c.fg;
  }

  function idToPaletteIndex(id, name) {
    var s = String(id || name || '?');
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 4096;
    return h % AVATAR_PALETTE.length;
  }

  // A round avatar: the profile photo if there is one (Google sign-ins),
  // otherwise the first letter of the name on a colour — the saved palette
  // index if given, else one derived from the user id.
  function avatarHtml(name, url, id, cls, idx) {
    var extra = cls ? ' ' + cls : '';
    if (url) {
      return '<img class="avatar' + extra + '" src="' + escapeAttr(url) +
        '" alt="" loading="lazy" referrerpolicy="no-referrer">';
    }
    var initial = String(name || '?').trim().charAt(0).toUpperCase() || '?';
    var pi = (idx != null) ? idx : idToPaletteIndex(id, name);
    return '<span class="avatar avatar-initial' + extra + '" style="' + avatarVars(pi) +
      '" aria-hidden="true">' + escapeHtml(initial) + '</span>';
  }

  function translateAuthError(msg) {
    msg = String(msg || '');
    if (/invalid login credentials/i.test(msg)) return 'Email hoặc mật khẩu không đúng.';
    if (/already registered|already been registered/i.test(msg)) return 'Email này đã có tài khoản — hãy đăng nhập.';
    if (/password should be at least/i.test(msg)) return 'Mật khẩu cần tối thiểu 6 ký tự.';
    if (/unable to validate email|invalid format/i.test(msg)) return 'Email không hợp lệ.';
    if (/rate limit|too many/i.test(msg)) return 'Thử lại sau ít phút nhé.';
    return msg;
  }

  // ---- markup ----------------------------------------------------------------

  function engagementShellHtml() {
    return '<section class="engagement" aria-label="Cảm nhận và bình luận">' +
        '<div class="reaction-bar" id="reactionBar">' +
          '<div class="reactions" id="reactions"></div>' +
          '<div class="reaction-picker" id="reactionPicker" hidden></div>' +
          '<div class="reaction-who" id="reactionWho" hidden></div>' +
          '<div class="reaction-hint" id="reactionHint" hidden></div>' +
        '</div>' +
        '<div class="comments">' +
          '<div class="guest-gate" id="guestGate" hidden></div>' +
          '<h3 class="comments-title" id="commentsTitle">Bình luận</h3>' +
          '<div class="comment-compose" id="commentCompose"></div>' +
          '<ul class="comment-list" id="commentList"></ul>' +
        '</div>' +
      '</section>';
  }

  var _commentBody = {};        // id -> raw body text, for the inline editor
  var _commentReactions = {};   // comment id -> { emoji: { count, mine } }
  var _commentReactsOn = true;  // false if the comment_reactions table is absent

  // The "🙂＋" button + its floating picker of five choices — at the START of
  // the action row. The picker is the ONLY way to add/remove your reaction.
  function creactAddHtml(commentId) {
    if (!authUser) return '';
    var byEmoji = _commentReactions[commentId] || {};
    var choices = REACTIONS.map(function (r) {
      var mine = byEmoji[r.emoji] && byEmoji[r.emoji].mine;
      return '<button type="button" class="creact-choice' + (mine ? ' reacted' : '') +
        '" data-action="creact-pick" data-emoji="' + escapeHtml(r.emoji) + '">' + emojiImg(r.emoji) + '</button>';
    }).join('');
    return '<button type="button" class="creact-add" data-action="creact-add" ' +
        'aria-label="Bày tỏ cảm xúc">' + emojiImg('🙂') + '<span class="creact-add-plus">+</span></button>' +
      '<span class="creact-picker" hidden>' + choices + '</span>';
  }

  // Pills for emojis that have been used — pushed to the right. Click one to
  // see who reacted with it (not to remove — use the picker for that).
  function creactPillsHtml(commentId) {
    var byEmoji = _commentReactions[commentId] || {};
    return REACTIONS.filter(function (r) { return byEmoji[r.emoji] && byEmoji[r.emoji].count; })
      .map(function (r) {
        var d = byEmoji[r.emoji];
        return '<button type="button" class="creact' + (d.mine ? ' reacted' : '') +
          '" data-action="creact-who" data-emoji="' + escapeHtml(r.emoji) +
          '" title="Xem ai đã bày tỏ">' +
          emojiImg(r.emoji) + ' <span>' + d.count + '</span></button>';
      }).join('');
  }

  function creactWhoInnerHtml(commentId, emoji) {
    var d = (_commentReactions[commentId] || {})[emoji];
    if (!d || !d.users.length) return '';
    var chips = d.users.slice(0, 40).map(function (u) {
      var label = (authUser && u.id === authUser.id) ? 'Bạn' : u.name;
      return '<span class="who-chip">' + escapeHtml(label) + '</span>';
    }).join('');
    var more = d.users.length > 40 ? '<span class="who-more">và ' + (d.users.length - 40) + ' người khác</span>' : '';
    return '<span class="who-emoji">' + emojiImg(emoji) + '</span>' + chips + more;
  }

  function repaintCommentReacts(commentId) {
    var l = document.getElementById('commentList');
    var actions = l && l.querySelector('.comment-actions[data-cid="' + commentId + '"]');
    if (!actions) return;
    var pills = actions.querySelector('.creact-pills');
    if (pills) pills.innerHTML = creactPillsHtml(commentId);
    var m = _commentReactions[commentId] || {};
    Array.prototype.forEach.call(actions.querySelectorAll('.creact-picker .creact-choice'), function (b) {
      var e = b.getAttribute('data-emoji');
      b.classList.toggle('reacted', !!(m[e] && m[e].mine));
    });
    // if a who-popover is open for an emoji that's now gone, close it
    var who = actions.querySelector('.creact-who');
    if (who && !who.hidden) {
      var e = who.getAttribute('data-emoji');
      if (!m[e] || !m[e].count) who.hidden = true;
      else who.innerHTML = creactWhoInnerHtml(commentId, e);
    }
  }

  function commentLi(c, isReply) {
    var mine = authUser && c.user_id === authUser.id;
    var canDelete = mine || (authUser && authUser.isAdmin);
    var prof = c.profiles || {};
    var name = c._name || prof.display_name || 'Người đọc';
    var avatar = c._avatar !== undefined ? c._avatar : (prof.avatar_url || null);
    var hue = c._hue !== undefined ? c._hue : (prof.avatar_hue != null ? prof.avatar_hue : null);
    _commentBody[c.id] = c.body || '';
    var reactsOn = _commentReactsOn;
    var actions = '<div class="comment-actions" data-cid="' + c.id + '">' +
      (reactsOn ? creactAddHtml(c.id) : '') +
      (authUser ? '<button type="button" class="comment-act comment-act-icon" data-action="reply" aria-label="Trả lời" title="Trả lời">' + REPLY_SVG + '</button>' : '') +
      (mine ? '<button type="button" class="comment-act comment-act-icon" data-action="edit" aria-label="Sửa" title="Sửa">' + EDIT_SVG + '</button>' : '') +
      (canDelete ? '<button type="button" class="comment-act comment-act-icon is-danger" data-action="del" aria-label="Xoá" title="Xoá">' + TRASH_SVG + '</button>' : '') +
      (reactsOn ? '<span class="creact-pills">' + creactPillsHtml(c.id) + '</span>' +
        '<span class="creact-who" hidden></span>' : '') +
      '</div>';
    var replies = isReply ? '' : '<ul class="comment-replies" data-parent="' + c.id + '"></ul>';
    return '<li class="comment' + (isReply ? ' comment-reply' : '') + (mine ? ' is-mine' : '') +
        '" data-id="' + c.id + '">' +
        avatarHtml(name, avatar, c.user_id, 'comment-avatar', hue) +
        '<div class="comment-body-col">' +
          '<div class="comment-bubble">' +
          '<div class="comment-head">' +
            '<span class="comment-author">' + escapeHtml(name) + '</span>' +
            '<span class="comment-time">' + escapeHtml(relTime(c.created_at)) +
              (c.edited_at ? ' · đã sửa' : '') + '</span>' +
          '</div>' +
          '<div class="comment-text">' + escapeHtml(c.body || '').replace(/\r?\n/g, '<br>') + '</div>' +
          '</div>' +
          actions +
          replies +
        '</div>' +
      '</li>';
  }

  // ---- rendering ------------------------------------------------------------

  function renderEngagement(chapterId) {
    if (!sb) return;
    var token = ++engToken;
    renderReactionBar(chapterId, token);
    loadChapterViews(chapterId, token);
    renderGuestGate();
    renderCompose();
    loadComments(chapterId, token);
  }

  // End-of-chapter nav card arrows.
  var NAV_ARROW_LEFT =
    '<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" ' +
    'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>';
  var NAV_ARROW_RIGHT =
    '<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" ' +
    'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  // Comment action icons (Trả lời / Sửa / Xoá) — line icons, label kept in
  // aria-label + title. Trả lời is a chat bubble.
  var REPLY_SVG =
    '<svg viewBox="0 0 24 24" width="1.05em" height="1.05em" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.9-.9L3 20.5l1.5-4.6A8 8 0 0 1 3.5 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z"/></svg>';
  // Chat "Gửi" button: a paper plane (label kept in aria-label + title).
  var SEND_SVG =
    '<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4Z"/></svg>';
  var EDIT_SVG =
    '<svg viewBox="0 0 24 24" width="1.05em" height="1.05em" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
  var TRASH_SVG =
    '<svg viewBox="0 0 24 24" width="1.05em" height="1.05em" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>';

  var EYE_SVG =
    '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>';

  var GOOGLE_G_SVG =
    '<svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">' +
    '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
    '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
    '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
    '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';

  // The floating chat button shows the site logo (a circular badge that
  // fills the round FAB). Not draggable/clickable itself so the FAB's own
  // drag + click handling still gets the pointer events.
  var CHAT_FAB_ICON =
    '<img class="chat-fab-logo" src="assets/logo_v2.svg" alt="" draggable="false" aria-hidden="true" />';

  // Smaller line version of the chat bubble, for the "Hộp thư" sidebar entry
  // (replaces a 💬 emoji so it reads as a plain sketch, matching the rest of
  // the UI's line icons rather than a coloured glyph).
  var CHAT_SVG_SM =
    '<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';

  // Two-person line icon for the "Người dùng" sidebar entry (admin only).
  var USERS_SVG_SM =
    '<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>' +
    '<path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';

  // Bookmark (save chapter, "Đã lưu" sidebar entry) — CSS fills it once saved.
  var BOOKMARK_SVG =
    '<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
  // Quote marks (save a selected quote).
  var QUOTE_SVG =
    '<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="currentColor" aria-hidden="true">' +
    '<path d="M7.2 6C4.9 7.3 3.5 9.6 3.5 12.6V18h6v-6H6.6c.1-1.9 1-3.3 2.6-4.2L7.2 6zm10 0c-2.3 1.3-3.7 3.6-3.7 6.6V18h6v-6h-2.9c.1-1.9 1-3.3 2.6-4.2L17.2 6z"/></svg>';

  // Colour-wheel ring for the chat bubble colour button (styled in CSS as a
  // conic-gradient donut, like a modern OS colour well).
  var PALETTE_SVG = '<span class="chat-color-icon" aria-hidden="true"></span>';

  // Chat attachments: a private Storage bucket, RLS-scoped per thread the
  // same way `messages` itself is (see comments-setup.sql) — so viewing one
  // means resolving a short-lived signed URL client-side (hydrateChatAttachments)
  // rather than the bucket being world-readable. 5MB cap matches the
  // bucket's own file_size_limit in SQL; this client-side check is just to
  // fail fast with a clear message rather than waiting on a server rejection.
  var ATTACHMENTS_BUCKET = 'chat-attachments';
  var ATTACHMENT_MAX_BYTES = 5 * 1024 * 1024;
  var ATTACHMENT_ACCEPT = 'image/*,.pdf,.doc,.docx';

  // A small curated set (not a full emoji-picker library) for the chat
  // compose box's "insert an icon" button.
  var CHAT_EMOJIS = ['😀', '😂', '😍', '🥳', '👍', '❤️', '🎉', '🙏', '😅', '😎',
    '🤔', '😭', '🔥', '👏', '🥰', '😴', '🙌', '💯', '✨', '😢'];

  // Per-chapter view count: a non-clickable "pill" (eye + number) at the front
  // of the reaction row. The server-side RPC records + returns the count, keyed
  // by a per-day IP+User-Agent hash: one per visitor per chapter per day, and
  // Incognito on the same machine doesn't double-count. If the RPC is missing,
  // the pill removes itself.
  function loadChapterViews(chapterId, token) {
    if (!sb.rpc) return;
    sb.rpc('record_chapter_view', { p_chapter_id: chapterId }).then(function (res) {
      if (token !== engToken) return;
      var pill = document.getElementById('chapterViews');
      if (!pill) return;
      var n = res && !res.error && typeof res.data === 'number' ? res.data : null;
      if (n === null) {
        if (pill.parentNode) pill.parentNode.removeChild(pill);
        return;
      }
      var c = pill.querySelector('.reaction-count');
      if (c) c.textContent = n.toLocaleString('vi-VN');
      setTocViewCount(chapterId, n);   // keep the sidebar figure in step
    });
  }

  var SMILE_SVG =
    '<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/>' +
    '<line x1="9" y1="9.2" x2="9.01" y2="9.2"/><line x1="15" y1="9.2" x2="15.01" y2="9.2"/></svg>';

  function labelFor(emoji) {
    for (var i = 0; i < REACTIONS.length; i++) if (REACTIONS[i].emoji === emoji) return REACTIONS[i].label;
    return '';
  }

  // Reaction bar: a view-count pill, one pill per emoji that has been used
  // (each opens a "who reacted" list), and a "＋" button that reveals the four
  // emoji options — tap one to react, tap it again to remove your reaction.
  function renderReactionBar(chapterId, token) {
    var host = document.getElementById('reactions');
    if (!host) return;
    _reactors = {}; _myEmojis = []; _pickerOpen = false; _whoOpenEmoji = null;

    host.innerHTML =
      '<span class="reaction reaction-views" id="chapterViews" title="Lượt xem" aria-label="Lượt xem chương này">' +
        '<span class="reaction-emoji">' + EYE_SVG + '</span>' +
        '<span class="reaction-count">·</span></span>' +
      '<button type="button" class="reaction reaction-add" data-action="react-add" ' +
        'title="Bày tỏ cảm xúc" aria-label="Bày tỏ cảm xúc">' + SMILE_SVG +
        '<span class="reaction-add-plus" aria-hidden="true">+</span></button>';

    var picker = document.getElementById('reactionPicker');
    if (picker) {
      picker.hidden = true;
      picker.innerHTML = REACTIONS.map(function (r) {
        return '<button type="button" class="reaction-choice" data-action="react-choice" ' +
          'data-emoji="' + escapeHtml(r.emoji) + '" title="' + escapeHtml(r.label) + '">' +
          emojiImg(r.emoji) + '</button>';
      }).join('');
    }
    var who = document.getElementById('reactionWho');
    if (who) { who.hidden = true; who.innerHTML = ''; }

    sb.from('reactions')
      .select('emoji, user_id')
      .eq('chapter_id', chapterId)
      .then(function (res) {
        if (token !== engToken) return;
        var rows = (res && res.data) || [];
        var ids = [];
        rows.forEach(function (r) { if (ids.indexOf(r.user_id) === -1) ids.push(r.user_id); });
        fetchProfiles(ids, function (profs) {
          if (token !== engToken) return;
          _reactors = {};
          _myEmojis = [];
          rows.forEach(function (row) {
            var p = profs[row.user_id] || {};
            (_reactors[row.emoji] || (_reactors[row.emoji] = [])).push({
              id: row.user_id,
              name: p.display_name || 'Người đọc',
              avatar: p.avatar_url || null,
              hue: p.avatar_hue
            });
            if (authUser && row.user_id === authUser.id && _myEmojis.indexOf(row.emoji) === -1) {
              _myEmojis.push(row.emoji);
            }
          });
          paintReactions();
        });
      });
  }

  function paintReactions() {
    var host = document.getElementById('reactions');
    var addBtn = host && host.querySelector('.reaction-add');
    if (host && addBtn) {
      Array.prototype.forEach.call(host.querySelectorAll('.reaction-pill'), function (p) { p.remove(); });
      var html = REACTIONS.filter(function (r) {
        return _reactors[r.emoji] && _reactors[r.emoji].length;
      }).map(function (r) {
        var mine = _myEmojis.indexOf(r.emoji) !== -1;
        return '<button type="button" class="reaction reaction-pill' + (mine ? ' reacted' : '') +
          '" data-action="react-who" data-emoji="' + escapeHtml(r.emoji) +
          '" title="' + escapeHtml(r.label) + (authUser ? ' — xem ai đã bày tỏ' : '') + '">' +
          '<span class="reaction-emoji">' + emojiImg(r.emoji) + '</span>' +
          '<span class="reaction-count">' + _reactors[r.emoji].length + '</span></button>';
      }).join('');
      addBtn.insertAdjacentHTML('beforebegin', html);
    }
    var picker = document.getElementById('reactionPicker');
    if (picker) {
      picker.hidden = !_pickerOpen;
      Array.prototype.forEach.call(picker.querySelectorAll('.reaction-choice'), function (b) {
        b.classList.toggle('reacted', _myEmojis.indexOf(b.getAttribute('data-emoji')) !== -1);
      });
      if (_pickerOpen) positionPopover(picker, document.querySelector('#reactions .reaction-add'));
    }
    paintWho();
  }

  // Places a popover just below its anchor element, clamped to the bar width,
  // relative to #reactionBar (which is position:relative).
  function positionPopover(pop, anchor) {
    if (!pop || pop.hidden || !anchor) return;
    var bar = document.getElementById('reactionBar');
    if (!bar) return;
    pop.style.left = '0px';
    pop.style.top = (anchor.offsetTop + anchor.offsetHeight + 6) + 'px';
    var left = Math.max(0, Math.min(anchor.offsetLeft, bar.clientWidth - pop.offsetWidth));
    pop.style.left = left + 'px';
  }

  // Guests can't see who reacted — clicking a pill shows the sign-in hint
  // (onReactionWho), and this is a belt-and-suspenders guard so the list
  // never renders for them even if _whoOpenEmoji somehow got set.
  function paintWho() {
    var who = document.getElementById('reactionWho');
    if (!who) return;
    if (!authUser) { who.hidden = true; who.innerHTML = ''; return; }
    var e = _whoOpenEmoji;
    var list = e && _reactors[e];
    if (!e || !list || !list.length) { who.hidden = true; who.innerHTML = ''; return; }
    var chips = list.slice(0, 30).map(function (u) {
      var label = (authUser && u.id === authUser.id) ? 'Bạn' : u.name;
      return '<span class="who-chip">' +
        avatarHtml(u.name, u.avatar, u.id, 'who-avatar', u.avatar ? null : u.hue) +
        '<span>' + escapeHtml(label) + '</span></span>';
    }).join('');
    var more = list.length > 30 ? '<span class="who-more">và ' + (list.length - 30) + ' người khác</span>' : '';
    who.innerHTML = chips + more;
    who.hidden = false;
    positionPopover(who, document.querySelector('#reactions .reaction-pill[data-emoji="' + e + '"]')
      || document.querySelector('#reactions .reaction-add'));
  }

  function closeReactionPopovers() {
    var changed = _pickerOpen || _whoOpenEmoji;
    _pickerOpen = false;
    _whoOpenEmoji = null;
    var hint = document.getElementById('reactionHint');
    if (hint && !hint.hidden) { hint.hidden = true; changed = true; }
    if (changed) {
      var pk = document.getElementById('reactionPicker');
      if (pk) pk.hidden = true;
      paintWho();
    }
  }

  // A guest tapped the ＋ button — a small popover anchored to the bar telling
  // them to sign in (with a button that opens the modal). Guests tapping an
  // existing reaction pill get nothing (onReactionWho).
  function showReactionHint(anchor) {
    var hint = document.getElementById('reactionHint');
    if (!hint) return;
    _pickerOpen = false;
    _whoOpenEmoji = null;
    var pk = document.getElementById('reactionPicker');
    if (pk) pk.hidden = true;
    var who = document.getElementById('reactionWho');
    if (who) who.hidden = true;
    hint.innerHTML =
      '<span class="reaction-hint-msg">Đăng nhập để bày tỏ cảm xúc</span>' +
      '<button type="button" class="auth-btn reaction-hint-btn" data-action="guest-signin">Đăng nhập</button>';
    hint.hidden = false;
    positionPopover(hint, anchor || document.querySelector('#reactions .reaction-add'));
  }

  function onReactionWho(pill) {
    if (!authUser) return;   // guests: pills do nothing (and can't see who reacted)
    var e = pill.getAttribute('data-emoji');
    _whoOpenEmoji = (_whoOpenEmoji === e) ? null : e;
    _pickerOpen = false;
    var pk = document.getElementById('reactionPicker');
    if (pk) pk.hidden = true;
    paintWho();
  }

  function onReactionAdd() {
    if (!authUser) { showReactionHint(document.querySelector('#reactions .reaction-add')); return; }
    _pickerOpen = !_pickerOpen;
    _whoOpenEmoji = null;
    paintReactions();
  }

  function onReactionChoice(btn) {
    if (!authUser) { showReactionHint(btn); return; }
    var chapterId = readerEl.getAttribute('data-chapter-id');
    var emoji = btn.getAttribute('data-emoji');
    var have = _myEmojis.indexOf(emoji) !== -1;
    btn.disabled = true;
    if (have) {
      _myEmojis = _myEmojis.filter(function (x) { return x !== emoji; });
      _reactors[emoji] = (_reactors[emoji] || []).filter(function (u) { return u.id !== authUser.id; });
      if (!_reactors[emoji].length) {
        delete _reactors[emoji];
        if (_whoOpenEmoji === emoji) _whoOpenEmoji = null;
      }
    } else {
      _myEmojis.push(emoji);
      (_reactors[emoji] || (_reactors[emoji] = [])).push({
        id: authUser.id, name: authUser.name, avatar: authUser.avatar, hue: authUser.avatarHue
      });
    }
    paintReactions();
    var op = have
      ? sb.from('reactions').delete().match({ chapter_id: chapterId, emoji: emoji, user_id: authUser.id })
      : sb.from('reactions').insert({ chapter_id: chapterId, emoji: emoji, user_id: authUser.id });
    op.then(function (res) {
      btn.disabled = false;
      if (res && res.error && res.error.code !== '23505') {
        renderReactionBar(chapterId, engToken);   // re-sync from the server
      }
    });
  }

  // Shown to signed-out readers, just above the "Bình luận" heading: one line
  // saying they need to sign in to comment or react, plus a "Đăng nhập" button
  // that opens the sign-in modal. Hidden once signed in. This and the sidebar
  // masthead button + the chat widget are the only sign-in surfaces — a guest
  // tapping a reaction just does nothing (no pop-up).
  function renderGuestGate() {
    var el = document.getElementById('guestGate');
    if (!el) return;
    if (authUser) { el.hidden = true; el.innerHTML = ''; return; }
    el.hidden = false;
    el.innerHTML =
      '<p class="guest-gate-msg">Bạn cần đăng nhập để viết bình luận và bày tỏ cảm xúc.</p>' +
      '<button type="button" class="auth-btn" data-action="guest-signin">Đăng nhập</button>';
  }

  // Signed in: avatar + "Xin chào, {name}" under the site title — clicking it
  // opens the profile editor (which is also where "Đăng xuất" now lives).
  // Signed out: a "Đăng nhập/Đăng ký" button in the same spot that opens the
  // sign-in modal (data-action="masthead-signin").
  // Re-rendered on every auth change.
  function renderMastheadAuth() {
    var el = document.getElementById('mastheadAuth');
    if (!el) return;
    el.hidden = false;
    if (authUser) {
      el.innerHTML =
        '<button type="button" class="masthead-profile" data-action="profile" title="Hồ sơ của bạn">' +
          avatarHtml(authUser.name, authUser.avatar, authUser.id, 'masthead-avatar',
            authUser.avatar ? null : authUser.avatarHue) +
          '<span class="masthead-who">Xin chào, <strong>' + escapeHtml(authUser.name || 'bạn') + '</strong></span>' +
        '</button>';
    } else {
      el.innerHTML =
        '<button type="button" class="auth-btn" data-action="masthead-signin">Đăng nhập/Đăng ký</button>';
    }
  }

  // ---- profile editor (display name + avatar colour — no image upload) ----

  var _profileDraftHue = null;         // avatar palette index chosen in the editor

  function ensureProfileModal() {
    if (document.getElementById('profileModal')) return;
    var host = document.querySelector('.app') || document.body;
    var swatches = AVATAR_PALETTE.map(function (_c, i) {
      return '<button type="button" class="profile-swatch" data-hue="' + i +
        '" style="' + avatarVars(i) + '" aria-label="Màu ' + (i + 1) + '"></button>';
    }).join('');
    var m = document.createElement('div');
    m.className = 'profile-modal';
    m.id = 'profileModal';
    m.hidden = true;
    m.innerHTML =
      '<div class="profile-modal-backdrop" data-action="profile-cancel"></div>' +
      '<div class="profile-modal-card" role="dialog" aria-modal="true" aria-label="Hồ sơ của bạn">' +
        '<button type="button" class="profile-modal-close" data-action="profile-cancel" aria-label="Đóng" title="Đóng">' + CLOSE_X_SVG + '</button>' +
        '<h3 class="profile-modal-title">Hồ sơ của bạn</h3>' +
        '<div class="profile-avatar-preview" id="profileAvatarPreview"></div>' +
        '<label class="profile-field"><span>Tên hiển thị</span>' +
          '<input type="text" id="profileName" class="auth-input" maxlength="60">' +
        '</label>' +
        '<div class="profile-field profile-colour" id="profileColour" hidden>' +
          '<span>Màu ảnh đại diện</span>' +
          '<div class="profile-swatches" data-target="avatar">' + swatches + '</div>' +
        '</div>' +
        '<p class="profile-modal-msg" id="profileMsg" role="status"></p>' +
        '<div class="profile-modal-btns">' +
          '<button type="button" class="auth-btn profile-signout" data-action="signout">Đăng xuất</button>' +
          '<span class="profile-modal-btns-right">' +
            '<button type="button" class="auth-btn" data-action="profile-save">Lưu</button>' +
          '</span>' +
        '</div>' +
      '</div>';
    host.appendChild(m);
    m.querySelector('#profileName').addEventListener('input', refreshProfilePreview);
    Array.prototype.forEach.call(m.querySelectorAll('.profile-swatches'), function (group) {
      group.addEventListener('click', function (ev) {
        var b = ev.target.closest('.profile-swatch');
        if (!b) return;
        _profileDraftHue = parseInt(b.getAttribute('data-hue'), 10);
        Array.prototype.forEach.call(group.querySelectorAll('.profile-swatch'), function (s) {
          s.classList.toggle('is-active', s === b);
        });
        refreshProfilePreview();
      });
    });
  }

  function refreshProfilePreview() {
    var p = document.getElementById('profileAvatarPreview');
    if (!p || !authUser) return;
    var nameEl = document.getElementById('profileName');
    var name = nameEl ? nameEl.value : authUser.name;
    p.innerHTML = avatarHtml(name, authUser.avatar, authUser.id, 'avatar-lg',
      authUser.avatar ? null : _profileDraftHue);
  }

  function openProfileModal() {
    if (!authUser) return;
    ensureProfileModal();
    var m = document.getElementById('profileModal');
    document.getElementById('profileName').value = authUser.name || '';
    document.getElementById('profileMsg').textContent = '';
    _profileDraftHue = (authUser.avatarHue != null)
      ? authUser.avatarHue
      : idToPaletteIndex(authUser.id, authUser.name);
    // Colour choice only matters when there's no photo (i.e. email sign-ups).
    var colourBlock = document.getElementById('profileColour');
    colourBlock.hidden = !!authUser.avatar;
    Array.prototype.forEach.call(m.querySelectorAll('[data-target="avatar"] .profile-swatch'), function (s) {
      s.classList.toggle('is-active', parseInt(s.getAttribute('data-hue'), 10) === _profileDraftHue);
    });
    refreshProfilePreview();
    m.hidden = false;
  }

  function closeProfileModal() {
    var m = document.getElementById('profileModal');
    if (m) m.hidden = true;
  }

  var ADMIN_EMAIL = 'dongthoigian2727@gmail.com';
  function nameLooksLikeAdmin(name, email) {
    return /admin|quản trị/i.test(name) && (email || '').toLowerCase() !== ADMIN_EMAIL;
  }

  function onProfileSave() {
    if (!authUser) return;
    var nameEl = document.getElementById('profileName');
    var msg = document.getElementById('profileMsg');
    var name = (nameEl.value || '').trim().slice(0, 60);
    if (!name) { if (msg) msg.textContent = 'Tên không được để trống.'; return; }
    if (nameLooksLikeAdmin(name, authUser.email)) {
      if (msg) msg.textContent = 'Tên hiển thị không được chứa “Admin”.';
      return;
    }
    var patch = {};
    if (name !== authUser.name) patch.display_name = name;
    var currentIdx = (authUser.avatarHue != null)
      ? authUser.avatarHue
      : idToPaletteIndex(authUser.id, authUser.name);
    if (!authUser.avatar && _profileDraftHue != null && _profileDraftHue !== currentIdx) {
      patch.avatar_hue = _profileDraftHue;
    }
    if (!Object.keys(patch).length) { closeProfileModal(); return; }
    if (msg) msg.textContent = 'Đang lưu...';
    saveProfilePatch(patch, msg);
  }

  // Also reused directly by the chat-bubble-color popover (chat-color-pick),
  // which saves a single { bubble_hue } patch — including bubble_hue: null
  // to reset back to the auto-assigned default, so that key's presence in
  // `patch` (not just non-null) is what decides whether to update the cache.
  function saveProfilePatch(patch, msg) {
    sb.from('profiles').update(patch).eq('id', authUser.id).then(function (res) {
      if (res.error) {
        // the avatar_hue/bubble_hue columns may not exist yet — retry with just the name
        if ((patch.avatar_hue != null || 'bubble_hue' in patch) && patch.display_name) {
          saveProfilePatch({ display_name: patch.display_name }, msg);
          if (msg) msg.textContent = 'Đã lưu tên. Một số cột màu cần thêm vào CSDL.';
          return;
        }
        if (msg) msg.textContent = 'Không lưu được, thử lại nhé.';
        return;
      }
      if (patch.display_name) authUser.name = patch.display_name;
      if (patch.avatar_hue != null) authUser.avatarHue = patch.avatar_hue;
      if ('bubble_hue' in patch) {
        authUser.bubbleHue = patch.bubble_hue;
        // repaint any of my bubbles already on screen with the new color
        if (document.getElementById('chatThread')) renderChatThread();
        if (document.getElementById('inboxConvThread')) renderInboxConversation();
      }
      renderMastheadAuth();
      closeProfileModal();
    });
  }

  // ---- chat widget: send the site owner a private message -----------------
  //
  // One-directional (reader -> owner): a floating icon opens a panel showing
  // the signed-in reader's own message history (persisted in the `messages`
  // table, so it survives a refresh) plus a compose box. There's no reply UI
  // here — the owner reads these via the Supabase Table Editor, the same way
  // comment moderation already works. Like the rest of the engagement
  // section, this never appears on the Artifact build (no `sb`).

  // Fetched once at startup. Readable by everyone via the same "profiles
  // readable by everyone" policy the comments feature already relies on.
  function fetchChatAdmin() {
    if (!sb) return;
    sb.from('profiles').select('display_name, avatar_url, avatar_hue, bubble_hue').eq('is_admin', true).limit(1)
      .then(function (res) {
        var row = res && res.data && res.data[0];
        if (!row) return;
        _chatAdmin = {
          name: row.display_name || 'tác giả',
          avatar: row.avatar_url || null,
          hue: row.avatar_hue,
          bubbleHue: row.bubble_hue
        };
        var title = document.getElementById('chatPanelTitle');
        if (title) title.textContent = 'Nhắn tin cho Admin';   // fixed label, not the admin's name
        var guestMsg = document.getElementById('chatGuestMsg');
        if (guestMsg) guestMsg.innerHTML = 'Đăng nhập để gửi tin nhắn cho <strong>Admin</strong>.';
      });
  }

  function ensureChatWidget() {
    if (document.getElementById('chatWidget')) return;
    var host = document.querySelector('.app') || document.body;
    var w = document.createElement('div');
    w.className = 'chat-widget';
    w.id = 'chatWidget';
    w.innerHTML =
      '<button type="button" class="chat-fab" id="chatFab" data-action="chat-toggle" aria-label="Nhắn tin" aria-expanded="false">' +
        CHAT_FAB_ICON +
      '</button>' +
      '<div class="chat-panel" id="chatPanel" hidden role="dialog" aria-label="Nhắn tin">' +
        '<div class="chat-panel-head">' +
          '<span class="chat-color-wrap">' +
            '<button type="button" class="chat-tool-btn" id="chatColorBtn" data-action="chat-color-toggle" ' +
              'aria-label="Đổi màu bong bóng chat" hidden>' + PALETTE_SVG + '</button>' +
            '<span class="chat-color-popover" id="chatColorPopover" hidden></span>' +
          '</span>' +
          '<span class="chat-panel-title" id="chatPanelTitle">Nhắn tin cho Admin</span>' +
          '<button type="button" class="chat-panel-close" data-action="chat-toggle" aria-label="Đóng">' + CLOSE_X_SVG + '</button>' +
        '</div>' +
        '<div class="chat-panel-body" id="chatPanelBody"></div>' +
      '</div>';
    host.appendChild(w);
    makeChatFabDraggable();
  }

  // ---- draggable chat button --------------------------------------------
  // The reader can drag the chat FAB anywhere on screen. The moved spot is
  // NOT persisted — any full page render (renderChapter or renderAdminInbox)
  // snaps it back to the default corner via resetChatFabPos(). A small
  // movement threshold tells a drag apart from a tap, and a real drag
  // swallows the click that would otherwise open the panel. The panel then
  // opens toward whichever screen edge leaves it the most room (data-hpos /
  // data-vpos → CSS), with fitChatPanelInViewport() as a final nudge so it
  // can never sit off-screen.
  var _suppressFabClick = false;   // true only across the click a drag synthesises

  // Mobile: the button is pinned bottom-centre between the prev/next
  // circles (styles.css) and can't be dragged.
  var MOBILE_MQ = window.matchMedia('(max-width: 860px)');

  function chatFabBox() {
    var fab = document.getElementById('chatFab');
    var r = fab && fab.getBoundingClientRect();
    return { w: (r && r.width) || 54, h: (r && r.height) || 54 };
  }

  // If the chat button (box at x,y) would cover one of the floating
  // prev/next circles, lift it to sit just above that circle instead.
  function chatFabAvoidFloatNav(x, y, b) {
    var nav = document.getElementById('floatNav');
    if (!nav || nav.hidden) return y;
    var gap = 12;
    Array.prototype.forEach.call(nav.querySelectorAll('.float-nav-btn'), function (btn) {
      var r = btn.getBoundingClientRect();
      var overlaps = x < r.right + gap && x + b.w > r.left - gap &&
                     y < r.bottom + gap && y + b.h > r.top - gap;
      if (overlaps) y = r.top - gap - b.h;
    });
    return y;
  }

  // x,y = the widget's desired top-left in viewport px. Clamps inside the
  // viewport (8px margin), applies as inline left/top, records the quadrant.
  // avoidNav (on drop / resize, not mid-drag) also keeps it off the
  // floating prev/next buttons.
  function applyChatFabPos(x, y, avoidNav) {
    var w = document.getElementById('chatWidget');
    if (!w) return;
    var b = chatFabBox(), m = 8;
    x = Math.max(m, Math.min(x, window.innerWidth - b.w - m));
    y = Math.max(m, Math.min(y, window.innerHeight - b.h - m));
    if (avoidNav) y = Math.max(m, chatFabAvoidFloatNav(x, y, b));
    w.style.left = x + 'px';
    w.style.top = y + 'px';
    w.style.right = 'auto';
    w.style.bottom = 'auto';
    w.dataset.hpos = (x + b.w / 2 < window.innerWidth / 2) ? 'left' : 'right';
    w.dataset.vpos = (y + b.h / 2 < window.innerHeight / 2) ? 'top' : 'bottom';
  }

  // Back to the CSS default corner (bottom-right). Called on every full page
  // render (renderChapter, renderAdminInbox).
  function resetChatFabPos() {
    var w = document.getElementById('chatWidget');
    if (!w) return;
    w.style.left = w.style.top = w.style.right = w.style.bottom = '';
    delete w.dataset.hpos;
    delete w.dataset.vpos;
  }

  // Viewport changed (resize / rotate / mobile URL bar) — if it's been
  // dragged, keep it on-screen; then re-fit any open panel.
  function reclampChatWidget() {
    var w = document.getElementById('chatWidget');
    if (w && w.style.left && MOBILE_MQ.matches) resetChatFabPos();
    else if (w && w.style.left) {
      var r = w.getBoundingClientRect();
      applyChatFabPos(r.left, r.top, true);
    }
    fitChatPanelInViewport();
  }

  // Final safety net: if the open panel still pokes past a viewport edge,
  // translate it back in.
  function fitChatPanelInViewport() {
    var panel = document.getElementById('chatPanel');
    if (!panel || panel.hidden) return;
    panel.style.transform = '';
    var r = panel.getBoundingClientRect();
    var m = 8, dx = 0, dy = 0;
    if (r.left < m) dx = m - r.left;
    else if (r.right > window.innerWidth - m) dx = window.innerWidth - m - r.right;
    if (r.top < m) dy = m - r.top;
    else if (r.bottom > window.innerHeight - m) dy = window.innerHeight - m - r.bottom;
    if (dx || dy) panel.style.transform = 'translate(' + Math.round(dx) + 'px,' + Math.round(dy) + 'px)';
  }

  function makeChatFabDraggable() {
    var fab = document.getElementById('chatFab');
    if (!fab || fab._draggable) return;
    fab._draggable = true;
    var sx = 0, sy = 0, ox = 0, oy = 0, active = false, dragging = false;

    // Capture-phase, so it runs before the document click handler that reads
    // data-action. Only swallows the click the browser synthesises right
    // after a drag's pointerup (flag cleared on the next task) — a real tap
    // later still opens the panel.
    fab.addEventListener('click', function (e) {
      if (_suppressFabClick) { e.stopImmediatePropagation(); e.preventDefault(); }
    }, true);

    fab.addEventListener('pointerdown', function (e) {
      if (e.button != null && e.button !== 0) return;
      if (MOBILE_MQ.matches) return;
      active = true; dragging = false;
      sx = e.clientX; sy = e.clientY;
      var r = document.getElementById('chatWidget').getBoundingClientRect();
      ox = r.left; oy = r.top;
      try { fab.setPointerCapture(e.pointerId); } catch (err) {}
    });

    fab.addEventListener('pointermove', function (e) {
      if (!active) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (!dragging && Math.abs(dx) + Math.abs(dy) < 6) return;
      dragging = true;
      e.preventDefault();
      applyChatFabPos(ox + dx, oy + dy);
    });

    function end(e) {
      if (!active) return;
      active = false;
      try { fab.releasePointerCapture(e.pointerId); } catch (err) {}
      if (!dragging) return;
      dragging = false;
      var r = document.getElementById('chatWidget').getBoundingClientRect();
      applyChatFabPos(r.left, r.top, true);
      // the pointerup now synthesises a click on the fab — swallow just that one
      _suppressFabClick = true;
      setTimeout(function () { _suppressFabClick = false; }, 0);
    }
    fab.addEventListener('pointerup', end);
    fab.addEventListener('pointercancel', end);
  }

  var MESSAGE_COLUMNS = 'id, sender_id, body, created_at, deleted, attachment_path, attachment_name, attachment_type, attachment_size';

  // ---- compose-box extras: emoji picker + file attach, shared by the
  // reader's chat widget and the admin's inbox reply box (each instance is
  // told apart only by an id prefix — "chat" or "inbox"). ----------------

  function chatEmojiButtonsHtml() {
    return CHAT_EMOJIS.map(function (e) {
      return '<button type="button" class="chat-emoji-choice" data-action="chat-emoji-pick" data-emoji="' +
        escapeAttr(e) + '" aria-label="' + escapeAttr(e) + '">' + emojiImg(e) + '</button>';
    }).join('');
  }

  // Sending attachments was removed from the compose box on request (the
  // file button, picker and pending-file strip are gone, so the pending-file
  // state below always stays null). Attachments on older messages still
  // render in chatBubbleHtml().
  function composeToolsHtml(prefix) {
    return '<div class="chat-compose-icons">' +
        '<span class="chat-emoji-wrap">' +
          '<button type="button" class="chat-tool-btn" data-action="chat-emoji-toggle" aria-label="Chèn biểu tượng cảm xúc">' + emojiImg('🙂') + '</button>' +
          '<span class="chat-emoji-popover" hidden>' + chatEmojiButtonsHtml() + '</span>' +
        '</span>' +
      '</div>';
  }

  // Shared by the reader's chat widget and the admin inbox reply box.
  // Emoji + Send sit to the right of the textarea; align-items:flex-end on
  // .chat-compose-row (in styles.css) keeps them on the bottom line however
  // tall the textarea grows.
  function composeFormHtml(formId, prefix, inputId, placeholder) {
    return '<form class="chat-compose" id="' + formId + '">' +
        '<div class="chat-compose-row">' +
          '<textarea id="' + inputId + '" class="chat-textarea" maxlength="2000" placeholder="' +
            escapeAttr(placeholder) + '"></textarea>' +
          '<div class="chat-compose-actions">' +
            composeToolsHtml(prefix) +
            '<button type="submit" class="auth-btn chat-send" aria-label="Gửi" title="Gửi">' + SEND_SVG + '</button>' +
          '</div>' +
        '</div>' +
      '</form>';
  }

  function closeAllChatEmojiPopovers(except) {
    Array.prototype.forEach.call(document.querySelectorAll('.chat-emoji-popover'), function (p) {
      if (p !== except) p.hidden = true;
    });
  }

  function toggleChatEmojiPopover(btn) {
    var wrap = btn.closest('.chat-emoji-wrap');
    var pop = wrap && wrap.querySelector('.chat-emoji-popover');
    if (!pop) return;
    var willOpen = pop.hidden;
    closeAllChatEmojiPopovers();
    pop.hidden = !willOpen;
  }

  // Chat bubble color picker, opened from the gear icon in the chat panel
  // head (moved out of the profile editor since it's chat-specific). The
  // first swatch is a "reset to default" option — bubble_hue: null — for
  // anyone who picked a color and wants back the auto-assigned one.
  function chatColorSwatchesHtml() {
    var current = authUser ? authUser.bubbleHue : null;
    var defaultBtn = '<button type="button" class="profile-swatch chat-color-default' +
      (current == null ? ' is-active' : '') +
      '" data-action="chat-color-pick" data-hue="default" aria-label="Màu mặc định" title="Màu mặc định">↺</button>';
    var swatches = AVATAR_PALETTE.map(function (_c, i) {
      return '<button type="button" class="profile-swatch' + (current === i ? ' is-active' : '') +
        '" data-action="chat-color-pick" data-hue="' + i + '" style="' + avatarVars(i) +
        '" aria-label="Màu ' + (i + 1) + '"></button>';
    }).join('');
    return defaultBtn + swatches;
  }

  function closeChatColorPopover() {
    var pop = document.getElementById('chatColorPopover');
    if (pop) pop.hidden = true;
  }

  function toggleChatColorPopover(btn) {
    var wrap = btn.closest('.chat-color-wrap');
    var pop = wrap && wrap.querySelector('.chat-color-popover');
    if (!pop) return;
    var willOpen = pop.hidden;
    closeChatColorPopover();
    if (willOpen) {
      pop.innerHTML = chatColorSwatchesHtml();
      pop.hidden = false;
    }
  }

  function onChatColorPick(btn) {
    if (!authUser) return;
    var raw = btn.getAttribute('data-hue');
    saveProfilePatch({ bubble_hue: raw === 'default' ? null : parseInt(raw, 10) }, null);
    closeChatColorPopover();
  }

  function insertAtCursor(field, text) {
    var start = field.selectionStart != null ? field.selectionStart : field.value.length;
    var end = field.selectionEnd != null ? field.selectionEnd : field.value.length;
    field.value = field.value.slice(0, start) + text + field.value.slice(end);
    var pos = start + text.length;
    try { field.setSelectionRange(pos, pos); } catch (e) {}
  }

  // Grows a .chat-textarea to fit however many lines it holds, instead of
  // staying a fixed height with an internal scrollbar. CSS still caps it
  // (max-height, with overflow-y:auto as the fallback) so a huge paste
  // can't make the box itself unbounded.
  function autoGrowTextarea(el) {
    // overflow-y is switched off (not just left to CSS's own overflow-y:
    // auto) while regrowing, then only turned back on if the content
    // genuinely exceeds max-height. Leaving auto in charge here can flash
    // a scrollbar for a frame during the reflow itself — most visible on
    // mobile, where paint timing differs from desktop — even though the
    // box ends up plenty tall enough once the height update lands.
    el.style.overflowY = 'hidden';
    el.style.height = 'auto';
    // border-box sizing means style.height includes the border, but
    // scrollHeight doesn't — without adding it back, the box lands a
    // couple px short of its own content and overflows by that sliver.
    var borders = el.offsetHeight - el.clientHeight;
    var contentHeight = el.scrollHeight + borders;
    var maxHeight = parseFloat(getComputedStyle(el).maxHeight);
    if (!maxHeight || contentHeight <= maxHeight) {
      el.style.height = contentHeight + 'px';
    } else {
      el.style.height = maxHeight + 'px';
      el.style.overflowY = 'auto';
    }
  }

  function onChatEmojiPick(btn) {
    var form = btn.closest('form');
    var input = form && form.querySelector('textarea');
    if (input) {
      insertAtCursor(input, btn.getAttribute('data-emoji'));
      autoGrowTextarea(input);   // programmatic .value change — no native 'input' event to catch this
    }
    // Leave the popover open so several emojis can be picked in a row — it
    // closes on the next click outside .chat-emoji-wrap (see the document
    // click handler) or when the 🙂 toggle is tapped again.
  }

  // Shows/clears the small "attached: filename ×" chip above a compose row.
  function showPendingFile(prefix, file) {
    var box = document.getElementById(prefix + 'PendingFile');
    if (!box) return;
    box.hidden = !file;
    var nameEl = box.querySelector('.chat-pending-file-name');
    if (nameEl) nameEl.textContent = file ? file.name : '';
  }

  function onChatFileChosen(input, prefix) {
    var file = input.files && input.files[0];
    input.value = '';   // lets choosing the exact same file again later still fire 'change'
    if (!file) return;
    if (file.size > ATTACHMENT_MAX_BYTES) {
      window.alert('Tệp quá lớn (tối đa 5MB).');
      return;
    }
    if (prefix === 'inbox') _inboxPendingFile = file; else _chatPendingFile = file;
    showPendingFile(prefix, file);
  }

  // Uploads into the private "chat-attachments" bucket under
  // <threadUserId>/<random>-<filename>, matching the Storage RLS in
  // comments-setup.sql (thread participant or admin). Calls back with
  // { path, name, type, size } to attach to the message row, or null on
  // failure.
  function uploadChatAttachment(file, threadUserId, cb) {
    if (!sb) { cb(null); return; }
    var ext = (file.name.split('.').pop() || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
    var path = threadUserId + '/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + (ext ? '.' + ext : '');
    sb.storage.from(ATTACHMENTS_BUCKET).upload(path, file, { contentType: file.type || undefined })
      .then(function (res) {
        if (res.error) { cb(null); return; }
        cb({ path: path, name: file.name, type: file.type || '', size: file.size });
      });
  }

  // Shared by both the reader's chat widget and the admin's inbox
  // conversation pane — "mine" is just whoever's viewing (auth.uid()), so
  // the same bubble logic renders correctly from either side of a thread.
  // `fromLabel` names the OTHER party, shown above a bubble that isn't mine;
  // `theirHue` is that other party's chat bubble color (mine comes from
  // authUser.bubbleHue directly) — null for either means the default
  // fixed bubble color from styles.css, unchanged.
  function chatBubbleHtml(m, fromLabel, theirHue) {
    var mine = authUser && m.sender_id === authUser.id;
    var label = (!mine && fromLabel) ? '<div class="chat-msg-from">' + escapeHtml(fromLabel) + '</div>' : '';
    // Recalled: the row still exists (thread order/history stay intact),
    // but its content was cleared server-side — show the same placeholder
    // to both parties, no delete link (nothing left to undo), and skip the
    // bubble-color styling (it always reads as neutral/faint instead).
    if (m.deleted) {
      return '<div class="chat-msg' + (mine ? '' : ' is-them') + '">' +
          label +
          '<div class="chat-msg-bubble chat-msg-recalled">Tin nhắn đã được thu hồi</div>' +
          '<div class="chat-msg-time"><span>' + escapeHtml(relTime(m.created_at)) + '</span></div>' +
        '</div>';
    }
    var hue = mine ? (authUser && authUser.bubbleHue) : theirHue;
    var style = '';
    if (hue != null) {
      var c = paletteColor(hue);
      style = ' style="background:' + c.bg + ';color:' + c.fg + '"';
    }
    var bodyHtml = m.body ? '<div class="chat-msg-text">' + emojifyHtml(escapeHtml(m.body)).replace(/\r?\n/g, '<br>') + '</div>' : '';
    var attachmentHtml = '';
    if (m.attachment_path) {
      var isImage = (m.attachment_type || '').indexOf('image/') === 0;
      attachmentHtml = isImage
        ? '<img class="chat-attachment-img" alt="' + escapeAttr(m.attachment_name || '') +
            '" data-path="' + escapeAttr(m.attachment_path) + '">'
        : '<a class="chat-attachment-file" href="#" target="_blank" rel="noopener" data-path="' +
            escapeAttr(m.attachment_path) + '">' + emojiImg('📎') + ' <span>' + escapeHtml(m.attachment_name || 'Tệp đính kèm') + '</span></a>';
    }
    // A short "undo", not general moderation — matches the 2-minute recall
    // policy in comments-setup.sql, so a click past the window just fails
    // server-side rather than this button lying about what's possible.
    // Hidden until the bubble itself is tapped/clicked (chat-msg-toggle),
    // so the recall link doesn't clutter every message by default.
    var canDelete = mine && isWithinDeleteWindow(m.created_at);
    var deleteBtn = canDelete
      ? '<button type="button" class="chat-msg-delete" data-action="chat-msg-delete" data-id="' +
          escapeAttr(m.id) + '">Thu hồi</button>'
      : '';
    var bubbleAttrs = style + (canDelete ? ' data-action="chat-msg-toggle"' : '');
    var bubbleClass = 'chat-msg-bubble' + (canDelete ? ' is-tappable' : '');
    return '<div class="chat-msg' + (mine ? '' : ' is-them') + '">' +
        label +
        '<div class="' + bubbleClass + '"' + bubbleAttrs + '>' + bodyHtml + attachmentHtml + '</div>' +
        '<div class="chat-msg-time">' +
          '<span>' + escapeHtml(relTime(m.created_at)) + '</span>' + deleteBtn +
        '</div>' +
      '</div>';
  }

  function isWithinDeleteWindow(createdAt) {
    var t = Date.parse(createdAt);
    return !isNaN(t) && (Date.now() - t) < 2 * 60 * 1000;
  }

  // Soft delete: UPDATEs the row to a "recalled" state (deleted:true, all
  // content cleared) rather than removing it, so the other party sees a
  // placeholder in the same spot instead of the message just vanishing.
  // Mirrors onCommentDelete's confirm + .select('id') pattern to detect a
  // no-op (RLS silently matches 0 rows past the 2-minute window rather than
  // erroring). Not scoped to which UI triggered it — patching both the
  // widget's and the inbox's message arrays by id is harmless, since
  // whichever one doesn't contain this id is just a no-op.
  function onChatMessageDelete(btn) {
    if (typeof window.confirm === 'function' && !window.confirm('Thu hồi tin nhắn này?')) return;
    var id = btn.getAttribute('data-id');
    btn.disabled = true;
    var patch = {
      deleted: true, body: '',
      attachment_path: null, attachment_name: null, attachment_type: null, attachment_size: null
    };
    sb.from('messages').update(patch).eq('id', id).select('id').then(function (res) {
      if (res.error || !res.data || !res.data.length) { btn.disabled = false; return; }
      function markRecalled(list) {
        var m = list.filter(function (x) { return String(x.id) === String(id); })[0];
        if (m) {
          m.deleted = true; m.body = '';
          m.attachment_path = null; m.attachment_name = null; m.attachment_type = null; m.attachment_size = null;
        }
      }
      markRecalled(_chatMessages);
      markRecalled(_inboxMessages);
      renderChatThread();
      renderInboxConversation();
      if (authUser && authUser.isAdmin) loadInboxThreads();   // refresh the left list's preview
    });
  }

  // Resolves a short-lived signed URL for each not-yet-hydrated attachment
  // under `root` and patches it into the <img>/<a> — the bucket is private
  // (see comments-setup.sql), so there's no public URL to just set upfront.
  function hydrateChatAttachments(root) {
    if (!sb || !root) return;
    Array.prototype.forEach.call(root.querySelectorAll('[data-path]'), function (el) {
      if (el.getAttribute('data-hydrated')) return;
      el.setAttribute('data-hydrated', '1');
      var path = el.getAttribute('data-path');
      sb.storage.from(ATTACHMENTS_BUCKET).createSignedUrl(path, 3600).then(function (res) {
        var url = res && res.data && res.data.signedUrl;
        if (!url) return;
        if (el.tagName === 'IMG') el.src = url; else el.href = url;
      });
    });
  }

  function renderChatThread() {
    var thread = document.getElementById('chatThread');
    if (!thread) return;
    thread.innerHTML = _chatMessages.length
      ? _chatMessages.map(function (m) { return chatBubbleHtml(m, _chatAdmin.name, _chatAdmin.bubbleHue); }).join('')
      : '<p class="chat-empty">Chưa có tin nhắn nào. Gửi lời nhắn đầu tiên của bạn nhé!</p>';
    thread.scrollTop = thread.scrollHeight;
    hydrateChatAttachments(thread);
  }

  // Fetches the reader's WHOLE thread (their own messages + the admin's
  // replies into it), not just what they sent — thread_user_id, not
  // sender_id, is the reader's own conversation.
  function loadChatMessages() {
    if (!sb || !authUser) return;
    var uid = authUser.id;
    sb.from('messages').select(MESSAGE_COLUMNS).eq('thread_user_id', uid)
      .order('created_at', { ascending: true }).limit(200)
      .then(function (res) {
        if (!authUser || authUser.id !== uid) return;   // signed out/changed meanwhile
        _chatMessages = (res && res.data) || [];
        _chatLoadedFor = uid;
        renderChatThread();
        // Only mark as read while the panel is actually visible — this same
        // fetch also runs from refresh() on a bare auth-state change, when
        // the reader hasn't necessarily seen anything.
        if (_chatOpen) markChatThreadRead();
      });
  }

  // Guest state (sign-in prompt) or signed-in state (thread + compose box).
  function renderChatPanelBody() {
    var body = document.getElementById('chatPanelBody');
    if (!body) return;
    var colorBtn = document.getElementById('chatColorBtn');
    if (colorBtn) colorBtn.hidden = !authUser;
    // Signed in → the panel keeps its fixed full height (a chat needs the
    // room). Guest → it shrinks to just the sign-in prompt + buttons.
    var panel = document.getElementById('chatPanel');
    if (panel) {
      panel.classList.toggle('chat-panel-compact', !authUser);
      if (_chatOpen) requestAnimationFrame(fitChatPanelInViewport);
    }
    if (!authUser) {
      closeChatColorPopover();
      body.innerHTML =
        '<div class="chat-guest">' +
          '<p class="chat-guest-msg" id="chatGuestMsg">Đăng nhập để gửi tin nhắn cho <strong>Admin</strong>.</p>' +
          '<button type="button" class="auth-btn auth-ghost auth-google" data-action="chat-google">' +
            GOOGLE_G_SVG + '<span>Đăng nhập bằng Google</span></button>' +
          '<button type="button" class="auth-btn" data-action="chat-signin">Đăng nhập/Đăng ký</button>' +
        '</div>';
      return;
    }
    // Build the thread + compose form ONCE per sign-in, not on every open —
    // reopening the panel (or a token-refresh-triggered refresh()) must
    // never touch an existing #chatForm, or text/a file the reader had
    // started but not sent yet would get wiped out along with it.
    if (!document.getElementById('chatForm')) {
      body.innerHTML =
        '<div class="chat-thread" id="chatThread"></div>' +
        composeFormHtml('chatForm', 'chat', 'chatInput', 'Nhập tin nhắn...');
    }
    if (_chatLoadedFor === authUser.id) {
      renderChatThread();
    } else {
      document.getElementById('chatThread').innerHTML = '<p class="chat-empty">Đang tải...</p>';
    }
    loadChatMessages();   // always refresh — picks up any admin reply sent since the last open
  }

  // Unread badge on the chat FAB — computed from a message_reads row (this
  // reader's last_read_at for their own thread) plus a count-only query for
  // admin messages newer than that. Not realtime: refreshed on auth resolve
  // and by the poll in initEngagement, same "poll, don't push" approach the
  // rest of this feature already uses.
  function setChatBadge(n) {
    var fab = document.getElementById('chatFab');
    if (!fab) return;
    var badge = fab.querySelector('.chat-fab-badge');
    if (n > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'chat-fab-badge';
        fab.appendChild(badge);
      }
      badge.textContent = n > 9 ? '9+' : String(n);
    } else if (badge) {
      badge.remove();
    }
  }

  function refreshChatUnreadBadge() {
    if (!sb || !authUser) { setChatBadge(0); return; }
    var uid = authUser.id;
    sb.from('message_reads').select('last_read_at').eq('viewer_id', uid).eq('thread_user_id', uid).maybeSingle()
      .then(function (rres) {
        if (!authUser || authUser.id !== uid) return;
        var lastRead = (rres && rres.data && rres.data.last_read_at) || '1970-01-01T00:00:00Z';
        sb.from('messages').select('id', { count: 'exact', head: true })
          .eq('thread_user_id', uid).neq('sender_id', uid).gt('created_at', lastRead)
          .then(function (mres) {
            if (!authUser || authUser.id !== uid) return;
            setChatBadge((mres && typeof mres.count === 'number') ? mres.count : 0);
          });
      });
  }

  // Records that this reader has seen every message up through the newest
  // one currently loaded — using that message's own created_at rather than
  // the client clock, so a slightly-skewed device clock can't mark a
  // message read before it actually arrived.
  function markChatThreadRead() {
    if (!sb || !authUser || !_chatMessages.length) return;
    var latest = _chatMessages[_chatMessages.length - 1].created_at;
    sb.from('message_reads').upsert({ viewer_id: authUser.id, thread_user_id: authUser.id, last_read_at: latest })
      .then(function () { setChatBadge(0); });
  }

  function toggleChatPanel() {
    ensureChatWidget();
    var panel = document.getElementById('chatPanel');
    var fab = document.getElementById('chatFab');
    if (!panel) return;
    _chatOpen = panel.hidden;
    panel.hidden = !_chatOpen;
    if (fab) fab.setAttribute('aria-expanded', String(_chatOpen));
    if (_chatOpen) {
      renderChatPanelBody();
      panel.style.transform = '';
      requestAnimationFrame(fitChatPanelInViewport);
    }
  }

  function closeChatPanel() {
    var panel = document.getElementById('chatPanel');
    if (panel) { panel.hidden = true; panel.style.transform = ''; }
    var fab = document.getElementById('chatFab');
    if (fab) fab.setAttribute('aria-expanded', 'false');
    _chatOpen = false;
  }

  function onChatSubmit(form) {
    if (!authUser) return;
    var input = form.querySelector('#chatInput');
    var body = (input.value || '').trim().slice(0, 2000);
    var file = _chatPendingFile;
    if (!body && !file) return;   // needs text, an attachment, or both
    var submit = form.querySelector('.chat-send');
    if (submit) submit.disabled = true;

    function insertRow(attachment) {
      var row = { thread_user_id: authUser.id, sender_id: authUser.id, body: body };
      if (attachment) {
        row.attachment_path = attachment.path;
        row.attachment_name = attachment.name;
        row.attachment_type = attachment.type;
        row.attachment_size = attachment.size;
      }
      sb.from('messages').insert(row).select(MESSAGE_COLUMNS).single().then(function (res) {
        if (submit) submit.disabled = false;
        if (res.error) return;
        _chatMessages.push(res.data);
        _chatLoadedFor = authUser.id;
        input.value = '';
        autoGrowTextarea(input);
        _chatPendingFile = null;
        showPendingFile('chat', null);
        renderChatThread();
      });
    }

    if (file) {
      uploadChatAttachment(file, authUser.id, function (attachment) {
        if (!attachment) {
          if (submit) submit.disabled = false;
          window.alert('Không tải lên được tệp, thử lại nhé.');
          return;
        }
        insertRow(attachment);
      });
    } else {
      insertRow(null);
    }
  }

  // ---- admin inbox: read + reply to every reader's chat thread -------------
  //
  // Visible only to the admin (public.is_admin(), reflected in
  // authUser.isAdmin), via a "Hộp thư" entry pinned above chapter 1 in the
  // sidebar (updateAdminTocItem). Renders into #reader in place of a
  // chapter, but — deliberately, to keep this simple — doesn't get a hash
  // or a history entry the way chapters do: it's a one-off admin view, not
  // a bookmarkable page, so a refresh or the browser Back button always
  // lands back on the last chapter, never back on the inbox.

  var _inboxThreads = [];      // [{ uid, name, avatar, hue, lastBody, lastCreatedAt }], newest first
  var _inboxSelected = null;   // uid of the thread open in the conversation pane, if any
  var _inboxMessages = [];     // messages for _inboxSelected, oldest first

  function updateAdminTocItem() {
    var toc = document.getElementById('toc');
    if (!toc) return;
    var existing = document.getElementById('tocAdminItem');
    var existingUsers = document.getElementById('tocAdminUsersItem');
    if (!(authUser && authUser.isAdmin)) {
      if (existing) existing.remove();
      if (existingUsers) existingUsers.remove();
      return;
    }
    if (existing && existingUsers) return;
    if (!existing) {
      existing = document.createElement('li');
      existing.id = 'tocAdminItem';
      existing.innerHTML =
        '<button type="button" class="toc-item toc-admin-item" data-action="admin-inbox" aria-label="Hộp thư (quản trị)">' +
          '<span class="toc-num toc-num-icon" aria-hidden="true">' + CHAT_SVG_SM + '</span>' +
          '<span class="toc-text"><span class="toc-title">Hộp thư</span></span>' +
        '</button>';
      toc.insertBefore(existing, toc.firstChild);
    }
    // "Người dùng" sits right below "Hộp thư", still above chapter 1.
    if (!existingUsers) {
      existingUsers = document.createElement('li');
      existingUsers.id = 'tocAdminUsersItem';
      existingUsers.innerHTML =
        '<button type="button" class="toc-item toc-admin-item" data-action="admin-users" aria-label="Người dùng (quản trị)">' +
          '<span class="toc-num toc-num-icon" aria-hidden="true">' + USERS_SVG_SM + '</span>' +
          '<span class="toc-text"><span class="toc-title">Người dùng</span></span>' +
        '</button>';
      toc.insertBefore(existingUsers, existing.nextSibling);
      setTocBadge('tocAdminUsersItem', _adminNewUsers);
    }
  }

  // Messenger-style row: avatar (+ flag), name and time on the first line,
  // last message and the unread pill on the second.
  function inboxThreadLi(t) {
    var badge = t.unread ? '<span class="inbox-thread-badge">' + (t.unread > 9 ? '9+' : t.unread) + '</span>' : '';
    return '<button type="button" class="inbox-thread-item' +
        (t.uid === _inboxSelected ? ' active' : '') + (t.unread ? ' has-unread' : '') +
        '" data-action="inbox-open" data-uid="' + escapeAttr(t.uid) + '">' +
      avatarFlagHtml(t.name, t.avatar, t.uid, 'inbox-thread-avatar', t.avatar ? null : t.hue, countryOf(t.uid)) +
      '<span class="inbox-thread-text">' +
        '<span class="inbox-thread-top">' +
          '<span class="inbox-thread-name">' + escapeHtml(t.name) + '</span>' +
          '<span class="inbox-thread-time">' + escapeHtml(relTime(t.lastCreatedAt)) + '</span>' +
        '</span>' +
        '<span class="inbox-thread-bottom">' +
          '<span class="inbox-thread-preview">' + escapeHtml(t.lastBody) + '</span>' +
          badge +
        '</span>' +
      '</span>' +
    '</button>';
  }

  var _inboxQuery = '';
  function renderInboxThreadList() {
    var list = document.getElementById('inboxThreadList');
    if (!list) return;
    var q = _inboxQuery.trim().toLowerCase();
    var rows = !q ? _inboxThreads : _inboxThreads.filter(function (t) {
      return (t.name + ' ' + (t.lastBody || '')).toLowerCase().indexOf(q) !== -1;
    });
    list.innerHTML = rows.length
      ? rows.map(inboxThreadLi).join('')
      : '<p class="chat-empty">' + (q ? 'Không tìm thấy cuộc trò chuyện.' : 'Chưa có ai nhắn tin.') + '</p>';
    var count = document.getElementById('inboxThreadCount');
    if (count) count.textContent = _inboxThreads.length ? String(_inboxThreads.length) : '';
  }

  // Sums each thread's unread count onto the "Hộp thư" sidebar entry.
  function updateAdminInboxBadge() {
    var total = _inboxThreads.reduce(function (sum, t) { return sum + (t.unread || 0); }, 0);
    setTocBadge('tocAdminItem', total);
  }

  // Red count pill on an admin sidebar entry (same look as the inbox one).
  function setTocBadge(liId, total) {
    var li = document.getElementById(liId);
    if (!li) return;
    var btn = li.querySelector('.toc-item');
    if (!btn) return;
    var badge = btn.querySelector('.toc-badge');
    if (total > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'toc-badge';
        btn.appendChild(badge);
      }
      badge.textContent = total > 99 ? '99+' : String(total);
    } else if (badge) {
      badge.remove();
    }
  }

  // One query for the latest message per thread (also used to compute each
  // thread's unread count client-side, against the admin's own read
  // receipts), then one combined profile fetch for whichever readers those
  // threads belong to — same two-query pattern loadComments() already uses
  // for authors + reactors.
  function loadInboxThreads() {
    if (!sb || !authUser || !authUser.isAdmin) return;
    sb.from('messages').select('thread_user_id, sender_id, body, created_at, deleted')
      .order('created_at', { ascending: false }).limit(500)
      .then(function (res) {
        var rows = (res && res.data) || [];
        var seen = {};
        var threads = [];
        rows.forEach(function (r) {
          if (seen[r.thread_user_id]) return;
          seen[r.thread_user_id] = true;
          threads.push({
            uid: r.thread_user_id,
            lastBody: r.deleted ? 'Tin nhắn đã được thu hồi' : r.body,
            lastCreatedAt: r.created_at
          });
        });
        var ids = threads.map(function (t) { return t.uid; });
        if (!ids.length) { _inboxThreads = []; renderInboxThreadList(); updateAdminInboxBadge(); return; }
        Promise.all([
          sb.from('profiles').select('id, display_name, avatar_url, avatar_hue, bubble_hue').in('id', ids),
          sb.from('message_reads').select('thread_user_id, last_read_at').eq('viewer_id', authUser.id)
        ]).then(function (results) {
          var pres = results[0], rres = results[1];
          var byId = {};
          ((pres && pres.data) || []).forEach(function (p) { byId[p.id] = p; });
          var readMap = {};
          ((rres && rres.data) || []).forEach(function (r) { readMap[r.thread_user_id] = r.last_read_at; });
          var unread = {};
          rows.forEach(function (r) {
            if (r.sender_id === authUser.id) return;   // the admin's own replies never count as unread
            var lastRead = readMap[r.thread_user_id];
            if (!lastRead || r.created_at > lastRead) {
              unread[r.thread_user_id] = (unread[r.thread_user_id] || 0) + 1;
            }
          });
          _inboxThreads = threads.map(function (t) {
            var p = byId[t.uid] || {};
            return {
              uid: t.uid,
              name: p.display_name || 'Người đọc',
              avatar: p.avatar_url || null,
              hue: p.avatar_hue,
              bubbleHue: p.bubble_hue,
              lastBody: t.lastBody,
              lastCreatedAt: t.lastCreatedAt,
              unread: unread[t.uid] || 0
            };
          });
          renderInboxThreadList();
          updateAdminInboxBadge();
          // flags arrive a moment later; repaint once they're in
          ensureAdminEmails(function () {
            loadCountries(ids, _countries, function () {
              renderInboxThreadList();
              if (_inboxSelected) renderInboxConvHead();
            });
          });
        });
      });
  }

  function renderInboxConversation() {
    var conv = document.getElementById('inboxConversation');
    if (!conv || !_inboxSelected) return;
    var t = _inboxThreads.filter(function (x) { return x.uid === _inboxSelected; })[0];
    var name = t ? t.name : 'Người đọc';
    conv.innerHTML =
      '<div class="inbox-conv-head" id="inboxConvHead">' + inboxConvHeadInner() + '</div>' +
      '<div class="chat-thread inbox-conv-thread" id="inboxConvThread"></div>' +
      composeFormHtml('inboxReplyForm', 'inbox', 'inboxReplyInput', 'Trả lời...');
    var threadEl = document.getElementById('inboxConvThread');
    threadEl.innerHTML = _inboxMessages.length
      ? _inboxMessages.map(function (m) { return chatBubbleHtml(m, name, t && t.bubbleHue); }).join('')
      : '<p class="chat-empty">Chưa có tin nhắn.</p>';
    threadEl.scrollTop = threadEl.scrollHeight;
    hydrateChatAttachments(threadEl);
  }

  function inboxConvHeadInner() {
    var t = _inboxThreads.filter(function (x) { return x.uid === _inboxSelected; })[0];
    var name = t ? t.name : 'Người đọc';
    var c = countryOf(_inboxSelected);
    var sub = c ? flagHtml(c, 'inbox-conv-flag') + '<span>' + escapeHtml(countryName(c)) + '</span>' : '';
    return '<button type="button" class="inbox-back" data-action="inbox-back" aria-label="Quay lại danh sách">' +
        '<svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="none" stroke="currentColor" stroke-width="2.4" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      avatarHtml(name, t && t.avatar, _inboxSelected, 'inbox-conv-avatar', (t && !t.avatar) ? t.hue : null) +
      '<span class="inbox-conv-who">' +
        '<span class="inbox-conv-name">' + escapeHtml(name) + '</span>' +
        (sub ? '<span class="inbox-conv-sub">' + sub + '</span>' : '') +
      '</span>';
  }
  function renderInboxConvHead() {
    var h = document.getElementById('inboxConvHead');
    if (h) h.innerHTML = inboxConvHeadInner();
  }

  function loadInboxMessages(uid) {
    sb.from('messages').select(MESSAGE_COLUMNS).eq('thread_user_id', uid)
      .order('created_at', { ascending: true }).limit(500)
      .then(function (res) {
        if (_inboxSelected !== uid) return;   // switched threads meanwhile
        _inboxMessages = (res && res.data) || [];
        renderInboxConversation();
        markInboxThreadRead(uid);
      });
  }

  // Same created_at-of-the-newest-message approach as markChatThreadRead —
  // avoids a skewed client clock marking something read before it arrived.
  function markInboxThreadRead(uid) {
    if (!sb || !authUser || !_inboxMessages.length) return;
    var latest = _inboxMessages[_inboxMessages.length - 1].created_at;
    sb.from('message_reads').upsert({ viewer_id: authUser.id, thread_user_id: uid, last_read_at: latest })
      .then(function () {
        var t = _inboxThreads.filter(function (x) { return x.uid === uid; })[0];
        if (t) t.unread = 0;
        renderInboxThreadList();
        updateAdminInboxBadge();
      });
  }

  function openInboxThread(uid) {
    _inboxSelected = uid;
    renderInboxThreadList();
    // On mobile the layout shows one pane at a time — this class makes the
    // max-width:860px CSS swap the thread list out for the conversation. On
    // desktop both panes always show, so it's a no-op there.
    var layout = document.querySelector('.inbox-layout');
    if (layout) layout.classList.add('showing-conv');
    var conv = document.getElementById('inboxConversation');
    if (conv) conv.innerHTML = '<p class="chat-empty">Đang tải...</p>';
    loadInboxMessages(uid);
  }

  // The "←" in the conversation header (mobile only — hidden by CSS on desktop):
  // drop back to the thread list.
  function backToInboxList() {
    _inboxSelected = null;
    _inboxMessages = [];
    var layout = document.querySelector('.inbox-layout');
    if (layout) layout.classList.remove('showing-conv');
    renderInboxThreadList();
    loadInboxThreads();   // pick up any replies/read-state that landed meanwhile
  }

  function onInboxReplySubmit(form) {
    if (!authUser || !authUser.isAdmin || !_inboxSelected) return;
    var input = form.querySelector('#inboxReplyInput');
    var body = (input.value || '').trim().slice(0, 2000);
    var file = _inboxPendingFile;
    if (!body && !file) return;
    var submit = form.querySelector('.chat-send');
    if (submit) submit.disabled = true;
    var uid = _inboxSelected;

    function insertRow(attachment) {
      var row = { thread_user_id: uid, sender_id: authUser.id, body: body };
      if (attachment) {
        row.attachment_path = attachment.path;
        row.attachment_name = attachment.name;
        row.attachment_type = attachment.type;
        row.attachment_size = attachment.size;
      }
      sb.from('messages').insert(row).select(MESSAGE_COLUMNS).single().then(function (res) {
        if (submit) submit.disabled = false;
        if (res.error) return;
        if (_inboxSelected === uid) {
          _inboxMessages.push(res.data);
          input.value = '';
          _inboxPendingFile = null;
          showPendingFile('inbox', null);
          renderInboxConversation();
        }
        loadInboxThreads();   // refresh the left list's preview/ordering
      });
    }

    if (file) {
      uploadChatAttachment(file, uid, function (attachment) {
        if (!attachment) {
          if (submit) submit.disabled = false;
          window.alert('Không tải lên được tệp, thử lại nhé.');
          return;
        }
        insertRow(attachment);
      });
    } else {
      insertRow(null);
    }
  }

  function renderAdminInbox() {
    if (!authUser || !authUser.isAdmin) return;
    readerEl.removeAttribute('data-chapter-id');
    updateFloatNav(-1);
    setChapterBar(-1);
    readerEl.innerHTML =
      '<article class="chapter admin-inbox">' +
        '<p class="chapter-kicker">Quản trị</p>' +
        '<h2 class="chapter-title">Hộp thư</h2>' +
        '<hr class="chapter-lead-rule">' +
        '<div class="inbox-layout">' +
          '<div class="inbox-side">' +
            '<div class="inbox-side-head">' +
              '<span class="inbox-side-title">Tin nhắn <span class="inbox-side-count" id="inboxThreadCount"></span></span>' +
              '<input type="search" class="inbox-search" id="inboxSearch" placeholder="Tìm người hoặc tin nhắn..." autocomplete="off">' +
            '</div>' +
            '<div class="inbox-thread-list" id="inboxThreadList"><p class="chat-empty">Đang tải...</p></div>' +
          '</div>' +
          '<div class="inbox-conversation" id="inboxConversation">' +
            '<div class="inbox-placeholder">' + CHAT_SVG_SM + '<p>Chọn một cuộc trò chuyện để xem.</p></div>' +
          '</div>' +
        '</div>' +
      '</article>';
    scrollReaderToTop();
    updateProgress();
    Array.prototype.forEach.call(tocEl.querySelectorAll('.toc-item'), function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-action') === 'admin-inbox');
    });
    _inboxSelected = null;
    _inboxQuery = '';
    document.getElementById('inboxSearch').addEventListener('input', function (ev) {
      _inboxQuery = ev.target.value;
      renderInboxThreadList();
    });
    resetChatFabPos();
    loadInboxThreads();
    saveLastChapter(ADMIN_INBOX_ROUTE);
    history.replaceState({ chapterId: ADMIN_INBOX_ROUTE }, '', '#' + ADMIN_INBOX_ROUTE);
  }

  // ---- admin user list: every account, newest sign-up first ----------------
  //
  // The "Người dùng" sidebar entry (below "Hộp thư", admin only). Emails and
  // sign-in dates come from auth.users via the admin_list_users() RPC in
  // comments-setup.sql, which refuses anyone but public.is_admin() — the
  // client-side authUser.isAdmin check only gates the UI, same as the inbox.

  var _adminUsers = [];
  var _adminUsersSeenAt = null;   // when the admin last opened this list (server-stored)
  var _adminNewUsers = 0;

  // "Người dùng" badge: accounts created since the admin last opened the
  // list. Polled alongside the inbox (refresh() + the 60s interval). The
  // seen-at time lives in profiles.admin_users_seen_at, not localStorage, so
  // it's the same on every device — like the inbox's message_reads.
  function loadAdminNewUsers() {
    if (!sb || !authUser || !authUser.isAdmin) return;
    sb.rpc('admin_new_users').then(function (res) {
      if (!res || res.error) return;
      var row = (res.data && res.data[0]) || {};
      _adminUsersSeenAt = row.seen_at || null;
      // While the list is on screen, anything new gets marked seen by
      // loadAdminUsers instead — don't flash a badge for the open page.
      if (readerEl.querySelector('.admin-users')) {
        if (row.n) loadAdminUsers();
        return;
      }
      _adminNewUsers = Number(row.n) || 0;
      setTocBadge('tocAdminUsersItem', _adminNewUsers);
    });
  }

  function isNewAdminUser(u) {
    if (u.id === authUser.id) return false;
    return !_adminUsersSeenAt || Date.parse(u.created_at) > Date.parse(_adminUsersSeenAt);
  }

  function adminUserContact(u) {
    var e = u.email || '';
    if (/@phone\.nkltt$/i.test(e)) return '+' + e.replace(/@.*$/, '').replace(/^p/, '');
    return e;
  }

  function adminUserProvider(u) {
    if (/@phone\.nkltt$/i.test(u.email || '')) return 'Số điện thoại';
    if (u.provider === 'google') return 'Google';
    return 'Email';
  }

  // One card per account: avatar with flag, name + tags, contact line,
  // activity pills, joined / last sign-in.
  function adminUserRow(u) {
    var c = countryOf(u.id);
    var pills = [];
    if (u.comment_count) pills.push('<span class="admin-pill">' + u.comment_count + ' bình luận</span>');
    if (u.message_count) pills.push('<span class="admin-pill">' + u.message_count + ' tin nhắn</span>');
    return '<li class="admin-user">' +
      '<div class="admin-user-top">' +
        avatarFlagHtml(u.display_name, u.avatar_url, u.id, 'admin-user-avatar', u.avatar_url ? null : u.avatar_hue, c) +
        '<div class="admin-user-main">' +
          '<p class="admin-user-name"><span>' + escapeHtml(u.display_name || 'Người đọc') + '</span>' +
            (u.is_admin ? '<span class="admin-user-tag">Quản trị</span>' : '') +
            (u._new ? '<span class="admin-user-tag admin-user-tag-new">Mới</span>' : '') + '</p>' +
          '<p class="admin-user-contact">' + escapeHtml(adminUserContact(u)) + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="admin-user-meta">' +
        '<span class="admin-pill admin-pill-provider">' + escapeHtml(adminUserProvider(u)) + '</span>' +
        (c ? '<span class="admin-pill">' + flagHtml(c, 'admin-pill-flag') + escapeHtml(countryName(c)) + '</span>' : '') +
        pills.join('') +
      '</div>' +
      '<div class="admin-user-dates">' +
        '<span>Tham gia ' + escapeHtml(relTime(u.created_at)) + '</span>' +
        '<span>' + (u.last_sign_in_at ? 'Đăng nhập ' + escapeHtml(relTime(u.last_sign_in_at)) : 'Chưa đăng nhập') + '</span>' +
      '</div>' +
    '</li>';
  }

  var _adminUserFilter = 'all';     // all | new | google | email | phone | country:XX
  var WEEK_MS = 7 * 24 * 3600 * 1000;

  function adminUserMatchesFilter(u, f) {
    if (f === 'all') return true;
    if (f === 'new') return Date.now() - Date.parse(u.created_at) < WEEK_MS;
    if (f.indexOf('country:') === 0) return countryOf(u.id) === f.slice(8);
    var p = adminUserProvider(u);
    return (f === 'google' && p === 'Google') || (f === 'email' && p === 'Email') || (f === 'phone' && p === 'Số điện thoại');
  }

  // Stat tiles + filter chips above the list (re-drawn with the list).
  function renderAdminUserSummary() {
    var stats = document.getElementById('adminUserStats');
    var chips = document.getElementById('adminUserChips');
    if (!stats || !chips) return;
    var now = Date.now();
    var newN = 0, activeN = 0, byCountry = {};
    _adminUsers.forEach(function (u) {
      if (now - Date.parse(u.created_at) < WEEK_MS) newN++;
      if (u.last_sign_in_at && now - Date.parse(u.last_sign_in_at) < WEEK_MS) activeN++;
      var c = countryOf(u.id);
      if (c) byCountry[c] = (byCountry[c] || 0) + 1;
    });
    var codes = Object.keys(byCountry).sort(function (a, b) { return byCountry[b] - byCountry[a]; });
    function tile(label, n, sub) {
      return '<div class="admin-stat"><span class="admin-stat-n">' + n.toLocaleString('vi-VN') + '</span>' +
        '<span class="admin-stat-label">' + label + '</span>' + (sub ? '<span class="admin-stat-sub">' + sub + '</span>' : '') + '</div>';
    }
    stats.innerHTML =
      tile('Người dùng', _adminUsers.length) +
      tile('Mới (7 ngày)', newN) +
      tile('Hoạt động (7 ngày)', activeN) +
      tile('Quốc gia', codes.length, codes.slice(0, 5).map(function (c) { return flagHtml(c, 'admin-stat-flag'); }).join(''));
    function chip(key, label) {
      return '<button type="button" class="admin-chip' + (_adminUserFilter === key ? ' is-active' : '') +
        '" data-user-filter="' + escapeAttr(key) + '">' + label + '</button>';
    }
    chips.innerHTML =
      chip('all', 'Tất cả') + chip('new', 'Mới') + chip('google', 'Google') + chip('email', 'Email') + chip('phone', 'SĐT') +
      codes.map(function (c) {
        return chip('country:' + c, flagHtml(c, 'admin-chip-flag') + escapeHtml(countryName(c)) +
          ' <span class="admin-chip-n">' + byCountry[c] + '</span>');
      }).join('');
  }

  function renderAdminUserList() {
    var list = document.getElementById('adminUserList');
    if (!list) return;
    renderAdminUserSummary();
    var input = document.getElementById('adminUserSearch');
    var q = input ? input.value.trim().toLowerCase() : '';
    var rows = _adminUsers.filter(function (u) {
      if (!adminUserMatchesFilter(u, _adminUserFilter)) return false;
      if (!q) return true;
      var c = countryOf(u.id);
      return ((u.display_name || '') + ' ' + adminUserContact(u) + ' ' + (c ? countryName(c) : '')).toLowerCase().indexOf(q) !== -1;
    });
    var count = document.getElementById('adminUserCount');
    if (count) count.textContent = rows.length + ' / ' + _adminUsers.length;
    list.innerHTML = rows.length
      ? rows.map(adminUserRow).join('')
      : '<li class="chat-empty">' + ((q || _adminUserFilter !== 'all') ? 'Không tìm thấy ai.' : 'Chưa có người dùng nào.') + '</li>';
  }

  function loadAdminUsers() {
    if (!sb || !authUser || !authUser.isAdmin) return;
    sb.rpc('admin_list_users').then(function (res) {
      if (!readerEl.querySelector('.admin-users')) return;   // navigated away meanwhile
      if (!res || res.error) {
        var list = document.getElementById('adminUserList');
        if (list) list.innerHTML = '<li class="chat-empty">Không tải được danh sách người dùng.</li>';
        return;
      }
      var prevNew = {};
      _adminUsers.forEach(function (u) { if (u._new) prevNew[u.id] = true; });
      _adminUsers = res.data || [];
      _adminUsers.forEach(function (u) { _emailById[u.id] = u.email || ''; });
      _emailsLoaded = true;
      loadCountries(_adminUsers.map(function (u) { return u.id; }), _countries, function () {
        if (readerEl.querySelector('.admin-users')) renderAdminUserList();
      });
      // "Mới" = new since the previous visit; keeps the tag through a
      // re-load while the page stays open.
      _adminUsers.forEach(function (u) { u._new = prevNew[u.id] || isNewAdminUser(u); });
      renderAdminUserList();
      var newest = _adminUsers.reduce(function (max, u) {
        return (!max || Date.parse(u.created_at) > Date.parse(max)) ? u.created_at : max;
      }, null);
      _adminNewUsers = 0;
      setTocBadge('tocAdminUsersItem', 0);
      if (newest && (!_adminUsersSeenAt || Date.parse(newest) > Date.parse(_adminUsersSeenAt))) {
        sb.rpc('admin_mark_users_seen', { p_at: newest }).then(function (r) {
          if (r && !r.error) _adminUsersSeenAt = newest;
        });
      }
    });
  }

  function renderAdminUsers() {
    if (!authUser || !authUser.isAdmin) return;
    _adminUsers = [];
    readerEl.removeAttribute('data-chapter-id');
    updateFloatNav(-1);
    setChapterBar(-1);
    readerEl.innerHTML =
      '<article class="chapter admin-users">' +
        '<p class="chapter-kicker">Quản trị</p>' +
        '<h2 class="chapter-title">Người dùng</h2>' +
        '<hr class="chapter-lead-rule">' +
        '<div class="admin-stats" id="adminUserStats"></div>' +
        '<div class="admin-users-bar">' +
          '<input type="search" id="adminUserSearch" class="admin-users-search" placeholder="Tìm theo tên, email, số điện thoại, quốc gia..." autocomplete="off">' +
          '<span class="admin-users-count" id="adminUserCount"></span>' +
        '</div>' +
        '<div class="admin-chips" id="adminUserChips" role="group" aria-label="Lọc người dùng"></div>' +
        '<ul class="admin-user-list" id="adminUserList"><li class="chat-empty">Đang tải...</li></ul>' +
      '</article>';
    _adminUserFilter = 'all';
    document.getElementById('adminUserSearch').addEventListener('input', renderAdminUserList);
    document.getElementById('adminUserChips').addEventListener('click', function (ev) {
      var b = ev.target.closest && ev.target.closest('[data-user-filter]');
      if (!b) return;
      _adminUserFilter = b.getAttribute('data-user-filter');
      renderAdminUserList();
    });
    scrollReaderToTop();
    updateProgress();
    Array.prototype.forEach.call(tocEl.querySelectorAll('.toc-item'), function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-action') === 'admin-users');
    });
    resetChatFabPos();
    loadAdminUsers();
    saveLastChapter(ADMIN_USERS_ROUTE);
    history.replaceState({ chapterId: ADMIN_USERS_ROUTE }, '', '#' + ADMIN_USERS_ROUTE);
  }

  // ---- saved chapters + quotes ("Đã lưu") ---------------------------------
  //
  // A signed-in reader can save a whole chapter (bookmark button under the
  // title) or a quote (select text in a chapter → a floating "Lưu trích dẫn"
  // button). Rows live in public.saved_items (comments-setup.sql), private
  // to each reader by RLS. They're listed on the "Đã lưu" page (route
  // #saved, sidebar entry above chapter 1). Signed-out readers who press
  // either button get the sign-in modal.

  var SAVED_ROUTE = 'saved';
  var QUOTE_MAX = 2000;
  var _savedItems = [];     // newest first: { id, kind, chapter_id, quote, created_at }
  var _savedKey = null;     // user id the list was loaded for
  var _lastReadChapterId = null;   // chapter shown before "Đã lưu" (its back tab returns here)

  function chapterIndexById(id) {
    return chapters.findIndex(function (c) { return c.id === id; });
  }
  function chapterLabel(id) {
    var i = chapterIndexById(id);
    return i === -1 ? '' : 'Chương ' + String(i + 1).padStart(2, '0') + ' · ' + chapters[i].title;
  }
  function savedChapterRow(chapterId) {
    for (var i = 0; i < _savedItems.length; i++) {
      if (_savedItems[i].kind === 'chapter' && _savedItems[i].chapter_id === chapterId) return _savedItems[i];
    }
    return null;
  }

  function showToast(msg) {
    var t = document.getElementById('nklttToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'nklttToast';
      t.className = 'toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  function loadSaved() {
    if (!sb || !authUser) return;
    var forId = authUser.id;
    sb.from('saved_items').select('id, kind, chapter_id, quote, created_at')
      .order('created_at', { ascending: false })
      .then(function (res) {
        if (!authUser || authUser.id !== forId) return;
        _savedItems = (res && !res.error && res.data) || [];
        syncSaveChapterBtn();
        if (readerEl.querySelector('.saved-page')) renderSavedList();
      });
  }

  // Called from refresh(): reload only when who's signed in changes.
  function onSavedAuthChange() {
    var key = authUser ? authUser.id : null;
    updateSavedTocItem();
    if (key === _savedKey) return;
    _savedKey = key;
    _savedItems = [];
    syncSaveChapterBtn();
    if (key) loadSaved();
  }

  // A small reminder (not the sign-in form) for guests who press a save
  // button: the message, then "Đăng nhập / Đăng ký" (opens the sign-in
  // modal) or "Để sau". Same centred card on every screen size; closes on
  // the backdrop, × or Escape.
  function showSigninReminder(text) {
    var m = document.getElementById('signinReminder');
    if (!m) {
      m = document.createElement('div');
      m.id = 'signinReminder';
      m.className = 'reminder-modal';
      m.innerHTML =
        '<div class="reminder-backdrop" data-action="reminder-close"></div>' +
        '<div class="reminder-card" role="alertdialog" aria-modal="true" aria-labelledby="reminderTitle" aria-describedby="reminderText">' +
          '<button type="button" class="reminder-x" data-action="reminder-close" aria-label="Đóng">' + CLOSE_X_SVG + '</button>' +
          '<span class="reminder-icon" aria-hidden="true">' + BOOKMARK_SVG + '</span>' +
          '<h3 class="reminder-title" id="reminderTitle">Cần đăng nhập</h3>' +
          '<p class="reminder-text" id="reminderText"></p>' +
          '<div class="reminder-btns">' +
            '<button type="button" class="reminder-later" data-action="reminder-close">Để sau</button>' +
            '<button type="button" class="auth-btn" data-action="reminder-signin">Đăng nhập / Đăng ký</button>' +
          '</div>' +
        '</div>';
      (document.querySelector('.app') || document.body).appendChild(m);
    }
    document.getElementById('reminderText').textContent = text;
    m.hidden = false;
    m.querySelector('[data-action="reminder-signin"]').focus();
  }

  function closeSigninReminder() {
    var m = document.getElementById('signinReminder');
    if (m) m.hidden = true;
  }

  // -- chapter bookmark --

  function saveChapterBtnHtml() {
    return '<button type="button" class="save-chapter-btn" id="saveChapterBtn" data-action="save-chapter" ' +
      'aria-pressed="false" title="Lưu chương">' + BOOKMARK_SVG +
      '<span class="save-chapter-label">Lưu chương</span></button>';
  }

  function syncSaveChapterBtn() {
    var btn = document.getElementById('saveChapterBtn');
    if (!btn) return;
    var saved = !!(authUser && savedChapterRow(readerEl.getAttribute('data-chapter-id')));
    btn.classList.toggle('is-saved', saved);
    btn.setAttribute('aria-pressed', saved ? 'true' : 'false');
    btn.title = saved ? 'Bỏ lưu chương' : 'Lưu chương';
    btn.querySelector('.save-chapter-label').textContent = saved ? 'Đã lưu' : 'Lưu chương';
  }

  function onSaveChapterToggle(btn) {
    if (!authUser) { showSigninReminder('Bạn cần đăng nhập hoặc đăng ký để lưu chương này.'); return; }
    var chapterId = readerEl.getAttribute('data-chapter-id');
    if (!chapterId || btn.disabled) return;
    var row = savedChapterRow(chapterId);
    btn.disabled = true;
    if (row) {
      sb.from('saved_items').delete().eq('id', row.id).then(function (res) {
        btn.disabled = false;
        if (res.error) { showToast('Không bỏ lưu được, thử lại nhé.'); return; }
        _savedItems = _savedItems.filter(function (r) { return r.id !== row.id; });
        syncSaveChapterBtn();
        showToast('Đã bỏ lưu chương');
      });
    } else {
      sb.from('saved_items').insert({ kind: 'chapter', chapter_id: chapterId })
        .select('id, kind, chapter_id, quote, created_at').single()
        .then(function (res) {
          btn.disabled = false;
          if (res.error || !res.data) { showToast('Không lưu được, thử lại nhé.'); return; }
          _savedItems.unshift(res.data);
          syncSaveChapterBtn();
          showToast('Đã lưu chương');
        });
    }
  }

  // -- quote from a text selection --
  // The button floats above the selection (below it on touch screens, where
  // the phone's own copy/share menu sits above). mousedown is cancelled so
  // pressing it doesn't clear the selection first.

  function ensureQuotePop() {
    var pop = document.getElementById('quotePop');
    if (pop) return pop;
    pop = document.createElement('button');
    pop.type = 'button';
    pop.id = 'quotePop';
    pop.className = 'quote-pop';
    pop.hidden = true;
    pop.innerHTML = QUOTE_SVG + '<span>Lưu trích dẫn</span>';
    pop.addEventListener('mousedown', function (e) { e.preventDefault(); });
    pop.addEventListener('click', onQuoteSave);
    document.body.appendChild(pop);
    return pop;
  }

  function hideQuotePop() {
    var pop = document.getElementById('quotePop');
    if (pop) pop.hidden = true;
  }

  // The current selection, if it's diary text (body, note, signature) of
  // the chapter on screen — not comments, buttons or inputs.
  function currentQuote() {
    var chapterId = readerEl.getAttribute('data-chapter-id');
    var sel = window.getSelection && window.getSelection();
    if (!chapterId || !sel || sel.isCollapsed || !sel.rangeCount) return null;
    var range = sel.getRangeAt(0);
    var node = range.commonAncestorContainer;
    var el = node.nodeType === 1 ? node : node.parentElement;
    if (!el || !readerEl.contains(el) || !el.closest('.chapter')) return null;
    if (el.closest('.engagement, .chapter-nav, .chapter-lead, .chapter-kicker, .chapter-title, textarea, input, button')) return null;
    var text = sel.toString().replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim();
    if (text.length < 3) return null;
    return { text: text, rect: range.getBoundingClientRect(), chapterId: chapterId };
  }

  function updateQuotePop() {
    var q = currentQuote();
    if (!q || (!q.rect.width && !q.rect.height)) { hideQuotePop(); return; }
    var pop = ensureQuotePop();
    pop.hidden = false;
    var w = pop.offsetWidth, h = pop.offsetHeight, m = 8;
    var touch = window.matchMedia('(pointer: coarse)').matches;
    var top = touch ? q.rect.bottom + 14 : q.rect.top - h - 10;
    if (top < m) top = q.rect.bottom + 10;
    top = Math.min(top, window.innerHeight - h - m);
    var left = q.rect.left + q.rect.width / 2 - w / 2;
    left = Math.max(m, Math.min(left, window.innerWidth - w - m));
    pop.style.top = Math.round(top) + 'px';
    pop.style.left = Math.round(left) + 'px';
  }

  function onQuoteSave() {
    var q = currentQuote();
    if (!q) { hideQuotePop(); return; }
    if (!authUser) { hideQuotePop(); showSigninReminder('Bạn cần đăng nhập hoặc đăng ký để lưu trích dẫn này.'); return; }
    if (q.text.length > QUOTE_MAX) { showToast('Đoạn chọn quá dài (tối đa ' + QUOTE_MAX + ' ký tự).'); return; }
    var dup = _savedItems.some(function (r) {
      return r.kind === 'quote' && r.chapter_id === q.chapterId && r.quote === q.text;
    });
    if (dup) { showToast('Trích dẫn này đã được lưu'); hideQuotePop(); return; }
    var pop = ensureQuotePop();
    pop.disabled = true;
    sb.from('saved_items').insert({ kind: 'quote', chapter_id: q.chapterId, quote: q.text })
      .select('id, kind, chapter_id, quote, created_at').single()
      .then(function (res) {
        pop.disabled = false;
        if (res.error || !res.data) { showToast('Không lưu được, thử lại nhé.'); return; }
        _savedItems.unshift(res.data);
        var sel = window.getSelection && window.getSelection();
        if (sel) sel.removeAllRanges();
        hideQuotePop();
        showToast('Đã lưu trích dẫn');
      });
  }

  // -- "Đã lưu" sidebar entry + page --

  function updateSavedTocItem() {
    var toc = document.getElementById('toc');
    if (!toc) return;
    var existing = document.getElementById('tocSavedItem');
    if (!authUser) { if (existing) existing.remove(); return; }
    if (existing) return;
    var li = document.createElement('li');
    li.id = 'tocSavedItem';
    li.innerHTML =
      '<button type="button" class="toc-item toc-admin-item" data-action="saved-page" aria-label="Đã lưu">' +
        '<span class="toc-num toc-num-icon" aria-hidden="true">' + BOOKMARK_SVG + '</span>' +
        '<span class="toc-text"><span class="toc-title">Đã lưu</span></span>' +
      '</button>';
    // just above chapter 1, below the admin entries if any
    var first = toc.querySelector('.toc-item[data-index]');
    toc.insertBefore(li, first ? first.closest('li') : toc.firstChild);
    syncSavedTocBg();
  }

  // The pinned "Đã lưu" entry paints the sidebar's own gradient, sized to
  // the sidebar and shifted by the entry's offset in it, so it lines up
  // exactly with the sidebar behind it (styles.css: #tocSavedItem).
  function syncSavedTocBg() {
    var li = document.getElementById('tocSavedItem');
    if (!li || !sidebarEl) return;
    var sb = sidebarEl.getBoundingClientRect();
    var r = li.getBoundingClientRect();
    li.style.setProperty('--sb-w', sidebarEl.clientWidth + 'px');
    li.style.setProperty('--sb-h', sidebarEl.clientHeight + 'px');
    li.style.setProperty('--sb-x', (sb.left + sidebarEl.clientLeft - r.left) + 'px');
    li.style.setProperty('--sb-y', (sb.top + sidebarEl.clientTop - r.top) + 'px');
  }
  var _savedBgRaf = 0;
  function queueSavedTocBg() {
    if (_savedBgRaf) return;
    _savedBgRaf = requestAnimationFrame(function () { _savedBgRaf = 0; syncSavedTocBg(); });
  }
  if (tocEl) tocEl.addEventListener('scroll', queueSavedTocBg, { passive: true });
  window.addEventListener('resize', queueSavedTocBg);
  window.addEventListener('load', queueSavedTocBg);

  function renderSaved() {
    if (!authUser) return;
    readerEl.removeAttribute('data-chapter-id');
    updateFloatNav(-1);
    setChapterBar(-1);
    hideQuotePop();
    readerEl.innerHTML =
      '<article class="chapter saved-page">' +
        '<p class="chapter-kicker">Của bạn</p>' +
        '<h2 class="chapter-title">Đã lưu</h2>' +
        // same A− 100% A+ control as a chapter: it shares --text-scale, so it
        // resizes the saved quotes here and the diary text in chapters alike
        '<div class="chapter-lead"><hr class="chapter-lead-rule">' +
          '<div class="chapter-tools">' + textSizeControlHtml() + '</div></div>' +
        '<div id="savedList"></div>' +
        // mobile only (styles.css): "‹" glass tab, middle of the right edge, back to
        // the chapter that was open before this page
        '<button type="button" class="saved-back" data-action="saved-back" ' +
          'aria-label="Quay lại chương đang đọc" title="Quay lại chương đang đọc">' +
          '<svg viewBox="0 0 24 24" width="1.25em" height="1.25em" fill="none" stroke="currentColor" ' +
          'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>' +
        '</button>' +
      '</article>';
    renderSavedList();
    applyTextScale();   // fill in the new control's % and disabled states
    scrollReaderToTop();
    updateProgress();
    Array.prototype.forEach.call(tocEl.querySelectorAll('.toc-item'), function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-action') === 'saved-page');
    });
    resetChatFabPos();
    loadSaved();
    saveLastChapter(SAVED_ROUTE);
    history.replaceState({ chapterId: SAVED_ROUTE }, '', '#' + SAVED_ROUTE);
  }

  function renderSavedList() {
    var box = document.getElementById('savedList');
    if (!box) return;
    var chs = _savedItems.filter(function (r) { return r.kind === 'chapter' && chapterIndexById(r.chapter_id) !== -1; });
    var qs = _savedItems.filter(function (r) { return r.kind === 'quote' && chapterIndexById(r.chapter_id) !== -1; });
    var delBtn = function (r) {
      return '<button type="button" class="saved-del" data-action="saved-del" data-id="' + escapeAttr(r.id) +
        '" aria-label="Bỏ lưu" title="Bỏ lưu">&times;</button>';
    };
    var html = '<section class="saved-section"><h3 class="saved-heading">' + BOOKMARK_SVG +
      'Chương đã lưu <span class="saved-count">' + chs.length + '</span></h3>';
    html += chs.length ? '<ul class="saved-chapters">' + chs.map(function (r) {
      var i = chapterIndexById(r.chapter_id);
      return '<li class="saved-card saved-chapter">' +
          '<button type="button" class="saved-open" data-action="saved-open" data-chapter="' + escapeAttr(r.chapter_id) + '">' +
            '<span class="saved-ch-num">' + String(i + 1).padStart(2, '0') + '</span>' +
            '<span class="saved-ch-title">' + escapeHtml(chapters[i].title) + '</span>' +
            '<span class="saved-time">' + escapeHtml(relTime(r.created_at)) + '</span>' +
          '</button>' + delBtn(r) +
        '</li>';
    }).join('') + '</ul>'
      : '<p class="saved-empty">Chưa có chương nào. Bấm <strong>Lưu chương</strong> dưới tiêu đề một chương để lưu.</p>';
    html += '</section>';

    html += '<section class="saved-section"><h3 class="saved-heading">' + QUOTE_SVG +
      'Trích dẫn đã lưu <span class="saved-count">' + qs.length + '</span></h3>';
    html += qs.length ? '<ul class="saved-quotes">' + qs.map(function (r) {
      return '<li class="saved-card saved-quote">' +
          '<blockquote class="saved-quote-text">' + escapeHtml(r.quote).replace(/\n/g, '<br>') + '</blockquote>' +
          '<div class="saved-quote-foot">' +
            '<button type="button" class="saved-quote-src" data-action="saved-open" data-chapter="' + escapeAttr(r.chapter_id) +
              '" data-quote="' + escapeAttr(r.quote.slice(0, 60)) + '">' + escapeHtml(chapterLabel(r.chapter_id)) + '</button>' +
            '<span class="saved-time">' + escapeHtml(relTime(r.created_at)) + '</span>' +
          '</div>' + delBtn(r) +
        '</li>';
    }).join('') + '</ul>'
      : '<p class="saved-empty">Chưa có trích dẫn nào. Bôi đen một đoạn trong chương rồi bấm <strong>Lưu trích dẫn</strong>.</p>';
    html += '</section>';
    box.innerHTML = html;
  }

  // Opens the chapter; for a quote, scrolls to the paragraph containing it
  // and briefly highlights that paragraph.
  function onSavedOpen(a) {
    var id = a.getAttribute('data-chapter');
    renderChapter(id, { push: true });
    var snippet = (a.getAttribute('data-quote') || '').split('\n')[0].trim();
    if (!snippet) return;
    var ps = readerEl.querySelectorAll('.entry-body p, .note p, .signature');
    for (var i = 0; i < ps.length; i++) {
      if (ps[i].textContent.indexOf(snippet) !== -1) {
        var p = ps[i];
        p.scrollIntoView({ block: 'center' });
        p.classList.add('quote-flash');
        setTimeout(function () { p.classList.remove('quote-flash'); }, 2600);
        break;
      }
    }
  }

  function onSavedDelete(a) {
    var id = a.getAttribute('data-id');
    a.disabled = true;
    sb.from('saved_items').delete().eq('id', id).then(function (res) {
      if (res.error) { a.disabled = false; showToast('Không bỏ lưu được, thử lại nhé.'); return; }
      _savedItems = _savedItems.filter(function (r) { return r.id !== id; });
      renderSavedList();
    });
  }

  // ---- sign-in modal: Google + email/phone, both usable right away --------
  //
  // A centered popup with both sign-in paths shown at once, opened from the
  // sidebar masthead button, the chat widget's guest state, and the "Đăng nhập"
  // button in the guest gate above the comments (renderGuestGate). Its fields
  // use signin* ids of their own.

  // Small line icons inside the sign-in fields.
  var ICON_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>';
  var ICON_USER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>';
  var ICON_LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  var ICON_EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  var ICON_CARET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  function ensureSigninModal() {
    if (document.getElementById('signinModal')) return;
    var host = document.querySelector('.app') || document.body;
    var m = document.createElement('div');
    m.className = 'signin-modal';
    m.id = 'signinModal';
    m.hidden = true;
    m.innerHTML =
      '<div class="signin-modal-backdrop" data-action="signin-close"></div>' +
      '<div class="signin-modal-card" role="dialog" aria-modal="true" aria-label="Đăng nhập / Đăng ký">' +
        '<button type="button" class="signin-modal-close" data-action="signin-close" aria-label="Đóng">' + CLOSE_X_SVG + '</button>' +
        '<div class="signin-hero">' +
          '<img class="signin-logo" src="assets/logo_v2.svg" alt="" />' +
          '<h3 class="signin-modal-title" id="signinTitle">Xin chào</h3>' +
          '<p class="signin-sub" id="signinSub">Đăng nhập để bình luận, nhắn tin và lưu những đoạn nội dung bạn tâm đắc.</p>' +
        '</div>' +
        '<form class="auth-email-form" id="signinEmailForm" data-mode="signin" data-idtype="phone" autocomplete="on" novalidate>' +
          '<div class="auth-tabs" role="tablist">' +
            '<button type="button" class="auth-tab is-active" data-action="signin-tab" data-mode="signin">Đăng nhập</button>' +
            '<button type="button" class="auth-tab" data-action="signin-tab" data-mode="signup">Đăng ký</button>' +
          '</div>' +
          '<button type="button" class="auth-btn auth-ghost auth-google" data-action="signin-google">' +
            GOOGLE_G_SVG + '<span>Tiếp tục với Google</span></button>' +
          '<div class="signin-modal-divider"><span>hoặc dùng</span></div>' +
          '<div class="auth-idtype">' +
            '<button type="button" class="auth-idbtn is-active" data-action="signin-idtype" data-type="phone">Số điện thoại</button>' +
            '<button type="button" class="auth-idbtn" data-action="signin-idtype" data-type="email">Email</button>' +
          '</div>' +
          '<label class="auth-field" id="signinNameField" hidden>' + ICON_USER +
            '<input type="text" id="signinName" class="auth-input" maxlength="' + NAME_MAX + '" placeholder="Tên hiển thị" autocomplete="nickname" /></label>' +
          '<label class="auth-field" id="signinEmailField" hidden>' + ICON_MAIL +
            '<input type="email" id="signinIdentity" class="auth-input" placeholder="Email" autocomplete="email" inputmode="email" /></label>' +
          // phone: country-code picker + national number, side by side
          '<div class="phone-row" id="signinPhoneRow">' +
            '<button type="button" class="phone-cc" id="phoneCcBtn" data-action="phone-cc-toggle" ' +
              'aria-haspopup="listbox" aria-expanded="false" aria-label="Mã quốc gia"></button>' +
            '<input type="tel" id="signinPhone" class="auth-input phone-num" placeholder="912 345 678" ' +
              'inputmode="tel" autocomplete="tel-national" />' +
            '<div class="phone-cc-pop" id="phoneCcPop" hidden>' +
              '<input type="search" id="phoneCcSearch" class="phone-cc-search" placeholder="Tìm quốc gia hoặc mã, vd: Úc, +61" autocomplete="off" />' +
              '<ul class="phone-cc-list" id="phoneCcList" role="listbox" aria-label="Quốc gia"></ul>' +
            '</div>' +
          '</div>' +
          '<label class="auth-field auth-field-pass">' + ICON_LOCK +
            '<input type="password" id="signinPassword" class="auth-input" placeholder="Mật khẩu (tối thiểu 6 ký tự)" minlength="6" autocomplete="current-password" />' +
            '<button type="button" class="auth-eye" data-action="signin-eye" aria-label="Hiện mật khẩu" aria-pressed="false">' + ICON_EYE + '</button>' +
          '</label>' +
          '<span class="auth-msg" id="signinMsg" role="status"></span>' +
          '<button type="submit" class="auth-btn auth-submit" id="signinSubmit">Đăng nhập</button>' +
        '</form>' +
        '<p class="signin-legal">Khi tiếp tục, bạn đồng ý với <a href="/terms.html">Điều khoản</a> và ' +
          '<a href="/privacy.html">Chính sách quyền riêng tư</a>.</p>' +
      '</div>';
    host.appendChild(m);
    defeatAutofillFont(m);
    setPhoneCountry(_phoneIso);
    var search = m.querySelector('#phoneCcSearch');
    search.addEventListener('input', renderPhoneCcList);
    search.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') { ev.stopPropagation(); closePhoneCcPop(true); }
      else if (ev.key === 'Enter') {
        ev.preventDefault();
        var first = m.querySelector('.phone-cc-opt');
        if (first) { setPhoneCountry(first.getAttribute('data-iso')); closePhoneCcPop(true); }
      } else if (ev.key === 'ArrowDown') {
        ev.preventDefault();
        var f = m.querySelector('.phone-cc-opt');
        if (f) f.focus();
      }
    });
    m.querySelector('#phoneCcList').addEventListener('keydown', function (ev) {
      var o = ev.target.closest && ev.target.closest('.phone-cc-opt');
      if (!o) return;
      if (ev.key === 'ArrowDown' && o.nextElementSibling) { ev.preventDefault(); o.nextElementSibling.focus(); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); (o.previousElementSibling || search).focus(); }
      else if (ev.key === 'Escape') { ev.stopPropagation(); closePhoneCcPop(true); }
    });
    // The browser's password manager fills a saved email into the first
    // visible box (the phone number); move it to the Email tab instead.
    m.querySelector('#signinPhone').addEventListener('change', rescueEmailFromPhone);
    // A full number pasted or typed with "+" picks the country from its code.
    m.querySelector('#signinPhone').addEventListener('input', function (ev) {
      if (rescueEmailFromPhone()) return;
      var v = ev.target.value;
      if (v.charAt(0) !== '+') return;
      var d = v.replace(/\D/g, '');
      for (var n = 3; n >= 1; n--) {
        var iso = CALLING_CODES[d.slice(0, n)];
        if (iso && d.length > n) {
          setPhoneCountry(iso);
          ev.target.value = d.slice(n);
          return;
        }
      }
    });
  }

  // ---- phone country-code picker (sign-in modal) ---------------------------
  var _phoneIso = 'VN';            // default: Việt Nam (+84)
  function phoneCodeOf(iso) {
    for (var i = 0; i < PHONE_COUNTRIES.length; i++) if (PHONE_COUNTRIES[i].iso === iso) return PHONE_COUNTRIES[i].code;
    return '84';
  }
  function setPhoneCountry(iso) {
    _phoneIso = iso;
    var btn = document.getElementById('phoneCcBtn');
    if (btn) {
      btn.innerHTML = flagHtml(iso, 'phone-cc-flag') + '<span class="phone-cc-code">+' + phoneCodeOf(iso) + '</span>' + ICON_CARET;
      btn.title = countryName(iso);
    }
  }
  function foldVi(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  }
  var _enNames = null;
  function countryNameEn(iso) {
    try { if (!_enNames) _enNames = new Intl.DisplayNames(['en'], { type: 'region' }); return _enNames.of(iso) || ''; }
    catch (e) { return ''; }
  }
  // Everyday Vietnamese names that differ from Intl's (search only).
  var CC_ALIASES = { AU: 'úc', US: 'mỹ hoa kỳ', GB: 'anh', KR: 'hàn quốc', JP: 'nhật bản', CN: 'trung quốc',
    TW: 'đài loan', RU: 'nga', FR: 'pháp', DE: 'đức', NZ: 'new zealand tân tây lan', KH: 'campuchia cam bốt' };
  function ccRank(c, q) {
    if (/^\d+$/.test(q)) return c.code === q ? 0 : 1;
    var hay = [foldVi(c.name), foldVi(countryNameEn(c.iso)), foldVi(CC_ALIASES[c.iso] || '')];
    if (c.iso.toLowerCase() === q) return 0;
    for (var i = 0; i < hay.length; i++) if (hay[i].indexOf(q) === 0) return 1;
    for (i = 0; i < hay.length; i++) if ((' ' + hay[i]).indexOf(' ' + q) !== -1) return 2;
    for (i = 0; i < hay.length; i++) if (hay[i].indexOf(q) !== -1) return 3;
    return -1;
  }
  function renderPhoneCcList() {
    var list = document.getElementById('phoneCcList');
    if (!list) return;
    var raw = (document.getElementById('phoneCcSearch') || {}).value || '';
    var q = foldVi(raw.trim()).replace(/^\+/, '');
    var rows = PHONE_COUNTRIES.map(function (c) {
      return { iso: c.iso, code: c.code, name: countryName(c.iso) };
    }).filter(function (c) {
      if (!q) return true;
      if (/^\d+$/.test(q)) return c.code.indexOf(q) === 0;
      c._r = ccRank(c, q);
      return c._r !== -1;
    });
    if (/^\d+$/.test(q)) rows.forEach(function (c) { c._r = ccRank(c, q); });
    rows.sort(function (a, b) {
      // no search: the selected one first; searching: best match first; then by name
      if (!q) {
        if (a.iso === _phoneIso) return -1;
        if (b.iso === _phoneIso) return 1;
      } else if (a._r !== b._r) return a._r - b._r;
      // within one code, keep the main country (+1 → US) above the others
      if (/^\d+$/.test(q) && a.code === b.code) {
        if (CALLING_CODES[a.code] === a.iso) return -1;
        if (CALLING_CODES[b.code] === b.iso) return 1;
      }
      return a.name.localeCompare(b.name, 'vi');
    });
    list.innerHTML = rows.length ? rows.map(function (c) {
      return '<li class="phone-cc-opt' + (c.iso === _phoneIso ? ' is-active' : '') + '" role="option" tabindex="-1" ' +
        'aria-selected="' + (c.iso === _phoneIso) + '" data-action="phone-cc-pick" data-iso="' + c.iso + '">' +
        flagHtml(c.iso, 'phone-cc-flag') + '<span class="phone-cc-name">' + escapeHtml(c.name) + '</span>' +
        '<span class="phone-cc-dial">+' + c.code + '</span></li>';
    }).join('') : '<li class="phone-cc-empty">Không tìm thấy quốc gia.</li>';
  }
  function openPhoneCcPop() {
    var pop = document.getElementById('phoneCcPop');
    if (!pop) return;
    var search = document.getElementById('phoneCcSearch');
    search.value = '';
    renderPhoneCcList();
    pop.hidden = false;
    document.getElementById('phoneCcBtn').setAttribute('aria-expanded', 'true');
    search.focus();
  }
  function closePhoneCcPop(refocus) {
    var pop = document.getElementById('phoneCcPop');
    if (!pop || pop.hidden) return;
    pop.hidden = true;
    var btn = document.getElementById('phoneCcBtn');
    btn.setAttribute('aria-expanded', 'false');
    if (refocus) { var n = document.getElementById('signinPhone'); if (n) n.focus(); }
  }
  function togglePhoneCcPop() {
    var pop = document.getElementById('phoneCcPop');
    if (pop && pop.hidden) openPhoneCcPop(); else closePhoneCcPop(false);
  }
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    var o = ev.target && ev.target.closest && ev.target.closest('.phone-cc-opt');
    if (!o) return;
    ev.preventDefault();
    setPhoneCountry(o.getAttribute('data-iso'));
    closePhoneCcPop(true);
  });

  function openSigninModal() {
    if (authUser) return;
    ensureSigninModal();
    var msg = document.getElementById('signinMsg');
    if (msg) msg.textContent = '';
    document.getElementById('signinModal').hidden = false;
    // Start on the method used last time (phone if never signed in here).
    var form = document.getElementById('signinEmailForm');
    var last = null;
    try { last = localStorage.getItem(SIGNIN_IDTYPE_KEY); } catch (e) {}
    if (form && (last === 'email' || last === 'phone') && form.getAttribute('data-idtype') !== last) {
      switchSigninIdType(last, true);
    }
    // Autofill may land without an input event; check again once it has run.
    setTimeout(rescueEmailFromPhone, 300);
    setTimeout(rescueEmailFromPhone, 1200);
  }

  var SIGNIN_IDTYPE_KEY = 'nkltt-signin-idtype';

  // An email (anything with "@" or letters) in the phone box → move it to
  // the email box and switch to the Email tab. Returns true if it moved.
  function rescueEmailFromPhone() {
    var ph = document.getElementById('signinPhone');
    var em = document.getElementById('signinIdentity');
    if (!ph || !em) return false;
    var v = ph.value.trim();
    if (!/@|[a-z]/i.test(v)) return false;
    ph.value = '';
    if (!em.value) em.value = v;
    var form = document.getElementById('signinEmailForm');
    if (form && form.getAttribute('data-idtype') !== 'email') switchSigninIdType('email', true);
    return true;
  }

  function closeSigninModal() {
    var m = document.getElementById('signinModal');
    if (m) m.hidden = true;
    closePhoneCcPop(false);
  }

  function switchSigninTab(mode) {
    var form = document.getElementById('signinEmailForm');
    if (!form) return;
    form.setAttribute('data-mode', mode);
    Array.prototype.forEach.call(form.querySelectorAll('.auth-tab'), function (t) {
      t.classList.toggle('is-active', t.getAttribute('data-mode') === mode);
    });
    var nameField = form.querySelector('#signinNameField');
    if (nameField) nameField.hidden = (mode !== 'signup');
    var title = document.getElementById('signinTitle');
    if (title) title.textContent = (mode === 'signup') ? 'Tạo tài khoản' : 'Xin chào';
    var sub = document.getElementById('signinSub');
    if (sub) sub.textContent = (mode === 'signup')
      ? 'Miễn phí, chỉ mất vài giây. Bạn vẫn đọc được toàn bộ nhật ký mà không cần tài khoản.'
      : 'Đăng nhập để bình luận, nhắn tin và lưu những đoạn nội dung bạn tâm đắc.';
    var pass = form.querySelector('#signinPassword');
    if (pass) pass.setAttribute('autocomplete', mode === 'signup' ? 'new-password' : 'current-password');
    var submit = form.querySelector('#signinSubmit');
    if (submit) submit.textContent = (mode === 'signup') ? 'Đăng ký' : 'Đăng nhập';
    var msgEl = form.querySelector('#signinMsg');
    if (msgEl) msgEl.textContent = '';
  }

  function switchSigninIdType(type, noFocus) {
    var form = document.getElementById('signinEmailForm');
    if (!form) return;
    var phone = (type === 'phone');
    form.setAttribute('data-idtype', phone ? 'phone' : 'email');
    Array.prototype.forEach.call(form.querySelectorAll('.auth-idbtn'), function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-type') === (phone ? 'phone' : 'email'));
    });
    var emailField = form.querySelector('#signinEmailField');
    var phoneRow = form.querySelector('#signinPhoneRow');
    if (emailField) emailField.hidden = phone;
    if (phoneRow) phoneRow.hidden = !phone;
    closePhoneCcPop(false);
    var focusEl = form.querySelector(phone ? '#signinPhone' : '#signinIdentity');
    if (focusEl && !noFocus) focusEl.focus();
    var m = form.querySelector('#signinMsg');
    if (m) m.textContent = '';
  }

  // Validates the modal's own #signin* fields, runs the Supabase email/phone
  // sign-in or sign-up, and closes the modal on success (onAuthStateChange
  // repaints the rest of the page).
  function onSigninEmailSubmit(form) {
    var mode = form.getAttribute('data-mode') || 'signin';
    var idtype = form.getAttribute('data-idtype') || 'phone';
    var identity = fieldVal(form, '#signinIdentity');
    var phoneRaw = fieldVal(form, '#signinPhone');
    var pass = fieldVal(form, '#signinPassword');
    var name = fieldVal(form, '#signinName');
    var msg = form.querySelector('#signinMsg');
    var submit = form.querySelector('#signinSubmit');

    var email, altEmail = null;
    if (idtype === 'phone') {
      var ph = phoneEmails(phoneCodeOf(_phoneIso), phoneRaw);
      if (!ph) {
        if (msg) msg.textContent = 'Nhập số điện thoại hợp lệ.';
        return;
      }
      email = ph.email;
      altEmail = ph.legacy;
    } else {
      email = identity;
      if (!email) { if (msg) msg.textContent = 'Nhập email của bạn.'; return; }
    }
    if (pass.length < 6) {
      if (msg) msg.textContent = 'Mật khẩu cần tối thiểu 6 ký tự.';
      return;
    }
    if (mode === 'signup' && nameLooksLikeAdmin(name, email)) {
      if (msg) msg.textContent = 'Tên hiển thị không được chứa “Admin”.';
      return;
    }
    if (submit) submit.disabled = true;
    if (msg) msg.textContent = 'Đang xử lý...';
    var p = (mode === 'signup')
      ? sb.auth.signUp({ email: email, password: pass, options: { data: name ? { full_name: name } : {} } })
      : sb.auth.signInWithPassword({ email: email, password: pass }).then(function (res) {
          // Accounts made before the split code/number boxes may have been
          // registered with the 0 kept (+84 0912…) — try that form too.
          if (res.error && altEmail && /invalid login credentials/i.test(res.error.message || '')) {
            return sb.auth.signInWithPassword({ email: altEmail, password: pass });
          }
          return res;
        });
    p.then(function (res) {
      if (submit) submit.disabled = false;
      if (res.error) {
        var t = translateAuthError(res.error.message);
        if (idtype === 'phone') t = t.replace(/^Email/, 'Số điện thoại').replace('Email này', 'Số điện thoại này');
        if (msg) msg.textContent = t;
        return;
      }
      if (res.data && !res.data.session) {
        if (msg) msg.textContent = 'Kiểm tra email để xác nhận tài khoản.';
        return;
      }
      try { localStorage.setItem(SIGNIN_IDTYPE_KEY, idtype); } catch (e) {}
      closeSigninModal();   // signed in — onAuthStateChange repaints everything else
    });
  }

  var PHONE_DOMAIN = 'phone.nkltt';

  // A phone number (with country code, e.g. +61…) → a synthetic email so it
  // rides the existing email/password flow. No SMS. Returns null if invalid.
  function phoneToEmail(raw) {
    var s = (raw || '').replace(/[^\d+]/g, '');
    if (!/^\+\d{6,15}$/.test(s)) return null;
    return 'p' + s.slice(1) + '@' + PHONE_DOMAIN;
  }

  // Country code + the number as typed (spaces, dots, a leading 0 all fine:
  // 0912 345 678 and 912345678 are the same number) → the synthetic email.
  // `legacy` is the same number with the 0 kept, for older accounts.
  function phoneEmails(code, raw) {
    var d = String(raw || '').replace(/\D/g, '');
    if (d.indexOf('00' + code) === 0) d = d.slice(2 + code.length);   // 0084 912…
    d = d.replace(/^0+/, '');
    var email = phoneToEmail('+' + code + d);
    if (!email) return null;
    return { email: email, legacy: phoneToEmail('+' + code + '0' + d) };
  }

  // Chrome renders :-webkit-autofill fields in its own small font and ignores
  // CSS font rules on that pseudo-class. Re-assigning .value the moment autofill
  // fires clears the pseudo-state so the field picks up our font. The CSS side
  // is an .001s animation on :-webkit-autofill named "nkltt-autofill".
  function defeatAutofillFont(root) {
    Array.prototype.forEach.call(root.querySelectorAll('input.auth-input'), function (inp) {
      inp.addEventListener('animationstart', function (e) {
        if (e.animationName !== 'nkltt-autofill') return;
        setTimeout(function () {
          var v = inp.value;
          if (v) { inp.value = ''; inp.value = v; }
        }, 0);
      });
    });
  }

  function renderCompose() {
    var host = document.getElementById('commentCompose');
    if (!host) return;
    if (!authUser) {
      // The "please sign in" line lives above the heading now (renderGuestGate).
      host.innerHTML = '';
      return;
    }
    host.innerHTML =
      '<form class="comment-form" id="commentForm">' +
        '<textarea id="commentBody" class="comment-body" rows="3" maxlength="' + COMMENT_MAX +
          '" placeholder="Viết bình luận của bạn..." required></textarea>' +
        '<div class="comment-form-row">' +
          '<span class="comment-status" id="commentStatus" role="status"></span>' +
          '<button type="submit" class="auth-btn" id="commentSubmit">Gửi bình luận</button>' +
        '</div>' +
      '</form>';
  }

  function indexById(arr) {
    var m = {};
    (arr || []).forEach(function (p) { m[p.id] = p; });
    return m;
  }

  // Fetch profiles for a set of user ids, tolerating a schema that doesn't
  // have the avatar columns yet (falls back to name only). Always calls cb.
  function fetchProfiles(ids, cb) {
    if (!ids || !ids.length) { cb({}); return; }
    sb.from('profiles').select('id, display_name, avatar_url, avatar_hue').in('id', ids).then(function (res) {
      if (res.error) {
        sb.from('profiles').select('id, display_name').in('id', ids).then(function (r2) {
          cb(indexById(r2 && r2.data));
        });
        return;
      }
      cb(indexById(res.data));
    });
  }

  function loadComments(chapterId, token) {
    var list = document.getElementById('commentList');
    if (list) list.innerHTML = '<li class="comment-empty">Đang tải bình luận...</li>';
    sb.from('comments')
      .select('*')
      .eq('chapter_id', chapterId)
      .eq('approved', true)
      .order('created_at', { ascending: true })
      .limit(600)
      .then(function (res) {
        if (token !== engToken) return;
        var list2 = document.getElementById('commentList');
        var titleEl = document.getElementById('commentsTitle');
        if (!list2) return;
        if (res.error) {
          list2.innerHTML = '<li class="comment-empty">Không tải được bình luận.</li>';
          return;
        }
        var rows = res.data || [];
        if (titleEl) setCommentsTitle(titleEl, rows.length);
        if (!rows.length) {
          list2.innerHTML = '<li class="comment-empty">Chưa có bình luận nào. Hãy là người đầu tiên!</li>';
          return;
        }
        var commentIds = rows.map(function (r) { return r.id; });
        fetchCommentReactionRows(commentIds, function (crRows) {
          if (token !== engToken) return;
          // one profile fetch for both comment authors and reactors
          var ids = [];
          rows.forEach(function (r) { if (ids.indexOf(r.user_id) === -1) ids.push(r.user_id); });
          crRows.forEach(function (r) { if (ids.indexOf(r.user_id) === -1) ids.push(r.user_id); });
          fetchProfiles(ids, function (profs) {
            if (token !== engToken) return;
            var l = document.getElementById('commentList');
            if (!l) return;
            rows.forEach(function (r) { if (profs[r.user_id]) r.profiles = profs[r.user_id]; });

            _commentReactions = {};
            crRows.forEach(function (row) {
              var m = _commentReactions[row.comment_id] || (_commentReactions[row.comment_id] = {});
              var d = m[row.emoji] || (m[row.emoji] = { count: 0, mine: false, users: [] });
              d.count++;
              d.users.push({
                id: row.user_id,
                name: (profs[row.user_id] && profs[row.user_id].display_name) || 'Người đọc'
              });
              if (authUser && row.user_id === authUser.id) d.mine = true;
            });

            // split into top-level comments (newest first) and replies (oldest first)
            var tops = [], byParent = {};
            rows.forEach(function (r) {
              if (r.parent_id) (byParent[r.parent_id] || (byParent[r.parent_id] = [])).push(r);
              else tops.push(r);
            });
            tops.sort(function (a, b) { return (b.created_at || '').localeCompare(a.created_at || ''); });

            l.innerHTML = tops.map(function (c) { return commentLi(c); }).join('');
            tops.forEach(function (c) {
              var kids = byParent[c.id];
              if (!kids || !kids.length) return;
              var box = l.querySelector('.comment-replies[data-parent="' + c.id + '"]');
              if (box) box.innerHTML = kids.map(function (k) { return commentLi(k, true); }).join('');
            });
          });
        });
      });
  }

  function fetchCommentReactionRows(commentIds, cb) {
    if (!commentIds.length) { _commentReactsOn = true; cb([]); return; }
    sb.from('comment_reactions')
      .select('comment_id, emoji, user_id')
      .in('comment_id', commentIds)
      .then(function (res) {
        if (res.error) { _commentReactsOn = false; cb([]); return; }
        _commentReactsOn = true;
        cb(res.data || []);
      });
  }

  function closeAllCreactPopovers(except) {
    var l = document.getElementById('commentList');
    if (!l) return;
    Array.prototype.forEach.call(l.querySelectorAll('.creact-picker, .creact-who'), function (p) {
      if (p !== except) p.hidden = true;
    });
  }

  // Place a popover just below its trigger, left-aligned to it, clamped to the row.
  function positionCreactPop(pop, anchor, row) {
    pop.style.left = '0px';
    var left = Math.max(0, Math.min(anchor.offsetLeft, row.clientWidth - pop.offsetWidth));
    pop.style.left = left + 'px';
  }

  // Toggle my reaction — only reachable from the picker.
  function onCommentReact(btn) {
    if (!authUser) return;
    var row = btn.closest('.comment-actions');
    if (!row) return;
    var cid = row.getAttribute('data-cid');
    var emoji = btn.getAttribute('data-emoji');
    var m = _commentReactions[cid] || (_commentReactions[cid] = {});
    var d = m[emoji] || (m[emoji] = { count: 0, mine: false, users: [] });
    var had = d.mine;
    // optimistic
    d.mine = !had;
    d.count = Math.max(0, d.count + (had ? -1 : 1));
    d.users = (d.users || []).filter(function (u) { return u.id !== authUser.id; });
    if (!had) d.users.push({ id: authUser.id, name: authUser.name });
    if (d.count === 0) delete m[emoji];
    repaintCommentReacts(cid);
    var op = had
      ? sb.from('comment_reactions').delete().match({ comment_id: cid, user_id: authUser.id, emoji: emoji })
      : sb.from('comment_reactions').insert({ comment_id: cid, user_id: authUser.id, emoji: emoji });
    op.then(function (res) {
      if (res && res.error && res.error.code !== '23505') {
        loadComments(readerEl.getAttribute('data-chapter-id'), engToken);  // re-sync
      }
    });
  }

  function onCommentReactAdd(btn) {
    if (!authUser) return;
    var row = btn.closest('.comment-actions');
    var pk = row && row.querySelector('.creact-picker');
    if (!pk) return;
    var willShow = pk.hidden;
    closeAllCreactPopovers();
    if (willShow) { pk.hidden = false; positionCreactPop(pk, btn, row); }
  }

  function onCommentReactWho(btn) {
    var row = btn.closest('.comment-actions');
    if (!row) return;
    var cid = row.getAttribute('data-cid');
    var emoji = btn.getAttribute('data-emoji');
    var who = row.querySelector('.creact-who');
    if (!who) return;
    var showing = !who.hidden && who.getAttribute('data-emoji') === emoji;
    closeAllCreactPopovers();
    if (!showing) {
      who.setAttribute('data-emoji', emoji);
      who.innerHTML = creactWhoInnerHtml(cid, emoji);
      who.hidden = false;
      positionCreactPop(who, btn, row);
    }
  }

  // The top-level comment a "Trả lời" belongs under (replies are one level deep).
  function topLevelCommentId(el) {
    var li = el && el.closest && el.closest('.comment');
    if (!li) return null;
    if (li.classList.contains('comment-reply')) {
      var box = li.closest('.comment-replies');
      return box ? box.getAttribute('data-parent') : null;
    }
    return li.getAttribute('data-id');
  }

  function bumpCount(delta) {
    var t = document.getElementById('commentsTitle');
    if (!t) return;
    var badge = t.querySelector('.comments-count');
    var n = Math.max(0, (badge ? parseInt(badge.textContent, 10) || 0 : 0) + delta);
    setCommentsTitle(t, n);
  }

  // "Bình luận" heading + a small count badge (hidden at 0).
  function setCommentsTitle(el, n) {
    el.innerHTML = 'Bình luận' + (n > 0 ? ' <span class="comments-count">' + n + '</span>' : '');
  }

  function prependComment(row) {
    var list = document.getElementById('commentList');
    if (!list) return;
    var empty = list.querySelector('.comment-empty');
    if (empty) list.innerHTML = '';
    list.insertAdjacentHTML('afterbegin', commentLi(row));
    bumpCount(1);
  }

  // ---- actions -------------------------------------------------------------

  function doGoogleSignIn() {
    var redirectTo;
    try { redirectTo = location.href.split('#')[0]; } catch (e) { redirectTo = undefined; }
    sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo } });
  }
  function doSignOut() { sb.auth.signOut(); }

  function onCommentSubmit(form) {
    if (!authUser) return;
    var chapterId = readerEl.getAttribute('data-chapter-id');
    var bodyEl = form.querySelector('#commentBody');
    var statusEl = form.querySelector('#commentStatus');
    var submitEl = form.querySelector('#commentSubmit');
    var body = (bodyEl.value || '').trim();
    if (!body) return;
    if (body.length > COMMENT_MAX) { if (statusEl) statusEl.textContent = 'Bình luận quá dài.'; return; }
    if (submitEl) submitEl.disabled = true;
    if (statusEl) statusEl.textContent = 'Đang gửi...';
    sb.from('comments')
      .insert({ chapter_id: chapterId, user_id: authUser.id, body: body })
      .select('id, body, created_at, edited_at, user_id')
      .single()
      .then(function (res) {
        if (submitEl) submitEl.disabled = false;
        if (res.error || !res.data) {
          if (statusEl) statusEl.textContent = 'Không gửi được, thử lại nhé.';
          return;
        }
        bodyEl.value = '';
        if (statusEl) statusEl.textContent = 'Đã gửi. Cảm ơn bạn!';
        if (readerEl.getAttribute('data-chapter-id') === chapterId) {
          var row = res.data;
          row._name = authUser.name;
          row._avatar = authUser.avatar || null;
          row._hue = authUser.avatar ? null : authUser.avatarHue;
          prependComment(row);
        }
        setTimeout(function () { if (statusEl) statusEl.textContent = ''; }, 4000);
      });
  }

  function onCommentDelete(btn) {
    if (!authUser) return;
    var li = btn.closest('.comment');
    if (!li) return;
    if (typeof window.confirm === 'function' && !window.confirm('Xoá bình luận này?')) return;
    var id = li.getAttribute('data-id');
    btn.disabled = true;
    // Delete by id only; RLS allows it when the comment is the caller's own or
    // the caller is an admin. `.select()` tells us whether a row actually went.
    sb.from('comments').delete().eq('id', id).select('id').then(function (res) {
      if (res.error || !res.data || !res.data.length) { btn.disabled = false; return; }
      if (li.parentNode) li.parentNode.removeChild(li);
      bumpCount(-1);
    });
  }

  // ---- replies (one level deep) ----

  function onCommentReplyStart(btn) {
    if (!authUser) return;
    var li = btn.closest('.comment');
    if (!li) return;
    var col = li.querySelector('.comment-body-col');
    if (!col || col.querySelector(':scope > .comment-reply-form')) return;
    var parentId = topLevelCommentId(btn);
    if (!parentId) return;
    var form = document.createElement('form');
    form.className = 'comment-reply-form';
    form.setAttribute('data-parent', parentId);
    // Messenger-style: "Đang trả lời {name} ✕" chip, then your avatar next
    // to a rounded card holding an auto-growing textarea + round send button.
    var toEl = li.querySelector('.comment-author');
    var toName = toEl ? toEl.textContent : '';
    form.innerHTML =
      '<div class="reply-to">' + REPLY_SVG +
        '<span>Đang trả lời <strong>' + escapeHtml(toName) + '</strong></span>' +
        '<button type="button" class="reply-cancel" data-action="reply-cancel" aria-label="Huỷ" title="Huỷ">&times;</button>' +
      '</div>' +
      '<div class="reply-row">' +
        avatarHtml(authUser.name, authUser.avatar, authUser.id, 'comment-avatar',
          authUser.avatar ? null : authUser.avatarHue) +
        '<div class="reply-box">' +
          '<textarea class="comment-body" rows="1" maxlength="' + COMMENT_MAX + '" placeholder="Viết câu trả lời..." required></textarea>' +
          '<button type="submit" class="auth-btn reply-send" aria-label="Gửi" title="Gửi">' + SEND_SVG + '</button>' +
        '</div>' +
      '</div>' +
      '<span class="comment-status comment-reply-status" role="status"></span>';
    var actionsEl = li.querySelector('.comment-actions');
    if (actionsEl && actionsEl.parentNode === col) col.insertBefore(form, actionsEl.nextSibling);
    else col.appendChild(form);
    form.querySelector('textarea').focus();
  }

  function onCommentReplyCancel(btn) {
    var form = btn.closest('.comment-reply-form');
    if (form && form.parentNode) form.parentNode.removeChild(form);
  }

  function onCommentReplySubmit(form) {
    if (!authUser) return;
    var chapterId = readerEl.getAttribute('data-chapter-id');
    var parentId = form.getAttribute('data-parent');
    var ta = form.querySelector('textarea');
    var statusEl = form.querySelector('.comment-reply-status');
    var btn = form.querySelector('button[type="submit"]');
    var body = (ta.value || '').trim();
    if (!body) return;
    if (body.length > COMMENT_MAX) { if (statusEl) statusEl.textContent = 'Bình luận quá dài.'; return; }
    if (btn) btn.disabled = true;
    if (statusEl) statusEl.textContent = 'Đang gửi...';
    sb.from('comments')
      .insert({ chapter_id: chapterId, user_id: authUser.id, body: body, parent_id: parentId })
      .select('*')
      .single()
      .then(function (res) {
        if (btn) btn.disabled = false;
        if (res.error || !res.data) {
          if (statusEl) statusEl.textContent = 'Không gửi được, thử lại nhé.';
          return;
        }
        var row = res.data;
        row._name = authUser.name;
        row._avatar = authUser.avatar || null;
        row._hue = authUser.avatar ? null : authUser.avatarHue;
        var list = document.getElementById('commentList');
        var box = list && list.querySelector('.comment-replies[data-parent="' + parentId + '"]');
        if (box) box.insertAdjacentHTML('beforeend', commentLi(row, true));
        bumpCount(1);
        if (form.parentNode) form.parentNode.removeChild(form);
      });
  }

  // ---- inline comment editing ----

  function onCommentEditStart(btn) {
    var li = btn.closest('.comment');
    if (!li || li.querySelector('.comment-edit-form')) return;
    var id = li.getAttribute('data-id');
    var textEl = li.querySelector('.comment-text');
    var actionsEl = li.querySelector('.comment-actions');
    if (!textEl) return;
    var body = _commentBody[id] != null ? _commentBody[id] : '';
    textEl.hidden = true;
    if (actionsEl) actionsEl.hidden = true;
    var form = document.createElement('form');
    form.className = 'comment-edit-form';
    form.setAttribute('data-id', id);
    form.innerHTML =
      '<textarea class="comment-body" rows="3" maxlength="' + COMMENT_MAX + '" required></textarea>' +
      '<div class="comment-form-row">' +
        '<span class="comment-status comment-edit-status" role="status"></span>' +
        '<span class="comment-edit-btns">' +
          '<button type="button" class="comment-act" data-action="edit-cancel">Huỷ</button>' +
          '<button type="submit" class="auth-btn">Lưu</button>' +
        '</span>' +
      '</div>';
    var ta = form.querySelector('textarea');
    ta.value = body;
    textEl.parentNode.insertBefore(form, textEl.nextSibling);
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }

  function onCommentEditCancel(btn) {
    var li = btn.closest('.comment');
    if (li) restoreComment(li);
  }

  function restoreComment(li) {
    var form = li.querySelector('.comment-edit-form');
    if (form && form.parentNode) form.parentNode.removeChild(form);
    var textEl = li.querySelector('.comment-text');
    if (textEl) textEl.hidden = false;
    var actionsEl = li.querySelector('.comment-actions');
    if (actionsEl) actionsEl.hidden = false;
  }

  function onCommentEditSave(form) {
    var id = form.getAttribute('data-id');
    var ta = form.querySelector('textarea');
    var statusEl = form.querySelector('.comment-edit-status');
    var saveBtn = form.querySelector('button[type="submit"]');
    var body = (ta.value || '').trim();
    if (!body) return;
    if (body.length > COMMENT_MAX) { if (statusEl) statusEl.textContent = 'Bình luận quá dài.'; return; }
    if (body === (_commentBody[id] || '')) { restoreComment(form.closest('.comment')); return; }
    if (saveBtn) saveBtn.disabled = true;
    if (statusEl) statusEl.textContent = 'Đang lưu...';
    sb.from('comments')
      .update({ body: body, edited_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, body, edited_at')
      .single()
      .then(function (res) {
        if (saveBtn) saveBtn.disabled = false;
        if (res.error || !res.data) {
          if (statusEl) statusEl.textContent = 'Không lưu được, thử lại nhé.';
          return;
        }
        _commentBody[id] = res.data.body;
        var li = form.closest('.comment');
        var textEl = li.querySelector('.comment-text');
        if (textEl) textEl.innerHTML = escapeHtml(res.data.body || '').replace(/\r?\n/g, '<br>');
        var timeEl = li.querySelector('.comment-time');
        if (timeEl && timeEl.textContent.indexOf('đã sửa') === -1) {
          timeEl.textContent = timeEl.textContent + ' · đã sửa';
        }
        restoreComment(li);
      });
  }

  // ---- one-time wiring (readerEl is stable across chapter renders) ----------

  function initEngagement() {
    if (!sb) return;

    // Slot for the avatar + "Xin chào … Đăng xuất", right under the brand
    // row (logo + title). `.masthead-brand` wraps the title, so anchor to
    // that; fall back to the title itself, then to appending.
    var masthead = document.querySelector('.masthead');
    if (masthead && !document.getElementById('mastheadAuth')) {
      var slot = document.createElement('div');
      slot.className = 'masthead-auth';
      slot.id = 'mastheadAuth';
      slot.hidden = true;
      var anchor = masthead.querySelector('.masthead-brand')
                || masthead.querySelector('.masthead-title');
      if (anchor && anchor.parentNode === masthead) masthead.insertBefore(slot, anchor.nextSibling);
      else if (anchor) anchor.insertAdjacentElement('afterend', slot);
      else masthead.appendChild(slot);
    }
    ensureProfileModal();
    ensureChatWidget();
    fetchChatAdmin();

    // Sidebar (sign-out + open profile), the profile modal, and the chat
    // widget all live outside #reader, so this listener is on document. It
    // also closes the reaction picker / "who reacted" popover on any click
    // outside the reaction bar, and the chat panel on any click outside it.
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('[data-action]');
      var inReactionBar = ev.target.closest && ev.target.closest('#reactionBar');
      if (!inReactionBar) closeReactionPopovers();
      if (!(ev.target.closest && ev.target.closest('.comment-actions'))) closeAllCreactPopovers();
      if (_chatOpen && !(ev.target.closest && ev.target.closest('#chatWidget'))) closeChatPanel();
      if (!(ev.target.closest && ev.target.closest('.chat-emoji-wrap'))) closeAllChatEmojiPopovers();
      if (!(ev.target.closest && ev.target.closest('.chat-color-wrap'))) closeChatColorPopover();
      if (!(ev.target.closest && ev.target.closest('#signinPhoneRow'))) closePhoneCcPop(false);
      if (!a) return;
      var act = a.getAttribute('data-action');
      if (act === 'signout') { closeProfileModal(); doSignOut(); }
      else if (act === 'profile') openProfileModal();
      else if (act === 'profile-cancel') closeProfileModal();
      else if (act === 'profile-save') onProfileSave();
      else if (act === 'masthead-signin') { closeChatPanel(); openSigninModal(); }
      else if (act === 'chat-toggle') toggleChatPanel();
      else if (act === 'chat-google') doGoogleSignIn();
      else if (act === 'chat-signin') { closeChatPanel(); openSigninModal(); }
      else if (act === 'signin-close') closeSigninModal();
      else if (act === 'signin-google') doGoogleSignIn();
      else if (act === 'signin-tab') switchSigninTab(a.getAttribute('data-mode'));
      else if (act === 'signin-idtype') switchSigninIdType(a.getAttribute('data-type'));
      else if (act === 'phone-cc-toggle') togglePhoneCcPop();
      else if (act === 'phone-cc-pick') { setPhoneCountry(a.getAttribute('data-iso')); closePhoneCcPop(true); }
      else if (act === 'signin-eye') {
        var pw = document.getElementById('signinPassword');
        var show = pw.type === 'password';
        pw.type = show ? 'text' : 'password';
        a.setAttribute('aria-pressed', String(show));
        a.setAttribute('aria-label', show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
      }
      else if (act === 'admin-inbox') { renderAdminInbox(); closeDrawer(); }
      else if (act === 'admin-users') { renderAdminUsers(); closeDrawer(); }
      else if (act === 'saved-page') { renderSaved(); closeDrawer(); }
      else if (act === 'reminder-close') closeSigninReminder();
      else if (act === 'reminder-signin') { closeSigninReminder(); openSigninModal(); }
      else if (act === 'inbox-open') openInboxThread(a.getAttribute('data-uid'));
      else if (act === 'inbox-back') backToInboxList();
      else if (act === 'chat-msg-delete') onChatMessageDelete(a);
      else if (act === 'chat-msg-toggle') {
        var msgEl = a.closest('.chat-msg');
        if (msgEl) msgEl.classList.toggle('is-revealed');
      }
      else if (act === 'chat-emoji-toggle') toggleChatEmojiPopover(a);
      else if (act === 'chat-emoji-pick') onChatEmojiPick(a);
      else if (act === 'chat-color-toggle') toggleChatColorPopover(a);
      else if (act === 'chat-color-pick') onChatColorPick(a);
      else if (act === 'chat-attach') {
        var fileInput = document.getElementById(a.getAttribute('data-for') + 'FileInput');
        if (fileInput) fileInput.click();
      }
      else if (act === 'chat-attach-remove') {
        var prefix = a.getAttribute('data-for');
        if (prefix === 'inbox') _inboxPendingFile = null; else _chatPendingFile = null;
        showPendingFile(prefix, null);
      }
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') {
        closeProfileModal(); closeReactionPopovers(); closeAllCreactPopovers();
        closeChatPanel(); closeSigninModal(); closeAllChatEmojiPopovers();
        hideQuotePop(); closeSigninReminder();
      }
    });
    document.addEventListener('change', function (ev) {
      if (ev.target && ev.target.id === 'chatFileInput') onChatFileChosen(ev.target, 'chat');
      else if (ev.target && ev.target.id === 'inboxFileInput') onChatFileChosen(ev.target, 'inbox');
    });
    document.addEventListener('input', function (ev) {
      if (ev.target && ev.target.classList && ev.target.classList.contains('chat-textarea')) {
        autoGrowTextarea(ev.target);
      } else if (ev.target && ev.target.closest && ev.target.closest('.reply-box')) {
        autoGrowTextarea(ev.target);
      }
    });
    document.addEventListener('submit', function (ev) {
      if (ev.target && ev.target.id === 'chatForm') { ev.preventDefault(); onChatSubmit(ev.target); }
      else if (ev.target && ev.target.id === 'inboxReplyForm') { ev.preventDefault(); onInboxReplySubmit(ev.target); }
      else if (ev.target && ev.target.id === 'signinEmailForm') { ev.preventDefault(); onSigninEmailSubmit(ev.target); }
    });

    readerEl.addEventListener('click', function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      var a = t.closest('[data-action]');
      if (!a) return;
      var act = a.getAttribute('data-action');
      if (act === 'guest-signin') { closeReactionPopovers(); openSigninModal(); }
      else if (act === 'del') onCommentDelete(a);
      else if (act === 'edit') onCommentEditStart(a);
      else if (act === 'edit-cancel') onCommentEditCancel(a);
      else if (act === 'reply') onCommentReplyStart(a);
      else if (act === 'reply-cancel') onCommentReplyCancel(a);
      else if (act === 'react-add') onReactionAdd();
      else if (act === 'react-choice') onReactionChoice(a);
      else if (act === 'react-who') onReactionWho(a);
      else if (act === 'creact-pick') onCommentReact(a);
      else if (act === 'creact-add') onCommentReactAdd(a);
      else if (act === 'creact-who') onCommentReactWho(a);
      else if (act === 'save-chapter') onSaveChapterToggle(a);
      else if (act === 'saved-open') onSavedOpen(a);
      else if (act === 'saved-del') onSavedDelete(a);
      else if (act === 'saved-back') renderChapter(_lastReadChapterId || chapters[0].id, { push: true });
    });

    readerEl.addEventListener('submit', function (ev) {
      var f = ev.target;
      if (!f) return;
      if (f.id === 'commentForm') { ev.preventDefault(); onCommentSubmit(f); }
      else if (f.classList && f.classList.contains('comment-edit-form')) { ev.preventDefault(); onCommentEditSave(f); }
      else if (f.classList && f.classList.contains('comment-reply-form')) { ev.preventDefault(); onCommentReplySubmit(f); }
    });

    function refresh() {
      renderMastheadAuth();
      updateAdminTocItem();
      onSavedAuthChange();
      if (authUser) {
        refreshChatUnreadBadge();
        if (authUser.isAdmin) { loadInboxThreads(); loadAdminNewUsers(); }
      } else {
        setChatBadge(0);
      }
      // The initial load restored an admin-inbox route from the hash/
      // localStorage, but couldn't confirm access until is_admin actually
      // resolves (refresh() also fires earlier, mid-fetch, with a
      // provisional non-admin authUser — _authSettled tells settled from
      // provisional apart). If this user turns out not to be the admin,
      // just leave chapter 1 (already showing) alone.
      if (_pendingAdminInboxRoute && _authSettled) {
        var pendingRoute = _pendingAdminInboxRoute;
        _pendingAdminInboxRoute = false;
        if (pendingRoute === SAVED_ROUTE) {
          if (authUser) { renderSaved(); return; }
        } else if (authUser && authUser.isAdmin) {
          if (pendingRoute === ADMIN_USERS_ROUTE) renderAdminUsers(); else renderAdminInbox();
          return;
        }
      }
      // Safety net: if whoever's signed in stops being admin (signed out,
      // switched accounts) while the inbox is on screen, don't strand them
      // on an orphaned admin page — send them back to the last chapter.
      // Gated on _authSettled for the same reason as the pending-route
      // check above — authUser.isAdmin is unreliable mid-fetch.
      if (_authSettled && readerEl.querySelector('.admin-inbox, .admin-users') && !(authUser && authUser.isAdmin)) {
        renderChapter(loadLastChapter() || chapters[0].id, { push: false });
      }
      // Same for the "Đã lưu" page once nobody's signed in.
      if (_authSettled && !authUser && readerEl.querySelector('.saved-page')) {
        renderChapter(chapters[0].id, { push: false });
      }
      // Only rebuild the chat panel body when who's signed in actually
      // changed — a token-refresh auth event re-fires this with the same
      // user and would otherwise wipe out a message mid-draft.
      var chatKey = authUser ? authUser.id : null;
      if (document.getElementById('chatWidget') && chatKey !== _chatAuthKey) {
        _chatAuthKey = chatKey;
        renderChatPanelBody();
      }
      var cid = readerEl.getAttribute('data-chapter-id');
      if (cid) renderEngagement(cid);
    }
    sb.auth.getSession().then(function (res) {
      applyAuthUser(res && res.data && res.data.session ? res.data.session.user : null, refresh);
      refresh();
    });
    sb.auth.onAuthStateChange(function (_evt, session) {
      applyAuthUser(session ? session.user : null, refresh);
      refresh();
    });

    recordVisit();
    loadTocViewCounts();

    // Floating "Lưu trích dẫn" button: follows the text selection.
    var _quoteTimer = null;
    document.addEventListener('selectionchange', function () {
      clearTimeout(_quoteTimer);
      _quoteTimer = setTimeout(updateQuotePop, 120);
    });
    readerEl.addEventListener('scroll', function () { if (document.getElementById('quotePop')) updateQuotePop(); });
    window.addEventListener('scroll', function () { if (document.getElementById('quotePop')) updateQuotePop(); }, { passive: true });

    // No realtime — just re-check unread counts every minute while someone's
    // signed in, same "poll rather than push" approach as the rest of this
    // feature (loadChatMessages/loadInboxThreads already re-fetch on open).
    setInterval(function () {
      if (!authUser) return;
      refreshChatUnreadBadge();
      if (authUser.isAdmin) { loadInboxThreads(); loadAdminNewUsers(); }
    }, 60000);
  }

  function applySearch() {
    var q = (searchEl.value || '').trim().toLowerCase();
    var items = tocEl.querySelectorAll('.toc-item');
    var visibleCount = 0;
    Array.prototype.forEach.call(items, function (btn) {
      if (!btn.hasAttribute('data-index')) return;   // the pinned "Hộp thư" admin item isn't a chapter
      var idx = Number(btn.getAttribute('data-index'));
      var match = !q || chapters[idx]._search.indexOf(q) !== -1;
      btn.classList.toggle('hidden', !match);
      if (match) visibleCount++;
    });
    var empty = document.getElementById('tocEmpty');
    if (empty) empty.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  function openDrawer() {
    sidebarEl.classList.add('open');
    scrimEl.classList.add('open');
    toggleEl.setAttribute('aria-expanded', 'true');
    // Open with the chapter being read in the middle of the list, not
    // wherever the list was last scrolled to.
    centerActiveTocItem();
    queueSavedTocBg();
  }
  function closeDrawer() {
    if (window.innerWidth > 860) return;
    sidebarEl.classList.remove('open');
    scrimEl.classList.remove('open');
    toggleEl.setAttribute('aria-expanded', 'false');
  }

  toggleEl.addEventListener('click', function () {
    sidebarEl.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  scrimEl.addEventListener('click', closeDrawer);

  // Mobile only (hidden by CSS on desktop): a "›" tab at the middle of the
  // screen's right edge, pointing the way the drawer slides out, so it can
  // be closed without picking a chapter. Escape closes it too.
  (function () {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sidebar-close';
    btn.setAttribute('aria-label', 'Đóng mục lục');
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="1.25em" height="1.25em" fill="none" stroke="currentColor" ' +
      'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
    btn.addEventListener('click', function () { closeDrawer(); toggleEl.focus(); });
    sidebarEl.appendChild(btn);
  })();
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && sidebarEl.classList.contains('open')) closeDrawer();
  });
  window.addEventListener('popstate', function () {
    var id = routeHash() || loadLastChapter() || chapters[0].id;
    if (id === ADMIN_INBOX_ROUTE && authUser && authUser.isAdmin) { renderAdminInbox(); return; }
    if (id === ADMIN_USERS_ROUTE && authUser && authUser.isAdmin) { renderAdminUsers(); return; }
    if (id === SAVED_ROUTE && authUser) { renderSaved(); return; }
    renderChapter(id, { push: false });
  });
  searchEl.addEventListener('input', applySearch);
  // Google-style ✕ inside the search pill: shown only while there's text.
  var searchClearEl = document.getElementById('searchClear');
  if (searchClearEl) {
    var syncSearchClear = function () { searchClearEl.hidden = !searchEl.value; };
    searchEl.addEventListener('input', syncSearchClear);
    searchClearEl.addEventListener('click', function () {
      searchEl.value = '';
      syncSearchClear();
      applySearch();
      searchEl.focus();
    });
  }
  readerEl.addEventListener('scroll', updateProgress);
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  window.addEventListener('resize', reclampChatWidget);

  if (mastheadCountEl) mastheadCountEl.textContent = chapters.length + ' chương';

  buildTOC();
  var startId = routeHash() || loadLastChapter() || chapters[0].id;
  // Admin status isn't known yet at this point (it resolves async via
  // Supabase) — show chapter 1 for now and let refresh()'s pending-route
  // check switch into the inbox once getSession() confirms this user
  // actually is the admin.
  // Holds which admin route is pending (inbox or user list), or false.
  _pendingAdminInboxRoute = (startId === ADMIN_INBOX_ROUTE || startId === ADMIN_USERS_ROUTE ||
                             startId === SAVED_ROUTE) ? startId : false;
  if (sb) initEngagement();
  if (_pendingAdminInboxRoute) {
    renderChapter(chapters[0].id, { silent: true });
  } else {
    renderChapter(startId);
  }

  // /?menu — the "Mục lục" tab on the Terms / Privacy pages links here: open
  // the chapter list (the drawer on mobile; on desktop the sidebar is always
  // shown, so just put the cursor in its search box). The flag is then
  // dropped from the URL so a reload doesn't reopen it.
  (function () {
    var q = '';
    try { q = location.search || ''; } catch (e) {}
    if (!/[?&]menu\b/.test(q)) return;
    try { history.replaceState(history.state, '', location.pathname + location.hash); } catch (e) {}
    if (window.innerWidth <= 860) openDrawer();
    else if (searchEl) searchEl.focus({ preventScroll: true });
  })();
})();
