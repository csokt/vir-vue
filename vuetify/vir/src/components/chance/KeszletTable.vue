<template>
  <v-data-table
    :headers="headers"
    :items="keszlet"
    no-data-text="Nincs készleten"
    hide-actions
  >
    <template
      slot="items"
      slot-scope="props"
    >
      <td>{{ props.item.meret }}</td>
      <td>{{ props.item.szin }}</td>
      <td class="text-xs-right">{{ props.item.vonalkod }}</td>
      <td class="text-xs-right">{{ props.item.raktaron }}</td>
    </template>
  </v-data-table>
</template>

<script>
import { API, checkResponse } from '@/util'

export default {
  props: {
    searchParams: String
  },

  data () {
    return {
      headers: [
        { text: 'Méret', value: 'meret' },
        { text: 'Szín', value: 'szin' },
        { text: 'Vonalkód', value: 'vonalkod', align: 'right' },
        { text: 'Raktáron', value: 'raktaron', align: 'right', width: '1%' }
      ],
      keszlet: []
    }
  },

  watch: {
    searchParams: async function (params) {
      this.keszlet = []
      if (!params) { return }
      const response = await API.get('vir/searchRead/chance.keszlet?params=' + params)
      if (!checkResponse(response)) return
      this.keszlet = response.data
    }
  }
}
</script>
