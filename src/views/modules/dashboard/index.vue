<template>
  <div class="dashboard-editor-container">
    <panel-group :datas="orderDaily" />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" title="30天订单量" />
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="3">
        <div class="chart-wrapper">
          <div class="btns">
            <h3>操作按钮</h3>
            <el-button type="primary" @click="clearCache" v-loading="clearLoading">清空缓存</el-button>
          </div>
        </div>
      </el-col>
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
  </div>
</template>

<script>
// 因为这个组件常用故抽出到公共组件库
import LineChart from '@/components/Charts/LineChart';
import PieChart from '@/components/Charts/PieChart';
import BarChart from '@/components/Charts/BarChart';
import PanelGroup from './components/PanelGroup';
import RaddarChart from './components/RaddarChart';
import { getHomeData, cacheClear, getPieData } from '@/api/dashboard';

export default {
  name: 'DashboardAdmin',
  components: {
    LineChart,
    PieChart,
    BarChart,
    PanelGroup,
    RaddarChart,
  },
  data() {
    return {
      clearLoading: false,
      orderDaily: {},
      lineChartData: {
        categoryData: [],
        valueData: [],
      },
      pieCardData: [],
    };
  },
  created() {
    this.fetchData();
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
    },
    clearCache() {
      this.$confirm('此操作将清空前台缓存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.clearLoading = true;
        cacheClear().then(res => {
          this.$message.success(`操作成功`);
          this.clearLoading = false;
        });
      }).catch(() => {

      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  width: 100%;
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

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
