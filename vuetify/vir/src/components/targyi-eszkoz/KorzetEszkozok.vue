<template>
  <div>
    <v-textarea
      v-for="row in eszkozok"
      :key="row.id"
      v-model="row.name"
      :label="row.leltarcsoport_id[1]"
      rows="1"
      auto-grow
      readonly
      @click.stop="$emit('select', row)"
    />
    <ApiGet
      ref="apiget"
      v-model="eszkozok"
      :apiUrl="apiUrl"
      expect="array"
    />
</div>
<!--
-->
</template>

<script>
import ApiGet from '@/components/base/ApiGet.vue'

export default {
  components: {
    ApiGet
  },

  props: {
    leltarkorzetId: Number
  },

  data () {
    return {
      eszkozok: []
    }
  },

  computed: {
    apiUrl () {
      if (!this.leltarkorzetId) {
        return ''
      }
      const params = { domain: [['akt_leltarkorzet_id', '=', this.leltarkorzetId]] }
      return 'vir/searchRead/leltar.eszkoz?params=' + JSON.stringify(params)
    }
  },

  methods: {
    reload () {
      this.$refs.apiget.reload()
    }
  }
}
</script>
