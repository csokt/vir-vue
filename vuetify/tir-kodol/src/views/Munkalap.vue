<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Munkalap v-model="munkalapazonosito"  @change="munkalap = $event"/>
          <MunkalapInfo :munkalap="munkalap"/>
        </v-card-text>
      </Card>
    </v-layout>
  </v-container>
</template>

<script>
import Card from '@/components/base/Card.vue'
import Munkalap from '@/components/lookup/Munkalap.vue'
import MunkalapInfo from '@/components/MunkalapInfo.vue'

export default {
  name: 'munkalap',
  components: {
    Card,
    Munkalap,
    MunkalapInfo
  },

  data () {
    return {
      teszt: '',
      qteszt: 'dummy',
      munkalapazonosito: '',
      munkalap: {}
    }
  }
}
</script>
