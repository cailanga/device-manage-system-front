<template>
  <div class="top-left-cmp">
    <div class="dc-left">
      <dv-border-box-5>
        <div class="main-value"><span>1000</span></div>
        <div class="compare-value"><span>已入库</span>81</div>
        <div class="compare-value"><span>未入库</span>15</div>
      </dv-border-box-5>
      <div class="dc-text" style="text-align: left">
        设备数量
        <dv-decoration-3 style="width:200px;height:20px;" />
      </div>
    </div>
    <div class="dc-right">
      <div class="dc-text">
        使用情况
        <dv-decoration-3 style="width:200px;height:20px;" />
      </div>
      <dv-border-box-5 :reverse="true">
        <div class="main-value" style="font-size: 18px!important;"><span style="font-size: 18px!important;">已使用</span>100</div>
        <div class="compare-value"><span>已报废</span>66</div>
        <div class="compare-value"><span>可用</span>9</div>
      </dv-border-box-5>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopLeftCmp'
}
</script>

<style lang="less">
.top-left-cmp {
  display: flex;

  .dc-left, .dc-right {
    width: 50%;
  }

  .dv-border-box-5 {
    height: 60%;
  }

  .dc-text {
    display: flex;
    flex-direction: column;
    height: 40%;
    font-size: 20px;
    padding: 20px;
    box-sizing: border-box;
  }

  .dc-left .dc-text {
    align-items: flex-end;
    justify-content: center;
  }

  .dc-right .dc-text {
    justify-content: flex-start;
    padding-top: 20px;
  }

  .dc-left .dv-border-box-5 {
    padding: 30px;
    box-sizing: border-box;
  }

  .dc-right .dv-border-box-5 {
    padding: 40px;
    padding-left: 75px;
    box-sizing: border-box;
  }

  .main-value {
    font-weight: bold;
    font-size: 18px;

    span {
      font-size: 30px;
      color: #00c0ff;
      margin-right: 15px;
    }
  }

  .compare-value {
    height: 35px;
    line-height: 35px;
    font-size: 18px;

    span {
      margin-right: 15px;
    }
  }
}
</style>
