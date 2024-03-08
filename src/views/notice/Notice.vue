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
      <!--            <el-table-column type="selection" width="55">-->
      <!--            </el-table-column>-->
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="title" label="标题" sortable>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="content" label="内容">
      </el-table-column>
      <el-table-column prop="createTime" label="发布时间" sortable>
      </el-table-column>
      <el-table-column prop="status" label="状态" sortable>
        <template slot-scope="scope">
              <span v-if="scope.row.status === 1" style="color: #dea726">
                   审批中
                </span>
          <span v-else-if="scope.row.status === 2" style="color: #e64242">
                   审批未通过
                </span>
          <span v-else-if="scope.row.status === 3" style="color: #11b95c">
                   通过
                </span>
        </template>
      </el-table-column>
      <el-table-column prop="operator.username" label="发布人" sortable>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template scope="scope">
          <el-button v-if="scope.row.status!=3" size="small" @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button v-if="scope.row.status!=3" type="danger" size="small" @click="handleDel(scope.$index, scope.row)">
            删除
          </el-button>
          <el-button v-if="scope.row.status==3" type="primary" size="small"
                     @click="handleSetRole(scope.$index, scope.row)">设置可见
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!--            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
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
        <el-form-item label="标题">
          <el-input v-model="saveForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="saveForm.content" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="saveFormVisible=false">取消</el-button>
        <el-button type="primary" @click.native="saveSubmit" :loading="saveLoading">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置人员可见" :visible.sync="setRoleFormVisible" :close-on-click-modal="false">
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
        id: null,
        name: '',
        price: "",
        description: "",
        typeId: null,
      },
      noticeTypes: [],
      //控制设置角色弹框显示和隐藏
      setRoleFormVisible: false,
      setRoleForm: {
        //选中的角色id的集合
        roleIds: [],
        noticeId: null
      },
      //查询到的所有角色，用来设置角色时的下拉列表展示
      roles: []
    }
  },
  methods: {
    //设置角色提交
    setRoleFormSubmit() {
      this.$http.post("/notice/setNoticeRole", this.setRoleForm)
          .then(data => {
            //关闭加载
            this.saveLoading = false;
            data = data.data
            if (data.success) {
              this.$message({
                message: '设置可见角色成功',
                type: 'success'
              });
              //关闭弹框
              this.setRoleFormVisible = false
            } else {
              this.$message({
                message: data.message,
                type: 'error'
              });
            }
          })
    },
    //设置角色弹窗
    handleSetRole(index, row) {
      this.setRoleForm = {
        //选中的角色id的集合
        roleIds: [],
        noticeId: row.id
      }
      this.setRoleFormVisible = true;
      //获取所有角色
      this.getAllRoles();
    },
    //根据通知id获取可见的角色信息
    getNoticeRolesByNoticeId(noticeId) {
      noticeId = noticeId ? noticeId : this.setRoleForm.noticeId
      this.$http.get("/notice/noticeRolesByNoticeId/" + noticeId)
          .then(data => {
            data = data.data
            if (data.success) {
              this.setRoleForm.roleIds = data.resultObject
            } else {
              this.$message({
                message: data.message,
                type: 'error'
              });
            }
          })
          .catch(error => {
            this.$message({
              message: '网络错误，请稍后再试！',
              type: 'error'
            });
          })
    },
    //获取所有角色信息
    getAllRoles() {
      this.$http.get("/role")
          .then(data => {
            data = data.data
            if (data.success) {
              //赋值获取到的值
              this.roles = data.resultObject;
              this.roles.unshift({
                id: 0,
                name: "所有角色"
              })
              //根据通知id获取其角色信息
              this.getNoticeRolesByNoticeId();
            } else {
              this.$message({
                message: data.message,
                type: 'error'
              });
            }
          })
          .catch(error => {
            this.$message({
              message: '网络错误，请稍后再试！',
              type: 'error'
            });
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
      this.getNotice();
    },
    //查询
    search() {
      this.query.currentPage = 1;
      this.getNotice();
    },
    //获取列表
    getNotice() {
      this.listLoading = true;
      this.$http.post("/notice", this.query)
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
    getNoticeTypes() {
      this.$http.get("/noticeType")
          .then(result => {
            result = result.data;
            if (result.success) {
              this.noticeTypes = result.resultObject;
            }
          })
    },
    //删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        this.$http.delete("/notice/" + row.id).then((data) => {
          this.listLoading = false;
          data = data.data;
          if (data.success) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            //从第一页开始查询
            this.query.currentPage = 1;
            this.getNotice();
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
      // this.getNoticeTypes()
    },
    //显示新增界面
    handleAdd: function () {
      this.saveFormVisible = true;
      this.saveForm = {
        id: null,
        name: '',
        price: "",
        description: "",
        typeId: null,
      };
      // this.getNoticeTypes()
    },
    //新增
    saveSubmit: function () {
      //对表单数据进行校验
      this.$refs.saveForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.saveLoading = true;
            this.$http.put("/notice", this.saveForm).then((data) => {
              this.saveLoading = false;
              data = data.data
              if (data.success) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.saveFormVisible = false;
                this.getNotice();
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
        this.$http.patch("/notice", ids)
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
                this.getNotice();
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
    this.getNotice();
  }
}

</script>

<style scoped>

</style>