<template>
  <div class="modal" :class="{ 'is-active': dialog }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <div class="modal-card-title">{{label}}</div>
        <button v-if="!required" class="delete" aria-label="close" @click.stop="onBack"></button>
      </header>
      <section class="modal-card-body">
        <QrcodeStream
          :camera="camera"
          :track="false"
          @decode="onDecode"
        />
      </section>
    </div>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
  components: {
    QrcodeStream
  },

  props: {
    label: String,
    dialog: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    camera () {
      if (!this.dialog) return 'off'
      // if (this.$vuetify.breakpoint.smAndDown) {
      //   return 'rear'
      // }
      // return 'front'
      // return 'rear'
      return 'auto'
    }
  },

  methods: {
    onDecode (content) {
      if (content) this.$emit('input', content)
    },

    onBack () {
      if (!this.required) this.$emit('back')
    }
  }
}
</script>
