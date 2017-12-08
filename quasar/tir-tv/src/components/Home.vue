<template>
  <div class="row justify-center">
    <div style="width: 500px; max-width: 95vw;">
      <q-list  separator no-border>
        <q-item>
          <h5>TIR TV </h5>
        </q-item>
        <q-item v-for="view in config.views" :key="view.id" :to="'/table/'+view.id">
          {{view.label}}
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import Config from '../config'

import {
  QList,
  QItem
} from 'quasar'

export default {
  name: 'index',
  components: {
    QList,
    QItem
  },
  data () {
    return {
      config: Config
    }
  }
}
</script>
