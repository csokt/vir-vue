<template>
  <div>
    <h1>{{ msg }}</h1>
    <ol>
      <li v-for="view in viewlist" v-bind:key="view.id"  @click="$emit('select', 'table', view.id)">
        {{ view.label }}
      </li>
    </ol>
  </div>
</template>

<script>
import API from '@/rest.js'

export default {
  name: 'viewlist',
  props: {
    msg: String
  },

  data () {
    return {
      viewlist: []
    }
  },

  methods: {
    async getViewList () {
      try {
        const response = await API.get('tir/config/views/tv')
        this.viewlist = response.data
      } catch (err) {
        this.viewlist = []
        console.log(err)
      }
    }
  },

  created () {
    this.getViewList()
  }

}
</script>
