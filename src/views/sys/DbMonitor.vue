<template>
  <iframe ref="druidIframe" :src="iframeUrl" style="width: 100%; height: 600px;"></iframe>
</template>

<script>
export default {
  name: "DbMonitor",
  data () {
    return {
      iframeUrl:"http://localhost:8080/druid"
    }
  },
}
</script>

<style scoped>

</style>