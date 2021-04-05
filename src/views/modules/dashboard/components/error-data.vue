<template>
  <el-card class="error-data">
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        <strong>异常监控</strong>
      </el-row>
    </div>
    <el-row type="flex" :gutter="20">
      <el-col v-for="item in list" :key="item.label">
        <h1 class="red">1</h1>
        <div>{{ item.label }}</div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          key: '',
          label: '订单负毛利'
        },
        {
          key: '',
          label: '产品毛利异常'
        },
        {
          key: '',
          label: '客户毛利异常'
        },
        {
          key: '',
          label: '缺货率异常'
        },
        {
          key: '',
          label: '安全库存异常'
        },
        {
          key: '',
          label: '库龄异常'
        },
        {
          key: '',
          label: '退货未回异常'
        },
        {
          key: '',
          label: '未验收异常'
        },
        {
          key: '',
          label: '拒收产品未回'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.error-data {
  margin-top: 20px;
  font-size: 12px;
  text-align: center;
  .red {
    color: red;
  }
  .label {
    color: #666;
  }
}
</style>
