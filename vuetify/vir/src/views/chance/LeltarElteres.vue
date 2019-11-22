<template>
  <v-container grid-list-lg pa-2>
    <v-layout justify-space-around wrap>
      <BaseCard :title="chanceiv.name">
        <v-card-text>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Keresés"
            single-line
            hide-details
          ></v-text-field>
          <v-data-table
            :headers="headers"
            :items="items"
            :loading="loading"
            :search="search"
            :no-data-text="noDataText"
            no-results-text="A keresés nem hozott eredményt"
            hide-actions
          >
            <template
              slot="items"
              slot-scope="props"
            >
              <td>{{ props.item.display_name }}</td>
              <td>{{ props.item.vonalkod }}</td>
              <td class="text-xs-right">{{ props.item.fellelt }}</td>
              <td class="text-xs-right">{{ props.item.raktaron }}</td>
              <td class="text-xs-right">{{ props.item.elteres }}</td>
            </template>
          </v-data-table>
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'
import { API, checkResponse } from '@/util'
import BaseCard from '@/components/core/BaseCard.vue'

export default {
  name: 'chance-leltar-elteres',
  components: {
    BaseCard
  },

  props: {
    filter: String
  },

  data () {
    return {
      headers: [
        { text: 'Cikk', value: 'display_name' },
        { text: 'V.kód', value: 'vonalkod' },
        { text: 'Fellelt', value: 'fellelt', align: 'right', sortable: false },
        { text: 'Rakt.', value: 'raktaron', align: 'right', sortable: false },
        { text: 'Eltér', value: 'elteres', align: 'right', sortable: false }
      ],
      items: [],
      where: [],
      search: '',
      loading: true,
      noDataText: 'Betöltés...'
    }
  },

  computed: {
    ...get(['chanceiv']),

    apiUrl () {
      const params = { domain: [['leltariv_id', '=', this.chanceiv.id], this.where], limit: 10000 }
      return 'vir/searchRead/chance.leltariv_elteres?params=' + JSON.stringify(params)
    }
  },

  async created () {
    switch (this.filter) {
      case 'osszes':
        this.$store.set('pageTitle', 'Összes cikk')
        this.where = ['id', '!=', 0]
        break
      case 'fellelt':
        this.$store.set('pageTitle', 'Fellelt cikkek')
        this.where = ['fellelt', '!=', 0]
        break
      case 'nem-fellelt':
        this.$store.set('pageTitle', 'Nem fellelt cikkek')
        this.where = ['fellelt', '=', 0]
        break
      case 'elter':
        this.$store.set('pageTitle', 'Fellelt és raktáron eltér')
        this.where = ['elteres', '!=', 0]
        break
      default:
        this.$store.set('pageTitle', '????? cikkek')
        break
    }

    const response = await API.get(this.apiUrl)
    this.items = checkResponse(response) && response.data
    this.loading = false
    this.noDataText = 'Nincs adat'
  }
}
</script>
