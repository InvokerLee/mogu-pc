<template>
  <el-card class="sale-chart">
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        <strong>销售统计</strong>
      </el-row>
    </div>
    <div class="content">
      <div class="left">
        <div>
          <div class="title">本周销售金额</div>
          <div class="price">900</div>
          <div class="desc">
            <span class="up">
              <i class="el-icon-caret-top" />
              10%
            </span>
            同比上周
          </div>
        </div>
        <div>
          <div class="title">本周回单金额</div>
          <div class="price">1000</div>
          <div class="desc">
            <span class="down">
              <i class="el-icon-caret-bottom" />
              10%
            </span>
            同比上周
          </div>
        </div>
        <div>
          <div class="title">本周销售金额</div>
          <div class="price">900</div>
          <div class="desc">
            <span class="up">
              <i class="el-icon-caret-top" />
              1%
            </span>
            同比上周
          </div>
        </div>
      </div>
      <div class="right">
        <el-row type="flex" justify="space-between" align="middle">
          <span>订单统计</span>
          <div class="filter">
            <el-radio-group v-model="type" size="mini" @change="change">
              <el-radio-button label="week">本周</el-radio-button>
              <el-radio-button label="month">本月</el-radio-button>
            </el-radio-group>
            <el-date-picker
              v-model="date"
              class="date-picker"
              size="mini"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>
        </el-row>
        <line-chart :chart-data="chartData" :height="'100%'" />
      </div>
    </div>
  </el-card>
</template>

<script>
import dayjs from 'dayjs';
import LineChart from '@/components/Charts/LineChart.vue';
// import { getStatistics } from '@/api/dashboard';

export default {
  components: {
    LineChart
  },
  data() {
    return {
      type: 'week',
      date: [],
      chartData: {
        categoryData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        valueData: []
      },
      form: {
        startDate: '',
        endDate: '',
        sortType: ''
      }
    };
  },
  watch: {
    date(val) {
      if (val) {
        this.form.startDate = val[0];
        this.form.endDate = val[1];
        this.getData();
      }
    }
  },
  created() {
    this.change(this.type);
  },
  methods: {
    change(val) {
      let start, end;
      if (val === 'week') {
        start = dayjs().startOf('week').add('1', 'day').format('YYYY-MM-DD');
        end = dayjs().endOf('week').add('1', 'day').format('YYYY-MM-DD');
      }

      if (val === 'month') {
        start = dayjs().startOf('month').format('YYYY-MM-DD');
        end = dayjs().endOf('month').format('YYYY-MM-DD');
      }

      this.date = [start, end];
    },
    getData() {
      console.log('stat', this.form);
      this.$nextTick(() => {
        this.chartData = {
          categoryData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          valueData: [Math.random() * 1000, 932, 901, 934, 1290, 1330, 1320]
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.sale-chart {
  margin-top: 20px;
  .content {
    display: flex;
    height: 300px;
    font-size: 12px;
    .left {
      width: 180px;
      margin-right: 20px;
      border-right: thin solid #f5f5f5;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .title {
        color: #666;
      }
      .desc {
        color: #999;
        .up {
          color: green;
        }
        .down {
          color: red;
        }
      }
      .price {
        color: #666;
        font-size: 26px;
        padding: 3px 0;
      }
    }
    .right {
      flex-grow: 1;
      .filter {
        display: flex;
        align-items: center;
        .date-picker {
          width: 240px;
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
