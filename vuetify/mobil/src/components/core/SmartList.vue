<template>
  <div>
    <BaseList
      :items="items"
      :itemkey="itemkey"
      :value="value"
      :label="label"
      @select="$emit('select', $event)"
    />
    <ApiGet
      ref="apiget"
      v-model="items"
      :apiUrl="apiUrl"
      expect="array"
      @length="$emit('length', $event)"
    />
</div>
</template>

<script>
import BaseList from '@/components/core/BaseList.vue'
import ApiGet from '@/components/core/ApiGet.vue'

export default {
  components: {
    BaseList,
    ApiGet
  },

  props: {
    itemkey: String, // BaseList
    value: [String, Function], // BaseList
    label: [String, Function], // BaseList
    apiUrl: String // ApiGet
  },

  data () {
    return {
      items: [] // BaseList ApiGet
    }
  },

  methods: {
    reload () {
      this.$refs.apiget.reload()
    }
  }
}
</script>
