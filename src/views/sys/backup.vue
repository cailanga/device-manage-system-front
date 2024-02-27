<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="addTask">新增定时任务</el-button>
                </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="manualBackup">手动备份</el-button>
              </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="pageInfo.rows" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="index" width="60">
            </el-table-column>
          <el-table-column
              show-overflow-tooltip
              prop="cronId"
              width="100"
              label="任务编号"
          >
          </el-table-column>
          <el-table-column
              show-overflow-tooltip
              prop="cronKey"
              label="定时任务完整类名(@之前的)"
              width="300"
          >
          </el-table-column>
          <el-table-column
              show-overflow-tooltip
              prop="cronExpression"
              label="corn表达式"
          >
          </el-table-column>
          <el-table-column
              show-overflow-tooltip
              prop="taskExplain"
              label="定时任务描述"
          >
          </el-table-column>
          <el-table-column
              show-overflow-tooltip
              prop="taskStatus"
              label="状态"
          >
            <template slot-scope="scope" style="text-align: center">
              <span v-show="scope.row.taskStatus==1">已启动</span>
              <span v-show="scope.row.taskStatus==2">已关闭</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope" style="text-align: center">
              <el-button
                  v-if="scope.row.taskStatus==1"
                  size="medium "
                  type="primary"
                  style="margin-top: 5px;margin-left: 10px"
                  @click="closeTask(scope.row)">关闭
              </el-button>
              <el-button
                  v-else
                  size="small "
                  type="primary"
                  style="margin-top: 5px;margin-left: 10px"
                  @click="openTask(scope.row)">启动
              </el-button>
              <el-button
                  size="small "
                  type="primary"
                  style="margin-top: 5px"
                  @click="updateTask(scope.row)">修改
              </el-button>
              <el-button
                  size="small "
                  type="danger"
                  style="margin-top: 5px"
                  @click="deleteTask(scope.row)">删除
              </el-button>
            </template>
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

        <!--新增界面-->
      <el-dialog title="修改任务" :show-close="false" :visible.sync="dialogFormVisible">
        <el-form :model="task">
          <el-form-item label="任务编号" :label-width="formLabelWidth">
            <el-input v-model="task.cronId" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="定时任务完整类名(@前为类名)" :label-width="formLabelWidth">
            <el-input v-model="task.cronKey" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="cron表达式" :label-width="formLabelWidth">
            <el-input v-model="task.cronExpression" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="任务描述" :label-width="formLabelWidth">
            <el-input v-model="task.taskExplain" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="任务状态" :label-width="formLabelWidth">
            <el-input v-model="task.taskStatusStr" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogFormVisible=false">取消</el-button>
                <el-button type="primary" @click.native="updateTaskOk" :loading="saveLoading">提交</el-button>
            </div>
        </el-dialog>
      <el-dialog title="添加定时任务" :show-close="false" :visible.sync="addDialogFormVisible">
        <el-form :model="taskForm">
          <el-form-item label="定时任务完整类名" :label-width="formLabelWidth">
            <el-input v-model="taskForm.cronKey" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="cron表达式" :label-width="formLabelWidth">
            <el-input v-model="taskForm.cronExpression" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="任务描述" :label-width="formLabelWidth">
            <el-input v-model="taskForm.taskExplain" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="任务状态" :label-width="formLabelWidth">
            <el-select aria-label="Shop order" v-model="taskForm.taskStatus">
              <el-option :value="1" label="开启"/>
              <el-option :value="2" label="关闭"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addTaskCancel">取 消</el-button>
          <el-button type="primary" @click="addTaskOk" :loading="saveLoading">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="手动备份" :show-close="false" :visible.sync="backupDialogFormVisible">
        <el-form :model="backup">
          <el-form-item label="备份描述" :label-width="formLabelWidth">
            <el-input v-model="backup.description" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="backupDialogFormVisible=false">取 消</el-button>
          <el-button type="primary" @click="backupSubmit" :loading="saveLoading">确 定</el-button>
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
                key: [
                    {required: true, message: '请输入键名', trigger: 'blur'}
                ]
            },
            //新增界面数据
            saveForm: {
                id:null,
                key: '',
                value: "",
                intro: ""
            },
          tasks: [],
          task: {
            cronId: "",
            cronKey: "",
            cronExpression: "",
            taskExplain: "",
            taskStatus: "",
            taskStatusStr: "",
          },
          taskForm: {
            cronKey: "",
            cronExpression: "",
            taskExplain: "",
            taskStatus: 1,
          },
          users: [],
          formLabelWidth: "120px",
          dialogFormVisible: false,
          addDialogFormVisible: false,
          backupDialogFormVisible:false,
          backup:{
              operatorId: null,
            description:""
          }
        }
    },
    methods: {
      manualBackup(){
        this.backupDialogFormVisible = true;
      },
      backupSubmit(){
        this.saveLoading = true
        var user = localStorage.getItem('loginUser');
        user = JSON.parse(user);
        this.backup.operatorId=user.id
        this.$http.put("/backup/manual",this.backup)
            .then(data=>{
              data = data.data
              if (data.success){
                this.$message({
                  message: '备份成功',
                  center: true,
                  type: 'success'
                });
                this.backupDialogFormVisible = false;
              }else {
                this.$message({
                  message: '备份失败',
                  center: true,
                  type: 'error'
                });
              }
            })
        this.saveLoading = false
      },
      getTasks: function () {
        this.listLoading=true;
        this.$http.post("/task/taskList",this.query)
            .then(res=>{
              this.pageInfo = res.data.resultObject
            })
        this.listLoading=false;
      },
      addTask: function () {
        this.addDialogFormVisible = true
        this.taskForm = {
          cronKey: "",
          cronExpression: "",
          taskExplain: "",
          taskStatus: 1,
        }
      },
      updateTask: function (row) {
        this.dialogFormVisible = true
        this.task = {
          cronId: row.cronId,
          cronKey: row.cronKey,
          cronExpression: row.cronExpression,
          taskExplain: row.taskExplain,
          taskStatus: row.taskStatus,
          taskStatusStr: row.taskStatus==1?"已开启":"已关闭",
        }
      },
      updateTaskOk: function () {
        if (this.task.cronExplain == ""
            || this.task.cronExpression == "") {
          this.$message({
            message: '请完善信息再提交',
            center: true,
            type: 'warning'
          });
          return;
        }
        this.saveLoading=true
        this.$http.post("/task/updateTask",this.task)
            .then(data=>{
              data =  data.data
              if (data.success){
                this.$message({
                  message: '任务修改成功',
                  center: true,
                  type: 'success'
                });
                this.dialogFormVisible = false;
                this.getTasks()
              }else {
                this.$message({
                  message: '任务修改失败',
                  center: true,
                  type: 'error'
                });
              }
              this.saveLoading = false
            })
      },
      updateTaskCancel: function () {
        this.dialogFormVisible = false;
      },
      addTaskOk: function () {
        if (this.taskForm.cronKey == ""
            || this.taskForm.cronExpression == ""
            || this.taskForm.cronExplain == "") {
          this.$message({
            message: '请将信息填写完整再提交',
            center: true,
            type: 'warning'
          });
          return;
        }
        this.saveLoading = true;
        this.$http.post("/task/addTask",this.taskForm)
            .then(data=>{
              data = data.data
              if (data.success){
                this.$message({
                  message: '任务添加成功',
                  center: true,
                  type: 'success'
                });
                this.addDialogFormVisible = false;
                this.getTasks()
              } else {
                this.$message({
                  message: data.message,
                  center: true,
                  type: 'error'
                });
              }
              this.saveLoading = false
            })
      },
      addTaskCancel: function () {
        this.addDialogFormVisible = false;
        this.taskForm = {
          cronKey: "",
          cronExpression: "",
          cronExplain: "",
          taskStatus: ""
        }
      },
      closeTask: function (row) {
        this.$http.post("/task/changeStatusTaskCron",{
          cronKey: row.cronKey,
          taskStatus: 2
        }).then(data=>{
          data = data.data
          if (data.resultObject) {
            this.$message({
              message: '已成功关闭定时任务',
              center: true,
              type: 'success'
            });
            this.getTasks()
          } else {
            this.$message({
              message: '关闭定时任务失败',
              center: true,
              type: 'error'
            });
          }
        })
      },
      openTask: function (row) {
        this.$http.post("/task/changeStatusTaskCron",{
          cronKey: row.cronKey,
          taskStatus: 1
        }).then(data =>{
          data = data.data
          if (data.resultObject) {
            this.$message({
              message: '已成功开启定时任务',
              center: true,
              type: 'success'
            });
            this.getTasks()
          } else {
            this.$message({
              message: '开启定时任务失败',
              center: true,
              type: 'error'
            });
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
            this.getTasks();
        },
        //查询
        search() {
            this.query.currentPage = 1;
            this.getTasks();
        },
        //获取列表
        getConfigs() {
            this.listLoading = true;
            this.$http.post("/config", this.query)
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
      deleteTask: function (row) {
            this.$confirm('确认删除该任务吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                this.$http.delete("/task/" + row.cronId).then((data) => {
                    this.listLoading = false;
                    data = data.data;
                    if (data.success) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        //从第一页开始查询
                        this.query.currentPage = 1;
                        this.getTasks();
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
                key: '',
                value: "",
                intro: ""
            };
        },
        //新增
        saveSubmit: function () {
            //对表单数据进行校验
            this.$refs.saveForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.saveLoading = true;
                        this.$http.put("/config", this.saveForm).then((data) => {
                            this.saveLoading = false;
                            data = data.data
                            if (data.success) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.saveFormVisible = false;
                                this.getConfigs();
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
                this.$http.patch("/config", ids)
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
                            this.getConfigs();
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
        this.getTasks();
    }
}

</script>

<style scoped>

</style>