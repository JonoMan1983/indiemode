// ============================================================
//  INDIEMODE — SINGLE SOURCE OF TRUTH
//  Edit this file to update any content across the entire site
//  Images: swap src paths here, all pages update instantly
// ============================================================

const IM = {

  // ── SITE META ──────────────────────────────────────────────
  site: {
    name: 'Indiemode',
    tagline: 'Independent SA Designer Fashion',
    email: 'hello@indiemode.co.za',
    location: 'Cape Town, South Africa',
    established: '2012',
    socials: {
      instagram: '#',
      tiktok: '#',
      pinterest: '#',
    }
  },

  // ── IMAGES ─────────────────────────────────────────────────
  // Swap any src here — every page that uses it updates instantly
  images: {
    hero:       'img/hero.jpg',
    editorial:  'img/editorial.jpg',
    prod_01:    'img/prod-01.jpg',
    prod_02:    'img/prod-02.jpg',
    prod_03:    'img/prod-03.jpg',
    prod_04:    'img/prod-04.jpg',
    prod_05:    'img/prod-05.jpg',
    prod_06:    'img/prod-06.jpg',
    prod_07:    'img/prod-07.jpg',
    prod_08:    'img/prod-08.jpg',
    prod_09:    'img/prod-09.jpg',
    prod_10:    'img/prod-10.jpg',
    prod_11:    'img/prod-11.jpg',
    prod_12:    'img/prod-12.jpg',
    brand_01:   'img/brand-01.jpg',
    brand_02:   'img/brand-02.jpg',
    brand_03:   'img/brand-03.jpg',
    brand_04:   'img/brand-04.jpg',
    swim_01:    'img/swim-01.jpg',  // chris-yang     — portrait hero
    swim_02:    'img/swim-02.jpg',  // lidia-ugrik    — portrait product
    swim_03:    'img/swim-03.jpg',  // marcin-sajur   — landscape editorial
    swim_04:    'img/swim-04.jpg',  // lhon-karwan-1  — portrait product
    swim_05:    'img/swim-05.jpg',  // lhon-karwan-2  — portrait product
    swim_06:    'img/swim-06.jpg',  // anton-chubarov — portrait product
    swim_07:    'img/swim-07.jpg',  // jpphotomiami   — portrait product
    swim_08:    'img/swim-08.jpg',  // marlon-alves   — portrait product
  },

  // ── BRANDS / DESIGNERS ─────────────────────────────────────
  brands: [
    { id: 'empty-apparel',      name: 'Empty Apparel',        city: 'Cape Town',     province: 'Western Cape',  category: 'Womenswear RTW',        pieces: 22, featured: true,  img: 'prod_01', bio: 'Clean, considered womenswear cut from locally sourced fabrics. Every piece is numbered.' },
    { id: 'bird-named-frank',   name: 'A Bird Named Frank',   city: 'Cape Town',     province: 'Western Cape',  category: 'Womenswear',            pieces: 38, featured: true,  img: 'prod_02', bio: 'Relaxed, coastal-inspired pieces made for real South African weather and women.' },
    { id: 'genevieve-motley',   name: 'Genevieve Motley',     city: 'Woodstock',     province: 'Western Cape',  category: 'Womenswear + Print',    pieces: 42, featured: true,  img: 'prod_03', bio: 'Studio in Woodstock. Zero-waste patterns, locally sourced fabrics. Every garment named after a Western Cape place.' },
    { id: 'bibi-rouge',         name: 'Bibi Rouge',           city: 'Johannesburg',  province: 'Gauteng',       category: 'RTW + Occasionwear',    pieces: 22, featured: false, img: 'prod_04', bio: 'Joburg-based occasionwear with a bold, unapologetic palette.' },
    { id: 'blackcherry',        name: 'Blackcherry',          city: 'Durban',        province: 'KwaZulu-Natal', category: 'Streetwear',            pieces: 45, featured: false, img: 'prod_05', bio: 'Durban streetwear rooted in local youth culture and KZN coastal energy.' },
    { id: 'coco-lifestyle',     name: 'Coco Lifestyle',       city: 'Stellenbosch',  province: 'Western Cape',  category: 'Casual + Lounge',       pieces: 31, featured: false, img: 'prod_06', bio: 'Effortless everyday pieces. Natural fibres, relaxed fits, timeless.' },
    { id: 'famke-jewellery',    name: 'Famke Jewellery',      city: 'Cape Town',     province: 'Western Cape',  category: 'Fine Jewellery',        pieces: 58, featured: false, img: 'prod_07', bio: 'Handcrafted brass and silver jewellery. Each piece made to order in Cape Town.' },
    { id: 'hot-igloo',          name: 'Hot !gloo',            city: 'Port Elizabeth', province: 'Eastern Cape', category: 'Accessories',           pieces: 19, featured: false, img: 'prod_08', bio: 'Woven and handcraft accessories from the Eastern Cape.' },
    { id: 'indhi-design',       name: 'Indhi Design Studio',  city: 'Pretoria',      province: 'Gauteng',       category: 'Beadwork + Jewellery',  pieces: 64, featured: false, img: 'prod_09', bio: 'Traditional beadwork reimagined for contemporary wear. Pretoria-based.' },
    { id: 'joy-jewellery',      name: 'Joy Jewellery',        city: 'Cape Town',     province: 'Western Cape',  category: 'Silver + Gold',         pieces: 47, featured: false, img: 'prod_10', bio: 'Delicate silver and gold pieces. Minimal, wearable, made in Cape Town.' },
    { id: 'made-with-love',     name: 'Made With Love',       city: 'Knysna',        province: 'Western Cape',  category: 'Handcraft + Textile',   pieces: 28, featured: false, img: 'brand_01', bio: 'Handcrafted textile pieces from the Garden Route.' },
    { id: 'silver-fig',         name: 'Silver Fig',           city: 'Franschhoek',   province: 'Western Cape',  category: 'Luxe Womenswear',       pieces: 15, featured: false, img: 'brand_02', bio: 'Luxe, limited-run womenswear. Franschhoek studio. Max 20 pieces per style.' },
    { id: 'white-rabbit-days',  name: 'White Rabbit Days',    city: 'Johannesburg',  province: 'Gauteng',       category: 'Contemporary RTW',      pieces: 33, featured: false, img: 'brand_03', bio: 'Contemporary ready-to-wear for the modern Joburg woman.' },
    { id: 'zindaba-collective', name: 'Zindaba Collective',   city: 'Cape Town',     province: 'Western Cape',  category: 'Unisex + Streetwear',   pieces: 27, featured: false, img: 'brand_04', bio: 'Unisex streetwear collective. Pan-African influences, Cape Town roots.' },
  ],

  // ── CATEGORIES ─────────────────────────────────────────────
  categories: [
    { id: 'dresses',     label: 'Dresses',     count: 86,  img: 'prod_05' },
    { id: 'tops',        label: 'Tops',        count: 54,  img: 'prod_06' },
    { id: 'jewellery',   label: 'Jewellery',   count: 120, img: 'prod_07' },
    { id: 'swimwear',    label: 'Swimwear',    count: 8,   img: 'swim_01' },
    { id: 'bottoms',     label: 'Bottoms',     count: 41,  img: 'prod_09' },
    { id: 'accessories', label: 'Accessories', count: 28,  img: 'prod_10' },
  ],

  // ── PRODUCTS ───────────────────────────────────────────────
  products: [
    {
      id: 'duck-egg-temple-dress',
      name: 'Duck Egg Temple Dress',
      brand: 'empty-apparel',
      category: 'dresses',
      price: 1280,
      originalPrice: null,
      badge: 'new',
      img: 'prod_01',
      sizes: ['XS','S','M','L','XL'],
      soldOut: ['XS'],
      material: '100% SA Linen',
      origin: 'Cape Town, RSA',
      run: 'Limited — 22 pcs',
      care: 'Hand wash cold',
      description: 'Cut from 100% locally sourced linen, the Temple Dress features a relaxed silhouette with hand-finished seams and a subtle pleat detail at the hem. Each piece is numbered and signed by the designer.',
      featured: true,
    },
    {
      id: 'coastal-linen-blouse',
      name: 'Coastal Linen Blouse',
      brand: 'bird-named-frank',
      category: 'tops',
      price: 890,
      originalPrice: null,
      badge: 'ltd',
      img: 'prod_02',
      sizes: ['XS','S','M','L'],
      soldOut: [],
      material: '100% SA Linen',
      origin: 'Cape Town, RSA',
      run: 'Limited Run',
      care: 'Cold machine wash',
      description: 'A relaxed coastal blouse in crisp SA linen. Wide sleeves, dropped shoulder, minimal detailing.',
      featured: true,
    },
    {
      id: 'protea-print-maxi',
      name: 'Protea Print Maxi',
      brand: 'genevieve-motley',
      category: 'dresses',
      price: 1230,
      originalPrice: 1540,
      badge: 'sale',
      img: 'prod_03',
      sizes: ['XS','S','M','L','XL'],
      soldOut: ['XL'],
      material: 'Cotton Blend',
      origin: 'Woodstock, Cape Town',
      run: '22 pieces — numbered',
      care: 'Gentle machine wash',
      description: 'The Protea Print Maxi is named after Franschhoek Pass. Zero-waste cut, locally printed fabric, hand-finished hem.',
      featured: true,
    },
    {
      id: 'brass-statement-ring',
      name: 'Brass Statement Ring',
      brand: 'famke-jewellery',
      category: 'jewellery',
      price: 420,
      originalPrice: null,
      badge: 'new',
      img: 'prod_04',
      sizes: ['S','M','L'],
      soldOut: [],
      material: 'Recycled Brass',
      origin: 'Cape Town, RSA',
      run: 'Made to order',
      care: 'Keep dry, polish with cloth',
      description: 'A bold, architectural brass ring. Made to order in Cape Town. Each piece is hand-formed and unique.',
      featured: true,
    },
    { id: 'woodstock-wrap-dress',   name: 'Woodstock Wrap Dress',   brand: 'bibi-rouge',         category: 'dresses',     price: 1450, originalPrice: null, badge: 'new',  img: 'prod_05', sizes: ['XS','S','M','L'], soldOut: [],     material: 'Viscose',           origin: 'Johannesburg',   run: 'Open run',          care: 'Hand wash',             description: 'A fluid wrap dress in rich jewel tones. Joburg-made, globally wearable.',                               featured: false },
    { id: 'karoo-cotton-tee',       name: 'Karoo Cotton Tee',       brand: 'coco-lifestyle',     category: 'tops',        price: 380,  originalPrice: null, badge: '',     img: 'prod_06', sizes: ['XS','S','M','L','XL'], soldOut: [], material: '100% Cotton',        origin: 'Stellenbosch',   run: 'Open run',          care: 'Machine wash cold',     description: 'The perfect everyday tee. Heavy cotton, minimal branding, built to last.',                              featured: false },
    { id: 'silver-chain-cuff',      name: 'Silver Chain Cuff',      brand: 'joy-jewellery',      category: 'jewellery',   price: 560,  originalPrice: null, badge: 'ltd',  img: 'prod_07', sizes: ['One Size'], soldOut: [],     material: 'Sterling Silver',   origin: 'Cape Town',      run: 'Limited — 15 pcs',  care: 'Keep dry',              description: 'A woven sterling silver cuff. Delicate but substantial.',                                               featured: false },
    { id: 'cape-town-silk-slip',    name: 'Cape Town Silk Slip',    brand: 'blackcherry',        category: 'dresses',     price: 1890, originalPrice: null, badge: 'new',  img: 'prod_08', sizes: ['XS','S','M'], soldOut: ['XS'], material: 'Silk',              origin: 'Durban',         run: 'Limited — 10 pcs',  care: 'Dry clean only',        description: 'A pure silk slip dress. Bias cut, minimal seams, extraordinary drape.',                                featured: false },
    { id: 'fynbos-print-shorts',    name: 'Fynbos Print Shorts',    brand: 'genevieve-motley',   category: 'bottoms',     price: 640,  originalPrice: null, badge: '',     img: 'prod_09', sizes: ['XS','S','M','L'], soldOut: [],     material: 'Cotton Poplin',     origin: 'Woodstock',      run: 'Open run',          care: 'Machine wash cold',     description: 'Bold botanical print shorts. Western Cape fynbos rendered in vibrant repeat.',                          featured: false },
    { id: 'woven-raffia-bag',       name: 'Woven Raffia Tote',      brand: 'hot-igloo',          category: 'accessories', price: 750,  originalPrice: null, badge: 'new',  img: 'prod_10', sizes: ['One Size'], soldOut: [],     material: 'Natural Raffia',    origin: 'Port Elizabeth', run: 'Open run',          care: 'Spot clean only',       description: 'Hand-woven raffia tote from the Eastern Cape. Beach or market — equally at home.',                     featured: false },
    { id: 'midnight-velvet-blazer', name: 'Midnight Velvet Blazer', brand: 'white-rabbit-days',  category: 'tops',        price: 2100, originalPrice: null, badge: 'ltd',  img: 'prod_11', sizes: ['XS','S','M','L'], soldOut: [],     material: 'Cotton Velvet',     origin: 'Johannesburg',   run: 'Limited — 8 pcs',   care: 'Dry clean recommended', description: 'A deep midnight velvet blazer. Oversized, structured shoulders, unlined.',                              featured: false },
    { id: 'beaded-anklet-set',      name: 'Beaded Anklet Set',      brand: 'indhi-design',       category: 'jewellery',   price: 280,  originalPrice: null, badge: '',     img: 'prod_12', sizes: ['One Size'], soldOut: [],     material: 'Glass Beads + Brass', origin: 'Pretoria',    run: 'Open run',          care: 'Avoid water',           description: 'A set of three handbeaded anklets in complementary tones. Traditional technique, contemporary palette.', featured: false },

    // ── SWIMWEAR ───────────────────────────────────────────────
    { id: 'obsidian-one-piece',     name: 'Obsidian One-Piece',     brand: 'empty-apparel',      category: 'swimwear',    price: 1480, originalPrice: null, badge: 'new',  img: 'swim_01', sizes: ['XS','S','M','L'],       soldOut: [],      material: 'Recycled Nylon',    origin: 'Cape Town',      run: 'Limited — 18 pcs',  care: 'Rinse after use',       description: 'A sculptural one-piece cut from recycled nylon. High neck, open back, minimal panelling. Made in Cape Town from locally sourced fabric.', featured: true  },
    { id: 'bone-bandeau-set',       name: 'Bone Bandeau Set',       brand: 'bird-named-frank',   category: 'swimwear',    price: 890,  originalPrice: null, badge: 'ltd',  img: 'swim_02', sizes: ['XS','S','M','L','XL'],  soldOut: ['XS'],  material: 'Lycra Blend',       origin: 'Cape Town',      run: 'Limited Run',       care: 'Hand wash cold',        description: 'A two-piece set in off-white lycra. Triangle top with adjustable ties, high-cut brief. Timeless coastal silhouette.', featured: true  },
    { id: 'carbon-cut-out-brief',   name: 'Carbon Cut-Out Brief',   brand: 'blackcherry',        category: 'swimwear',    price: 520,  originalPrice: null, badge: 'new',  img: 'swim_04', sizes: ['XS','S','M','L'],       soldOut: [],      material: 'Recycled Nylon',    origin: 'Durban',         run: 'Open run',          care: 'Rinse after use',       description: 'High-cut brief with architectural side cut-outs. Wear solo or layer. Durban-made from recycled ocean nylon.', featured: false },
    { id: 'midnight-plunge-suit',   name: 'Midnight Plunge Suit',   category: 'swimwear',        brand: 'coco-lifestyle', price: 1250, originalPrice: 1650, badge: 'sale', img: 'swim_05', sizes: ['XS','S','M'],           soldOut: ['M'],   material: 'Nylon/Elastane',    origin: 'Stellenbosch',   run: 'Open run',          care: 'Hand wash cold',        description: 'Deep plunge one-piece in midnight navy. V-neck to navel, thin adjustable straps, minimal back. Season-end sale.', featured: false },
    { id: 'terracotta-halter',      name: 'Terracotta Halter Top',  brand: 'genevieve-motley',   category: 'swimwear',    price: 640,  originalPrice: null, badge: '',     img: 'swim_06', sizes: ['XS','S','M','L'],       soldOut: [],      material: 'Recycled Lycra',    origin: 'Woodstock',      run: 'Open run',          care: 'Rinse, reshape, dry flat', description: 'A halter-neck bikini top in earthy terracotta. Adjustable back tie, soft cups, zero-waste pattern. Woodstock studio.', featured: false },
    { id: 'slate-high-neck-two',    name: 'Slate High-Neck Two-Piece', brand: 'bibi-rouge',      category: 'swimwear',    price: 1150, originalPrice: null, badge: 'new',  img: 'swim_07', sizes: ['XS','S','M','L'],       soldOut: [],      material: 'Nylon/Elastane',    origin: 'Johannesburg',   run: 'Limited — 12 pcs',  care: 'Hand wash cold',        description: 'A matching set: high-neck long-sleeve crop and high-waist brief. Slate grey with tonal stitching. Joburg-made.', featured: false },
    { id: 'ivory-string-brief',     name: 'Ivory String Brief',     brand: 'silver-fig',         category: 'swimwear',    price: 480,  originalPrice: null, badge: 'ltd',  img: 'swim_08', sizes: ['XS','S','M'],           soldOut: ['XS'],  material: 'Lycra',             origin: 'Franschhoek',    run: 'Limited — 8 pcs',   care: 'Hand wash cold',        description: 'Minimal string brief in ivory. Side ties, cheeky cut, barely-there silhouette. Franschhoek atelier, max 8 pieces.', featured: false },
    { id: 'deep-sea-rash-vest',     name: 'Deep Sea Rash Vest',     brand: 'blackcherry',        category: 'swimwear',    price: 720,  originalPrice: null, badge: '',     img: 'swim_03', sizes: ['XS','S','M','L','XL'],  soldOut: [],      material: 'UPF 50 Nylon',      origin: 'Durban',         run: 'Open run',          care: 'Machine wash cold',     description: 'Long-sleeve rash vest in deep ocean black. UPF 50+ protection, flatlock seams, slim performance fit. Durban surf heritage.', featured: false },
  ],

  // ── NAV ────────────────────────────────────────────────────
  nav: [
    { label: 'New In',       href: 'shop.html',      filter: '' },
    { label: 'Brands',       href: 'brands.html',    filter: '' },
    { label: 'Clothing',     href: 'shop.html',      filter: 'clothing' },
    { label: 'Swimwear',     href: 'swimwear.html',  filter: '' },
    { label: 'Jewellery',    href: 'shop.html',      filter: 'jewellery' },
    { label: 'Accessories',  href: 'shop.html',      filter: 'accessories' },
    { label: 'Sale',         href: 'shop.html',      filter: 'sale',  highlight: true },
  ],

  // ── STATS ──────────────────────────────────────────────────
  stats: {
    designers: '14+',
    pieces: '500+',
    madeInSA: '100%',
    established: '2012',
  },

};
