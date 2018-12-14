<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <BaseCard title="Választható eszközök">
        <v-card-text>
          <SmartList
            ref="eszkozok"
            :apiUrl="apiUrl"
            :value="model"
            :label="label"
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
import SmartList from '@/components/base/SmartList.vue'

export default {
  name: 'targyi-eszkoz-erkeztetes',
  components: {
    BaseCard,
    BaseMozgasInfo,
    SmartList
  },

  props: {
    sztorno: Boolean
  },

  data () {
    return {
      mozgas: {}
    }
  },

  computed: {
    apiUrl () {
      const params = { domain: [['megerkezett', '=', false]], limit: 100 }
      return 'vir/searchRead/leltar.eszkozmozgas?params=' + JSON.stringify(params)
    },

    toY () {
      if (this.$vuetify.breakpoint.xs) return this.$vuetify.breakpoint.height
      return 0
    }
  },

  methods: {
    model (item) {
      return item.eszkoz_id[1]
    },

    label (item) {
      return item.hova_leltarkorzet_id[1]
    },

    async erkeztet () {
      const row = { megerkezett: true }
      const response = await API.post('vir/update/leltar.eszkozmozgas/' + this.mozgas.id.toString(), row)
      if (!checkResponse(response)) return
      this.mozgas.megerkezett = true
      this.$refs.eszkozok.reload()
      // EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Megérkezett!' })
    },

    async sztornoz () {
      const params = { id: this.mozgas.id }
      const response = await API.post('vir/callMethod/leltar.eszkozmozgas/sztorno', params)
      if (!checkResponse(response)) return
      this.mozgas.megerkezett = true
      this.$refs.eszkozok.reload()
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
  }
}
</script>
