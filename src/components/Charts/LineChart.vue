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
    setOptions({ categoryData, valueData } = {}) {
      const options = {
        tooltip: {
          trigger: 'axis'
        },
        // dataZoom: [{
        //   startValue: categoryData[categoryData.length - 30]
        // }, {
        //   type: 'inside'
        // }, {
        //   type: 'slider'
        // }],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: categoryData
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: valueData,
          type: 'line',
          smooth: true,
          areaStyle: {}
        }]
      };

      this.chart.setOption(options);
    }
  }
};
</script>
