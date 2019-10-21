<template>
  <div style="height: 100%">
    <span>{{ grid.title }} {{ statusMessage }}</span>
    <template v-if="!statusMessage">
      Szűrő:
      <select v-model="whereIndex" @change="$emit('change-where', whereIndex)">
        <option v-for="(item, index) in grid.where" :value="index" :key="index">
          {{ item.label }}
        </option>
      </select>
      Megjelenés:
      <select v-model="stateName">
        <option v-for="(value, name) in gridStates" :value="name" :key="name">
          {{ name }}
        </option>
      </select>
      <button v-on:click="restoreState()">Visszaállít</button>
      <input v-model="stateName">
      <button v-on:click="saveState()">{{saveButton}}</button>
      <button v-on:click="resetState()">Alapállapot</button>
      <button v-on:click="deleteState()">Töröl</button>
      <span>Export:</span>
      <textarea rows="1" cols="25" v-model="jsonParams" @focus="$event.target.select()"/>
      <button v-on:click="importState()">Import</button>
      <button v-on:click="onBtExport()">Export Excelbe</button>
    </template>

    <ag-grid-vue
      style="height: 100%"
      class="ag-theme-balham"
      :localeText="localeText"
      :defaultColDef="grid.defaultColDef"
      :columnDefs="grid.columnDefs"
      :pivotMode="grid.pivotMode"
      :sideBar="grid.sideBar"
      :rowSelection="grid.rowSelection"
      :domLayout="grid.domLayout"
      :rowStyle="grid.rowStyle"
      :gestRowStyle="grid.gestRowStyle"
      :rowClass="grid.rowClass"
      :rowClassRules="grid.rowClassRules"
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
    statusMessage: String
  },

  computed: {
    localeText () {
      return Config.localeText
    }
  },

  data () {
    return {
      whereIndex: 0,
      stateName: '',
      gridStates: {},
      saveButton: 'Ment',
      jsonParams: '',
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

    readGridState () {
      let state = {}
      state.colState = this.columnApi.getColumnState()
      state.groupState = this.columnApi.getColumnGroupState()
      state.sortState = this.gridApi.getSortModel()
      state.filterState = this.gridApi.getFilterModel()
      return state
    },

    writeGridState (state) {
      this.columnApi.setColumnState(state.colState)
      this.columnApi.setColumnGroupState(state.groupState)
      this.gridApi.setSortModel(state.sortState)
      this.gridApi.setFilterModel(state.filterState)
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

    exportState () {
      // if (!this.stateName) return
      const params = { name: this.stateName, id: this.gridId, state: this.gridStates[this.stateName] }
      this.jsonParams = JSON.stringify(params)
    },

    importState () {
      if (!this.jsonParams) {
        alert('Nincs mit importálni!')
        return
      }
      try {
        const params = JSON.parse(this.jsonParams)
        if (params.id !== this.gridId) {
          alert('Eltérő lekérdezések, nem lehet importálni!')
          return
        }
        if (!params.name || !params.state) {
          alert('Hibás adatszerkezet, nem lehet importálni!')
          return
        }
        this.stateName = params.name
        this.writeGridState(params.state)
      } catch (e) {
        alert('A tartalom hibás, nem importálható!')
      }
    },

    deleteState () {
      if (!this.stateName) return
      delete this.gridStates[this.stateName]
      this.saveGridStates()
      this.stateName = ''
      this.jsonParams = ''
    },

    saveState () {
      if (!this.stateName) return
      const state = this.readGridState()
      this.gridStates[this.stateName] = state
      this.saveGridStates()
      this.exportState()
      this.saveButton = 'Elmentve!'
      setTimeout(() => { this.saveButton = 'Ment' }, 2000)
    },

    restoreState () {
      const state = this.gridStates[this.stateName]
      if (!state || !state.colState) {
        alert('Nincs ilyen mentés, nem lehet visszaállítani!')
        return
      }
      this.exportState()
      this.writeGridState(state)
    },

    async resetState () {
      this.stateName = ''
      this.jsonParams = ''
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
  margin-right: 20px;
}

textarea {
  margin-left: 5px;
  margin-bottom: 4px;
  vertical-align: bottom;
}
</style>
