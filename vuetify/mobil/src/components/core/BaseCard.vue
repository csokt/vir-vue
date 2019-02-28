<template>
  <v-flex xs12 sm8 md5 :class="spacing">
    <v-card :elevation="elevation" tile>
      <v-card-title v-if="title">
        <div class="title grey--text">
          {{title}}
        </div>
      </v-card-title>
      <slot></slot>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  props: {
    title: String,
    spacing: String, // 'pa-0': nincs padding
    elevation: {
      type: Number,
      default: 4
    }
  }
}
</script>
