<template>
  <div>
    <Remote msg="Remote" v-on:select="call"/>
    <ViewList msg="ViewList" v-on:select="call"/>
    <PlayList msg="PlayList" v-on:select="call"/>
  </div>
</template>

<script>
import API from '@/rest.js'
import Remote from '@/components/Remote.vue'
import ViewList from '@/components/ViewList.vue'
import PlayList from '@/components/PlayList.vue'

export default {
  name: 'tv',
  components: {
    Remote,
    ViewList,
    PlayList
  },

  methods: {
    async call (method, arg = null) {
      let url = 'tv/' + method + '/' + this.$route.params.id
      if (arg) url = url + '/' + arg
      const response = await API.post(url)
      console.log(response.data)
    }
  }
}
</script>
