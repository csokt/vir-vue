<template>
  <div style="height: 100%">
    {{ grid.title }} {{ errorMessage }}
    <button v-on:click="onBtExport()">Export Excelbe</button>
    <select v-model="stateName">
      <option v-for="(value, name) in gridStates" v-bind:value="name" v-bind:key="name">
        {{ name }}
      </option>
    </select>
    <button v-on:click="restoreState()">Visszaállít</button>
    <input v-model="stateName">
    <button v-on:click="saveState()">{{saveButton}}</button>
    <button v-on:click="resetState()">Alapállapot</button>
    <button v-on:click="deleteState()">Töröl</button>

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
    <!-- <span>Elrendezés:</span> -->
</template>

<script>
import Config from '@/config.js'
import { AgGridVue } from 'ag-grid-vue'

export default {
  components: {
    AgGridVue
  },

  props: {
    gridId: {
      type: String,
      required: true
    },
    grid: {
      type: Object,
      required: true
    },
    rowData: Array,
    errorMessage: String
  },

  computed: {
    localeText () {
      return Config.localeText
    }
  },

  data () {
    return {
      stateName: '',
      gridStates: {},
      saveButton: 'Ment',
      gridApi: null,
      columnApi: null
    }
  },

  methods: {
    onGridReady (params) {
      this.$emit('grid-ready', params)
      this.gridApi = params.api
      this.columnApi = params.columnApi
    },

    onBtExport () {
      this.gridApi.exportDataAsExcel()
    },

    saveGridStates () {
      const jsonString = JSON.stringify(this.gridStates)
      localStorage.setItem(this.gridId, jsonString)
    },

    loadGridStates () {
      const jsonString = localStorage.getItem(this.gridId)
      if (jsonString) {
        try {
          this.gridStates = JSON.parse(jsonString)
        } catch (e) {
          localStorage.removeItem(this.gridId)
        }
      }
    },

    deleteState () {
      if (!this.stateName) return
      delete this.gridStates[this.stateName]
      this.saveGridStates()
      this.stateName = ''
    },

    saveState () {
      if (!this.stateName) return
      let state = {}
      state.colState = this.columnApi.getColumnState()
      state.groupState = this.columnApi.getColumnGroupState()
      state.sortState = this.gridApi.getSortModel()
      state.filterState = this.gridApi.getFilterModel()
      this.gridStates[this.stateName] = state
      this.saveGridStates()
      this.saveButton = 'Elmentve!'
      setTimeout(() => { this.saveButton = 'Ment' }, 2000)
    },

    restoreState () {
      const state = this.gridStates[this.stateName]
      if (!state || !state.colState) return
      this.columnApi.setColumnState(state.colState)
      this.columnApi.setColumnGroupState(state.groupState)
      this.gridApi.setSortModel(state.sortState)
      this.gridApi.setFilterModel(state.filterState)
    },

    async resetState () {
      this.stateName = ''
      this.columnApi.resetColumnState()
      this.columnApi.resetColumnGroupState()
      this.gridApi.setSortModel(null)
      this.gridApi.setFilterModel(null)
      await this.$nextTick()
      this.columnApi.autoSizeColumns(this.columnApi.getAllColumns())
    },

    cellClicked (params) {
      // console.log('cellClicked', params)
      this.$emit('select', { column: params.column.colId, data: params.data })
    }
  },

  created () {
    this.loadGridStates()
  }
}
</script>

<style scoped>
button, input, select, span {
  margin-bottom: 4px;
  margin-left: 20px;
}
</style>
