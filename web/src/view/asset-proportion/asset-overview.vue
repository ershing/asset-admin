<template>
  <div ref="assetDom"></div>
</template>

<script>
import echarts from "echarts";
import { on, off } from "@/libs/tools";
export default {
  name: "AssetOverview",
  data() {
    return {
      assetDom: null,
      option: {
        title: {
          text: "各项资产增长情况",
          x: "left",
          y: "top"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          },
          formatter: function(params, ticket, callback) {
            var res = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              res +=
                "<br/>" +
                params[i].seriesName +
                " : " +
                params[i].value +
                "元";
            }
            return res;
          }
        },
        legend: {
          data: []
        },
        grid: {
          top: "10%",
          left: "1.2%",
          right: "1%",
          bottom: "3%",
          containLabel: true
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
      this.assetDom.resize();
    },
    loadMap() {
      this.assetDom = echarts.init(this.$refs.assetDom);
      this.assetDom.setOption(this.option);
      on(window, "resize", this.resize);
    }
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
  }
};
</script>
