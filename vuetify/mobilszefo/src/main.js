// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueFire from 'vuefire'
// import firebase from 'firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Store from './store'

Vue.use(VueFire)
Vue.use(Vuetify)

Vue.config.productionTip = false

const config = {
  apiKey: 'AIzaSyCavLxcswj_3XZeC9Ta-nHltiVEDWXpT3M',
  authDomain: 'szefo-users.firebaseapp.com',
  databaseURL: 'https://szefo-users.firebaseio.com',
  projectId: 'szefo-users',
  storageBucket: 'szefo-users.appspot.com',
  messagingSenderId: '621506010716'
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data () {
    return {
      store: Store,
      config: config
    }
  },
  router,
  components: { App },
  template: '<App/>',

  created () {
    firebase.initializeApp(config)
    firebase.auth().onAuthStateChanged((user) => {
      console.log('onAuthStateChanged')
      this.store.fireUser = user
    })
  }

})
