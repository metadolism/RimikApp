import Vue from 'vue';
import VueCryptojs from 'vue-cryptojs';
import VueSmoothScroll from 'vue2-smooth-scroll';
import VueJWT from 'vuejs-jwt';
import { VueJwtAuth, AxiosHttpDriver } from '@mspiderv/vuejwtauth';
// import api from './services/api';
import Employe from '@/mixins/auth';
import axios from './plugins/axios';
import defStyle from './assets/def.scss';
import dashboardStyle from './assets/dashboard.scss';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
const auth = new VueJwtAuth({
  Vue,
  router,
  store,
  options: {
    drivers: {
      http: new AxiosHttpDriver({
        // Your API URL here
        apiBaseURL: `${store.state.baseUrl}/v${store.state.apiVersion}/Accounts`,
      }),
    },
  },
});
Vue.use(VueJWT, auth);

Vue.prototype.$authObeject = new Employe();

const vm = new Vue({
  router,
  store,
  axios,
  defStyle,
  dashboardStyle,
  render: (h) => h(App),
});
vm.$mount('#app');
Vue.use(VueCryptojs, vm, VueSmoothScroll, {
  duration: 400,
  updateHistory: false,
});
