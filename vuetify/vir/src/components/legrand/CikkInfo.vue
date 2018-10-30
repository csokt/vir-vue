<template>
  <div>
    <v-textarea v-model="cikk.cikknev" label="Cikknév" rows="1" auto-grow readonly/>
    <v-textarea v-model="cikk.bekerulesi_ar" label="Bekerülési ár" rows="1" auto-grow readonly/>
  </div>
</template>

<script>
export default {
  props: {
    cikk: Object
  }
}
</script>
