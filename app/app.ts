import Vue from 'nativescript-vue';
import Home from './components/Home.vue';
import store from './store';

declare let __DEV__: boolean;

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = !__DEV__;

new Vue({
  store: store,
  render: (h) => h('frame', [h(Home)]),
}).$start();
