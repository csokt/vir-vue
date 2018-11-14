<template>
  <div>
    <v-textarea v-if="leltarfelelos" v-model="leltarfelelos" label="Leltárfelelős" rows="1" auto-grow readonly />
    <v-checkbox v-model="leltarkorzet.zarolva" label="Zárolva?" readonly/>
    <v-checkbox v-model="leltarkorzet.leltarozni" label="Leltározni?" readonly/>
  </div>
</template>

<script>
export default {
  props: {
    leltarkorzet: Object
  },

  computed: {
    leltarfelelos () {
      return this.leltarkorzet.id && this.leltarkorzet.leltarfelelos_id[1]
    }
  }
}
</script>
