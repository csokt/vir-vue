<template>
  <div id="app">
    <header>
      <div class="table menusor">
        <img src="/static/img/icons/apple-touch-icon-60x60.png">
        <span class="td headerfont">SZEFO mobil appok</span>
      </div>
    </header>
    <main>
      <hr>
      <div class="table menusor">
        <img src="/static/img/icons/eszkozinfo.png">
        <span class="td menufont" onclick="location.href='https://tir.szefo.local'">Termelés Információs Rendszer</span>
      </div>
      <hr>
      <div class="table menusor">
        <img src="/static/img/icons/eszkozinfo.png">
        <span class="td menufont" onclick="location.href='https://lir-kodol.szefo.local'">Legrand művelet kódolás</span>
      </div>
      <hr>
      <div class="table menusor">
        <img src="/static/img/icons/eszkozinfo.png">
        <span class="td menufont" onclick="location.href='https://eszkozinfo.szefo.local'">Tárgyi eszköz információk (QR)</span>
      </div>
      <hr>
    </main>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style>
#app {
  margin: 1em;
}
.headerfont {
  vertical-align: middle;
  color:blue;
  font-size: 200%;
}
.menufont {
  vertical-align: middle;
  font-size: 150%;
}
.menusor {
  height: 60px;
}
.table {
  display: table;
}
.tr{
  display: table-row;
}
.td{
  display: table-cell;
}
img {
  margin-right: 1em;
}
</style>
