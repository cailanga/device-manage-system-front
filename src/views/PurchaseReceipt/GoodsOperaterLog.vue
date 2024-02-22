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
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="pageInfo.rows" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
          <el-table-column prop="type" label="操作类型" sortable>
          </el-table-column>
            <el-table-column prop="description" label="描述" sortable>
            </el-table-column>
          <el-table-column prop="goodsName" label="物资名称" sortable>
          </el-table-column>
            <el-table-column prop="operatorName" label="操作人员" sortable>
            </el-table-column>
            <el-table-column prop="updateTime" label="操作时间" sortable>
            </el-table-column>
        </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
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
                key: [
                    {required: true, message: '请输入键名', trigger: 'blur'}
                ]
            },
            //新增界面数据
            saveForm: {
                id:null,
                name: '',
                price: "",
                description: "",
                typeId: null,
            },
            goodsOperaterLogTypes: []
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
            this.getGoodsOperaterLog();
        },
        //查询
        search() {
            this.query.currentPage = 1;
            this.getGoodsOperaterLog();
        },
        //获取列表
        getGoodsOperaterLog() {
            this.listLoading = true;
            this.$http.post("/goodsOperaterLog", this.query)
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
        getGoodsOperaterLogTypes() {
            this.$http.get("/goodsOperaterLogType")
                .then(result=>{
                    result = result.data;
                    if (result.success) {
                        this.goodsOperaterLogTypes = result.resultObject;
                    }
                })
        },
        //删除
        handleDel: function (index, row) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                this.$http.delete("/goodsOperaterLog/" + row.id).then((data) => {
                    this.listLoading = false;
                    data = data.data;
                    if (data.success) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        //从第一页开始查询
                        this.query.currentPage = 1;
                        this.getGoodsOperaterLog();
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
            this.getGoodsOperaterLogTypes()
        },
        //显示新增界面
        handleAdd: function () {
            this.saveFormVisible = true;
            this.saveForm = {
                id:null,
                name: '',
                price: "",
                description: "",
                typeId: null,
            };
            this.getGoodsOperaterLogTypes()
        },
        //新增
        saveSubmit: function () {
            //对表单数据进行校验
            this.$refs.saveForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.saveLoading = true;
                        this.$http.put("/goodsOperaterLog", this.saveForm).then((data) => {
                            this.saveLoading = false;
                            data = data.data
                            if (data.success) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.saveFormVisible = false;
                                this.getGoodsOperaterLog();
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
                this.$http.patch("/goodsOperaterLog", ids)
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
                            this.getGoodsOperaterLog();
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
        this.getGoodsOperaterLog();
    }
}

</script>

<style scoped>

</style>