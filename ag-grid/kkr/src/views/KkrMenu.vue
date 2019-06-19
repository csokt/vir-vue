<template>
  <div>
    Kötöttáru kontrolling rendszer
    <BaseMenu
      :columnDefs="columnDefs"
      :rowData="rowData"
      @select="onSelect"
    />
  </div>
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

  methods: {
    onSelect (content) {
      // console.log('Config', Config)
      console.log('menuItem', this.menuItems[content])
    }
  }
}
</script>
