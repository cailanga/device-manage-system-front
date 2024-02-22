<template>
    <section class="chart-container">
        <el-row>
            <!--            <el-col :span="12">
                            <div id="chartColumn" style="width:100%; height:400px;"></div>
                        </el-col>
                        <el-col :span="12">
                            <div id="chartBar" style="width:100%; height:400px;"></div>
                        </el-col>-->
            <el-col :span="24">
                <div id="chartLine" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="24">
                <div id="chartPie" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="24">
                <a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import echarts from 'echarts'
export default {
    data() {
        return {
            chartColumn: null,
            chartBar: null,
            chartLine: null,
            chartPie: null,
            countClueSourceData: [],
            countDepositAndCountData: []
        }
    },

    methods: {
        drawColumnChart() {
            this.chartColumn = echarts.init(document.getElementById('chartColumn'));
            this.chartColumn.setOption({
                title: {text: 'Column Chart'},
                tooltip: {},
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            });
        },
        drawBarChart() {
            this.chartBar = echarts.init(document.getElementById('chartBar'));
            this.chartBar.setOption({
                title: {
                    text: 'Bar Chart',
                    subtext: '数据来自网络'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['2011年', '2012年']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
                },
                series: [
                    {
                        name: '2011年',
                        type: 'bar',
                        data: [18203, 23489, 29034, 104970, 131744, 630230]
                    },
                    {
                        name: '2012年',
                        type: 'bar',
                        data: [19325, 23438, 31000, 121594, 134141, 681807]
                    }
                ]
            });
        },
        drawLineChart() {
            let xData = this.countDepositAndCountData.map(item => item.date);
            // let xData = this.countDepositAndCountData.map(item=>item.salesSum);
            let salesData = this.countDepositAndCountData.map(item => item.salesSum)
            let salesCountData = this.countDepositAndCountData.map(item => item.salesCount)
            let series = [
                {
                    name: '定金金额',
                    type: 'line',
                    stack: '金额',
                    yAxisIndex: 0,
                    data: salesData
                },
                {
                    name: '定金笔数',
                    type: 'line',
                    stack: '笔数',
                    yAxisIndex: 1,
                    data: salesCountData
                }
            ]

            this.chartLine = echarts.init(document.getElementById('chartLine'));
            this.chartLine.setOption({
                title: {
                    text: '统计定金金额和定金笔数'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ["定金金额", "定金笔数"]
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: xData
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '定金金额'
                    },
                    {
                        type: 'value',
                        name: '定金笔数'
                    }
                ],
                series: series
            });
        },
        drawPieChart() {
            let nameData = this.countClueSourceData.map(item => item.name);
            this.chartPie = echarts.init(document.getElementById('chartPie'));
            this.chartPie.setOption({
                title: {
                    text: 'Pie Chart',
                    subtext: '查询线索来源统计',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: nameData
                },
                series: [
                    {
                        name: '查询线索来源统计',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: this.countClueSourceData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        },
        drawCharts() {
            // this.drawColumnChart()
            // this.drawBarChart()
            this.getCountClueSource();
            this.getCountDepositAndCount();
            // this.drawLineChart()
            // this.drawPieChart()
        },
        getCountClueSource() {
            this.$http.get("/clue/countcluesource")
                .then(data => {
                    data = data.data
                    if (data.success) {
                        this.countClueSourceData = data.resultObject
                    }
                    this.drawPieChart()
                })
        },
        getCountDepositAndCount() {
            this.$http.get("/deposit/countdepositandcount")
                .then(data => {
                    data = data.data
                    if (data.success) {
                        this.countDepositAndCountData = data.resultObject
                    }
                    this.drawLineChart()
                })
        }
    },

    mounted: function () {
        // this.drawCharts()
    },
    updated: function () {
        this.drawCharts()
    }
}
</script>

<style scoped>
.chart-container {
    width: 100%;
    float: left;
}

/*.chart div {
    height: 400px;
    float: left;
}*/

.el-col {
    padding: 30px 20px;
}
</style>
