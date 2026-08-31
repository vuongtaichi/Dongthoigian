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

    saveLastChapter(ch.id);

    if (sb) renderEngagement(ch.id);

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
    { emoji: '😮', label: 'Ngạc nhiên' },
    { emoji: '😢', label: 'Buồn' }
  ];
  var COMMENT_MAX = 2000;
  var NAME_MAX = 60;

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
    return m.full_name || m.name || (u.email ? u.email.split('@')[0] : 'Người đọc');
  }
  function applyAuthUser(u) {
    authUser = u ? { id: u.id, name: displayNameFromUser(u) } : null;
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
        '<div class="reactions" id="reactions"></div>' +
        '<div class="auth-bar" id="authBar"></div>' +
        '<div class="comments">' +
          '<h3 class="comments-title" id="commentsTitle">Bình luận</h3>' +
          '<div class="comment-compose" id="commentCompose"></div>' +
          '<ul class="comment-list" id="commentList"></ul>' +
        '</div>' +
      '</section>';
  }

  function commentLi(c) {
    var mine = authUser && c.user_id === authUser.id;
    var name = c._name || (c.profiles && c.profiles.display_name) || 'Người đọc';
    return '<li class="comment' + (mine ? ' is-mine' : '') + '" data-id="' + c.id + '">' +
        '<div class="comment-head">' +
          '<span class="comment-author">' + escapeHtml(name) + '</span>' +
          '<span class="comment-time">' + escapeHtml(relTime(c.created_at)) +
            (c.edited_at ? ' · đã sửa' : '') + '</span>' +
        '</div>' +
        '<div class="comment-text">' + escapeHtml(c.body || '').replace(/\r?\n/g, '<br>') + '</div>' +
        (mine ? '<div class="comment-actions"><button type="button" class="comment-del" data-action="del">Xoá</button></div>' : '') +
      '</li>';
  }

  // ---- rendering ------------------------------------------------------------

  function renderEngagement(chapterId) {
    if (!sb) return;
    var token = ++engToken;
    renderReactionBar(chapterId, token);
    renderAuthBar(chapterId);
    renderCompose();
    loadComments(chapterId, token);
  }

  function renderReactionBar(chapterId, token) {
    var host = document.getElementById('reactions');
    if (!host) return;
    host.innerHTML = REACTIONS.map(function (r) {
      return '<button type="button" class="reaction" data-emoji="' + escapeHtml(r.emoji) +
        '" title="' + escapeHtml(r.label) + '" aria-label="' + escapeHtml(r.label) + '">' +
        '<span class="reaction-emoji">' + r.emoji + '</span>' +
        '<span class="reaction-count">·</span></button>';
    }).join('');
    sb.from('reactions').select('emoji, user_id').eq('chapter_id', chapterId).then(function (res) {
      if (token !== engToken) return;
      var rows = (res && res.data) || [];
      var counts = {}, mine = {};
      rows.forEach(function (row) {
        counts[row.emoji] = (counts[row.emoji] || 0) + 1;
        if (authUser && row.user_id === authUser.id) mine[row.emoji] = true;
      });
      Array.prototype.forEach.call(host.querySelectorAll('.reaction'), function (btn) {
        var e = btn.getAttribute('data-emoji');
        var c = counts[e] || 0;
        btn.querySelector('.reaction-count').textContent = c ? String(c) : '·';
        btn.classList.toggle('reacted', !!mine[e]);
      });
    });
  }

  function renderAuthBar(chapterId) {
    var bar = document.getElementById('authBar');
    if (!bar) return;
    if (authUser) {
      bar.innerHTML =
        '<span class="auth-who">Xin chào, <strong>' + escapeHtml(authUser.name || 'bạn') + '</strong></span>' +
        '<button type="button" class="auth-btn auth-ghost" data-action="signout">Đăng xuất</button>';
    } else {
      bar.innerHTML =
        '<span class="auth-prompt">Đăng nhập để bình luận và bày tỏ cảm xúc:</span>' +
        '<button type="button" class="auth-btn" data-action="google">Đăng nhập bằng Google</button>' +
        '<button type="button" class="auth-btn auth-ghost" data-action="email">Dùng email</button>';
    }
  }

  function renderEmailForm() {
    var bar = document.getElementById('authBar');
    if (!bar) return;
    bar.innerHTML =
      '<form class="auth-email-form" id="authEmailForm" data-mode="signin" autocomplete="on">' +
        '<div class="auth-tabs">' +
          '<button type="button" class="auth-tab is-active" data-action="tab" data-mode="signin">Đăng nhập</button>' +
          '<button type="button" class="auth-tab" data-action="tab" data-mode="signup">Đăng ký</button>' +
        '</div>' +
        '<input type="text" id="authName" class="auth-input" maxlength="' + NAME_MAX + '" placeholder="Tên hiển thị" hidden />' +
        '<input type="email" id="authEmail" class="auth-input" placeholder="Email" required autocomplete="email" />' +
        '<input type="password" id="authPassword" class="auth-input" placeholder="Mật khẩu (tối thiểu 6 ký tự)" required minlength="6" autocomplete="current-password" />' +
        '<div class="auth-email-row">' +
          '<span class="auth-msg" id="authMsg" role="status"></span>' +
          '<button type="submit" class="auth-btn" id="authSubmit">Đăng nhập</button>' +
        '</div>' +
        '<button type="button" class="auth-cancel" data-action="cancel">Huỷ</button>' +
      '</form>';
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
          '<button type="submit" class="comment-submit" id="commentSubmit">Gửi bình luận</button>' +
        '</div>' +
      '</form>';
  }

  function loadComments(chapterId, token) {
    var list = document.getElementById('commentList');
    if (list) list.innerHTML = '<li class="comment-empty">Đang tải bình luận...</li>';
    sb.from('comments')
      .select('id, body, created_at, edited_at, user_id, profiles(display_name)')
      .eq('chapter_id', chapterId)
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(300)
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
        list2.innerHTML = rows.map(commentLi).join('');
      });
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
    var email = fieldVal(form, '#authEmail');
    var pass = fieldVal(form, '#authPassword');
    var name = fieldVal(form, '#authName');
    var msg = form.querySelector('#authMsg');
    var submit = form.querySelector('#authSubmit');
    if (!email || pass.length < 6) {
      if (msg) msg.textContent = 'Kiểm tra lại email và mật khẩu (tối thiểu 6 ký tự).';
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

  function onReactionClick(btn) {
    if (!sb) return;
    if (!authUser) { flashAuthBar(); return; }
    var chapterId = readerEl.getAttribute('data-chapter-id');
    var emoji = btn.getAttribute('data-emoji');
    var countEl = btn.querySelector('.reaction-count');
    var had = btn.classList.contains('reacted');
    var cur = parseInt(countEl.textContent, 10);
    if (isNaN(cur)) cur = 0;
    btn.classList.toggle('reacted', !had);
    var next = had ? Math.max(0, cur - 1) : cur + 1;
    countEl.textContent = next ? String(next) : '·';
    btn.disabled = true;
    var op = had
      ? sb.from('reactions').delete().match({ chapter_id: chapterId, emoji: emoji, user_id: authUser.id })
      : sb.from('reactions').insert({ chapter_id: chapterId, emoji: emoji, user_id: authUser.id });
    op.then(function (res) {
      btn.disabled = false;
      if (res && res.error && res.error.code !== '23505') {
        btn.classList.toggle('reacted', had);
        countEl.textContent = cur ? String(cur) : '·';
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
    sb.from('comments').delete().match({ id: id, user_id: authUser.id }).then(function (res) {
      if (res && res.error) { btn.disabled = false; return; }
      if (li.parentNode) li.parentNode.removeChild(li);
      bumpCount(-1);
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

    readerEl.addEventListener('click', function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      var rb = t.closest('.reaction');
      if (rb) { onReactionClick(rb); return; }
      var a = t.closest('[data-action]');
      if (!a) return;
      var act = a.getAttribute('data-action');
      if (act === 'google') doGoogleSignIn();
      else if (act === 'signout') doSignOut();
      else if (act === 'email') renderEmailForm();
      else if (act === 'cancel') renderAuthBar(readerEl.getAttribute('data-chapter-id'));
      else if (act === 'tab') switchAuthTab(a.getAttribute('data-mode'));
      else if (act === 'del') onCommentDelete(a);
    });

    readerEl.addEventListener('submit', function (ev) {
      if (ev.target && ev.target.id === 'commentForm') { ev.preventDefault(); onCommentSubmit(ev.target); }
      else if (ev.target && ev.target.id === 'authEmailForm') { ev.preventDefault(); onAuthEmailSubmit(ev.target); }
    });

    function refresh() {
      var cid = readerEl.getAttribute('data-chapter-id');
      if (cid) renderEngagement(cid);
    }
    sb.auth.getSession().then(function (res) {
      applyAuthUser(res && res.data && res.data.session ? res.data.session.user : null);
      refresh();
    });
    sb.auth.onAuthStateChange(function (_evt, session) {
      applyAuthUser(session ? session.user : null);
      refresh();
    });
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
    var id = routeHash() || loadLastChapter() || chapters[0].id;
    renderChapter(id, { push: false });
  });
  searchEl.addEventListener('input', applySearch);
  readerEl.addEventListener('scroll', updateProgress);
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  if (mastheadCountEl) mastheadCountEl.textContent = chapters.length + ' chương';

  buildTOC();
  if (sb) initEngagement();
  var startId = routeHash() || loadLastChapter() || chapters[0].id;
  renderChapter(startId);
})();
