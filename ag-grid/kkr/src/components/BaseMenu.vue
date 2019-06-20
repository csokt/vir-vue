<template>
<div>
  {{ title }}
  <ag-grid-vue
    class="ag-theme-balham"
    :columnDefs="columnDefs"
    :rowData="rowData"
    domLayout="autoHeight"
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
    cellClicked (params) {
      if (params.value) {
        this.$emit('select', params.column.colId + params.value)
      }
    }
  }
}
</script>
