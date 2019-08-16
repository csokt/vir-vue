<template>
  <div style="height: 100%">
    <!-- <button v-on:click="autoSizeColumns()">Átméretez</button> {{ grid.title }} -->
    {{ grid.title }} {{ errorMessage }}
    <button v-on:click="onBtExport()">Export Excelbe</button>
    <ag-grid-vue
      style="height: 100%"
      class="ag-theme-balham"
      :localeText="localeText"
      :defaultColDef="grid.defaultColDef"
      :columnDefs="grid.columnDefs"
      :pivotMode="grid.pivotMode"
      :sideBar="grid.sideBar"
      :rowSelection="grid.rowSelection"
      :rowData="rowData"
      @grid-ready="onGridReady"
      @cell-clicked="cellClicked"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import Config from '@/config.js'
import { AgGridVue } from 'ag-grid-vue'

export default {
  components: {
    AgGridVue
  },

  props: {
    grid: {
      type: Object,
      required: true
    },
    rowData: Array,
    dataReady: Boolean,
    errorMessage: String
  },

  watch: {
    dataReady: async function () {
      await this.$nextTick()
      if (this.dataReady) {
        this.columnApi.autoSizeColumns(this.columnApi.getAllColumns())
      }
    }
  },

  computed: {
    localeText () {
      return Config.localeText
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

    onBtExport () {
      this.api.exportDataAsExcel()
    },

    autoSizeColumns () {
      console.log('autoSizeColumns', this.columnApi.getAllColumns())
      this.columnApi.autoSizeColumns(this.columnApi.getAllColumns())
    },

    cellClicked (params) {
      console.log('cellClicked', params)
      if (params.value) {
        this.$emit('select', params.column.colId + params.value)
      }
    }
  }
}
</script>
