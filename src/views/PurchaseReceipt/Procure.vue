<template>
    <section>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
        <el-tab-pane label="物资" name="goods">
          <!--工具条-->
          <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
              <el-form-item>
                <el-input v-model="query1.keyword" placeholder="关键字"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" v-on:click="search1">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleAdd1">采购</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="warehousing1" :disabled="this.sels1.length===0">入库</el-button>
              </el-form-item>
            </el-form>
          </el-col>

          <!--列表-->
          <el-table :data="pageInfo1.rows" highlight-current-row v-loading="listLoading1" @selection-change="selsChange1"
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
            <el-table-column prop="description" label="描述" sortable>
            </el-table-column>
            <el-table-column prop="type.name" label="类型" sortable>
            </el-table-column>
            <el-table-column prop="seller.name" label="商家" sortable>
            </el-table-column>
            <el-table-column prop="status" label="状态" sortable>
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0" style="color: #5e7382">
                 未入库
                </span>
                <span v-else-if="scope.row.status === 1" style="color: #dea726">
                   审批中
                </span>
                <span v-else-if="scope.row.status === 2" style="color: #11b95c">
                   已入库
                </span>
                <span v-else-if="scope.row.status === -1" style="color: #e64242">
                   入库失败
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
              <template scope="scope">
                <el-button size="small" @click="handleEdit1(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" size="small" @click="handleDel1(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove1" :disabled="this.sels1.length===0">批量删除</el-button>
            <el-pagination
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
                :current-page="query1.currentPage"
                :page-sizes="pageSizes1"
                :page-size="query1.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageInfo1.total">
            </el-pagination>
          </el-col>

          <!--新增界面-->
          <el-dialog title="采购" :visible.sync="saveFormVisible1" :close-on-click-modal="false">
            <el-form :model="saveForm1" label-width="80px" :rules="saveFormRules1" ref="saveForm1">
              <el-form-item label="名称">
                <el-input v-model="saveForm1.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="价格">
                <el-input v-model="saveForm1.price" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="数量">
                <el-input v-model="saveForm1.count" auto-complete="off" :min="1"></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="saveForm1.description" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="saveForm1.typeId">
                  <el-option :value="item.id" :label="item.name" v-for="item in goodsTypes"/>
                </el-select>
              </el-form-item>
              <el-form-item label="商家">
                <el-select v-model="saveForm1.sellerId">
                  <el-option :value="item.id" :label="item.name" v-for="item in sellers"/>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click.native="saveFormVisible1=false">取消</el-button>
              <el-button type="primary" @click.native="saveSubmit1" :loading="saveLoading1">提交</el-button>
            </div>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="设备" name="device">
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
                <el-button type="primary" @click="handleAdd">采购</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="warehousing" :disabled="this.sels.length===0">入库</el-button>
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
            <el-table-column prop="price" label="价格" sortable>
            </el-table-column>
            <el-table-column prop="count" label="数量" sortable>
            </el-table-column>
            <el-table-column prop="dateofmanufacture" label="生产日期" sortable>
            </el-table-column>
            <el-table-column prop="qualityguaranteeperiod" label="保质期" sortable>
            </el-table-column>
            <el-table-column prop="description" label="描述" sortable>
            </el-table-column>
            <el-table-column prop="type.name" label="类型" sortable>
            </el-table-column>
            <el-table-column prop="seller.name" label="商家" sortable>
            </el-table-column>
            <el-table-column prop="status" label="状态" sortable>
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0" style="color: #5e7382">
                 未入库
                </span>
                <span v-else-if="scope.row.status === 1" style="color: #dea726">
                   审批中
                </span>
                <span v-else-if="scope.row.status === 2" style="color: #11b95c">
                   已入库
                </span>
                <span v-else-if="scope.row.status === -1" style="color: #e64242">
                   入库失败
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
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
              <el-form-item label="名称">
                <el-input v-model="saveForm.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="价格">
                <el-input v-model="saveForm.price" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="数量">
                <el-input v-model="saveForm.count" auto-complete="off" :min="1"></el-input>
              </el-form-item>
              <el-form-item label="生产日期" prop="productionDate">
                <el-date-picker
                    v-model="saveForm.dateofmanufacture"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="保质期(月)">
                <el-input v-model="saveForm.qualityguaranteeperiod" auto-complete="off" type="number" :min="0"></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="saveForm.description" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="saveForm.typeId">
                  <el-option :value="item.id" :label="item.name" v-for="item in devicesTypes"/>
                </el-select>
              </el-form-item>
              <el-form-item label="商家">
                <el-select v-model="saveForm.sellerId">
                  <el-option :value="item.id" :label="item.name" v-for="item in sellers"/>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click.native="saveFormVisible=false">取消</el-button>
              <el-button type="primary" @click.native="saveSubmit" :loading="saveLoading">提交</el-button>
            </div>
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
        
    </section>
</template>

<script>

export default {
    data() {
        return {
          activeName: 'goods', // 当前选中的Tab页名称
          listLoading1: false,
          query1: {
            currentPage: 1,
            pageSize: 10,
            keyword: ""
          },
          pageInfo1: {
            total: 0,
            rows: []
          },
          pageSizes1: [10, 20, 30],
          sels1: [],//列表选中列

          saveFormVisible1: false,//新增界面是否显示
          saveLoading1: false,
          saveFormRules1: {
            key: [
              {required: true, message: '请输入键名', trigger: 'blur'}
            ]
          },
          //新增界面数据
          saveForm1: {
            id:null,
            name: '',
            price: "",
            count:1,
            description: "",
            typeId: null,
            sellerId:null
          },
          goodsTypes: [],
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
                description: "",
                typeId: null,
                qualityguaranteeperiod:1,
                dateofmanufacture:null
            },
            devicesTypes: [],
          sellers: []
        }
    },
    methods: {
      handleTabClick(tab) {
        this.activeName = tab.name; // 更新当前选中的Tab页名称
        if (this.activeName=="goods") {
          this.getGoods();
        }else if (this.activeName=="device"){
          this.getDevices()
        }
      },

      warehousing(){
        //只能入库未入库和入库失败的
        this.sels = this.sels.filter(item=>{
          return item.status==0 || item.status==-1
        })
        var ids = this.sels.map(item => item.id);
        if(ids.length==0){
          this.$message({
            message: "请选中未入库或入库失败的物资进行入库！",
            type: 'error'
          });
          return
        }
        this.$confirm('确认入库选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          this.$http.patch("/nowarehousingdevices/warehousing", ids)
              .then((data) => {
                this.listLoading = false;
                data = data.data;
                if (data.success) {
                  this.$message({
                    message: '入库成功',
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
      },
      warehousing1(){
        //只能入库未入库和入库失败的
        this.sels1 = this.sels1.filter(item=>{
          return item.status==0 || item.status==-1
        })

        var ids = this.sels1.map(item => item.id);
        if(ids.length==0){
          this.$message({
            message: "请选中未入库或入库失败的物资进行入库！",
            type: 'error'
          });
          return
        }
        this.$confirm('确认入库选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading1 = true;
          this.$http.patch("/nowarehousinggoods/warehousing", ids)
              .then((data) => {
                this.listLoading1 = false;
                data = data.data;
                if (data.success) {
                  this.$message({
                    message: '入库成功',
                    type: 'success'
                  });
                  //从第一页开始查
                  this.query1.currentPage = 1;
                  this.getGoods();
                } else {
                  this.$message({
                    message: data.message,
                    type: 'error'
                  });
                }
              })
              .catch(data => {
                this.listLoading1 = false;
                this.$message({
                  message: '网络错误，请稍后再试！',
                  type: 'error'
                });
              })
        }).catch(() => {

        });
      },
      //处理页面查询条数变化时
      handleSizeChange1(val) {
        this.query1.pageSize = val
        this.search1()
      },
      //处理页码变化时
      handleCurrentChange1(val) {
        this.query1.currentPage = val;
        this.getGoods();
      },
      //查询
      search1() {
        this.query1.currentPage = 1;
        this.getGoods();
      },
      //获取列表
      getGoods() {
        this.listLoading1 = true;
        this.$http.post("/nowarehousinggoods", this.query)
            .then(data => {
              this.listLoading1 = false;
              data = data.data
              if (data.success) {
                this.pageInfo1 = data.resultObject;
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
      getGoodsTypes() {
        this.$http.get("/goodsType")
            .then(result=>{
              result = result.data;
              if (result.success) {
                this.goodsTypes = result.resultObject;
              }
            })
      },
      //删除
      handleDel1: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading1 = true;
          this.$http.delete("/nowarehousinggoods/" + row.id).then((data) => {
            this.listLoading1 = false;
            data = data.data;
            if (data.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              //从第一页开始查询
              this.query1.currentPage = 1;
              this.getGoods();
            } else {
              this.$message({
                message: data.message,
                type: 'error'
              });
            }
          });
        }).catch(() => {
          this.listLoading1 = false;
          this.$message({
            message: '网络错误，请稍后重试！',
            type: 'error'
          });
        });
      },
      //显示编辑界面
      handleEdit1: function (index, row) {
        this.saveFormVisible1 = true;
        this.saveForm1 = Object.assign({}, row);
        this.getGoodsTypes()
      },
      //显示新增界面
      handleAdd1: function () {
        this.saveFormVisible1 = true;
        this.saveForm1 = {
          id:null,
          name: '',
          price: "",
          description: "",
          count:1,
          typeId: null,
          sellerId:null
        };
        this.getGoodsTypes()
      },
      //新增
      saveSubmit1: function () {
        //对表单数据进行校验
        this.$refs.saveForm1.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.saveLoading1 = true;
              this.$http.put("/nowarehousinggoods", this.saveForm1).then((data) => {
                this.saveLoading1 = false;
                data = data.data
                if (data.success) {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  });
                  this.saveFormVisible1 = false;
                  this.getGoods();
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
      selsChange1: function (sels) {
        this.sels1 = sels;
      },
      //批量删除
      batchRemove1: function () {
        var ids = this.sels1.map(item => item.id);
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading1 = true;
          this.$http.patch("/nowarehousinggoods", ids)
              .then((data) => {
                this.listLoading1 = false;
                data = data.data;
                if (data.success) {
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  //从第一页开始查
                  this.query1.currentPage = 1;
                  this.getGoods();
                } else {
                  this.$message({
                    message: data.message,
                    type: 'error'
                  });
                }
              })
              .catch(data => {
                this.listLoading1 = false;
                this.$message({
                  message: '网络错误，请稍后再试！',
                  type: 'error'
                });
              })
        }).catch(() => {

        });
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
            this.$http.post("/nowarehousingdevices", this.query)
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
                this.$http.delete("/nowarehousingdevices/" + row.id).then((data) => {
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
                count:1,
                description: "",
                typeId: null,
              sellerId:null
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
                        this.$http.put("/nowarehousingdevices", this.saveForm).then((data) => {
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
                this.$http.patch("/nowarehousingdevices", ids)
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
        this.getGoods();
        this.getSellers()
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
      // 监听 price 的变化，以便同步更新内部的 price 数据
      'saveForm1.price': {
        handler(value) {
          // 移除非数字字符
          const numericValue = value.replace(/[^\d.-]/g, '');
          // 将结果转换为浮点数
          const floatValue = parseFloat(numericValue);
          if (!isNaN(floatValue)) {
            this.saveForm1.price = floatValue;
          } else {
            // 如果输入的不是数字，则重置价格
            this.saveForm1.price = 0;
          }
        },
        deep: true,
      },
  },
}

</script>

<style scoped>

</style>