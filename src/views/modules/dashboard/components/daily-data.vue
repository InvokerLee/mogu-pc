<template>
  <el-row :gutter="20" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper">
          <img :src="require('@/assets/imgs/dashboard/u266.png')" alt="">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日订购金额
          </div>
          <div class="card-panel-num">
            <span>￥{{ datas.salesSum }}</span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper">
          <img :src="require('@/assets/imgs/dashboard/u268.png')" alt="">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日发货金额
          </div>
          <div class="card-panel-num">
            <span>￥{{ datas.outStoreSum }}</span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper">
          <img :src="require('@/assets/imgs/dashboard/u289.png')" alt="">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日退货金额
          </div>
          <div class="card-panel-num">
            <span>￥{{ datas.returnSum }}</span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper">
          <img :src="require('@/assets/imgs/dashboard/u256.png')" alt="">
          <el-row type="flex" justify="space-around" align="bottom" style="margin-top: -8px;">
            <img :src="require('@/assets/imgs/dashboard/u258.png')" height="100%" alt="">
            <img :src="require('@/assets/imgs/dashboard/u264.png')" height="100%" alt="">
            <img :src="require('@/assets/imgs/dashboard/u260.png')" height="100%" alt="">
            <img :src="require('@/assets/imgs/dashboard/u262.png')" height="100%" alt="">
          </el-row>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日回单金额
          </div>
          <div class="card-panel-num">
            <span>￥{{ datas.checkSum }}</span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>

export default {
  components: {
  },
  props: {
    datas: {
      type: Object,
      default: function() {
        return {
          salesSum: 0,
          outStoreSum: 0,
          checkSum: 0,
          returnSum: 0
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin: 20px 0px 0 !important;
  padding: 0;
  .card-panel {
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    padding: 20px;
    margin-bottom: 20px;

    .card-panel-icon-wrapper {
      display: flex;
      flex-direction: column;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      .panel-icon {
        font-size: 48px;
      }
    }
    .card-panel-description {
      font-weight: bold;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
