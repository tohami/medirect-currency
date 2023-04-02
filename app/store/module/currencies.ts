import Vue from 'vue';
import Vuex, { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import currencyServices from '~/api/currencies';
import moment from 'moment';
import {
  actionTypes,
  mutationTypes,
  PlotOption,
  plotOptions,
  RootState,
} from '~/store/types';
import {
  CurrencyExchangeData,
  Quote,
} from '~/api/types/currency-exchange-data';

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
  selectedPlot: plotOptions[0],
  timeseries: [],
  ratesLoading: false,
  currentPrice: '0',
  difference: 0,
};

export const getters: GetterTree<CurrenciesState, RootState> = {};

const mutations: MutationTree<CurrenciesState> = {
  [mutationTypes.setTimeSeries](
    state: CurrenciesState,
    newValue: CurrencyExchangeData
  ) {
    const { end_date, quotes, start_date } = newValue;
    state.timeseries = quotes.map((e) => {
      return {
        ...e,
        label: moment(e.date).format(state.selectedPlot.timeFormat),
      };
    });
    if (quotes && quotes.length) {
      const firstValue = quotes[0];
      const lastValue = quotes[quotes.length - 1];
      state.difference =
        ((lastValue.close - firstValue.close) * 100) / lastValue.close;
    } else {
      state.difference = 0.0;
    }

    console.log(newValue);
  },

  [mutationTypes.setCurrentPrice](state, newValue: string) {
    state.currentPrice = newValue;
  },

  [mutationTypes.setAllCurrencies](state, newValue: [string, string][]) {
    state.allCurrencies = newValue;
  },

  [actionTypes.setPlotOption](state, newValue: PlotOption) {
    state.selectedPlot = newValue;
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

  [actionTypes.setPlotOption]({ commit, dispatch }, newValue: PlotOption) {
    if (newValue === state.selectedPlot) return;

    commit(actionTypes.setPlotOption, newValue);
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

    currencyServices
      .getExchangeRateTimeSeries({
        currency: `${currencyFrom}${currencyTo}`,
        start_date: startDate.utc().format('YYYY-MM-DD-HH:mm'),
        end_date: endDate.utc().format('YYYY-MM-DD-HH:mm'),
        interval,
        period,
      })
      .then((rates) => {
        commit(mutationTypes.setTimeSeries, rates);
      })
      .catch((e) => {
        console.log(e);
        commit(mutationTypes.setTimeSeries, []);
      });

    currencyServices
      .getCurrentPrice(currencyFrom, currencyTo)
      .then((price) => {
        commit(mutationTypes.setCurrentPrice, price.toString());
      })
      .catch((e) => {
        console.log(e);
        commit(mutationTypes.setCurrentPrice, 'Unknown');
      });
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
