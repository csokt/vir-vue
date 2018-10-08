<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Eszkoz v-model="leltariSzam"  @change="eszkoz = $event" @mozgas="mozgas = $event"/>
          <v-text-field v-model="eszkoz.megnevezes" label="Eszköz" readonly />
          <v-text-field v-if="eszkoz.selejt_ok" v-model="eszkoz.selejt_ok" label="Selejtezni" readonly />
          <v-text-field v-if="aktHasznalo" v-model="aktHasznalo" label="Aktuális használó" readonly />
          <v-text-field v-model="aktLeltarkorzet" label="Aktuális leltárkörzet" readonly />
        </v-card-text>
      </Card>
      <Card title="Eszköz mozgásai">
        <v-card-text>
          <v-text-field v-for="row in mozgas" :key="row.id" v-model="row.hova_leltarkorzet_id[1]" :label="utc2local(row.create_date)" readonly />
        </v-card-text>
      </Card>
    </v-layout>
  </v-container>
<!--
-->
</template>

<script>
import Eszkoz from '@/components/Eszkoz.vue'
import Card from '@/components/base/Card.vue'

export default {
  name: 'info',
  components: {
    Eszkoz,
    Card
  },

  data () {
    return {
      leltariSzam: '',
      eszkoz: {},
      mozgas: []
    }
  },

  computed: {
    leltarcsoport () {
      return this.eszkoz.id && this.eszkoz.leltarcsoport_id[1]
    },
    aktLeltarkorzet () {
      return this.eszkoz.id && this.eszkoz.akt_leltarkorzet_id[1]
    },
    aktHasznalo () {
      return this.eszkoz.id && this.eszkoz.akt_hasznalo_id[1]
    }
  },

  methods: {
    utc2local (utc) {
      return new Date(utc.replace(/ /, 'T') + 'Z').toLocaleString()
    }
  },

  created () {
    this.$store.set('title', 'Tárgyi eszköz információk')
  }
}
</script>
