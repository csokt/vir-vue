<template>
  <div class="max-w-sm mt-4">
    <div v-if="label" class="text-xs text-gray-600">
      <label v-if="value || (focused && !readonly)"> {{ label }} </label>
      &nbsp;
    </div>
    <input
      @input="$emit('input', $event.target.value)"
      @change="$emit('change', $event.target.value)"
      @focus="onFocus"
      @blur="onBlur"
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
import htmlInput from '@/mixins/htmlInput.js'

export default {
  mixins: [htmlInput],

  props: {
    // value: { type: String, required: true },
    // type: {
    //   type: String,
    //   default: 'text',
    //   validator(value) {
    //     return ['number', 'password', 'search', 'text'].includes(value)
    //   }
    // },
    // label: { type: String, default: '' },
    // placeholder: { type: String, default: '' },
    // readonly: { type: Boolean, default: false },
    // disabled: { type: Boolean, default: false }
  },

  data() {
    return {}
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
