<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                {{ collapsed ? '' : sysName }}
            </el-col>
            <el-col :span="10">
                <div class="tools" @click.prevent="collapse">
                    <i class="fa fa-align-justify"></i>
                </div>
            </el-col>
            <el-col :span="4" class="userinfo">
                <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner">
<!--                      <img :src="this.sysUserAvatar"
                                                                       alt="avatar"/>-->
                      {{ sysUserName }}</span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item  @click.native="showPersonalInfo">个人信息</el-dropdown-item>
                      <el-dropdown-item  @click.native="updatePwd">修改密码</el-dropdown-item>
<!--                        <el-dropdown-item>设置</el-dropdown-item>-->
                        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <aside :class="collapsed?'menu-collapsed':'menu-expanded'" style="overflow-y: auto;">
                <!--导航菜单-->
<!--                				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
                           unique-opened router v-show="!collapsed">
                          <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
                            <el-submenu :index="index+''" v-if="!item.leaf">
                              <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                              <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
                          </template>
                        </el-menu>-->
                <!--导航菜单-折叠后-->
                <!--				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
                          <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
                            <template v-if="!item.leaf">
                              <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
                              <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                                <li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
                              </ul>
                            </template>
                            <template v-else>
                              <li class="el-submenu">
                                <div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
                              </li>
                            </template>
                          </li>
                        </ul>-->
                <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen"
                         @close="handleclose" @select="handleselect"
                         unique-opened router v-show="!collapsed">
                    <el-menu-item index="/index" key="/index"><i class="fa fa-bar-chart"></i>首页</el-menu-item>
                    <template v-for="(item,index) in menuTree">
                        <el-submenu :index="index+''">
                            <template slot="title"><i :class="item.icon"></i>{{ item.name }}</template>
                            <el-menu-item v-for="child in item.children" :index="child.url" :key="child.url"
                                          v-if="!child.hidden">{{ child.name }}
                            </el-menu-item>
                        </el-submenu>
                    </template>
                </el-menu>
            </aside>
            <section class="content-container">
                <div class="grid-content bg-purple-light">
                    <el-col :span="24" class="breadcrumb-container">
                        <strong class="title">{{ $route.name }}</strong>
                        <el-breadcrumb separator="/" class="breadcrumb-inner">
                            <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                                {{ item.name }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <el-col :span="24" class="content-wrapper">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </el-col>
                </div>
            </section>
        </el-col>
      <!--新增界面-->
      <el-dialog title="个人信息" :visible.sync="saveFormVisible" :close-on-click-modal="false">
        <el-form :model="saveForm" label-width="80px" :rules="saveFormRulesPersonInfo" ref="saveFormPersonInfo">
          <el-form-item label="用户名" prop="username" :error="usernameError">
            <el-input v-model="saveForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input show-password type="password" v-model="saveForm.password" auto-complete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" :error="emailError">
            <el-input type="email" v-model="saveForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input-number v-model="saveForm.age" :min="0" :max="200"></el-input-number>
          </el-form-item>
          <el-form-item label="部门名称">
            <el-input v-model="saveForm.department.name" disabled></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="cancelSaveSubmit">取消</el-button>
          <el-button type="primary" @click.native="saveSubmit" :loading="saveLoading">提交</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改密码" :visible.sync="updatePwdShow">
        <el-form :model="updPwdObj" ref="updPwdForm">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input type="password" v-model="updPwdObj.oldPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" v-model="updPwdObj.newPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input type="password" v-model="updPwdObj.confirmPassword" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updatePwdShow = false">取 消</el-button>
          <el-button type="primary" @click="submitUpdatePassword">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
</template>

<script>
import axios from "axios";
import {createPermission} from "../main";

export default {
    data() {
        return {
          usernameError: '',
          emailError: '',
          saveFormRulesPersonInfo:[
            {
              username: [
                {required: true, message: '请输入用户名', trigger: ['blur', 'change']}
              ],
              email: [
                { required: true, message: '请输入邮箱地址', trigger: ['blur', 'change'] },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
              ]
            }
          ],
            sysName: '物资设备管理系统',
            collapsed: false,
            sysUserName: '',
            sysUserAvatar: '',
          saveLoading:false,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            menuTree: [],
          saveFormVisible:false,
          saveForm:{
            age: 34,
            departmentId: 1,
            department:{
              name: '',
            },
            email:"",
            id:null,
            password:"",
            username:""
        },
          updatePwdShow:false,
          updPwdObj: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
          }
      }
    },
    methods: {
      updatePwd(){
        this.updatePwdShow = true;
      },
      submitUpdatePassword() {
        if (!this.updPwdObj.oldPassword) {
          this.$message.error('请输入旧密码');
          return;
        }
        if (!this.updPwdObj.newPassword || this.updPwdObj.newPassword.length < 6) {
          this.$message.error('新密码长度不能少于6位');
          return;
        }
        if (this.updPwdObj.newPassword !== this.updPwdObj.confirmPassword) {
          this.$message.error('两次输入的新密码不一致');
          return;
        }
        // 如果所有校验通过，则进行密码更新操作
        // ... 这里调用更新密码的API
        var user = localStorage.getItem('loginUser');
        if (user) {
          user = JSON.parse(user);
          if (user.id!=null&&user.id!="") {
            this.$http.get("/employee/"+user.id).then((data) => {
              this.saveLoading = false;
              console.log(data)
              this.saveForm = data.data.resultObject
              if (this.saveForm.password != this.updPwdObj.oldPassword){
                //说明旧密码验证错误
                this.$message({
                  message: '旧密码错误！',
                  type: 'error'
                });
                return
              }
              this.saveForm.password=this.updPwdObj.newPassword;
              this.$http.put("/employee", this.saveForm).then((data) => {
                this.saveLoading = false;
                data = data.data
                if (data.success) {
                  this.$message.success('密码修改成功');
                  this.updatePwdShow = false;
                  // 可能需要重置表单
                  this.resetForm();
                } else {
                  this.$message({
                    message: '操作失败',
                    type: 'error'
                  });
                }
              });
            }).catch(data => {
              this.$message({
                message: '网络错误！',
                type: 'error'
              });
            })
          }else{
            this.$message({
              message: '登录失效，请重新登录！',
              type: 'error'
            });
            this.logout();
          }
        }

      },
      resetForm() {
        this.$refs.updPwdForm.resetFields();
        this.updPwdObj = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      },
      validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      },
      showPersonalInfo(){
        var user = localStorage.getItem('loginUser');
        if (user) {
          user = JSON.parse(user);
          if (user.id!=null&&user.id!="") {
            this.$http.get("/employee/"+user.id).then((data) => {
              this.saveLoading = false;
              console.log(data)
              this.saveForm = data.data.resultObject
              this.saveFormVisible = true
            }).catch(data => {
                  this.$message({
                    message: '网络错误！',
                    type: 'error'
                  });
                })
          }else{
            this.$message({
              message: '登录失效，请重新登录！',
              type: 'error'
            });
            this.logout();
          }
        }
      },
      cancelSaveSubmit() {
        this.saveFormVisible = false
      },
      //新增
      saveSubmit: function () {
        //对表单数据进行校验
        this.$refs.saveFormPersonInfo.validate((valid) => {
          if (valid) {
            this.usernameError = '';
            this.emailError = '';

            // Validate username
            if (!this.saveForm.username) {
              this.usernameError = '请输入用户名';
            } else if (this.saveForm.username.length < 3 || this.saveForm.username.length > 15) {
              this.usernameError = '用户名长度在 3 到 15 个字符';
            }

            // Validate email
            if (!this.saveForm.email) {
              this.emailError = '请输入邮箱地址';
            } else if (!this.validateEmail(this.saveForm.email)) {
              this.emailError = '请输入正确的邮箱地址';
            }

            if (this.usernameError || this.emailError) {
              return false; // If there are errors, return and do not submit.
            }
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.saveLoading = true;
              this.$http.put("/employee", this.saveForm).then((data) => {
                this.saveLoading = false;
                data = data.data
                if (data.success) {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  });
                  this.saveFormVisible = false;
                } else {
                  this.$message({
                    message: '操作失败',
                    type: 'error'
                  });
                }
              });
            });
          }
        });
      },
        getMenuTree(employeeId) {
            this.$http.get("/menu/getMenuTree/" + employeeId)
                .then(data => {
                    data = data.data
                    if (data.success) {
                        this.menuTree = data.resultObject
                    } else {
                        this.$message({
                            message: data.message,
                            type: 'error'
                        });
                    }
                })
        },
        onSubmit() {
            console.log('submit!');
        },
        handleopen() {
            //console.log('handleopen');
        },
        handleclose() {
            //console.log('handleclose');
        },
        handleselect: function (a, b) {
        },
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
        //折叠导航栏
        collapse: function () {
            this.collapsed = !this.collapsed;
        },
        showMenu(i, status) {
            this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
        }
    },
    mounted() {
        var user = localStorage.getItem('loginUser');
        if (user) {
            user = JSON.parse(user);
            this.sysUserName = user.username || '';
            this.sysUserAvatar = user.headImage || '';
        }
        //获取菜单树
        this.getMenuTree(user.id);
    },
    beforeCreate() {
        //创建指令
        createPermission();
    }
}

</script>

<style scoped lang="scss">
@import '@/styles/vars.scss';

.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;

  .header {
    height: 60px;
    line-height: 60px;
    background: $color-primary;
    color: #fff;

    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;

      .userinfo-inner {
        cursor: pointer;
        color: #fff;

        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0px 10px 10px;
          float: right;
        }
      }
    }

    .logo {
      //width:230px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;

      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }

      .txt {
        color: #fff;
      }
    }

    .logo-width {
      width: 230px;
    }

    .logo-collapse-width {
      width: 60px
    }

    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }

  .main {
    display: flex;
    // background: #324057;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;

    aside {
      flex: 0 0 230px;
      width: 230px;
      // position: absolute;
      // top: 0px;
      // bottom: 0px;
      .el-menu {
        height: 100%;
      }

      .collapsed {
        width: 60px;

        .item {
          position: relative;
        }

        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }

      }
    }

    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }

    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }

    .content-container {
      // background: #f1f2f7;
      flex: 1;
      // position: absolute;
      // right: 0px;
      // top: 0px;
      // bottom: 0px;
      // left: 230px;
      overflow-y: scroll;
      padding: 20px;

      .breadcrumb-container {
        //margin-bottom: 15px;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }

        .breadcrumb-inner {
          float: right;
        }
      }

      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
</style>