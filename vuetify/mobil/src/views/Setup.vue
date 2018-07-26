<template>
  <v-container fluid fill-height grid-list-lg>
    <v-layout  justify-center wrap>
      <LoopbackLogin  v-if="!isAuthenticated" msg="Login component"/>
      <LoopbackLogout v-if="isAuthenticated && isPinAuthenticated"  msg="Logout component"/>
      <VirLogin  v-if="isAuthenticated && isPinAuthenticated && !isVirAuthenticated" msg="VIR login component"/>
      <VirLogout v-if="isAuthenticated && isPinAuthenticated && isVirAuthenticated"  msg="VIR logout component"/>
      <PinSetup  v-if="isAuthenticated && isPinAuthenticated" msg="PIN setup component"/>
      <PinLogin  v-if="isAuthenticated && !isPinAuthenticated" msg="PIN login component"/>
    </v-layout>
  </v-container>
</template>

<script>
import Store from '@/store'
import LoopbackLogin from '@/components/LoopbackLogin.vue'
import LoopbackLogout from '@/components/LoopbackLogout.vue'
import VirLogin from '@/components/VirLogin.vue'
import VirLogout from '@/components/VirLogout.vue'
import PinSetup from '@/components/PinSetup.vue'
import PinLogin from '@/components/PinLogin.vue'
import { checkAuthentication } from '@/mixins.js'

export default {
  name: 'setup',
  mixins: [checkAuthentication],
  data () {
    return {
      store: Store
    }
  },

  components: {
    LoopbackLogin,
    LoopbackLogout,
    VirLogin,
    VirLogout,
    PinSetup,
    PinLogin
  },

  created () {
    this.store.pageTitle = 'Beállítások'
  }

}
</script>
