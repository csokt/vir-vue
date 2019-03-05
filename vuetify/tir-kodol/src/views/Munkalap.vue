<template>
  <v-container pa-0>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <LookupMunkalap v-model="munkalapazonosito"  @change="munkalap = $event"/>
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

  created () {
    this.$store.set('pageTitle', 'Gyártási információk')
  }
}
</script>
