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
          text: "各项资产增长率",
          x: 'center'
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        grid: {
          top: "3%",
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
        series: [
          {
            name: "运营商/网络服务",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {
                color: "#2d8cf0"
              }
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "银行/证券",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {
                color: "#10A6FF"
              }
            },
            data: [257, 358, 278, 234, 290, 150, 310]
          },
          {
            name: "游戏/视频",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {
                color: "#0C17A6"
              }
            },
            data: [379, 268, 354, 269, 310, 800, 358]
          },
          {
            name: "餐饮/外卖",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {
                color: "#4608A6"
              }
            },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "快递/电商",
            type: "line",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: {
              normal: {
                color: "#398DBF"
              }
            },
            data: [-820, -645, -546, -745, -872, -624, -58]
          }
        ]
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
