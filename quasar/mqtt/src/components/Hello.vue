<template>
  <div>
    MQTT
    <button @click="publish1">Publish1</button>
    <button @click="publish2">Publish2</button>
  </div>
</template>

<script>
const cid = Math.random().toString(16).substr(2)

export default {
  name: 'index',
  data () {
    return {
    }
  },
  methods: {
    publish1 () {
      const request = {
        jsonrpc: '2.0',
        method: 'raw',
        params: {
          database: 'SzefoModulKeszlet',
          query: 'select [userid], [fullname] from [users] where [userid] = 20'
        },
        id: cid
      }
      this.$mqtt.publish('mssql/request/tir', JSON.stringify(request))
    },
    publish2 () {
      const request = {
        jsonrpc: '2.0',
        method: 'raw',
        params: {
          database: 'SzefoModulKeszlet',
          query: 'select top 5 [userid], [fullname] from [users]'
        },
        id: cid
      }
      this.$mqtt.publish('mssql/request/tir', JSON.stringify(request))
    }
  },
  mqtt: {
    'mssql/response/tir' (message, topic) {
      const response = JSON.parse(message.toString())
      if (response.id === cid) {
        console.log('response', topic, response)
      }
    }
  },
  mounted () {
    this.$mqtt.subscribe('mssql/response/tir')
  }
}
</script>
