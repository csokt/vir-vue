<template>
  <div>
    <v-textarea v-model="eszkoz.name" label="Eszköz" rows="1" auto-grow readonly/>
    <v-textarea v-if="eszkoz.gyartasi_szam" v-model="eszkoz.gyartasi_szam" label="Gyártási szám" rows="1" auto-grow readonly />
    <v-textarea v-if="leltarcsoport" v-model="leltarcsoport" label="Leltárcsoport" rows="1" auto-grow readonly />
    <v-textarea v-if="eszkoz.selejt_ok" v-model="eszkoz.selejt_ok" label="Selejtezni" rows="1" auto-grow readonly />
    <v-textarea v-if="aktHasznalo" v-model="aktHasznalo" label="Aktuális használó" rows="1" auto-grow readonly />
    <v-textarea v-model="aktLeltarkorzet" label="Aktuális leltárkörzet" rows="1" auto-grow readonly />
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
