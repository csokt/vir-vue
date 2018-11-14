<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Autocomplete v-model="leltarkorzetId" label="Leltárkörzet" itemClass="body-2" :apiUrl="apiUrl" @change="leltarkorzet = $event"/>
          <KorzetInfo :leltarkorzet="leltarkorzet"/>
        </v-card-text>
      </Card>
      <Card title="Tárgyi eszközök">
        <v-card-text>
          <KorzetEszkozok :leltarkorzetId="leltarkorzetId"/>
        </v-card-text>
      </Card>
    </v-layout>
  </v-container>
</template>

<script>
import Card from '@/components/base/Card.vue'
import Autocomplete from '@/components/base/Autocomplete.vue'
import KorzetInfo from '@/components/targyi-eszkoz/KorzetInfo.vue'
import KorzetEszkozok from '@/components/targyi-eszkoz/KorzetEszkozok.vue'

export default {
  name: 'targyi-eszkoz-leltarkorzet',
  components: {
    Card,
    Autocomplete,
    KorzetInfo,
    KorzetEszkozok
  },

  data () {
    return {
      leltarkorzetId: 0,
      leltarkorzet: {}
    }
  },

  methods: {
    apiUrl (content) {
      const params = { domain: [['name', 'ilike', content]], limit: 8 }
      return 'vir/searchRead/leltar.korzet?params=' + JSON.stringify(params)
    }
  },

  created () {
    this.$store.set('pageTitle', 'Leltárkörzet információk')
  }
}
</script>
