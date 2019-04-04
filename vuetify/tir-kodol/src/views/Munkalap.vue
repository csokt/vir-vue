<template>
  <v-container pa-0>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <LookupModel v-model="munkalapazonosito" model="munkalap" @change="onChange"/>
          <BaseMunkalapInfo :munkalap="munkalap"/>
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'
import BaseCard from '@/components/core/BaseCard.vue'
import LookupModel from '@/components/LookupModel.vue'
import BaseMunkalapInfo from '@/components/BaseMunkalapInfo.vue'

export default {
  name: 'munkalap',
  components: {
    BaseCard,
    LookupModel,
    BaseMunkalapInfo
  },

  data () {
    return {
      munkalapazonosito: '',
      munkalap: {}
    }
  },

  computed: get(['defaults']),

  methods: {
    onChange (item) {
      this.munkalap = item
      this.$store.set('defaults@cikkszam', this.munkalap.cikkszam)
    }
  },

  created () {
    this.$store.set('pageTitle', 'Gyártási információk')
    this.munkalapazonosito = this.defaults.munkalapazonosito
  }
}
</script>
