<template>
  <div>
    <ApiGet
      v-model="items"
      :reloadTrigger="reloadTrigger"
      :apiUrl="apiUrl"
      expect="array"
    />
    <BaseList
      :items="items"
      :itemkey="itemkey"
      :value="value"
      :label="label"
      @select="$emit('select', $event)"
    />
</div>
</template>

<script>
import BaseList from '@/components/base/BaseList.vue'
import ApiGet from '@/components/base/ApiGet.vue'

export default {
  components: {
    BaseList,
    ApiGet
  },

  props: {
    reloadTrigger: Boolean,
    apiUrl: String,

    itemkey: String,
    value: [String, Function],
    label: [String, Function]
  },

  data () {
    return {
      items: []
    }
  }
}
</script>
