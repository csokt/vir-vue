<template>
  <div>
    <BaseMenu msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import BaseMenu from '@/components/BaseMenu.vue'

export default {
  name: 'home',
  components: {
    BaseMenu
  }
}
</script>
