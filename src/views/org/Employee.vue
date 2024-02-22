<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="query.keyword" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="search" v-permission="['EmployeeController']">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" v-permission="['EmployeeController:addOrUpdate']">新增</el-button>
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
            <el-table-column prop="username" label="员工姓名" width="120" sortable>
            </el-table-column>
            <el-table-column label="密码" width="200" sortable>
                <template slot-scope="scope">
                    <el-input show-password v-model="scope.row.password" type="password"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="200" sortable>
            </el-table-column>
<!--            <el-table-column label="头像地址" min-width="100" sortable>
                <template slot-scope="scope">
                    <img :src="scope.row.headImage" alt="avatar" style="width: 50px; height: 50px">
                </template>
            </el-table-column>-->
            <el-table-column prop="age" label="年龄" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="department.name" label="部门名称" min-width="100" sortable>
            </el-table-column>
            <el-table-column label="操作" width="300" fixed="right">
                <template scope="scope"  v-permission="['EmployeeController:addOrUpdate','EmployeeController:deleteById']">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-permission="['EmployeeController:addOrUpdate']">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" v-permission="['EmployeeController:deleteById']">删除</el-button>
                    <el-button type="primary" size="small" @click="handleSetRole(scope.row)" v-permission="['EmployeeController:setEmployeeRole']">设置角色</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" v-permission="['EmployeeController:batchDelete']">批量删除</el-button>
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
        <el-dialog title="新增" :visible.sync="saveFormVisible" :before-close="beforeClose" :close-on-click-modal="false">
            <el-form :model="saveForm" label-width="80px" :rules="saveFormRules" ref="saveForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="saveForm.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input show-password type="password" v-model="saveForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="saveForm.email" auto-complete="off"></el-input>
                </el-form-item>
<!--                TODO-->
<!--                <el-form-item label="头像地址">
                    &lt;!&ndash;                    <el-input v-model="saveForm.headImage" auto-complete="off"></el-input>&ndash;&gt;
                    <el-upload
                            class="avatar-uploader"
                            action="/api/employee/uploadHeadImage"
                            :headers="{'token':token}"
                            :show-file-list="false"
                            :before-upload="handleBeforeAvatarUpload"
                            :on-success="handleAvatarUploaded"
                    >
                        <img v-if="saveForm.headImage" :src="saveForm.headImage">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>-->
                <el-form-item label="年龄">
                    <el-input-number v-model="saveForm.age" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="部门名称">
                    <el-select v-model="saveForm.department.id" placeholder="请选择">
                        <el-option
                                v-for="item in departments"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="cancelSaveSubmit">取消</el-button>
                <el-button type="primary" @click.native="saveSubmit" :loading="saveLoading">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="设置角色" :visible.sync="setRoleFormVisible" :close-on-click-modal="false">
            <el-form :model="setRoleForm" label-width="80px">
                <el-form-item label="角色">
                    <el-select v-model="setRoleForm.roleIds" multiple placeholder="请选择">
                        <el-option
                            v-for="item in roles"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="setRoleFormVisible=false">取消</el-button>
                <el-button type="primary" @click.native="setRoleFormSubmit" :loading="saveLoading">提交</el-button>
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
            token: "",
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

            editFormVisible: false,//编辑界面是否显示
            editLoading: false,
            editFormRules: {
                name: [
                    {required: true, message: '请输入姓名', trigger: 'blur'}
                ]
            },

            saveFormVisible: false,//新增界面是否显示
            saveLoading: false,
            saveFormRules: {
                name: [
                    {required: true, message: '请输入姓名', trigger: 'blur'}
                ]
            },
            //新增界面数据
            saveForm: {
                username: '',
                password: '',
                email: "",
                headImage: '',
                age: 1,
                department: {
                    id: null
                },
            },
            departments: [],
            userAvatarUrl: '', // 用户头像文件 URL

            //控制设置角色弹框显示和隐藏
            setRoleFormVisible:false,
            setRoleForm:{
                //选中的角色id的集合
                roleIds:[],
                employeeId: null
            },
            //查询到的所有角色，用来设置角色时的下拉列表展示
            roles:[]
        }
    },
    methods: {
        //设置角色提交
        setRoleFormSubmit(){
            this.$http.post("/employee/setEmployeeRole",this.setRoleForm)
                .then(data => {
                    //关闭加载
                    this.saveLoading =false;
                    data = data.data
                    if (data.success){
                        this.$message({
                            message: '设置角色成功',
                            type: 'success'
                        });
                        //关闭弹框
                        this.setRoleFormVisible =false
                    }else {
                        this.$message({
                            message: data.message,
                            type: 'error'
                        });
                    }
                })
        },
        //设置角色弹窗
        handleSetRole(row) {
            this.setRoleForm={
                //选中的角色id的集合
                roleIds:[],
                employeeId: row.id
            }
            this.setRoleFormVisible = true;
            //获取所有角色
            this.getAllRoles();
        },
        //根据员工id获取员工的角色信息
        getEmpRolesByEmplId(employeeId){
            employeeId = employeeId?employeeId:this.setRoleForm.employeeId
            this.$http.get("/employee/getEmpRolesByEmplId/"+employeeId)
                .then(data=>{
                    data=data.data
                    if (data.success){
                        this.setRoleForm.roleIds = data.resultObject
                    }else {
                        this.$message({
                            message: data.message,
                            type: 'error'
                        });
                    }
                })
                .catch(error=>{
                    this.$message({
                        message: '网络错误，请稍后再试！',
                        type: 'error'
                    });
                })
        },
        //获取所有角色信息
        getAllRoles(){
            this.$http.get("/role")
                .then(data =>{
                    data = data.data
                    if (data.success){
                        //赋值获取到的值
                        this.roles = data.resultObject;
                        //根据员工id获取其角色信息
                        this.getEmpRolesByEmplId();
                    }else {
                        this.$message({
                            message: data.message,
                            type: 'error'
                        });
                    }
                })
                .catch(error =>{
                    this.$message({
                        message: '网络错误，请稍后再试！',
                        type: 'error'
                    });
                })
        },
        //上传之前调用
        handleBeforeAvatarUpload(file) {
            // 文件格式校验
            const isJPG = file.type === 'image/jpeg'
            const isPNG = file.type === 'image/png'
            if (!isJPG && !isPNG) {
                this.$message.error('只支持 JPG/PNG 格式的图片')
                return false
            }
            // 文件大小限制
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isLt2M) {
                this.$message.error('图片大小不能超过 2MB')
                return false
            }
            // 图片预览
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                this.saveForm.headImage = reader.result
            }

        },
        //上传成功调用
        handleAvatarUploaded(response) {
            console.log(response)
            if (response.success) {
                this.$message.success('头像上传成功')
                this.saveForm.headImage = response.resultObject
            } else {
                this.$message.error('头像上传失败')
            }
        },
        //处理页面查询条数变化时
        handleSizeChange(val) {
            this.query.pageSize = val
            this.search()
        },
        beforeClose(done) {
            let filename = this.saveForm.headImage;
            if (filename){
                this.deleteHeadImage(filename);
            }
            done()
        },
        //删除已上传的文件
        deleteHeadImage(fileName) {
            this.$http.post("/employee/deleteHeadImage", {fileName: fileName})
                .then(data => {
                    data = data.data
                    if (data.success) {
                        console.log("删除图片成功")
                    } else {
                        console.log("删除图片失败")
                    }
                })
                .catch(data => {
                    this.listLoading = false;
                    this.$message({
                        message: '网络错误，请稍后再试！',
                        type: 'error'
                    });
                })
        },
        //处理页码变化时
        handleCurrentChange(val) {
            this.query.currentPage = val;
            this.getEmployees();
        },
        //查询
        search() {
            this.query.currentPage = 1;
            this.getEmployees();
        },
        //获取员工列表
        getEmployees() {
            this.listLoading = true;
            this.$http.post("/employee", this.query)
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
        //获取所有部门信息
        getDepartments() {
            this.$http.get("/department")
                .then(data => {
                    data = data.data
                    this.departments = data.resultObject
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
                this.$http.delete("/employee/" + row.id).then((data) => {
                    this.listLoading = false;
                    data = data.data;
                    if (data.success) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        //从第一页开始查询
                        this.query.currentPage = 1;
                        this.getEmployees();
                    } else {
                        this.$message({
                            message: '删除失败',
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
            //department可能为null，给department赋值
            if (!this.saveForm.department) {
                this.saveForm.department = {
                    id: null
                }
            }
            //进入页面获取所有部门信息
            this.getDepartments()
        },
        //显示新增界面
        handleAdd: function () {
            this.saveFormVisible = true;
            this.saveForm = {
                username: '',
                password: '',
                email: "",
                headImage: '',
                age: 1,
                department: {
                    id: null
                },
            };
            this.getDepartments()
        },
        //取消提交
        cancelSaveSubmit() {
            //删除上传的图片
            // if (this.saveForm.headImage) {
            //     console.log(this.saveForm.headImage)
            //     this.deleteHeadImage(this.saveForm.headImage)
            // }
            this.saveFormVisible = false
        },
        //新增
        saveSubmit: function () {
            //对表单数据进行校验
            this.$refs.saveForm.validate((valid) => {
                if (valid) {
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
                                this.getEmployees();
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
                this.$http.patch("/employee", ids)
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
                            this.getEmployees();
                        } else {
                            this.$message({
                                message: '删除失败',
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
        this.getEmployees();
        //获取token
        this.token = localStorage.getItem("token");
    }
}

</script>

<style scoped>

</style>