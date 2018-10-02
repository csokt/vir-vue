<template>
  <v-container>
    <v-layout justify-space-around>
      <Card v-if="user.id" :title="'Üdvözlöm ' + user.name + '!'">
        <v-card-text>
          <v-text-field v-model="user.main_role" label="Szerepkör" readonly />
        </v-card-text>
      </Card>
      <Card v-if="!user.id" title="Kérem jelentkezzen be!">
      </Card>
    </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'
import Card from '@/components/base/Card.vue'

export default {
  name: 'home',
  components: {
    Card
  },

  data () {
    return {
    }
  },

  computed: get(['user']),

  created () {
    this.$store.set('title', 'Tárgyi eszközök')
  }
}
</script>
