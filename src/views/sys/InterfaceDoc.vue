<template>
  <div>
    <h2>Swagger接口文档信息</h2>
    <iframe ref="swaggerIframe" :src="iframeUrl" style="width: 100%; height: 600px;"></iframe>
  </div>
</template>

<script>
export default {
  name: "InterfaceDoc",
  data () {
    return {
      iframeUrl:""
    }
  },
  mounted() {
    const token = localStorage.getItem('token'); // 从本地存储中获取token
    const loginUser = localStorage.getItem('loginUser'); // 从本地存储中获取loginUser
    // http://localhost:8080/swagger-ui/
    const swaggerUrl = 'http://localhost:8080/swagger-ui.html';

    // 拼接URL参数
    const params = new URLSearchParams();
    params.append('token', token);
    params.append('loginUser', loginUser);

    this.iframeUrl = `${swaggerUrl}?${params}`;
    // 监听iframe加载完成事件
    this.$refs.swaggerIframe.addEventListener('load', () => {
      // 在iframe加载完成后可以进行一些操作，比如向iframe发送消息
      this.$refs.swaggerIframe.contentWindow.postMessage({ token, loginUser }, '*');
    });
  }
}
</script>

<style scoped>

</style>