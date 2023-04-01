import Vue from 'nativescript-vue';
import Home from './components/Home.vue';
import store from './store';
import { install } from "@nativescript-community/gesturehandler";
import RadChartPlugin from 'nativescript-ui-chart/vue';

declare let __DEV__: boolean;

install();

Vue.config.silent = !__DEV__;

Vue.use(RadChartPlugin);


new Vue({
  store: store,
  render: (h) => h('frame', [h(Home)]),
}).$start();
