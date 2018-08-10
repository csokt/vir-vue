<template>
  <div class="row justify-center">
    <title>TV App</title>
    <div style="width: 500px; max-width: 95vw;">

      <h5 class="text-center">Termelés Információs Rendszer TV</h5>
      <q-list separator>

        <q-collapsible group="szefo" label="Lejátszási listák">
          <q-item v-for="list in store.playlists" :key="list.id" :to="'/playlist/'+list.id">
            {{list.label}}
          </q-item>
        </q-collapsible>

        <q-collapsible group="szefo" label="Táblázatok">
          <q-item v-for="view in store.views" :key="view.id" :to="'/table/'+view.id">
            {{view.label}}
          </q-item>
        </q-collapsible>

      </q-list>

    </div>
  </div>
</template>

<script>
import Store from '../store'

import {
  QList,
  QItem,
  QCollapsible
} from 'quasar'

export default {
  name: 'home',
  components: {
    QList,
    QItem,
    QCollapsible
  },
  data () {
    return {
      store: Store
    }
  }
}
</script>

<style lang="stylus">
.q-item-label
  font-size 1.5rem
.q-item-link
  font-size 1.3rem
</style>
