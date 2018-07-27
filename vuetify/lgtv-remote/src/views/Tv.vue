<template>
  <v-container fluid fill-height grid-list-lg>
    <v-layout  justify-center wrap>
      <Remote v-on:select="call"/>
      <ViewList v-on:select="call"/>
      <PlayList v-on:select="call"/>
    </v-layout>
  </v-container>
</template>

<script>
import API from '@/rest.js'
import { EventBus } from '@/util.js'
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
    async call (method, arg = '') {
      let url = method + '/' + this.$route.params.id
      if (arg) url = url + '/' + arg
      EventBus.$emit('inform', {type: 'alert', variation: 'info', message: url})
      const response = await API.post('tv/' + url)
      console.log(response.data)
    }
  }
}
</script>
