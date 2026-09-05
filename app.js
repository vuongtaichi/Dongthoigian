/* build: 2027-rpc-counters
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

  // The admin inbox isn't a chapter, but it reuses the same "last place"
  // storage/hash so leaving the site and coming back restores it too,
  // instead of always falling through to chapter 1 (see routing near the
  // bottom of this file and renderAdminInbox's history/localStorage calls).
  var ADMIN_INBOX_ROUTE = 'admin-inbox';

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

    if (sb) html += engagementShellHtml();

    html += '</article>';

    readerEl.innerHTML = html;
    readerEl.setAttribute('data-chapter-id', ch.id);
    scrollReaderToTop();
    updateProgress();

    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    if (prev && prevBtn) prevBtn.addEventListener('click', function () { renderChapter(prev.id, { push: true }); });
    if (next && nextBtn) nextBtn.addEventListener('click', function () { renderChapter(next.id, { push: true }); });

    Array.prototype.forEach.call(tocEl.querySelectorAll('.toc-item'), function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-id') === ch.id);
    });

    if (!silent) saveLastChapter(ch.id);

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
      pill.innerHTML = EYE_SVG + '<span>' + n.toLocaleString('vi-VN') + ' lượt xem</span>';
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

  // Avatar colour palette for the initials circle. A mix of mid-tone and
  // light/pastel colours; the stored `avatar_hue` is an INDEX into this list
  // (0..N-1). Light entries (l >= 62) get dark text.
  var AVATAR_PALETTE = [
    { h: 8,   l: 46 }, { h: 28,  l: 46 }, { h: 145, l: 40 }, { h: 200, l: 44 },
    { h: 235, l: 50 }, { h: 280, l: 46 }, { h: 330, l: 46 }, { h: 95,  l: 40 },
    { h: 8,   l: 80 }, { h: 38,  l: 78 }, { h: 95,  l: 76 }, { h: 150, l: 76 },
    { h: 195, l: 78 }, { h: 250, l: 82 }, { h: 300, l: 80 }, { h: 340, l: 82 }
  ];

  // Shared by avatarVars (avatar initials circle) and chat bubble colors —
  // both are just "a color from this palette, by index".
  function paletteColor(idx) {
    var n = AVATAR_PALETTE.length;
    var c = AVATAR_PALETTE[((idx % n) + n) % n];
    return { bg: 'hsl(' + c.h + ' 58% ' + c.l + '%)', fg: c.l >= 62 ? '#1b2436' : '#fff' };
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
        '</div>' +
        '<div class="auth-bar" id="authBar"></div>' +
        '<div class="comments">' +
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
        '" data-action="creact-pick" data-emoji="' + escapeHtml(r.emoji) + '">' + r.emoji + '</button>';
    }).join('');
    return '<button type="button" class="creact-add" data-action="creact-add" ' +
        'aria-label="Bày tỏ cảm xúc">🙂<span class="creact-add-plus">+</span></button>' +
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
          r.emoji + ' <span>' + d.count + '</span></button>';
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
    return '<span class="who-emoji">' + emoji + '</span>' + chips + more;
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
      (authUser ? '<button type="button" class="comment-act" data-action="reply">Trả lời</button>' : '') +
      (mine ? '<button type="button" class="comment-act" data-action="edit">Sửa</button>' : '') +
      (canDelete ? '<button type="button" class="comment-act" data-action="del">Xoá</button>' : '') +
      (reactsOn ? '<span class="creact-pills">' + creactPillsHtml(c.id) + '</span>' +
        '<span class="creact-who" hidden></span>' : '') +
      '</div>';
    var replies = isReply ? '' : '<ul class="comment-replies" data-parent="' + c.id + '"></ul>';
    return '<li class="comment' + (isReply ? ' comment-reply' : '') + (mine ? ' is-mine' : '') +
        '" data-id="' + c.id + '">' +
        avatarHtml(name, avatar, c.user_id, 'comment-avatar', hue) +
        '<div class="comment-body-col">' +
          '<div class="comment-head">' +
            '<span class="comment-author">' + escapeHtml(name) + '</span>' +
            '<span class="comment-time">' + escapeHtml(relTime(c.created_at)) +
              (c.edited_at ? ' · đã sửa' : '') + '</span>' +
          '</div>' +
          '<div class="comment-text">' + escapeHtml(c.body || '').replace(/\r?\n/g, '<br>') + '</div>' +
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
    renderAuthBar(chapterId);
    renderCompose();
    loadComments(chapterId, token);
  }

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

  var CHAT_SVG =
    '<svg viewBox="0 0 24 24" width="1.5em" height="1.5em" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';

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
          r.emoji + '</button>';
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
          '" title="' + escapeHtml(r.label) + ' — xem ai đã bày tỏ">' +
          '<span class="reaction-emoji">' + r.emoji + '</span>' +
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

  function paintWho() {
    var who = document.getElementById('reactionWho');
    if (!who) return;
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
    if (changed) {
      var pk = document.getElementById('reactionPicker');
      if (pk) pk.hidden = true;
      paintWho();
    }
  }

  function onReactionWho(pill) {
    var e = pill.getAttribute('data-emoji');
    _whoOpenEmoji = (_whoOpenEmoji === e) ? null : e;
    _pickerOpen = false;
    var pk = document.getElementById('reactionPicker');
    if (pk) pk.hidden = true;
    paintWho();
  }

  function onReactionAdd() {
    if (!authUser) { flashAuthBar(); return; }
    _pickerOpen = !_pickerOpen;
    _whoOpenEmoji = null;
    paintReactions();
  }

  function onReactionChoice(btn) {
    if (!authUser) { flashAuthBar(); return; }
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

  // The per-chapter box. Only shown to logged-out readers (sign-in prompt +
  // buttons). When signed in it's hidden — the greeting lives in the sidebar
  // masthead instead (renderMastheadAuth).
  function renderAuthBar(chapterId) {
    var bar = document.getElementById('authBar');
    if (!bar) return;
    if (authUser) {
      bar.hidden = true;
      bar.innerHTML = '';
      bar.classList.remove('is-guest');
    } else {
      bar.hidden = false;
      bar.classList.add('is-guest');
      bar.innerHTML =
        '<span class="auth-prompt">Đăng nhập để bình luận và bày tỏ cảm xúc</span>' +
        '<button type="button" class="auth-btn" data-action="email">Đăng nhập/Đăng ký</button>' +
        '<button type="button" class="auth-btn auth-ghost auth-google" data-action="google">' +
          GOOGLE_G_SVG + '<span>Đăng nhập bằng Google</span></button>';
    }
  }

  // Signed in: avatar + "Xin chào, {name}" under the site title — clicking it
  // opens the profile editor (which is also where "Đăng xuất" now lives).
  // Signed out: a "Đăng nhập/Đăng ký" button in the same spot that scrolls
  // down to the guest sign-in prompt (#authBar) at the end of the current
  // chapter, via the same flashAuthBar() other sign-in prompts already use.
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
            '<button type="button" class="comment-act" data-action="profile-cancel">Huỷ</button>' +
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

  var ADMIN_EMAIL = 'vuongtaichi@gmail.com';
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
        if (title) title.textContent = 'Nhắn tin cho ' + _chatAdmin.name;
        var guestMsg = document.getElementById('chatGuestMsg');
        if (guestMsg) guestMsg.innerHTML = 'Đăng nhập để gửi tin nhắn cho <strong>' + escapeHtml(_chatAdmin.name) + '</strong>.';
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
        CHAT_SVG +
      '</button>' +
      '<div class="chat-panel" id="chatPanel" hidden role="dialog" aria-label="Nhắn tin">' +
        '<div class="chat-panel-head">' +
          '<span class="chat-color-wrap">' +
            '<button type="button" class="chat-tool-btn" id="chatColorBtn" data-action="chat-color-toggle" ' +
              'aria-label="Đổi màu bong bóng chat" hidden>🎨</button>' +
            '<span class="chat-color-popover" id="chatColorPopover" hidden></span>' +
          '</span>' +
          '<span class="chat-panel-title" id="chatPanelTitle">Nhắn tin cho ' + escapeHtml(_chatAdmin.name) + '</span>' +
          '<button type="button" class="chat-panel-close" data-action="chat-toggle" aria-label="Đóng">&times;</button>' +
        '</div>' +
        '<div class="chat-panel-body" id="chatPanelBody"></div>' +
      '</div>';
    host.appendChild(w);
  }

  var MESSAGE_COLUMNS = 'id, sender_id, body, created_at, deleted, attachment_path, attachment_name, attachment_type, attachment_size';

  // ---- compose-box extras: emoji picker + file attach, shared by the
  // reader's chat widget and the admin's inbox reply box (each instance is
  // told apart only by an id prefix — "chat" or "inbox"). ----------------

  function chatEmojiButtonsHtml() {
    return CHAT_EMOJIS.map(function (e) {
      return '<button type="button" class="chat-emoji-choice" data-action="chat-emoji-pick" data-emoji="' +
        escapeAttr(e) + '">' + e + '</button>';
    }).join('');
  }

  function composePendingFileHtml(prefix) {
    return '<div class="chat-pending-file" id="' + prefix + 'PendingFile" hidden>' +
        '<span class="chat-pending-file-name"></span>' +
        '<button type="button" class="chat-pending-file-remove" data-action="chat-attach-remove" data-for="' +
          prefix + '" aria-label="Bỏ đính kèm">&times;</button>' +
      '</div>';
  }

  function composeToolsHtml(prefix) {
    return '<div class="chat-compose-icons">' +
        '<span class="chat-emoji-wrap">' +
          '<button type="button" class="chat-tool-btn" data-action="chat-emoji-toggle" aria-label="Chèn biểu tượng cảm xúc">🙂</button>' +
          '<span class="chat-emoji-popover" hidden>' + chatEmojiButtonsHtml() + '</span>' +
        '</span>' +
        '<button type="button" class="chat-tool-btn" data-action="chat-attach" data-for="' + prefix +
          '" aria-label="Đính kèm tệp">📎</button>' +
      '</div>' +
      '<input type="file" id="' + prefix + 'FileInput" class="chat-file-input" accept="' + ATTACHMENT_ACCEPT + '" hidden>';
  }

  // Shared by the reader's chat widget and the admin inbox reply box.
  // Emoji/attach sit stacked above Send in a fixed-size column to the right
  // of the textarea (not their own full-width row) — so they don't take up
  // extra vertical space, and align-items:flex-end on .chat-compose-row
  // (in styles.css) keeps that column pinned to its own size regardless of
  // how tall the textarea grows.
  function composeFormHtml(formId, prefix, inputId, placeholder) {
    return '<form class="chat-compose" id="' + formId + '">' +
        composePendingFileHtml(prefix) +
        '<div class="chat-compose-row">' +
          '<textarea id="' + inputId + '" class="chat-textarea" maxlength="2000" placeholder="' +
            escapeAttr(placeholder) + '"></textarea>' +
          '<div class="chat-compose-actions">' +
            composeToolsHtml(prefix) +
            '<button type="submit" class="auth-btn chat-send">Gửi</button>' +
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
      input.focus();
    }
    closeAllChatEmojiPopovers();
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
    var bodyHtml = m.body ? '<div class="chat-msg-text">' + escapeHtml(m.body).replace(/\r?\n/g, '<br>') + '</div>' : '';
    var attachmentHtml = '';
    if (m.attachment_path) {
      var isImage = (m.attachment_type || '').indexOf('image/') === 0;
      attachmentHtml = isImage
        ? '<img class="chat-attachment-img" alt="' + escapeAttr(m.attachment_name || '') +
            '" data-path="' + escapeAttr(m.attachment_path) + '">'
        : '<a class="chat-attachment-file" href="#" target="_blank" rel="noopener" data-path="' +
            escapeAttr(m.attachment_path) + '">📎 <span>' + escapeHtml(m.attachment_name || 'Tệp đính kèm') + '</span></a>';
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
    if (!authUser) {
      closeChatColorPopover();
      body.innerHTML =
        '<div class="chat-guest">' +
          '<p class="chat-guest-msg" id="chatGuestMsg">Đăng nhập để gửi tin nhắn cho <strong>' +
            escapeHtml(_chatAdmin.name) + '</strong>.</p>' +
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
    if (_chatOpen) renderChatPanelBody();
  }

  function closeChatPanel() {
    var panel = document.getElementById('chatPanel');
    if (panel) panel.hidden = true;
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
    if (!(authUser && authUser.isAdmin)) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    var li = document.createElement('li');
    li.id = 'tocAdminItem';
    li.innerHTML =
      '<button type="button" class="toc-item toc-admin-item" data-action="admin-inbox" aria-label="Hộp thư (quản trị)">' +
        '<span class="toc-num" aria-hidden="true">💬</span>' +
        '<span class="toc-text"><span class="toc-title">Hộp thư</span></span>' +
      '</button>';
    toc.insertBefore(li, toc.firstChild);
  }

  function inboxThreadLi(t) {
    var badge = t.unread ? '<span class="inbox-thread-badge">' + (t.unread > 9 ? '9+' : t.unread) + '</span>' : '';
    return '<button type="button" class="inbox-thread-item' +
        (t.uid === _inboxSelected ? ' active' : '') + (t.unread ? ' has-unread' : '') +
        '" data-action="inbox-open" data-uid="' + escapeAttr(t.uid) + '">' +
      avatarHtml(t.name, t.avatar, t.uid, 'inbox-thread-avatar', t.avatar ? null : t.hue) +
      '<span class="inbox-thread-text">' +
        '<span class="inbox-thread-name">' + escapeHtml(t.name) + '</span>' +
        '<span class="inbox-thread-preview">' + escapeHtml(t.lastBody) + '</span>' +
      '</span>' +
      badge +
      '<span class="inbox-thread-time">' + escapeHtml(relTime(t.lastCreatedAt)) + '</span>' +
    '</button>';
  }

  function renderInboxThreadList() {
    var list = document.getElementById('inboxThreadList');
    if (!list) return;
    list.innerHTML = _inboxThreads.length
      ? _inboxThreads.map(inboxThreadLi).join('')
      : '<p class="chat-empty">Chưa có ai nhắn tin.</p>';
  }

  // Sums each thread's unread count onto the "Hộp thư" sidebar entry.
  function updateAdminInboxBadge() {
    var li = document.getElementById('tocAdminItem');
    if (!li) return;
    var btn = li.querySelector('.toc-item');
    if (!btn) return;
    var total = _inboxThreads.reduce(function (sum, t) { return sum + (t.unread || 0); }, 0);
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
        });
      });
  }

  function renderInboxConversation() {
    var conv = document.getElementById('inboxConversation');
    if (!conv || !_inboxSelected) return;
    var t = _inboxThreads.filter(function (x) { return x.uid === _inboxSelected; })[0];
    var name = t ? t.name : 'Người đọc';
    conv.innerHTML =
      '<div class="inbox-conv-head">' + escapeHtml(name) + '</div>' +
      '<div class="chat-thread inbox-conv-thread" id="inboxConvThread"></div>' +
      composeFormHtml('inboxReplyForm', 'inbox', 'inboxReplyInput', 'Trả lời...');
    var threadEl = document.getElementById('inboxConvThread');
    threadEl.innerHTML = _inboxMessages.length
      ? _inboxMessages.map(function (m) { return chatBubbleHtml(m, name, t && t.bubbleHue); }).join('')
      : '<p class="chat-empty">Chưa có tin nhắn.</p>';
    threadEl.scrollTop = threadEl.scrollHeight;
    hydrateChatAttachments(threadEl);
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
    var conv = document.getElementById('inboxConversation');
    if (conv) conv.innerHTML = '<p class="chat-empty">Đang tải...</p>';
    loadInboxMessages(uid);
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
    readerEl.innerHTML =
      '<article class="chapter admin-inbox">' +
        '<p class="chapter-kicker">Quản trị</p>' +
        '<h2 class="chapter-title">Hộp thư</h2>' +
        '<hr class="chapter-lead-rule">' +
        '<div class="inbox-layout">' +
          '<div class="inbox-thread-list" id="inboxThreadList"><p class="chat-empty">Đang tải...</p></div>' +
          '<div class="inbox-conversation" id="inboxConversation"><p class="chat-empty">Chọn một cuộc trò chuyện để xem.</p></div>' +
        '</div>' +
      '</article>';
    scrollReaderToTop();
    updateProgress();
    Array.prototype.forEach.call(tocEl.querySelectorAll('.toc-item'), function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-action') === 'admin-inbox');
    });
    _inboxSelected = null;
    loadInboxThreads();
    saveLastChapter(ADMIN_INBOX_ROUTE);
    history.replaceState({ chapterId: ADMIN_INBOX_ROUTE }, '', '#' + ADMIN_INBOX_ROUTE);
  }

  // ---- sign-in modal: Google + email/phone, both usable right away --------
  //
  // A centered popup with the same two sign-in paths as the per-chapter
  // guest auth bar (renderAuthBar/renderEmailForm below), but shown at once
  // rather than as a "prompt, then tap through to a form" two-step — opened
  // from the masthead button and the chat widget's guest state, so signing
  // in doesn't require scrolling to the bottom of the chapter. Deliberately
  // its own form with its own element ids (signin* rather than auth*) so it
  // can be open at the same time as the per-chapter form without either one
  // stealing the other's document.getElementById() lookups.

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
        '<button type="button" class="signin-modal-close" data-action="signin-close" aria-label="Đóng">&times;</button>' +
        '<h3 class="signin-modal-title">Đăng nhập / Đăng ký</h3>' +
        '<button type="button" class="auth-btn auth-ghost auth-google" data-action="signin-google">' +
          GOOGLE_G_SVG + '<span>Đăng nhập bằng Google</span></button>' +
        '<div class="signin-modal-divider"><span>hoặc</span></div>' +
        '<form class="auth-email-form" id="signinEmailForm" data-mode="signin" data-idtype="email" autocomplete="on">' +
          '<div class="auth-tabs">' +
            '<button type="button" class="auth-tab is-active" data-action="signin-tab" data-mode="signin">Đăng nhập</button>' +
            '<button type="button" class="auth-tab" data-action="signin-tab" data-mode="signup">Đăng ký</button>' +
          '</div>' +
          '<div class="auth-idtype">' +
            '<button type="button" class="auth-idbtn is-active" data-action="signin-idtype" data-type="email">Email</button>' +
            '<button type="button" class="auth-idbtn" data-action="signin-idtype" data-type="phone">Số điện thoại</button>' +
          '</div>' +
          '<input type="text" id="signinName" class="auth-input" maxlength="' + NAME_MAX + '" placeholder="Tên hiển thị" hidden />' +
          '<input type="email" id="signinIdentity" class="auth-input" placeholder="Email" required autocomplete="email" inputmode="email" />' +
          '<input type="password" id="signinPassword" class="auth-input" placeholder="Mật khẩu (tối thiểu 6 ký tự)" required minlength="6" autocomplete="current-password" />' +
          '<div class="auth-email-row">' +
            '<span class="auth-msg" id="signinMsg" role="status"></span>' +
            '<button type="submit" class="auth-btn" id="signinSubmit">Đăng nhập</button>' +
          '</div>' +
        '</form>' +
      '</div>';
    host.appendChild(m);
    defeatAutofillFont(m);
  }

  function openSigninModal() {
    if (authUser) return;
    ensureSigninModal();
    var msg = document.getElementById('signinMsg');
    if (msg) msg.textContent = '';
    document.getElementById('signinModal').hidden = false;
  }

  function closeSigninModal() {
    var m = document.getElementById('signinModal');
    if (m) m.hidden = true;
  }

  function switchSigninTab(mode) {
    var form = document.getElementById('signinEmailForm');
    if (!form) return;
    form.setAttribute('data-mode', mode);
    Array.prototype.forEach.call(form.querySelectorAll('.auth-tab'), function (t) {
      t.classList.toggle('is-active', t.getAttribute('data-mode') === mode);
    });
    var nameField = form.querySelector('#signinName');
    if (nameField) nameField.hidden = (mode !== 'signup');
    var pass = form.querySelector('#signinPassword');
    if (pass) pass.setAttribute('autocomplete', mode === 'signup' ? 'new-password' : 'current-password');
    var submit = form.querySelector('#signinSubmit');
    if (submit) submit.textContent = (mode === 'signup') ? 'Đăng ký' : 'Đăng nhập';
  }

  function switchSigninIdType(type) {
    var form = document.getElementById('signinEmailForm');
    if (!form) return;
    var phone = (type === 'phone');
    form.setAttribute('data-idtype', phone ? 'phone' : 'email');
    Array.prototype.forEach.call(form.querySelectorAll('.auth-idbtn'), function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-type') === (phone ? 'phone' : 'email'));
    });
    var id = form.querySelector('#signinIdentity');
    if (!id) return;
    id.type = phone ? 'tel' : 'email';
    id.placeholder = phone ? '+84 9xx xxx xxx' : 'Email';
    id.setAttribute('inputmode', phone ? 'tel' : 'email');
    id.setAttribute('autocomplete', phone ? 'tel' : 'email');
    id.value = '';
    var m = form.querySelector('#signinMsg');
    if (m) m.textContent = '';
  }

  // Mirrors onAuthEmailSubmit below (same validation/sign-in calls), but
  // targets the modal's own #signin* fields and closes the modal on success
  // instead of leaving that to renderAuthBar's re-render.
  function onSigninEmailSubmit(form) {
    var mode = form.getAttribute('data-mode') || 'signin';
    var idtype = form.getAttribute('data-idtype') || 'email';
    var identity = fieldVal(form, '#signinIdentity');
    var pass = fieldVal(form, '#signinPassword');
    var name = fieldVal(form, '#signinName');
    var msg = form.querySelector('#signinMsg');
    var submit = form.querySelector('#signinSubmit');

    var email;
    if (idtype === 'phone') {
      email = phoneToEmail(identity);
      if (!email) {
        if (msg) msg.textContent = 'Số điện thoại phải kèm mã quốc gia, ví dụ +84…';
        return;
      }
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
      : sb.auth.signInWithPassword({ email: email, password: pass });
    p.then(function (res) {
      if (submit) submit.disabled = false;
      if (res.error) {
        if (msg) msg.textContent = translateAuthError(res.error.message);
        return;
      }
      if (res.data && !res.data.session) {
        if (msg) msg.textContent = 'Kiểm tra email để xác nhận tài khoản.';
        return;
      }
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

  function renderEmailForm() {
    var bar = document.getElementById('authBar');
    if (!bar) return;
    bar.classList.remove('is-guest');
    bar.innerHTML =
      '<form class="auth-email-form" id="authEmailForm" data-mode="signin" data-idtype="email" autocomplete="on">' +
        '<div class="auth-tabs">' +
          '<button type="button" class="auth-tab is-active" data-action="tab" data-mode="signin">Đăng nhập</button>' +
          '<button type="button" class="auth-tab" data-action="tab" data-mode="signup">Đăng ký</button>' +
        '</div>' +
        '<div class="auth-idtype">' +
          '<button type="button" class="auth-idbtn is-active" data-action="idtype" data-type="email">Email</button>' +
          '<button type="button" class="auth-idbtn" data-action="idtype" data-type="phone">Số điện thoại</button>' +
        '</div>' +
        '<input type="text" id="authName" class="auth-input" maxlength="' + NAME_MAX + '" placeholder="Tên hiển thị" hidden />' +
        '<input type="email" id="authIdentity" class="auth-input" placeholder="Email" required autocomplete="email" inputmode="email" />' +
        '<input type="password" id="authPassword" class="auth-input" placeholder="Mật khẩu (tối thiểu 6 ký tự)" required minlength="6" autocomplete="current-password" />' +
        '<div class="auth-email-row">' +
          '<span class="auth-msg" id="authMsg" role="status"></span>' +
          '<button type="submit" class="auth-btn" id="authSubmit">Đăng nhập</button>' +
        '</div>' +
        '<button type="button" class="auth-cancel" data-action="cancel">Huỷ</button>' +
      '</form>';
    defeatAutofillFont(bar);
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

  function switchAuthTab(mode) {
    var form = document.getElementById('authEmailForm');
    if (!form) return;
    form.setAttribute('data-mode', mode);
    Array.prototype.forEach.call(form.querySelectorAll('.auth-tab'), function (t) {
      t.classList.toggle('is-active', t.getAttribute('data-mode') === mode);
    });
    var nameField = form.querySelector('#authName');
    if (nameField) nameField.hidden = (mode !== 'signup');
    var pass = form.querySelector('#authPassword');
    if (pass) pass.setAttribute('autocomplete', mode === 'signup' ? 'new-password' : 'current-password');
    var submit = form.querySelector('#authSubmit');
    if (submit) submit.textContent = (mode === 'signup') ? 'Đăng ký' : 'Đăng nhập';
  }

  function switchIdType(type) {
    var form = document.getElementById('authEmailForm');
    if (!form) return;
    var phone = (type === 'phone');
    form.setAttribute('data-idtype', phone ? 'phone' : 'email');
    Array.prototype.forEach.call(form.querySelectorAll('.auth-idbtn'), function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-type') === (phone ? 'phone' : 'email'));
    });
    var id = form.querySelector('#authIdentity');
    if (!id) return;
    id.type = phone ? 'tel' : 'email';
    id.placeholder = phone ? '+84 9xx xxx xxx' : 'Email';
    id.setAttribute('inputmode', phone ? 'tel' : 'email');
    id.setAttribute('autocomplete', phone ? 'tel' : 'email');
    id.value = '';
    var m = form.querySelector('#authMsg');
    if (m) m.textContent = '';
  }

  function renderCompose() {
    var host = document.getElementById('commentCompose');
    if (!host) return;
    if (!authUser) {
      host.innerHTML = '<p class="compose-locked">Bạn cần đăng nhập để viết bình luận.</p>';
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
        if (titleEl) titleEl.textContent = 'Bình luận' + (rows.length ? ' (' + rows.length + ')' : '');
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
    if (!authUser) { flashAuthBar(); return; }
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
    if (!authUser) { flashAuthBar(); return; }
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
    var m = /\((\d+)\)/.exec(t.textContent || '');
    var n = Math.max(0, (m ? parseInt(m[1], 10) : 0) + delta);
    t.textContent = 'Bình luận' + (n > 0 ? ' (' + n + ')' : '');
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

  function onAuthEmailSubmit(form) {
    var mode = form.getAttribute('data-mode') || 'signin';
    var idtype = form.getAttribute('data-idtype') || 'email';
    var identity = fieldVal(form, '#authIdentity');
    var pass = fieldVal(form, '#authPassword');
    var name = fieldVal(form, '#authName');
    var msg = form.querySelector('#authMsg');
    var submit = form.querySelector('#authSubmit');

    var email;
    if (idtype === 'phone') {
      email = phoneToEmail(identity);
      if (!email) {
        if (msg) msg.textContent = 'Số điện thoại phải kèm mã quốc gia, ví dụ +84…';
        return;
      }
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
      : sb.auth.signInWithPassword({ email: email, password: pass });
    p.then(function (res) {
      if (submit) submit.disabled = false;
      if (res.error) {
        if (msg) msg.textContent = translateAuthError(res.error.message);
        return;
      }
      // Email confirmation is off, so signUp returns a session right away and
      // onAuthStateChange re-renders. This branch is only a safety net in case
      // confirmation gets switched on later.
      if (res.data && !res.data.session) {
        if (msg) msg.textContent = 'Kiểm tra email để xác nhận tài khoản.';
      }
    });
  }

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
    if (!authUser) { flashAuthBar(); return; }
    var li = btn.closest('.comment');
    if (!li) return;
    var col = li.querySelector('.comment-body-col');
    if (!col || col.querySelector(':scope > .comment-reply-form')) return;
    var parentId = topLevelCommentId(btn);
    if (!parentId) return;
    var form = document.createElement('form');
    form.className = 'comment-reply-form';
    form.setAttribute('data-parent', parentId);
    form.innerHTML =
      '<textarea class="comment-body" rows="2" maxlength="' + COMMENT_MAX + '" placeholder="Trả lời..." required></textarea>' +
      '<div class="comment-form-row">' +
        '<span class="comment-status comment-reply-status" role="status"></span>' +
        '<span class="comment-edit-btns">' +
          '<button type="button" class="comment-act" data-action="reply-cancel">Huỷ</button>' +
          '<button type="submit" class="auth-btn">Gửi</button>' +
        '</span>' +
      '</div>';
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

  function flashAuthBar() {
    var bar = document.getElementById('authBar');
    if (!bar) return;
    bar.classList.remove('flash');
    void bar.offsetWidth;
    bar.classList.add('flash');
    try { bar.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {}
  }

  // ---- one-time wiring (readerEl is stable across chapter renders) ----------

  function initEngagement() {
    if (!sb) return;

    // Slot for the avatar + "Xin chào … Đăng xuất", under the site title.
    var masthead = document.querySelector('.masthead');
    if (masthead && !document.getElementById('mastheadAuth')) {
      var slot = document.createElement('div');
      slot.className = 'masthead-auth';
      slot.id = 'mastheadAuth';
      slot.hidden = true;
      var titleEl = masthead.querySelector('.masthead-title');
      if (titleEl) masthead.insertBefore(slot, titleEl.nextSibling);
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
      else if (act === 'admin-inbox') { renderAdminInbox(); closeDrawer(); }
      else if (act === 'inbox-open') openInboxThread(a.getAttribute('data-uid'));
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
      }
    });
    document.addEventListener('change', function (ev) {
      if (ev.target && ev.target.id === 'chatFileInput') onChatFileChosen(ev.target, 'chat');
      else if (ev.target && ev.target.id === 'inboxFileInput') onChatFileChosen(ev.target, 'inbox');
    });
    document.addEventListener('input', function (ev) {
      if (ev.target && ev.target.classList && ev.target.classList.contains('chat-textarea')) {
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
      if (act === 'google') doGoogleSignIn();
      else if (act === 'email') renderEmailForm();
      else if (act === 'cancel') renderAuthBar(readerEl.getAttribute('data-chapter-id'));
      else if (act === 'tab') switchAuthTab(a.getAttribute('data-mode'));
      else if (act === 'idtype') switchIdType(a.getAttribute('data-type'));
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
    });

    readerEl.addEventListener('submit', function (ev) {
      var f = ev.target;
      if (!f) return;
      if (f.id === 'commentForm') { ev.preventDefault(); onCommentSubmit(f); }
      else if (f.id === 'authEmailForm') { ev.preventDefault(); onAuthEmailSubmit(f); }
      else if (f.classList && f.classList.contains('comment-edit-form')) { ev.preventDefault(); onCommentEditSave(f); }
      else if (f.classList && f.classList.contains('comment-reply-form')) { ev.preventDefault(); onCommentReplySubmit(f); }
    });

    function refresh() {
      renderMastheadAuth();
      updateAdminTocItem();
      if (authUser) {
        refreshChatUnreadBadge();
        if (authUser.isAdmin) loadInboxThreads();
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
        _pendingAdminInboxRoute = false;
        if (authUser && authUser.isAdmin) { renderAdminInbox(); return; }
      }
      // Safety net: if whoever's signed in stops being admin (signed out,
      // switched accounts) while the inbox is on screen, don't strand them
      // on an orphaned admin page — send them back to the last chapter.
      // Gated on _authSettled for the same reason as the pending-route
      // check above — authUser.isAdmin is unreliable mid-fetch.
      if (_authSettled && readerEl.querySelector('.admin-inbox') && !(authUser && authUser.isAdmin)) {
        renderChapter(loadLastChapter() || chapters[0].id, { push: false });
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

    // No realtime — just re-check unread counts every minute while someone's
    // signed in, same "poll rather than push" approach as the rest of this
    // feature (loadChatMessages/loadInboxThreads already re-fetch on open).
    setInterval(function () {
      if (!authUser) return;
      refreshChatUnreadBadge();
      if (authUser.isAdmin) loadInboxThreads();
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
    var id = routeHash() || loadLastChapter() || chapters[0].id;
    if (id === ADMIN_INBOX_ROUTE && authUser && authUser.isAdmin) { renderAdminInbox(); return; }
    renderChapter(id, { push: false });
  });
  searchEl.addEventListener('input', applySearch);
  readerEl.addEventListener('scroll', updateProgress);
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  if (mastheadCountEl) mastheadCountEl.textContent = chapters.length + ' chương';

  buildTOC();
  var startId = routeHash() || loadLastChapter() || chapters[0].id;
  // Admin status isn't known yet at this point (it resolves async via
  // Supabase) — show chapter 1 for now and let refresh()'s pending-route
  // check switch into the inbox once getSession() confirms this user
  // actually is the admin.
  _pendingAdminInboxRoute = (startId === ADMIN_INBOX_ROUTE);
  if (sb) initEngagement();
  if (_pendingAdminInboxRoute) {
    renderChapter(chapters[0].id, { silent: true });
  } else {
    renderChapter(startId);
  }
})();
