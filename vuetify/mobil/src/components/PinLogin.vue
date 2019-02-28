<template>
  <BaseCard title="Képernyőzár PIN kód">
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
  </BaseCard>
</template>

<script>
import { EventBus } from '@/util.js'
import BaseCard from '@/components/core/BaseCard.vue'
import Store from '@/store'
import { checkAuthentication } from '@/mixins.js'

export default {
  name: 'pinLogin',
  components: {
    BaseCard
  },

  data: () => ({
    store: Store,
    counter: 1,
    valid: false,
    pin: '',
    pinRules: [
      v => !!v || 'PIN megadása kötelező'
    ]
  }),

  mixins: [checkAuthentication],

  methods: {
    enter () {
      if (!this.$refs.pinLoginForm.validate()) return
      this.store.pin = this.pin
      if (this.isPinAuthenticated) {
        this.$router.go(-1)
      } else {
        EventBus.$emit('inform', { type: 'alert', variation: 'warning', message: 'PIN hiba' })
        if (this.counter === 3) {
          this.store.user = null
        }
      }
      this.counter += 1
    }
  }
}
</script>
