<template>
  <v-data-table
    :headers="headers"
    :items="muveletek"
    no-data-text=""
    hide-actions
  >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.szemely_id[1] }}</td>
      <td>{{ props.item.szefo_muvelet_id[1] }}</td>
      <td class="text-xs-right">{{ props.item.mennyiseg }}</td>
    </template>
  </v-data-table>
</template>

<script>
import { API } from '@/util'

export default {
  props: {
    reloadTrigger: Boolean
  },

  data () {
    return {
      headers: [
        { text: 'Dolgozó', sortable: false },
        { text: 'Művelet', sortable: false },
        { text: 'Mennyiség', sortable: false, align: 'right', width: '1%' }
      ],
      muveletek: []
    }
  },

  watch: {
    reloadTrigger: function () {
      this.loadData()
    }
  },

  methods: {
    async loadData () {
      const response = await API.get('vir/searchRead/legrand.muveletvegzes?params=' + JSON.stringify({ limit: 10 }))
      if (response.ok) {
        this.muveletek = response.data
      } else {
        console.log(response)
      }
    }
  },

  created () {
    this.loadData()
  }
}
</script>
