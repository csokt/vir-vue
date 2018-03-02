<template>
  <div>
    <div v-if="view">
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
      <q-spinner v-if="spinner" :size="40"/>
    </div>
    <div v-if="!view">
      <h5> {{$route.params.id}}: Nincs ilyen táblázat! </h5>
    </div>
  </div>
</template>

<script>
import Config from '../config'
import { RpcView } from '../rpc'
import {
  QSpinner
} from 'quasar'

export default {
  name: 'table',
  components: {
    QSpinner
  },
  data () {
    return {
      result: {},
      spinner: true
    }
  },
  computed: {
    view () {
      return Config.views.find(o => o.id === this.$route.params.id)
    }
  },
  methods: {
    async requestData () {
      const response = await RpcView(this.view, null)
      this.result = response.result || {}
      this.spinner = false
    }
  },
  created () {
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
