<template>
  <div>
    <v-textarea v-model="cikk.cikkszam" label="Cikkszám" rows="1" auto-grow readonly/>
    <v-textarea v-model="cikk.osztaly" label="Osztály" rows="1" auto-grow readonly/>
    <v-textarea v-model="cikk.meret" label="Méret" rows="1" auto-grow readonly/>
    <v-textarea v-model="cikk.szin" label="Szín" rows="1" auto-grow readonly/>
    <v-textarea v-model="cikk.megnevezes" label="Megnevezés" rows="1" auto-grow readonly/>
    <v-textarea v-model="cikk.name" label="Cikkazonosító" rows="1" auto-grow readonly/>
  </div>
</template>

<script>
export default {
  props: {
    cikk: Object
  },

  computed: {
  }
}
</script>
