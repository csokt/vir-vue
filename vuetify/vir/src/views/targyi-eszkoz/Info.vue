<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Eszkoz v-model="leltariSzam"  @change="eszkoz = $event"/>
          <EszkozInfo :eszkoz="eszkoz"/>
        </v-card-text>
      </Card>
      <Card title="Eszköz mozgásai">
        <v-card-text>
          <EszkozMozgas filter="eszkoz" :eszkozId="eszkoz.id"/>
        </v-card-text>
      </Card>
    </v-layout>
  </v-container>
</template>

<script>
import Card from '@/components/base/Card.vue'
import Eszkoz from '@/components/targyi-eszkoz/Eszkoz.vue'
import EszkozInfo from '@/components/targyi-eszkoz/EszkozInfo.vue'
import EszkozMozgas from '@/components/targyi-eszkoz/EszkozMozgas.vue'

export default {
  name: 'targyi-eszkoz-info',
  components: {
    Card,
    Eszkoz,
    EszkozInfo,
    EszkozMozgas
  },

  data () {
    return {
      leltariSzam: '',
      eszkoz: {}
    }
  },

  created () {
    this.$store.set('pageTitle', 'Tárgyi eszköz információk')
  }
}
</script>
