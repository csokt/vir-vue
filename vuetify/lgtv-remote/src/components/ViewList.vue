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
      const response = await API.get('tir/config/views/tv')
      if (response.ok) {
        this.viewlist = response.data
      } else {
        this.viewlist = []
        console.log(response.problem)
      }
    }
  },

  created () {
    this.getViewList()
  }

}
</script>
