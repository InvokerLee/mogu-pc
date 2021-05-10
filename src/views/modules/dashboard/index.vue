<template>
  <base-wrapper class="dashboard">
    <daily-data :datas="orderDaily" />

    <el-card class="wait-for-deal">
      <div slot="header" class="clearfix">
        <el-row type="flex" justify="space-between">
          <strong>待处理事务</strong>
          <el-button size="mini" type="primary">刷新</el-button>
        </el-row>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-row type="flex" justify="space-between" class="item">
            <span>待审核订单</span>
            <span>(<span class="num">{{ waitDealEvent.orderCount }}</span>)</span>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row type="flex" justify="space-between" class="item">
            <span>待出库订单</span>
            <span>(<span class="num">{{ waitDealEvent.outStoreCount }}</span>)</span>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row type="flex" justify="space-between" class="item">
            <span>待入库订单</span>
            <span>(<span class="num">{{ waitDealEvent.inStoreCount }}</span>)</span>
          </el-row>
        </el-col>
      </el-row>
    </el-card>

    <fast-nav />

    <error-data />

    <sale-chart />

    <rank-customer />

    <rank-salesman />

    <rank-product />

  </base-wrapper>
</template>

<script>
import dailyData from './components/daily-data';
import fastNav from './components/fast-nav';
import errorData from './components/error-data';
import saleChart from './components/sale-chart';
import rankCustomer from './components/rank-customer';
import rankSalesman from './components/rank-salesman';
import rankProduct from './components/rank-product';

import { currentDayData, orderCount } from '@/api/dashboard';

export default {
  name: 'DashboardAdmin',
  components: {
    dailyData,
    fastNav,
    errorData,
    saleChart,
    rankCustomer,
    rankSalesman,
    rankProduct
  },
  data() {
    return {
      orderDaily: {},
      waitDealEvent: {},
      lineChartData: {
        categoryData: [],
        valueData: []
      },
      pieCardData: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      currentDayData().then(res => {
        this.orderDaily = res.result;
        // this.lineChartData.categoryData = res.data.orderChart.x1;
        // this.lineChartData.valueData = res.data.orderChart.paid;
      });
      orderCount().then(res => {
        this.waitDealEvent = res.result;
      });
      // getPieData().then(res => {
      //   this.pieCardData = res.data;
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  position: relative;

  .wait-for-deal {
    .item {
      // cursor: pointer;
      font-size: 12px;
      // &:hover {
      //   color: #42B983;
      // }
      .num {
        color: red;
      }
    }
  }
}
</style>
