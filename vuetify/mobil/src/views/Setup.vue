<template>
  <div>
    <LoopbackLogin  v-if="!isAuthenticated" msg="Login component"/>
    <LoopbackLogout v-if="isAuthenticated"  msg="Logout component"/>
    <VirLogin  v-if="isAuthenticated && !isVirAuthenticated" msg="VIR login component"/>
    <VirLogout v-if="isAuthenticated && isVirAuthenticated"  msg="VIR logout component"/>
  </div>
</template>

<script>
import Store from '@/store'
import LoopbackLogin from '@/components/LoopbackLogin.vue'
import LoopbackLogout from '@/components/LoopbackLogout.vue'
import VirLogin from '@/components/VirLogin.vue'
import VirLogout from '@/components/VirLogout.vue'

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
    VirLogout
  },

  computed: {
    isAuthenticated () {
      return this.store.user !== null && this.store.user !== undefined
    },
    isVirAuthenticated () {
      return this.store.virUser !== null && this.store.virUser !== undefined
    }
  },

  methods: {
  },

  created () {
    console.log('Setup created')
  }

}
</script>
