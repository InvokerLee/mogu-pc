<template>
  <div :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import resize from './mixins/resize';

export default {
  mixins: [resize],
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
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
      this.chart = echarts.init(this.$el);
      this.setOptions(this.chartData);
    },
    setOptions({ dimensions, source } = {}) {
      const options = {
        legend: {
          left: 40
        },
        tooltip: {},
        dataset: {
          dimensions,
          source
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            formatter: function(value) {
              var str = '';
              var num = 6; // 每行显示字数
              var valLength = value.length; // 该项x轴字数
              var rowNum = Math.ceil(valLength / num); // 行数

              if (rowNum > 1) {
                for (var i = 0; i < rowNum; i++) {
                  var temp = '';
                  var start = i * num;
                  var end = start + num;

                  temp = value.substring(start, end) + '\n';
                  str += temp;
                }
                return str;
              } else {
                return value;
              }
            }
          }
        },
        yAxis: {},
        series: [
          { type: 'bar' },
          { type: 'bar' }
        ]
      };

      this.chart.setOption(options);
    }
  }
};
</script>
