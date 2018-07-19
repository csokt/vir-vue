<template>
  <div>
    <LoopbackLogin  v-if="!isAuthenticated" msg="Login component"/>
    <LoopbackLogout v-if="isAuthenticated && isPinAuthenticated"  msg="Logout component"/>
    <VirLogin  v-if="isAuthenticated && isPinAuthenticated && !isVirAuthenticated" msg="VIR login component"/>
    <VirLogout v-if="isAuthenticated && isPinAuthenticated && isVirAuthenticated"  msg="VIR logout component"/>
    <PinSetup  v-if="isAuthenticated && isPinAuthenticated" msg="PIN setup component"/>
    <PinLogin  v-if="isAuthenticated && !isPinAuthenticated" msg="PIN login component"/>
  </div>
</template>

<script>
import Store from '@/store'
import LoopbackLogin from '@/components/LoopbackLogin.vue'
import LoopbackLogout from '@/components/LoopbackLogout.vue'
import VirLogin from '@/components/VirLogin.vue'
import VirLogout from '@/components/VirLogout.vue'
import PinSetup from '@/components/PinSetup.vue'
import PinLogin from '@/components/PinLogin.vue'

export default {
  name: 'setup',
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

  computed: {
    isAuthenticated () {
      return this.store.user !== null && this.store.user !== undefined
    },
    isVirAuthenticated () {
      return this.store.virUser !== null && this.store.virUser !== undefined
    },
    isPinAuthenticated () {
      return !localStorage.szefo_pin || localStorage.szefo_pin === this.store.pin
    }
  },

  methods: {
  },

  created () {
    console.log('Setup created')
  }

}
</script>
