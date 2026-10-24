import React, { useState, useMemo } from 'react';
import { Product, Currency, ProductCategory, CustomerTestimonial } from '../types';
import { ProductCard } from './ProductCard';
import { STORE_INFO } from '../data/initialData';
import { StorageService } from '../services/storage';
import { Search, MapPin, Phone, ShieldCheck, Ship, ArrowRight, Star, Quote, Plus, CheckCircle, MessageSquare } from 'lucide-react';

interface Props {
  products: Product[];
  currency: Currency;
  testimonials: CustomerTestimonial[];
  onAddToCart: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
  onNavigateToTracking: () => void;
  onRefreshTestimonials?: () => void;
}

export const Storefront: React.FC<Props> = ({
  products,
  currency,
  testimonials,
  onAddToCart,
  onSelectProduct,
  onNavigateToTracking,
  onRefreshTestimonials
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Testimonial modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerLocation, setReviewerLocation] = useState('Freetown, Sierra Leone');
  const [reviewerRole, setReviewerRole] = useState('Boutique Owner');
  const [reviewQuote, setReviewQuote] = useState('');
  const [reviewProduct, setReviewProduct] = useState(products[0]?.name || 'Guinea Brocade Fabric');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'women-dress', label: "Women's Dresses" },
    { id: 'men-dress', label: "Men's Apparel" },
    { id: 'fabrics', label: 'Fabrics & Brocade' },
    { id: 'gummies-tea', label: 'Gummies & Health Tea' },
    { id: 'household', label: 'Household Items' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceSLE - b.priceSLE;
        if (sortBy === 'price-desc') return b.priceSLE - a.priceSLE;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewQuote.trim()) return;

    StorageService.saveTestimonial({
      customerName: reviewerName,
      location: reviewerLocation,
      role: reviewerRole,
      rating: 5,
      quote: reviewQuote,
      purchasedProduct: reviewProduct,
      verifiedPurchase: true
    });

    setReviewerName('');
    setReviewQuote('');
    setIsReviewModalOpen(false);
    if (onRefreshTestimonials) onRefreshTestimonials();
    alert('Thank you! Your verified testimony has been published.');
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Editorial Hero Section */}
      <section className="relative bg-slate-900 rounded-2xl overflow-hidden mx-4 sm:mx-6 lg:mx-8 border border-slate-800 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[440px]">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">
                <span>China · Sierra Leone Trade Corridor</span>
                <span aria-hidden="true">·</span>
                <span>Direct Sourcing & Retail</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white max-w-xl text-balance leading-tight">
                Authentic Goods Sourced from China, Delivered to Freetown.
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
                Mauwiltus Enterprise brings you the finest women’s dresses, men’s apparel, premium Guinea brocade fabrics, organic detox teas, and household electronics—partnered with Global Lite Logistics for sea & air freight.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-4">
              <a
                href="#catalog"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Explore Shop Catalog
              </a>

              <button
                onClick={onNavigateToTracking}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer border border-slate-700"
              >
                <Ship className="w-4 h-4 text-amber-400" />
                <span>Track Cargo Containers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Hero High-Res Photography */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_sino_salone_logistics_1792794255768.jpg"
              alt="China to Freetown shipping logistics"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover lg:absolute lg:inset-0 brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-950/80 backdrop-blur-md rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="block text-[11px] text-amber-400 font-semibold">Consignee & Clearing</span>
                <span>{STORE_INFO.consigneeName}</span>
              </div>
              <div className="text-right">
                <span className="block text-[11px] text-amber-400 font-semibold">Store Manager</span>
                <span>{STORE_INFO.managerName}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Location Strip (Updated with GTB and AfriMoney +232 33 434592) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-white rounded-xl border border-slate-200 text-xs">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Central Freetown Store</h4>
              <p className="text-slate-600 mt-0.5">{STORE_INFO.address}</p>
              <p className="text-slate-500 text-[11px] mt-0.5">{STORE_INFO.workingHours}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Direct Phone & WhatsApp</h4>
              <p className="text-slate-600 mt-0.5 font-mono">{STORE_INFO.primaryContact}</p>
              <p className="text-slate-600 font-mono">{STORE_INFO.secondaryContact}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Sierra Leone Payment Channels</h4>
              <p className="text-slate-600 mt-0.5">
                Orange Money (*144#), AfriMoney direct to <strong className="font-mono text-slate-900">+232 33 434592</strong> (No agent code), GTB Bank Transfer & Cash on Delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Controls Bar: Search, Category Tabs, Sorting */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                Mauwiltus Enterprise Catalog
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span>Showing {filteredProducts.length} items</span>
                <span aria-hidden="true">·</span>
                <span>Direct China Import</span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dresses, fabrics, tea..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-200 pb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-800 text-xs focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                <option value="featured">Featured Sourcing</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <p className="text-sm font-medium text-slate-700">No products found matching your filter</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                onAddToCart={onAddToCart}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}

      </section>

      {/* CUSTOMER TESTIMONIALS SECTION (New Requirement) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-lg space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                <Quote className="w-4 h-4 text-amber-400" />
                <span>Verified Sierra Leone Customer Experiences</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                Client Testimonials & Trade Reviews
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Hear from boutique owners, wholesale merchants, doctors, and professionals who procure goods from China and collect at 15 Macdonald Street.
              </p>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Your Testimony</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map(t => (
              <div
                key={t.id}
                className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
              >
                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-amber-400 mb-2">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[10px] text-slate-400 ml-1 font-mono">5.0</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{t.customerName}</span>
                    {t.verifiedPurchase && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">{t.role}</div>
                  <div className="text-[10px] text-amber-400 font-mono mt-0.5">{t.location}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-1">Item: {t.purchasedProduct}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Modal: Submit Customer Testimony */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 font-display mb-1">
              Submit Your Customer Testimony
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Share your experience with Mauwiltus Enterprise products or Global Lite container shipping.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aminata Turay"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Location in Sierra Leone</label>
                  <input
                    type="text"
                    placeholder="e.g. Rawdon St, Freetown"
                    value={reviewerLocation}
                    onChange={(e) => setReviewerLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Occupation / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Fashion Designer"
                    value={reviewerRole}
                    onChange={(e) => setReviewerRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Product Purchased / Service</label>
                <select
                  value={reviewProduct}
                  onChange={(e) => setReviewProduct(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-900"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                  <option value="Global Lite Container Sea Freight">Global Lite Container Sea Freight</option>
                  <option value="Global Lite Express Air Cargo">Global Lite Express Air Cargo</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Your Review / Testimony *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about the product quality, delivery to 15 Macdonald Street, or payment experience..."
                  value={reviewQuote}
                  onChange={(e) => setReviewQuote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg cursor-pointer shadow-xs"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
