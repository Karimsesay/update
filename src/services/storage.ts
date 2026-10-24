import { Product, Order, Shipment, WarehouseLocation, CustomsDoc, AdBanner, OfflineAction, SupplierProfile, CustomerTestimonial } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SHIPMENTS, INITIAL_WAREHOUSES, INITIAL_CUSTOMS_DOCS, INITIAL_ADS, INITIAL_SUPPLIERS, INITIAL_TESTIMONIALS } from '../data/initialData';

const KEYS = {
  PRODUCTS: 'gll_me_products_v2',
  ORDERS: 'gll_me_orders_v2',
  SHIPMENTS: 'gll_me_shipments_v2',
  WAREHOUSES: 'gll_me_warehouses_v2',
  CUSTOMS: 'gll_me_customs_v2',
  ADS: 'gll_me_ads_v2',
  OFFLINE_QUEUE: 'gll_me_offline_queue_v2',
  SUPPLIERS: 'gll_me_suppliers_v2',
  TESTIMONIALS: 'gll_me_testimonials_v2'
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    if (!val) return fallback;
    return JSON.parse(val) as T;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  // Products
  getProducts(): Product[] {
    const data = safeGet<Product[]>(KEYS.PRODUCTS, []);
    if (!data || data.length === 0) {
      safeSet(KEYS.PRODUCTS, INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    return data;
  },

  saveProduct(newProd: Omit<Product, 'id' | 'createdAt'>): Product {
    const products = this.getProducts();
    const product: Product = {
      ...newProd,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [product, ...products];
    safeSet(KEYS.PRODUCTS, updated);
    return product;
  },

  updateProduct(product: Product): Product[] {
    const products = this.getProducts();
    const updated = products.map(p => p.id === product.id ? product : p);
    safeSet(KEYS.PRODUCTS, updated);
    return updated;
  },

  deleteProduct(productId: string): Product[] {
    const products = this.getProducts();
    const updated = products.filter(p => p.id !== productId);
    safeSet(KEYS.PRODUCTS, updated);
    return updated;
  },

  toggleSoldOut(productId: string): Product[] {
    const products = this.getProducts();
    const updated = products.map(p => {
      if (p.id === productId) {
        return { ...p, soldOut: !p.soldOut, stock: !p.soldOut ? 0 : (p.stock || 10) };
      }
      return p;
    });
    safeSet(KEYS.PRODUCTS, updated);
    return updated;
  },

  // Suppliers
  getSuppliers(): SupplierProfile[] {
    const data = safeGet<SupplierProfile[]>(KEYS.SUPPLIERS, []);
    if (!data || data.length === 0) {
      safeSet(KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
      return INITIAL_SUPPLIERS;
    }
    return data;
  },

  saveSupplier(newSup: Omit<SupplierProfile, 'id' | 'createdAt'>): SupplierProfile {
    const list = this.getSuppliers();
    const supplier: SupplierProfile = {
      ...newSup,
      id: `sup-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [supplier, ...list];
    safeSet(KEYS.SUPPLIERS, updated);
    return supplier;
  },

  updateSupplier(supplier: SupplierProfile): SupplierProfile[] {
    const list = this.getSuppliers();
    const updated = list.map(s => s.id === supplier.id ? supplier : s);
    safeSet(KEYS.SUPPLIERS, updated);
    return updated;
  },

  deleteSupplier(supplierId: string): SupplierProfile[] {
    const list = this.getSuppliers();
    const updated = list.filter(s => s.id !== supplierId);
    safeSet(KEYS.SUPPLIERS, updated);
    return updated;
  },

  // Customer Testimonials
  getTestimonials(): CustomerTestimonial[] {
    const data = safeGet<CustomerTestimonial[]>(KEYS.TESTIMONIALS, []);
    if (!data || data.length === 0) {
      safeSet(KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
      return INITIAL_TESTIMONIALS;
    }
    return data;
  },

  saveTestimonial(newTest: Omit<CustomerTestimonial, 'id' | 'date'>): CustomerTestimonial {
    const list = this.getTestimonials();
    const item: CustomerTestimonial = {
      ...newTest,
      id: `test-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    const updated = [item, ...list];
    safeSet(KEYS.TESTIMONIALS, updated);
    return item;
  },

  // Orders
  getOrders(): Order[] {
    return safeGet<Order[]>(KEYS.ORDERS, []);
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const orders = this.getOrders();
    const orderNumber = `ME-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceNumber = `INV-SL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      orderNumber,
      invoiceIssued: true,
      invoiceNumber,
      createdAt: new Date().toISOString()
    };
    const updated = [newOrder, ...orders];
    safeSet(KEYS.ORDERS, updated);

    // Also deduct stock from products
    const products = this.getProducts();
    const updatedProducts = products.map(prod => {
      const match = newOrder.items.find(i => i.productId === prod.id);
      if (match) {
        const remaining = Math.max(0, prod.stock - match.quantity);
        return {
          ...prod,
          stock: remaining,
          soldOut: remaining === 0
        };
      }
      return prod;
    });
    safeSet(KEYS.PRODUCTS, updatedProducts);

    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Partial<Order>): Order[] {
    const orders = this.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, ...status } : o);
    safeSet(KEYS.ORDERS, updated);
    return updated;
  },

  // Shipments
  getShipments(): Shipment[] {
    const data = safeGet<Shipment[]>(KEYS.SHIPMENTS, []);
    if (!data || data.length === 0) {
      safeSet(KEYS.SHIPMENTS, INITIAL_SHIPMENTS);
      return INITIAL_SHIPMENTS;
    }
    return data;
  },

  saveShipment(shipment: Shipment): Shipment[] {
    const list = this.getShipments();
    const existingIndex = list.findIndex(s => s.id === shipment.id);
    let updated: Shipment[];
    if (existingIndex >= 0) {
      updated = list.map(s => s.id === shipment.id ? shipment : s);
    } else {
      updated = [shipment, ...list];
    }
    safeSet(KEYS.SHIPMENTS, updated);
    return updated;
  },

  // Warehouses
  getWarehouses(): WarehouseLocation[] {
    const data = safeGet<WarehouseLocation[]>(KEYS.WAREHOUSES, []);
    if (!data || data.length === 0) {
      safeSet(KEYS.WAREHOUSES, INITIAL_WAREHOUSES);
      return INITIAL_WAREHOUSES;
    }
    return data;
  },

  // Customs Documents & Custom Built Documents
  getCustomsDocs(): CustomsDoc[] {
    const data = safeGet<CustomsDoc[]>(KEYS.CUSTOMS, []);
    if (!data || data.length === 0) {
      safeSet(KEYS.CUSTOMS, INITIAL_CUSTOMS_DOCS);
      return INITIAL_CUSTOMS_DOCS;
    }
    return data;
  },

  createCustomsDoc(doc: Omit<CustomsDoc, 'id'>): CustomsDoc {
    const docs = this.getCustomsDocs();
    const newDoc: CustomsDoc = {
      ...doc,
      id: `doc-${Date.now()}`
    };
    const updated = [newDoc, ...docs];
    safeSet(KEYS.CUSTOMS, updated);
    return newDoc;
  },

  // Ads
  getAds(): AdBanner[] {
    const data = safeGet<AdBanner[]>(KEYS.ADS, []);
    if (!data || data.length === 0) {
      safeSet(KEYS.ADS, INITIAL_ADS);
      return INITIAL_ADS;
    }
    return data;
  },

  saveAd(ad: AdBanner): AdBanner[] {
    const ads = this.getAds();
    const updated = ads.map(a => a.id === ad.id ? ad : a);
    safeSet(KEYS.ADS, updated);
    return updated;
  },

  // Offline Actions Queue
  getOfflineActions(): OfflineAction[] {
    return safeGet<OfflineAction[]>(KEYS.OFFLINE_QUEUE, []);
  },

  queueOfflineAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'synced'>): OfflineAction {
    const actions = this.getOfflineActions();
    const item: OfflineAction = {
      ...action,
      id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      synced: false
    };
    safeSet(KEYS.OFFLINE_QUEUE, [...actions, item]);
    return item;
  },

  clearSyncedOfflineActions(): void {
    safeSet(KEYS.OFFLINE_QUEUE, []);
  },

  // Reset to default sample catalog
  resetDefaults(): void {
    safeSet(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    safeSet(KEYS.SHIPMENTS, INITIAL_SHIPMENTS);
    safeSet(KEYS.WAREHOUSES, INITIAL_WAREHOUSES);
    safeSet(KEYS.CUSTOMS, INITIAL_CUSTOMS_DOCS);
    safeSet(KEYS.ADS, INITIAL_ADS);
    safeSet(KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
    safeSet(KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    safeSet(KEYS.OFFLINE_QUEUE, []);
  }
};
