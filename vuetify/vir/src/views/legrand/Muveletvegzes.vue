<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Autocomplete v-model="helyId" label="Gyártási hely" itemClass="body-2" :apiUrl="helyApiUrl" @change="hely = $event"/>
          <Autocomplete v-model="szemelyId" label="Dolgozó" itemClass="body-2" :apiUrl="szemelyApiUrl" @change="szemely = $event"/>
          <Autocomplete v-model="szefoMuveletId" label="Művelet" itemClass="body-2" :apiUrl="szefoMuveletApiUrl" @change="szefoMuvelet = $event"/>
          <v-text-field v-model="gyartasiLap" label="Gyártási lap" readonly/>
          <v-text-field v-model="szefoMuvelet.hiany_db" label="Hiány" readonly/>
          <v-text-field ref="mennyiseg" v-model="mennyiseg" label="Mennyiség" @keyup.enter="$refs.mennyiseg.blur()"/>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" :disabled="!mentheto" @click="ment">Mentés</v-btn>
        </v-card-actions>
      </Card>
      <Card title="Felvett műveletek">
        <v-card-text>
          <MuveletvegzesTable :reloadTrigger="reloadTrigger"/>
        </v-card-text>
      </Card>
    </v-layout>
  </v-container>
</template>

<script>
import { API, EventBus, checkResponse } from '@/util'
import Card from '@/components/base/Card.vue'
import Autocomplete from '@/components/base/Autocomplete.vue'
import MuveletvegzesTable from '@/components/legrand/MuveletvegzesTable.vue'

export default {
  name: 'legrand-muveletvegzes',
  components: {
    Card,
    Autocomplete,
    MuveletvegzesTable
  },

  data () {
    return {
      helyId: 0,
      hely: {},
      szemelyId: 0,
      szemely: {},
      szefoMuveletId: 0,
      szefoMuvelet: {},
      mennyiseg: null,
      reloadTrigger: false
    }
  },

  computed: {
    gyartasiLap () {
      return this.szefoMuvelet.id && this.szefoMuvelet.gyartasi_lap_id[1]
    },

    mentheto () {
      return this.helyId && this.szemelyId && this.szefoMuveletId && this.mennyiseg
    }
  },

  methods: {
    helyApiUrl (content) {
      const params = { domain: [['name', 'ilike', content], ['szefo_e', '=', true]], order: 'name', limit: 10 }
      return 'vir/searchRead/legrand.hely?params=' + JSON.stringify(params)
    },

    szemelyApiUrl (content) {
      const params = { domain: [['name', 'ilike', content]], order: 'name', limit: 10 }
      return 'vir/searchRead/nexon.szemely?params=' + JSON.stringify(params)
    },

    szefoMuveletApiUrl (content) {
      const params = { domain: [['name', 'ilike', content]], limit: 30 }
      return 'vir/searchRead/legrand.gylap_szefo_muvelet?params=' + JSON.stringify(params)
    },

    async ment () {
      const row = {
        szefo_muvelet_id: this.szefoMuveletId,
        hely_id: this.helyId,
        szemely_id: this.szemelyId,
        mennyiseg: this.mennyiseg
      }
      const response = await API.post('vir/create/legrand.muveletvegzes', row)
      if (!checkResponse(response)) return
      this.szefoMuveletId = 0
      this.mennyiseg = null
      this.reloadTrigger = !this.reloadTrigger
      EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Rögzítve!' })
    }
  },

  created () {
    this.$store.set('pageTitle', 'Műveletvégzés')
  }
}
</script>
