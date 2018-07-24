<template>
  <v-flex xs12 sm8 md5>
    <v-card class="elevation-12">
      <v-card-title> <div class="title grey--text">Képernyőzár PIN kód</div> </v-card-title>
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
    </v-card>
  </v-flex>
</template>

<script>
import { EventBus } from '@/util.js'
import Store from '@/store'

export default {
  name: 'pinSetup',
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
      EventBus.$emit('inform', {type: 'alert', variation: 'success', message: 'PIN beállítva'})
    }
  }
}
</script>
