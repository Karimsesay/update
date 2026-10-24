import React from 'react';
import { STORE_INFO } from '../data/initialData';
import { MapPin, Phone, Mail, ShieldCheck, Ship, ArrowUpRight } from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Sourcing Vision */}
          <div className="space-y-3">
            <h3 className="text-white font-display font-bold text-base tracking-tight">
              Mauwiltus Enterprise
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Premier Freetown retail and wholesale destination for authentic Guinea brocade fabrics, women’s and men’s apparel, herbal detox teas, dietary gummies, and household essentials.
            </p>
            <div className="pt-2 text-slate-300">
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block">Store Manager</span>
              <span className="font-medium text-white">{STORE_INFO.managerName}</span>
            </div>
          </div>

          {/* Logistics Division */}
          <div className="space-y-3">
            <h3 className="text-white font-display font-bold text-base tracking-tight">
              Global Lite Logistics
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Comprehensive China-to-Sierra Leone freight forwarding, sea container consolidation (FCL/LCL), express air cargo, and ASYCUDA World customs clearance at Queen Elizabeth II Quay.
            </p>
            <div className="pt-2 text-slate-300">
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block">Licensed Consignee</span>
              <span className="font-medium text-white">{STORE_INFO.consigneeName}</span>
            </div>
          </div>

          {/* Quick Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Trade Portals
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('store')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Store Catalog & Retail
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tracking')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Live Cargo & Container Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('customs')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  NRA Customs & ASYCUDA Documentation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('calculator')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Landed Cost & Tariff Valuation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Admin Management Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Sierra Leone Contacts */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Freetown Operations
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-slate-300">{STORE_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono text-slate-200">{STORE_INFO.primaryContact}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono text-slate-200">{STORE_INFO.secondaryContact}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{STORE_INFO.email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sierra Leone Local Trust Strip */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            Payment Channels: Orange Money SL (*144#) · AfriMoney direct to +232 33 434592 (No Agent Code) · Guaranty Trust Bank (GTB) · Cash on Delivery.
          </div>
          <div>
            © {new Date().getFullYear()} Mauwiltus Enterprise & Global Lite Logistics. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
