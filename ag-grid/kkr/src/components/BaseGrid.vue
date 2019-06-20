<template>
  <div style="height: 100%">
    {{ grid.title }}
    <ag-grid-vue
      style="height: 100%"
      class="ag-theme-balham"
      :columnDefs="grid.columnDefs"
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
    grid: {
      type: Object,
      required: true
    },
    rowData: {
      type: Array,
      required: false
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
