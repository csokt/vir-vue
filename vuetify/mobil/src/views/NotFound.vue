<template>
  <v-container fluid fill-height grid-list-lg>
    <v-layout  justify-center wrap>
      <v-flex xs12 sm8 md5>
        <v-textarea solo auto-grow readonly rows="1"
          value="A keresett oldal nem található"
        ></v-textarea>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Store from '@/store'

export default {
  name: 'help',
  data () {
    return {
      store: Store
    }
  },
  created () {
    this.store.pageTitle = 'Nem található'
  }
}
</script>
