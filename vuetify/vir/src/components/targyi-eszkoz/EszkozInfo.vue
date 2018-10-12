<template>
  <div>
    <v-text-field v-model="eszkoz.name" label="Eszköz" readonly />
    <v-text-field v-if="eszkoz.gyartasi_szam" v-model="eszkoz.gyartasi_szam" label="Gyártási szám" readonly />
    <v-text-field v-if="leltarcsoport" v-model="leltarcsoport" label="Leltárcsoport" readonly />
    <v-text-field v-if="eszkoz.selejt_ok" v-model="eszkoz.selejt_ok" label="Selejtezni" readonly />
    <v-text-field v-if="aktHasznalo" v-model="aktHasznalo" label="Aktuális használó" readonly />
    <v-text-field v-model="aktLeltarkorzet" label="Aktuális leltárkörzet" readonly />
  </div>
</template>

<script>

export default {
  props: {
    eszkoz: Object
  },

  computed: {
    leltarcsoport () {
      return this.eszkoz.id && this.eszkoz.leltarcsoport_id[1]
    },
    aktLeltarkorzet () {
      return this.eszkoz.id && this.eszkoz.akt_leltarkorzet_id[1]
    },
    aktHasznalo () {
      return this.eszkoz.id && this.eszkoz.akt_hasznalo_id[1]
    }
  }
}
</script>
