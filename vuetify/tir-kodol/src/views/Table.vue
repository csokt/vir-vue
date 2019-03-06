<template>
  <v-container fluid pa-1>
    <v-layout>
      <v-flex>
          <table class="table-striped" v-bind:style="{ 'font-size': view.tablefontsize }">
            <thead v-bind:style="{ 'font-size': view.headfontsize }">
              <tr>
                <th v-for="field in view.fields" :key="'H' + field.name">{{field.label}}</th>
              </tr>
            </thead>
            <tbody v-bind:style="{ 'font-size': view.bodyfontsize }">
              <tr v-for="(row, index) in result.stat" :key="'S' + index" class="stat">
                <td v-for="field in view.fields" :key="'S' + field.name" v-bind:style="{'font-size': field.fontsize }">{{row[field.name]}}</td>
              </tr>
              <template v-for="(row, index) in result.records">
                <tr :key="'R' + index">
                  <td v-for="field in view.fields" :key="'R' + field.name" @click="clickField(row, field)" v-bind:class="{ search: field.search }" v-bind:style="{ color: color(field, row[field.name]), 'font-size': field.fontsize }">{{row[field.name]}}</td>
                </tr>
                <tr :key="'I' + index" v-if="(index + 1) % view.head_after === 0" v-bind:style="{ 'font-size': view.headfontsize }">
                  <th v-for="field in view.fields" :key="'I' + field.name">{{field.label}}</th>
                </tr>
              </template>
            </tbody>
          </table>
      </v-flex>
    </v-layout>
  </v-container>
<!--
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
        <template v-for="(row, index) in result.records">
          <tr>
            <td v-for="field in view.fields" @click="clickField(row, field)" v-bind:class="{ search: field.search }" v-bind:style="{ color: color(field, row[field.name]), 'font-size': field.fontsize }">{{row[field.name]}}</td>
          </tr>
          <tr v-if="(index + 1) % view.head_after === 0" v-bind:style="{ 'font-size': view.headfontsize }">
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
-->
</template>

<script>
import { get } from 'vuex-pathify'
import { API, EventBus, checkResponse } from '@/util'
import BaseCard from '@/components/core/BaseCard.vue'
// import Vue from 'vue'
// import VueFormGenerator from 'vue-form-generator/dist/vfg-core.js'
// Vue.use(VueFormGenerator)
// // import "vue-form-generator/dist/vfg-core.css"
// import Config from '../config'
// import Store from '../store'
// import { RpcView, Log } from '../rpc'

export default {
  name: 'table',
  components: {
    BaseCard
  },

  data () {
    return {
      view: {},
      result: {},
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
    ...get(['user', 'views'])
  },

  methods: {
    async requestData () {
      const response = await API.get('tir/tables/' + this.view.id + '?params=' + JSON.stringify(this.filter))
      if (!checkResponse(response)) return
      this.result = response.data
      this.spinner = false
    },

    //   clickField (row, field) {
    //     if (field.search) {
    //       let data = {}
    //       data[field.name] = row[field.name]
    //       Log('clickfield', data)
    //       this.store.user.filterCikkszam = row[field.name]
    //       this.$router.push('/search')
    //     }
    //   },

    color (field, value) {
      if (value > 0) { return field.positive }
      if (value === 0) { return field.zero }
      if (value < 0) { return field.negative }
    }
  },

  created () {
    this.view = this.views.find(o => o.id === this.$route.params.id) || {}
    if (!this.view.id) {
      EventBus.$emit('inform', { type: 'alert', variation: 'warning', message: 'A táblázat nem létezik!' })
    }
    this.$store.set('pageTitle', this.view.label)
  },

  // created () {
  //   if (!this.store.user) { this.$router.replace('/'); return }
  //   Log('navigate')
  //   const view = Config.views.find(o => o.id === this.$route.params.id)
  //   let model = {}
  //   for (let field of view.fields) {
  //     if (!field.filter) { continue }
  //     if (field.default) {
  //       model[field.name] = this.store.user[field.default]
  //     }
  //     else {
  //       model[field.name] = null
  //     }
  //   }
  //   this.filter = model
  // },

  mounted () {
  //   if (this.view.refresh) {
  //     this.myInterval = setInterval(() => {
  //       this.requestData()
  //     }, 1000 * this.view.refresh)
  //   }
    this.requestData()
  }

  // beforeDestroy () {
  //   if (this.myInterval) {
  //     clearInterval(this.myInterval)
  //   }
  // }
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

.search {
  color: darkgreen;
}
</style>
