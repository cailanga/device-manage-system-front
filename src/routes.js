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

import DeviceProcure from "./views/device/Procure.vue";
import GoodsProcure from "./views/goods/Procure.vue";
import Goods from "./views/goods/Goods.vue";
import GoodsType from "./views/goods/GoodsType.vue";
import Device from "./views/device/Device.vue";
import DeviceType from "./views/device/DevicesType.vue";
import Seller from "./views/org/Seller.vue";
import SellerType from "./views/org/SellerType.vue";
import GoodsOperaterLog from "@/views/goods/GoodsOperaterLog.vue";
import CheckingGoods from "@/views/goods/CheckingGoods.vue";
import DevicesOperaterLog from "@/views/device/DevicesOperaterLog.vue";
import CheckingDevices from "@/views/device/CheckingDevices.vue";
import UseRecord from "@/views/useRecord/UseRecord.vue";
import Backup from "@/views/sys/backup.vue";
import BackupRecord from "@/views/sys/BackupRecord.vue";
import BackupOperaterLog from "@/views/sys/BackupOperaterLog.vue";
import DeviceInfoShow from "@/views/statistics/DeviceInfoShow.vue";
import GoodsInfoShow from "@/views/statistics/GoodsInfoShow.vue";
import Notice from "@/views/notice/Notice.vue";
import CheckingNotice from "@/views/notice/CheckingNotice.vue";
import NoticeOperaterLog from "@/views/notice/NoticeOperaterLog.vue";
import Index from "@/views/Index.vue";
import InterfaceDoc from "@/views/sys/InterfaceDoc.vue";
import DbMonitor from "@/views/sys/DbMonitor.vue";
import CanUseDevice from "@/views/device/CanUseDevice.vue";
import UseRecordByPerson from "@/views/useRecord/UseRecordByPerson.vue";
import CanUseGoods from "@/views/goods/CanUseGoods.vue";
let routes = [
    {
        path: '/',
        component: Login,
        name: '登录',
        hidden: true
    },
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
    {
        path: '/403',
        component: NoPermission,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '首页',
        iconCls: 'fa fa-bar-chart',
        leaf: true,
        redirect: '/index', // 添加此行以重定向到echarts组件
        children: [
            { path: '/index', component: Index, name: '首页' }
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '物资设备',
    //     iconCls: 'el-icon-message',//图标样式class
    //     children: [
    //         { path: '/procure', component: GoodsProcure, name: '采购入库'},
    //         { path: '/goods', component: Goods, name: '物资'},
    //         { path: '/goodsType', component: GoodsType, name: '物资类型'},
    //         { path: '/goodsOperaterLog', component: GoodsOperaterLog, name: '物资操作日志'},
    //         { path: '/checkingGoods', component: CheckingGoods, name: '待审核物资'},
    //
    //         { path: '/device', component: Device, name: '设备'},
    //         { path: '/deviceType', component: DeviceType, name: '设备类型'},
    //         { path: '/devicesOperaterLog', component: DevicesOperaterLog, name: '设备操作日志'},
    //         { path: '/checkingDevices', component: CheckingDevices, name: '待审核设备'},
    //         { path: '/useRecord', component: UseRecord, name: '领用记录'},
    //     ]
    // },

    {
        path: '/',
        component: Home,
        name: '物资管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/goods/procure', component: GoodsProcure, name: '采购入库'},
            { path: '/goods', component: Goods, name: '物资'},
            { path: '/goodsType', component: GoodsType, name: '物资类型'},
            { path: '/goodsOperaterLog', component: GoodsOperaterLog, name: '物资操作日志'},
            { path: '/checkingGoods', component: CheckingGoods, name: '待审核物资'},
            // { path: '/useRecord', component: UseRecord, name: '领用记录'},
            { path: '/canUseGoods', component: CanUseGoods, name: '可领用物资'},
        ]
    },

    {
        path: '/',
        component: Home,
        name: '设备管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/device/procure', component: DeviceProcure, name: '采购入库'},
            { path: '/device', component: Device, name: '设备'},
            { path: '/deviceType', component: DeviceType, name: '设备类型'},
            { path: '/deviceOperaterLog', component: DevicesOperaterLog, name: '设备操作日志'},
            { path: '/checkingDevice', component: CheckingDevices, name: '待审核设备'},
            // { path: '/useRecord', component: UseRecord, name: '领用记录'},
            { path: '/canUseDevice', component: CanUseDevice, name: '可领用设备'},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '领用记录',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/useRecord', component: UseRecord, name: '领用记录'},
            { path: '/useRecordByPerson', component: UseRecordByPerson, name: '个人领用记录'},
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
            { path: '/interfaceDoc', component: InterfaceDoc, name: '系统接口文档' },
            { path: '/dbMonitor', component: DbMonitor, name: '数据监控' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '信息统计',
        iconCls: 'el-icon-setting',//图标样式class
        children: [
            { path: '/deviceShow', component: DeviceInfoShow, name: '设备信息统计' },
            { path: '/goodsShow', component: GoodsInfoShow, name: '物资信息统计' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '通知管理',
        iconCls: 'el-icon-setting',//图标样式class
        children: [
            { path: '/notice', component: Notice, name: '通知信息' },
            { path: '/checkingNotice', component: CheckingNotice, name: '待审核通知' },
            { path: '/noticeOperaterLog', component: NoticeOperaterLog, name: '通知操作日志' },
        ]
    },
    
];

export default routes;