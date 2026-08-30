/* ==========================================================================
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
        '</button></li>';
    }).join('') + '<li class="toc-empty" id="tocEmpty" style="display:none;">Không tìm thấy chương nào phù hợp.</li>';

    Array.prototype.forEach.call(tocEl.querySelectorAll('.toc-item'), function (btn) {
      btn.addEventListener('click', function () {
        renderChapter(btn.getAttribute('data-id'), { push: true });
        closeDrawer();
      });
    });
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

  function renderChapter(id, opts) {
    var push = !!(opts && opts.push);
    var idx = chapters.findIndex(function (c) { return c.id === id; });
    if (idx === -1) idx = 0;
    var ch = chapters[idx];

    var html = '<article class="chapter">';
    html += '<p class="chapter-kicker">Chương ' + String(idx + 1).padStart(2, '0') + '</p>';
    html += '<h2 class="chapter-title">' + escapeHtml(ch.title) + '</h2>';
    html += '<hr class="chapter-lead-rule">';

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
    if (prev) html += '<span class="nav-dir">&larr; Trước</span><span class="nav-chapter">Chương ' + String(idx).padStart(2, '0') + '</span><span class="nav-title">' + escapeHtml(prev.title) + '</span>';
    html += '</button>';
    html += '<button class="nav-btn next" id="nextBtn"' + (next ? '' : ' disabled') + '>';
    if (next) html += '<span class="nav-dir">Tiếp &rarr;</span><span class="nav-chapter">Chương ' + String(idx + 2).padStart(2, '0') + '</span><span class="nav-title">' + escapeHtml(next.title) + '</span>';
    html += '</button>';
    html += '</nav>';

    html += '</article>';

    readerEl.innerHTML = html;
    scrollReaderToTop();
    updateProgress();

    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    if (prev && prevBtn) prevBtn.addEventListener('click', function () { renderChapter(prev.id, { push: true }); });
    if (next && nextBtn) nextBtn.addEventListener('click', function () { renderChapter(next.id, { push: true }); });

    Array.prototype.forEach.call(tocEl.querySelectorAll('.toc-item'), function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-id') === ch.id);
    });

    saveLastChapter(ch.id);

    // Push a history entry per chapter switch (not the initial load) so the
    // device/browser Back button steps back through previously-read
    // chapters instead of immediately leaving the page.
    if (push) {
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

  function applySearch() {
    var q = (searchEl.value || '').trim().toLowerCase();
    var items = tocEl.querySelectorAll('.toc-item');
    var visibleCount = 0;
    Array.prototype.forEach.call(items, function (btn) {
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
  window.addEventListener('popstate', function () {
    var id = (location.hash || '').replace('#', '') || loadLastChapter() || chapters[0].id;
    renderChapter(id, { push: false });
  });
  searchEl.addEventListener('input', applySearch);
  readerEl.addEventListener('scroll', updateProgress);
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  if (mastheadCountEl) mastheadCountEl.textContent = chapters.length + ' chương';

  buildTOC();
  var startId = (location.hash || '').replace('#', '') || loadLastChapter() || chapters[0].id;
  renderChapter(startId);
})();
