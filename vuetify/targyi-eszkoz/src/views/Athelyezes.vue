<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Autocomplete v-model="ujLeltarkorzetId" label="Új leltárkörzet" apiUrl="vir/searchRead/leltar.korzet?params={}" @change="ujLeltarkorzet = $event"/>
          <Eszkoz v-model="leltariSzam"  @change="eszkoz = $event" @mozgas="mozgas = $event"/>
          <v-text-field v-model="eszkoz.megnevezes" label="Eszköz" readonly />
          <v-text-field v-if="eszkoz.selejt_ok" v-model="eszkoz.selejt_ok" label="Selejtezni" readonly />
          <v-text-field v-if="aktHasznalo" v-model="aktHasznalo" label="Aktuális használó" readonly />
          <v-text-field v-model="aktLeltarkorzet" label="Aktuális leltárkörzet" readonly />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" :disabled="!athelyezheto" @click="athelyez">Áthelyezés az új körzetbe</v-btn>
        </v-card-actions>
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
// import { API, EventBus } from '@/util'
import Eszkoz from '@/components/Eszkoz.vue'
import Autocomplete from '@/components/base/Autocomplete.vue'
import Card from '@/components/base/Card.vue'

export default {
  name: 'athelyezes',
  components: {
    Eszkoz,
    Autocomplete,
    Card
  },

  data () {
    return {
      ujLeltarkorzetId: 0,
      ujLeltarkorzet: {},
      leltariSzam: '',
      eszkoz: {},
      mozgas: []
    }
  },

  computed: {
    aktLeltarkorzet () {
      return this.eszkoz.id && this.eszkoz.akt_leltarkorzet_id[1]
    },
    aktHasznalo () {
      return this.eszkoz.id && this.eszkoz.akt_hasznalo_id[1]
    },
    athelyezheto () {
      return this.ujLeltarkorzet.id && this.eszkoz.id && this.ujLeltarkorzet.id !== this.eszkoz.akt_leltarkorzet_id[0]
    }
  },

  methods: {
    utc2local (utc) {
      return new Date(utc.replace(/ /, 'T') + 'Z').toLocaleString()
    },

    async athelyez () {
      const leltariSzam = this.leltariSzam
      this.leltariSzam = ''
      this.$nextTick(function () {
        this.leltariSzam = leltariSzam
      })
      // const row = {
      //   eszkoz_id: this.eszkoz.id,
      //   hova_leltarkorzet_id: this.ujLeltarkorzet.id
      // }
      // const response = await API.post('vir/create/leltar.eszkozmozgas', row)
      // if (response.ok) {
      //   EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Áthelyezve!' })
      // } else {
      //   EventBus.$emit('inform', { type: 'alert', variation: 'error', message: 'Nem sikerült áthelyezni!' })
      // }
    }
  },

  created () {
    this.$store.set('title', 'Tárgyi eszköz áthelyezés')
  }
}
</script>
