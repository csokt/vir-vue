<template>
  <Transition name="fade">
    <div
      v-if="value"
      @click.self="close"
      class="fixed inset-0 w-full h-screen flex items-center justify-center bg-smoke-400"
    >
      <div
        class="relative max-h-screen w-full max-w-xs md:max-w-md bg-white shadow-lg rounded p-0 flex flex-col"
      >
        <button
          v-if="!hideCloseButton"
          @click.prevent="close"
          aria-label="close"
          class="absolute top-0 right-0 text-xl text-gray-700 font-bold my-2 mx-4"
        >
          ×
        </button>
        <div v-if="header" v-text="header" class="px-4 py-2 text-xl border-b" />
        <div class="overflow-auto max-h-screen w-full">
          <slot />
        </div>
        <div v-if="hasFooterSlot" class="px-4 py-2 border-t">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
      default: null
    },
    hideCloseButton: {
      type: Boolean,
      default: false
    },
    value: {
      required: true,
      type: Boolean
    }
  },
  computed: {
    hasFooterSlot() {
      return !!this.$slots.footer
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
