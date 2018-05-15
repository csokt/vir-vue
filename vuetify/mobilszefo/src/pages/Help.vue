<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-card-text>
            Ide kerül a leírás.
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Store from '../store'

export default {
  name: 'help',

  data: () => ({
    store: Store
  }),

  created () {
    this.store.pageTitle = 'Segítség'
    this.store.rootPage = false
  }
}
</script>
