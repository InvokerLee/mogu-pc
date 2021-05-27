<template>
  <el-card class="section">
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        <strong>业务员业绩排行榜</strong>
      </el-row>
    </div>
    <div>
      <el-row type="flex" justify="end" align="middle">
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
      <bar-chart :chart-data="chartData" />
    </div>
  </el-card>
</template>

<script>
import dayjs from 'dayjs';
import BarChart from '@/components/Charts/BarChart.vue';

export default {
  components: {
    BarChart
  },
  data() {
    return {
      type: 'week',
      date: [],
      chartData: {
        dimensions: ['name', '销售额', '毛利额'],
        source: []
      },
      form: {
        salesType: 'guest',
        startDate: '',
        endDate: '',
        rank: 4
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
      console.log('ss', this.form);
      this.$nextTick(() => {
        this.chartData.source = [
          { name: '3', '销售额': 243.3, '毛利额': 85.8 },
          { name: '2', '销售额': 83.1, '毛利额': 73.4 },
          { name: '1', '销售额': 86.4, '毛利额': 65.2 },
          { name: '44', '销售额': 72.4, '毛利额': 53.9 }
        ];
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.section {
  margin-top: 20px;
    .filter {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      .date-picker {
        width: 240px;
        margin-left: 8px;
      }
    }
}
</style>
