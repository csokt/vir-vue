<template>
  <v-flex xs12 sm8 md5>
    <v-card :class="elevation">
      <v-card-title v-if="title"> <div class="title grey--text">{{title}}</div> </v-card-title>
      <slot></slot>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'card',
  props: {
    title: String,
    elevation: {
      type: String,
      default: 'elevation-8'
    }
  }
}
</script>
