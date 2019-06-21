import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import 'ag-grid-enterprise'
// import { LicenseManager } from 'ag-grid-enterprise'
// LicenseManager.setLicenseKey('BlackRock__MultiApp_25Devs27_June_2018__MTUzMDA1NDAwMDAwMA==d04fcd9b31abb75cb7e6148a9906ba79')

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
