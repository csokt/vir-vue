<template>
  <div class="home">
    <LoopbackLogin msg="LoopbackLogin"/>
  </div>
</template>

<script>
// @ is an alias to /src
import LoopbackLogin from '@/components/LoopbackLogin.vue'

export default {
  name: 'home',
  components: {
    LoopbackLogin
  },

  created () {
    console.log('Home created')
  }

}
</script>
