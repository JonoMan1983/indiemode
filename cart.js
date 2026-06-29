// ============================================================
//  INDIEMODE — CART + WISHLIST MODULE
//  Persistent via localStorage. Sitewide. No backend needed.
// ============================================================

// ── CART STATE ───────────────────────────────────────────────
const Cart = {
  key: 'im_cart',
  wishKey: 'im_wish',

  // ── CART CORE ──────────────────────────────────────────────
  getItems() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; }
    catch { return []; }
  },
  save(items) {
    localStorage.setItem(this.key, JSON.stringify(items));
    this.syncBadge();
    this.renderDrawer();
  },
  add(productId, size) {
    const p = IM.products.find(x => x.id === productId);
    if (!p) return;
    const items = this.getItems();
    const key = productId + '||' + size;
    const existing = items.find(i => i.key === key);
    if (existing) {
      existing.qty++;
    } else {
      const brand = IM.brands.find(b => b.id === p.brand) || {};
      items.push({
        key, productId, size,
        name: p.name,
        brand: brand.name || p.brand,
        price: p.price,
        img: IM.images[p.img] || 'img/prod-01.jpg',
        qty: 1,
      });
    }
    this.save(items);
    this.flashAtb();
    this.openDrawer();
  },
  remove(key) {
    const items = this.getItems().filter(i => i.key !== key);
    this.save(items);
  },
  updateQty(key, delta) {
    const items = this.getItems();
    const item = items.find(i => i.key === key);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    this.save(items);
  },
  total() {
    return this.getItems().reduce((s, i) => s + i.price * i.qty, 0);
  },
  count() {
    return this.getItems().reduce((s, i) => s + i.qty, 0);
  },
  clear() {
    localStorage.removeItem(this.key);
    this.syncBadge();
    this.renderDrawer();
  },

  // ── WISHLIST CORE ─────────────────────────────────────────
  getWishlist() {
    try { return JSON.parse(localStorage.getItem(this.wishKey)) || []; }
    catch { return []; }
  },
  saveWishlist(list) {
    localStorage.setItem(this.wishKey, JSON.stringify(list));
    this.syncWishBadge();
    this.renderWishDrawer();
  },
  isWished(productId) {
    return this.getWishlist().includes(productId);
  },
  toggleWish(productId) {
    let list = this.getWishlist();
    if (list.includes(productId)) {
      list = list.filter(id => id !== productId);
    } else {
      list.push(productId);
    }
    this.saveWishlist(list);
    this.syncAllWishBtns(productId);
    return list.includes(productId);
  },
  wishToCart(productId) {
    const p = IM.products.find(x => x.id === productId);
    if (!p) return;
    const size = p.sizes ? p.sizes.find(s => !p.soldOut || !p.soldOut.includes(s)) || p.sizes[0] : 'One Size';
    this.add(productId, size);
    // keep in wishlist — user can remove manually
  },

  // ── BADGE SYNC ────────────────────────────────────────────
  syncBadge() {
    const n = this.count();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = n;
      el.style.transform = 'scale(1.5)';
      setTimeout(() => el.style.transform = '', 200);
    });
  },
  syncWishBadge() {
    const n = this.getWishlist().length;
    document.querySelectorAll('.wish-count').forEach(el => {
      el.textContent = n;
      el.style.display = n > 0 ? 'flex' : 'none';
    });
  },
  syncAllWishBtns(productId) {
    const wished = this.isWished(productId);
    document.querySelectorAll(`[data-wish-id="${productId}"]`).forEach(btn => {
      btn.classList.toggle('wished', wished);
      btn.setAttribute('aria-label', wished ? 'Remove from wishlist' : 'Add to wishlist');
    });
  },
  syncAllWishBtnsAll() {
    document.querySelectorAll('[data-wish-id]').forEach(btn => {
      const id = btn.dataset.wishId;
      const wished = this.isWished(id);
      btn.classList.toggle('wished', wished);
    });
  },

  // ── ATB FEEDBACK ─────────────────────────────────────────
  flashAtb() {
    const btn = document.getElementById('pdAtbBtn');
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = 'Added ✓';
    btn.style.background = 'var(--secondary)';
    btn.style.color = 'var(--bg)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
    }, 1400);
  },

  // ── CART DRAWER ───────────────────────────────────────────
  openDrawer() {
    document.getElementById('cartDrawer')?.classList.add('open');
    document.getElementById('drawerOverlay')?.classList.add('open');
  },
  closeDrawer() {
    document.getElementById('cartDrawer')?.classList.remove('open');
    document.getElementById('wishDrawer')?.classList.remove('open');
    document.getElementById('drawerOverlay')?.classList.remove('open');
  },
  openWishDrawer() {
    document.getElementById('wishDrawer')?.classList.add('open');
    document.getElementById('drawerOverlay')?.classList.add('open');
  },

  renderDrawer() {
    const body = document.getElementById('cartDrawerBody');
    const foot = document.getElementById('cartDrawerFoot');
    if (!body) return;
    const items = this.getItems();

    if (!items.length) {
      body.innerHTML = `
        <div class="drawer-empty">
          <div class="drawer-empty-icon">🛍</div>
          <div class="drawer-empty-msg">Your bag is empty</div>
          <a href="shop.html" class="drawer-empty-link" onclick="Cart.closeDrawer()">Browse the collection →</a>
        </div>`;
      if (foot) foot.style.display = 'none';
      return;
    }
    if (foot) foot.style.display = '';

    body.innerHTML = items.map(item => `
      <div class="drawer-item" data-key="${item.key}">
        <a href="product.html?id=${item.productId}" onclick="Cart.closeDrawer()">
          <img src="${item.img}" alt="${item.name}">
        </a>
        <div class="drawer-item-info">
          <div class="drawer-item-brand">${item.brand}</div>
          <div class="drawer-item-name">${item.name}</div>
          <div class="drawer-item-size">Size: ${item.size}</div>
          <div class="drawer-item-foot">
            <div class="drawer-qty">
              <button onclick="Cart.updateQty('${item.key}',-1)">−</button>
              <span>${item.qty}</span>
              <button onclick="Cart.updateQty('${item.key}',1)">+</button>
            </div>
            <div class="drawer-item-price">R ${(item.price * item.qty).toLocaleString('en-ZA')}</div>
            <button class="drawer-remove" onclick="Cart.remove('${item.key}')" aria-label="Remove">✕</button>
          </div>
        </div>
      </div>`).join('');

    if (foot) {
      foot.innerHTML = `
        <div class="drawer-total">
          <span>Subtotal</span>
          <span>R ${this.total().toLocaleString('en-ZA')}</span>
        </div>
        <div class="drawer-total-note">Shipping calculated at checkout</div>
        <a href="cart.html" class="drawer-checkout" onclick="Cart.closeDrawer()">Proceed to Checkout →</a>
        <button class="drawer-continue" onclick="Cart.closeDrawer()">Continue Shopping</button>`;
    }
  },

  // ── WISHLIST DRAWER ───────────────────────────────────────
  renderWishDrawer() {
    const body = document.getElementById('wishDrawerBody');
    if (!body) return;
    const list = this.getWishlist();
    const products = list.map(id => IM.products.find(p => p.id === id)).filter(Boolean);

    if (!products.length) {
      body.innerHTML = `
        <div class="drawer-empty">
          <div class="drawer-empty-icon">♡</div>
          <div class="drawer-empty-msg">Your wishlist is empty</div>
          <a href="shop.html" class="drawer-empty-link" onclick="Cart.closeDrawer()">Discover pieces →</a>
        </div>`;
      return;
    }

    body.innerHTML = products.map(p => {
      const brand = IM.brands.find(b => b.id === p.brand) || {};
      const wished = this.isWished(p.id);
      return `
        <div class="drawer-item wish-drawer-item" data-pid="${p.id}">
          <a href="product.html?id=${p.id}" onclick="Cart.closeDrawer()">
            <img src="${IM.images[p.img] || 'img/prod-01.jpg'}" alt="${p.name}">
          </a>
          <div class="drawer-item-info">
            <div class="drawer-item-brand">${brand.name || p.brand}</div>
            <div class="drawer-item-name">${p.name}</div>
            <div class="drawer-item-price-sm">R ${p.price.toLocaleString('en-ZA')}</div>
            <div class="drawer-wish-actions">
              <button class="wish-to-cart-btn" onclick="Cart.wishToCart('${p.id}')">Add to Bag →</button>
              <button class="wish-remove-btn" onclick="Cart.toggleWish('${p.id}');this.closest('.wish-drawer-item').remove();Cart.syncWishBadge()" aria-label="Remove from wishlist">✕</button>
            </div>
          </div>
        </div>`;
    }).join('');
  },

  // ── INJECT DRAWER HTML ────────────────────────────────────
  injectDrawers() {
    const html = `
    <!-- DRAWER OVERLAY -->
    <div id="drawerOverlay" class="drawer-overlay" onclick="Cart.closeDrawer()"></div>

    <!-- CART DRAWER -->
    <div id="cartDrawer" class="side-drawer cart-drawer">
      <div class="drawer-header">
        <div class="drawer-title">Your Bag <span class="drawer-count">${this.count()}</span></div>
        <button class="drawer-close" onclick="Cart.closeDrawer()" aria-label="Close">✕</button>
      </div>
      <div class="drawer-body" id="cartDrawerBody"></div>
      <div class="drawer-foot" id="cartDrawerFoot"></div>
    </div>

    <!-- WISHLIST DRAWER -->
    <div id="wishDrawer" class="side-drawer wish-drawer">
      <div class="drawer-header">
        <div class="drawer-title">Wishlist <span class="drawer-count wish-count-drawer">${this.getWishlist().length}</span></div>
        <button class="drawer-close" onclick="Cart.closeDrawer()" aria-label="Close">✕</button>
      </div>
      <div class="drawer-body" id="wishDrawerBody"></div>
    </div>`;

    const el = document.createElement('div');
    el.innerHTML = html;
    document.body.appendChild(el);
    this.renderDrawer();
    this.renderWishDrawer();
  },

  // ── INJECT DRAWER STYLES ──────────────────────────────────
  injectStyles() {
    const css = `
    /* ── DRAWER OVERLAY ─────────────────────────────── */
    .drawer-overlay{position:fixed;inset:0;background:rgba(15,23,42,.65);z-index:500;opacity:0;pointer-events:none;transition:opacity .3s;backdrop-filter:blur(4px)}
    .drawer-overlay.open{opacity:1;pointer-events:all}

    /* ── SIDE DRAWER ────────────────────────────────── */
    .side-drawer{position:fixed;top:0;right:0;bottom:0;width:420px;max-width:100vw;background:#111827;border-left:1px solid rgba(248,250,252,.08);z-index:600;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .35s cubic-bezier(.25,.46,.45,.94)}
    .side-drawer.open{transform:translateX(0)}
    .drawer-header{display:flex;align-items:center;justify-content:space-between;padding:22px 24px;border-bottom:1px solid rgba(248,250,252,.08);flex-shrink:0}
    .drawer-title{font-family:var(--condensed);font-size:13px;font-weight:900;letter-spacing:.22em;text-transform:uppercase;color:var(--text);display:flex;align-items:center;gap:10px}
    .drawer-count{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;background:var(--primary);color:var(--bg);font-size:9px;font-weight:900;border-radius:50%;padding:0 4px}
    .drawer-close{width:32px;height:32px;border:1px solid rgba(248,250,252,.12);border-radius:2px;color:var(--muted);font-size:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:none;transition:color .2s,border-color .2s}
    .drawer-close:hover{color:var(--text);border-color:rgba(248,250,252,.3)}
    .drawer-body{flex:1;overflow-y:auto;padding:16px 24px;scrollbar-width:thin;scrollbar-color:rgba(248,250,252,.1) transparent}
    .drawer-foot{padding:20px 24px;border-top:1px solid rgba(248,250,252,.08);flex-shrink:0}

    /* ── CART ITEM ──────────────────────────────────── */
    .drawer-item{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid rgba(248,250,252,.06);align-items:flex-start}
    .drawer-item img{width:72px;height:96px;object-fit:cover;object-position:center top;border-radius:2px;border:1px solid rgba(248,250,252,.08);flex-shrink:0}
    .drawer-item-info{flex:1;min-width:0}
    .drawer-item-brand{font-family:var(--condensed);font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--secondary);margin-bottom:3px}
    .drawer-item-name{font-family:var(--serif);font-size:15px;line-height:1.2;color:var(--text);margin-bottom:4px}
    .drawer-item-size{font-family:var(--condensed);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
    .drawer-item-foot{display:flex;align-items:center;gap:10px}
    .drawer-qty{display:flex;align-items:center;gap:0;border:1px solid rgba(248,250,252,.12);border-radius:2px;overflow:hidden}
    .drawer-qty button{width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:none;color:var(--muted);font-size:16px;cursor:pointer;transition:background .15s,color .15s}
    .drawer-qty button:hover{background:rgba(248,250,252,.06);color:var(--text)}
    .drawer-qty span{width:28px;text-align:center;font-family:var(--condensed);font-size:12px;font-weight:700;color:var(--text);border-left:1px solid rgba(248,250,252,.08);border-right:1px solid rgba(248,250,252,.08)}
    .drawer-item-price{font-family:var(--condensed);font-size:13px;font-weight:900;color:var(--text);margin-left:auto}
    .drawer-remove{width:24px;height:24px;display:flex;align-items:center;justify-content:center;color:var(--dim);font-size:10px;cursor:pointer;background:none;border:none;transition:color .15s;flex-shrink:0}
    .drawer-remove:hover{color:var(--primary)}

    /* ── EMPTY STATE ─────────────────────────────────── */
    .drawer-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;padding:40px 20px;text-align:center}
    .drawer-empty-icon{font-size:40px;opacity:.4}
    .drawer-empty-msg{font-family:var(--condensed);font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
    .drawer-empty-link{font-family:var(--condensed);font-size:10px;font-weight:900;letter-spacing:.2em;text-transform:uppercase;color:var(--secondary);border-bottom:1px solid var(--secondary);padding-bottom:2px}

    /* ── CART FOOT ───────────────────────────────────── */
    .drawer-total{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px}
    .drawer-total span:first-child{font-family:var(--condensed);font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
    .drawer-total span:last-child{font-family:var(--condensed);font-size:20px;font-weight:900;color:var(--text)}
    .drawer-total-note{font-family:var(--condensed);font-size:9px;letter-spacing:.1em;color:var(--dim);margin-bottom:16px}
    .drawer-checkout{display:block;width:100%;padding:16px;background:var(--primary);color:var(--bg);font-family:var(--condensed);font-size:12px;font-weight:900;letter-spacing:.2em;text-transform:uppercase;text-align:center;border-radius:2px;margin-bottom:10px;transition:box-shadow .2s;border:none;cursor:pointer}
    .drawer-checkout:hover{box-shadow:0 0 32px var(--primary-glow)}
    .drawer-continue{display:block;width:100%;padding:12px;background:none;border:1px solid rgba(248,250,252,.12);color:var(--muted);font-family:var(--condensed);font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;text-align:center;border-radius:2px;cursor:pointer;transition:border-color .2s,color .2s}
    .drawer-continue:hover{border-color:rgba(248,250,252,.3);color:var(--text)}

    /* ── WISHLIST DRAWER SPECIFICS ───────────────────── */
    .wish-drawer{right:0}
    .drawer-item-price-sm{font-family:var(--condensed);font-size:13px;font-weight:900;color:var(--text);margin-bottom:10px}
    .drawer-wish-actions{display:flex;align-items:center;gap:8px}
    .wish-to-cart-btn{font-family:var(--condensed);font-size:9px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:var(--secondary);border:1px solid rgba(0,245,212,.3);padding:6px 12px;border-radius:1px;cursor:pointer;background:none;transition:background .2s,color .2s}
    .wish-to-cart-btn:hover{background:rgba(0,245,212,.1)}
    .wish-remove-btn{width:24px;height:24px;display:flex;align-items:center;justify-content:center;color:var(--dim);font-size:10px;cursor:pointer;background:none;border:none;transition:color .15s;margin-left:auto}
    .wish-remove-btn:hover{color:var(--primary)}

    /* ── WISH BUTTON (sitewide) ──────────────────────── */
    .wish-btn{background:none;border:1px solid rgba(248,250,252,.12);border-radius:2px;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color .2s,color .2s,background .2s;line-height:1}
    .wish-btn svg{pointer-events:none;transition:fill .2s}
    .wish-btn:hover{border-color:var(--primary);color:var(--primary);background:rgba(255,0,110,.06)}
    .wish-btn.wished{border-color:var(--primary);color:var(--primary);background:rgba(255,0,110,.06)}
    .wish-btn.wished svg{fill:currentColor}

    /* ── NAV WISHLIST ICON ───────────────────────────── */
    .nav-wish-btn{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:4px;color:var(--muted);border:1px solid transparent;transition:color .2s,border-color .2s;position:relative;cursor:pointer;background:none}
    .nav-wish-btn:hover{color:var(--text);border-color:var(--border-hi)}
    .wish-count{display:none;position:absolute;top:-4px;right:-4px;width:14px;height:14px;background:var(--primary);color:var(--bg);font-size:7px;font-weight:900;border-radius:50%;align-items:center;justify-content:center}

    /* ── PROD CARD WISH (grid overlay) ──────────────── */
    .prod-wish-overlay{position:absolute;top:10px;right:10px;z-index:3;width:34px;height:34px;border-radius:2px}

    /* ── CART PAGE ───────────────────────────────────── */
    .cart-page-wrap{max-width:1100px;margin:0 auto;padding:calc(var(--nav-h)+40px) 40px 80px;display:grid;grid-template-columns:1fr 360px;gap:48px;align-items:start}
    .cart-items-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid rgba(248,250,252,.1)}
    .cart-items-title{font-family:var(--serif);font-size:32px;color:var(--text)}
    .cart-clear{font-family:var(--condensed);font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);cursor:pointer;background:none;border:none;transition:color .2s}
    .cart-clear:hover{color:var(--primary)}
    .cart-line{display:grid;grid-template-columns:88px 1fr auto;gap:20px;padding:20px 0;border-bottom:1px solid rgba(248,250,252,.06);align-items:center}
    .cart-line img{width:88px;height:116px;object-fit:cover;object-position:center top;border-radius:2px;border:1px solid rgba(248,250,252,.08)}
    .cart-line-name{font-family:var(--serif);font-size:18px;color:var(--text);margin-bottom:4px}
    .cart-line-brand{font-family:var(--condensed);font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--secondary);margin-bottom:4px}
    .cart-line-size{font-family:var(--condensed);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:14px}
    .cart-line-controls{display:flex;align-items:center;gap:12px}
    .cart-line-price{font-family:var(--condensed);font-size:16px;font-weight:900;color:var(--text);text-align:right;min-width:80px}
    .cart-line-remove{font-family:var(--condensed);font-size:8px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);background:none;border:none;cursor:pointer;transition:color .2s}
    .cart-line-remove:hover{color:var(--primary)}
    .cart-summary{background:#111827;border:1px solid rgba(248,250,252,.08);border-radius:2px;padding:28px;position:sticky;top:calc(var(--nav-h)+20px)}
    .cart-summary-title{font-family:var(--condensed);font-size:10px;font-weight:900;letter-spacing:.28em;text-transform:uppercase;color:var(--secondary);margin-bottom:20px;display:flex;align-items:center;gap:10px}
    .cart-summary-title::before{content:'';width:20px;height:1px;background:var(--secondary)}
    .cart-summary-line{display:flex;justify-content:space-between;margin-bottom:12px;font-family:var(--condensed);font-size:11px;letter-spacing:.08em;color:var(--muted)}
    .cart-summary-total{display:flex;justify-content:space-between;align-items:baseline;padding-top:16px;border-top:1px solid rgba(248,250,252,.08);margin-top:4px;margin-bottom:24px}
    .cart-summary-total span:first-child{font-family:var(--condensed);font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
    .cart-summary-total span:last-child{font-family:var(--condensed);font-size:24px;font-weight:900;color:var(--text)}
    .cart-checkout-btn{display:block;width:100%;padding:18px;background:var(--primary);color:var(--bg);font-family:var(--condensed);font-size:13px;font-weight:900;letter-spacing:.2em;text-transform:uppercase;text-align:center;border-radius:2px;cursor:pointer;border:none;transition:box-shadow .2s,transform .15s;margin-bottom:10px}
    .cart-checkout-btn:hover{box-shadow:0 0 32px var(--primary-glow);transform:translateY(-1px)}
    .cart-trust-row{display:flex;flex-direction:column;gap:8px;margin-top:20px}
    .cart-trust-item{display:flex;align-items:center;gap:8px;font-family:var(--condensed);font-size:9px;letter-spacing:.1em;color:var(--dim)}
    .cart-trust-item::before{content:'✓';color:var(--secondary);font-weight:900}
    .cart-empty-state{grid-column:1/-1;display:flex;flex-direction:column;align-items:center;gap:16px;padding:80px 20px;text-align:center}
    .cart-empty-icon{font-size:56px;opacity:.3}
    .cart-empty-title{font-family:var(--serif);font-size:36px;color:var(--text)}
    .cart-empty-sub{font-family:var(--condensed);font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
    .cart-empty-cta{display:inline-flex;align-items:center;gap:10px;padding:14px 28px;background:var(--primary);color:var(--bg);font-family:var(--condensed);font-size:12px;font-weight:900;letter-spacing:.2em;text-transform:uppercase;border-radius:2px;margin-top:8px}

    /* ── CHECKOUT STEPS ──────────────────────────────── */
    .checkout-steps{display:flex;align-items:center;gap:0;margin-bottom:32px}
    .checkout-step{font-family:var(--condensed);font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);display:flex;align-items:center;gap:8px}
    .checkout-step.active{color:var(--secondary)}
    .checkout-step.done{color:var(--muted)}
    .checkout-step-num{width:20px;height:20px;border:1px solid currentColor;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;flex-shrink:0}
    .checkout-step-sep{width:24px;height:1px;background:rgba(248,250,252,.12);margin:0 8px}

    /* ── CHECKOUT FORM ───────────────────────────────── */
    .checkout-section{margin-bottom:28px}
    .checkout-section-title{font-family:var(--condensed);font-size:9px;font-weight:900;letter-spacing:.28em;text-transform:uppercase;color:var(--secondary);margin-bottom:16px;display:flex;align-items:center;gap:10px}
    .checkout-section-title::before{content:'';width:16px;height:1px;background:var(--secondary)}
    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
    .form-row.full{grid-template-columns:1fr}
    .form-group{display:flex;flex-direction:column;gap:6px}
    .form-label{font-family:var(--condensed);font-size:8px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
    .form-input{background:rgba(248,250,252,.04);border:1px solid rgba(248,250,252,.12);border-radius:2px;padding:12px 14px;font-family:var(--body);font-size:14px;color:var(--text);outline:none;transition:border-color .2s;width:100%}
    .form-input:focus{border-color:var(--secondary)}
    .form-input::placeholder{color:var(--dim)}
    .form-select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='rgba(248,250,252,0.3)' stroke-width='1.4' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px;cursor:pointer}
    .form-select option{background:#1E293B;color:var(--text)}

    /* ── ORDER CONFIRMATION ──────────────────────────── */
    .confirm-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;text-align:center;gap:16px}
    .confirm-icon{width:64px;height:64px;border-radius:50%;background:rgba(0,245,212,.1);border:1px solid rgba(0,245,212,.3);display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:8px}
    .confirm-title{font-family:var(--serif);font-size:clamp(32px,5vw,52px);color:var(--text)}
    .confirm-sub{font-family:var(--condensed);font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--secondary)}
    .confirm-ref{font-family:var(--condensed);font-size:12px;letter-spacing:.08em;color:var(--muted);margin-top:4px}
    .confirm-actions{display:flex;gap:12px;margin-top:20px}
    .confirm-btn-primary{padding:14px 28px;background:var(--primary);color:var(--bg);font-family:var(--condensed);font-size:12px;font-weight:900;letter-spacing:.2em;text-transform:uppercase;border-radius:2px}
    .confirm-btn-secondary{padding:14px 28px;border:1px solid rgba(248,250,252,.2);color:var(--muted);font-family:var(--condensed);font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;border-radius:2px;background:none;cursor:pointer;transition:border-color .2s,color .2s}
    .confirm-btn-secondary:hover{border-color:rgba(248,250,252,.4);color:var(--text)}

    @media(max-width:768px){
      .side-drawer{width:100vw}
      .cart-page-wrap{grid-template-columns:1fr;gap:32px}
      .cart-summary{position:static}
      .cart-line{grid-template-columns:72px 1fr auto}
      .cart-line img{width:72px;height:95px}
      .form-row{grid-template-columns:1fr}
    }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  },

  // ── INIT ──────────────────────────────────────────────────
  init() {
    this.injectStyles();
    this.injectDrawers();
    this.syncBadge();
    this.syncWishBadge();
    this.syncAllWishBtnsAll();

    // Wire nav cart button to open drawer
    document.querySelectorAll('.nav-cart').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    // Wire nav wish button
    document.querySelectorAll('.nav-wish-btn').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        this.openWishDrawer();
      });
    });
  },
};

// Expose globally
window.Cart = Cart;
