import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import NoPermission from './views/403.vue'
import Home from './views/Home.vue'
import echarts from './views/charts/echarts.vue'
//引入部门列表组件
import Department from "./views/org/Department.vue";
//引入员工列表组件
import Employee from "./views/org/Employee.vue";
//引入权限列表组件
import permission from "./views/auth/Permission.vue";
import Role from "./views/auth/Role.vue";
import Menu from "./views/auth/Menu.vue";

import Procure from "./views/PurchaseReceipt/Procure.vue";
import Goods from "./views/PurchaseReceipt/Goods.vue";
import GoodsType from "./views/PurchaseReceipt/GoodsType.vue";
import Device from "./views/PurchaseReceipt/Device.vue";
import DeviceType from "./views/PurchaseReceipt/DevicesType.vue";
import Seller from "./views/org/Seller.vue";
import SellerType from "./views/org/SellerType.vue";
import GoodsOperaterLog from "@/views/PurchaseReceipt/GoodsOperaterLog.vue";
import CheckingGoods from "@/views/PurchaseReceipt/CheckingGoods.vue";
import DevicesOperaterLog from "@/views/PurchaseReceipt/DevicesOperaterLog.vue";
import CheckingDevices from "@/views/PurchaseReceipt/CheckingDevices.vue";
import UseRecord from "@/views/PurchaseReceipt/UseRecord.vue";
import Backup from "@/views/sys/backup.vue";
import BackupRecord from "@/views/sys/BackupRecord.vue";
import BackupOperaterLog from "@/views/sys/BackupOperaterLog.vue";
let routes = [
    {
        path: '/login',
        component: Login,
        name: '登录',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    // {
    //     path: '/403',
    //     component: NoPermission,
    //     name: '',
    //     hidden: true
    // },
    {
        path: '/',
        component: Home,
        name: '首页',
        iconCls: 'fa fa-bar-chart',
        leaf: true,
        redirect: '/echarts', // 添加此行以重定向到echarts组件
        children: [
            { path: '/echarts', component: echarts, name: '首页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '物资设备',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/procure', component: Procure, name: '采购入库'},
            { path: '/goods', component: Goods, name: '物资'},
            { path: '/goodsType', component: GoodsType, name: '物资类型'},
            { path: '/goodsOperaterLog', component: GoodsOperaterLog, name: '物资操作日志'},
            { path: '/checkingGoods', component: CheckingGoods, name: '待审核物资'},

            { path: '/device', component: Device, name: '设备'},
            { path: '/deviceType', component: DeviceType, name: '设备类型'},
            { path: '/devicesOperaterLog', component: DevicesOperaterLog, name: '设备操作日志'},
            { path: '/checkingDevices', component: CheckingDevices, name: '待审核设备'},
            { path: '/useRecord', component: UseRecord, name: '领用记录'},
        ]
    },

    {
        path: '/',
        component: Home,
        name: '组织机构管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/department', component: Department, name: '部门管理'},
            { path: '/employee', component: Employee, name: '员工管理'},
            { path: '/seller', component: Seller, name: '商家管理'},
            { path: '/sellerType', component: SellerType, name: '商家类型'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '权限模块',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/permission', component: permission, name: '权限管理' },
            { path: '/role', component: Role, name: '角色管理' },
            { path: '/menu', component: Menu, name: '菜单管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'el-icon-setting',//图标样式class
        children: [
            { path: '/backup', component: Backup, name: '系统备份' },
            { path: '/backupRecord', component: BackupRecord, name: '备份记录' },
            { path: '/backupOperatorLog', component: BackupOperaterLog, name: '备份操作日志' },
        ]
    },
    
];

export default routes;