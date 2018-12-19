<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
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

  props: {
    apiUrl: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      headers: [
        { text: 'Méret', value: 'meret' },
        { text: 'Szín', value: 'szin' },
        { text: 'Vonalkód', value: 'vonalkod', align: 'right' },
        { text: 'Raktáron', value: 'raktaron', align: 'right', width: '1%' }
      ],
      items: []
    }
  },

  methods: {
    reload () {
      this.$refs.apiget.reload()
    }
  }
}
</script>
