<template>
  <BaseMenu
    :title="title"
    :columnDefs="columnDefs"
    :rowData="rowData"
    @select="onSelect"
  />
</template>

<script>
// @ is an alias to /src
import Config from '@/config.js'
import BaseMenu from '@/components/BaseMenu.vue'

export default {
  name: 'kkrmenu',
  components: {
    BaseMenu
  },

  computed: {
    title () {
      return Config.kkrmenu.title
    },

    columnDefs () {
      return Config.kkrmenu.columnDefs
    },

    menuItems () {
      let items = {}
      for (const menurow of Config.kkrmenu.menu) {
        for (const item of menurow) {
          items[item.field + item.value] = item
        }
      }
      return items
    },

    rowData () {
      let data = []
      for (const menurow of Config.kkrmenu.menu) {
        let row = {}
        for (const item of menurow) {
          row[item.field] = item.value
        }
        data.push(row)
      }
      return data
    }
  },

  created () {
    // console.log('protomenu', Config.kkrmenu.protomenu)
    // console.log('menu', Config.kkrmenu.menu)
  },

  methods: {
    onSelect (content) {
      // this.$router.push('/grid/' + this.menuItems[content].path)
      const url = window.location.origin + '/grid/' + this.menuItems[content].path
      let win = window.open(url, '_blank')
      if (win) {
        win.focus()
      } else {
        alert('Engedélyezze a felugró ablakokat ezen az oldalon!')
      }
    }
  }
}
</script>
