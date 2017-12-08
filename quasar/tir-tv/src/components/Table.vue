<template>
  <div>
    <table class="q-table cell-separator table-striped">
      <thead>
        <tr>
          <th v-for="field in view.fields">{{field.label}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in result.stat" class="stat">
          <td v-for="field in row">{{field}}</td>
        </tr>
        <tr v-for="row in result.rows">
          <td v-for="field in row">{{field}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Config from '../config'

export default {
  name: 'table',
  components: {
  },
  data () {
    return {
      result: {}
    }
  },
  computed: {
    cid () {
      return Math.random().toString(16).substr(2)
    },
    view () {
      return Config.views.find(o => o.id === this.$route.params.id)
    }
  },
  methods: {
    requestData () {
      const request = {
        jsonrpc: '2.0',
        method: 'view',
        params: {
          view: this.view,
          filter: {}
        },
        id: this.cid
      }
      this.$mqtt.publish('mssql/request/tir/tv', JSON.stringify(request))
    },
    clearData () {
      this.result = {}
    }
  },
  mqtt: {
    'mssql/response/tir/tv' (message, topic) {
      const response = JSON.parse(message.toString())
      if (response.id === this.cid) {
        this.result = response.result || {}
      }
    }
  },
  mounted () {
    this.$mqtt.subscribe('mssql/response/tir/tv')
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
