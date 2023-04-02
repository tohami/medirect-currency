import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import createSocketIoPlugin from '~/connection/socket';
import { currencies } from './module/currencies';
import { RootState } from './types';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  plugins: [createSocketIoPlugin()],
  state: {
    lang: 'En',
  },
  modules: {
    currencies,
  },
});
