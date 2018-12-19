<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      no-data-text=""
      hide-actions
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <td>{{ props.item.szemely_id[1] }}</td>
        <td>{{ props.item.szefo_muvelet_id[1] }}</td>
        <td class="text-xs-right">{{ props.item.mennyiseg }}</td>
      </template>
    </v-data-table>
    <ApiGet
      ref="apiget"
      v-model="items"
      :apiUrl="apiUrl"
      expect="array"
    />
  </div>
</template>

<script>
import ApiGet from '@/components/core/ApiGet.vue'

export default {
  components: {
    ApiGet
  },

  data () {
    return {
      headers: [
        { text: 'Dolgozó', sortable: false },
        { text: 'Művelet', sortable: false },
        { text: 'Mennyiség', sortable: false, align: 'right', width: '1%' }
      ],
      items: []
    }
  },

  computed: {
    apiUrl () {
      return 'vir/searchRead/legrand.muveletvegzes?params=' + JSON.stringify({ limit: 10 })
    }
  },

  methods: {
    reload () {
      this.$refs.apiget.reload()
    }
  }
}
</script>
