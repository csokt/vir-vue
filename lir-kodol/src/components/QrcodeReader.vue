<template>
  <div class="box">
    <div class="is-size-3"> {{ head }} </div>
    <button v-if="cameraCount > 1" @click="activeCamera += 1" type="button" class="button is-info is-large is-fullwidth">Váltás az előlapi és hátlapi kamera között</button>
    <video class="camera" ref="preview"></video>
    <div class="control">
      <input class="input is-large" type="number" @keyup.enter="submit" v-model="input" placeholder="Kézi adatbevitel"/>
    </div>
    <div class="is-size-4 has-text-danger">{{message}}</div>
  </div>

</template>

<script>
import Instascan from 'instascan-ngfar'
// import Instascan from 'instascan'

export default {
  props: {
    head: {
      type: String,
      default: 'head'
    },

    message: {
      type: String,
      default: ''
    },

    // Whether to horizontally mirror the video preview.
    mirror: {
      type: Boolean,
      default: true
    },

    // Whether to actively scan when the tab is not active.
    backgroundScan: {
      type: Boolean,
      default: true
    },

    // The period, in milliseconds, before the same QR code will be recognized in succession.
    refractoryPeriod: {
      type: Number,
      default: 5000
    },

    // Only applies to continuous mode. The period, in rendered frames, between scans.
    scanPeriod: {
      type: Number,
      default: 10
    },

    // Default camera index, begins with 0.
    defaultCamera: {
      type: Number,
      default: 0
    }

  },

  data () {
    return {
      input: '',
      cameras: [],
      cameraCount: 0,
      activeCamera: -1
    }
  },

  watch: {
    activeCamera (newValue) {
      if (this.cameraCount === 0) {
        console.error('No cameras found.')
      } else if (newValue < this.cameraCount) {
        let camera = this.cameras[newValue]
        this.scanner.start(camera)
      } else {
        this.activeCamera = 0
      }
    }
  },

  mounted () {
    let self = this
    let opts = { video: self.$refs.preview, mirror: self.mirror, backgroundScan: self.backgroundScan, refractoryPeriod: self.refractoryPeriod, scanPeriod: self.scanPeriod }
    self.scanner = new Instascan.Scanner(opts)

    self.scanner.addListener('scan', function (content) {
      self.input = content
      self.$emit('capture', content)
    })

    Instascan.Camera.getCameras().then(function (cameras) {
      self.cameras = cameras
      self.cameraCount = cameras.length
      self.activeCamera = self.defaultCamera
    }).catch(function (e) {
      console.error(e)
    })
  },

  beforeDestroy: function () {
    this.scanner.stop()
  },

  methods: {
    submit () {
      if (this.input) {
        this.$emit('capture', this.input)
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

</style>
