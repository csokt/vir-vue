<template>
  <div>
    <BaseMenu :columnDefs="columnDefs" :rowData="rowData"/>
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

    rowData () {
      return [
        {
          logisztika: 'Napi leadás',
          kotode: 'Napi leadás',
          varroda: 'Napi leadás'
        },
        {
          logisztika: 'RAM'
        }
      ]
    }
  }
}
</script>
