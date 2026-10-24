export type Currency = 'SLE' | 'USD' | 'CNY' | 'EUR' | 'GBP' | 'NGN' | 'XOF';

export type Language = 'en' | 'kri' | 'zh' | 'fr';

export interface ExchangeRates {
  SLE_PER_USD: number; // 22.8
  CNY_PER_USD: number; // 7.24
  SLE_PER_CNY: number; // 3.15
  EUR_PER_USD: number; // 0.92
  GBP_PER_USD: number; // 0.77
  NGN_PER_USD: number; // 1580
  XOF_PER_USD: number; // 605
}

export type ProductCategory = 
  | 'men-dress'
  | 'women-dress'
  | 'gummies-tea'
  | 'fabrics'
  | 'household';

export interface PriceHistoryPoint {
  month: string;
  sourcingCostCNY: number;
  sourcingCostUSD: number;
  retailPriceSLE: number;
  landedCostSLE: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  priceSLE: number;
  priceUSD: number;
  priceCNY: number;
  costCNY: number;
  stock: number;
  soldOut: boolean;
  imageUrl: string;
  description: string;
  origin: string;
  sku: string;
  specs?: Record<string, string>;
  priceHistory?: PriceHistoryPoint[];
  supplierId?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export type PaymentMethod = 
  | 'orange-money'
  | 'afrimoney'
  | 'bank-transfer'
  | 'cash-on-delivery'
  | 'cross-border-wire';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  priceSLE: number;
  sku?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalSLE: number;
  totalUSD: number;
  paymentMethod: PaymentMethod;
  paymentPhone?: string;
  paymentReference?: string;
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  fulfillmentStatus: 'processing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered';
  consigneeName: string;
  managerName: string;
  storeLocation: string;
  invoiceIssued?: boolean;
  invoiceNumber?: string;
  createdAt: string;
}

export type FreightType = 'SEA_FCL' | 'SEA_LCL' | 'AIR_CARGO';

export type ShipmentStatus = 
  | 'origin_received'
  | 'customs_export_cleared'
  | 'in_transit'
  | 'arrived_freetown_port'
  | 'nra_customs_clearance'
  | 'delivered_to_store';

export interface ShipmentMilestone {
  stage: ShipmentStatus;
  label: string;
  location: string;
  timestamp: string;
  completed: boolean;
  notes?: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  billOfLading: string;
  containerNumber?: string;
  freightType: FreightType;
  originPort: string;
  destinationPort: string;
  vesselName?: string;
  departureDate: string;
  estimatedArrival: string;
  status: ShipmentStatus;
  cbm: number;
  grossWeightKg: number;
  packagesCount: number;
  goodsDescription: string;
  consignee: {
    name: string;
    company: string;
    address: string;
    phone: string;
  };
  manager: {
    name: string;
    company: string;
    phone: string;
  };
  shipper: {
    name: string;
    city: string;
    country: string;
  };
  milestones: ShipmentMilestone[];
  customsStatus: {
    asycudaNumber: string;
    nraReceiptNumber?: string;
    dutyAssessedSLE: number;
    gstAmountSLE: number;
    clearedDate?: string;
  };
}

export interface WarehouseLocation {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
  address: string;
  manager: string;
  contact: string;
  currentCbmUsed: number;
  capacityCbm: number;
  activeShipmentsCount: number;
}

export interface CustomsDoc {
  id: string;
  docType: 'Bill of Lading' | 'Commercial Invoice' | 'Packing List' | 'NRA ASYCUDA SAD' | 'Phytosanitary Cert';
  referenceNumber: string;
  shipmentId: string;
  consigneeName: string;
  consigneeAddress: string;
  managerName: string;
  dateIssued: string;
  totalValueUSD: number;
  totalValueSLE: number;
  itemCount: number;
  status: 'Draft' | 'Certified' | 'Submitted' | 'Cleared';
  details?: any;
}

export interface SupplierProfile {
  id: string;
  name: string;
  chineseName?: string;
  city: string;
  province: string;
  address: string;
  verifiedRating: number;
  verifiedTier: 'Gold Supplier' | 'Verified Manufacturer' | 'Audited Factory';
  primaryCategories: ProductCategory[];
  contactPerson: string;
  phone: string;
  wechatId: string;
  email: string;
  moq: string;
  leadTimeDays: number;
  qualityCertifications: string[];
  notes: string;
  activeOrdersCount: number;
  createdAt: string;
}

export interface CustomerTestimonial {
  id: string;
  customerName: string;
  location: string;
  role: string;
  rating: number;
  quote: string;
  purchasedProduct: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface AdBanner {
  id: string;
  title: string;
  message: string;
  linkText: string;
  targetView: string;
  active: boolean;
  startDate: string;
  endDate: string;
}

export interface OfflineAction {
  id: string;
  type: 'STOCK_UPDATE' | 'NEW_ORDER' | 'SHIPMENT_UPDATE';
  payload: any;
  timestamp: string;
  synced: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  provider: 'google';
  phone?: string;
  address?: string;
  isLoggedIn: boolean;
  memberSince: string;
  ordersCount: number;
}

export interface QueueTicket {
  ticketNumber: string;
  customerName: string;
  serviceType: 'order_pickup' | 'fabric_cutting' | 'tea_tasting' | 'freight_consultation';
  serviceLabel: string;
  status: 'waiting' | 'serving' | 'completed';
  timeIssued: string;
  estimatedWaitMinutes: number;
}
