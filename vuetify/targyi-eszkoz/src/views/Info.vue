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
          <EszkozMozgas filter="eszkoz" :eszkoz="eszkoz"/>
        </v-card-text>
      </Card>
    </v-layout>
  </v-container>
</template>

<script>
import Card from '@/components/base/Card.vue'
import Eszkoz from '@/components/Eszkoz.vue'
import EszkozInfo from '@/components/EszkozInfo.vue'
import EszkozMozgas from '@/components/EszkozMozgas.vue'

export default {
  name: 'info',
  components: {
    Card,
    Eszkoz,
    EszkozInfo,
    EszkozMozgas
  },

  data () {
    return {
      leltariSzam: '',
      eszkoz: {},
      mozgas: []
    }
  },

  created () {
    this.$store.set('title', 'Tárgyi eszköz információk')
  }
}
</script>
