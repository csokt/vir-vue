<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <SmartAutocomplete
            v-model="leltarkorzetId"
            label="Leltárkörzet"
            itemClass="body-2"
            :apiUrl="korzetApiUrl"
            @searchInput="searchInput = $event"
            @change="leltarkorzet = $event"
          />
          <BaseKorzetInfo :leltarkorzet="leltarkorzet"/>
        </v-card-text>
      </BaseCard>
      <BaseCard title="Tárgyi eszközök">
        <v-card-text>
          <SmartList
            ref="smartlist"
            :apiUrl="eszkozApiUrl"
            value="name"
            :label="label"
            @select="$emit('select', $event)"
          />
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import BaseCard from '@/components/base/BaseCard.vue'
import BaseKorzetInfo from '@/components/targyi-eszkoz/BaseKorzetInfo.vue'
import SmartAutocomplete from '@/components/base/SmartAutocomplete.vue'
import SmartList from '@/components/base/SmartList.vue'

export default {
  name: 'targyi-eszkoz-leltarkorzet',
  components: {
    BaseCard,
    BaseKorzetInfo,
    SmartAutocomplete,
    SmartList
  },

  data () {
    return {
      searchInput: '',
      leltarkorzetId: 0,
      leltarkorzet: {}
    }
  },

  computed: {
    korzetApiUrl () {
      const params = { domain: [['name', 'ilike', this.searchInput]], limit: 10 }
      return 'vir/searchRead/leltar.korzet?params=' + JSON.stringify(params)
    },

    eszkozApiUrl () {
      if (!this.leltarkorzetId) {
        return ''
      }
      const params = { domain: [['akt_leltarkorzet_id', '=', this.leltarkorzetId]] }
      return 'vir/searchRead/leltar.eszkoz?params=' + JSON.stringify(params)
    }
  },

  methods: {
    label (item) {
      return item.leltarcsoport_id[1]
    }
  },

  created () {
    this.$store.set('pageTitle', 'Leltárkörzet információk')
  }
}
</script>
