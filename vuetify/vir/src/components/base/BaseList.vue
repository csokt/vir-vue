<template>
  <div>
    <v-textarea
      v-for="item in items"
      :key="item[itemkey]"
      :value="itemvalue(item)"
      :label="itemlabel(item)"
      rows="1"
      auto-grow
      readonly
      @click.stop="$emit('select', item)"
    />
  </div>
</template>

<script>
export default {
  props: {
    items: Array,
    itemkey: {
      type: String,
      default: 'id'
    },
    value: {
      type: [String, Function],
      default: 'value'
    },
    label: {
      type: [String, Function],
      default: 'label'
    }
  },

  data () {
    return {
    }
  },

  methods: {
    itemvalue (item) {
      if (typeof this.value === 'string') {
        return item[this.value]
      } else {
        return this.value(item)
      }
    },

    itemlabel (item) {
      if (typeof this.label === 'string') {
        return item[this.label]
      } else {
        return this.label(item)
      }
    }
  }
}
</script>
