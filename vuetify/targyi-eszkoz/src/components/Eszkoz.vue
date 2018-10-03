<template>
  <Qfield
    v-model="leltariSzam"
    label="Leltári szám"
    required
    @change="onChange"
  />
</template>

<script>
import { API, EventBus } from '@/util'
import Qfield from '@/components/base/Qfield.vue'

function queryParams (params) {
  return '?params=' + JSON.stringify(params)
}

export default {
  name: 'eszkoz',
  components: {
    Qfield
  },

  props: {
    value: {
      type: Object
    }
  },

  data () {
    return {
      leltariSzam: ''
    }
  },

  methods: {
    async onChange () {
      let eszkoz
      let mozgas
      let params = { domain: [['leltari_szam', '=', this.leltariSzam]], frontend: true }
      let response = await API.get('vir/searchRead/leltar.eszkoz' + queryParams(params))
      if (response.ok && response.data.length) {
        eszkoz = response.data[0]
        this.$emit('input', eszkoz)

        params = { domain: [['eszkoz_id', '=', eszkoz.id]], frontend: true }
        response = await API.get('vir/searchRead/leltar.eszkozmozgas' + queryParams(params))
        mozgas = response.data
        this.$emit('mozgas', mozgas)
      } else {
        eszkoz = {}
        mozgas = []
        this.$emit('input', eszkoz)
        this.$emit('mozgas', mozgas)
        EventBus.$emit('inform', { type: 'alert', variation: 'warning', message: 'Hibás leltári szám!' })
      }
    }
  }
}
</script>
