<template>
  <v-flex xs12 sm8 md5>
    <v-card class="elevation-12">
      <v-card-title> <div class="title grey--text">Képernyőzár PIN kód</div> </v-card-title>
      <v-card-text>
        <v-form ref="pinLoginForm" v-model="valid" @submit.prevent="enter" lazy-validation>
          <v-text-field
            v-model="pin"
            type="number"
            :rules="pinRules"
            prepend-icon="security"
            label="PIN kód"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="enter">Feloldás</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import { EventBus } from '@/util.js'
import Store from '@/store'

export default {
  name: 'pinLogin',
  data: () => ({
    store: Store,
    counter: 0,
    valid: false,
    pin: '',
    pinRules: [
      v => !!v || 'PIN megadása kötelező'
    ]
  }),

  methods: {
    enter () {
      if (!this.$refs.pinLoginForm.validate()) return
      if (this.counter < 3) {
        this.store.pin = this.pin
        EventBus.$emit('inform', {type: 'alert', variation: 'info', message: 'PIN elküldve'})
      } else {
        this.store.user = null
        EventBus.$emit('inform', {type: 'alert', variation: 'warning', message: 'PIN hiba'})
      }
      this.counter += 1
    }
  }
}
</script>
