<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <BaseCard title="Választható eszközök">
        <v-card-text>
          <EszkozMozgas
            filter="erkeztetes"
            :reloadTrigger="reloadTrigger"
            @select="onSelect($event)"
          />
        </v-card-text>
      </BaseCard>
      <BaseCard>
        <v-card-text>
          <BaseMozgasInfo :mozgas="mozgas"/>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="!sztorno"
            color="primary"
            :disabled="mozgas.megerkezett"
            @click="erkeztet"
          >
            Érkeztetés
          </v-btn>
          <v-btn
            v-if="sztorno"
            color="primary"
            :disabled="mozgas.megerkezett"
            @click="sztornoz"
          >
            Sztornózás
          </v-btn>
        </v-card-actions>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import { API, checkResponse } from '@/util'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseMozgasInfo from '@/components/targyi-eszkoz/BaseMozgasInfo.vue'
import EszkozMozgas from '@/components/targyi-eszkoz/EszkozMozgas.vue'

export default {
  name: 'targyi-eszkoz-erkeztetes',
  components: {
    BaseCard,
    BaseMozgasInfo,
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
      if (!checkResponse(response)) return
      this.mozgas.megerkezett = true
      this.reloadTrigger = !this.reloadTrigger
      // EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Megérkezett!' })
    },

    async sztornoz () {
      const params = { id: this.mozgas.id }
      const response = await API.post('vir/callMethod/leltar.eszkozmozgas/sztorno', params)
      if (!checkResponse(response)) return
      this.mozgas.megerkezett = true
      this.reloadTrigger = !this.reloadTrigger
      // EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Megérkezett!' })
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
