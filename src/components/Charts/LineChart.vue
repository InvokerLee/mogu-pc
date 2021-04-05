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
    type: {
      type: String,
      default: 'bar',
    },
    className: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '350px',
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      },
    },
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
        title: {
          text: this.title,
          left: 10,
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: false,
            },
            saveAsImage: {
              pixelRatio: 2,
            },
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          bottom: 90,
        },
        dataZoom: [{
          startValue: categoryData[categoryData.length - 30],
        }, {
          type: 'inside',
        }, {
          type: 'slider',
        }],
        xAxis: {
          data: categoryData,
          silent: false,
          splitLine: {
            show: false,
          },
          splitArea: {
            show: false,
          },
        },
        yAxis: {
          splitArea: {
            show: false,
          },
        },
        series: [],
      };
      if (this.isMultiple) {
        const labelOption = {
          show: true,
          position: 'insideBottom',
          distance: 15,
          align: 'left',
          verticalAlign: 'middle',
          rotate: 0,
          formatter: '{c}',
          fontSize: 16,
          rich: {
            name: {
              textBorderColor: '#fff',
            },
          },
        };
        valueData.forEach(item => {
          options.series.push(
            {
              name: item.name,
              type: 'bar',
              barGap: 0,
              label: labelOption,
              data: item.data,
            },
          );
        });
      } else {
        options.series = [{
          type: this.type,
          data: valueData,
          itemStyle: { normal: { label: { show: true }}},

          // Set `large` for large data amount
          // large: true
        }];
      }
      this.chart.setOption(options);
    },
  },
};
</script>
