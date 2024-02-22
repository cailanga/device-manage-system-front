<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="query.keyword" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="search" v-permission="['DepartmentController']">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" v-permission="['DepartmentController:addOrUpdate']">新增</el-button>
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
            <el-table-column prop="name" label="名称" width="120" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="200" sortable>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="200" sortable>
            </el-table-column>
            <el-table-column prop="manager.username" label="部门领导" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="parent.name" label="父级部门" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="path" label="部门路径" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="state" label="状态" min-width="80" sortable>
                <template slot-scope="scope">
                    <span v-if="scope.row.state==1" style="color: #13ce66">正常</span>
                    <span v-else style="color: #ff6d6d">禁用</span>
                </template>
            </el-table-column>
            <el-table-column prop="intro" label="描述" width="100">
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
                <template scope="scope" v-permission="['DepartmentController:addOrUpdate','DepartmentController:deleteById']">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-permission="['DepartmentController:addOrUpdate']">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" v-permission="['DepartmentController:deleteById']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" v-permission="['DepartmentController:batchDelete']">批量删除</el-button>
<!--            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
                           :current-page.sync="query.currentPage"
                           :page-size="10"
                           :total="pageInfo.total" style="float:right;">
            </el-pagination>-->
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
                <el-form-item label="部门名称" prop="name">
                    <el-input v-model="saveForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="部门管理">
                    <el-select v-model="saveForm.manager.id" placeholder="请选择">
                        <el-option
                                v-for="item in employees"
                                :key="item.id"
                                :label="item.username"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="父级部门">
                    <el-cascader
                            v-model="saveForm.parent"
                            :options="deptTree"
                            :props="{
                             checkStrictly: true,
                             label:'name',
                             value:'id',
                             'disabled': 'disabled'
                            }"></el-cascader>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="saveForm.state">
                        <el-radio class="radio" :label="1">正常</el-radio>
                        <el-radio class="radio" :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="saveForm.intro"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="saveFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="saveSubmit" :loading="saveLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
// import util from '../../common/js/util'
// //import NProgress from 'nprogress'
// import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

// import axios from "axios";

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
            pageSizes:[10,20,30],
            sels: [],//列表选中列

            saveFormVisible: false,//新增界面是否显示
            saveLoading: false,
            saveFormRules: {
                name: [
                    {required: true, message: '请输入姓名', trigger: 'blur'}
                ]
            },
            //新增界面数据
            saveForm: {
                id: null,
                name: '',
                manager: {
                    id: null
                },
                parent: {
                    id: null
                },
                state: null,
                intro: ''
            },
            //员工所有信息
            employees: [],
            deptTree: []
        }
    },
    methods: {
        //处理页面查询条数变化时
        handleSizeChange(val){
            this.query.pageSize=val
            this.search()
        },
        //处理页码变化时
        handleCurrentChange(val) {
            this.query.currentPage = val;
            this.getDepartments();
        },
        //查询
        search() {
            this.query.currentPage = 1;
            this.getDepartments();
        },
        //获取部门列表
        getDepartments() {
            this.listLoading = true;
            this.$http.post("/department", this.query)
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
        //获取员工列表信息
        getEmployees() {
            this.$http.get("/employee")
                .then(data => {
                    data = data.data
                    this.employees = data.resultObject
                })
                .catch(data => {
                    this.$message({
                        message: '网络错误，请稍后重试！',
                        type: 'error'
                    });
                })
        },
        //获取部门树，用于级联展示
        getDeptTree() {
            this.$http.get("/department/tree")
                .then(data => {
                    data = data.data
                    this.deptTree = data.resultObject;
                    //在级联选择器中，给当前部门禁用
                    this.deptTree = this.deptTree.map(item=>{
                        if (item.id===this.saveForm.id) {
                            item.disabled = true
                        }else {
                            let children = item.children;
                            if (children!=null&&children.length>0) {
                                children = children.map(item=>{
                                    if (item.id===this.saveForm.id) {
                                        item.disabled = true
                                        return item
                                    }
                                })
                            }
                        }
                        return item;
                    })
                })
                .catch(data => {
                    this.$message({
                        message: '网络异常，请重试！',
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
                this.$http.delete("/department/" + row.id).then((data) => {
                    this.listLoading = false;
                    data = data.data;
                    if (data.success) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        //从第一页开始查询
                        this.query.currentPage = 1;
                        this.getDepartments();
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
            //回显的数据
            this.saveForm = Object.assign({}, row);
            //由于在页面中会调用id，在没有对应对象的数据时，会报错，
            // 因此给对象为null的对象添加id
            if (!this.saveForm.parent) {
                //parent为null，此时为一级部门
                this.saveForm.parent = {
                    id: null
                }
            }else {
                //获取部门id数组
                let path=[];
                if(row.path){
                    path = row.path
                        .substring(1,row.path.lastIndexOf("/"))
                        .split("/")
                        .map(item=>parseInt(item));
                }
                console.log(path)
                this.saveForm.parent = path;
            }
            if (!this.saveForm.manager) {
                this.saveForm.manager = {
                    id: null
                }
            }
            //在进入新增/修改界面时获取员工数据
            this.getEmployees();
            //获取部门树
            this.getDeptTree();
        },
        //显示新增界面
        handleAdd: function () {
            this.saveFormVisible = true;
            this.saveForm = {
                id: null,
                name: '',
                manager: {
                    id: null
                },
                parent: {
                    id: null
                },
                state: null,
                intro: ''
            };
            //在进入新增界面时获取员工数据
            this.getEmployees();
            //获取部门树
            this.getDeptTree();
        },
        //新增
        saveSubmit: function () {
            //通过$refs.saveForm查找到ref="saveForm"的表单
            // 通过表单绑定的:rules="saveFormRules"中的saveFormRules定义的规则对表单数据进行校验
            // 若符合规则valid值为true，反之为false
            this.$refs.saveForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.saveLoading = true;
                        let parent = this.saveForm.parent;
                        if(parent==null||parent.length===0) {
                            //此情况为一级部门
                            this.saveForm.parent = {
                                id:null
                            }
                        }else {
                            this.saveForm.parent = {
                                id:parent[parent.length-1]
                            }
                        }
                        // debugger
                        this.$http.put("/department", this.saveForm)
                            .then((data) => {
                                data = data.data
                                this.saveLoading = false;
                                if (data.success) {
                                    this.$message({
                                        message: '操作成功',
                                        type: 'success'
                                    });
                                    //重新获取数据
                                    this.getDepartments()
                                    this.saveFormVisible = false;
                                } else {
                                    this.$message({
                                        message: data.message,
                                        type: 'error'
                                    });
                                }
                            })
                            .catch(data => {
                                this.$message({
                                    message: '网络异常，请重试！',
                                    type: 'error'
                                });
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
                this.$http.patch("/department", ids)
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
                            this.getDepartments();
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
        this.getDepartments();
    }
}

</script>

<style scoped>
</style>