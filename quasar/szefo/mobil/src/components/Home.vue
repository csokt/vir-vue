<template>
  <div class="row justify-center">
    <div style="width: 350px; max-width: 95vw;">

      <h5 class="text-center">SZEFO mobil alkalmazások</h5>
      <q-list separator>
        <q-collapsible group="szefo" image="/statics/dama.png" label="Dama">
          <q-item link @click="location.href = 'https://tir.szefo.local'">
            <q-item-side avatar="/statics/dama.png" />
            <q-item-main label="Termelés Információs Rendszer" />
          </q-item>
        </q-collapsible>

        <q-collapsible group="szefo" image="/statics/legrand.png" label="Legrand">
          <q-item link @click="location.href = 'https://lir-keszlet.szefo.local'">
            <q-item-side avatar="/statics/lir-keszlet.png" />
            <q-item-main label="Készlet információk" />
          </q-item>
          <q-item link @click="location.href = 'https://lir-kodol.szefo.local'">
            <q-item-side avatar="/statics/lir-kodol.png" />
            <q-item-main label="Művelet kódolás" />
          </q-item>
        </q-collapsible>

        <q-collapsible group="szefo" image="/statics/chance.png" label="Chance">
          <q-item link @click="location.href = 'https://chance-keszlet.szefo.local'">
            <q-item-side avatar="/statics/chance.png" />
            <q-item-main label="Készlet információk" />
          </q-item>
        </q-collapsible>

        <q-collapsible group="szefo" image="/statics/eszkozinfo.png" label="Tárgyi eszköz">
          <q-item link @click="location.href = 'https://eszkozinfo.szefo.local'">
            <q-item-side avatar="/statics/eszkozinfo.png" />
            <q-item-main label="Eszköz információk (QR)" />
          </q-item>
          <q-item separator link @click="location.href = 'https://eszkozmozgatas.szefo.local'">
            <q-item-side avatar="/statics/eszkozmozgatas.png" />
            <q-item-main label="Eszköz mozgatás" />
          </q-item>
        </q-collapsible>
      </q-list>

    </div>
  </div>
</template>

<script>
import {
  QList,
  QItem,
  QItemMain,
  QItemSide,
  QCollapsible
} from 'quasar'

export default {
  components: {
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QCollapsible
  },
  data () {
    return {
      location: window.location
    }
  }
}
</script>

<style lang="stylus">
.q-item-image
  min-width unset
  width 50px
  height 50px

.q-item-avatar
  border-radius unset
  width 40px
  height 40px

.q-list
  padding unset

.q-item-label
  font-size 1.2rem
  </style>
