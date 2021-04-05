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
            <span>(<span class="num">10</span>)</span>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row type="flex" justify="space-between" class="item">
            <span>待出库订单</span>
            <span>(<span class="num">10</span>)</span>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row type="flex" justify="space-between" class="item">
            <span>待入库订单</span>
            <span>(<span class="num">10</span>)</span>
          </el-row>
        </el-col>
      </el-row>
    </el-card>

    <fast-nav />

    <error-data />
    <el-row>
      <line-chart :chart-data="lineChartData" title="30天订单量" />
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="7">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="7">
        <div class="chart-wrapper">
          <pie-chart :datas="pieCardData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="7">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
  </base-wrapper>
</template>

<script>
// 因为这个组件常用故抽出到公共组件库
import LineChart from '@/components/Charts/LineChart';
import PieChart from '@/components/Charts/PieChart';
import BarChart from '@/components/Charts/BarChart';
import dailyData from './components/daily-data';
import fastNav from './components/fast-nav';
import errorData from './components/error-data';

import RaddarChart from './components/RaddarChart';
import { getHomeData, getPieData } from '@/api/dashboard';

export default {
  name: 'DashboardAdmin',
  components: {
    LineChart,
    PieChart,
    BarChart,
    dailyData,
    fastNav,
    errorData,
    RaddarChart
  },
  data() {
    return {
      orderDaily: {},
      lineChartData: {
        categoryData: [],
        valueData: []
      },
      pieCardData: []
    };
  },
  created() {
    // this.fetchData();
  },
  methods: {
    fetchData() {
      getHomeData().then(res => {
        this.orderDaily = res.data.orderDaily;
        this.lineChartData.categoryData = res.data.orderChart.x1;
        this.lineChartData.valueData = res.data.orderChart.paid;
      });
      getPieData().then(res => {
        this.pieCardData = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  position: relative;

  .wait-for-deal {
    .item {
      cursor: pointer;
      font-size: 12px;
      &:hover {
        color: #42B983;
      }
      .num {
        color: red;
      }
    }
  }

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.btns {
  text-align: center;
  height: 280px;
}
</style>
