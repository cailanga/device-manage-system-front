<template>
  <div id="data-view" style="background-color: #f0f0f0">
    <dv-full-screen-container style="background-color: #f0f0f0">
      <dv-border-box10 style="height: 100%;width: 100%;color: gray">
        <dv-border-box1 class="digital-text" style="width:100%;margin: 0px auto;font-size: 25px;font-weight: 500">
          <div style="padding-top:5px;">
            <!--            总体设备数量-->
            <dv-border-box2 style="width: 80%;height: 2%;margin-left: 10%;margin-right: 10%;color: gray;margin-bottom: 0px">
              <div style="text-align: center;margin-bottom: 0px">
                <span style="color: gray" @click="toIndex">设备综合统计</span>
                <dv-border-box-8 dur="10">
                <dv-border-box-8 :reverse="true" dur="10"
                                 style="padding-top: 5px;padding-bottom: 6px;margin: 0px auto;margin-bottom:5px;text-align: center;color: gray">



                  <div style="display: inline-block;margin-right: 10px;">
                    <dv-border-box7 style="text-align: center;padding: 10px;">
                      <div class="digital-text">总设备数量</div>
                      <div class="digital-text" v-text="totalDataInfo.totalNum"></div>
                    </dv-border-box7>
                  </div>
                  <div style="display: inline-block;margin-right: 10px;">
                    <dv-border-box7 style="text-align: center;padding: 10px;">
                      <div class="digital-text">入库设备数量</div>
                      <div class="digital-text" v-text="totalDataInfo.inNum"></div>
                    </dv-border-box7>
                  </div>
                  <div style="display: inline-block;margin-right: 10px;">
                    <dv-border-box7 style="text-align: center;padding: 10px;">
                      <div class="digital-text">未入库设备数量</div>
                      <div class="digital-text" v-text="totalDataInfo.noInNum"></div>
                    </dv-border-box7>
                  </div>
                  <div style="display: inline-block;margin-right: 10px;">
                    <dv-border-box7 style="text-align: center;padding: 10px;">
                      <div class="digital-text">报废设备数量</div>
                      <div class="digital-text" v-text="totalDataInfo.disabledNum"></div>
                    </dv-border-box7>
                  </div>
                  <div style="display: inline-block;margin-right: 10px;">
                    <dv-border-box7 style="text-align: center;padding: 10px;">
                      <div class="digital-text">可用设备数量</div>
                      <div class="digital-text" v-text="totalDataInfo.canUseNum"></div>
                    </dv-border-box7>
                  </div>
                </dv-border-box-8>
                </dv-border-box-8>
              </div>
            </dv-border-box2>
            <!--              设备类型数量-->
            <dv-border-box5
                style="display: inline-block;width: 480px;height:600px!important;;padding: 5px;margin-left: 10px;">
              <div ref="chart" id="chart-container" class="chart-container"
                   style="margin: 20px;color: gray;width: 420px"></div>
              <div class="toolbar"
                   style="padding-bottom: 0px;background: rgba(255,255,255,0.1);width: 450px;text-align: center">
                <el-form :inline="true">
                  <el-form-item style="width: 75px;height: 3px!important;">
                    <el-input style="height: 3px!important;" v-model="query.keyword" placeholder="关键字"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" v-on:click="search">查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" v-on:click="saveChart">导出</el-button>
                  </el-form-item>
                  <!--        <el-form-item>
                            <el-button type="primary" v-on:click="printChart">打印</el-button>
                          </el-form-item>-->
                  <el-form-item>
                    <el-select v-model="selectedValue" placeholder="请选择" style="width: 100px">
                      <el-option
                          v-for="(item,  index)  in  options"
                          :key="index"
                          :label="item.label"
                          :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
              <div class="toolbar" style="background: rgba(255,255,255,0.1);width: 450px;text-align: center">
                <el-pagination
                    style="width: 200px"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="query.currentPage"
                    :page-sizes="pageSizes"
                    :page-size="query.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageInfo.total">
                </el-pagination>
              </div>
            </dv-border-box5>
            <dv-decoration-2 :reverse="true" style="width:5px;height:570px;display: inline-block"/>
            <!--            设备采购趋势-->
            <dv-border-box12 style="display: inline-block;width: 520px;padding: 5px;color: #18c79c;padding-top: 10px">
              <div ref="chart1" id="chart-container1" class="chart-container1"
                   style="width: 520px!important;height:500px;color: gray"></div>
              <div class="toolbar"
                   style="padding-bottom: 0px;background: rgba(255,255,255,0.1);width: 450px;text-align: center;margin-left: 30px">
                <el-form :inline="true">
                  <el-form-item style="width: 80px;height: 3px!important;">
                    <el-input type="number" :min="1" :max="9999" style="height: 3px!important;" v-model="query1.year"
                              placeholder="年"></el-input>
                  </el-form-item>
                  <el-form-item style="width: 80px;height: 3px!important;">
                    <el-input type="number" :min="1" :max="12" style="height: 3px!important;" v-model="query1.month"
                              placeholder="月"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="selectedValue1" placeholder="请选择" style="width: 90px">
                      <el-option
                          v-for="(item,  index)  in  options1"
                          :key="index"
                          :label="item.label"
                          :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" v-on:click="search1">查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" v-on:click="saveChart1">导出</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </dv-border-box12>
            <dv-decoration-2 :reverse="true" style="width:5px;height:570px;display: inline-block"/>
            <dv-decoration-2 :reverse="false" style="width:5px;height:570px;display: inline-block"/>
            <!--            设备价格趋势-->
            <dv-border-box5 :reverse="true" style="display: inline-block;width: 465px;;padding: 5px;margin-left: 10px;">
              <div class="bottom-right-table-1">
                <dv-border-box-6 style="height: 198px;width: 444px">
                  <div class="table-name" style="height: 10px">
                    设备信息
                  </div>
                  <dv-scroll-board @click="chart3TableClick" :config="config" ref="scrollBoard"
                                   style="height: 150px;width: 440px!important;color: #2e6099"/>
                </dv-border-box-6>
                <div ref="chart3" id="chart-container3" class="chart-container3"
                     style="width:450px!important;;color: gray;height: 230px;"></div>
                <div class="toolbar"
                     style="padding-bottom: 0px;background: rgba(255,255,255,0.1);width: 420px;text-align: center">
                  <el-form :inline="true">
                    <el-form-item style="width: 75px;height: 3px!important;">
                      <el-input style="height: 3px!important;" v-model="query3.keyword" placeholder="关键字"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" v-on:click="search3">查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="toolbar"
                     style="background: rgba(255,255,255,0.1);width: 420px;text-align: center;margin-bottom: 40px">
                  <el-pagination
                      style="width: 200px"
                      @size-change="handleSizeChange1"
                      @current-change="handleCurrentChange1"
                      :current-page="query3.currentPage"
                      :page-sizes="pageSizes3"
                      :page-size="query3.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="pageInfo3.total">
                  </el-pagination>
                </div>
              </div>
            </dv-border-box5>
          </div>
        </dv-border-box1>

      </dv-border-box10>
      <!--      设备统计-->
      <el-dialog custom-class="pie-dialog" title="" :show-close="false" :visible.sync="deviceCountShow" :modal-append-to-body="true" :modal="false" class="showTable pie-dialog"
                 width="50%">
        <div class="chart2bg">
          <dv-border-box9 style="height: 500px;text-align: center;padding-top: 20px;padding-left:2px;">
            <div ref="chart2" id="chart-container2" class="chart-container"></div>
          </dv-border-box9>
        </div>
      </el-dialog>

    </dv-full-screen-container>
  </div>


</template>

<script>
import * as echarts from 'echarts';
import Highcharts from "highcharts";
import exporting from "highcharts/modules/exporting";
import darkUnica from "highcharts/themes/dark-unica";

exporting(Highcharts)
darkUnica(Highcharts)

// highchartsMore(Highcharts)
// zhCN(Highcharts)
Highcharts.setOptions({
  global: {
    useUTC: false
  },
  credits: {
    enabled: false // 禁用版权信息
  },
  lang: {
    // 中文语言包的内容
    loading: '加载中...',
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    exportButtonTitle: '导出',
    printButtonTitle: '打印',
    rangeSelectorFrom: '从',
    rangeSelectorTo: '到',
    rangeSelectorZoom: '范围',
    downloadPNG: '下载PNG图片',
    downloadJPEG: '下载JPEG图片',
    downloadPDF: '下载PDF文件',
    downloadSVG: '下载SVG文件',
    resetZoom: '重置缩放',
    resetZoomTitle: '重置为原始大小',
    thousandsSep: ',',
    decimalPoint: '.',
    view_in_fUll_screen: '全屏预览',
    exic_from_fUll_screen: '退出预览',
    printChart: '打印'
    // ...其他语言选项
  }
});
export default {
  name: 'MyChart',
  data() {
    return {
      query1: {
        year: 2024,
        month: 1,
        type: 'year'
      },
      selectedValue1: "year",
      options1: [
        {label: '按年查', value: 'year'},
        {label: '按季度查', value: 'quarter'},
        {label: '按月查', value: 'month'},
      ],
      config: {
        headerBGC: "rgba(0, 192, 255,0.1)",
        oddRowBGC: "rgba(141, 208, 178,0.1)",
        evenRowBGC: "rgba(172, 125, 143,0.1)",
        header: ['设备编号', '设备名称', "最近价格", '最近时间'],
        data: [
          ['行1列1', '行1列2', '行1列3', 1],
          ['行2列1', '行2列2', '行2列3', 1],
          ['行3列1', '行3列2', '行3列3', 1],
          ['行4列1', '行4列2', '行4列3', 1],
          ['行5列1', '行5列2', '行5列3', 1],
          ['行6列1', '行6列2', '行6列3', 1],
          ['行7列1', '行7列2', '行7列3', 1],
          ['行8列1', '行8列2', '行8列3', 1],
          ['行9列1', '行9列2', '行9列3', 1],
          ['行10列1', '行10列2', '行10列3', 1]
        ],
        index: true,
        columnWidth: [50],
        align: ['center'],
        carousel: 'single'
      },
      direction: 'rtl',
      deviceCountShow: false,
      totalDataInfo: {
        //设备总数量
        totalNum: 100,
        //已入库设备数量
        inNum: 10,
        //未入库设备数量
        noInNum: 10,
        //设备已使用数量
        useNum: 50,
        //报废设备数量
        disabledNum: 10,
        //可用设备数量
        canUseNum: 20,

      },
      selectedValue: 'bar',
      options: [
        {label: '柱状图', value: 'bar'},
        {label: '折线图', value: 'line'},
        {label: '饼图', value: 'pie'},
      ],
      query: {
        currentPage: 1,
        pageSize: 10,
        keyword: ""
      },
      pageInfo: {
        total: 0,
        rows: []
      },
      pageSizes3: [1, 3, 5, 10, 20, 30],
      query3: {
        currentPage: 1,
        pageSize: 10,
        keyword: ""
      },
      pageInfo3: {
        total: 0,
        rows: []
      },
      pageSizes: [1, 3, 5, 10, 20, 30],
      myChart: null,
      myChart1: null,
      myChart2: null,
      myChart3: null,
      dataFromBackend: [
        {
          typeId: 1,
          typeName: '电脑',
          total: 100,
        },
        {
          typeId: 2,
          typeName: '手机',
          total: 200,
        },
        {
          typeId: 3,
          typeName: '平板',
          total: 150,
        },
        // 更多类型的数据...
      ],
      //通过设备类型展示设备的信息
      deviceCountData: [
        {
          typeId: 1,
          typeName: '电脑',
          total: 100,
        },
        {
          typeId: 2,
          typeName: '手机',
          total: 200,
        },
        {
          typeId: 3,
          typeName: '平板',
          total: 150,
        },
        // 更多类型的数据...
      ],
      dataFromBackend1: [
        {
          typeId: 1,
          typeName: '电脑',
          total: 50,
        },
        {
          typeId: 2,
          typeName: '手机',
          total: 100,
        },
        {
          typeId: 3,
          typeName: '平板',
          total: 75,
        },
        // 更多类型的数据...
      ],
      chart2XData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      chart2YData: [
        [1500, 1700, 1400, 2000, 1400, 1700, 1500],
        [1000, 1200, 900, 1500, 900, 1200, 1000],
        [500, 600, 300, 750, 450, 600, 500],
        [250, 300, 200, 400, 250, 300, 250]
      ],
      seriesData: [],
      intervalId: null,
      chart3Data: [
        {
          date: "2024-02-27 19:44:55",
          price: 10
        },
        {
          date: "2024-02-27 19:45:55",
          price: 100
        },
        {
          date: "2024-02-27 19:46:55",
          price: 20
        },
        {
          date: "2024-02-27 19:47:55",
          price: 60
        },
        {
          date: "2024-02-27 19:49:55",
          price: 70
        },
        {
          date: "2024-02-27 20:44:55",
          price: 50
        },
        {
          date: "2024-02-27 20:45:55",
          price: 110
        },
        {
          date: "2024-02-27 20:49:55",
          price: 30
        },
        {
          date: "2024-02-27 20:54:55",
          price: 40
        },
        {
          date: "2024-02-27 20:58:55",
          price: 70
        }
      ]
    };
  },
  created() {
    this.loadData();
  },
  watch: {
    selectedValue(newVal, oldVal) {
      this.createChartByType(this.myChart, newVal)
      //  在这里添加你的反应逻辑，例如更新其他数据或执行函数
    },
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose();
    }
    if (this.myChart1) {
      this.myChart1.dispose();
    }
    if (this.myChart2) {
      this.myChart2.dispose();
    }
  },
  methods: {
    getTotalDataInfo() {
      //todo 获取总统计信息
      this.$http.get('/deviceShow/totalDataInfo')
          .then(data => {
            // this.totalTypes = response.data.length;
            this.totalDataInfo = data.data.resultObject
          })
          .catch(error => {
            console.error('Error fetching data: ', error);
          });
    },
    search1() {
      this.chart2XData = ["11", "12", "13", "14"]
      this.chart2YData = [
        [150, 170, 140, 200],
        [100, 120, 90, 150],
        [50, 60, 30, 75],
        [25, 30, 20, 40]
      ]
      this.loadChart1Data()
    },
    loadChart1Data() {
      const option = this.myChart1.getOption();
      option.xAxis[0].data = this.chart2XData
      option.series[0].data = this.chart2YData[1]
      option.series[1].data = this.chart2YData[2]
      option.series[2].data = this.chart2YData[3]
      option.series[3].data = this.chart2YData[0]
      this.myChart1.setOption(option);
    },
    fetchBuyInfos() {
      this.query1.type = this.selectedValue1
      this.$http.post('/deviceShow/countsWithDevice', this.query1)
          .then(data => {
            // this.totalTypes = response.data.length;
            data = data.data.resultObject
            this.chart2XData = data.timeArray
            this.chart2YData = data.data
            this.loadChart1Data()
          })
          .catch(error => {
            console.error('Error fetching data: ', error);
          });
    },
    saveChart1() {
      // 这里假设你已经有了一个名为myChart1的ECharts实例
      this.saveChartAsImage(this.myChart1);
    },
    search3() {
      var chart3TableData1 = [
        ['行11列1', '行11列2', '行11列3', 1],
        ['行12列1', '行12列2', '行12列3', 1],
        ['行13列1', '行13列2', '行13列3', 1],
        ['行14列1', '行14列2', '行14列3', 1],
        ['行15列1', '行15列2', '行15列3', 1],
        ['行16列1', '行16列2', '行16列3', 1],
        ['行17列1', '行17列2', '行17列3', 1],
        ['行18列1', '行18列2', '行18列3', 1],
        ['行19列1', '行19列2', '行19列3', 1],
        ['行20列1', '行20列2', '行20列3', 1]
      ];
      //todo 获取设备信息 this.getDevices()
      //更新后默认展示第一条
      this.chart3TableDataUpdate(chart3TableData1, 1)
    },
    getDevices() {
      this.$http.post('/device', this.query3)
          .then(data => {
            // this.totalTypes = response.data.length;
            data = data.data
            this.pageInfo3 = data.resultObject;
            var rows = [];
            if(this.pageInfo3.total>0){
              var tableData = this.pageInfo.rows
              //todo 还需要对字段处理
            }
              this.chart3TableDataUpdate(rows,1)
          })
          .catch(error => {
            console.error('Error fetching data: ', error);
          });
    },
    chart3TableDataUpdate(rows, index) {
      /**
       * @param {string[][]} rows 更新后的行数据
       * @param {number} index 下次滚动的起始行 （可缺省）
       */
      //click事件（表头无）,mouseover事件，
      //row ceil（数组）rowIndex columnIndex
      this.$refs['scrollBoard'].updateRows(rows, index)
    },
    chart3TableClick(data) {
      this.chart3Data = [
        {
          date: "2024-03-27 19:44:55",
          price: 10
        },
        {
          date: "2024-03-27 19:45:55",
          price: 100
        },
        {
          date: "2024-03-27 19:46:55",
          price: 20
        },
        {
          date: "2024-03-27 19:47:55",
          price: 60
        },
        {
          date: "2024-03-27 19:49:55",
          price: 70
        },
        {
          date: "2024-03-27 20:44:55",
          price: 50
        },
        {
          date: "2024-03-27 20:45:55",
          price: 110
        },
        {
          date: "2024-03-27 20:49:55",
          price: 30
        },
        {
          date: "2024-03-27 20:54:55",
          price: 40
        },
        {
          date: "2024-03-27 20:58:55",
          price: 70
        }
      ];
      //todo 根据点击获取到的设备id获取设备的价格变化
      this.myChart3.update({
        title: {
          text: data.row[1] + "设备价格趋势"
        },
        series: [{
          data: this.chart3Data
        }]
      });
    },
    getDevicePriceChangeInfo(deviceId) {
      this.$http.post('/deviceShow/devicePriceChange/' + deviceId)
          .then(data => {
            // this.totalTypes = response.data.length;
            data = data.data
            this.chart3Data = data.resultObject

          })
          .catch(error => {
            console.error('Error fetching data: ', error);
          });
    },
    activeLastPointToolip(chart) {
      var points = chart.series[0].points;
      chart.tooltip.refresh(points[points.length - 1]);
    },
    clearInterval() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    loadData() {
      this.fetchTotalTypes();
      this.getDevicesUseInfo();
    },
    getDevicesUseInfo() {

      this.createChartByType(this.myChart1, "lineAndBar")
    },
    toIndex() {
      this.$router.push({path: '/device'});
    },
    //处理页面查询条数变化时
    handleSizeChange(val) {
      this.query.pageSize = val
      this.search()
    },
    //处理页码变化时
    handleCurrentChange(val) {
      this.query.currentPage = val;
      this.fetchTotalTypes();
    },
    //处理页面查询条数变化时
    handleSizeChange3(val) {
      this.query3.pageSize = val
      this.search3()
    },
    //处理页码变化时
    handleCurrentChange3(val) {
      this.query3.currentPage = val;
      this.search3()
    },
    //查询
    search() {
      this.query.currentPage = 1;
      this.fetchTotalTypes();
    },
    fetchTotalTypes() {
      this.$http.post('/deviceShow/countsWithType', this.query)
          .then(data => {
            // this.totalTypes = response.data.length;
            data = data.data
            this.pageInfo = data.resultObject;
            // if(this.pageInfo.total>0){
            //   this.dataFromBackend = this.pageInfo.rows
            // }else {
            //   this.dataFromBackend = []
            // }
            this.initChart();

          })
          .catch(error => {
            console.error('Error fetching data: ', error);
          });
    },
    initChart() {
      const chartDom = this.$refs.chart;

      this.myChart = echarts.init(chartDom);

      this.createChartByType(this.myChart, "bar")
      this.myChart.on('click', this.onChartClick);

      var chartDom1 = this.$refs.chart1;
      this.myChart1 = echarts.init(chartDom1);
      this.createChartByType(this.myChart1, "lineAndBar")

      var that = this;
      this.myChart3 = Highcharts.chart(this.$refs.chart3, {
        chart: {
          backgroundColor: {
            linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
            stops: [
              [0, 'rgba(128, 128, 128, 0.1)'], // 开始颜色和透明度
              [1, 'rgba(255, 255, 255, 0.1)'] // 结束颜色和透明度
            ]
          },
          type: 'spline',
          marginRight: 10,
          events: {
            load: function () {
              var series = this.series[0],
                  chart = this;
              that.activeLastPointToolip(chart);
              var i = 0;
              setInterval(function () {
                // var x = (new Date()).getTime(), // 当前时间
                //     y = Math.random();          // 随机值
                if (that.chart3Data.length == 0) {
                  return
                }
                var x = that.chart3Data[i].date
                var y = that.chart3Data[i].price
                series.addPoint([x, y], true, true);
                that.activeLastPointToolip(chart);
                // i=(i+1)%that.chart3Data.length;
                i = (i + 1) % that.chart3Data.length
                // if(i==that.chart3Data.length){
                //   i=0
                // }
              }, 1000);
            }
          }
        },
        title: {
          text: '设备价格趋势',
          style: {
            color: '#3ec0f7' // 设置标题颜色为红色
          }
        },
        xAxis: {
          type: 'category',
          title: {
            text: '购买时间', // 统一说明
            align: 'middle' // 居中显示
          },
          labels: {
            style: {
              fontSize: '10px', // 设置X轴标签的字体大小为10px
              color: '#000'
            }
          },
          tickPixelInterval: 150
        },
        yAxis: {
          title: {
            text: "价格(元)",
            align: 'high' // 居中显示
          },
          labels: {
            align: 'right', // Y轴标签显示在右侧
            x: 5, // 可以调整标签相对于轴线的水平位置
            y: -5, // 可以调整标签相对于轴线的垂直位置
            style: {
              color: '#000'
            }
          }
        },
        tooltip: {
          formatter: function () {
            // return '<b>' + this.series.name + '</b><br/>' +
            //     Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
            //     Highcharts.numberFormat(this.y, 2);
            // return '<b>' + this.series.name + '</b><br/>' +
            //      this.x + '<br/>' +
            //     Highcharts.numberFormat(this.y, 2);
            return '<b>' + this.series.name + '</b><br/>' +
                this.key + '<br/>' +
                Highcharts.numberFormat(this.y, 2);
          },
          backgroundColor: 'rgba(244, 244, 244,0.5)', // 设置提示框背景颜色为白色
          style: {
            color: 'black' // 设置文字颜色为黑色
          }
        },
        legend: {
          enabled: false,
          data: ["时间"]
        },
        series: [{
          name: '价格',
          data: (function () {
            // 生成随机值
            var data = []
            //     time = (new Date()).getTime(),
            //     i;
            // for (i = -19; i <= 0; i += 1) {
            //   data.push({
            //     x: time + i * 1000,
            //     y: Math.random()
            //   });
            // }
            var i;
            for (i = 0; i < that.chart3Data.length; i += 1) {
              var xy = that.chart3Data[i]
              data.push({
                x: xy.date,
                y: xy.price
              });
            }
            return data;
          }())
        }]
      });

    },
    createChartByType(chart, type) {
      var option = {}
      if (type == "line") {
        //折线图
        option = {
          title: {
            text: '设备类型数量统计',
            subtext: '折线图演示',
            left: 'center',
            textStyle: {
              color: '#7ce7fd' // 设置标题文字颜色为红色
            },
            subtextStyle: {
              color: '#858686' // 设置副标题文字颜色为绿色
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [{
              name: '总数量',
              textStyle: {
                color: '#FF0000' // 红色
              },
              icon: 'circle' // 使用圆形图标
            }, {
              name: '已使用数量',
              textStyle: {
                color: '#2f4554' // 绿色
              },
              icon: 'circle' // 使用圆形图标
            }], // 图例数据对应两组数据的显示名称
            bottom: '0',
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '6%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: '#42b883' // 设置 x 轴标签的字体颜色为红色
            },
            data: this.dataFromBackend.map(item => item.typeName)
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              color: '#42b883' // 设置 x 轴标签的字体颜色为红色
            },
          },
          series: [{
            name: '总数量',
            data: this.dataFromBackend.map(item => item.total),
            type: 'line',
            lineArea: {
              show: true,
              gradient: ['rgba(55, 162, 218, 0.6)', 'rgba(55, 162, 218, 0)']
            },
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#fb7293'}, // 0% 处的颜色
                      {offset: 1, color: '#82c2e4'} // 100% 处的颜色
                    ]
                )
              }
            },
            lineStyle: {
              color: '#82c2e4' // 设置折线颜色为红色
            },
            // itemStyle: {
            //   color: '#82c2e4',
            //   borderColor: '#82c2e4',
            //   borderWidth: 2,
            //   shadowColor: 'rgba(24,200,120,0.4)',
            //   shadowBlur: 4,
            //   lineStyle: {
            //     width: 3,
            //     shadowColor: 'rgba(24,200,120,0.4)',
            //     shadowBlur: 5,
            //     shadowOffsetY: 5
            //   },
            // }
          }, {
            name: '已使用数量',
            data: this.dataFromBackend1.map(item => item.total),
            type: 'line',
            lineArea: {
              show: true,
              gradient: ['rgba(255, 0, 0, 0.3)', 'rgba(0, 255, 0, 0.3)']
            },
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#fb7293'}, // 0% 处的颜色
                      {offset: 1, color: '#aaf6aa'} // 100% 处的颜色
                    ]
                )
              }
            },
            lineStyle: {
              color: '#aaf6aa' // 设置折线颜色为红色
            },
            // itemStyle: {
            //   color: '#00ff00',
            //   borderColor: '#aaf6aa',
            //   borderWidth: 2,
            //   shadowColor: 'rgba(24,200,120,0.4)',
            //   shadowBlur: 4,
            //   lineStyle: {
            //     width: 3,
            //     shadowColor: 'rgba(24,200,120,0.4)',
            //     shadowBlur: 5,
            //     shadowOffsetY: 5
            //   },
            // }
          }]
        };
      } else if (type == "bar") {
        //柱状图
        option = {
          title: {
            text: '设备类型数量统计',
            subtext: '柱状图演示',
            left: 'center',
            textStyle: {
              color: '#7ce7fd' // 设置标题文字颜色为红色
            },
            subtextStyle: {
              color: '#858686' // 设置副标题文字颜色为绿色
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['总数量', '已使用数量'],
            textStyle: {
              color: '#42b883',
            },
            bottom: 10,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '20%', // 增加底部的百分比来为X轴标签和图例腾出空间
            containLabel: true // 确保grid区域包含坐标轴的标签
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              color: '#42b883' // 设置 x 轴标签的字体颜色为红色
            },
            data: this.dataFromBackend.map(item => item.typeName)
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              color: '#42b883' // 设置 x 轴标签的字体颜色为红色
            },
          },
          series: [{
            name: '总数量',
            data: this.dataFromBackend.map(item => item.total),
            type: 'bar',
            barWidth: '30%', // 减小柱子宽度
            barGap: '1%', // 设置柱子间隔
            gradient: {
              color: ['rgba(251, 114, 147, .6)', 'rgba(251, 114, 147, .1)']
            },
            barStyle: {
              stroke: '#fb7293'
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#83bff6'
                }, {
                  offset: 0.5, color: '#188df0'
                }, {
                  offset: 1, color: '#188df0'
                }])
              },
              shadowColor: 'rgba(24,200,120,0.1)',
              shadowBlur: 10
            }
          }, {
            name: '已使用数量',
            data: this.dataFromBackend1.map(item => item.total),
            type: 'bar',
            barWidth: '30%', // 减小柱子宽度
            barGap: '1%', // 设置柱子间隔
            gradient: {
              color: ['rgba(251, 114, 147, .6)', 'rgba(251, 114, 147, .1)']
            },
            barStyle: {
              stroke: '#fb7293'
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1, // 渐变方向从上到下
                    [
                      {offset: 0, color: '#ffa726'}, // 渐变起始颜色（橙色）
                      {offset: 0.5, color: '#fb8c00'}, // 渐变中间颜色（深橙色）
                      {offset: 1, color: '#ef5350'} // 渐变终止颜色（红色）
                    ]
                ),
              },
              shadowColor: 'rgba(24,200,120,0.1)',
              shadowBlur: 10
            }
          },],
        };
      } else if (type == "pie") {
        option = {
          title: {
            text: '设备类型数量统计',
            subtext: '饼图演示',
            left: 'center',
            textStyle: {
              color: '#f5eac1' // 设置标题文字颜色为红色
            },
            subtextStyle: {
              color: '#00FF00' // 设置副标题文字颜色为绿色
            }
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: {
              color: '#409eff' // 设置图例文字颜色为红色
            },
            // 假设我们有两个数据集的图例
            data: this.dataFromBackend.concat(this.dataFromBackend1).map(item => item.typeName),
          },
          series: [{
            name: '设备总数量',
            type: 'pie',
            radius: ['40%', '55%'], // 第一个饼图的大小，内半径和外半径
            center: ['50%', '60%'],
            data: this.dataFromBackend.map(item => ({
              value: item.total,
              name: item.typeName
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(24,200,120, 0.5)'
              }
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  // 构建颜色数组
                  var colorList = [
                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                  ];
                  return colorList[params.dataIndex]
                },
                shadowBlur: 200,
                shadowColor: 'rgba(24,200,120, 0.5)'
              }
            }
          }, {
            name: '设备使用数量',
            type: 'pie',
            // radius: '70%',
            center: ['50%', '60%'],
            radius: ['60%', '75%'], // 第二个饼图的大小（如果是环形饼图的话）
            data: this.dataFromBackend1.map(item => ({
              value: item.total,
              name: item.typeName
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(24,200,120, 0.5)'
              }
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  // 构建颜色数组
                  var colorList = [
                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                  ];
                  return colorList[(params.dataIndex + 2) % 15]
                },
                shadowBlur: 200,
                shadowColor: 'rgba(24,200,120, 0.5)'
              }
            }
          }]
        };
      } else if (type == "pie1") {
        option = {
          title: {
            text: '设备数量统计',
            subtext: '饼图演示',
            left: 'center',
            textStyle: {
              color: '#7ce7fd' // 设置标题文字颜色为红色
            },
            subtextStyle: {
              color: '#858686' // 设置副标题文字颜色为绿色
            }
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: {
              color: '#409eff' // 设置图例文字颜色为红色
            },
            // 假设我们有两个数据集的图例
            data: this.deviceCountData.concat(this.dataFromBackend1).map(item => item.typeName),
          },
          series: [{
            name: '设备总数量',
            type: 'pie',
            radius: "70%", // 第一个饼图的大小，内半径和外半径
            center: ['50%', '60%'],
            data: this.deviceCountData.map(item => ({
              value: item.total,
              name: item.typeName
            })),
            insideLabel: {
              show: true
            },
            roseType: true,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(24,200,120, 0.5)'
              }
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  // 构建颜色数组
                  var colorList = [
                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                  ];
                  return colorList[params.dataIndex]
                },
                shadowBlur: 200,
                shadowColor: 'rgba(24,200,120, 0.5)'
              }
            }
          }]
        };
      } else if (type == "lineAndBar") {
        option = {
          title: {
            text: '设备采购趋势',
            subtext: '折线图演示',
            left: 'center',
            textStyle: {
              color: '#7ce7fd' // 设置标题文字颜色为红色
            },
            subtextStyle: {
              color: '#858686' // 设置副标题文字颜色为绿色
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [{
              name: '入库量',
              textStyle: {
                color: '#9d0062' // 红色
              },
              icon: 'circle' // 使用圆形图标
            }, {
              name: '使用量',
              textStyle: {
                color: '#c23531' // 绿色
              },
              icon: 'circle' // 使用圆形图标
            }, {
              name: '维修量',
              textStyle: {
                color: '#2f4554' // 绿色
              },
              icon: 'circle' // 使用圆形图标
            }, {
              name: '报废量',
              textStyle: {
                color: '#00FF00' // 绿色
              },
              icon: 'circle' // 使用圆形图标
            }], // 图例数据对应两组数据的显示名称
            bottom: '0',
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '6%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: true,
            axisLabel: {
              color: '#42b883' // 设置 x 轴标签的字体颜色为红色
            },
            data: this.chart2XData
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              color: '#42b883' // 设置 x 轴标签的字体颜色为红色
            },
          },
          series: [{
            name: '使用量',
            data: this.chart2YData[1],
            type: 'line',
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#fb7293'}, // 0% 处的颜色
                      {offset: 1, color: '#f2f2f2'} // 100% 处的颜色
                    ]
                )
              }
            },
            lineArea: {
              show: true,
              gradient: ['rgba(251, 114, 147, 1)', 'rgba(251, 114, 147, 0)']
            },
            lineStyle: {
              stroke: 'rgba(251, 114, 147, 1)',
              lineDash: [3, 3]
            },
            linePoint: {
              style: {
                stroke: 'rgba(251, 114, 147, 1)'
              }
            },
            // yAxisIndex: 1
          },
            {
              name: '维修量',
              data: this.chart2YData[2],
              type: 'line',
              smooth: true,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        {offset: 0, color: '#fb7293'}, // 0% 处的颜色
                        {offset: 1, color: '#f2f2f2'} // 100% 处的颜色
                      ]
                  )
                }
              },
              lineArea: {
                show: true,
                gradient: ['rgba(251, 114, 147, 1)', 'rgba(251, 114, 147, 0)']
              },
              lineStyle: {
                stroke: 'rgba(251, 114, 147, 1)',
                lineDash: [3, 3]
              },
              linePoint: {
                style: {
                  stroke: 'rgba(251, 114, 147, 1)'
                }
              },
              // yAxisIndex: 1
            },
            {
              name: '报废量',
              data: this.chart2YData[3],
              type: 'line',
              smooth: true,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        {offset: 0, color: 'green'}, // 0% 处的颜色
                        {offset: 1, color: 'yellow'} // 100% 处的颜色
                      ]
                  )
                }
              },
              lineArea: {
                show: true,
                gradient: ['rgba(251, 114, 147, 1)', 'rgba(251, 114, 147, 0)']
              },
              lineStyle: {
                stroke: 'rgba(251, 114, 147, 1)',
                lineDash: [3, 3]
              },
              linePoint: {
                style: {
                  stroke: 'rgba(251, 114, 147, 1)'
                }
              },
              // yAxisIndex: 1
            },
            {
              name: '入库量',
              data: this.chart2YData[0],
              type: 'bar',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        {offset: 0, color: 'red'}, // 0% 处的颜色
                        {offset: 1, color: 'blue'} // 100% 处的颜色
                      ]
                  )
                }
              },
              gradient: {
                color: ['rgba(103, 224, 227, .6)', 'rgba(103, 224, 227, .1)']
              },
              barStyle: {
                stroke: 'rgba(103, 224, 227, 1)'
              }
            }]
        };
      }
      chart.setOption(option, true);
    },
    onChartClick(params) {
      const typeName = params.name;
      const item = this.dataFromBackend.find(item => item.typeName === typeName);
      if (item) {
        // 这里可以根据item.typeId发起请求获取更多的数据
        this.fetchDetailData(item.typeId);
      }
    },
    getDevicesByTypeId(typeId) {
      this.$http.get('/device/devicesByTypeId/'+typeId)
          .then(data => {
            // this.totalTypes = response.data.length;
            this.deviceCountData = data.data.resultObject
            this.deviceCountShow = true;
            this.$nextTick(() => {
              var chartDom1 = this.$refs.chart2;
              if (chartDom1) {
                this.myChart2 = echarts.init(chartDom1);
                // 在这里配置和设置您的图表
                this.createChartByType(this.myChart2, "pie1")
              }
            });
          })
          .catch(error => {
            console.error('Error fetching data: ', error);
          });
    },
    fetchDetailData(typeId) {
      // 发起请求获取数据的逻辑...
      console.log('Fetching details for typeId:', typeId);
      // TODO 图表点击事件通过设备类型id获取设备信息
      // 实际操作中，可以使用axios或者vue-resource等来请求数据
      this.deviceCountShow = true;
      this.$nextTick(() => {
        var chartDom1 = this.$refs.chart2;
        if (chartDom1) {
          this.myChart2 = echarts.init(chartDom1);
          // 在这里配置和设置您的图表
          this.createChartByType(this.myChart2, "pie1")
        }
      });
    },
    // 打印页面
    printChart() {
      window.print();
    },
    saveChart() {
      // 这里假设你已经有了一个名为myChart的ECharts实例
      this.saveChartAsImage(this.myChart);
    },
    // 导出ECharts图表为图片
    saveChartAsImage(myChart) {
      // 使用ECharts提供的getDataURL方法来获取图表的DataURL
      var imgDataUrl = myChart.getDataURL({
        // 指定导出的格式，比如png, jpeg
        type: 'png',
        // 导出的图片分辨率比例，默认是1，可以根据需要设置更高的值提高图片质量
        pixelRatio: 2,
        // 导出的图片背景色，默认是透明的，可以根据需要设置
        backgroundColor: '#fff'
      });

      // 创建一个下载链接
      var link = document.createElement('a');
      link.href = imgDataUrl;

      // 设置下载名称
      link.download = 'echart.png';

      // 对于Firefox，需要将链接添加到DOM中才能正确执行
      document.body.appendChild(link);

      // 模拟点击下载
      link.click();

      // 移除链接
      document.body.removeChild(link);
    },
  },
};
</script>

<style lang="less">
//弹出层
.pie-dialog .el-dialog {
  border: none !important;
  box-shadow: none !important;
  /* background: rgba(0, 0, 0, .2) !important; */
  background: rgba(0, 0, 0, 0) !important;
  //border: rgba(0, 0, 0,0) 0px solid;
  //border: none;
  //backdrop-filter: blur(3px);
}

.pie-dialog .el-dialog__title {
  color: rgba(255, 255, 255,0);
  font-weight: 900;
}

.pie-dialog .el-dialog__header {
  color: #fff;
  height: 0px !important;
  background: rgba(208, 244, 237, 0);
  text-align: center;
  //box-shadow: 0 0 1.5vw rgb(212, 244, 242) inset;
  //background: linear-gradient(#bae5e3, #bae5e3) left top,
  //linear-gradient(#b9e0e2, #b9e0e2) left top,
  //linear-gradient(#b9e0e2, #b9e0e2) right top,
  //linear-gradient(#b9e0e2, #b9e0e2) right top;
  /* linear-gradient(#3deeda, #3deeda) left bottom,
  linear-gradient(#3deeda, #3deeda) left bottom,
  linear-gradient(#3deeda, #3deeda) right bottom,
  linear-gradient(#3deeda, #3deeda) right bottom; */
  //background-repeat: no-repeat;
  //background-size: 2px 20px, 20px 2px;
}

.pie-dialog .el-dialog__body {
  padding: 20px;
  color: #fff;
  //background: rgba(208, 244, 237, 0);
  text-align: left;
  //box-shadow: 0 0 1.5vw rgb(208, 244, 237) inset;
  //background: linear-gradient(#bae5e3, #bae5e3) left bottom,
  //linear-gradient(#bae5e3, #bae5e3) left bottom,
  //linear-gradient(#bae5e3, #bae5e3) right bottom,
  //linear-gradient(#bae5e3, #bae5e3) right bottom;
  //background-repeat: no-repeat;
  //background-size: 2px 20px, 20px 2px;
}

/*.el-form-item__content {
  background-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 0.5vw rgb(57, 255, 255);
  background-repeat: no-repeat;
  border-radius: 10px;
}*/

//.planTitle {
//  padding: 0 0 0 20px;
//  color: #8ae3e9;
//  font-size: 18px;
//  font-weight: 600;
//}
//
//.planContent {
//  color: #e6feff;
//  font-size: 16px;
//}

//.el-button--primary {
//  color: #FFF;
//  background-color: #415b5ec2;
//  border-color: #75fbe9;
//  //position: absolute;
//  //margin-left: 374px;
//}

#data-view {
  width: 100%;
  height: 100%;
  background-color: #030409;
  color: #fff;

  #dv-full-screen-container {
    background-image: url('./1.jpg');
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
  }
}

body {
  margin: 0;
}

@font-face {
  font-family: 'DigitalFont';
  src: url('@/assets/fonts/GAS_____.TTF') format('truetype');
}

.digital-text {
  font-family: 'DigitalFont', sans-serif;
}

.chart-container {
  width: 440px !important;
  height: 400px !important;
  display: inline-block;
  /*background: rgba(255,255,255,0.3);*/
  /*color: #f0f0f0;*/
}

.chart-container1 {
  width: 480px;
  height: 400px;
  display: inline-block;
  /*background: rgba(255,255,255,0.3);*/
  /*color: #f0f0f0;*/
}

.chart-container3 {
  //width: 400px;
  //height: 400px;
  display: inline-block;
  /*background: rgba(255,255,255,0.3);*/
  /*color: #f0f0f0;*/
}

@media print {
  /* 隐藏整个页面的所有元素 */
  /*body * {*/
  /*  display: none;*/
  /*}*/
  /*!* 仅显示图表容器及其内部元素 *!*/
  /*#chart-container,#chart-container1, #chart-container *,#chart-container1 * {*/
  /*  display: block;*/
  /*}*/
  /*!* 确保图表容器在打印页面上居中且宽度适当 *!*/
  /*#chart-container,#chart-container1 {*/
  /*  width: 100%;*/
  /*  height: auto;*/
  /*  position: relative;*/
  /*  overflow: visible;*/
  /*  left: 0;*/
  /*  top: 0;*/
  /*}*/
}

.bottom-right-table-1 {
  width: 480px;
  height: 280px;
  //margin: 0 -5px;

  .border-box-content {
    width: 480px;
    height: 280px;
    padding: 5px;
    box-sizing: border-box;
  }

  .table-name {
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;

    img {
      width: 40px;
      height: 40px;
      margin-right: 5px;
    }
  }

  .dv-scroll-board {
    height: 280px;
    width: 434px;
    padding-bottom: 2px;
  }
}

.highcharts-xaxis-title {
  text-align: center;
}
.chart2bg{
  background-image: url('./1.jpg')
}
</style>
