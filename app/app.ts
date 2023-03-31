import Vue from 'nativescript-vue';
import Home from './components/Home.vue';
import store from './store';

declare let __DEV__: boolean;

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = !__DEV__;

Vue.registerElement(
  'LineChart',
  () => require('@nativescript-community/ui-chart/charts').LineChart
);

new Vue({
  store: store,
  render: (h) => h('frame', [h(Home)]),
}).$start();
