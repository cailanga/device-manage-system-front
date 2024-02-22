<template>
    <el-form :model="loginForm" :rules="rules2" ref="loginForm" label-position="left" label-width="0px"
             class="demo-ruleForm login-container">
        <h3 class="title">系统登录</h3>
        <el-form-item prop="username">
            <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" auto-complete="off"
                      placeholder="密码"></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">
                登录
            </el-button>
            <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
        </el-form-item>
    </el-form>
</template>

<script>
// import { requestLogin } from '../api/api';
//import NProgress from 'nprogress'
import {registerPermissionDirective } from '../main.js'
export default {
    data() {
        return {
            logining: false,
            loginForm: {
                username: '',
                password: ''
            },
            rules2: {
                username: [
                    {required: true, message: '请输入账号', trigger: 'blur'},
                    //{ validator: validaePass }
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    //{ validator: validaePass2 }
                ]
            },
            checked: true
        };
    },
    methods: {
        handleReset2() {
            this.$refs.loginForm.resetFields();
        },
        handleSubmit2(ev) {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // 加载框显示
                    this.logining = true;
                    this.$http.post("/login",this.loginForm).then(data => {
                        data=data.data;
                        // 加载框隐藏
                        this.logining = false;
                        if (!data.success) {
                            this.$message({
                                message: data.message,
                                type: 'error'
                            });
                        } else {
                            this.$message({
                                message: "登陆成功",
                                type: 'success'
                            });
                            //获取当前用户拥有的权限
                            this.getPermissionsByEmployeeId(data.resultObject.employee.id);
                            localStorage.setItem('loginUser', JSON.stringify(data.resultObject.employee));
                            localStorage.setItem('token', data.resultObject.token);
                            this.$router.push({path: '/'});
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        getPermissionsByEmployeeId(employeeId){
            this.$http.get("/permission/getPermissionsByEmployeeId/"+employeeId)
                .then(data =>{
                    data = data.data;
                    if (data.success){
                        //将当前用户拥有的权限存入localStorage
                        // console.log(data.resultObject)
                        localStorage.setItem("sns",data.resultObject);
                        // let sns = localStorage.getItem("sns").split(",")
                        //动态注册v-permission指令
                        // registerPermissionDirective(data.resultObject);
                        // console.log("sns:",sns)
                    }else{

                    }
                })
                .catch(error=>{

                })
        }
    }
}

</script>

<style lang="scss" scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;

  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>