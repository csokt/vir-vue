<template>
  <div>
    <div v-if="view">
      <title>{{view.label}}</title>
      <h6 class="text-center">{{view.label}}</h6>
      <table class="q-table cell-separator table-striped compact" v-bind:style="{ 'font-size': view.tablefontsize }">
        <thead v-bind:style="{ 'font-size': view.headfontsize }">
          <tr>
            <th v-for="field in view.fields">{{field.label}}</th>
          </tr>
        </thead>
        <tbody v-bind:style="{ 'font-size': view.bodyfontsize }">
          <tr v-for="row in result.stat" class="stat">
            <td v-for="field in view.fields" v-bind:style="{'font-size': field.fontsize }">{{row[field.name]}}</td>
          </tr>
          <tr v-for="row in result.records">
            <td v-for="field in view.fields" v-bind:style="{ color: color(field, row[field.name]), 'font-size': field.fontsize }">{{row[field.name]}}</td>
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
import API from '../rest.js'
import Store from '../store'
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
      store: Store,
      result: {},
      spinner: true
    }
  },
  computed: {
    view () {
      return this.store.views.find(o => o.id === this.$route.params.id)
    }
  },
  methods: {
    async requestData () {
      if (!this.view) { return }
      const response = await API.get('tv/tables/' + this.view.id)
      if (response.ok) {
        this.result = response.data
        if (this.view.refresh) {
          setTimeout(() => { this.requestData() }, 1000 * this.view.refresh)
        }
      }
      else {
        this.result = {}
        console.log(response.problem)
      }
      this.spinner = false
    },

    color (field, value) {
      if (value > 0) { return field.positive }
      if (value === 0) { return field.zero }
      if (value < 0) { return field.negative }
    }
  },

  created () {
    this.requestData()
  },

  watch: {
    'view': function () {
      this.requestData()
    }
  }
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  font-size: 18px;
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
