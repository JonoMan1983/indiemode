// ============================================================
//  INDIEMODE — APP.JS  (clean rewrite — cart+wishlist safe)
// ============================================================

// ── HELPERS ──────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const $$ = sel => Array.from(document.querySelectorAll(sel));

function img(key) { return IM.images[key] || 'img/prod-01.jpg'; }
function formatPrice(n) { return 'R\u00A0' + Number(n).toLocaleString('en-ZA'); }
function brandById(id) { return IM.brands.find(b => b.id === id) || {}; }

function badgeHTML(badge) {
  if (!badge) return '';
  var labels = { 'new': 'New Specimen', 'sale': 'On Sale', 'ltd': 'Limited Run' };
  return '<span class="pd-badge">' + (labels[badge] || badge) + '</span>';
}

function productCard(p, delay) {
  var d = delay || '';
  var brand = brandById(p.brand);
  var priceHTML = p.originalPrice
    ? '<span class="prod-orig">' + formatPrice(p.originalPrice) + '</span>' + formatPrice(p.price)
    : formatPrice(p.price);
  return (
    '<a href="product.html?id=' + p.id + '" class="prod-card reveal ' + d + '">' +
      '<div class="prod-img">' +
        '<img src="' + img(p.img) + '" alt="' + p.name + '" loading="lazy">' +
        badgeHTML(p.badge) +
        '<div class="prod-quick">View Product \u2192</div>' +
        '<button class="wish-btn prod-wish-overlay" data-wish-id="' + p.id + '" aria-label="Add to wishlist">\u2661</button>' +
      '</div>' +
      '<div class="prod-info">' +
        '<div class="prod-brand">' + (brand.name || '') + '</div>' +
        '<div class="prod-name">' + p.name + '</div>' +
        '<div class="prod-foot">' +
          '<div class="prod-price">' + priceHTML + '</div>' +
          '<div class="prod-stars">\u2605\u2605\u2605\u2605\u2605 <span class="prod-rev">(24)</span></div>' +
        '</div>' +
      '</div>' +
    '</a>'
  );
}

// ── TOAST ────────────────────────────────────────────────────
function showToast(msg, type) {
  var existing = document.getElementById('imToast');
  if (existing) existing.remove();
  var t = document.createElement('div');
  t.id = 'imToast';
  t.textContent = msg;
  var bg = (type === 'error') ? 'var(--primary)' : '#1E293B';
  t.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);background:' + bg + ';color:var(--text);font-family:var(--condensed);font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;padding:12px 24px;border-radius:2px;border:1px solid rgba(248,250,252,.12);z-index:9999;opacity:0;transition:all .25s;white-space:nowrap;box-shadow:0 8px 32px rgba(0,0,0,.4)';
  document.body.appendChild(t);
  requestAnimationFrame(function() {
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(function() {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(function() { t.remove(); }, 300);
  }, 2200);
}

// ── REVEAL ON SCROLL ─────────────────────────────────────────
function initReveal() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  $$('.reveal').forEach(function(el) { obs.observe(el); });
}

// ── NAV ──────────────────────────────────────────────────────
function renderNav() {
  var linksHTML = IM.nav.map(function(n) {
    return '<li><a href="' + n.href + (n.filter ? '?cat=' + n.filter : '') + '"' +
      (n.highlight ? ' class="nav-sale"' : '') + '>' + n.label + '</a></li>';
  }).join('');

  var wishBtn = '<button class="nav-wish-btn" onclick="Cart.openWishDrawer()" aria-label="Wishlist">' +
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 13.5S1.5 9.5 1.5 5.5A3.5 3.5 0 0 1 8 3.757 3.5 3.5 0 0 1 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>' +
    '<span class="wish-count" id="wishCount">0</span></button>';

  var cartBtn = '<button class="nav-cart" onclick="Cart.openDrawer()" aria-label="Open bag">' +
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 1H3L4.5 9.5H12.5L14 4H4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="12.5" r="1" fill="currentColor"/><circle cx="11" cy="12.5" r="1" fill="currentColor"/></svg>' +
    'Bag <span class="cart-count" id="cartCount">0</span></button>';

  var searchBtn = '<button class="nav-search-btn" onclick="openSearch()" aria-label="Search">' +
    '<svg width="17" height="17" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.4"/><path d="M13 13L16 16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button>';

  var navInner = '<div class="nav-inner">' +
    '<a href="index.html" class="nav-logo">Indie<span class="logo-accent">mode</span></a>' +
    '<ul class="nav-links">' + linksHTML + '</ul>' +
    '<div class="nav-right">' + searchBtn + wishBtn + cartBtn + '</div>' +
    '</div>';

  // Pages with dynamic nav (about, contact)
  var siteNav = document.getElementById('siteNav');
  if (siteNav) {
    siteNav.className = 'nav';
    siteNav.innerHTML = navInner;
  }

  // Pages with static nav shell
  $$('.nav-links').forEach(function(el) { el.innerHTML = linksHTML; });

  // Static nav right buttons wiring (pages with hardcoded nav-right)
  $$('.nav-right').forEach(function(el) {
    if (!el.querySelector('.nav-wish-btn')) {
      el.innerHTML = searchBtn + wishBtn + cartBtn;
    }
  });

  // Scroll behaviour
  var nav = document.getElementById('mainNav') || siteNav;
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
  }

  // Search
  window.openSearch = function() {
    var o = document.getElementById('sOverlay');
    if (o) { o.classList.add('open'); setTimeout(function() { var i = document.getElementById('sInput'); if (i) i.focus(); }, 60); }
  };
  window.closeSearch = function() {
    var o = document.getElementById('sOverlay'); if (o) o.classList.remove('open');
  };
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') window.closeSearch(); });
}

// ── HOME ──────────────────────────────────────────────────────
function initHome() {
  var heroImg = document.querySelector('.hero-r img');
  if (heroImg) heroImg.src = img('hero');

  var stats = {
    '.stat-designers': IM.stats.designers + '+',
    '.stat-pieces':    IM.stats.pieces + '+',
    '.stat-brands':    IM.stats.brands + '+',
  };
  Object.keys(stats).forEach(function(sel) {
    var el = document.querySelector(sel);
    if (el) el.textContent = stats[sel];
  });

  // Bento grid
  var bento = document.getElementById('bentoGrid');
  if (bento) {
    bento.innerHTML = IM.categories.map(function(c, i) {
      var cls = 'bento-cell reveal' + (i > 0 ? ' rd' + Math.min(i, 4) : '');
      return '<a href="shop.html?cat=' + c.id + '" class="' + cls + '">' +
        '<img src="' + img(c.img) + '" alt="' + c.label + '" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(0.7)">' +
        '<div class="bento-overlay"></div>' +
        '<div class="bento-label">' + c.label + '</div>' +
        '</a>';
    }).join('');
  }

  // Featured products
  var grid = document.getElementById('featuredGrid');
  if (grid) {
    var featured = IM.products.filter(function(p) { return p.featured; }).slice(0, 8);
    grid.innerHTML = featured.map(function(p, i) {
      var d = i < 2 ? '' : (i < 4 ? 'rd1' : (i < 6 ? 'rd2' : 'rd3'));
      return productCard(p, d);
    }).join('');
  }

  // Brands ticker
  var ticker = document.getElementById('brandTicker');
  if (ticker) {
    var items = IM.brands.map(function(b) { return '<span class="tick-item">' + b.name + '</span>'; }).join('');
    ticker.innerHTML = items + items;
  }

  // Featured brands
  var brandsGrid = document.getElementById('featuredBrands');
  if (brandsGrid) {
    brandsGrid.innerHTML = IM.brands.slice(0, 4).map(function(b) {
      return '<a href="designer.html?id=' + b.id + '" class="brand-card reveal">' +
        '<img src="' + img(b.img) + '" alt="' + b.name + '">' +
        '<div class="brand-card-body">' +
          '<div class="brand-card-name">' + b.name + '</div>' +
          '<div class="brand-card-loc">' + (b.location || 'South Africa') + '</div>' +
        '</div>' +
        '</a>';
    }).join('');
  }
}

// ── SHOP ──────────────────────────────────────────────────────
function initShop() {
  var params = new URLSearchParams(location.search);
  var cat = params.get('cat') || 'all';

  var filtered = cat === 'all'
    ? IM.products
    : cat === 'sale'
      ? IM.products.filter(function(p) { return p.badge === 'sale'; })
      : IM.products.filter(function(p) { return p.category === cat; });

  var grid = document.getElementById('shopGrid');
  if (grid) {
    grid.innerHTML = filtered.length
      ? filtered.map(function(p, i) { return productCard(p, i > 3 ? 'rd1' : ''); }).join('')
      : '<div class="empty-state">No pieces found in this category.</div>';
  }

  var countEl = document.getElementById('shopCount');
  if (countEl) countEl.textContent = filtered.length + ' pieces';

  // Filter buttons
  $$('.filter-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.cat === cat);
    btn.addEventListener('click', function() {
      var url = new URL(location.href);
      url.searchParams.set('cat', this.dataset.cat);
      location.href = url.toString();
    });
  });
}

// ── PRODUCT ───────────────────────────────────────────
function initProduct() {
  var params = new URLSearchParams(location.search);
  var id = params.get('id');
  var p = IM.products.find(function(x) { return x.id === id; });
  if (!p) return;

  var brand = brandById(p.brand);
  var brandLoc = [brand.city, brand.province].filter(Boolean).join(', ') || 'South Africa';

  // Breadcrumb
  var bcCat = document.getElementById('breadcrumb-cat');
  if (bcCat) bcCat.textContent = p.category ? (p.category.charAt(0).toUpperCase() + p.category.slice(1)) : 'Shop';
  var bcName = document.getElementById('breadcrumb-name');
  if (bcName) bcName.textContent = p.name;

  // Main image (note: HTML uses pdMainImgEl for the <img>, pdMainImg is the wrapper div)
  var mainImgEl = document.getElementById('pdMainImgEl');
  if (mainImgEl) mainImgEl.src = img(p.img);

  // Thumbnails — product data has a single img, so build thumb strip from
  // the same image (repeated) unless an imgs[] array is present
  var thumbs = document.getElementById('pdThumbs');
  if (thumbs) {
    var thumbKeys = (p.imgs && p.imgs.length) ? p.imgs : [p.img];
    thumbs.innerHTML = thumbKeys.map(function(k, i) {
      return '<div class="pd-thumb' + (i === 0 ? ' active' : '') + '" onclick="swapImg(this)">' +
        '<img src="' + img(k) + '" alt="' + p.name + ' view ' + (i + 1) + '" loading="lazy"></div>';
    }).join('');
  }

  // Badge (wrapper exists in HTML as pdBadgeWrap)
  var bdgWrap = document.getElementById('pdBadgeWrap');
  if (bdgWrap) {
    if (p.badge) {
      var label = { 'new': 'New Specimen', 'sale': 'On Sale', 'ltd': 'Limited Run' }[p.badge] || p.badge;
      bdgWrap.innerHTML = '<span class="pd-badge">' + label + '</span>';
    } else {
      bdgWrap.innerHTML = '';
    }
  }

  // Spec line (top of info column)
  var specEl = document.getElementById('pdSpec');
  if (specEl) specEl.textContent = (brand.category || 'Specimen') + ' — SS 2026';

  // Brand link
  var brandLink = document.getElementById('pdBrandLink');
  if (brandLink) {
    brandLink.textContent = brand.name || '';
    brandLink.href = 'designer.html?id=' + p.brand;
  }

  // Name / price / desc
  var nameEl = document.getElementById('pdName');
  if (nameEl) nameEl.textContent = p.name;
  var priceEl = document.getElementById('pdPrice');
  if (priceEl) {
    priceEl.innerHTML = p.originalPrice
      ? '<span class="prod-orig">' + formatPrice(p.originalPrice) + '</span>' + formatPrice(p.price)
      : formatPrice(p.price);
  }
  var descEl = document.getElementById('pdDesc');
  if (descEl) descEl.textContent = p.description || '';

  // Reviews count (static placeholder kept consistent with card stars)
  var revEl = document.getElementById('pdRevCount');
  if (revEl) revEl.textContent = '(24 reviews)';

  // Attributes — material / origin / run / care
  var attrsEl = document.getElementById('pdAttrs');
  if (attrsEl) {
    var attrRows = [
      ['Material', p.material],
      ['Origin',   p.origin],
      ['Run',      p.run],
      ['Care',     p.care],
    ].filter(function(row) { return row[1]; });
    attrsEl.innerHTML = attrRows.map(function(row) {
      return '<div class="pd-attr-item"><div class="pd-attr-key">' + row[0] + '</div><div class="pd-attr-val">' + row[1] + '</div></div>';
    }).join('');
  }

  // Sizes
  var sizesEl = document.getElementById('pdSizes');
  if (sizesEl && p.sizes) {
    sizesEl.innerHTML = p.sizes.map(function(s) {
      var sold = p.soldOut && p.soldOut.includes(s);
      return '<button class="size-btn' + (sold ? ' sold' : '') + '" onclick="selectSize(this)"' + (sold ? ' disabled' : '') + '>' + s + '</button>';
    }).join('');
  }

  window.selectSize = function(btn) {
    $$('.size-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
  };

  // Add to Bag
  var atbBtn = document.getElementById('pdAtbBtn');
  if (atbBtn) {
    atbBtn.onclick = function() {
      var active = document.querySelector('.size-btn.active');
      if (!active) {
        showToast('Please select a size first', 'error');
        var sizesDiv = document.querySelector('.pd-sizes');
        if (sizesDiv) {
          sizesDiv.classList.add('size-shake');
          setTimeout(function() { sizesDiv.classList.remove('size-shake'); }, 500);
        }
        return;
      }
      if (typeof Cart !== 'undefined') Cart.add(p.id, active.textContent.trim());
    };
  }

  // Wish button
  var wishBtn = document.getElementById('pdWishBtn');
  if (wishBtn && typeof Cart !== 'undefined') {
    wishBtn.dataset.wishId = p.id;
    var wished = Cart.isWished(p.id);
    wishBtn.innerHTML = wished ? '\u2665' : '\u2661';
    wishBtn.classList.toggle('wished', wished);
  }

  // Designer block
  var dsImg = document.getElementById('pdDesignerImg');
  if (dsImg) {
    var dsImgTag = dsImg.querySelector('img');
    if (dsImgTag) dsImgTag.src = img(brand.img);
  }
  var dsName = document.getElementById('pdDesignerName');
  if (dsName) dsName.textContent = brand.name || '';
  var dsLoc = document.getElementById('pdDesignerLoc');
  if (dsLoc) dsLoc.textContent = brandLoc;
  var dsLink = document.getElementById('pdDesignerLink');
  if (dsLink) dsLink.href = 'designer.html?id=' + p.brand;

  // Related products — same category, excluding current item
  var relatedGrid = document.getElementById('relatedGrid');
  if (relatedGrid) {
    var related = IM.products.filter(function(x) {
      return x.category === p.category && x.id !== p.id;
    }).slice(0, 4);
    if (!related.length) {
      related = IM.products.filter(function(x) { return x.id !== p.id; }).slice(0, 4);
    }
    relatedGrid.innerHTML = related.map(function(rp, i) { return productCard(rp, i > 1 ? 'rd1' : ''); }).join('');
  }
  var seeAll = document.getElementById('relatedSeeAll');
  if (seeAll) seeAll.href = 'shop.html?cat=' + p.category;

  // Image swap
  window.swapImg = function(thumbWrap) {
    var src = thumbWrap.querySelector('img').src;
    if (mainImgEl) mainImgEl.src = src;
    $$('.pd-thumb').forEach(function(t) { t.classList.remove('active'); });
    thumbWrap.classList.add('active');
  };
}

// ── BRANDS ────────────────────────────────────────────────────
function initBrands() {
  var grid = document.getElementById('brandsGrid');
  if (!grid) return;
  grid.innerHTML = IM.brands.map(function(b) {
    return '<a href="designer.html?id=' + b.id + '" class="brand-card reveal">' +
      '<img src="' + img(b.img) + '" alt="' + b.name + '">' +
      '<div class="brand-card-body">' +
        '<div class="brand-card-name">' + b.name + '</div>' +
        '<div class="brand-card-loc">' + (b.location || 'South Africa') + '</div>' +
        '<div class="brand-card-desc">' + (b.tagline || '') + '</div>' +
      '</div>' +
      '</a>';
  }).join('');
}

// ── DESIGNER ──────────────────────────────────────────────────
function initDesigner() {
  var params = new URLSearchParams(location.search);
  var id = params.get('id');
  var b = IM.brands.find(function(x) { return x.id === id; });
  if (!b) return;

  var fields = { 'dsName': b.name, 'dsTagline': b.tagline, 'dsLocation': b.location, 'dsBio': b.bio };
  Object.keys(fields).forEach(function(fid) {
    var el = document.getElementById(fid);
    if (el) el.textContent = fields[fid] || '';
  });

  var heroImg = document.getElementById('dsHeroImg');
  if (heroImg) heroImg.src = img(b.img);

  var grid = document.getElementById('dsGrid');
  if (grid) {
    var pieces = IM.products.filter(function(p) { return p.brand === id; });
    grid.innerHTML = pieces.map(function(p, i) { return productCard(p, i > 1 ? 'rd1' : ''); }).join('');
  }
}

// ── ABOUT ─────────────────────────────────────────────────────
function initAbout() {
  var heroImg = document.getElementById('aboutHeroImg');
  if (heroImg) heroImg.src = img('editorial');

  var el = document.getElementById('aboutStatDesigners');
  if (el) el.innerHTML = IM.stats.designers + '<span>+</span>';
  el = document.getElementById('aboutStatPieces');
  if (el) el.innerHTML = IM.stats.pieces + '<span>+</span>';
}

// ── CONTACT ───────────────────────────────────────────────────
function initContact() {
  var el = document.getElementById('contactEmail');
  if (el) el.textContent = IM.site.email;
}

// ── LIVE SEARCH ───────────────────────────────────────────────
function initSearch() {
  var input = document.getElementById('sInput');
  if (!input) return;
  var results = document.getElementById('sResults');
  if (!results) return;

  input.addEventListener('input', function() {
    var q = this.value.toLowerCase().trim();
    if (q.length < 2) { results.innerHTML = ''; return; }

    var brandMatches = IM.brands.filter(function(b) {
      return b.name.toLowerCase().includes(q) || (b.tagline || '').toLowerCase().includes(q);
    }).slice(0, 3);

    var prodMatches = IM.products.filter(function(p) {
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }).slice(0, 5);

    var html = '';
    if (brandMatches.length) {
      html += '<div style="font-family:var(--condensed);font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--secondary);margin:16px 0 8px">Brands</div>';
      html += brandMatches.map(function(b) {
        return '<a href="designer.html?id=' + b.id + '" onclick="closeSearch()" style="display:flex;align-items:center;gap:14px;padding:10px 14px;background:rgba(248,250,252,.03);border:1px solid var(--border);border-radius:2px;margin-bottom:6px">' +
          '<img src="' + img(b.img) + '" style="width:36px;height:36px;object-fit:cover;border-radius:1px">' +
          '<div><div style="font-family:var(--serif);font-size:16px">' + b.name + '</div>' +
          '<div style="font-family:var(--condensed);font-size:9px;letter-spacing:.12em;color:var(--muted)">' + (b.location || '') + '</div></div></a>';
      }).join('');
    }
    if (prodMatches.length) {
      html += '<div style="font-family:var(--condensed);font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--secondary);margin:16px 0 8px">Pieces</div>';
      html += prodMatches.map(function(p) {
        var brand = brandById(p.brand);
        return '<a href="product.html?id=' + p.id + '" onclick="closeSearch()" style="display:flex;align-items:center;gap:14px;padding:10px 14px;background:rgba(248,250,252,.03);border:1px solid var(--border);border-radius:2px;margin-bottom:6px">' +
          '<img src="' + img(p.img) + '" style="width:36px;height:48px;object-fit:cover;object-position:center top;border-radius:1px">' +
          '<div><div style="font-family:var(--serif);font-size:16px">' + p.name + '</div>' +
          '<div style="font-family:var(--condensed);font-size:9px;letter-spacing:.12em;color:var(--muted)">' + (brand.name || '') + ' \u00B7 ' + formatPrice(p.price) + '</div></div></a>';
      }).join('');
    }
    if (!html) html = '<div style="font-family:var(--condensed);font-size:10px;color:var(--muted);padding:20px 0">No results for "' + q + '"</div>';
    results.innerHTML = html;
  });
}

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  renderNav();

  var page = location.pathname.split('/').pop().replace('.html', '') || 'index';
  var pageMap = {
    'index':       initHome,
    '':            initHome,
    'shop':        initShop,
    'product':     initProduct,
    'brands':      initBrands,
    'designer':    initDesigner,
    'about':       initAbout,
    'contact':     initContact,
    'clothing':    function() {},
    'swimwear':    function() {},
    'jewellery':   function() {},
    'accessories': function() {},
    'cart':        function() {},
  };

  if (pageMap[page]) pageMap[page]();
  initReveal();
  initSearch();

  // ── CART + WISHLIST ───────────────────────────────────────
  if (typeof Cart !== 'undefined') {
    Cart.init();
    // Delegated wish button handler — works for dynamically rendered cards
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-wish-id]');
      if (!btn) return;
      // Don't intercept if it's the product page detail wish btn (handled separately)
      if (btn.id === 'pdWishBtn') return;
      e.preventDefault();
      e.stopPropagation();
      var id = btn.dataset.wishId;
      var isNow = Cart.toggleWish(id);
      btn.innerHTML = isNow ? '\u2665' : '\u2661';
      btn.classList.toggle('wished', isNow);
    });
    setTimeout(function() { Cart.syncAllWishBtnsAll(); }, 150);
  }
});
