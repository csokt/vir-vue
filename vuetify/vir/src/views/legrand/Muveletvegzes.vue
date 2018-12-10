<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <SmartAutocomplete
            v-model="helyId"
            label="Gyártási hely"
            itemClass="body-2"
            :apiUrl="helyApiUrl"
            @searchInput="helySearchInput = $event"
            @change="hely = $event"
          />
          <SmartAutocomplete
            v-model="szemelyId"
            label="Dolgozó"
            itemClass="body-2"
            :apiUrl="szemelyApiUrl"
            @searchInput="szemelySearchInput = $event"
            @change="szemely = $event"
          />
          <SmartAutocomplete
            v-model="szefoMuveletId"
            label="Művelet"
            itemClass="body-2"
            :apiUrl="szefoMuveletApiUrl"
            @searchInput="szefoSearchInput = $event"
            @change="szefoMuvelet = $event"
          />
          <v-text-field
            v-model="gyartasiLap"
            label="Gyártási lap"
            readonly
          />
          <v-text-field
            v-model="szefoMuvelet.hiany_db"
            label="Hiány"
            readonly
          />
          <v-text-field
            ref="mennyiseg"
            v-model="mennyiseg"
            label="Mennyiség"
            @keyup.enter="$refs.mennyiseg.blur()"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            :disabled="!mentheto"
            @click="ment"
          >
            Mentés
          </v-btn>
        </v-card-actions>
      </BaseCard>
      <BaseCard title="Felvett műveletek">
        <v-card-text>
          <MuveletvegzesTable :reloadTrigger="reloadTrigger"/>
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import { API, EventBus, checkResponse } from '@/util'
import BaseCard from '@/components/base/BaseCard.vue'
import SmartAutocomplete from '@/components/base/SmartAutocomplete.vue'
import MuveletvegzesTable from '@/components/legrand/MuveletvegzesTable.vue'

export default {
  name: 'legrand-muveletvegzes',
  components: {
    BaseCard,
    SmartAutocomplete,
    MuveletvegzesTable
  },

  data () {
    return {
      helySearchInput: '',
      helyId: 0,
      hely: {},
      szemelySearchInput: '',
      szemelyId: 0,
      szemely: {},
      szefoSearchInput: '',
      szefoMuveletId: 0,
      szefoMuvelet: {},
      mennyiseg: null,
      reloadTrigger: false
    }
  },

  computed: {
    helyApiUrl () {
      const params = { domain: [['name', 'ilike', this.helySearchInput], ['szefo_e', '=', true]], order: 'name', limit: 10 }
      return 'vir/searchRead/legrand.hely?params=' + JSON.stringify(params)
    },

    szemelyApiUrl () {
      const params = { domain: [['name', 'ilike', this.szemelySearchInput]], order: 'name', limit: 10 }
      return 'vir/searchRead/nexon.szemely?params=' + JSON.stringify(params)
    },

    szefoMuveletApiUrl () {
      const params = { domain: [['name', 'ilike', this.szefoSearchInput]], limit: 30 }
      return 'vir/searchRead/legrand.gylap_szefo_muvelet?params=' + JSON.stringify(params)
    },

    gyartasiLap () {
      return this.szefoMuvelet.id && this.szefoMuvelet.gyartasi_lap_id[1]
    },

    mentheto () {
      return this.helyId && this.szemelyId && this.szefoMuveletId && this.mennyiseg
    }
  },

  methods: {
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
