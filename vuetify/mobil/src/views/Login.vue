<template>
  <div>
    <LoopbackLogin  v-if="!isAuthenticated" msg="Login component"/>
    <LoopbackLogout v-if="isAuthenticated"  msg="Logout component"/>
  </div>
</template>

<script>
import Store from '@/store'
import LoopbackLogin from '@/components/LoopbackLogin.vue'
import LoopbackLogout from '@/components/LoopbackLogout.vue'

export default {
  name: 'login',
  data () {
    return {
      store: Store
    }
  },

  components: {
    LoopbackLogin,
    LoopbackLogout
  },

  computed: {
    isAuthenticated () {
      return this.store.user !== null && this.store.user !== undefined
    }
  },

  methods: {
  },

  created () {
    console.log('Login created')
  }

}
</script>
