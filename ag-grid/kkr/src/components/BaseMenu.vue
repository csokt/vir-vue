<template>
<div>
  <button @click="buttonClicked">Button</button>
  <ag-grid-vue
    style="width: 500px; height: 500px;"
    class="ag-theme-balham"
    :columnDefs="columnDefs"
    :rowData="rowData"
    @grid-ready="onGridReady"
    @cell-clicked="buttonClicked"
  >
  </ag-grid-vue>
</div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'

export default {
  name: 'App',
  data () {
    return {
      columnDefs: null,
      rowData: null
    }
  },

  components: {
    AgGridVue
  },

  methods: {
    onGridReady (params) {
      console.log('params', params)
      this.gridApi = params.api
      this.columnApi = params.columnApi
    },

    buttonClicked () {
      // console.log('gridApi', this.gridApi)
      const params = this.gridApi.getFocusedCell()
      console.log('params', params)
    }
  },

  beforeMount () {
    this.columnDefs = [
      { headerName: 'Logisztika', field: 'logisztika' },
      { headerName: 'Kötöde', field: 'kotode' },
      { headerName: 'Varroda', field: 'varroda' }
    ]

    this.rowData = [
      {
        logisztika: 'napi leadás',
        kotode: 'napi leadás',
        varroda: 'napi leadás'
      },
      {
        logisztika: 'RAM'
      }
    ]
  }
}
</script>
