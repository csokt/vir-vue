<template>
  <v-container pa-0>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <LookupMunkalap v-model="munkalapazonosito"  @change="onChange"/>
          <BaseMunkalapInfo :munkalap="munkalap"/>
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import BaseCard from '@/components/core/BaseCard.vue'
import LookupMunkalap from '@/components/LookupMunkalap.vue'
import BaseMunkalapInfo from '@/components/BaseMunkalapInfo.vue'

export default {
  name: 'munkalap',
  components: {
    BaseCard,
    LookupMunkalap,
    BaseMunkalapInfo
  },

  data () {
    return {
      munkalapazonosito: '',
      munkalap: {}
    }
  },

  methods: {
    onChange (item) {
      this.munkalap = item
      this.$store.set('defaults@cikkszam', this.munkalap.cikkszam)
    }
  },

  created () {
    this.$store.set('pageTitle', 'Gyártási információk')
  }
}
</script>
