<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <SmartAutocomplete
            v-model="ujLeltarkorzetId"
            label="Új leltárkörzet"
            itemClass="body-2"
            :apiUrl="apiUrl"
            @searchInput="searchInput = $event"
            @change="ujLeltarkorzet = $event"
          />
          <LookupEszkoz
            v-model="leltariSzam"
            :reloadTrigger="reloadTrigger"
            @change="eszkoz = $event"
          />
          <BaseEszkozInfo :eszkoz="eszkoz"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            :disabled="!athelyezheto"
            @click="athelyez"
          >
            Áthelyezés az új körzetbe
          </v-btn>
        </v-card-actions>
      </BaseCard>
      <BaseCard title="Eszköz mozgásai">
        <v-card-text>
          <EszkozMozgas
            filter="eszkoz"
            :eszkozId="eszkoz.id"
            :reloadTrigger="reloadTrigger"
          />
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import { API, EventBus, checkResponse } from '@/util'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseEszkozInfo from '@/components/targyi-eszkoz/BaseEszkozInfo.vue'
import SmartAutocomplete from '@/components/base/SmartAutocomplete.vue'
import LookupEszkoz from '@/components/targyi-eszkoz/LookupEszkoz.vue'
import EszkozMozgas from '@/components/targyi-eszkoz/EszkozMozgas.vue'

export default {
  name: 'targyi-eszkoz-athelyezes',
  components: {
    BaseCard,
    BaseEszkozInfo,
    SmartAutocomplete,
    LookupEszkoz,
    EszkozMozgas
  },

  data () {
    return {
      searchInput: '',
      ujLeltarkorzetId: 0,
      ujLeltarkorzet: {},
      leltariSzam: '',
      reloadTrigger: false,
      eszkoz: {}
    }
  },

  computed: {
    apiUrl () {
      const params = { domain: [['name', 'ilike', this.searchInput]], limit: 10 }
      return 'vir/searchRead/leltar.korzet?params=' + JSON.stringify(params)
    },

    athelyezheto () {
      return this.ujLeltarkorzet.id && this.eszkoz.id && this.ujLeltarkorzet.id !== this.eszkoz.akt_leltarkorzet_id[0]
    }
  },

  methods: {
    async athelyez () {
      const row = {
        eszkoz_id: this.eszkoz.id,
        hova_leltarkorzet_id: this.ujLeltarkorzet.id
      }
      const response = await API.post('vir/create/leltar.eszkozmozgas', row)
      if (!checkResponse(response)) return
      EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Áthelyezve!' })
      this.reloadTrigger = !this.reloadTrigger
    }
  },

  created () {
    this.$store.set('pageTitle', 'Tárgyi eszköz áthelyezés')
  }
}
</script>
