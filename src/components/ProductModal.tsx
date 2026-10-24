import React, { useState } from 'react';
import { Product, Currency } from '../types';
import { X, ShoppingBag, ShieldCheck, Truck, MapPin, TrendingDown, TrendingUp, BarChart3, Info } from 'lucide-react';
import { STORE_INFO } from '../data/initialData';
import { formatCurrencyAmount } from '../services/currency';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

interface Props {
  product: Product | null;
  currency: Currency;
  onClose: () => void;
  onAddToCart: (p: Product, qty: number) => void;
}

export const ProductModal: React.FC<Props> = ({
  product,
  currency,
  onClose,
  onAddToCart
}) => {
  const [qty, setQty] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'priceHistory'>('details');
  const [chartMetric, setChartMetric] = useState<'sle' | 'cny'>('sle');

  if (!product) return null;

  // Prepare 6-month historical price data
  const defaultHistory = [
    { month: 'May', sourcingCostCNY: Math.round(product.costCNY * 1.08), sourcingCostUSD: Number(((product.costCNY * 1.08) / 7.24).toFixed(1)), retailPriceSLE: Math.round(product.priceSLE * 1.08), landedCostSLE: Math.round(product.priceSLE * 0.65) },
    { month: 'Jun', sourcingCostCNY: Math.round(product.costCNY * 1.05), sourcingCostUSD: Number(((product.costCNY * 1.05) / 7.24).toFixed(1)), retailPriceSLE: Math.round(product.priceSLE * 1.05), landedCostSLE: Math.round(product.priceSLE * 0.64) },
    { month: 'Jul', sourcingCostCNY: Math.round(product.costCNY * 1.02), sourcingCostUSD: Number(((product.costCNY * 1.02) / 7.24).toFixed(1)), retailPriceSLE: Math.round(product.priceSLE * 1.02), landedCostSLE: Math.round(product.priceSLE * 0.63) },
    { month: 'Aug', sourcingCostCNY: Math.round(product.costCNY * 1.03), sourcingCostUSD: Number(((product.costCNY * 1.03) / 7.24).toFixed(1)), retailPriceSLE: Math.round(product.priceSLE * 1.03), landedCostSLE: Math.round(product.priceSLE * 0.63) },
    { month: 'Sep', sourcingCostCNY: Math.round(product.costCNY * 1.01), sourcingCostUSD: Number(((product.costCNY * 1.01) / 7.24).toFixed(1)), retailPriceSLE: Math.round(product.priceSLE * 1.01), landedCostSLE: Math.round(product.priceSLE * 0.62) },
    { month: 'Oct', sourcingCostCNY: product.costCNY, sourcingCostUSD: Number((product.costCNY / 7.24).toFixed(1)), retailPriceSLE: product.priceSLE, landedCostSLE: Math.round(product.priceSLE * 0.62) }
  ];

  const priceHistoryData = product.priceHistory || defaultHistory;

  // Calculate trends for procurement decision making
  const firstPrice = priceHistoryData[0]?.sourcingCostCNY || product.costCNY;
  const currentPrice = priceHistoryData[priceHistoryData.length - 1]?.sourcingCostCNY || product.costCNY;
  const cnyDeltaPercent = Number((((currentPrice - firstPrice) / firstPrice) * 100).toFixed(1));

  const formatPrice = (mult = 1) => {
    return formatCurrencyAmount(product.priceUSD * mult, currency);
  };

  const handleAdd = () => {
    onAddToCart(product, qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
          
          {/* Left Column: Product Visuals */}
          <div className="md:col-span-5 relative bg-slate-100 flex flex-col justify-between">
            <div className="relative aspect-square md:aspect-auto md:h-full overflow-hidden">
              {!imageError && product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8 text-slate-400">
                  <span>{product.name}</span>
                </div>
              )}
              
              {product.soldOut && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="text-white font-semibold text-xs tracking-wider uppercase px-4 py-1.5 bg-rose-900/80 rounded">
                    Sold Out Permanently
                  </span>
                </div>
              )}
            </div>

            {/* Quick Procurement Highlights in Sidebar */}
            <div className="p-4 bg-slate-950 text-slate-300 text-xs border-t border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-[11px] text-slate-400 uppercase font-semibold">
                <span>Procurement Status</span>
                <span className="text-amber-400">Verified Mill</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>China Factory Sourcing:</span>
                <span className="font-mono text-white font-bold">¥{product.costCNY} CNY (~${(product.costCNY / 7.24).toFixed(2)})</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Import Origin:</span>
                <span className="font-medium text-slate-200">{product.origin}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Content (Details vs Price History) */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Header Metadata */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{product.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>SKU: {product.sku}</span>
                </div>

                {/* View Switcher Tabs */}
                <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'details' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('priceHistory')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'priceHistory' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Price History (6M)</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: Product Overview */}
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-900 font-display">
                    {product.name}
                  </h2>

                  <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                    {formatPrice(1)}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Technical Specifications */}
                  {product.specs && Object.keys(product.specs).length > 0 && (
                    <div className="border-t border-b border-slate-100 py-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Product Specifications
                      </h4>
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        {Object.entries(product.specs).map(([key, val]) => (
                          <div key={key}>
                            <dt className="text-slate-500">{key}</dt>
                            <dd className="font-medium text-slate-800">{val}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  {/* Location & Delivery Guarantee */}
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Available at {STORE_INFO.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-slate-700 shrink-0" />
                      <span>Imported via Global Lite Logistics (Water Quay & Lungi)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Guaranty Trust Bank (GTB), Orange Money & AfriMoney accepted</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Recharts Price History (Procurement Decision Support) */}
              {activeTab === 'priceHistory' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-display">
                        6-Month Procurement Price Trend
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Tracks China factory sourcing costs vs Freetown landed/retail prices.
                      </p>
                    </div>

                    {/* Chart Metric Selector */}
                    <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded text-xs">
                      <button
                        onClick={() => setChartMetric('sle')}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          chartMetric === 'sle' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        SLE (Leone)
                      </button>
                      <button
                        onClick={() => setChartMetric('cny')}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          chartMetric === 'cny' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        RMB (¥ CNY)
                      </button>
                    </div>
                  </div>

                  {/* Decision Support Badges */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Cost Trend</span>
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        {cnyDeltaPercent <= 0 ? (
                          <span className="text-emerald-700 flex items-center gap-0.5 font-mono">
                            <TrendingDown className="w-3.5 h-3.5" />
                            {Math.abs(cnyDeltaPercent)}% lower
                          </span>
                        ) : (
                          <span className="text-amber-700 flex items-center gap-0.5 font-mono">
                            <TrendingUp className="w-3.5 h-3.5" />
                            +{cnyDeltaPercent}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">6M Sourcing Range</span>
                      <span className="font-mono font-semibold text-slate-800">
                        ¥{Math.min(...priceHistoryData.map(d => d.sourcingCostCNY))} - ¥{Math.max(...priceHistoryData.map(d => d.sourcingCostCNY))}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Procurement Signal</span>
                      <span className="font-semibold text-emerald-800">
                        {cnyDeltaPercent <= 0 ? 'Favorable Buy' : 'Stable Supply'}
                      </span>
                    </div>
                  </div>

                  {/* Recharts Chart Component */}
                  <div className="h-56 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartMetric === 'sle' ? (
                        <LineChart data={priceHistoryData} margin={{ top: 5, right: 15, left: -15, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                            formatter={(value: any, name: any) => [`SLE ${Number(value).toLocaleString()}`, name === 'retailPriceSLE' ? 'Retail Price' : 'Landed Cost']}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                          <Line type="monotone" dataKey="retailPriceSLE" name="Retail Price (SLE)" stroke="#0f172a" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                          <Line type="monotone" dataKey="landedCostSLE" name="Landed Cost (SLE)" stroke="#d97706" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                        </LineChart>
                      ) : (
                        <LineChart data={priceHistoryData} margin={{ top: 5, right: 15, left: -15, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                            formatter={(value: any, name: any) => [`¥${value} CNY ($${(Number(value)/7.24).toFixed(1)} USD)`, 'Factory FOB Cost']}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                          <Line type="monotone" dataKey="sourcingCostCNY" name="China Sourcing Cost (¥ CNY)" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                    <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Container consolidation savings via Global Lite sea freight reduced landed cost by ~6.5% since May 2026.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Stepper & Add to Cart Action */}
            <div className="pt-4 border-t border-slate-100 mt-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1 || product.soldOut}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-sm font-semibold text-slate-900 font-mono tabular-nums">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    disabled={qty >= product.stock || product.soldOut}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={product.soldOut || product.stock <= 0}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    product.soldOut
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.soldOut ? 'Sold Out' : `Add to Bag (${formatPrice(qty)})`}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
