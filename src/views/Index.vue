<template>
<div style="text-align: center;width: 100%">
  <dv-decoration-5 dur="10" style="width:300px;height:40px;margin: 0px auto" />
  <dv-decoration-11 style="width:500px;height:80px;font-size: 20px;margin: 0px auto">欢迎<span style="color: #1d8ce0">{{user.username}}</span>使用物资设备管理系统</dv-decoration-11>
  <div style="width: 100%" class="titleBottom">
    <dv-decoration-3 style="width:100%;height:30px;text-align: left" />
  </div>
  <div style="margin: 0px auto;width:600px;text-align: center">
    <dv-decoration-7 style="width:150px;height:30px;margin: 0px auto">最近通知</dv-decoration-7>
    <dv-scroll-board @mouseover="chart3TableMouseover" @click="chart3TableClick" :config="config" ref="scrollBoard"
                     style="height: 300px;width: 600px!important;color: #2e6099;margin-top: 20px"/>
    <div class="toolbar"
         style="background: rgba(255,255,255,0.1);text-align: center;margin:0px auto;margin-bottom: 40px">
      <el-pagination
          style=""
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.currentPage"
          :page-sizes="pageSizes"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfo.total">
      </el-pagination>
    </div>
  </div>
  <el-dialog
      title="信息展示"
      :visible.sync="dialogVisible"
      width="50%">
    <el-form label-position="left" label-width="0px"
             class="demo-ruleForm login-container">
      <el-form-item prop="username" label="标题" label-width="5">
        {{showInfo[1]}}
      </el-form-item>
      <el-form-item prop="username" label="内容" label-width="5">
        {{showInfo[2]}}
      </el-form-item>
      <el-form-item prop="username" label="发布时间" label-width="5">
        {{showInfo[3]}}
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
  </el-dialog>

</div>
</template>

<script>


export default {
  name: "Index",
  data(){
    return {
      dialogVisible:false,
      user:{
        username:""
      },
      showInfo:[],
      myChart3:null,
      query: {
        currentPage: 1,
        pageSize: 10,
        keyword: "",
      },
      pageInfo: {
        total: 0,
        rows: []
      },
      pageSizes: [1, 3, 5, 10, 20, 30],
      config: {
        headerBGC: "rgba(0, 192, 255,0.1)",
        oddRowBGC: "rgba(141, 208, 178,0.1)",
        evenRowBGC: "rgba(172, 125, 143,0.1)",
        header: ['标题', '内容', "发布时间"],
        data: [
          // ['行1列1', '行1列2', '行1列3'],
          // ['行2列1', '行2列2', '行2列3'],
          // ['行3列1', '行3列2', '行3列3'],
          // ['行4列1', '行4列2', '行4列3'],
          // ['行5列1', '行5列2', '行5列3'],
          // ['行6列1', '行6列2', '行6列3'],
          // ['行7列1', '行7列2', '行7列3'],
          // ['行8列1', '行8列2', '行8列3'],
          // ['行9列1', '行9列2', '行9列3'],
          // ['行10列1', '行10列2', '行10列3']
        ],
        index: true,
        columnWidth: [50,200,200],
        align: ['left'],
        carousel: 'single'
      },
    }
  },
  mounted() {
    var user = localStorage.getItem('loginUser');
    if (user) {
      user = JSON.parse(user);
      this.user =user
    }
    this.searchNotice();
  },
  methods:{
    //处理页面查询条数变化时
    handleSizeChange(val) {
      this.query.pageSize = val
      this.searchNotice()
    },
    //处理页码变化时
    handleCurrentChange(val) {
      this.query.currentPage = val;
      this.searchNotice();
    },
    searchNotice(){
      this.$http.post('/notice/noticeByPerson', this.query)
          .then(data => {
            // this.totalTypes = response.data.length;
            data = data.data
            this.pageInfo = data.resultObject;
            this.config.data = []
            if(this.pageInfo.total>0){
              this.config.data =this.pageInfo.rows.map(row=>{
                return [row.title,row.content,row.createTime]
              })
            }else {
              this.$message({
                message: '暂无通知信息',
                center: true,
                type: 'warning'
              });
              this.config.data=[]
            }
            this.$refs['scrollBoard'].updateRows(this.config.data)
          })
          .catch(error => {
            console.error('Error fetching data: ', error);
          });
    },
    chart3TableClick(data) {
      this.dialogVisible =true;
      console.log(data)
      this.showInfo = data.row
    },
    chart3TableMouseover(data) {
      // this.dialogVisible =true;
    },
    chart3TableMouseout(data) {
      // this.dialogVisible =false;
    },
  }
}
</script>

<style scoped>
.dv-decoration-3 svg{
  transform-origin: center!important;
}
</style>