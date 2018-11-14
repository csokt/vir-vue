<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Autocomplete v-model="cikkId" label="Cikkszám" itemClass="body-2" :apiUrl="apiUrl" item-text="cikkszam" @change="cikk = $event"/>
          <CikkInfo :cikk="cikk"/>
        </v-card-text>
      </Card>
      <Card title="Cikk készlet">
        <v-card-text>
          <CikkKeszlet :cikkId="cikk.id"/>
        </v-card-text>
      </Card>
    </v-layout>
  </v-container>
</template>

<script>
import Card from '@/components/base/Card.vue'
import Autocomplete from '@/components/base/Autocomplete.vue'
import CikkInfo from '@/components/legrand/CikkInfo.vue'
import CikkKeszlet from '@/components/legrand/CikkKeszlet.vue'

export default {
  name: 'legrand-info',
  components: {
    Card,
    Autocomplete,
    CikkInfo,
    CikkKeszlet
  },

  data () {
    return {
      cikkId: 0,
      cikk: {}
    }
  },

  methods: {
    apiUrl (content) {
      const params = { domain: [['cikkszam', 'ilike', content]], order: 'cikkszam', limit: 10 }
      return 'vir/searchRead/legrand.cikk?params=' + JSON.stringify(params)
    }
  },

  created () {
    this.$store.set('pageTitle', 'Termék információk')
  }
}
</script>
