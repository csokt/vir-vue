<template>
  <div class="row justify-center">
    <div style="width: 450px; max-width: 95vw;">
      <div class="text-faded text-bold text-center text-margin-top">Technológiai dokumentációk</div>
      <h5 class="text-negative"> {{message}} </h5>
      <hr>
      <template v-if="store.user">
        <q-item>
          <q-search v-model="search" @keyup.enter="doSearch" clearable=true placeholder="Cikkszám keresése"/>
          <q-spinner v-if="spinner" :size="40"/>
          <q-btn @click="$router.go(-1)" push color="warning">Vissza</q-btn>
        </q-item>
        <q-item separator v-for="result in results" :key="result.fullpath"  link @click="openUrl(result.fullpath)" >
          {{result.name}}
        </q-item>
      </template>
    </div>
  </div>
</template>

<script>
import API from '../rest.js'
import Store from '../store'
import { Log } from '../rpc'
import {
  QSearch,
  QBtn,
  QItem,
  QSpinner
} from 'quasar'

const publicUrl = 'https://mobilszefo.hopto.org:19540/d/2e2d6b2c61fb4acdb9e2/'

export default {
  name: 'search',
  components: {
    QSearch,
    QBtn,
    QItem,
    QSpinner
  },

  data () {
    return {
      store: Store,
      search: '',
      results: [],
      spinner: false,
      message: ''
    }
  },

  methods: {
    async doSearch () {
      Log('search', {string: this.search})
      this.spinner = true
      this.message = ''
      const response = await API.get('tir/seafile/' + this.search + '/' + this.store.user.role)
      if (response.ok) {
        this.results = response.data
        if (!response.data.length) {
          this.message = 'Nincs adat!'
          Log('message', {message: this.message})
        }
      }
      else {
        this.message = 'Keresési hiba!'
        Log('message', {message: this.message})
        console.log(response.problem)
      }
      this.spinner = false
    },

    openUrl (path) {
      Log('show', {file: path})
      let win = window.open(publicUrl + 'files/?p=' + path, '_blank')
      if (win) { win.focus() }
      else { alert('Engedélyezze a felugró ablakokat ezen az oldalon!') }
    }
  },

  created () {
    if (!this.store.user) { this.$router.replace('/'); return }
    Log('navigate')
    if (this.store.user.filterCikkszam) {
      this.search = this.store.user.filterCikkszam
      this.doSearch()
    }
  }
}
</script>

<style scoped lang="stylus">
.text-margin-top
  margin-top 0.4em
.name
  font-size 1.7rem
  margin-bottom 0.3em
.q-btn
  margin-left 2em
.row
  font-size 1.2rem
.q-item
  font-size 1.2rem
</style>
