<template>
  <div>
    <h2>后端接口文档信息</h2>
    <iframe ref="swaggerIframe" :src="iframeUrl" style="width: 100%; height: 600px;"></iframe>
<!--    <div v-html="interfaceContent"></div>-->
  </div>
</template>

<script>
export default {
  name: "InterfaceDoc",
  data () {
    return {
      interfaceContent:"",
      iframeUrl:"http://localhost:8080//doc.html"
    }
  },
  mounted() {
    // this.$http.get("/doc.html")
    //     .then(data => {
    //       this.interfaceContent = data.data
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
  }
}
</script>

<style scoped>

</style>