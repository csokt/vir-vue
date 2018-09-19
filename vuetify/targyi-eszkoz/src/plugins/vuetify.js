import Vue from 'vue'
import {
  Vuetify,
  VAlert,
  VApp,
  VBtn,
  VDialog,
  VFooter,
  VGrid,
  VIcon,
  VList,
  VNavigationDrawer,
  VToolbar,
  transitions
} from 'vuetify'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VAlert,
    VApp,
    VBtn,
    VDialog,
    VFooter,
    VGrid,
    VIcon,
    VList,
    VNavigationDrawer,
    VToolbar,
    transitions
  }
})
