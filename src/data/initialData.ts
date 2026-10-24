import { Product, Shipment, WarehouseLocation, CustomsDoc, AdBanner, ExchangeRates, SupplierProfile, CustomerTestimonial } from '../types';

export const STORE_INFO = {
  name: 'Mauwiltus Enterprise',
  logisticsPartner: 'Global Lite Logistics import and export',
  address: '15 Macdonald Street, Freetown, Sierra Leone',
  primaryContact: '+232 90 703350',
  secondaryContact: '+232 73 775786',
  managerName: 'Williette M. Lawson',
  consigneeName: 'Abdul K. Sesay',
  email: 'mauwiltus.globallite@gmail.com',
  workingHours: 'Mon - Sat: 8:30 AM - 6:30 PM (GMT)',
  ports: {
    originChina: ['Guangzhou Nansha Port', 'Yiwu Freight Terminal', 'Shenzhen Shekou', 'Ningbo-Zhoushan'],
    destinationSL: ['Queen Elizabeth II Quay (Water Quay, Freetown)', 'Freetown International Airport (Lungi)']
  },
  paymentDetails: {
    orangeMoney: {
      number: '+232 73 775786',
      merchantCode: '884102',
      accountName: 'Mauwiltus Enterprise'
    },
    afrimoney: {
      number: '+232 33 434592',
      note: 'Direct AfriMoney transfer to +232 33 434592 (No Agent Code needed)',
      accountName: 'Mauwiltus Enterprise'
    },
    bankTransfer: {
      bankName: 'Guaranty Trust Bank (SL) Ltd (GTB)',
      branch: 'Wilberforce Street / Cotton Tree Branch, Freetown',
      accountName: 'Mauwiltus Enterprise / Global Lite Logistics',
      note: 'Direct In-Branch Cash Deposit or GTB Online Banking Transfer (Account details provided upon checkout or call +232 90 703350 / +232 73 775786)',
      swiftCode: 'GTBISLFR'
    }
  }
};

export const INITIAL_RATES: ExchangeRates = {
  SLE_PER_USD: 22.8,   // 1 USD = 22.8 SLE (New Leone)
  CNY_PER_USD: 7.24,   // 1 USD = 7.24 CNY
  SLE_PER_CNY: 3.15,   // 1 CNY = 3.15 SLE
  EUR_PER_USD: 0.92,   // 1 USD = 0.92 EUR
  GBP_PER_USD: 0.77,   // 1 USD = 0.77 GBP
  NGN_PER_USD: 1580,   // 1 USD = 1,580 NGN (Nigerian Naira)
  XOF_PER_USD: 605     // 1 USD = 605 XOF (West African CFA Franc)
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Royal Guinea Gold-Thread Brocade Fabric (5 Yards)',
    category: 'fabrics',
    categoryLabel: 'Fabrics & Textiles',
    priceSLE: 1250,
    priceUSD: 54.8,
    priceCNY: 396,
    costCNY: 220,
    stock: 48,
    soldOut: false,
    imageUrl: '/src/assets/images/product_african_fabrics_1792794257597.jpg',
    description: 'High-density 100% Egyptian cotton brocade with intricate metallic gold jacquard weave. Sourced directly from premier textile mills in Zhejiang, imported via Global Lite container sea cargo for Mauwiltus Enterprise.',
    origin: 'Shaoxing/Yiwu, China',
    sku: 'ME-FAB-001',
    supplierId: 'sup-1',
    specs: {
      'Length': '5 Yards (4.57m)',
      'Material': '100% Combed Cotton + Gold Thread',
      'Width': '55/56 Inches',
      'Texture': 'Lustrous, Crisp Handfeel'
    },
    priceHistory: [
      { month: 'May', sourcingCostCNY: 235, sourcingCostUSD: 32.4, retailPriceSLE: 1350, landedCostSLE: 840 },
      { month: 'Jun', sourcingCostCNY: 230, sourcingCostUSD: 31.7, retailPriceSLE: 1320, landedCostSLE: 820 },
      { month: 'Jul', sourcingCostCNY: 225, sourcingCostUSD: 31.0, retailPriceSLE: 1280, landedCostSLE: 805 },
      { month: 'Aug', sourcingCostCNY: 228, sourcingCostUSD: 31.5, retailPriceSLE: 1290, landedCostSLE: 815 },
      { month: 'Sep', sourcingCostCNY: 222, sourcingCostUSD: 30.6, retailPriceSLE: 1260, landedCostSLE: 795 },
      { month: 'Oct', sourcingCostCNY: 220, sourcingCostUSD: 30.4, retailPriceSLE: 1250, landedCostSLE: 785 }
    ],
    createdAt: '2026-10-15'
  },
  {
    id: 'prod-2',
    name: 'Organic Moringa & Hibiscus Detox Wellness Tea (30 Sachets)',
    category: 'gummies-tea',
    categoryLabel: 'Gummies & Health Tea',
    priceSLE: 380,
    priceUSD: 16.7,
    priceCNY: 120,
    costCNY: 65,
    stock: 120,
    soldOut: false,
    imageUrl: '/src/assets/images/product_herbal_wellness_tea_1792794257744.jpg',
    description: 'Certified organic herbal infusion combining dried moringa leaves, wild hibiscus calyces, ginger root, and green tea catechins. Promotes digestion, cellular antioxidant protection, and natural vitality.',
    origin: 'Fujian / Guangzhou, China',
    sku: 'ME-TEA-002',
    supplierId: 'sup-3',
    specs: {
      'Serving': '30 Biodegradable Pyramid Bags',
      'Caffeine': 'Low / Gentle energy',
      'Key Ingredients': 'Moringa, Hibiscus, Ginger, Calendula',
      'NRA Customs Batch': 'NRA-FSH-9921'
    },
    priceHistory: [
      { month: 'May', sourcingCostCNY: 72, sourcingCostUSD: 9.9, retailPriceSLE: 420, landedCostSLE: 255 },
      { month: 'Jun', sourcingCostCNY: 70, sourcingCostUSD: 9.6, retailPriceSLE: 410, landedCostSLE: 248 },
      { month: 'Jul', sourcingCostCNY: 68, sourcingCostUSD: 9.4, retailPriceSLE: 395, landedCostSLE: 240 },
      { month: 'Aug', sourcingCostCNY: 66, sourcingCostUSD: 9.1, retailPriceSLE: 390, landedCostSLE: 235 },
      { month: 'Sep', sourcingCostCNY: 65, sourcingCostUSD: 9.0, retailPriceSLE: 385, landedCostSLE: 230 },
      { month: 'Oct', sourcingCostCNY: 65, sourcingCostUSD: 9.0, retailPriceSLE: 380, landedCostSLE: 228 }
    ],
    createdAt: '2026-10-18'
  },
  {
    id: 'prod-3',
    name: 'Imperial Floral Silk-Blend Maxi Dress',
    category: 'women-dress',
    categoryLabel: 'Women Dress',
    priceSLE: 890,
    priceUSD: 39.0,
    priceCNY: 282,
    costCNY: 155,
    stock: 24,
    soldOut: false,
    imageUrl: '/src/assets/images/product_women_fashion_dress_1792794257152.jpg',
    description: 'Breathable, vibrant floral print dress featuring fitted waist sash, flowing silhouette, and elegant cuff detailing. Designed for West African climate elegance, weddings, and formal church wear.',
    origin: 'Guangzhou Garment Hub, China',
    sku: 'ME-WDR-003',
    supplierId: 'sup-2',
    specs: {
      'Sizes Available': 'M, L, XL, XXL',
      'Fabric': 'Silk & Rayon Blend',
      'Closure': 'Concealed Back Zipper',
      'Care': 'Gentle Hand Wash or Dry Clean'
    },
    priceHistory: [
      { month: 'May', sourcingCostCNY: 170, sourcingCostUSD: 23.5, retailPriceSLE: 950, landedCostSLE: 580 },
      { month: 'Jun', sourcingCostCNY: 165, sourcingCostUSD: 22.8, retailPriceSLE: 930, landedCostSLE: 565 },
      { month: 'Jul', sourcingCostCNY: 160, sourcingCostUSD: 22.1, retailPriceSLE: 910, landedCostSLE: 550 },
      { month: 'Aug', sourcingCostCNY: 158, sourcingCostUSD: 21.8, retailPriceSLE: 900, landedCostSLE: 540 },
      { month: 'Sep', sourcingCostCNY: 155, sourcingCostUSD: 21.4, retailPriceSLE: 890, landedCostSLE: 535 },
      { month: 'Oct', sourcingCostCNY: 155, sourcingCostUSD: 21.4, retailPriceSLE: 890, landedCostSLE: 535 }
    ],
    createdAt: '2026-10-19'
  },
  {
    id: 'prod-4',
    name: 'Executive Tailored Navy Suit & Crisp Formal Shirt',
    category: 'men-dress',
    categoryLabel: 'Men Dress & Apparel',
    priceSLE: 1450,
    priceUSD: 63.6,
    priceCNY: 460,
    costCNY: 260,
    stock: 18,
    soldOut: false,
    imageUrl: '/src/assets/images/product_men_tailored_suit_1792794258596.jpg',
    description: 'Crisp 100% pinpoint Oxford formal shirt paired with lightweight breathable navy blazer. Engineered with wrinkle-resistant finish for modern professionals and government officials in Freetown.',
    origin: 'Wenzhou / Guangzhou, China',
    sku: 'ME-MDR-004',
    supplierId: 'sup-2',
    specs: {
      'Fit': 'Modern Tailored Fit',
      'Collar': 'Semi-Spread Collar',
      'Blazer Lining': 'Breathable Cupro Half-Lining',
      'Sizes': '38R to 48R / M to 3XL'
    },
    priceHistory: [
      { month: 'May', sourcingCostCNY: 280, sourcingCostUSD: 38.6, retailPriceSLE: 1550, landedCostSLE: 950 },
      { month: 'Jun', sourcingCostCNY: 275, sourcingCostUSD: 38.0, retailPriceSLE: 1520, landedCostSLE: 930 },
      { month: 'Jul', sourcingCostCNY: 270, sourcingCostUSD: 37.3, retailPriceSLE: 1490, landedCostSLE: 910 },
      { month: 'Aug', sourcingCostCNY: 265, sourcingCostUSD: 36.6, retailPriceSLE: 1480, landedCostSLE: 895 },
      { month: 'Sep', sourcingCostCNY: 260, sourcingCostUSD: 35.9, retailPriceSLE: 1460, landedCostSLE: 880 },
      { month: 'Oct', sourcingCostCNY: 260, sourcingCostUSD: 35.9, retailPriceSLE: 1450, landedCostSLE: 875 }
    ],
    createdAt: '2026-10-20'
  },
  {
    id: 'prod-5',
    name: 'Apple Cider Vinegar & Biotin Glow Gummies (60 Count)',
    category: 'gummies-tea',
    categoryLabel: 'Gummies & Health Tea',
    priceSLE: 320,
    priceUSD: 14.0,
    priceCNY: 101,
    costCNY: 52,
    stock: 85,
    soldOut: false,
    imageUrl: '/src/assets/images/product_herbal_wellness_tea_1792794257744.jpg',
    description: 'Pectin-based dietary supplement gummies enriched with raw apple cider vinegar mother, folic acid, and 5000mcg biotin for metabolic support, hair growth, and digestion.',
    origin: 'Shenzhen Biotech Valley, China',
    sku: 'ME-GUM-005',
    supplierId: 'sup-4',
    specs: {
      'Bottle Count': '60 Vegan Gummies',
      'Dosage': '2 gummies daily with water',
      'Flavor': 'Natural Pomegranate-Berry',
      'Certification': 'GMP, ISO22000 Certified'
    },
    priceHistory: [
      { month: 'May', sourcingCostCNY: 58, sourcingCostUSD: 8.0, retailPriceSLE: 350, landedCostSLE: 210 },
      { month: 'Jun', sourcingCostCNY: 56, sourcingCostUSD: 7.7, retailPriceSLE: 340, landedCostSLE: 202 },
      { month: 'Jul', sourcingCostCNY: 54, sourcingCostUSD: 7.5, retailPriceSLE: 335, landedCostSLE: 195 },
      { month: 'Aug', sourcingCostCNY: 53, sourcingCostUSD: 7.3, retailPriceSLE: 330, landedCostSLE: 190 },
      { month: 'Sep', sourcingCostCNY: 52, sourcingCostUSD: 7.2, retailPriceSLE: 325, landedCostSLE: 188 },
      { month: 'Oct', sourcingCostCNY: 52, sourcingCostUSD: 7.2, retailPriceSLE: 320, landedCostSLE: 185 }
    ],
    createdAt: '2026-10-21'
  },
  {
    id: 'prod-6',
    name: 'African Super-Wax Real Dutch Hollandais Fabric (6 Yards)',
    category: 'fabrics',
    categoryLabel: 'Fabrics & Textiles',
    priceSLE: 1100,
    priceUSD: 48.2,
    priceCNY: 349,
    costCNY: 195,
    stock: 36,
    soldOut: false,
    imageUrl: '/src/assets/images/product_african_fabrics_1792794257597.jpg',
    description: 'Double-sided indigo and copper wax print fabric with crisp matte starch finish. High colorfastness under equatorial sunlight, perfect for custom aso-ebi and tailored traditional boubou garments.',
    origin: 'Zhejiang Export Terminal, China',
    sku: 'ME-FAB-006',
    supplierId: 'sup-1',
    specs: {
      'Length': '6 Yards (5.48m)',
      'Weight': '135 GSM Premium Cotton',
      'Dye Method': 'Targeted Resist Wax Dyeing',
      'Origin Mill': 'Yiwu Textile Trade Base'
    },
    priceHistory: [
      { month: 'May', sourcingCostCNY: 210, sourcingCostUSD: 29.0, retailPriceSLE: 1180, landedCostSLE: 740 },
      { month: 'Jun', sourcingCostCNY: 205, sourcingCostUSD: 28.3, retailPriceSLE: 1150, landedCostSLE: 725 },
      { month: 'Jul', sourcingCostCNY: 202, sourcingCostUSD: 27.9, retailPriceSLE: 1130, landedCostSLE: 710 },
      { month: 'Aug', sourcingCostCNY: 198, sourcingCostUSD: 27.3, retailPriceSLE: 1120, landedCostSLE: 700 },
      { month: 'Sep', sourcingCostCNY: 195, sourcingCostUSD: 26.9, retailPriceSLE: 1100, landedCostSLE: 690 },
      { month: 'Oct', sourcingCostCNY: 195, sourcingCostUSD: 26.9, retailPriceSLE: 1100, landedCostSLE: 690 }
    ],
    createdAt: '2026-10-21'
  },
  {
    id: 'prod-7',
    name: 'Heavy-Duty Stainless Thermal Household Cookware Set (12-Piece)',
    category: 'household',
    categoryLabel: 'Household Items',
    priceSLE: 1850,
    priceUSD: 81.1,
    priceCNY: 587,
    costCNY: 340,
    stock: 15,
    soldOut: false,
    imageUrl: '/src/assets/images/hero_sino_salone_logistics_1792794255768.jpg',
    description: 'Grade 304 food-grade stainless steel pots with triple-ply aluminum encapsulated bases. High heat retention ideal for traditional Sierra Leonean stews, jollof rice, and heavy daily cooking.',
    origin: 'Chaozhou Metalworks, China',
    sku: 'ME-HSD-007',
    supplierId: 'sup-5',
    specs: {
      'Pieces': '12 pcs with tempered glass lids',
      'Induction Ready': 'Yes, works on all stovetops',
      'Handles': 'Riveted stay-cool ergonomic steel',
      'Warranty': '2-Year Mauwiltus Quality Guarantee'
    },
    priceHistory: [
      { month: 'May', sourcingCostCNY: 360, sourcingCostUSD: 49.7, retailPriceSLE: 1980, landedCostSLE: 1250 },
      { month: 'Jun', sourcingCostCNY: 355, sourcingCostUSD: 49.0, retailPriceSLE: 1950, landedCostSLE: 1230 },
      { month: 'Jul', sourcingCostCNY: 350, sourcingCostUSD: 48.3, retailPriceSLE: 1900, landedCostSLE: 1205 },
      { month: 'Aug', sourcingCostCNY: 345, sourcingCostUSD: 47.6, retailPriceSLE: 1880, landedCostSLE: 1190 },
      { month: 'Sep', sourcingCostCNY: 340, sourcingCostUSD: 46.9, retailPriceSLE: 1860, landedCostSLE: 1175 },
      { month: 'Oct', sourcingCostCNY: 340, sourcingCostUSD: 46.9, retailPriceSLE: 1850, landedCostSLE: 1170 }
    ],
    createdAt: '2026-10-22'
  },
  {
    id: 'prod-8',
    name: 'Solar Rechargeable Emergency Home Power Lantern & Phone Charger',
    category: 'household',
    categoryLabel: 'Household Items',
    priceSLE: 450,
    priceUSD: 19.7,
    priceCNY: 142,
    costCNY: 78,
    stock: 60,
    soldOut: false,
    imageUrl: '/src/assets/images/hero_sino_salone_logistics_1792794255768.jpg',
    description: 'Essential Sierra Leone household lighting unit with 20W polycrystalline solar panel, 12,000mAh battery pack, USB-A mobile fast charging port, and 3 high-lumen hanging LED bulbs.',
    origin: 'Shenzhen Electronics Hub, China',
    sku: 'ME-HSD-008',
    supplierId: 'sup-5',
    specs: {
      'Battery': '12,000mAh LiFePO4 battery',
      'Runtime': 'Up to 24 hours on medium beam',
      'Solar Panel': '9V 20W Weatherproof with 5m cord',
      'Phone Output': '5V 2.1A Dual USB'
    },
    priceHistory: [
      { month: 'May', sourcingCostCNY: 88, sourcingCostUSD: 12.1, retailPriceSLE: 510, landedCostSLE: 310 },
      { month: 'Jun', sourcingCostCNY: 85, sourcingCostUSD: 11.7, retailPriceSLE: 490, landedCostSLE: 298 },
      { month: 'Jul', sourcingCostCNY: 82, sourcingCostUSD: 11.3, retailPriceSLE: 480, landedCostSLE: 285 },
      { month: 'Aug', sourcingCostCNY: 80, sourcingCostUSD: 11.0, retailPriceSLE: 465, landedCostSLE: 278 },
      { month: 'Sep', sourcingCostCNY: 79, sourcingCostUSD: 10.9, retailPriceSLE: 455, landedCostSLE: 272 },
      { month: 'Oct', sourcingCostCNY: 78, sourcingCostUSD: 10.8, retailPriceSLE: 450, landedCostSLE: 270 }
    ],
    createdAt: '2026-10-22'
  }
];

export const INITIAL_SUPPLIERS: SupplierProfile[] = [
  {
    id: 'sup-1',
    name: 'Zhejiang Keqiao Royal Textile Mills Ltd.',
    chineseName: '浙江柯桥皇室纺织有限公司',
    city: 'Shaoxing',
    province: 'Zhejiang',
    address: 'No. 328 Keqiao Textile Avenue, Shaoxing City, Zhejiang Province',
    verifiedRating: 4.9,
    verifiedTier: 'Gold Supplier',
    primaryCategories: ['fabrics'],
    contactPerson: 'Lin Wei (Export Sales Director)',
    phone: '+86 575 8829 4110',
    wechatId: 'keqiao_royal_textiles',
    email: 'linwei@keqiaoroyal.cn',
    moq: '500 Yards per design',
    leadTimeDays: 14,
    qualityCertifications: ['ISO9001', 'OEKO-TEX Standard 100', 'SGS Audited'],
    notes: 'Direct mill for high-thread Guinea brocade, Dutch gold wax prints, and damask fabrics. Consolidates via Yiwu/Ningbo port for Global Lite.',
    activeOrdersCount: 4,
    createdAt: '2026-03-10'
  },
  {
    id: 'sup-2',
    name: 'Guangdong Shisanhang Silk & Apparel Co.',
    chineseName: '广东十三行丝绸服饰有限公司',
    city: 'Guangzhou',
    province: 'Guangdong',
    address: 'Shisanhang Garment Wholesale Center, Block B, Floor 6, Guangzhou',
    verifiedRating: 4.8,
    verifiedTier: 'Verified Manufacturer',
    primaryCategories: ['women-dress', 'men-dress'],
    contactPerson: 'Chen Jian (Apparel Merchandiser)',
    phone: '+86 20 8192 3348',
    wechatId: 'gz_shisanhang_chen',
    email: 'sales@shisanhang-apparel.com',
    moq: '50 Pieces per style',
    leadTimeDays: 10,
    qualityCertifications: ['ISO14001', 'SEDEX Audited', 'WRAP'],
    notes: 'Premier ready-to-wear manufacturer for elegant women maxi gowns, kaftans, and tailored Oxford men suits with breathable tropical lining.',
    activeOrdersCount: 6,
    createdAt: '2026-04-12'
  },
  {
    id: 'sup-3',
    name: 'Fujian Wuyi Bio-Herbal Tea Corp.',
    chineseName: '福建武夷生物草本茶业集团',
    city: 'Wuyishan / Fuzhou',
    province: 'Fujian',
    address: 'Wuyi Eco-Industrial Tea Zone, Plot 18, Fujian Province',
    verifiedRating: 4.9,
    verifiedTier: 'Audited Factory',
    primaryCategories: ['gummies-tea'],
    contactPerson: 'Master Tea Master Huang Qun',
    phone: '+86 599 5288 901',
    wechatId: 'wuyi_herbal_huang',
    email: 'export@wuyibio-tea.cn',
    moq: '200 Pouches / Cartons',
    leadTimeDays: 7,
    qualityCertifications: ['HACCP', 'GMP Certified', 'USDA Organic', 'Phytosanitary SLA'],
    notes: 'Organic botanical producer providing certified moringa, wild hibiscus, ginger detox infusions with complete phytosanitary lab testing for Sierra Leone NRA customs.',
    activeOrdersCount: 3,
    createdAt: '2026-05-18'
  },
  {
    id: 'sup-4',
    name: 'Shenzhen NuoXin Dietary Biotech Co.',
    chineseName: '深圳诺信膳食生物科技有限公司',
    city: 'Shenzhen',
    province: 'Guangdong',
    address: 'Baoan High-Tech Industrial Park, Building C3, Shenzhen',
    verifiedRating: 4.7,
    verifiedTier: 'Verified Manufacturer',
    primaryCategories: ['gummies-tea'],
    contactPerson: 'Dr. Amy Zhang (Formulation Lead)',
    phone: '+86 755 2780 1930',
    wechatId: 'nuoxin_biotech_amy',
    email: 'amy.zhang@nuoxinbio.com',
    moq: '500 Bottles',
    leadTimeDays: 12,
    qualityCertifications: ['FDA Registered', 'GMP', 'ISO22000', 'Halal Compliant'],
    notes: 'Specializes in pectin chewable gummies (Apple Cider Vinegar, Biotin, Sea Moss, Multivitamins) with moisture-proof tropical packaging.',
    activeOrdersCount: 2,
    createdAt: '2026-06-22'
  },
  {
    id: 'sup-5',
    name: 'Chaozhou Jingang Stainless & Solar Electronics',
    chineseName: '潮州金钢不锈钢与太阳能电器实业',
    city: 'Chaozhou',
    province: 'Guangdong',
    address: 'Caitang Stainless Steel Industrial Base, Chaozhou City',
    verifiedRating: 4.8,
    verifiedTier: 'Gold Supplier',
    primaryCategories: ['household'],
    contactPerson: 'Guo Zhipeng',
    phone: '+86 768 6682 559',
    wechatId: 'jingang_cookware_guo',
    email: 'zhipeng@jingang-metals.com',
    moq: '30 Sets / Cartons',
    leadTimeDays: 15,
    qualityCertifications: ['LFGB Food Grade', 'CE', 'RoHS', 'ISO9001'],
    notes: 'Heavy gauge SUS304 cookware sets and solar emergency DC lighting systems engineered for durability in West Africa.',
    activeOrdersCount: 3,
    createdAt: '2026-07-05'
  }
];

export const INITIAL_TESTIMONIALS: CustomerTestimonial[] = [
  {
    id: 'test-1',
    customerName: 'Mariama Bangura',
    location: 'Rawdon Street, Central Freetown',
    role: 'Boutique Owner & Fashion Designer',
    rating: 5,
    quote: 'The Guinea gold-thread brocade and silk maxi dresses sourced directly from China have transformed my boutique inventory. The fabric weight and color brilliance are second to none in Freetown. Paying via Orange Money (+232 73 775786) and picking up at 15 Macdonald Street is smooth and reliable!',
    purchasedProduct: 'Royal Guinea Gold-Thread Brocade Fabric',
    date: 'October 2026',
    verifiedPurchase: true
  },
  {
    id: 'test-2',
    customerName: 'Dr. Alusine Koroma',
    location: 'Wilberforce, Freetown',
    role: 'Health Consultant & University Lecturer',
    rating: 5,
    quote: 'I recommend the Organic Moringa and Hibiscus detox tea to my wellness clients. Having authentic certified botanicals imported through Global Lite with full NRA phytosanitary clearance gives us total confidence. Fast dispatch in Freetown!',
    purchasedProduct: 'Organic Moringa & Hibiscus Detox Wellness Tea',
    date: 'October 2026',
    verifiedPurchase: true
  },
  {
    id: 'test-3',
    customerName: 'Haja Fatmata Sesay',
    location: 'Kissy Road Market, Freetown',
    role: 'Wholesale Fabric Merchant',
    rating: 5,
    quote: 'Global Lite Logistics is the most honest freight partner from Guangzhou to Queen Elizabeth II Quay. Consignee Abdul K. Sesay and Manager Williette Lawson handle clearing transparently. No hidden port demurrage and the GTB bank transfer option makes large bulk orders painless.',
    purchasedProduct: 'African Super-Wax Real Dutch Hollandais (Bulk)',
    date: 'September 2026',
    verifiedPurchase: true
  },
  {
    id: 'test-4',
    customerName: 'Samuel Conteh',
    location: 'Aberdeen, Freetown',
    role: 'Senior Project Engineer',
    rating: 5,
    quote: 'The solar emergency lighting units and stainless cookware arrived in mint condition. The multi-currency pricing and the direct AfriMoney payment to +232 33 434592 without any confusing agent codes made purchasing effortless.',
    purchasedProduct: 'Solar Rechargeable Emergency Home Power Lantern',
    date: 'October 2026',
    verifiedPurchase: true
  }
];

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'ship-101',
    trackingNumber: 'GLL-SL-884210',
    billOfLading: 'B/L-COSCO-FNA-99412',
    containerNumber: 'CSQU3094821',
    freightType: 'SEA_FCL',
    originPort: 'Guangzhou Port (Nansha Terminal, China)',
    destinationPort: 'Queen Elizabeth II Quay (Water Quay, Freetown, SL)',
    vesselName: 'COSCO SHIPPING KILIMANJARO V.204W',
    departureDate: '2026-10-02',
    estimatedArrival: '2026-11-08',
    status: 'in_transit',
    cbm: 68.4,
    grossWeightKg: 14250,
    packagesCount: 420,
    goodsDescription: 'Consolidated Textiles (Guinea Brocade, Wax Cotton), Women Fashion Dresses, Dietary Herbal Tea, Household Stainless Utensils',
    consignee: {
      name: 'Abdul K. Sesay',
      company: 'Mauwiltus Enterprise / Global Lite Logistics',
      address: '15 Macdonald Street, Freetown, Sierra Leone',
      phone: '+232 90 703350'
    },
    manager: {
      name: 'Williette M. Lawson',
      company: 'Mauwiltus Enterprise',
      phone: '+232 73 775786'
    },
    shipper: {
      name: 'Global Lite Logistics (Guangzhou Consolidation Depot)',
      city: 'Guangzhou (Baiyun District)',
      country: 'China'
    },
    milestones: [
      {
        stage: 'origin_received',
        label: 'Consignment Received at Guangzhou Consolidation Yard',
        location: 'Guangzhou Warehouse #2, Baiyun',
        timestamp: '2026-10-01 10:15 GMT+8',
        completed: true,
        notes: 'Inspection verified: 420 cartons barcoded & loaded into 40ft High Cube container.'
      },
      {
        stage: 'customs_export_cleared',
        label: 'China Customs Export Declaration Clearance',
        location: 'Nansha Port Customs, Guangzhou',
        timestamp: '2026-10-03 16:30 GMT+8',
        completed: true,
        notes: 'Export commodity codes HS 5208.52, HS 6204.42, HS 2106.90 certified.'
      },
      {
        stage: 'in_transit',
        label: 'Ocean Vessel In Transit (Atlantic Route to Freetown)',
        location: 'Gulf of Guinea / West Africa Maritime Corridor',
        timestamp: '2026-10-23 08:00 GMT',
        completed: true,
        notes: 'Vessel cruising speed 18.2 knots. On schedule for Queen Elizabeth II Quay berth.'
      },
      {
        stage: 'arrived_freetown_port',
        label: 'Berth & Discharge at Queen Elizabeth II Quay',
        location: 'Water Quay Terminal, Freetown, Sierra Leone',
        timestamp: 'Estimated 2026-11-08 06:00 GMT',
        completed: false,
        notes: 'Nectar SL stevedoring and Bollore container terminal discharge queue.'
      },
      {
        stage: 'nra_customs_clearance',
        label: 'NRA Customs ASYCUDA World Clearance & Tax Assessment',
        location: 'ASYCUDA Customs Office, Freetown Quay',
        timestamp: 'Estimated 2026-11-10 14:00 GMT',
        completed: false,
        notes: 'Customs Single Administrative Document (SAD) pre-lodged under Consignee Abdul K. Sesay.'
      },
      {
        stage: 'delivered_to_store',
        label: 'Final Delivery & Gate-In to Mauwiltus Enterprise',
        location: '15 Macdonald Street, Freetown, Sierra Leone',
        timestamp: 'Estimated 2026-11-12 11:30 GMT',
        completed: false,
        notes: 'Handover to Manager Williette M. Lawson for retail inventory shelving.'
      }
    ],
    customsStatus: {
      asycudaNumber: 'ASY-FNA-2026-009841',
      dutyAssessedSLE: 45200,
      gstAmountSLE: 33900,
      clearedDate: undefined
    }
  },
  {
    id: 'ship-102',
    trackingNumber: 'GLL-AIR-90432',
    billOfLading: 'AWB-ET-7264901',
    freightType: 'AIR_CARGO',
    originPort: 'Shenzhen Baoan International Airport (SZX)',
    destinationPort: 'Freetown International Airport (Lungi - FNA)',
    vesselName: 'Ethiopian Cargo ET3901 (via Addis Ababa)',
    departureDate: '2026-10-21',
    estimatedArrival: '2026-10-27',
    status: 'in_transit',
    cbm: 4.2,
    grossWeightKg: 850,
    packagesCount: 45,
    goodsDescription: 'Express Health Botanicals, Wellness Gummies, Designer Women Silks & Sample Swatches',
    consignee: {
      name: 'Abdul K. Sesay',
      company: 'Mauwiltus Enterprise / Global Lite',
      address: '15 Macdonald Street, Freetown, Sierra Leone',
      phone: '+232 90 703350'
    },
    manager: {
      name: 'Williette M. Lawson',
      company: 'Mauwiltus Enterprise',
      phone: '+232 73 775786'
    },
    shipper: {
      name: 'Global Lite Air Cargo Hub',
      city: 'Shenzhen',
      country: 'China'
    },
    milestones: [
      {
        stage: 'origin_received',
        label: 'Air Cargo Handover & Weighing',
        location: 'Shenzhen Cargo Terminal',
        timestamp: '2026-10-20 14:00 GMT+8',
        completed: true
      },
      {
        stage: 'customs_export_cleared',
        label: 'Shenzhen Airport Customs Export Clearance',
        location: 'Shenzhen International Air Hub',
        timestamp: '2026-10-21 11:00 GMT+8',
        completed: true
      },
      {
        stage: 'in_transit',
        label: 'Flight Segment Transit (Transit via Addis Ababa Bole)',
        location: 'In Air / En Route to Lungi Airport',
        timestamp: '2026-10-23 12:45 GMT',
        completed: true
      },
      {
        stage: 'arrived_freetown_port',
        label: 'Touchdown at Freetown Lungi Airport Cargo Bay',
        location: 'Lungi International Airport, Sierra Leone',
        timestamp: 'Estimated 2026-10-27 15:30 GMT',
        completed: false
      },
      {
        stage: 'nra_customs_clearance',
        label: 'NRA Airport Airway Bill Inspection & Release',
        location: 'Lungi Airport Customs Shed',
        timestamp: 'Estimated 2026-10-28 10:00 GMT',
        completed: false
      },
      {
        stage: 'delivered_to_store',
        label: 'Sea Coach Ferry Transfer to 15 Macdonald Street Depot',
        location: '15 Macdonald Street, Freetown, Sierra Leone',
        timestamp: 'Estimated 2026-10-28 17:00 GMT',
        completed: false
      }
    ],
    customsStatus: {
      asycudaNumber: 'ASY-LUN-2026-004412',
      dutyAssessedSLE: 12400,
      gstAmountSLE: 9300
    }
  }
];

export const INITIAL_WAREHOUSES: WarehouseLocation[] = [
  {
    id: 'wh-1',
    code: 'CAN-GZ-01',
    name: 'Guangzhou Consolidation Logistics Hub',
    city: 'Guangzhou',
    country: 'China',
    address: 'No. 88 Guangyuan Road, Baiyun International Logistics Park',
    manager: 'Chen Wei (China Sourcing Lead)',
    contact: '+86 138 2901 8842',
    currentCbmUsed: 340,
    capacityCbm: 600,
    activeShipmentsCount: 8
  },
  {
    id: 'wh-2',
    code: 'YIW-ZJ-02',
    name: 'Yiwu International Small Commodity Depot',
    city: 'Yiwu',
    country: 'China',
    address: 'International Trade City District 4, Logistics Gate 12',
    manager: 'Zhang Lin (Global Lite Agent)',
    contact: '+86 159 8812 7300',
    currentCbmUsed: 195,
    capacityCbm: 400,
    activeShipmentsCount: 5
  },
  {
    id: 'wh-3',
    code: 'FNA-QEQ-03',
    name: 'Queen Elizabeth II Quay Bonded Yard',
    city: 'Freetown',
    country: 'Sierra Leone',
    address: 'Terminal Gate 3, Cline Town, Freetown Port',
    manager: 'Abdul K. Sesay (Consignee & Clearing Officer)',
    contact: '+232 90 703350',
    currentCbmUsed: 140,
    capacityCbm: 300,
    activeShipmentsCount: 3
  },
  {
    id: 'wh-4',
    code: 'FNA-MAC-04',
    name: 'Mauwiltus Enterprise Central Retail & Distribution Store',
    city: 'Freetown',
    country: 'Sierra Leone',
    address: '15 Macdonald Street, Central Freetown',
    manager: 'Williette M. Lawson (Store Manager)',
    contact: '+232 73 775786',
    currentCbmUsed: 82,
    capacityCbm: 120,
    activeShipmentsCount: 2
  }
];

export const INITIAL_CUSTOMS_DOCS: CustomsDoc[] = [
  {
    id: 'doc-001',
    docType: 'NRA ASYCUDA SAD',
    referenceNumber: 'ASY-FNA-2026-009841',
    shipmentId: 'ship-101',
    consigneeName: 'Abdul K. Sesay / Mauwiltus Enterprise',
    consigneeAddress: '15 Macdonald Street, Freetown, Sierra Leone',
    managerName: 'Williette M. Lawson',
    dateIssued: '2026-10-04',
    totalValueUSD: 24800,
    totalValueSLE: 565440,
    itemCount: 420,
    status: 'Submitted',
    details: {
      customsOffice: 'Water Quay Customs (FNA-01)',
      declarantCode: 'DEC-SL-8841',
      vatTaxId: 'TIN-10048291-SL'
    }
  },
  {
    id: 'doc-002',
    docType: 'Bill of Lading',
    referenceNumber: 'B/L-COSCO-FNA-99412',
    shipmentId: 'ship-101',
    consigneeName: 'Abdul K. Sesay',
    consigneeAddress: '15 Macdonald Street, Freetown, Sierra Leone',
    managerName: 'Williette M. Lawson',
    dateIssued: '2026-10-02',
    totalValueUSD: 24800,
    totalValueSLE: 565440,
    itemCount: 420,
    status: 'Certified',
    details: {
      carrier: 'COSCO SHIPPING Lines',
      vesselVoyage: 'COSCO KILIMANJARO V.204W',
      portOfLoading: 'Guangzhou Port (Nansha Terminal, China)',
      portOfDischarge: 'Queen Elizabeth II Quay, Freetown',
      containerNumber: 'CSQU3094821',
      sealNumber: 'COS-772910'
    }
  },
  {
    id: 'doc-003',
    docType: 'Commercial Invoice',
    referenceNumber: 'INV-GLL-2026-884',
    shipmentId: 'ship-101',
    consigneeName: 'Mauwiltus Enterprise (Consignee: Abdul K. Sesay)',
    consigneeAddress: '15 Macdonald Street, Freetown, Sierra Leone',
    managerName: 'Williette M. Lawson',
    dateIssued: '2026-10-02',
    totalValueUSD: 24800,
    totalValueSLE: 565440,
    itemCount: 420,
    status: 'Certified',
    details: {
      incoterms: 'CIF Freetown Port',
      paymentTerms: 'GTB In-Branch Deposit / Direct Transfer',
      currency: 'USD'
    }
  },
  {
    id: 'doc-004',
    docType: 'Packing List',
    referenceNumber: 'PKL-GLL-2026-884',
    shipmentId: 'ship-101',
    consigneeName: 'Mauwiltus Enterprise (Williette M. Lawson)',
    consigneeAddress: '15 Macdonald Street, Freetown, Sierra Leone',
    managerName: 'Williette M. Lawson',
    dateIssued: '2026-10-02',
    totalValueUSD: 24800,
    totalValueSLE: 565440,
    itemCount: 420,
    status: 'Certified',
    details: {
      totalNetWeightKg: 13200,
      totalGrossWeightKg: 14250,
      totalVolumeCbm: 68.4
    }
  },
  {
    id: 'doc-005',
    docType: 'Phytosanitary Cert',
    referenceNumber: 'PHY-CN-SL-8812',
    shipmentId: 'ship-101',
    consigneeName: 'Mauwiltus Enterprise (Williette M. Lawson)',
    consigneeAddress: '15 Macdonald Street, Freetown, Sierra Leone',
    managerName: 'Williette M. Lawson',
    dateIssued: '2026-09-30',
    totalValueUSD: 4200,
    totalValueSLE: 95760,
    itemCount: 120,
    status: 'Certified'
  }
];

export const INITIAL_ADS: AdBanner[] = [
  {
    id: 'ad-1',
    title: 'Guangzhou to Freetown Sea Cargo Booking Open',
    message: 'Next 40ft High Cube Container loading at Baiyun depot closes in 6 days. Sourcing rates from $165/CBM all-inclusive to Queen Elizabeth II Quay.',
    linkText: 'Track Shipments',
    targetView: 'tracking',
    active: true,
    startDate: '2026-10-20',
    endDate: '2026-11-15'
  },
  {
    id: 'ad-2',
    title: 'Mauwiltus Enterprise New Arrival Fabrics & Herbal Teas',
    message: 'Authentic Guinea Brocade & Detox wellness teas in stock at 15 Macdonald Street. Pay with Orange Money (+232 73 775786), AfriMoney (+232 33 434592) or GTB Bank transfer!',
    linkText: 'Shop Catalog',
    targetView: 'store',
    active: true,
    startDate: '2026-10-22',
    endDate: '2026-11-20'
  }
];
