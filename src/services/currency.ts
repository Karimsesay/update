import { Currency } from '../types';
import { INITIAL_RATES } from '../data/initialData';

export function convertFromUSD(amountUSD: number, targetCurrency: Currency): number {
  switch (targetCurrency) {
    case 'USD':
      return amountUSD;
    case 'SLE':
      return amountUSD * INITIAL_RATES.SLE_PER_USD;
    case 'CNY':
      return amountUSD * INITIAL_RATES.CNY_PER_USD;
    case 'EUR':
      return amountUSD * INITIAL_RATES.EUR_PER_USD;
    case 'GBP':
      return amountUSD * INITIAL_RATES.GBP_PER_USD;
    case 'NGN':
      return amountUSD * INITIAL_RATES.NGN_PER_USD;
    case 'XOF':
      return amountUSD * INITIAL_RATES.XOF_PER_USD;
    default:
      return amountUSD;
  }
}

export function formatCurrencyAmount(amountUSD: number, currency: Currency): string {
  const converted = convertFromUSD(amountUSD, currency);

  switch (currency) {
    case 'SLE':
      return `SLE ${Math.round(converted).toLocaleString('en-US')}`;
    case 'USD':
      return `$${converted.toFixed(2)}`;
    case 'CNY':
      return `¥${Math.round(converted).toLocaleString('en-US')}`;
    case 'EUR':
      return `€${converted.toFixed(2)}`;
    case 'GBP':
      return `£${converted.toFixed(2)}`;
    case 'NGN':
      return `₦${Math.round(converted).toLocaleString('en-US')}`;
    case 'XOF':
      return `CFA ${Math.round(converted).toLocaleString('en-US')}`;
    default:
      return `$${converted.toFixed(2)}`;
  }
}

export const CURRENCY_LABELS: Record<Currency, { label: string; symbol: string; country: string }> = {
  SLE: { label: 'Sierra Leonean Leone', symbol: 'SLE', country: 'Sierra Leone' },
  USD: { label: 'US Dollar', symbol: '$', country: 'Global / China Trade' },
  CNY: { label: 'Chinese Yuan Renminbi', symbol: '¥', country: 'China Sourcing' },
  EUR: { label: 'Euro', symbol: '€', country: 'European Union' },
  GBP: { label: 'British Pound', symbol: '£', country: 'United Kingdom' },
  NGN: { label: 'Nigerian Naira', symbol: '₦', country: 'Nigeria / ECOWAS' },
  XOF: { label: 'West African CFA Franc', symbol: 'CFA', country: 'Guinea / Liberia / WAEMU' },
};
