<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <SmartAutocomplete
            v-model="ujHasznaloId"
            label="Új használó"
            itemClass="body-2"
            :apiUrl="hasznaloApiUrl"
            @searchInput="searchInput = $event"
          />
          <LookupEszkoz
            ref="lookupeszkoz"
            v-model="leltariSzam"
            @change="eszkoz = $event"
          />
          <BaseEszkozInfo :eszkoz="eszkoz"/>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            :disabled="!atadhato"
            @click="atad"
          >
            Használatba adás
          </v-btn>
        </v-card-actions>
      </BaseCard>
      <BaseCard title="Jelenleg használatban">
        <v-card-text>
          <SmartList
            ref="eszkozok"
            :apiUrl="eszkozokApiUrl"
            value="name"
            :label="label"
            @select="onSelect($event)"
          />
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
<!--
-->
</template>

<script>
import { API, EventBus, utc2local, checkResponse } from '@/util'
import BaseCard from '@/components/core/BaseCard.vue'
import BaseEszkozInfo from '@/components/targyi-eszkoz/BaseEszkozInfo.vue'
import SmartAutocomplete from '@/components/core/SmartAutocomplete.vue'
import SmartList from '@/components/core/SmartList.vue'
import LookupEszkoz from '@/components/targyi-eszkoz/LookupEszkoz.vue'

export default {
  name: 'targyi-eszkoz-szemelynek',
  components: {
    BaseCard,
    BaseEszkozInfo,
    SmartAutocomplete,
    SmartList,
    LookupEszkoz
  },

  data () {
    return {
      searchInput: '',
      ujHasznaloId: 0,
      leltariSzam: '',
      eszkoz: {}
    }
  },

  computed: {
    hasznaloApiUrl () {
      const params = { domain: [['name', 'ilike', this.searchInput]], limit: 10 }
      return 'vir/searchRead/hr.employee?params=' + JSON.stringify(params)
    },

    eszkozokApiUrl () {
      if (!this.ujHasznaloId) {
        return ''
      }
      const params = { domain: [['akt_hasznalo_id', '=', this.ujHasznaloId]] }
      return 'vir/searchRead/leltar.eszkoz?params=' + JSON.stringify(params)
    },

    atadhato () {
      return this.ujHasznaloId && this.eszkoz.id && this.ujHasznaloId !== this.eszkoz.akt_hasznalo_id[0]
    }
  },

  methods: {
    label (item) {
      return utc2local(item.write_date)
    },

    async atad () {
      const row = {
        eszkoz_id: this.eszkoz.id,
        uj_hasznalo_id: this.ujHasznaloId,
        megjegyzes: ''
      }
      const response = await API.post('vir/create/leltar.eszkozatvetel', row)
      if (!checkResponse(response)) return
      EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Átadva!' })
      this.$refs.lookupeszkoz.reload()
      this.$refs.eszkozok.reload()
    }
  },

  created () {
    this.$store.set('pageTitle', 'Személyes használatra')
  }
}
</script>
