<template>
  <div>
    <div style="margin-bottom:10px;overflow:hidden;">
      <DatePicker
        v-model="selected_get_time"
        type="daterange"
        :clearable="false"
        placement="bottom-end"
        placeholder="选择时间范围"
        style="float: right;width: 200px;"
        :options="datePickerOptions"
        @on-change="changeSelectedTime"
      ></DatePicker>
    </div>
    <Row>
      <Card shadow>
        <div ref="chart-get-overview" style="height: 600px;"></div>
      </Card>
    </Row>
    <div style="margin-bottom:10px;overflow:hidden;">
      <DatePicker
        v-model="selected_spend_time"
        type="daterange"
        :clearable="false"
        placement="bottom-end"
        placeholder="选择时间范围"
        style="float: right;width: 200px;"
        :options="datePickerOptions"
        @on-change="changeSelectedTime"
      ></DatePicker>
    </div>
    <Row>
      <Card shadow>
        <div ref="chart-spend-overview" style="height: 600px;"></div>
      </Card>
    </Row>
  </div>
</template>

<script>
import echarts from "echarts";
import { on, off } from "@/libs/tools";
export default {
  name: "serviceRequests",
  data() {
    return {
      dom: null,
      spendDom: null,
      // 选择的时间范围
      selected_get_time: [],
      selected_spend_time: [],
      option: {
        tooltip: {
          trigger: "axis"
        },
        toolbox: {
          show: true,
          y: "bottom",
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        legend: {
          data: [
            "直接访问",
            "邮件营销",
            "联盟广告",
            "视频广告",
            "搜索引擎",
            "百度",
            "谷歌",
            "必应",
            "其他"
          ]
        },
        xAxis: [
          {
            type: "category",
            splitLine: { show: false },
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          }
        ],
        yAxis: [
          {
            type: "value",
            position: "right"
          }
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "邮件营销",
            type: "bar",
            tooltip: { trigger: "item" },
            stack: "广告",
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "联盟广告",
            type: "bar",
            tooltip: { trigger: "item" },
            stack: "广告",
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "视频广告",
            type: "bar",
            tooltip: { trigger: "item" },
            stack: "广告",
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "搜索引擎",
            type: "line",
            data: [862, 1018, 964, 1026, 1679, 1600, 1570]
          },

          {
            name: "搜索引擎细分",
            type: "pie",
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            center: [160, 130],
            radius: [0, 50],
            itemStyle: {
              normal: {
                labelLine: {
                  length: 20
                }
              }
            },
            data: [
              { value: 1048, name: "百度" },
              { value: 251, name: "谷歌" },
              { value: 147, name: "必应" },
              { value: 102, name: "其他" }
            ]
          }
        ]
      }
    };
  },
  methods: {
    resize() {
      this.dom.resize();
      this.spendDom.resize();
    },
    initSelectedTime() {
      var date = new Date();
      var firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
      var today = new Date(
        Date.parse(
          new Date(date.getFullYear(), date.getMonth(), date.getDate())
        ) + 86399000
      );
      this.selected_time = [firstDate, today];
    },
    buildGetMap() {
      this.dom = echarts.init(this.$refs["chart-get-overview"]);
      this.dom.setOption(this.option);
      on(window, "resize", this.resize);
    },
    buildSpendMap() {
      this.spendDom = echarts.init(this.$refs["chart-spend-overview"]);
      this.spendDom.setOption(this.option);
      on(window, "resize", this.resize);
    }
  },
  mounted() {
    this.initSelectedTime();
    this.buildMap();
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
  }
};
</script>
