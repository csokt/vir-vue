<template>
  <div class="max-w-sm mt-4">
    <label :class="computedClasses" class="mt-4">
      <input
        @change="$emit('input', $event.target.checked)"
        :checked="value"
        :disabled="readonly || disabled"
        :class="computedClasses"
        class="mr-2 leading-tight"
        type="checkbox"
      />
      <span class="text-gray-800">{{ label }} </span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: Boolean, required: true },
    label: { type: String, required: true },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },

  computed: {
    computedClasses() {
      return {
        'opacity-75 cursor-not-allowed': this.disabled
      }
    }
  }
}
</script>
