import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import { currencies } from './module/currencies';
import { RootState } from './types';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  state: {
    lang: 'En', // a simple property
  },
  modules: {
    currencies,
  },
});
