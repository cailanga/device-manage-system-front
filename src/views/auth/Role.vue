<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="query.keyword" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="search">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="pageInfo.rows" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="名称" sortable>
            </el-table-column>
            <el-table-column prop="sn" label="唯一标识" sortable>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    <el-button type="primary" size="small" @click="setPermission(scope.row)">设置权限</el-button>
                    <el-button type="primary" size="small" @click="setMenu(scope.row)">设置菜单</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="query.currentPage"
                    :page-sizes="pageSizes"
                    :page-size="query.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageInfo.total">
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="saveFormVisible" :close-on-click-modal="false">
            <el-form :model="saveForm" label-width="80px" :rules="saveFormRules" ref="saveForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="saveForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="唯一标识">
                    <el-input v-model="saveForm.sn" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="saveFormVisible=false">取消</el-button>
                <el-button type="primary" @click.native="saveSubmit" :loading="saveLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--设置权限界面-->
        <el-dialog title="设置权限" :visible.sync="setPermissionVisible" :close-on-click-modal="false">
            <el-form :model="rolePermission" label-width="80px">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                </el-checkbox>
                <div class="checkbox-table" v-for="(p,indexkey) in permissionTree" :key="p.sn">
                    <template>
                        <el-checkbox class="check1" style="font-weight: 600;margin-bottom: 15px "
                                     v-model='rolePermission.permissionSns' :label="p.sn"
                                     @change='handleCheck(1,indexkey)'>
                            {{ p.name }}
                        </el-checkbox>
                        <div style="margin-bottom: 20px;">
                            <div v-for="c in p.children" class="line-check" :key="c.sn"
                                 style="display: inline-block; margin-left: 20px;margin-bottom: 20px;">
                                <el-checkbox class="check2" @change='handleCheck(2,indexkey)'
                                             v-model="rolePermission.permissionSns" :label="c.sn">
                                    {{ c.name }}
                                </el-checkbox>
                            </div>
                        </div>
                    </template>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="setPermissionVisible = false">取消</el-button>
                <el-button type="primary" @click.native="saveRolePermission" :loading="saveLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--设置菜单界面-->
        <el-dialog title="设置菜单" :visible.sync="setMenuVisible" :close-on-click-modal="false">
            <el-form :model="roleMenu" label-width="80px">
                <el-checkbox :indeterminate="isIndeterminateForMenu" v-model="checkAllForMenu" @change="handleCheckAllChangeForMenu">全选
                </el-checkbox>
                <div class="checkbox-table" v-for="(p,indexkey) in menuTree" :key="p.id">
                    <template>
                        <el-checkbox class="check1" style="font-weight: 600;margin-bottom: 15px "
                                     v-model='roleMenu.menuIds' :label="p.id"
                                     @change='handleCheckForMenu(1,indexkey)'>
                            {{ p.name }}
                        </el-checkbox>
                        <div style="margin-bottom: 20px;">
                            <div v-for="c in p.children" class="line-check" :key="c.id"
                                 style="display: inline-block; margin-left: 20px;margin-bottom: 20px;">
                                <el-checkbox class="check2" @change='handleCheckForMenu(2,indexkey)'
                                             v-model="roleMenu.menuIds" :label="c.id">
                                    {{ c.name }}
                                </el-checkbox>
                            </div>
                        </div>
                    </template>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="setMenuVisible = false">取消</el-button>
                <el-button type="primary" @click.native="saveRoleMenu" :loading="saveLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>

export default {
    data() {
        return {
            listLoading: false,
            query: {
                currentPage: 1,
                pageSize: 10,
                keyword: ""
            },
            pageInfo: {
                total: 0,
                rows: []
            },
            pageSizes: [10, 20, 30],
            sels: [],//列表选中列

            saveFormVisible: false,//新增界面是否显示
            saveLoading: false,
            saveFormRules: {
                name: [
                    {required: true, message: '请输入名称', trigger: 'blur'}
                ]
            },
            //新增界面数据
            saveForm: {
                name: '',
                sn: ""
            },

            //控制设置权限界面显示
            setPermissionVisible: false,
            //控制全选显示横杠-
            isIndeterminate: false,
            //设置全选状态
            checkAll: false,
            //权限树
            permissionTree: [],
            //存放所有的权限标识
            allPermissionSns: [],
            rolePermission: {
                roleId: null,
                //选中的权限的sn标识
                permissionSns: []
            },

            //控制设置权限界面显示
            setMenuVisible: false,
            //控制全选显示横杠-
            isIndeterminateForMenu: false,
            //设置全选状态
            checkAllForMenu: false,
            //权限树
            menuTree: [],
            //存放所有的权限标识
            allMenuIds: [],
            roleMenu: {
                roleId: null,
                //选中的菜单的ID
                menuIds: []
            }
        }
    },
    methods: {
        //保存权限设置
        saveRolePermission() {
            this.$http.put("/role/setPermission", this.rolePermission)
                .then(data => {
                    //隐藏加载框
                    this.saveLoading = false;
                    data = data.data
                    if (data.success) {
                        this.$message({
                            message: '设置权限成功',
                            type: 'success'
                        });
                        //隐藏设置权限弹框
                        this.setPermissionVisible = false
                    } else {
                        this.$message({
                            message: data.message,
                            type: 'error'
                        });
                    }
                })
                .catch(data => {
                    this.$message({
                        message: '网络错误请稍后重试！',
                        type: 'error'
                    });
                })
        },
        //保存菜单设置
        saveRoleMenu() {
            this.$http.put("/role/setMenu", this.roleMenu)
                .then(data => {
                    //隐藏加载框
                    this.saveLoading = false;
                    data = data.data
                    if (data.success) {
                        this.$message({
                            message: '设置菜单成功',
                            type: 'success'
                        });
                        //隐藏设置菜单弹框
                        this.setMenuVisible = false
                    } else {
                        this.$message({
                            message: data.message,
                            type: 'error'
                        });
                    }
                })
                .catch(data => {
                    this.$message({
                        message: '网络错误请稍后重试！',
                        type: 'error'
                    });
                })
        },
        //全选框改变事件
        handleCheckAllChange(val) {
            //当前全选框的选中状态
            this.rolePermission.permissionSns = val ? this.allPermissionSns : [];
            this.isIndeterminate = false;
        },
        // 处理选择事件  type 1:一级权限2:二级权限   a：一级权限的索引位置
        handleCheck(type, a = 0) { // 多选框
            // 在已选中的权限列表中，查看是否存在一级权限 >-1 存在  <0 不存在
            let indexOf = this.rolePermission.permissionSns.indexOf(this.permissionTree[a].sn);
            if (type == 2) { // 二级菜单点击
                let index = 0;  //
                this.permissionTree[a].children.map(item => {
                    // 已选中的权限列表中，是否包含当前一级权限下的某个子权限
                    if (this.rolePermission.permissionSns.indexOf(item.sn) > -1) {
                        index += 1;
                    }
                })
                if (index > 0) {  // 已选中的权限列表中，包含当前一级权限下的某个子权限
                    if (indexOf < 0) {  // 已选中的权限列表中，没有当前一级权限，则添加到已选中的权限列表中
                        this.rolePermission.permissionSns.push(this.permissionTree[a].sn);
                    }
                } else {  // // 已选中的权限列表中，不包含当前一级权限下的某个子权限
                    if (indexOf > -1) {// 已选中的权限列表中，有当前一级权限，则删除
                        this.rolePermission.permissionSns.splice(indexOf, 1);
                    }
                }
            } else {  // 一级菜单点击
                if (indexOf > -1) { // 已选中的权限中，包含当前一级权限，则将该一级权限下所有的子权限选中
                    this.permissionTree[a].children.map(item => {
                        if (this.rolePermission.permissionSns.findIndex((n) => n == item.sn) < 0) {
                            this.rolePermission.permissionSns.push(item.sn)
                        }
                    })
                } else {
                    // 已选中的权限中，不包含当前一级权限，则将该一级权限下所有的子权限移除
                    this.permissionTree[a].children.map(item => {
                        if (this.rolePermission.permissionSns.findIndex((n) => n == item.sn) > -1) {
                            this.rolePermission.permissionSns.splice(this.rolePermission.permissionSns.findIndex((n) => n == item.sn), 1);
                        }
                    })
                }
            }
            // 获取已选中的长度
            let checkedCount = this.rolePermission.permissionSns.length;
            // 如果已选中的长度==所有权限的长度，则checkAll=true，也就是全选框被选中
            this.checkAll = checkedCount === this.allPermissionSns.length;
            // 如果已选中的长度>0并且已选中的长度<所有权限的长度，则全选框是一个横杠
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.allPermissionSns.length;
        },
        //菜单全选框改变事件
        handleCheckAllChangeForMenu(val) {
            //当前全选框的选中状态
            this.roleMenu.menuIds = val ? this.allMenuIds : [];
            this.isIndeterminateForMenu = false;
        },
        // 处理菜单选择事件  type 1:一级权限2:二级权限   a：一级权限的索引位置
        handleCheckForMenu(type, a = 0) { // 多选框
            // 在已选中的菜单列表中，查看是否存在一级权限 >-1 存在  <0 不存在
            let indexOf = this.roleMenu.menuIds.indexOf(this.menuTree[a].id);
            if (type == 2) { // 二级菜单点击
                let index = 0;  //
                this.menuTree[a].children.map(item => {
                    // 已选中的菜单列表中，是否包含当前一级菜单下的某个子菜单
                    if (this.roleMenu.menuIds.indexOf(item.id) > -1) {
                        index += 1;
                    }
                })
                if (index > 0) {  // 已选中的菜单列表中，包含当前一级权限下的某个子菜单
                    if (indexOf < 0) {  // 已选中的菜单列表中，没有当前一级菜单，则添加到已选中的菜单列表中
                        this.roleMenu.menuIds.push(this.menuTree[a].id);
                    }
                } else {  // // 已选中的菜单列表中，不包含当前一级菜单下的某个子菜单
                    if (indexOf > -1) {// 已选中的菜单列表中，有当前一级菜单，则删除
                        this.roleMenu.menuIds.splice(indexOf, 1);
                    }
                }
            } else {  // 一级菜单点击
                if (indexOf > -1) { // 已选中的菜单中，包含当前一级菜单，则将该一级菜单下所有的子菜单选中
                    this.menuTree[a].children.map(item => {
                        if (this.roleMenu.menuIds.findIndex((n) => n == item.id) < 0) {
                            this.roleMenu.menuIds.push(item.id)
                        }
                    })
                } else {
                    // 已选中的菜单中，不包含当前一级菜单，则将该一级菜单下所有的子菜单移除
                    this.menuTree[a].children.map(item => {
                        if (this.roleMenu.menuIds.findIndex((n) => n == item.id) > -1) {
                            this.roleMenu.menuIds.splice(this.roleMenu.menuIds.findIndex((n) => n == item.id), 1);
                        }
                    })
                }
            }
            // 获取已选中的长度
            let checkedCount = this.roleMenu.menuIds.length;
            // 如果已选中的长度==所有菜单的长度，则checkAll=true，也就是全选框被选中
            this.checkAllForMenu = checkedCount === this.allMenuIds.length;
            // 如果已选中的长度>0并且已选中的长度<所有菜单的长度，则全选框是一个横杠
            this.isIndeterminateForMenu = checkedCount > 0 && checkedCount < this.allMenuIds.length;
        },
        //设置权限
        setPermission(row) {
            //先清空所有角色权限
            this.allPermissionSns=[]
            //初始化值
            this.rolePermission = {
                roleId: null,
                permissionSns: []
            }
            //显示设置权限弹框
            this.setPermissionVisible = true;
            //设置roleId
            this.rolePermission.roleId = row.id;
            //获取权限数据
            this.getPermissionTree(row.id);
        },
        //设置菜单
        setMenu(row) {
            //先清空所有角色菜单
            this.allMenuIds=[]
            //初始化值
            this.roleMenu = {
                roleId: null,
                menuIds: []
            }
            //显示设置菜单弹框
            this.setMenuVisible = true;
            //设置roleId
            this.roleMenu.roleId = row.id;
            //获取菜单数据
            this.getMenuTree(row.id);
        },
        //获取权限树
        getPermissionTree(roleId) {
            this.$http.get("/role/getPermissionTree")
                .then(data => {
                    data = data.data;
                    if (data.success) {
                        //赋值权限数据
                        this.permissionTree = data.resultObject;
                        this.permissionTree.map(permission => {
                            this.allPermissionSns.push(permission.sn);
                            if (permission.children && permission.children.length > 0) {
                                permission.children.map(item => {
                                    this.allPermissionSns.push(item.sn)
                                })
                            }
                        })
                        if (roleId) {
                            //如果roleId存在，则是在修改数据时需要数据回显，须通过id从后台查当前角色的权限标识
                            this.getPermissionSns(roleId)
                        }
                    }
                })
                .catch(error => {
                    this.$message({
                        message: '网络错误，请重试！',
                        type: 'error'
                    });
                })
        },
        //根据id获取权限标识
        getPermissionSns(roleId) {
            this.$http.get("/role/getPermissionsSnsByRoleId/" + roleId)
                .then(data => {
                    data = data.data
                    if (data.success) {
                        //将获取到的权限标识赋值后用于回显
                        this.rolePermission.permissionSns = data.resultObject;
                        //设置全选框
                        // 获取已选中的长度
                        let checkedCount = this.rolePermission.permissionSns.length;
                        // 如果已选中的长度==所有权限的长度，则checkAll=true，也就是全选框被选中
                        this.checkAll = checkedCount === this.allPermissionSns.length;
                        // 如果已选中的长度>0并且已选中的长度<所有权限的长度，则全选框是一个横杠
                        this.isIndeterminate = checkedCount > 0 && checkedCount < this.allPermissionSns.length;
                    }
                })
        },
        //获取菜单树
        getMenuTree(roleId) {
            this.$http.get("/role/getMenuTree")
                .then(data => {
                    data = data.data;
                    if (data.success) {
                        //赋值菜单数据
                        this.menuTree = data.resultObject;
                        this.menuTree.map(menu => {
                            this.allMenuIds.push(menu.id);
                            if (menu.children && menu.children.length > 0) {
                                menu.children.map(item => {
                                    this.allMenuIds.push(item.id)
                                })
                            }
                        })
                        if (roleId) {
                            //如果roleId存在，则是在修改数据时需要数据回显，须通过id从后台查当前角色的菜单ID
                            this.getMenuIds(roleId)
                        }
                    }
                })
                .catch(error => {
                    this.$message({
                        message: '网络错误，请重试！',
                        type: 'error'
                    });
                })
        },
        //根据角色id获取菜单ids
        getMenuIds(roleId) {
            this.$http.get("/role/getMenuIdsByRoleId/" + roleId)
                .then(data => {
                    data = data.data
                    if (data.success) {
                        //将获取到的菜单id赋值后用于回显
                        this.roleMenu.menuIds = data.resultObject;
                        //将字符串数组转为数字类型的数组
                        this.roleMenu.menuIds = this.roleMenu.menuIds
                            .map(id=> parseInt(id));
                        //设置全选框
                        // 获取已选中的长度
                        let checkedCount = this.roleMenu.menuIds.length;
                        // 如果已选中的长度==所有菜单的长度，则checkAll=true，也就是全选框被选中
                        this.checkAllForMenu = checkedCount === this.allMenuIds.length;
                        // 如果已选中的长度>0并且已选中的长度<所有权限的长度，则全选框是一个横杠
                        this.isIndeterminateForMenu = checkedCount > 0 && checkedCount < this.allMenuIds.length;
                    }
                })
        },
        //处理页面查询条数变化时
        handleSizeChange(val) {
            this.query.pageSize = val
            this.search()
        },
        //处理页码变化时
        handleCurrentChange(val) {
            this.query.currentPage = val;
            this.getRoles();
        },
        //查询
        search() {
            this.query.currentPage = 1;
            this.getRoles();
        },
        //获取角色列表
        getRoles() {
            this.listLoading = true;
            this.$http.post("/role", this.query)
                .then(data => {
                    this.listLoading = false;
                    data = data.data
                    if (data.success) {
                        this.pageInfo = data.resultObject;
                    } else {
                        this.$message({
                            message: data.message,
                            type: 'error'
                        });
                    }
                })
                .catch(data => {
                    this.$message({
                        message: '网络错误，请重试！',
                        type: 'error'
                    });
                })
        },
        //删除
        handleDel: function (index, row) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                this.$http.delete("/role/" + row.id).then((data) => {
                    this.listLoading = false;
                    data = data.data;
                    if (data.success) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        //从第一页开始查询
                        this.query.currentPage = 1;
                        this.getRoles();
                    } else {
                        this.$message({
                            message: data.message,
                            type: 'error'
                        });
                    }
                });
            }).catch(() => {
                this.listLoading = false;
                this.$message({
                    message: '网络错误，请稍后重试！',
                    type: 'error'
                });
            });
        },
        //显示编辑界面
        handleEdit: function (index, row) {
            this.saveFormVisible = true;
            this.saveForm = Object.assign({}, row);
        },
        //显示新增界面
        handleAdd: function () {
            this.saveFormVisible = true;
            this.saveForm = {
                name: '',
                sn: ''
            };
        },
        //新增
        saveSubmit: function () {
            //对表单数据进行校验
            this.$refs.saveForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.saveLoading = true;
                        this.$http.put("/role", this.saveForm).then((data) => {
                            this.saveLoading = false;
                            data = data.data
                            if (data.success) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.saveFormVisible = false;
                                this.getRoles();
                            } else {
                                this.$message({
                                    message: data.message,
                                    type: 'error'
                                });
                            }
                        });
                    });
                }
            });
        },
        selsChange: function (sels) {
            this.sels = sels;
        },
        //批量删除
        batchRemove: function () {
            var ids = this.sels.map(item => item.id);
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                this.$http.patch("/role", ids)
                    .then((data) => {
                        this.listLoading = false;
                        data = data.data;
                        if (data.success) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            //从第一页开始查
                            this.query.currentPage = 1;
                            this.getRoles();
                        } else {
                            this.$message({
                                message: data.message,
                                type: 'error'
                            });
                        }
                    })
                    .catch(data => {
                        this.listLoading = false;
                        this.$message({
                            message: '网络错误，请稍后再试！',
                            type: 'error'
                        });
                    })
            }).catch(() => {

            });
        }
    },
    mounted() {
        this.getRoles();
    }
}

</script>

<style scoped>

</style>