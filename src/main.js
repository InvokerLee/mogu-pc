import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/assets/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';

import baseWrapper from '@/components/base-wrapper';
import adaptive from '@/utils/directive/adaptive';
import checkPermission from '@/utils/plugins/checkPermission';

import '@/permission';

Vue.use(ElementUI);
Vue.use(checkPermission);

Vue.directive('adaptive-height', adaptive);

Vue.component('base-wrapper', baseWrapper);

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
