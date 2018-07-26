<template>
  <v-container fluid fill-height grid-list-lg>
    <v-layout  justify-center wrap>
      <v-flex xs12 sm8 md5>
        <v-textarea solo auto-grow readonly rows="1"
          value="A program célja, hogy egy helyen jelentkezhessünk be és indíthassuk el a használni kívánt mobil alkalmazásokat. A főoldalon már csak azokat az applikációkat láthatjuk, amelyekre bejelentkeztünk. A Beállítások oldalon (fogaskerék ikon) vannak a be/kijelentkezésre szolgáló kártyák."
        ></v-textarea>
        <v-textarea box auto-grow readonly rows="1"
          label="Mobil alkalmazások"
          value="Amíg nem jelentkezünk itt be, addig csak ez a kártya látható, és a program más funkciója sem elérhető. A név és jelszó megadásánál a kis/nagybetű eltérőnek számít!"
        ></v-textarea>
        <v-textarea box auto-grow readonly rows="1"
          label="VIR"
          value="Amennyiben van jogosultságunk a VIR rendszerhez, akkor itt tudunk belépni. A kis/nagybetű itt is eltérőnek számít."
        ></v-textarea>
        <v-textarea box auto-grow readonly rows="1"
          label="Képernyőzár PIN kód"
          value="A PIN kód csak számokból állhat, hossza nem korlátozott. Amennyiben rövidebb időre elmegyünk (pl. ebédszünet), akkor a PIN kód beállítása után nem kell a teljes bejelentkezési folyamatot végigvinni, elég csak megadni a PIN kódot, és már folytathatjuk is a munkát."
        ></v-textarea>
        <v-textarea box auto-grow readonly rows="1"
          label="PIN kód törlése"
          value="Üres PIN kód bevitelével a beállított kódot töröljük. Figyelem: Ha nem jelentkezünk ki a programból (Mobil alkalmazások kártya), akkor a következő indításnál automatikusan bejelentkeztet a program!"
        ></v-textarea>
        <v-textarea solo auto-grow readonly rows="1"
          value="A képernyő alján a bejelentkezett felhasználó neve, és a program verziószáma látható."
        ></v-textarea>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Store from '@/store'

export default {
  name: 'help',
  data () {
    return {
      store: Store
    }
  },
  created () {
    this.store.pageTitle = 'Segítség'
  }
}
</script>
