import React, { useState } from 'react';
import { QueueTicket, Language, Order } from '../types';
import { STORE_INFO } from '../data/initialData';
import { TRANSLATIONS } from '../services/i18n';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  Ticket, 
  MapPin, 
  Coffee, 
  Wifi, 
  Tv, 
  Sparkles, 
  Package, 
  Search,
  Bell,
  RefreshCw,
  Scissors,
  Ship
} from 'lucide-react';

interface Props {
  language: Language;
  orders: Order[];
}

export const WaitingRoomView: React.FC<Props> = ({ language, orders }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [activeTickets, setActiveTickets] = useState<QueueTicket[]>([
    {
      ticketNumber: 'W-101',
      customerName: 'Fatmata Bangura',
      serviceType: 'order_pickup',
      serviceLabel: 'Order Pickup & Bag Inspection',
      status: 'serving',
      timeIssued: '10:15 AM',
      estimatedWaitMinutes: 0
    },
    {
      ticketNumber: 'W-102',
      customerName: 'Mohamed Kamara',
      serviceType: 'fabric_cutting',
      serviceLabel: 'Guinea Brocade Cutting (5 Yards)',
      status: 'waiting',
      timeIssued: '10:22 AM',
      estimatedWaitMinutes: 4
    },
    {
      ticketNumber: 'W-103',
      customerName: 'Zainab Turay',
      serviceType: 'tea_tasting',
      serviceLabel: 'Moringa & Detox Tea Tasting',
      status: 'waiting',
      timeIssued: '10:30 AM',
      estimatedWaitMinutes: 8
    }
  ]);

  const [newCustomerName, setNewCustomerName] = useState('');
  const [selectedService, setSelectedService] = useState<QueueTicket['serviceType']>('order_pickup');
  const [myTicket, setMyTicket] = useState<QueueTicket | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderSearchResult, setOrderSearchResult] = useState<Order | null>(null);
  const [hasSearchedOrder, setHasSearchedOrder] = useState(false);

  const serviceLabels: Record<QueueTicket['serviceType'], string> = {
    order_pickup: 'Order Pickup & Goods Inspection',
    fabric_cutting: 'Fabric Bolt Measurement & Cutting',
    tea_tasting: 'Herbal Wellness Tea Tasting & Consultation',
    freight_consultation: 'China-SL Container Cargo Consultation'
  };

  const handleTakeTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) return;

    const nextNumber = `W-${100 + activeTickets.length + 1}`;
    const waitTime = activeTickets.filter(t => t.status === 'waiting').length * 4 + 3;

    const ticket: QueueTicket = {
      ticketNumber: nextNumber,
      customerName: newCustomerName.trim(),
      serviceType: selectedService,
      serviceLabel: serviceLabels[selectedService],
      status: 'waiting',
      timeIssued: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedWaitMinutes: waitTime
    };

    setActiveTickets(prev => [...prev, ticket]);
    setMyTicket(ticket);
    setNewCustomerName('');
  };

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearchedOrder(true);
    if (!orderSearchQuery.trim()) {
      setOrderSearchResult(null);
      return;
    }
    const cleanQuery = orderSearchQuery.trim().toLowerCase();
    const found = orders.find(
      o => o.orderNumber.toLowerCase().includes(cleanQuery) || 
           o.customerName.toLowerCase().includes(cleanQuery) ||
           (o.customerPhone && o.customerPhone.includes(cleanQuery))
    );
    setOrderSearchResult(found || null);
  };

  const currentServingTicket = activeTickets.find(t => t.status === 'serving') || activeTickets[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Top Title & Location Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Live In-Store Queue
              </span>
              <span className="text-xs text-slate-500 font-mono">15 Macdonald Street · Central Freetown</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              Customer Waiting Room & Service Lounge
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
              Relax in our air-conditioned lounge while your orders are packed, fabrics measured, or container freight documents processed. Real-time digital queue updates right on your screen.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end justify-center border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-8 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-700" />
              <span>{STORE_INFO.address}</span>
            </div>
            <div>Hours: <span className="font-medium text-slate-900">{STORE_INFO.workingHours}</span></div>
            <div>Desk Phone: <span className="font-mono text-slate-900">{STORE_INFO.primaryContact}</span></div>
            <div className="text-[11px] text-slate-500">
              Host: <strong className="text-slate-700">{STORE_INFO.managerName}</strong> · Consignee: <strong className="text-slate-700">{STORE_INFO.consigneeName}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Serving Screen + Queue Ticket Dispenser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Digital "Now Serving" Board (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                  Store Digital Display Board
                </span>
              </div>
              <span className="text-xs font-mono text-amber-400">
                15 Macdonald St Counter
              </span>
            </div>

            {/* Now Serving Highlight */}
            <div className="text-center py-6">
              <div className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-medium">
                {t.nowServing}
              </div>
              <div className="text-6xl sm:text-7xl font-mono font-black text-amber-400 tracking-tight">
                {currentServingTicket ? currentServingTicket.ticketNumber : 'W-101'}
              </div>
              <div className="mt-3 text-lg font-semibold text-white">
                {currentServingTicket ? currentServingTicket.customerName : 'Current Customer'}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {currentServingTicket ? currentServingTicket.serviceLabel : 'Order Collection'}
              </div>
            </div>

            {/* Counters Breakdown */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px]">Counter 1 (Retail & Pickup)</div>
                <div className="font-bold text-white mt-1 text-sm">{STORE_INFO.managerName}</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">● Active Serving</div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px]">Counter 2 (Customs & Cargo)</div>
                <div className="font-bold text-white mt-1 text-sm">{STORE_INFO.consigneeName}</div>
                <div className="text-[10px] text-amber-400 mt-0.5">● Inspection & B/L</div>
              </div>
            </div>
          </div>

          {/* Up Next in Queue */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-600" />
                <span>Next in Line ({activeTickets.filter(t => t.status === 'waiting').length} Waiting)</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">Avg wait ~4 min</span>
            </div>

            <div className="divide-y divide-slate-100">
              {activeTickets.map((ticket) => (
                <div key={ticket.ticketNumber} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-8 rounded-lg bg-slate-100 font-mono font-bold text-slate-900 flex items-center justify-center shrink-0">
                      {ticket.ticketNumber}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900">{ticket.customerName}</div>
                      <div className="text-slate-500 text-[11px]">{ticket.serviceLabel}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      ticket.status === 'serving' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-50 text-amber-800'
                    }`}>
                      {ticket.status === 'serving' ? 'At Counter' : `~${ticket.estimatedWaitMinutes}m wait`}
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{ticket.timeIssued}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Take Ticket + Order Readiness Checker (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Take Queue Ticket Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {t.takeTicket}
                </h3>
                <p className="text-xs text-slate-500">
                  Select your service at 15 Macdonald Street to join the line.
                </p>
              </div>
            </div>

            {myTicket ? (
              <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider">Your Active Ticket</span>
                  <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-800">
                    Issued {myTicket.timeIssued}
                  </span>
                </div>

                <div className="text-center py-2">
                  <div className="text-4xl font-mono font-black text-slate-950">
                    {myTicket.ticketNumber}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-1">
                    {myTicket.customerName}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {myTicket.serviceLabel}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-amber-900 pt-2 border-t border-amber-200/80">
                  <span>Estimated wait:</span>
                  <span className="font-bold font-mono">~{myTicket.estimatedWaitMinutes} minutes</span>
                </div>

                <button
                  type="button"
                  onClick={() => setMyTicket(null)}
                  className="w-full text-center text-xs text-slate-600 hover:text-slate-900 underline pt-1 cursor-pointer"
                >
                  Get another ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleTakeTicket} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mariama Sesay"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Service Needed at 15 Macdonald St *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(Object.keys(serviceLabels) as Array<QueueTicket['serviceType']>).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedService(type)}
                        className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer ${
                          selectedService === type
                            ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-medium">{serviceLabels[type]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Join Waiting Queue
                </button>
              </form>
            )}
          </div>

          {/* In-Store Order Readiness Tracker */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-slate-800" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Check Order Pickup Readiness
                </h3>
                <p className="text-xs text-slate-500">
                  Check if your package is boxed and ready on the counter.
                </p>
              </div>
            </div>

            <form onSubmit={handleSearchOrder} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Order # (e.g. ME-202610...) or customer name"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-900 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </form>

            {hasSearchedOrder && (
              <div className="mt-3">
                {orderSearchResult ? (
                  <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-emerald-900">{orderSearchResult.orderNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white uppercase">
                        {orderSearchResult.fulfillmentStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-slate-800 font-medium">Customer: {orderSearchResult.customerName}</div>
                    <div className="text-slate-600">Location: {orderSearchResult.deliveryAddress}</div>
                    <div className="text-emerald-800 font-semibold pt-1 border-t border-emerald-200">
                      ✓ Package verified and ready at 15 Macdonald Street retail counter.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500 text-center">
                    No matching order found. Please verify order number or speak with Williette at Counter 1.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Store Amenities at 15 Macdonald Street */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Lounge Amenities at 15 Macdonald Street
            </h4>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200">
                <Coffee className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Complimentary Tea Bar</div>
                  <div className="text-[11px] text-slate-500">Moringa, ginger & hibiscus iced tea while you wait.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200">
                <Wifi className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Fast Guest Wi-Fi</div>
                  <div className="text-[11px] text-slate-500">SSID: Mauwiltus_Guest (Free for customers).</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200">
                <Tv className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Port Cargo Arrival TV</div>
                  <div className="text-[11px] text-slate-500">Live vessel status at Water Quay harbor.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200">
                <Scissors className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Fabric Sample Cutting</div>
                  <div className="text-[11px] text-slate-500">Brocade & lace swatch examination desk.</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
