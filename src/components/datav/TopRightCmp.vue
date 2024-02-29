<template>
  <div class="top-right-cmp" style="height: 400px">
<!--    <el-select v-model="selectedValue" placeholder="请选择" style="display: inline-block;width: 100px;height: 20px;background: rgba(255,255,255,0.1)!important;">-->
<!--      <el-option-->
<!--          v-for="(item,  index)  in  options"-->
<!--          :key="index"-->
<!--          :label="item.label"-->
<!--          :value="item.value"-->
<!--          style="background: rgba(255,255,255,0.1)!important;"-->
<!--      ></el-option>-->
<!--    </el-select>-->
    <div class="chart-name">
      设备类型统计
      <dv-decoration-3 style="width:120px;height:20px;" />
    </div>
<!--    <dv-charts :option="option1" />-->
    <div style="">
        <div ref="chart2" id="chart-container" class="chart-container"></div>
        <div class="toolbar"
             style="padding-bottom: 0px;background: rgba(255,255,255,0.1);text-align: center">
          <el-form :inline="true">
            <el-form-item>
              <el-input v-model="query.keyword" placeholder="关键字"></el-input>
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
              <el-select v-model="selectedValue" placeholder="请选择">
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
        <div class="toolbar" style="text-align: center">
          <el-pagination
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
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: 'TopRightCmp',
  data () {
    return {
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
      query: {
        currentPage: 1,
        pageSize: 10,
        keyword: ""
      },
      pageInfo: {
        total: 0,
        rows: []
      },
      pageSizes: [1, 3, 5, 10, 20, 30],
      selectedValue: 'bar',
      options: [
        {label: '柱状图', value: 'bar'},
        {label: '折线图', value: 'line'},
        {label: '饼图', value: 'pie'},
      ],
      myChart:null,
      option1: {
        legend: {
          data: [
            {
              name: '收费系统',
              color: '#00baff'
            },
            {
              name: '监控系统',
              color: '#ff5ca9'
            },
            {
              name: '通信系统',
              color: '#3de7c9'
            },
            {
              name: '供配电系统',
              color: '#f5d94e'
            }
          ],
          textStyle: {
            fill: '#fff'
          }
        },
        xAxis: {
          data: [
            '10/01', '10/02', '10/03', '10/04', '10/05', '10/06', '10/07'
          ],
          axisLine: {
            style: {
              stroke: '#999'
            }
          },
          axisLabel: {
            style: {
              fill: '#999'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          data: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            style: {
              stroke: '#999'
            }
          },
          axisLabel: {
            style: {
              fill: '#999'
            }
          },
          axisTick: {
            show: false
          },
          min: 0,
          max: 8
        },
        series: [
          {
            name: '收费系统',
            data: [
              2.5, 3.5, 6.5, 6.5, 7.5, 6.5, 2.5
            ],
            type: 'bar',
            barStyle: {
              fill: 'rgba(0, 186, 255, 0.4)'
            }
          },
          {
            name: '监控系统',
            data: [
              2.5, 3.5, 6.5, 6.5, 7.5, 6.5, 2.5
            ],
            type: 'line',
            lineStyle: {
              stroke: '#ff5ca9'
            },
            linePoint: {
              radius: 4,
              style: {
                fill: '#ff5ca9',
                stroke: 'transparent'
              }
            }
          },
          {
            name: '通信系统',
            data: [
              1.3, 2.3, 5.3, 5.3, 6.3, 5.3, 1.3
            ],
            type: 'line',
            smooth: true,
            lineArea: {
              show: true,
              gradient: ['rgba(55, 162, 218, 0.6)', 'rgba(55, 162, 218, 0)']
            },
            lineStyle: {
              lineDash: [5, 5]
            },
            linePoint: {
              radius: 4,
              style: {
                fill: '#00db95'
              }
            }
          },
          {
            data: [
              0.2, 1.2, 4.2, 4.2, 5.2, 4.2, 0.2
            ],
            type: 'line',
            name: '供配电系统',
            lineArea: {
              show: true,
              gradient: ['rgba(245, 217, 79, 0.8)', 'rgba(245, 217, 79, 0.2)']
            },
            lineStyle: {
              stroke: '#f5d94e'
            },
            linePoint: {
              radius: 4,
              style: {
                fill: '#f5d94e',
                stroke: 'transparent'
              }
            }
          }
        ]
      },
      option:{}
    }
  },
  mounted() {
    this.fetchTotalTypes()
  },
  watch: {
    selectedValue(newVal, oldVal) {
      this.createChartByType(this.myChart,newVal)
      //  在这里添加你的反应逻辑，例如更新其他数据或执行函数
    },
  },
  methods:{
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
      const chartDom = this.$refs.chart2;
      this.myChart = echarts.init(chartDom);
      this.createChartByType(this.myChart, "bar")
      this.myChart.on('click', this.onChartClick);
    },
    createChartByType(type) {
      // var option = {}
      if (type == "line") {
        //折线图
        this.option = {
          title: {
            text: '设备类型数量统计',
            subtext: '折线图演示',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['总数量', '已使用数量'], // 图例数据对应两组数据的显示名称
            bottom: '10'
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
            data: this.dataFromBackend.map(item => item.typeName)
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '总数量',
            data: this.dataFromBackend.map(item => item.total),
            type: 'line',
            areaStyle: {},
            smooth: true,
            lineStyle: {
              width: 3,
              shadowColor: 'rgba(0,0,0,0.4)',
              shadowBlur: 5,
              shadowOffsetY: 5
            },
            itemStyle: {
              color: '#a6c84c',
              borderColor: '#a6c84c',
              borderWidth: 2,
              shadowColor: 'rgba(0,0,0,0.4)',
              shadowBlur: 4
            }
          }, {
            name: '已使用数量',
            data: this.dataFromBackend1.map(item => item.total),
            type: 'line',
            areaStyle: {},
            smooth: true,
            lineStyle: {
              width: 3,
              shadowColor: 'rgba(0,0,0,0.4)',
              shadowBlur: 5,
              shadowOffsetY: 5
            },
            itemStyle: {
              color: '#a6c84c',
              borderColor: '#a6c84c',
              borderWidth: 2,
              shadowColor: 'rgba(0,0,0,0.4)',
              shadowBlur: 4
            }
          }]
        };
      } else if (type == "bar") {
        //柱状图
        this.option = {
          title: {
            text: '设备类型数量统计',
            subtext: '柱状图演示',
            left: 'center'
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
              color: '#333',
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
            data: this.dataFromBackend.map(item => item.typeName)
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '总数量',
            data: this.dataFromBackend.map(item => item.total),
            type: 'bar',
            barWidth: '30%', // 减小柱子宽度
            barGap: '1%', // 设置柱子间隔
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0, color: '#83bff6'
              }, {
                offset: 0.5, color: '#188df0'
              }, {
                offset: 1, color: '#188df0'
              }]),
              shadowColor: 'rgba(0,0,0,0.1)',
              shadowBlur: 10
            }
          }, {
            name: '已使用数量',
            data: this.dataFromBackend1.map(item => item.total),
            type: 'bar',
            barWidth: '30%', // 减小柱子宽度
            barGap: '1%', // 设置柱子间隔
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1, // 渐变方向从上到下
                  [
                    {offset: 0, color: '#ffa726'}, // 渐变起始颜色（橙色）
                    {offset: 0.5, color: '#fb8c00'}, // 渐变中间颜色（深橙色）
                    {offset: 1, color: '#ef5350'} // 渐变终止颜色（红色）
                  ]
              ),
              shadowColor: 'rgba(0,0,0,0.1)',
              shadowBlur: 10
            }
          },],
        };
      } else if (type == "pie") {
        this.option = {
          title: {
            text: '设备类型数量统计',
            subtext: '饼图演示',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
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
                shadowColor: 'rgba(0, 0, 0, 0.5)'
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
                shadowColor: 'rgba(0, 0, 0, 0.5)'
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
                shadowColor: 'rgba(0, 0, 0, 0.5)'
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
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        };
      }
      // chart.setOption(option, true);
    },
    onChartClick(params) {
      const typeName = params.name;
      const item = this.dataFromBackend.find(item => item.typeName === typeName);
      if (item) {
        // 这里可以根据item.typeId发起请求获取更多的数据
        this.fetchDetailData(item.typeId);
      }
    },
    fetchDetailData(typeId) {
      // 发起请求获取数据的逻辑...
      console.log('Fetching details for typeId:', typeId);
      // 实际操作中，可以使用axios或者vue-resource等来请求数据
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
  }
}
</script>

<style lang="less">
.chart-container {
  //display: flex;
  //position: relative;
  //box-sizing: border-box;
  width: 500px;
  height: 400px;
  //display: inline-block;
  /*background: rgba(255,255,255,0.3);*/
  /*color: #f0f0f0;*/
  //z-index: 999;
}
.top-right-cmp {
  position: relative;
  padding: 0 50px;
  box-sizing: border-box;

  .chart-name {
    position: absolute;
    right: 70px;
    text-align: right;
    font-size: 20px;
    top: 10px;
  }
}
</style>
