<template>
  <Transition name="fade">
    <div
      v-if="value"
      @click.self="close"
      class="fixed inset-0 w-full h-screen flex items-center justify-center bg-smoke-800"
    >
      <div
        class="relative max-h-screen w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 flex"
      >
        <button
          @click.prevent="close"
          aria-label="close"
          class="absolute top-0 right-0 text-xl text-gray-700 font-bold my-2 mx-4"
        >
          ×
        </button>
        <div class="overflow-auto max-h-screen w-full">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      type: Boolean
    }
  },
  watch: {
    value(value) {
      if (value) {
        return document.querySelector('body').classList.add('overflow-hidden')
      }

      document.querySelector('body').classList.remove('overflow-hidden')
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.6s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
