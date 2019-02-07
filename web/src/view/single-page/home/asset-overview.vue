<template>
  <div ref="dom"></div>
</template>

<script>
import echarts from "echarts";
import { on, off } from "@/libs/tools";
export default {
  name: "AssetOverview",
  data() {
    return {
      dom: null,
      option: {
        title: {
          text: "各项资产成长情况",
          x: "center"
        },
        tooltip: {
          trigger: "axis",
          formatter: function(params, ticket, callback) {
            var res = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              res +=
                "<br/>" +
                params[i].seriesName +
                " : " +
                (params[i].value * 100).toFixed(0) +
                "%";
            }
            return res;
          }
        },
        legend: {
          data: []
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [
              "0",
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: []
      }
    };
  },
  methods: {
    resize() {
      this.dom.resize();
    },
    loadMap() {
      this.dom = echarts.init(this.$refs.dom);
      this.dom.setOption(this.option);
      on(window, "resize", this.resize);
    }
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
  }
};
</script>
