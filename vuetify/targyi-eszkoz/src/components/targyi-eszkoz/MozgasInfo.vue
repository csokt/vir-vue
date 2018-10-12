<template>
  <div>
    <v-text-field v-model="eszkoznev" label="Eszköz" readonly />
    <v-text-field v-model="honnan" label="Honnan" readonly />
    <v-text-field v-model="hova" label="Hova" readonly />
    <v-text-field v-model="felvetel" label="Felvétel ideje" readonly />
    <v-text-field v-if="mozgas.megjegyzes" v-model="mozgas.megjegyzes" label="Megjegyzés" readonly />
    <v-checkbox v-model="mozgas.megerkezett" label="Megérkezett?" readonly />
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
