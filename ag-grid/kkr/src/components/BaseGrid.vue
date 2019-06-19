<template>
  <div>
    {{ grid.title }}
    <ag-grid-vue
      style="width: 800px; height: 200px;"
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
