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
        <el-table :data="pageInfo.rows" highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="权限名称" width="200" sortable>
            </el-table-column>
            <el-table-column prop="url" label="url路径" width="200" sortable>
            </el-table-column>
            <el-table-column prop="descs" label="描述" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="sn" label="唯一标识" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="parent.name" label="父权限名称" min-width="100" sortable>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
<!--           <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
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
            pageSizes:[10,20,30]
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
            this.getPermissions();
        },
        //查询
        search() {
            this.query.currentPage = 1;
            this.getPermissions();
        },
        //获取权限列表
        getPermissions() {
            this.listLoading = true;
            this.$http.post("/permission/pageList", this.query)
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
        }
    },
    mounted() {
        this.getPermissions();
    }
}

</script>

<style scoped>

</style>