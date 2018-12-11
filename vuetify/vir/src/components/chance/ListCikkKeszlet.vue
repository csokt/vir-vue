<template>
  <div>
    <SmartList
      :apiUrl="apiUrl"
      value="raktaron"
      :label="label"
      @select="$emit('select', $event)"
    />
</div>
</template>

<script>
import SmartList from '@/components/base/SmartList.vue'

export default {
  components: {
    SmartList
  },

  props: {
    cikkId: Number
  },

  computed: {
    apiUrl () {
      const params = { domain: [['cikk_id', '=', this.cikkId], ['szefo_e', '=', true], ['raktaron', '!=', 0]] }
      return 'vir/searchRead/chance.keszlet?params=' + JSON.stringify(params)
    }
  },

  methods: {
    label (item) {
      return item.hely_id[1]
    }
  }
}
</script>
