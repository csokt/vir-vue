<template>
  <v-container fluid fill-height grid-list-lg>
    <v-layout  justify-center wrap>
      <Appstart v-if="isAuthenticated && isPinAuthenticated" msg="Appstart component"/>
    </v-layout>
  </v-container>
</template>

<script>
import Store from '@/store'
import Appstart from '@/components/Appstart.vue'
import { checkAuthentication } from '@/mixins.js'

export default {
  name: 'home',
  mixins: [checkAuthentication],
  data () {
    return {
      store: Store
    }
  },

  components: {
    Appstart
  },

  created () {
    this.store.pageTitle = 'Mobil alkalmazások'
  }

}
</script>
