import React, { useState } from 'react';
import { Product, Order, WarehouseLocation, AdBanner, OfflineAction, ProductCategory, SupplierProfile } from '../types';
import { STORE_INFO, INITIAL_RATES } from '../data/initialData';
import { StorageService } from '../services/storage';
import { 
  Package, Plus, Edit2, Trash2, CheckCircle2, AlertTriangle, 
  Warehouse, ShoppingCart, Megaphone, Wifi, Download, Upload, 
  RefreshCw, FileSpreadsheet, EyeOff, Eye, Factory, Star, Phone, MessageSquare, Mail, Award, Clock
} from 'lucide-react';

interface Props {
  products: Product[];
  orders: Order[];
  warehouses: WarehouseLocation[];
  ads: AdBanner[];
  suppliers: SupplierProfile[];
  offlineActions: OfflineAction[];
  isOnline: boolean;
  onRefreshProducts: () => void;
  onRefreshOrders: () => void;
  onRefreshAds: () => void;
  onRefreshSuppliers: () => void;
  onRefreshOffline: () => void;
}

export const AdminPanel: React.FC<Props> = ({
  products,
  orders,
  warehouses,
  ads,
  suppliers,
  offlineActions,
  isOnline,
  onRefreshProducts,
  onRefreshOrders,
  onRefreshAds,
  onRefreshSuppliers,
  onRefreshOffline
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'suppliers' | 'alerts' | 'warehouses' | 'orders' | 'ads' | 'offline' | 'erp'>('products');
  
  // Product Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Supplier Modal states
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierProfile | null>(null);

  // Supplier form state
  const [supName, setSupName] = useState('');
  const [supChineseName, setSupChineseName] = useState('');
  const [supCity, setSupCity] = useState('Guangzhou');
  const [supProvince, setSupProvince] = useState('Guangdong');
  const [supAddress, setSupAddress] = useState('');
  const [supRating, setSupRating] = useState<number>(4.9);
  const [supTier, setSupTier] = useState<'Gold Supplier' | 'Verified Manufacturer' | 'Audited Factory'>('Gold Supplier');
  const [supCategory, setSupCategory] = useState<ProductCategory>('fabrics');
  const [supContact, setSupContact] = useState('');
  const [supPhone, setSupPhone] = useState('+86 ');
  const [supWechat, setSupWechat] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supMoq, setSupMoq] = useState('100 Units / 500 Yards');
  const [supLeadTime, setSupLeadTime] = useState<number>(14);
  const [supCerts, setSupCerts] = useState('ISO9001, OEKO-TEX, GMP');
  const [supNotes, setSupNotes] = useState('');

  // New product form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('fabrics');
  const [priceSLE, setPriceSLE] = useState<number>(500);
  const [costCNY, setCostCNY] = useState<number>(80);
  const [stock, setStock] = useState<number>(25);
  const [origin, setOrigin] = useState('Guangzhou, China');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [previewImage, setPreviewImage] = useState<string>('');

  // Handle Image File Upload (converts file to base64 Data URL so it is permanently stored in localStorage)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrl(base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const presetImages = [
    { label: 'African Brocade & Fabrics', url: '/src/assets/images/product_african_fabrics_1792794257597.jpg' },
    { label: 'Organic Detox Herbal Tea', url: '/src/assets/images/product_herbal_wellness_tea_1792794257744.jpg' },
    { label: "Women's Fashion Dress", url: '/src/assets/images/product_women_fashion_dress_1792794257152.jpg' },
    { label: "Men's Tailored Suit", url: '/src/assets/images/product_men_tailored_suit_1792794258596.jpg' },
    { label: 'Global Container Shipping', url: '/src/assets/images/hero_sino_salone_logistics_1792794255768.jpg' },
  ];

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const categoryLabels: Record<ProductCategory, string> = {
      'men-dress': "Men's Apparel",
      'women-dress': "Women's Dresses",
      'gummies-tea': "Gummies & Health Tea",
      'fabrics': "Fabrics & Textiles",
      'household': "Household Items"
    };

    const priceUSD = Number((priceSLE / INITIAL_RATES.SLE_PER_USD).toFixed(2));
    const priceCNY = Number((priceSLE / INITIAL_RATES.SLE_PER_CNY).toFixed(0));

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name,
        category,
        categoryLabel: categoryLabels[category],
        priceSLE,
        priceUSD,
        priceCNY,
        costCNY,
        stock,
        soldOut: stock === 0,
        origin,
        sku: sku || editingProduct.sku,
        description,
        imageUrl: imageUrl || editingProduct.imageUrl
      };
      StorageService.updateProduct(updated);
      setEditingProduct(null);
    } else {
      StorageService.saveProduct({
        name,
        category,
        categoryLabel: categoryLabels[category],
        priceSLE,
        priceUSD,
        priceCNY,
        costCNY,
        stock,
        soldOut: stock === 0,
        origin,
        sku: sku || `ME-${category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        description,
        imageUrl: imageUrl || presetImages[0].url,
        specs: {
          'Origin': origin,
          'Added By': STORE_INFO.managerName,
          'Import Route': 'China to Sierra Leone (Water Quay)'
        }
      });
      setIsAddModalOpen(false);
    }

    setName('');
    setPriceSLE(500);
    setCostCNY(80);
    setStock(25);
    setSku('');
    setDescription('');
    setImageUrl('');
    setPreviewImage('');
    onRefreshProducts();
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setPriceSLE(p.priceSLE);
    setCostCNY(p.costCNY);
    setStock(p.stock);
    setOrigin(p.origin);
    setSku(p.sku);
    setDescription(p.description);
    setImageUrl(p.imageUrl);
    setPreviewImage(p.imageUrl);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to permanently delete this product from the website?')) {
      StorageService.deleteProduct(productId);
      onRefreshProducts();
    }
  };

  const handleToggleSoldOut = (productId: string) => {
    StorageService.toggleSoldOut(productId);
    onRefreshProducts();
  };

  // Supplier handlers
  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName.trim()) return;

    const certList = supCerts.split(',').map(c => c.trim()).filter(Boolean);

    if (editingSupplier) {
      const updated: SupplierProfile = {
        ...editingSupplier,
        name: supName,
        chineseName: supChineseName,
        city: supCity,
        province: supProvince,
        address: supAddress,
        verifiedRating: Number(supRating),
        verifiedTier: supTier,
        primaryCategories: [supCategory],
        contactPerson: supContact,
        phone: supPhone,
        wechatId: supWechat,
        email: supEmail,
        moq: supMoq,
        leadTimeDays: Number(supLeadTime),
        qualityCertifications: certList,
        notes: supNotes
      };
      StorageService.updateSupplier(updated);
      setEditingSupplier(null);
    } else {
      StorageService.saveSupplier({
        name: supName,
        chineseName: supChineseName,
        city: supCity,
        province: supProvince,
        address: supAddress,
        verifiedRating: Number(supRating),
        verifiedTier: supTier,
        primaryCategories: [supCategory],
        contactPerson: supContact,
        phone: supPhone,
        wechatId: supWechat,
        email: supEmail,
        moq: supMoq,
        leadTimeDays: Number(supLeadTime),
        qualityCertifications: certList,
        notes: supNotes,
        activeOrdersCount: 1
      });
      setIsAddSupplierOpen(false);
    }

    // Reset
    setSupName('');
    setSupChineseName('');
    setSupAddress('');
    setSupContact('');
    setSupPhone('+86 ');
    setSupWechat('');
    setSupEmail('');
    setSupNotes('');
    onRefreshSuppliers();
  };

  const handleOpenEditSupplier = (s: SupplierProfile) => {
    setEditingSupplier(s);
    setSupName(s.name);
    setSupChineseName(s.chineseName || '');
    setSupCity(s.city);
    setSupProvince(s.province);
    setSupAddress(s.address);
    setSupRating(s.verifiedRating);
    setSupTier(s.verifiedTier);
    setSupCategory(s.primaryCategories[0] || 'fabrics');
    setSupContact(s.contactPerson);
    setSupPhone(s.phone);
    setSupWechat(s.wechatId);
    setSupEmail(s.email);
    setSupMoq(s.moq);
    setSupLeadTime(s.leadTimeDays);
    setSupCerts(s.qualityCertifications.join(', '));
    setSupNotes(s.notes);
  };

  const handleDeleteSupplier = (id: string) => {
    if (confirm('Permanently remove this Chinese supplier profile?')) {
      StorageService.deleteSupplier(id);
      onRefreshSuppliers();
    }
  };

  const handleSyncOfflineQueue = () => {
    StorageService.clearSyncedOfflineActions();
    onRefreshOffline();
    alert('All local queued transactions synced successfully with central ERP database.');
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mauwiltus_catalog_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportOrdersCSV = () => {
    const headers = "Order Number,Customer Name,Phone,Delivery Address,Payment Method,Status,Total SLE,Date\n";
    const rows = orders.map(o => 
      `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.deliveryAddress}","${o.paymentMethod}","${o.fulfillmentStatus}",${o.totalSLE},"${o.createdAt}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `orders_mauwiltus_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
    a.remove();
  };

  const lowStockProducts = products.filter(p => p.stock <= 15 || p.soldOut);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Executive Control Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <span>Executive Management & Control Portal</span>
            <span aria-hidden="true">·</span>
            <span>China - Sierra Leone Trade</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">
            Global Lite & Mauwiltus Enterprise Admin
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
            <span>Manager: <strong className="text-slate-900">{STORE_INFO.managerName}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Consignee: <strong className="text-slate-900">{STORE_INFO.consigneeName}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Location: <strong className="text-slate-900">{STORE_INFO.address}</strong></span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-700">{STORE_INFO.primaryContact} / {STORE_INFO.secondaryContact}</span>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {activeTab === 'suppliers' ? (
            <button
              onClick={() => {
                setEditingSupplier(null);
                setIsAddSupplierOpen(true);
              }}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add China Manufacturer</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'products' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Product Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'suppliers' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Factory className="w-3.5 h-3.5" />
          <span>Supplier Profiles ({suppliers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'alerts' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Inventory Alerts</span>
          {lowStockProducts.length > 0 && (
            <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full text-[10px] tabular-nums">
              {lowStockProducts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('warehouses')}
          className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'warehouses' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Warehouses & Hubs ({warehouses.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'orders' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('ads')}
          className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'ads' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Promos & Advertising ({ads.length})
        </button>
        <button
          onClick={() => setActiveTab('offline')}
          className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'offline' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Offline Sync Portal
        </button>
        <button
          onClick={() => setActiveTab('erp')}
          className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'erp' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          ERP Integrations & API
        </button>
      </div>

      {/* TAB: SUPPLIER PROFILES (New Requirement) */}
      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Verified Chinese Manufacturers & Trade Partners</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage direct mill and factory contacts in Shaoxing, Guangzhou, Yiwu, Fujian and Shenzhen for optimal procurement pricing and lead time oversight.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingSupplier(null);
                setIsAddSupplierOpen(true);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Manufacturer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map(sup => (
              <div key={sup.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {sup.verifiedTier}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{sup.name}</h4>
                      {sup.chineseName && (
                        <div className="text-[11px] text-slate-400 font-sans">{sup.chineseName}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-900 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{sup.verifiedRating}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1.5 py-3 border-t border-b border-slate-100 my-3">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-[11px]">{sup.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-[11px]">WeChat: <strong className="font-mono text-slate-800">{sup.wechatId}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[11px] truncate">{sup.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="text-[11px]">MOQ: {sup.moq} · Lead: {sup.leadTimeDays}d</span>
                    </div>
                  </div>

                  {sup.qualityCertifications && sup.qualityCertifications.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {sup.qualityCertifications.map((c, i) => (
                        <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {sup.notes}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Location: <strong className="text-slate-800">{sup.city}, {sup.province}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditSupplier(sup)}
                      className="p-1.5 text-slate-600 hover:text-amber-700 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Supplier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSupplier(sup.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Delete Supplier"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Product Catalog Management */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Permanent Inventory Items</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Saved permanently in localStorage & viewable across devices. Edit or delete sold out products permanently.
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Reset catalog to initial default demo items? Any newly added items will be replaced.')) {
                  StorageService.resetDefaults();
                  onRefreshProducts();
                  onRefreshSuppliers();
                }
              }}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-3 px-4">Item & Visual</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 font-mono">SKU / Origin</th>
                  <th className="py-3 px-4 text-right">Price (SLE)</th>
                  <th className="py-3 px-4 text-right">Cost (CNY)</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-cover rounded-md bg-slate-100 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <span className="font-semibold text-slate-900 block max-w-xs truncate">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">
                            {p.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{p.categoryLabel}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      <div>{p.sku}</div>
                      <div className="text-[10px] text-slate-400">{p.origin}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      SLE {p.priceSLE.toLocaleString('en-US')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums">
                      ¥{p.costCNY}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold tabular-nums">
                      <span className={p.stock <= 5 ? 'text-rose-600' : 'text-slate-800'}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {p.soldOut ? (
                        <span className="text-rose-700 font-semibold text-[11px]">Sold Out</span>
                      ) : (
                        <span className="text-emerald-700 font-medium text-[11px]">Active</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleSoldOut(p.id)}
                          title={p.soldOut ? 'Mark In Stock' : 'Mark Sold Out'}
                          className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          {p.soldOut ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          title="Edit Product Details"
                          className="p-1.5 text-slate-600 hover:text-amber-700 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          title="Permanently Delete Item"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Inventory Discrepancy Alerts */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-amber-950 text-base">
                Automated Inventory Discrepancy & Low Stock System
              </h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                The platform automatically scans inventory velocity across Guangzhou, Yiwu, Queen Elizabeth II Quay, and 15 Macdonald Street. Items falling under threshold are flagged below for replenishment container booking.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lowStockProducts.map(p => (
              <div key={p.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded-lg bg-slate-100 shrink-0"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div>
                    <h4 className="font-semibold text-xs text-slate-900">{p.name}</h4>
                    <span className="text-[11px] text-slate-500 font-mono">SKU: {p.sku} · {p.origin}</span>
                    <div className="text-[11px] mt-1 font-semibold text-rose-700">
                      Remaining stock: {p.stock} units ({p.soldOut ? 'Sold out permanently' : 'Critically low'})
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEdit(p)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors cursor-pointer shrink-0"
                >
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Distributed Warehouses */}
      {activeTab === 'warehouses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {warehouses.map(wh => {
            const usagePercent = Math.round((wh.currentCbmUsed / wh.capacityCbm) * 100);
            return (
              <div key={wh.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-700">{wh.code}</span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{wh.name}</h3>
                    <div className="text-xs text-slate-500">{wh.city}, {wh.country}</div>
                  </div>
                  <Warehouse className="w-5 h-5 text-slate-400" />
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <div><strong>Address:</strong> {wh.address}</div>
                  <div><strong>Manager:</strong> {wh.manager}</div>
                  <div><strong>Phone:</strong> {wh.contact}</div>
                </div>

                {/* Capacity Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Volumetric Utilization</span>
                    <span className="font-mono font-bold text-slate-900">{usagePercent}% ({wh.currentCbmUsed}/{wh.capacityCbm} CBM)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${usagePercent > 80 ? 'bg-amber-600' : 'bg-slate-900'}`}
                      style={{ width: `${Math.min(100, usagePercent)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 4: Customer Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Customer Orders & Payment Records</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Orange Money, AfriMoney (+232 33 434592), GTB Bank Transfer & In-store pickup at 15 Macdonald Street.
              </p>
            </div>
            <button
              onClick={handleExportOrdersCSV}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No orders placed yet. Place an order on the storefront to test checkout!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Delivery / Pickup</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4 text-right">Amount (SLE)</th>
                    <th className="py-3 px-4 text-center">Fulfillment</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{order.orderNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{order.customerName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{order.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{order.deliveryAddress}</td>
                      <td className="py-3 px-4 capitalize">
                        <span className="font-medium text-slate-800">
                          {order.paymentMethod === 'afrimoney' ? 'AfriMoney (+232 33 434592)' : order.paymentMethod === 'bank-transfer' ? 'GTB Bank Transfer' : order.paymentMethod.replace('-', ' ')}
                        </span>
                        <div className="text-[10px] font-mono text-slate-400">{order.paymentReference}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                        SLE {order.totalSLE.toLocaleString('en-US')}
                      </td>
                      <td className="py-3 px-4 text-center capitalize">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          order.fulfillmentStatus === 'delivered' ? 'bg-emerald-50 text-emerald-800' :
                          order.fulfillmentStatus === 'ready_for_pickup' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {order.fulfillmentStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={order.fulfillmentStatus}
                          onChange={(e) => {
                            StorageService.updateOrderStatus(order.id, { fulfillmentStatus: e.target.value as any });
                            onRefreshOrders();
                          }}
                          className="text-[11px] bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-700 cursor-pointer"
                        >
                          <option value="processing">Processing</option>
                          <option value="ready_for_pickup">Ready for Pickup</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Advertising & Banners */}
      {activeTab === 'ads' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Promotional Announcements & Cargo Departure Banners</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control top announcement headlines seen by website visitors and freight shippers.
            </p>
          </div>

          <div className="space-y-4">
            {ads.map(ad => (
              <div key={ad.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 text-sm">{ad.title}</h4>
                  <button
                    onClick={() => {
                      StorageService.saveAd({ ...ad, active: !ad.active });
                      onRefreshAds();
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                      ad.active ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {ad.active ? 'Active on Top Bar' : 'Paused'}
                  </button>
                </div>
                <p className="text-slate-600">{ad.message}</p>
                <div className="text-[11px] text-slate-400">
                  Target Route: <strong className="text-slate-700">{ad.targetView}</strong> · Dates: {ad.startDate} to {ad.endDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Offline Functionality for Warehouse Workers */}
      {activeTab === 'offline' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Warehouse Offline Sync & Storage Engine</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Workers at Queen Elizabeth II Quay or 15 Macdonald Street depot can continue logging inventory audits even during network dropouts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isOnline ? 'Network Online' : 'Network Offline Mode'}
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="font-semibold text-slate-800">Pending Local Transactions in Queue:</div>
            <div className="text-slate-500">
              {offlineActions.length} transactions stored locally in IndexedDB / localStorage cache.
            </div>
            <div className="pt-2 flex gap-3">
              <button
                onClick={handleSyncOfflineQueue}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg cursor-pointer transition-colors"
              >
                Sync Queued Changes to Central Cloud
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: ERP Integrations & API Endpoints */}
      {activeTab === 'erp' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Enterprise Resource Planning (ERP) Synchronization</h3>
            <p className="text-slate-500 mt-0.5">
              Sync data in real-time with ASYCUDA World, GTB banking feeds, and warehouse management APIs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Product Catalog REST API</h4>
              <p className="text-slate-600">Endpoint: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">GET /api/v1/sino-salone/catalog</code></p>
              <button
                onClick={handleExportJSON}
                className="mt-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium cursor-pointer"
              >
                Download Complete JSON Schema
              </button>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Orders & Payments Export</h4>
              <p className="text-slate-600">Endpoint: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">GET /api/v1/orders/export</code></p>
              <button
                onClick={handleExportOrdersCSV}
                className="mt-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium cursor-pointer"
              >
                Download Orders CSV File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add or Edit Product */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 font-display mb-1">
              {editingProduct ? 'Edit Existing Product' : 'Add New Product to Store'}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Saved permanently into browser localStorage. Visible to all visitors.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Guinea Gold-Thread Cotton Brocade"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-900"
                  >
                    <option value="fabrics">Fabrics & Textiles</option>
                    <option value="women-dress">Women's Dresses</option>
                    <option value="men-dress">Men's Apparel</option>
                    <option value="gummies-tea">Gummies & Health Tea</option>
                    <option value="household">Household Items</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">SKU Code</label>
                  <input
                    type="text"
                    placeholder="e.g. ME-FAB-109"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Price (SLE) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={priceSLE}
                    onChange={(e) => setPriceSLE(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono tabular-nums focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Cost in China (CNY ¥)</label>
                  <input
                    type="number"
                    min="1"
                    value={costCNY}
                    onChange={(e) => setCostCNY(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono tabular-nums focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Initial Stock *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono tabular-nums focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">China Sourcing Origin</label>
                <input
                  type="text"
                  placeholder="e.g. Yiwu Trade City / Guangzhou Garment Hub"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Product description, materials, sizing or wellness benefits..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>

              {/* Upload Image Section */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                <label className="block text-slate-800 font-semibold mb-1">
                  Upload Product Image (Saved Permanently)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                />

                <div className="mt-2">
                  <span className="text-[11px] text-slate-500 block mb-1">Or choose a pre-generated high-res studio asset:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {presetImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setImageUrl(img.url);
                          setPreviewImage(img.url);
                        }}
                        className={`px-2 py-1 rounded text-[11px] border cursor-pointer ${
                          imageUrl === img.url ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>

                {previewImage && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-md border border-slate-300"
                    />
                    <span className="text-[11px] text-emerald-700 font-medium">Image attached ready to save</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add or Edit Supplier Profile */}
      {(isAddSupplierOpen || editingSupplier) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 font-display mb-1">
              {editingSupplier ? 'Edit Supplier Profile' : 'Add Chinese Manufacturer / Mill Profile'}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Registered in Global Lite supply chain database for direct sourcing and FOB procurement negotiation.
            </p>

            <form onSubmit={handleSaveSupplier} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Manufacturer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zhejiang Keqiao Royal Textile Mills Ltd."
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Chinese Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 浙江柯桥皇室纺织有限公司"
                    value={supChineseName}
                    onChange={(e) => setSupChineseName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Primary Category *</label>
                  <select
                    value={supCategory}
                    onChange={(e) => setSupCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-900"
                  >
                    <option value="fabrics">Fabrics & Textiles</option>
                    <option value="women-dress">Women's Dresses</option>
                    <option value="men-dress">Men's Apparel</option>
                    <option value="gummies-tea">Gummies & Health Tea</option>
                    <option value="household">Household Items</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="Shaoxing / Guangzhou"
                    value={supCity}
                    onChange={(e) => setSupCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Province *</label>
                  <input
                    type="text"
                    required
                    placeholder="Zhejiang / Guangdong"
                    value={supProvince}
                    onChange={(e) => setSupProvince(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Verified Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="3.0"
                    max="5.0"
                    value={supRating}
                    onChange={(e) => setSupRating(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Verification Tier</label>
                  <select
                    value={supTier}
                    onChange={(e) => setSupTier(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-900 font-medium"
                  >
                    <option value="Gold Supplier">Gold Supplier</option>
                    <option value="Verified Manufacturer">Verified Manufacturer</option>
                    <option value="Audited Factory">Audited Factory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lin Wei (Export Director)"
                    value={supContact}
                    onChange={(e) => setSupContact(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+86 138 XXXX XXXX"
                    value={supPhone}
                    onChange={(e) => setSupPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">WeChat ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="wechat_id"
                    value={supWechat}
                    onChange={(e) => setSupWechat(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="sales@mill.cn"
                    value={supEmail}
                    onChange={(e) => setSupEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Minimum Order Qty (MOQ)</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 Yards / 50 Sets"
                    value={supMoq}
                    onChange={(e) => setSupMoq(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Lead Time (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={supLeadTime}
                    onChange={(e) => setSupLeadTime(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Quality Certifications (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. ISO9001, OEKO-TEX 100, GMP, SGS Audited"
                  value={supCerts}
                  onChange={(e) => setSupCerts(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Factory Address & Sourcing Notes</label>
                <textarea
                  rows={2}
                  placeholder="Factory facility notes, consolidation dock in Guangzhou, quality guarantees..."
                  value={supNotes}
                  onChange={(e) => setSupNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddSupplierOpen(false);
                    setEditingSupplier(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg cursor-pointer shadow-xs"
                >
                  {editingSupplier ? 'Save Supplier' : 'Register Supplier Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
