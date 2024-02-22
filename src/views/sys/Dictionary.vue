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
            <el-table-column prop="sn" label="标识" sortable>
            </el-table-column>
            <el-table-column prop="title" label="名称" sortable>
            </el-table-column>
            <el-table-column prop="intro" label="描述" sortable>
            </el-table-column>
            <el-table-column prop="status" label="状态" sortable>
                <template slot-scope="scope">
                    <span v-if="scope.row.status==1" style="color: #11b95c">启用</span>
                    <span v-else="scope.row.status==0" style="color: #11b95c">禁用</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
                <el-form-item label="标识" prop="sn">
                    <el-input v-model="saveForm.sn" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="saveForm.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="saveForm.intro" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="saveForm.status">
                        <el-option :value="0" label="禁用"/>
                        <el-option :value="1" label="启用"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="saveFormVisible=false">取消</el-button>
                <el-button type="primary" @click.native="saveSubmit" :loading="saveLoading">提交</el-button>
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
                sn: [
                    {required: true, message: '请输入标识', trigger: 'blur'}
                ]
            },
            //新增界面数据
            saveForm: {
                id:null,
                sn: '',
                title: "",
                intro: "",
                status:1
            }
        }
    },
    methods: {
        //处理页面查询条数变化时
        handleSizeChange(val) {
            this.query.pageSize = val
            this.search()
        },
        //处理页码变化时
        handleCurrentChange(val) {
            this.query.currentPage = val;
            this.getDictionarys();
        },
        //查询
        search() {
            this.query.currentPage = 1;
            this.getDictionarys();
        },
        //获取列表
        getDictionarys() {
            this.listLoading = true;
            this.$http.post("/dictionary", this.query)
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
                this.$http.delete("/dictionary/" + row.id).then((data) => {
                    this.listLoading = false;
                    data = data.data;
                    if (data.success) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        //从第一页开始查询
                        this.query.currentPage = 1;
                        this.getDictionarys();
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
                id:null,
                sn: '',
                title: "",
                intro: "",
                status:1
            };
        },
        //新增
        saveSubmit: function () {
            //对表单数据进行校验
            this.$refs.saveForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.saveLoading = true;
                        this.$http.put("/dictionary", this.saveForm).then((data) => {
                            this.saveLoading = false;
                            data = data.data
                            if (data.success) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.saveFormVisible = false;
                                this.getDictionarys();
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
                this.$http.patch("/dictionary", ids)
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
                            this.getDictionarys();
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
        this.getDictionarys();
    }
}

</script>

<style scoped>

</style>