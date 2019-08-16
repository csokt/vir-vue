<template>
  <BaseGrid
    :grid="grid"
    :rowData="rowData"
    :dataReady="dataReady"
    :errorMessage="errorMessage"
    @select="onSelect"
  />
</template>

<script>
import Store from '@/store'
import Config from '@/config'
import { API } from '@/util'
import BaseGrid from '@/components/BaseGrid.vue'

export default {
  name: 'grid',
  components: {
    BaseGrid
  },

  data () {
    return {
      store: Store,
      sqlWhere: '1=1',
      grid: {},
      rowData: null,
      dataReady: false,
      errorMessage: ''
    }
  },

  watch: {
    'store.loggedIn': function () {
      if (this.store.loggedIn) this.requestData()
    }
  },

  methods: {
    async requestData () {
      if (this.grid.mssql) {
        const sql = this.grid.mssql.replace('{where}', this.sqlWhere)
        const response = await API.post('tir/call', { sql: sql })
        if (response.ok) {
          response.data.forEach(Object.freeze)
          this.rowData = Object.freeze(response.data)
        } else {
          this.rowData = []
          this.errorMessage = response.data.error.message
        }
        this.dataReady = true
      } else {
        this.rowData = []
      }
    },

    onSelect (content) {
      // console.log('item', item)
      if (!this.grid.onClick || !this.grid.onClick[content.column]) return
      const item = this.grid.onClick[content.column]
      const url = window.location.origin + '/grid/' + item.path
      let win = window.open(url + '?where=' + item.where, '_blank')
      if (win) {
        win.focus()
      } else {
        alert('Engedélyezze a felugró ablakokat ezen az oldalon!')
      }
    }
  },

  created () {
    this.grid = Config[this.$route.params.id] || { title: 'Nincs ilyen táblázat!' }
    if (this.$route.query.where) this.sqlWhere = this.$route.query.where
    if (this.store.loggedIn) this.requestData()
  },

  mounted () {
  }
}
</script>
