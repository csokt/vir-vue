<template>
  <button
    v-on="$listeners"
    :class="computedClasses"
    :disabled="disabled"
    type="button"
    class="text-white font-bold py-2 px-4 rounded tracking-wider my-1 focus:outline-none focus:shadow-outline"
  >
    <span class="whitespace-no-wrap">
      {{ value }}
      <slot name="icon"></slot>
    </span>
  </button>
</template>

<script>
export default {
  props: {
    value: { type: String, required: true },
    color: { type: String, default: 'primary' },
    disabled: { type: Boolean, default: false }
  },

  computed: {
    computedClasses() {
      return {
        'bg-blue-600 hover:bg-blue-700': ['blue', 'primary'].includes(
          this.color
        ),
        'bg-indigo-600 hover:bg-indigo-700': ['indigo', 'info'].includes(
          this.color
        ),
        'bg-green-600 hover:bg-green-700': ['green', 'success'].includes(
          this.color
        ),
        'bg-orange-500 hover:bg-orange-600': ['orange', 'warning'].includes(
          this.color
        ),
        'bg-red-600 hover:bg-red-700': ['red', 'error'].includes(this.color),
        'opacity-25 cursor-not-allowed': this.disabled
      }
    }
  }
}
</script>
