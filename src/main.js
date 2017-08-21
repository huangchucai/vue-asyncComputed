import Vue from 'vue'
import App from './App'
import asyncComputed from '../lib/asyncComputed.js'
// import AsyncComputed from 'vue-async-computed'

// Vue.use(AsyncComputed)
Vue.use(asyncComputed)
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
