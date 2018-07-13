<template>
  <div>
    <Appstart msg="Appstart component"/>
  </div>
</template>

<script>
import Appstart from '@/components/Appstart.vue'

export default {
  name: 'home',
  components: {
    Appstart
  },

  created () {
    console.log('Home created')
  }

}
</script>
