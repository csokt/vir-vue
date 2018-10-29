<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Autocomplete v-model="cikk.id" label="Cikkazonosító" itemClass="body-2" :apiUrl="apiUrl" :parentSearch="cikk.name" @change="cikk = $event"/>
          <CikkByVonalkod v-model="cikk.vonalkod"  @change="cikk = $event"/>
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
import CikkByVonalkod from '@/components/chance/CikkByVonalkod.vue'
import CikkInfo from '@/components/chance/CikkInfo.vue'
import CikkKeszlet from '@/components/chance/CikkKeszlet.vue'

export default {
  name: 'info',
  components: {
    Card,
    Autocomplete,
    CikkByVonalkod,
    CikkInfo,
    CikkKeszlet
  },

  data () {
    return {
      cikk: {}
    }
  },

  methods: {
    apiUrl (content) {
      const params = { domain: [['name', 'ilike', content]], order: 'name', limit: 20 }
      return 'vir/searchRead/chance.cikk?params=' + JSON.stringify(params)
    }
  }
}
</script>
