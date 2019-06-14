<template>
<div>
  <ag-grid-vue
    style="width: 600px; height: 200px;"
    class="ag-theme-balham"
    :columnDefs="columnDefs"
    :rowData="rowData"
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
    cellClicked (params) {
      if (params.value) {
        this.$emit('select', params.column.colId + params.value)
      }
    }
  }
}
</script>
