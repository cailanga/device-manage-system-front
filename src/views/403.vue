<template>
    <div>
        <p class="page-container">403 Forbidden</p>
        <div style="width:100px;margin: 0px auto;">
            <el-button @click="logout" type="primary">退出登录</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        //退出登录
        logout: function () {
            this.$confirm('确认退出吗?', '提示', {
                //type: 'warning'
            }).then(() => {
                //发送请求将后台登录信息清除
                this.$http.post("/logout")
                    .then(data => {
                        data = data.data
                        if (data.success) {
                            sessionStorage.removeItem('loginUser');
                            sessionStorage.removeItem('token');
                            this.$message({
                                message: "退出成功",
                                type: 'success'
                            });
                            this.$router.push('/login');
                        } else {
                            this.$message({
                                message: data.message,
                                type: 'error'
                            });
                        }
                    })
            }).catch(() => {
                this.$message({
                    message: '网络错误，请重试！',
                    type: 'error'
                });
            });
        },
    }
}

</script>
<style lang="scss" scoped>
.page-container {
    font-size: 20px;
    text-align: center;
    color: rgb(192, 204, 218);
}
</style>