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
import BaseMenu from '@/components/BaseMenu.vue'

export default {
  name: 'kkrmenu',
  components: {
    BaseMenu
  },

  computed: {
    columnDefs () {
      return [
        { headerName: 'Logisztika', field: 'logisztika' },
        { headerName: 'Kötöde', field: 'kotode' },
        { headerName: 'Varroda', field: 'varroda' }
      ]
    },

    menu () {
      return [
        [
          { field: 'logisztika', value: 'Napi leadás', path: 'logisztika_leadas' },
          { field: 'kotode', value: 'Napi leadás', path: 'kotode_leadas' },
          { field: 'varroda', value: 'Napi leadás', path: 'varroda_leadas' }
        ],
        [
          { field: 'logisztika', value: 'RAM', path: 'logisztika_ram' },
          { field: 'varroda', value: 'RAM', path: 'varroda_ram' }
        ]
      ]
    },

    menuItems () {
      let items = {}
      for (const menurow of this.menu) {
        for (const item of menurow) {
          items[item.field + item.value] = item
        }
      }
      return items
    },

    rowData () {
      let data = []
      for (const menurow of this.menu) {
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
      console.log('content', content)
      console.log('menuItem', this.menuItems[content])
    }
  }
}
</script>
