
export interface FinancialItem {
  id: string;
  description: string;
  value: string;
  currency: 'EUR' | 'BRL';
  isPaid: boolean;
}

export interface Address {
  label: string;
  location: string;
  details?: string;
}
