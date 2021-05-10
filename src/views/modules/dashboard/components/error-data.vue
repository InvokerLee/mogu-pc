<template>
  <el-card class="error-data">
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        <strong>异常监控</strong>
      </el-row>
    </div>
    <el-row type="flex" :gutter="20">
      <el-col v-for="item in list" :key="item.label">
        <h1 class="red">{{ obj[item.key] }}</h1>
        <div>{{ item.label }}</div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { exceptionMonitor } from '@/api/dashboard';

export default {
  data() {
    return {
      obj: {},
      list: [
        {
          key: 'orderGrossCount',
          label: '订单负毛利'
        },
        {
          key: 'productGrossCount',
          label: '产品毛利异常'
        },
        {
          key: 'guestGrossCount',
          label: '客户毛利异常'
        },
        {
          key: 'orderOutageCount',
          label: '缺货率异常'
        },
        {
          key: 'safeStoreCount',
          label: '安全库存异常'
        },
        {
          key: 'storeAgeCount',
          label: '库龄异常'
        },
        {
          key: 'returnNoComeInCount',
          label: '退货未回异常'
        },
        {
          key: 'noCheckCount',
          label: '未验收异常'
        },
        {
          key: 'rejectedCount',
          label: '拒收产品未回'
        }
      ]
    };
  },
  created() {
    exceptionMonitor().then(res => {
      this.obj = res.result;
    });
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
