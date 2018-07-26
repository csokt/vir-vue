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
import { checkAuthentication } from '@/mixins.js'

export default {
  name: 'pinLogin',
  mixins: [checkAuthentication],
  data: () => ({
    store: Store,
    counter: 1,
    valid: false,
    pin: '',
    pinRules: [
      v => !!v || 'PIN megadása kötelező'
    ]
  }),

  methods: {
    enter () {
      if (!this.$refs.pinLoginForm.validate()) return
      this.store.pin = this.pin
      if (this.isPinAuthenticated) {
        this.$router.go(-1)
      } else {
        EventBus.$emit('inform', {type: 'alert', variation: 'warning', message: 'PIN hiba'})
        if (this.counter === 3) {
          this.store.user = null
        }
      }
      this.counter += 1
    }
  }
}
</script>
