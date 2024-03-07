import babelpolyfill from 'babel-polyfill'
import './assets/common.less'
import Vue from 'vue'
import App from './App'
import ElementUI, {Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

import axios from "axios";
//设置axios基本路径
// axios.defaults.baseURL = "/api"
axios.defaults.baseURL = "http://localhost:8080"
// axios.defaults.baseURL = "http://192.168.1.190:8081"
// axios.defaults.baseURL = "http://47.109.101.54:8081"
Vue.prototype.$http = axios;
import * as ECharts from 'echarts';
// 将自动注册所有组件为全局组件
import dataV from '@jiaminghi/data-view'


Vue.config.productionTip = false
Vue.use(dataV)
Vue.use(ECharts)
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
    routes
})

// 请求拦截器，在每个请求发送前执行
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token'); // 从本地存储中获取 Token
        if (token) {
            config.headers.token = token; // 在请求头中添加 Token
        }
        return config;
    },
    error => Promise.reject(error)
);
//响应拦截
axios.interceptors.response.use(
    response => {
        let data = response.data;
        if (!data.success && data.message == "noLogin") {
            //如果是noLogin，则是未登录访问失败，跳转至登录页
            router.push({
                path: '/login'
            })
            // window.location="http://localhost:8081/#/login"
            response.data.message = "请先登录!";
            return Promise.resolve(response);
        }else if (!data.success && data.message == "noPermission") {
            //如果是noPermission，则是没有权限访问失败，跳转至403页面
            router.push({
                path: '/403'
            })
            // window.location="http://localhost:8081/#/403"
            createPermission()
            response.data.message = "没有访问权限!";
            return Promise.resolve(response);
        }else {
            // createPermission();
            return response;
        }
    },
    error => {
        return Promise.reject(error)
    }
);

router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        localStorage.removeItem('loginUser');
        localStorage.removeItem('token');
        next(); // 继续导航
        return
    }
    if (to.path == '/') {
        next({path: '/login'})
        return
    }
    let user = JSON.parse(localStorage.getItem('loginUser'));
    if (!user && to.path != '/login') {
        //如果不是跳转到登录界面并且没有用户信息，则登录失效
        Message({
            message: "请先登录！",
            type: "error"
        })
        next({path: '/login'})
    } else {
        next(); // 继续导航
    }
})

/**
 * 声明指令，并在需要时注册指令(比如在登录后获取到登录用户的权限后再注册)
 * @param permissions 权限数组
 */
export const registerPermissionDirective = (permissions) => {
    //定义指令前先删除该指令，因为动态注册时防止重复注入相同指令
    Vue.directive('permission',null);
    // 定义一个名为registerPermissionDirective的函数，该函数接受一个数组permissions作为参数
    Vue.directive('permission', {
        // 在Vue中注册一个名为'permission'的指令，并定义其行为
        inserted: function (el, binding) {
            // 当被绑定的元素插入到DOM中时执行
            const { value } = binding;
            // 获取指令绑定值
            const userPermissions = permissions;
            // 获取该指令允许的用户权限
            if (value && value instanceof Array) {
                // 判断绑定值不为空且为数组
                if (value.length > 0) {
                    // 判断数组长度大于0
                    const hasPermission = value.every(permission => {
                        // 判断当前用户权限是否包含在指令允许的权限范围内
                        // console.log(permission,userPermissions.includes(permission))
                        return userPermissions.includes(permission)
                    })
                    if (!hasPermission) {
                        // 如果用户没有足够的权限，则从DOM中移除该元素
                        el.parentNode && el.parentNode.removeChild(el);
                    }
                }
            } else {
                // 如果绑定值不合法，则抛出错误
                throw new Error(`need permissions! Like v-permission="['admin','editor']"`)
            }
        }
    })
}
//获取当前登录用户sns标识并创建指令
export const createPermission =()=>{
    let user = localStorage.getItem('loginUser');
    if (user) {
        user = JSON.parse(user);
        if (user.id) {
            axios.get("/permission/getPermissionsByEmployeeId/" + user.id)
                .then(data => {
                    data = data.data;
                    if (data.success) {
                        //将当前用户拥有的权限存入localStorage
                        // console.log(data.resultObject)
                        localStorage.setItem("sns", data.resultObject);
                        // let sns = localStorage.getItem("sns").split(",")
                        //动态注册v-permission指令
                        registerPermissionDirective(data.resultObject);
                        // console.log("sns:",sns)
                    } else {

                    }
                })
                .catch(error => {

                })
        }
    }
}
//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app')

