<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import resize from './mixins/resize';

export default {
  mixins: [resize],
  props: {
    title: {
      type: String,
      default: '',
    },
    datas: {
      type: Array,
      default: () => [],
    },
    className: {
      type: String,
      default: 'pieChart',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '300px',
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    datas() {
      this.initChart();
    },
  },
  mounted() {
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');

      this.chart.setOption({
        title: {
          text: this.title,
          left: 10,
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        // legend: {
        //   left: 'center',
        //   bottom: '10',
        //   data: this.datas.map(item => item.name)
        // },
        calculable: true,
        series: [
          {
            name: '需求统计',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.datas,
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
          },
        ],
      }, true);
    },
  },
};
</script>
