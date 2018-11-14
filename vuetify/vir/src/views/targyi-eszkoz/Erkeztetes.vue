<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card title="Választható eszközök">
        <v-card-text>
          <EszkozMozgas filter="erkeztetes" :reloadTrigger="reloadTrigger" @select="onSelect($event)"/>
        </v-card-text>
      </Card>
      <Card>
        <v-card-text>
          <MozgasInfo :mozgas="mozgas"/>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="!sztorno" color="primary" :disabled="mozgas.megerkezett" @click="erkeztet">Érkeztetés</v-btn>
          <v-btn v-if="sztorno" color="primary" :disabled="mozgas.megerkezett" @click="sztornoz">Sztornózás</v-btn>
        </v-card-actions>
      </Card>
    </v-layout>
  </v-container>
</template>

<script>
import { API, EventBus } from '@/util'
import Card from '@/components/base/Card.vue'
import EszkozMozgas from '@/components/targyi-eszkoz/EszkozMozgas.vue'
import MozgasInfo from '@/components/targyi-eszkoz/MozgasInfo.vue'

export default {
  name: 'targyi-eszkoz-erkeztetes',
  components: {
    Card,
    MozgasInfo,
    EszkozMozgas
  },

  props: {
    sztorno: Boolean
  },

  data () {
    return {
      reloadTrigger: false,
      mozgas: {}
    }
  },

  computed: {
    toY () {
      if (this.$vuetify.breakpoint.xs) return this.$vuetify.breakpoint.height
      return 0
    }
  },

  methods: {
    async erkeztet () {
      const row = { megerkezett: true }
      const response = await API.post('vir/update/leltar.eszkozmozgas/' + this.mozgas.id.toString(), row)
      if (response.ok) {
        this.mozgas.megerkezett = true
        this.reloadTrigger = !this.reloadTrigger
        // EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Megérkezett!' })
      } else {
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: response.data.error.data.message })
      }
    },

    async sztornoz () {
      const params = { id: this.mozgas.id }
      const response = await API.post('vir/callMethod/leltar.eszkozmozgas/sztorno', params)
      if (response.ok) {
        this.mozgas.megerkezett = true
        this.reloadTrigger = !this.reloadTrigger
        // EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Megérkezett!' })
      } else {
        console.log('response', response)
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: response.data.error.data.message })
      }
    },

    async onSelect (mozgas) {
      this.mozgas = mozgas
      await this.$nextTick()
      const toY = this.$vuetify.breakpoint.smAndDown ? this.$vuetify.breakpoint.height : 0
      window.scrollTo(0, toY)
    }
  },

  created () {
    if (this.sztorno) {
      this.$store.set('pageTitle', 'Tárgyi eszköz sztornózás')
    } else {
      this.$store.set('pageTitle', 'Tárgyi eszköz érkeztetés')
    }
  },

  mounted () {
    this.reloadTrigger = !this.reloadTrigger
  }
}
</script>
