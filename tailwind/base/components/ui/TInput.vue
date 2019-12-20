<template>
  <div class="max-w-sm mt-4">
    <div v-if="label" class="text-xs text-gray-600">
      <label v-if="value || (focused && !readonly)"> {{ label }} </label>
      &nbsp;
    </div>
    <input
      @input="$emit('input', $event.target.value)"
      @focus="focused = true"
      @blur="focused = false"
      :value="value"
      :type="type"
      :placeholder="focused && !readonly ? '' : placeholder || label"
      :readonly="readonly"
      :disabled="disabled"
      :class="computedClasses"
      class="bg-transparent border-b border-gray-700 w-full mb-px text-gray-800 pb-1 focus:outline-none focus:border-b-2 focus:border-blue-400 focus:mb-0"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: { type: String, required: true },
    type: { type: String, default: 'text' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },

  data() {
    return {
      focused: false
    }
  },

  computed: {
    computedClasses() {
      return {
        'opacity-75 cursor-not-allowed': this.disabled
      }
    }
  },

  methods: {
    log(msg) {
      // eslint-disable-next-line
      console.log(msg)
    },

    onInput(event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>
