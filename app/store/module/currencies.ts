import Vue from 'vue';
import Vuex, { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import currencyServices from '@/api/currencies';
import moment from 'moment';
import {
  actionTypes,
  mutationTypes,
  PlotOption,
  plotOptions,
  RootState,
} from '~/store/types';
import { Quote } from '~/api/models/currency-exchange-data';

interface CurrenciesState {
  currencyFrom: string;
  currencyTo: string;
  allCurrencies: [string, string][];
  currencyLoading: boolean;
  ratesLoading: boolean;
  selectedPlot: PlotOption;
  timeseries: Quote[];
  currentPrice: string;
  difference: number;
}

const state: CurrenciesState = {
  currencyFrom: 'EUR',
  currencyTo: 'USD',
  // startDate: getDateBeforeDays(7),
  allCurrencies: [],
  currencyLoading: false,
  selectedPlot: plotOptions[3],
  timeseries: [],
  ratesLoading: false,
  currentPrice: '0',
  difference: 0,
};

export const getters: GetterTree<CurrenciesState, RootState> = {};

const mutations: MutationTree<CurrenciesState> = {
  [mutationTypes.setPlotOption](state: CurrenciesState, newValue: PlotOption) {
    state.selectedPlot = newValue;
  },

  [mutationTypes.setTimeSeries](state: CurrenciesState, newValue: Quote[]) {
    state.timeseries = newValue || [];
    if (newValue && newValue.length) {
      const firstValue = newValue[0];
      const lastValue = newValue[newValue.length - 1];
      state.currentPrice = lastValue.close.toFixed(3);
      state.difference =
        ((lastValue.close - firstValue.close) * 100) / lastValue.close;
    }
  },

  [mutationTypes.setAllCurrencies](state, newValue: [string, string][]) {
    state.allCurrencies = newValue;
  },

  [mutationTypes.setLoading](state, newValue: boolean) {
    if (newValue) state.currencyLoading = newValue;
    else setTimeout(() => (state.currencyLoading = newValue), 500); //minimum waiting time
  },
};

const actions: ActionTree<CurrenciesState, RootState> = {
  [actionTypes.setCurrencyFrom]({ commit, dispatch }, newValue: string) {
    if (newValue === state.currencyFrom) return;

    if (newValue === state.currencyTo) {
      state.currencyTo = state.currencyFrom;
    }
    state.currencyFrom = newValue;
    dispatch(actionTypes.getCurrencyExtchangeRates);
  },

  [actionTypes.setCurrencyTo]({ commit, dispatch }, newValue: string) {
    if (newValue === state.currencyTo) return;

    if (newValue === state.currencyFrom) {
      state.currencyFrom = state.currencyTo;
    }
    state.currencyTo = newValue;
    dispatch(actionTypes.getCurrencyExtchangeRates);
  },

  async [actionTypes.getAllCurrencies]({ commit }) {
    try {
      commit(mutationTypes.setLoading, true);
      const currencies = await currencyServices.getLiveCurrenciesList();
      const currenciesNormalized = Object.entries(currencies);
      commit(mutationTypes.setAllCurrencies, currenciesNormalized);
      commit(mutationTypes.setLoading, false);
    } catch (e) {
      console.log(e);
    }
  },

  async [actionTypes.getCurrencyExtchangeRates]({ commit }) {
    const {
      selectedPlot: { timeDiff, interval, period },
      currencyFrom,
      currencyTo,
    } = state;

    const endDate = moment();
    const startDate = moment().subtract(timeDiff, 'minutes');
    try {
      console.log(state);
      const rates = await currencyServices.getExchangeRateTimeSeries({
        currency: `${currencyFrom}${currencyTo}`,
        start_date: startDate.utc().format('YYYY-MM-DD-HH:mm'),
        end_date: endDate.utc().format('YYYY-MM-DD-HH:mm'),
        interval,
        period,
      });
      commit(mutationTypes.setTimeSeries, rates.quotes);
    } catch (e) {
      console.log(e);
    }
  },
};

const namespaced: boolean = true;

export const currencies: Module<CurrenciesState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
