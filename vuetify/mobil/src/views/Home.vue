<template>
  <v-container pa-0>
    <v-layout  justify-center wrap>
      <Appstart v-if="isAuthenticated && isPinAuthenticated"/>
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
