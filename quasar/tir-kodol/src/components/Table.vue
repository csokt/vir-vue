<template>
  <div>
    <div>
      <span>{{store.user.name}}:</span>
      <span>{{view.label}}</span>
      <q-btn @click="isFilter = !isFilter" push color="primary">Szűrő</q-btn>
      <q-btn @click="$router.go(-1)" push color="warning">Vissza</q-btn>
    </div>

    <div v-if="isFilter" class="panel-body">
      <vue-form-generator :schema="schema()" :model="model()" :options="formOptions"></vue-form-generator>
      <q-btn @click="requestData(); isFilter = false" push color="positive">Ment</q-btn>
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
        <tr v-for="row in result.records">
          <td v-for="field in view.fields">{{row[field.name]}}</td>
        </tr>
      </tbody>
    </table>
      <span>{{result.records && result.records.length}} tétel</span>
  </div>
</template>

<script>
import Vue from 'vue'
import VueFormGenerator from 'vue-form-generator/dist/vfg-core.js'
Vue.use(VueFormGenerator)
// import "vue-form-generator/dist/vfg-core.css"
import Config from '../config'
import Store from '../store'
import { RpcView } from '../rpc'
import {
  QBtn
} from 'quasar'

export default {
  name: 'tablazat',
  components: {
    QBtn
  },
  data () {
    return {
      result: {},
      store: Store,
      isFilter: false,
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
    model () {
      return this.store.filter
    },

    schema () {
      return this.view.schema
    },

    async requestData () {
      const response = await RpcView(this.view, this.store.filter)
      this.result = response.result || {}
    },

    clearData () {
      this.result = {}
    }
  },
  beforeCreate () {
    const view = Config.views.find(o => o.id === this.$route.params.id)
    let model = {}
    for (let field of view.fields) {
      if (!field.filter) { continue }
      if (field.default) {
        model[field.name] = Store.user[field.default]
      }
      else {
        model[field.name] = null
      }
    }
    Store.filter = model
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
</style>
