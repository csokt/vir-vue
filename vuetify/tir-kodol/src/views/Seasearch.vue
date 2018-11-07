<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <v-text-field
            ref="element"
            v-model="search"
            label="Cikkszám keresése"
            clearable
            :loading="isLoading"
            @keyup.enter="doSearch"
            append-outer-icon="send"
            @click:append-outer="doSearch"
          />
        </v-card-text>
        <SeaDocs :items="items"/>
      </Card>
    </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'
import { API, EventBus } from '@/util'
import Card from '@/components/base/Card.vue'
import SeaDocs from '@/components/SeaDocs.vue'

export default {
  name: 'seasearch',
  components: {
    Card,
    SeaDocs
  },

  data () {
    return {
      search: '',
      items: [],
      isLoading: false
    }
  },

  computed: get(['user']),

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
