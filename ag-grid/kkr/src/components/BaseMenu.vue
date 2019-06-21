<template>
<div>
  {{ title }}
  <ag-grid-vue
    class="ag-theme-balham"
    :columnDefs="columnDefs"
    :rowData="rowData"
    domLayout="autoHeight"
    @grid-ready="onGridReady"
    @cell-clicked="cellClicked"
  >
  </ag-grid-vue>
</div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'

export default {
  name: 'App',
  components: {
    AgGridVue
  },

  props: {
    title: {
      type: String,
      required: true
    },
    columnDefs: {
      type: Array,
      required: true
    },
    rowData: {
      type: Array,
      required: true
    }
  },

  methods: {
    onGridReady (params) {
      params.api.sizeColumnsToFit()
      // params.columnApi.autoSizeColumns(params.columnApi.getAllColumns())
    },

    cellClicked (params) {
      if (params.value) {
        this.$emit('select', params.column.colId + params.value)
      }
    }
  }
}
</script>
