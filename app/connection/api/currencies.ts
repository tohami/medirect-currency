import api, {
  defaultParams,
  ENDPOINT_CONVERT,
  ENDPOINT_CURRENCIES_LIST,
  ENDPOINT_TIME_SERIES,
} from './api';
import { CurrenciesData } from '~/types/currencies-data';
import { CurrencyExchangeData } from '~/types/currency-exchange-data';

export default {
  async getLiveCurrenciesList(): Promise<CurrenciesData> {
    try {
      const response = await api.get(ENDPOINT_CURRENCIES_LIST, {
        params: defaultParams,
      });
      return response.data.available_currencies;
    } catch (error: any) {
      if (error.response) {
        throw error.response;
      } else {
        throw 'Error fetching data from the server.';
      }
    }
  },

  async getCurrentPrice(from: string, to: string): Promise<number> {
    try {
      const response = await api.get(ENDPOINT_CONVERT, {
        params: {
          ...defaultParams,
          from: from,
          to: to,
          amount: 1,
        },
      });
      return response.data.quote;
    } catch (error: any) {
      if (error.response) {
        throw error.response;
      } else {
        throw 'Error fetching data from the server.';
      }
    }
  },

  async getExchangeRateTimeSeries({
    currency,
    start_date,
    end_date,
    interval,
    period,
  }: {
    currency: string;
    start_date: string;
    end_date: string;
    interval: string;
    period: number;
  }): Promise<CurrencyExchangeData> {
    try {
      const response = await api.get(ENDPOINT_TIME_SERIES, {
        params: {
          ...defaultParams,
          currency,
          start_date,
          end_date,
          period,
          interval,
        },
      });
      return response.data;
    } catch (error: any) {
      console.log(error.response);
      if (error.response) {
        throw error.response;
      } else {
        throw 'Error fetching data from the server.';
      }
    }
  },
};
