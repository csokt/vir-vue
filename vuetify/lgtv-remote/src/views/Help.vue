<template>
  <v-container fluid fill-height grid-list-lg>
    <v-layout  justify-center wrap>
      <v-flex xs12 sm8 md5>
        <v-textarea solo auto-grow readonly rows="1"
          value="Ide jön a használati útmutató, ha szükséges"
        ></v-textarea>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'help'
}
</script>
