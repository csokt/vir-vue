<template>
  <div style="height: 100%">
    <button v-on:click="autoSizeColumns()">Átméretez</button> {{ grid.title }}
    <ag-grid-vue
      style="height: 100%"
      class="ag-theme-balham"
      :defaultColDef="grid.defaultColDef"
      :columnDefs="grid.columnDefs"
      :pivotMode="grid.pivotMode"
      :sideBar="grid.sideBar"
      :rowData="rowData"
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
    grid: {
      type: Object,
      required: true
    },
    rowData: Array,
    dataReady: Boolean
  },

  watch: {
    dataReady: async function () {
      await this.$nextTick()
      if (this.dataReady) {
        this.columnApi.autoSizeColumns(this.columnApi.getAllColumns())
      }
    }
  },

  data () {
    return {
      api: null,
      columnApi: null
    }
  },

  methods: {
    onGridReady (params) {
      this.api = params.api
      this.columnApi = params.columnApi
    },

    autoSizeColumns () {
      console.log('autoSizeColumns', this.columnApi.getAllColumns())
      this.columnApi.autoSizeColumns(this.columnApi.getAllColumns())
    },

    cellClicked (params) {
      if (params.value) {
        this.$emit('select', params.column.colId + params.value)
      }
    }
  }
}
</script>
