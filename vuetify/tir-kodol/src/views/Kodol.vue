<template>
  <v-container pa-0>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <LookupDolgozo v-model="dolgozokod"  @change="dolgozo = $event"/>
          <v-text-field v-model="dolgozo.dolgozonev" label="Dolgozó" readonly/>
          <LookupMunkalap v-model="munkalapazonosito"  @change="munkalap = $event"/>
          <v-text-field v-model="munkalap.kartoninfo" label="Kartoninfo" readonly/>
          <v-text-field v-model="gepkod" type="number" label="Gépkód"/>
          <v-combobox v-model="muveletkodok" type="number" multiple chips deletable-chips clearable required label="Műveletkódok"/>
          <v-text-field v-model="mennyiseg" type="number" label="Mennyiség"/>
          <v-card-actions>
            <v-btn color="primary" @click="pubKodolas">Adatok mentése</v-btn>
          </v-card-actions>
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import BaseCard from '@/components/core/BaseCard.vue'
import LookupDolgozo from '@/components/LookupDolgozo.vue'
import LookupMunkalap from '@/components/LookupMunkalap.vue'

export default {
  name: 'munkalap',
  components: {
    BaseCard,
    LookupDolgozo,
    LookupMunkalap
  },

  data () {
    return {
      dolgozokod: '',
      dolgozo: {},
      munkalapazonosito: '',
      munkalap: {},
      gepkod: 0,
      muveletkodok: [],
      mennyiseg: ''
    }
  },

  methods: {
    pubKodolas () {
      this.mennyiseg = ''
    }
  },

  created () {
    this.$store.set('pageTitle', 'Teljesítmény kódolás')
  }
}
</script>
