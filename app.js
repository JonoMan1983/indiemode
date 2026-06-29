// ============================================================
//  INDIEMODE — SHARED RENDERING ENGINE
//  Reads from data.js, renders all dynamic content
// ============================================================

// ── HELPERS ─────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

function img(key) {
  return IM.images[key] || 'img/placeholder.jpg';
}

function brandById(id) {
  return IM.brands.find(b => b.id === id) || {};
}

function formatPrice(p) {
  return 'R ' + p.toLocaleString('en-ZA');
}

// ── TOAST NOTIFICATION ──────────────────────────────
function showToast(msg, type='info') {
  const existing = document.getElementById('imToast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.id = 'imToast';
  t.textContent = msg;
  t.style.cssText = `position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);
    background:${type==='error'?'var(--primary)':'#1E293B'};color:var(--text);
    font-family:var(--condensed);font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
    padding:12px 24px;border-radius:2px;border:1px solid rgba(248,250,252,.12);
    z-index:9999;opacity:0;transition:all .25s;white-space:nowrap;
    box-shadow:0 8px 32px rgba(0,0,0,.4)`;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)'; });
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(10px)'; setTimeout(()=>t.remove(),300); }, 2200);
}

function badgeHTML(badge) {
  if (!badge) return '';
  const map = { new: ['bdg-new','New'], sale: ['bdg-sale','Sale'], ltd: ['bdg-ltd','Ltd'] };
  const [cls, label] = map[badge] || ['',''];
  return cls ? `<span class="prod-badge ${cls}">${label}</span>` : '';
}

// ── NAV ─────────────────────────────────────────────────────
function renderNav() {
  const links = IM.nav.map(n =>
    `<li><a href="${n.href}${n.filter ? '?cat='+n.filter : ''}"${n.highlight ? ' class="nav-sale"' : ''}>${n.label}</a></li>`
  ).join('');

  // For pages that render nav via app.js (about, contact — have <nav id="siteNav">)
  const siteNav = document.getElementById('siteNav');
  if (siteNav) {
    siteNav.className = 'nav';
    siteNav.innerHTML = `
      <div class="nav-inner">
        <a href="index.html" class="nav-logo">Indie<span class="logo-accent">mode</span></a>
        <ul class="nav-links">${links}</ul>
        <div class="nav-right">
          <button class="nav-search-btn" onclick="openSearch()" aria-label="Search">
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.4"/><path d="M13 13L16 16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          </button>
          <button class="nav-wish-btn" onclick="Cart.openWishDrawer()" aria-label="Wishlist">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 13.5S1.5 9.5 1.5 5.5A3.5 3.5 0 0 1 8 3.757 3.5 3.5 0 0 1 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
            <span class="wish-count" id="wishCount">0</span>
          </button>
          <button class="nav-cart" onclick="Cart.openDrawer()" aria-label="Open bag">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 1H3L4.5 9.5H12.5L14 4H4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="12.5" r="1" fill="currentColor"/><circle cx="11" cy="12.5" r="1" fill="currentColor"/></svg>
            Bag <span class="cart-count" id="cartCount">0</span>
          </button>
        </div>
      </div>`;
    window.addEventListener('scroll', () =>
      siteNav.classList.toggle('scrolled', scrollY > 80), {passive:true});
  }

  // For pages with static nav HTML — just populate the links
  document.querySelectorAll('.nav-links').forEach(el => el.innerHTML = links);

  // Scroll behaviour for static nav
  const nav = document.getElementById('mainNav');
  if (nav) window.addEventListener('scroll', () =>
    nav.classList.toggle('scrolled', scrollY > 80), {passive:true});

  // Search
  window.openSearch  = () => {
    const o = $('sOverlay'); if(o) { o.classList.add('open'); setTimeout(()=>{ const i=$('sInput'); if(i)i.focus(); },60); }
  };
  window.closeSearch = () => { const o=$('sOverlay'); if(o) o.classList.remove('open'); };
  document.addEventListener('keydown', e => { if(e.key==='Escape') closeSearch(); });

  // Cart & Wishlist — handled by Cart module (cart.js)
}

// ── PRODUCT CARD ────────────────────────────────────────────
function productCard(p, delay='') {
  const brand = brandById(p.brand);
  const priceHTML = p.originalPrice
    ? `<span class="prod-orig">${formatPrice(p.originalPrice)}</span>${formatPrice(p.price)}`
    : formatPrice(p.price);
  return `
  <a href="product.html?id=${p.id}" class="prod-card reveal ${delay}">
    <div class="prod-img">
      <img src="${img(p.img)}" alt="${p.name}" loading="lazy">
      ${badgeHTML(p.badge)}
      <div class="prod-quick">View Product →</div>
      <button class="wish-btn prod-wish-overlay" data-wish-id="${p.id}"
        onclick="event.preventDefault();event.stopPropagation();
          if(typeof Cart!=='undefined'){const isNow=Cart.toggleWish('${p.id}');
          this.innerHTML=isNow?'♥':'♡';this.classList.toggle('wished',isNow)}"
        aria-label="Add to wishlist">♡</button>
    </div>
    <div class="prod-info">
      <div class="prod-brand">${brand.name || ''}</div>
      <div class="prod-name">${p.name}</div>
      <div class="prod-foot">
        <div class="prod-price">${priceHTML}</div>
        <div class="prod-stars">★★★★★ <span class="prod-rev">(24)</span></div>
      </div>
    </div>
  </a>`;
}

// ── BRAND CARD ──────────────────────────────────────────────
function brandCard(b, delay='') {
  return `
  <a href="designer.html?id=${b.id}" class="brand-card reveal ${delay}">
    <div class="brand-img">
      <img src="${img(b.img)}" alt="${b.name}" loading="lazy">
      <div class="brand-ov"></div>
      <div class="brand-loc">📍 ${b.city}</div>
    </div>
    <div class="brand-info">
      <div class="brand-cat">${b.category}</div>
      <div class="brand-name">${b.name}</div>
      <div class="brand-foot">
        <span class="brand-count">${b.pieces} pieces</span>
        <span class="brand-arrow">→</span>
      </div>
    </div>
  </a>`;
}

// ── SCROLL REVEAL ───────────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }});
  }, {threshold:.08, rootMargin:'0px 0px -24px 0px'});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── URL PARAMS ──────────────────────────────────────────────
function getParam(key) {
  return new URLSearchParams(location.search).get(key);
}

// ── PAGE: HOME ──────────────────────────────────────────────
function initHome() {
  // Hero image
  const heroImg = document.querySelector('.hero-r img');
  if (heroImg) heroImg.src = img('hero');

  // Stats
  const stats = {
    '.stat-designers': IM.stats.designers,
    '.stat-pieces': IM.stats.pieces,
    '.stat-made': IM.stats.madeInSA,
  };
  Object.entries(stats).forEach(([sel,val]) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = val;
  });

  // Featured products (first 4)
  const grid = document.querySelector('.prods-grid');
  if (grid) {
    const featured = IM.products.filter(p => p.featured).slice(0,4);
    grid.innerHTML = featured.map((p,i) => productCard(p, ['','rd1','rd2','rd3','rd4'][i])).join('');
  }

  // Bento categories
  const bento = document.querySelector('.bento');
  if (bento) {
    bento.innerHTML = IM.categories.map((c,i) => `
    <a href="shop.html?cat=${c.id}" class="bento-cell reveal ${i>0?'rd'+Math.min(i,4):''}">
      <img src="${img(c.img)}" alt="${c.label}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(0.55) brightness(0.65);transition:transform .5s ease;">
      <div class="bento-ov"></div>
      <div class="bento-mark"></div>
      <div class="bento-lbl">
        <div class="bento-cat">${c.label}</div>
        <div class="bento-cnt">${c.count} Specimens</div>
      </div>
      <div class="bento-arr">→</div>
    </a>`).join('');
  }

  // Editorial image
  const edImg = document.querySelector('.ed-frame img');
  if (edImg) edImg.src = img('editorial');
}

// ── PAGE: SHOP ──────────────────────────────────────────────
function initShop() {
  const activeCat = getParam('cat') || 'all';
  let products = [...IM.products];

  if (activeCat && activeCat !== 'all') {
    if (activeCat === 'sale') {
      products = products.filter(p => p.badge === 'sale');
    } else if (activeCat === 'clothing') {
      products = products.filter(p => ['dresses','tops','bottoms','swimwear'].includes(p.category));
    } else {
      products = products.filter(p => p.category === activeCat);
    }
  }

  const grid = document.querySelector('.prods-grid');
  if (grid) {
    grid.innerHTML = products.length
      ? products.map((p,i) => productCard(p, ['rd1','rd2','rd3','rd4'][i%4])).join('')
      : '<div style="padding:60px;color:var(--muted);font-family:var(--condensed);letter-spacing:.1em">No products in this category yet.</div>';
  }

  // Active filter button
  $$('.filter-btn').forEach(btn => {
    const cat = btn.dataset.cat || 'all';
    if (cat === activeCat) btn.classList.add('active');
    btn.addEventListener('click', () => {
      const url = cat === 'all' ? 'shop.html' : `shop.html?cat=${cat}`;
      location.href = url;
    });
  });

  // Count
  const countEl = document.querySelector('.shop-count');
  if (countEl) countEl.textContent = `${products.length} pieces`;
}

// ── PAGE: PRODUCT DETAIL ────────────────────────────────────
function initProduct() {
  const id = getParam('id') || IM.products[0].id;
  const p = IM.products.find(x => x.id === id) || IM.products[0];
  const brand = brandById(p.brand);

  // Image
  const pImg = document.querySelector('.pd-gallery img');
  if (pImg) pImg.src = img(p.img);

  // Text fields
  const fields = {
    '.pd-brand':    brand.name,
    '.pd-name':     p.name,
    '.pd-desc':     p.description,
    '.pd-designer-name': brand.name,
    '.pd-designer-loc':  `📍 ${brand.city}, ${brand.province}`,
  };
  Object.entries(fields).forEach(([sel,val]) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = val || '';
  });

  // Price
  const priceEl = document.querySelector('.pd-price');
  if (priceEl) {
    priceEl.innerHTML = p.originalPrice
      ? `<span style="font-size:16px;color:var(--dim);text-decoration:line-through;margin-right:10px">${formatPrice(p.originalPrice)}</span>${formatPrice(p.price)}`
      : formatPrice(p.price);
  }

  // Attributes
  const attrs = [
    ['Material', p.material],
    ['Origin',   p.origin],
    ['Run',      p.run],
    ['Care',     p.care],
  ];
  const attrEl = document.querySelector('.pd-attr');
  if (attrEl) {
    attrEl.innerHTML = attrs.map(([k,v]) => `
    <div class="pd-attr-item">
      <div class="pd-attr-key">${k}</div>
      <div class="pd-attr-val">${v}</div>
    </div>`).join('');
  }

  // Sizes
  const sizeGrid = document.querySelector('.pd-size-grid');
  if (sizeGrid && p.sizes) {
    sizeGrid.innerHTML = p.sizes.map(s => {
      const sold = p.soldOut && p.soldOut.includes(s);
      return `<button class="size-btn${sold?' sold':''}" onclick="selectSize(this)" ${sold?'disabled':''}>${s}</button>`;
    }).join('');
    // Default select first available
    const first = sizeGrid.querySelector('.size-btn:not(.sold)');
    if (first) first.classList.add('active');
  }

  // Badge
  const bdgWrap = document.querySelector('.pd-badge-wrap');
  if (bdgWrap) bdgWrap.innerHTML = p.badge ? `<span class="pd-badge">${{new:'New Specimen',sale:'On Sale',ltd:'Limited Run'}[p.badge]}</span>` : '';

  // Designer link
  const desLink = document.querySelector('.pd-designer-link');
  if (desLink) desLink.href = `designer.html?id=${p.brand}`;

  window.selectSize = btn => {
    $$('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };

  // Wire Add to Bag
  const atbBtn = document.getElementById('pdAtbBtn');
  if (atbBtn) {
    atbBtn.onclick = () => {
      const active = document.querySelector('.size-btn.active');
      if (!active) {
        showToast('Please select a size first');
        document.querySelector('.pd-sizes')?.classList.add('size-shake');
        setTimeout(() => document.querySelector('.pd-sizes')?.classList.remove('size-shake'), 500);
        return;
      }
      const size = active.textContent.trim();
      if (typeof Cart !== 'undefined') Cart.add(p.id, size);
    };
  }

  // Wire wishlist heart button
  const wishBtn = document.getElementById('pdWishBtn');
  if (wishBtn && typeof Cart !== 'undefined') {
    wishBtn.dataset.wishId = p.id;
    wishBtn.classList.toggle('wished', Cart.isWished(p.id));
    wishBtn.textContent = Cart.isWished(p.id) ? '♥' : '♡';
    wishBtn.onclick = () => {
      const isNow = Cart.toggleWish(p.id);
      wishBtn.textContent = isNow ? '♥' : '♡';
      wishBtn.classList.toggle('wished', isNow);
    };
  }
}

// ── PAGE: BRANDS ────────────────────────────────────────────
function initBrands() {
  const grid = document.querySelector('.brand-grid');
  if (grid) {
    grid.innerHTML = IM.brands.map((b,i) =>
      brandCard(b, ['','rd1','rd2','rd3'][i%4])
    ).join('');
  }
  // Stats
  const countEl = document.querySelector('.brands-count');
  if (countEl) countEl.textContent = IM.brands.length;
}

// ── PAGE: DESIGNER ──────────────────────────────────────────
function initDesigner() {
  const id = getParam('id') || 'genevieve-motley';
  const b = IM.brands.find(x => x.id === id) || IM.brands[2];
  const products = IM.products.filter(p => p.brand === b.id);

  // Hero image
  const heroImg = document.querySelector('.des-hero-img img');
  if (heroImg) heroImg.src = img(b.img);

  // Text
  const fields = {
    '.des-name':     b.name,
    '.des-loc':      `📍 ${b.city}, ${b.province}`,
    '.des-bio':      b.bio,
    '.des-category': b.category,
  };
  Object.entries(fields).forEach(([sel,val]) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = val || '';
  });

  // Stats
  const statPieces = document.querySelector('.des-stat-pieces');
  if (statPieces) statPieces.textContent = b.pieces + '+';

  // Page title
  document.title = `${b.name} — Indiemode SA`;

  // Products
  const grid = document.querySelector('.des-prod-grid');
  if (grid) {
    const toShow = products.length ? products : IM.products.slice(0,4);
    grid.innerHTML = toShow.slice(0,4).map((p,i) => productCard(p, ['','rd1','rd2','rd3'][i])).join('');
  }

  // View all link
  const viewAll = document.querySelector('.des-view-all');
  if (viewAll) viewAll.href = `shop.html?brand=${b.id}`;
}


// ── INIT ABOUT ──────────────────────────────────────────────
function initAbout() {
  // Stats from data
  const ds = IM.stats;
  const desEl = document.getElementById('aboutStatDesigners');
  const pcEl  = document.getElementById('aboutStatPieces');
  const yrEl  = document.getElementById('aboutStatYear');
  if (desEl) desEl.innerHTML = ds.designers.replace('+','<span>+</span>');
  if (pcEl)  pcEl.innerHTML  = ds.pieces.replace('+','<span>+</span>');
  if (yrEl)  yrEl.textContent = ds.established;

  // Editorial image for hero + story
  const heroImg  = document.getElementById('aboutHeroImg');
  const storyImg = document.getElementById('aboutStoryImg');
  if (heroImg)  heroImg.src = IM.images.editorial;
  if (storyImg) storyImg.src = IM.images.editorial;

  // Footer tagline
  const ft = document.getElementById('footerTagline');
  if (ft) ft.textContent = IM.site.tagline;
}

// ── INIT CONTACT ─────────────────────────────────────────────
function initContact() {
  // Email from data
  const emailEl = document.getElementById('contactEmail');
  if (emailEl) {
    emailEl.href = 'mailto:' + IM.site.email;
    emailEl.textContent = IM.site.email;
  }

  // Footer tagline
  const ft = document.getElementById('footerTagline');
  if (ft) ft.textContent = IM.site.tagline;

  // Form submit (demo — no real backend)
  const submitBtn = document.querySelector('.form-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      submitBtn.textContent = 'Message Sent ✓';
      submitBtn.style.background = 'var(--secondary)';
      submitBtn.style.borderColor = 'var(--secondary)';
      submitBtn.style.color = 'var(--bg)';
      submitBtn.disabled = true;
    });
  }
}

// ── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderNav();

  const page = location.pathname.split('/').pop().replace('.html','') || 'index';
  const pageMap = {
    'index':       initHome,
    '':            initHome,
    'shop':        initShop,
    'product':     initProduct,
    'brands':      initBrands,
    'designer':    initDesigner,
    'about':       initAbout,
    'contact':     initContact,
    'clothing':    () => {},
    'swimwear':    () => {},
    'jewellery':   () => {},
    'accessories': () => {},
  };

  if (pageMap[page]) pageMap[page]();
  initReveal();

  // ── CART + WISHLIST INIT ──────────────────────────
  if (typeof Cart !== 'undefined') {
    Cart.init();
    // Sync wish hearts after dynamic content renders
    setTimeout(() => Cart.syncAllWishBtnsAll(), 100);
  }

  // ── LIVE SEARCH ────────────────────────────────────────
  const sInput = document.getElementById('sInput');
  if (sInput) {
    sInput.addEventListener('input', () => {
      const q = sInput.value.trim().toLowerCase();
      const existing = document.getElementById('sResults');
      if (existing) existing.remove();
      if (!q || q.length < 2) return;

      const matched = IM.products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      ).slice(0, 6);

      const brandMatched = IM.brands.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      ).slice(0, 3);

      const wrap = document.querySelector('.s-wrap');
      const results = document.createElement('div');
      results.id = 'sResults';
      results.style.cssText = 'margin-top:28px;display:flex;flex-direction:column;gap:2px;';

      if (matched.length === 0 && brandMatched.length === 0) {
        results.innerHTML = `<div style="font-family:var(--condensed);font-size:11px;letter-spacing:.14em;color:var(--dim);padding:16px 0">No results for "${q}"</div>`;
      } else {
        if (brandMatched.length) {
          results.innerHTML += `<div style="font-family:var(--condensed);font-size:8px;font-weight:900;letter-spacing:.3em;text-transform:uppercase;color:var(--secondary);padding:0 0 8px">Brands</div>`;
          results.innerHTML += brandMatched.map(b => `
            <a href="designer.html?id=${b.id}" onclick="closeSearch()" style="display:flex;align-items:center;gap:14px;padding:10px 14px;background:rgba(248,250,252,.03);border:1px solid var(--border);border-radius:1px;transition:border-color .15s;text-decoration:none;color:inherit">
              <img src="${IM.images[b.img]||'img/prod-01.jpg'}" style="width:36px;height:36px;object-fit:cover;border-radius:1px;flex-shrink:0">
              <div>
                <div style="font-family:var(--serif);font-size:15px;color:var(--text)">${b.name}</div>
                <div style="font-family:var(--condensed);font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:var(--secondary)">${b.category}</div>
              </div>
            </a>`).join('');
          results.innerHTML += `<div style="height:8px"></div>`;
        }
        if (matched.length) {
          results.innerHTML += `<div style="font-family:var(--condensed);font-size:8px;font-weight:900;letter-spacing:.3em;text-transform:uppercase;color:var(--secondary);padding:0 0 8px">Products</div>`;
          results.innerHTML += matched.map(p => {
            const brand = IM.brands.find(b => b.id === p.brand) || {};
            return `<a href="product.html?id=${p.id}" onclick="closeSearch()" style="display:flex;align-items:center;gap:14px;padding:10px 14px;background:rgba(248,250,252,.03);border:1px solid var(--border);border-radius:1px;transition:border-color .15s;text-decoration:none;color:inherit">
              <img src="${IM.images[p.img]||'img/prod-01.jpg'}" style="width:36px;height:48px;object-fit:cover;object-position:center top;border-radius:1px;flex-shrink:0">
              <div style="flex:1;min-width:0">
                <div style="font-family:var(--serif);font-size:15px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div>
                <div style="font-family:var(--condensed);font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:var(--secondary)">${brand.name||p.brand}</div>
              </div>
              <div style="font-family:var(--condensed);font-size:13px;font-weight:900;color:var(--text);flex-shrink:0">R ${p.price.toLocaleString()}</div>
            </a>`;
          }).join('');
        }
        results.innerHTML += `<a href="shop.html" onclick="closeSearch()" style="display:block;text-align:center;padding:12px;font-family:var(--condensed);font-size:10px;font-weight:900;letter-spacing:.2em;text-transform:uppercase;color:var(--secondary);margin-top:8px;border:1px solid rgba(0,245,212,.2);border-radius:1px">See all results →</a>`;
      }
      wrap.appendChild(results);
    });
  }
});
