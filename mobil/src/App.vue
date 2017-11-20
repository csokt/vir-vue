<template>
  <div id="app">
    <menusor img="/static/img/icons/mobil.png"        name="SZEFO mobil alkalmazások">                                                    </menusor>
    <menusor img="/static/img/icons/tir.png"          name="Termelés Információs Rendszer"    location="https://tir.szefo.local">         </menusor>
    <menusor img="/static/img/icons/lir-kodol.png"    name="Legrand művelet kódolás"          location="https://lir-kodol.szefo.local">   </menusor>
    <menusor img="/static/img/icons/eszkozinfo.png"   name="Tárgyi eszköz információk (QR)"   location="https://eszkozinfo.szefo.local">  </menusor>
  </div>
</template>

<script>
import Menusor from './components/Menusor.vue'

export default {
  name: 'app',
  components: {
    'menusor': Menusor
  }
}
</script>

<style>
#app {
  margin: 1em;
}
</style>
