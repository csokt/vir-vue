<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Mtime v-model="kezdIdo" label="Munkaidő kezdete"/>
        </v-card-text>
      </Card>
    </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'
import { API, EventBus } from '@/util'
import Card from '@/components/base/Card.vue'
import Mtime from '@/components/base/Mtime.vue'

export default {
  name: 'norma',
  components: {
    Card,
    Mtime
  },

  data () {
    return {
      kezdIdo: '05:30',
      aktIdo: new Date(),
      osszesNormaperc: 0
    }
  },

  computed: {
    ...get(['user']),

    elteltPerc: function () {
      return Math.round((this.aktIdo - this.kezdIdo) / 60000)
    },
    teljesitmeny: function () {
      return Math.round(100 * this.osszesNormaperc / this.elteltPerc)
    }
  },

  methods: {
    async doSearch () {
      this.$refs.element.blur()
      this.isLoading = true
      const response = await API.get('tir/seafile/' + this.search + '/' + this.user.tir_role)
      this.isLoading = false
      if (response.ok) {
        this.items = response.data
        if (!this.items.length) {
          this.message = 'Nincs adat!'
          EventBus.$emit('inform', { type: 'alert', variation: 'warning', message: this.message })
          // Log('message', {message: this.message})
        }
      } else {
        this.message = 'Keresési hiba!'
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: this.message })
        // Log('message', {message: this.message})
        console.log(response)
      }
    }
  }
}
</script>
