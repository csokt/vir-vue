<template>
  <div>
    <v-textarea v-model="eszkoznev" label="Eszköz" rows="1" auto-grow readonly/>
    <v-textarea v-model="honnan" label="Honnan" rows="1" auto-grow readonly/>
    <v-textarea v-model="hova" label="Hova" rows="1" auto-grow readonly/>
    <v-textarea v-model="felvetel" label="Felvétel ideje" rows="1" auto-grow readonly/>
    <v-textarea v-if="mozgas.megjegyzes" v-model="mozgas.megjegyzes" label="Megjegyzés" rows="1" auto-grow readonly/>
    <v-checkbox v-model="mozgas.megerkezett" label="Megérkezett?" rows="1" auto-grow readonly/>
  </div>
</template>

<script>

export default {
  props: {
    mozgas: Object
  },

  computed: {
    eszkoznev () {
      return this.mozgas.id && this.mozgas.eszkoz_id[1]
    },
    honnan () {
      return this.mozgas.id && this.mozgas.honnan_leltarkorzet_id[1]
    },
    hova () {
      return this.mozgas.id && this.mozgas.hova_leltarkorzet_id[1]
    },
    felvetel () {
      return this.mozgas.id && this.utc2local(this.mozgas.create_date)
    }
  },

  methods: {
    utc2local (utc) {
      return new Date(utc.replace(/ /, 'T') + 'Z').toLocaleString()
    }
  }
}
</script>
