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

function badgeHTML(badge) {
  if (!badge) return '';
  const map = { new: ['bdg-new','New'], sale: ['bdg-sale','Sale'], ltd: ['bdg-ltd','Ltd'] };
  const [cls, label] = map[badge] || ['',''];
  return cls ? `<span class="prod-badge ${cls}">${label}</span>` : '';
}

// ── NAV ─────────────────────────────────────────────────────
function renderNav() {
  const isHome = location.pathname.endsWith('index.html') || location.pathname.endsWith('/');
  const links = IM.nav.map(n =>
    `<li><a href="${n.href}${n.filter ? '?cat='+n.filter : ''}"${n.highlight ? ' class="nav-sale"' : ''}>${n.label}</a></li>`
  ).join('');

  document.querySelectorAll('.nav-links').forEach(el => el.innerHTML = links);

  // Scroll behaviour
  const nav = document.getElementById('mainNav');
  if (nav) window.addEventListener('scroll', () =>
    nav.classList.toggle('scrolled', scrollY > 80), {passive:true});

  // Search
  window.openSearch  = () => { $('sOverlay').classList.add('open'); setTimeout(() => $('sInput').focus(), 60); };
  window.closeSearch = () => $('sOverlay').classList.remove('open');
  document.addEventListener('keydown', e => { if(e.key==='Escape') closeSearch(); });

  // Cart
  let cartN = 0;
  window.addToCart = () => {
    cartN++;
    const c = $('cartCount');
    if (c) { c.textContent = cartN; c.style.transform='scale(1.5)'; setTimeout(()=>c.style.transform='',200); }
  };
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
    'index':    initHome,
    '':         initHome,
    'shop':     initShop,
    'product':  initProduct,
    'brands':   initBrands,
    'designer': initDesigner,
    'about':    initAbout,
    'contact':  initContact,
  };

  if (pageMap[page]) pageMap[page]();
  initReveal();
});
