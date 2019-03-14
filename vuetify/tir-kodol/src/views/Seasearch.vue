<template>
  <v-container pa-0>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text class="pb-0">
          <v-text-field
            ref="element"
            v-model="search"
            label="Cikkszám keresése"
            clearable
          />
        </v-card-text>
        <v-card-media>
          <SmartList
            ref="seadocs"
            :apiUrl="apiUrl"
            itemkey = "fullpath"
            value="name"
            layout="list"
            @select="onSelect($event)"
          />
        </v-card-media>
      </BaseCard>
    </v-layout>
  </v-container>
<!--
-->
</template>

<script>
import { get } from 'vuex-pathify'
import BaseCard from '@/components/core/BaseCard.vue'
import SmartList from '@/components/core/SmartList.vue'

export default {
  name: 'seasearch',
  components: {
    BaseCard,
    SmartList
  },

  data () {
    return {
      search: '',
      items: [],
      isLoading: false
    }
  },

  computed: {
    ...get(['defaults', 'user']),

    apiUrl () {
      if (this.search && this.search.length < 5) return ''
      return 'tir/seafile/' + this.search + '/' + this.user.tir_role
    }
  },

  methods: {
    onSelect (item) {
      // Log('show', {file: item.fullpath})
      const publicUrl = 'https://mobilszefo.hopto.org:19540/d/2e2d6b2c61fb4acdb9e2/'
      let win = window.open(publicUrl + 'files/?p=' + item.fullpath, '_blank')
      if (win) {
        win.focus()
      } else {
        alert('Engedélyezze a felugró ablakokat ezen az oldalon!')
      }
    }
  },

  created () {
    this.$store.set('pageTitle', 'Technológiai dokumentációk')
    this.$store.set('showFilterIcon', false)
    this.search = this.defaults.cikkszam
  }
}
</script>
