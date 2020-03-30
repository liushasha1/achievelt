// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/css/global.css'
import axios from 'axios'

axios.defaults.baseURL = 'http://47.100.30.181:8100'
axios.defaults.withCredentials = true //让ajax携带cookie
Vue.prototype.$axios = axios
Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
