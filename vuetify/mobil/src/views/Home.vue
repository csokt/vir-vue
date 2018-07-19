<template>
  <div>
    <Appstart v-if="isAuthenticated && isPinAuthenticated" msg="Appstart component"/>
  </div>
</template>

<script>
import Store from '@/store'
import Appstart from '@/components/Appstart.vue'

export default {
  name: 'home',
  data () {
    return {
      store: Store
    }
  },

  components: {
    Appstart
  },

  computed: {
    isAuthenticated () {
      return this.store.user !== null && this.store.user !== undefined
      // return true
    },
    isPinAuthenticated () {
      return !localStorage.szefo_pin || localStorage.szefo_pin === this.store.pin
      // return true
    }
  },

  created () {
    console.log('Home created')
  }

}
</script>
