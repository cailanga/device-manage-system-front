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
<!--                <el-form-item>-->
<!--                    <el-button type="primary" @click="handleAdd">新增</el-button>-->
<!--                </el-form-item>-->
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
            <el-table-column prop="price" label="价格" sortable>
            </el-table-column>
          <el-table-column prop="count" label="数量" sortable>
          </el-table-column>
          <el-table-column prop="useCount" label="已领用数量" sortable>
          </el-table-column>
            <el-table-column prop="dateofmanufacture" label="生产日期" sortable>
            </el-table-column>
            <el-table-column prop="qualityguaranteeperiod" label="保质期" sortable>
            </el-table-column>
            <el-table-column prop="description" label="描述" sortable>
            </el-table-column>
            <el-table-column prop="type.name" label="类型" sortable>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
                <template scope="scope">
                  <el-button v-if="scope.row.count!=scope.row.useCount" size="small" @click="use(scope.$index, scope.row)" type="primary">领用</el-button>
                  <span v-else>该物品已领用完</span>
<!--                  <el-button size="small" @click="useRecord(scope.$index, scope.row)">领用记录</el-button>-->
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
      <!--领用界面-->
      <el-dialog title="领用" :visible.sync="saveFormVisible" :close-on-click-modal="false">
        <el-form :model="saveForm" label-width="80px" :rules="saveFormRules" ref="saveForm">
          <el-form-item label="名称">
            <el-input v-model="saveForm.name" auto-complete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="saveForm.price" auto-complete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="saveForm.count" auto-complete="off" :min="1" :max="saveForm.max" type="number"></el-input>
          </el-form-item>
          <el-form-item label="生产日期" prop="productionDate">
            <el-date-picker
                v-model="saveForm.dateofmanufacture"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="保质期(月)">
            <el-input disabled v-model="saveForm.qualityguaranteeperiod" auto-complete="off" type="number" :min="0"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input disabled v-model="saveForm.description" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select disabled v-model="saveForm.typeId">
              <el-option :value="item.id" :label="item.name" v-for="item in devicesTypes"/>
            </el-select>
          </el-form-item>
          <el-form-item label="商家">
            <el-select disabled v-model="saveForm.sellerId">
              <el-option :value="item.id" :label="item.name" v-for="item in sellers"/>
            </el-select>
          </el-form-item>
          <el-form-item label="领取部门">
            <el-cascader
                v-model="saveForm.deptParent"
                :options="deptTree"
                :props="{
                             checkStrictly: true,
                             label:'name',
                             value:'id',
                             'disabled': 'disabled'
                            }"></el-cascader>
          </el-form-item>
          <el-form-item label="领用人">
            <el-select v-model="saveForm.useId">
              <el-option :value="item.id" :label="item.username" v-for="item in employees"/>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="saveForm.remark" auto-complete="off"></el-input>
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

import employee from "@/views/org/Employee.vue";

export default {
  computed: {
    employee() {
      return employee
    }
  },
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
              count:1,
              max:1,
              description: "",
                typeId: null,
                qualityguaranteeperiod:1,
                dateofmanufacture:null,
              deptParent: {
                id: null
              },
              deptIdPath:null,
              remark:"",
              useId:null
            },
            devicesTypes: [],
          deptTree:[],
          sellers:[],
          employees:[],
        }
    },
    methods: {
        use(index,row){
          this.saveForm = Object.assign({}, row);
          this.saveForm.count = 1
          this.saveForm.max = row.count - row.useCount
          //由于在页面中会调用id，在没有对应对象的数据时，会报错，
          // 因此给对象为null的对象添加id
          if (!this.saveForm.deptParent) {
            //parent为null，此时为一级部门
            this.saveForm.deptParent = {
              id: null
            }
          }else {
            //获取部门id数组
            let path=[];
            if(row.path){
              path = row.deptIdPath
                  .substring(1,row.deptIdPath.lastIndexOf("/"))
                  .split("/")
                  .map(item=>parseInt(item));
            }
            console.log(path)
            this.saveForm.deptParent = path;
          }
          this.getDeptTree();
          this.getDevicesTypes();
          this.getSellers();
          this.getEmployees()
          this.saveFormVisible = true;
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
        //处理页面查询条数变化时
        handleSizeChange(val) {
            this.query.pageSize = val
            this.search()
        },
        //处理页码变化时
        handleCurrentChange(val) {
            this.query.currentPage = val;
            this.getDevices();
        },
        //查询
        search() {
            this.query.currentPage = 1;
            this.getDevices();
        },
        //获取列表
        getDevices() {
            this.listLoading = true;
            this.$http.post("/device", this.query)
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
        getDevicesTypes() {
            this.$http.get("/deviceType")
                .then(result=>{
                    result = result.data;
                    if (result.success) {
                        this.devicesTypes = result.resultObject;
                    }
                })
        },
      getEmployees() {
        this.$http.get("/employee")
            .then(result=>{
              result = result.data;
              if (result.success) {
                this.employees = result.resultObject;
              }
            })
      },
      getSellers() {
        this.$http.get("/seller")
            .then(result=>{
              result = result.data;
              if (result.success) {
                this.sellers = result.resultObject;
              }
            })
      },
        //删除
        handleDel: function (index, row) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                this.$http.delete("/Devices/" + row.id).then((data) => {
                    this.listLoading = false;
                    data = data.data;
                    if (data.success) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        //从第一页开始查询
                        this.query.currentPage = 1;
                        this.getDevices();
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
            this.getDevicesTypes()
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
              userId: null,
            };
            this.getDevicesTypes()
        },
        //新增
        saveSubmit: function () {
            //对表单数据进行校验
            this.$refs.saveForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.saveLoading = true;
                      let parent = this.saveForm.deptParent;
                      if(parent==null||parent.length===0) {
                        //此情况为一级部门
                        this.saveForm.deptParent = {
                          id:null
                        }
                        this.saveForm.deptParentId = null;
                        this.$message({
                          message: "请选择领取部门后在提交！",
                          type: 'error'
                        });
                        return;
                      }else {
                        this.saveForm.deptParent = {
                          id:parent[parent.length-1]
                        }
                        this.saveForm.deptParentId = parent[parent.length-1];
                        if (parent.length==2){
                          this.saveForm.deptIdPath = "/"+parent[0]+"/"+parent[1]
                        }else{
                          this.saveForm.deptIdPath = "/"+parent[0]
                        }
                      }
                      this.saveForm.goodsId=this.saveForm.id;

                      var user = localStorage.getItem('loginUser');
                      if (user) {
                        user = JSON.parse(user);
                        this.saveForm.operatorId = user.id
                      }
                      this.saveForm.id = null;
                      if (this.saveForm.useId==null||this.saveForm.useId==""){
                        this.$message({
                          message: "请选择领取人后在提交！",
                          type: 'error'
                        });
                        return
                      }

                      //设备
                      this.saveForm.type = 2;
                      this.$http.put("/useRecord", this.saveForm).then((data) => {
                            this.saveLoading = false;
                            data = data.data
                            if (data.success) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.saveFormVisible = false;
                                this.getDevices();
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
                this.$http.patch("/device", ids)
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
                            this.getDevices();
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
        this.getDevices();
    },
    watch: {
    // 监听 price 的变化，以便同步更新内部的 price 数据
    'saveForm.price': {
      handler(value) {
        // 移除非数字字符
        const numericValue = value.replace(/[^\d.-]/g, '');
        // 将结果转换为浮点数
        const floatValue = parseFloat(numericValue);
        if (!isNaN(floatValue)) {
          this.saveForm.price = floatValue;
        } else {
          // 如果输入的不是数字，则重置价格
          this.saveForm.price = 0;
        }
      },
      deep: true,
    },
  },
}

</script>

<style scoped>

</style>