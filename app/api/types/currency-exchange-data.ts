export interface CurrencyExchangeData {
  base_currency: string;
  end_date: string;
  endpoint: string;
  quote_currency: string;
  quotes: Quote[];
  request_time: string;
  start_date: string;
}

export interface Quote {
  close: number;
  date: string;
  high: number;
  low: number;
  open: number;
}
