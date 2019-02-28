<template>
  <BaseCard title="Képernyőzár PIN kód">
    <v-card-text>
      <v-form v-model="valid" @submit.prevent="enter" lazy-validation>
        <v-text-field
          v-model="pin"
          type="number"
          prepend-icon="security"
          label="PIN kód"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="enter">Beállítás</v-btn>
    </v-card-actions>
  </BaseCard>
</template>

<script>
import { EventBus } from '@/util.js'
import BaseCard from '@/components/core/BaseCard.vue'
import Store from '@/store'

export default {
  name: 'pinSetup',
  components: {
    BaseCard
  },

  data: () => ({
    store: Store,
    counter: 0,
    valid: false,
    pin: ''
  }),

  methods: {
    enter () {
      localStorage.szefo_pin = this.pin
      this.store.pin = this.pin
      this.pin = ''
      EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'PIN beállítva' })
    }
  }
}
</script>
