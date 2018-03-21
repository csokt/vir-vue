<template>
  <div>
    <div>
      <span><strong>{{store.user && store.user.name}}: {{view.label}}</strong></span>
      <q-btn @click="isFilter = !isFilter" push color="primary">Szűrő</q-btn>
      <q-btn @click="$router.go(-1)" push color="warning">Vissza</q-btn>
    </div>

    <div v-if="isFilter" class="panel-body">
      <vue-form-generator :schema="view.schema" :model="filter" :options="formOptions"></vue-form-generator>
      <q-btn @click="result = {}; spinner = true; isFilter = false; requestData()" push color="positive">Ment</q-btn>
    </div>

    <table class="q-table cell-separator table-striped">
      <thead>
        <tr>
          <th v-for="field in view.fields">{{field.label}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in result.stat" class="stat">
          <td v-for="field in view.fields">{{row[field.name]}}</td>
        </tr>
        <template v-for="(row, index) in result.records">
          <tr>
            <td v-for="field in view.fields" @click="clickField(row, field)" v-bind:class="{ search: field.search }" v-bind:style="{ color: color(field, row[field.name]) }">{{row[field.name]}}</td>
          </tr>
          <tr v-if="(index + 1) % view.head_after === 0">
            <th v-for="field in view.fields">{{field.label}}</th>
          </tr>
        </template>
      </tbody>
    </table>
      <h5>
        <q-spinner v-if="spinner" :size="40"/>
        <span>{{result.records && result.records.length}} tétel</span>
      </h5>
  </div>
</template>

<script>
import Vue from 'vue'
import VueFormGenerator from 'vue-form-generator/dist/vfg-core.js'
Vue.use(VueFormGenerator)
// import "vue-form-generator/dist/vfg-core.css"
import Config from '../config'
import Store from '../store'
import { RpcView, Log } from '../rpc'
import {
  QBtn,
  QSpinner
} from 'quasar'

export default {
  name: 'tablazat',
  components: {
    QBtn,
    QSpinner
  },
  data () {
    return {
      result: {},
      store: Store,
      filter: {},
      isFilter: false,
      spinner: true,
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true
      }
    }
  },
  computed: {
    view () {
      return Config.views.find(o => o.id === this.$route.params.id)
    }
  },
  methods: {
    async requestData () {
      const response = await RpcView(this.view, this.filter)
      this.result = response.result || {}
      this.spinner = false
    },
    clickField (row, field) {
      if (field.search) {
        let data = {}
        data[field.name] = row[field.name]
        Log('clickfield', data)
        this.store.user.filterCikkszam = row[field.name]
        this.$router.push('/search')
      }
    },
    color (field, value) {
      if (value > 0) { return field.positive }
      if (value === 0) { return field.zero }
      if (value < 0) { return field.negative }
    }
  },

  created () {
    if (!this.store.user) { this.$router.replace('/'); return }
    Log('navigate')
    const view = Config.views.find(o => o.id === this.$route.params.id)
    let model = {}
    for (let field of view.fields) {
      if (!field.filter) { continue }
      if (field.default) {
        model[field.name] = this.store.user[field.default]
      }
      else {
        model[field.name] = null
      }
    }
    this.filter = model
  },
  mounted () {
    if (this.view.refresh) {
      this.myInterval = setInterval(() => {
        this.requestData()
      }, 1000 * this.view.refresh)
    }
    this.requestData()
  },
  beforeDestroy () {
    if (this.myInterval) {
      clearInterval(this.myInterval)
    }
  }
}
</script>

<style scoped>
.q-btn {
  margin-left: 0.3em;
  margin-right: 0.7em;
}

table {
  border-collapse: collapse;
  width: 100%;
  font-size: 20px;
  font-weight: bold;
}

th, td {
  text-align: center;
}

th {
  color: blue;
}

.table-striped > tbody > tr:nth-child(2n+1) > td, .table-striped > tbody > tr:nth-child(2n+1) > th {
  background-color: #d1ebff;
}

.stat {
  color: red;
}

.search {
  color: darkgreen;
}
</style>
