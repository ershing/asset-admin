<template>
  <div>
    <div style="margin-bottom:10px;overflow:hidden;">
      <Select
        v-model="chooseGetMonth"
        style="float: right;width: 200px"
        @on-change="changeMonth(1)"
      >
        <Option v-for="ele of countMonths" :key="ele.key" :value="ele.key">{{ele.value}}</Option>
      </Select>
    </div>
    <Row>
      <Card shadow>
        <div ref="chart-get-overview" style="height: 700px;"></div>
      </Card>
    </Row>
    <div style="margin:20px 0 10px;overflow:hidden;">
      <Select
        v-model="chooseSpendMonth"
        style="float: right;width: 200px"
        @on-change="changeMonth(2)"
      >
        <Option v-for="ele of countMonths" :key="ele.key" :value="ele.key">{{ele.value}}</Option>
      </Select>
    </div>
    <Row>
      <Card shadow>
        <div ref="chart-spend-overview" style="height: 700px;"></div>
      </Card>
    </Row>
  </div>
</template>

<script>
import { getByChargeType } from "@/api/base";
import echarts from "echarts";
import { on, off } from "@/libs/tools";
export default {
  name: "serviceRequests",
  data() {
    return {
      dom: null,
      spendDom: null,
      // 选择的时间范围
      chooseGetMonth: "",
      chooseSpendMonth: "",
      countMonths: [],
      datePickerOptions: {
        disabledDate(date) {
          var today = new Date();
          return (
            date.valueOf() > Date.now() ||
            date.getFullYear() < today.getFullYear()
          );
        }
      },
      initGet: false,
      initSpend: false,
      getOption: {
        title: {
          text: "月收入概览",
          x: "left"
        },
        tooltip: {
          trigger: "axis"
        },
        toolbox: {
          show: true,
          y: "top",
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
          data: []
        },
        xAxis: [
          {
            type: "category",
            splitLine: { show: false },
            data: []
          }
        ],
        yAxis: [
          {
            type: "value",
            position: "right"
          }
        ],
        series: []
      },
      spendOption: {
        title: {
          text: "月收入概览",
          x: "left"
        },
        tooltip: {
          trigger: "axis"
        },
        toolbox: {
          show: true,
          y: "top",
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
          data: []
        },
        xAxis: [
          {
            type: "category",
            splitLine: { show: false },
            position: "top",
            data: []
          }
        ],
        yAxis: [
          {
            type: "value",
            position: "right"
          }
        ],
        series: []
      }
    };
  },
  methods: {
    resize() {
      this.dom.resize();
      this.spendDom.resize();
    },
    initCountMonths() {
      var todayMonth = new Date().getMonth() + 1;
      while (todayMonth > 0) {
        this.countMonths.unshift({ key: todayMonth, value: todayMonth + "月" });
        todayMonth--;
      }
      this.chooseGetMonth = this.countMonths[this.countMonths.length - 1].key;
      this.chooseSpendMonth = this.countMonths[this.countMonths.length - 1].key;
    },
    getBase(byTheType) {
      var today = new Date();
      var month =
        byTheType === 1 ? this.chooseGetMonth - 1 : this.chooseSpendMonth - 1;
      var year = today.getFullYear();
      var start_charge_time = Date.parse(new Date(year, month, 1));
      var end_charge_time = Date.parse(new Date(year, month + 1, 0));
      getByChargeType({
        start_charge_time,
        end_charge_time,
        charge_type: byTheType
      }).then(res => {
        if (res.data.status) {
          var targetOption = byTheType === 1 ? "getOption" : "spendOption";
          var data = res.data.data;
          this[targetOption].title.text =
            month + 1 + (byTheType === 1 ? "月收入概览" : "月支出概览");
          var earnTargets = data.map(ele => ele.target_id);
          var uniqueEarnTargets = [...new Set(earnTargets)];
          this[targetOption].series = [];
          this[targetOption].legend.data = [];
          if (!res.data.data.length) {
            return byTheType === 1 ? this.buildGetMap() : this.buildSpendMap();
          }
          var days = new Date(year, month + 1, 0).getDate();
          this[targetOption].legend.data = uniqueEarnTargets.map(ele => {
            var name = this.$root.$dict[
              byTheType === 1 ? "earnTargetDict" : "spendingTargetDict"
            ].filter(el => el && el.code === ele)[0].value;
            var datas = [];
            data.forEach(le => {
              if (le.target_id === ele) {
                var monthDate = new Date(le.charge_time).getDate();
                datas[monthDate] = le.count;
              }
            });
            datas.length = days;
            for (let count = 0; count < days; count++) {
              if (!datas[count] && datas[count] !== 0) {
                datas[count] = 0;
              }
            }
            this[targetOption].series.push({
              name: name,
              type: "bar",
              tooltip: { trigger: "item", formatter: "{b} <br/>{a} : {c}元" },
              stack: byTheType === 1 ? "收入方式" : "支出方式",
              data: datas
            });
            return name;
          });
          this[targetOption].xAxis[0].data = [];
          while (days > 0) {
            this[targetOption].xAxis[0].data.unshift(
              month + 1 + "月" + days + "日"
            );
            days--;
          }

          var pieData = [];
          // 扇形图
          this[targetOption].series.forEach(ele => {
            var count = ele.data.reduce((a, b) => a + b);
            pieData.push({ value: count, name: ele.name });
          });
          this[targetOption].series.push({
            name: byTheType === 1 ? "收入分类" : "支出分类",
            type: "pie",
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c}元（{d}%）"
            },
            center: byTheType === 1 ? ["80%", "20%"] : ["80%", "80%"],
            radius: [0, 50],
            itemStyle: {
              normal: {
                labelLine: {
                  length: 20
                }
              }
            },
            data: pieData
          });
          byTheType === 1 ? this.buildGetMap() : this.buildSpendMap();
        }
      });
    },
    getEarnTypeCharge() {
      this.getBase(1);
    },
    getSpendTypeCharge() {
      this.getBase(2);
    },
    buildGetMap() {
      if (!this.initGet) {
        this.dom = echarts.init(this.$refs["chart-get-overview"]);
      }
      this.dom.setOption(this.getOption, true);
      if (!this.initGet) {
        on(window, "resize", this.resize);
        this.initGet = true;
      }
    },
    buildSpendMap() {
      if (!this.initSpend) {
        this.spendDom = echarts.init(this.$refs["chart-spend-overview"]);
      }
      this.spendDom.setOption(this.spendOption, true);
      if (!this.initSpend) {
        on(window, "resize", this.resize);
        this.initSpend = true;
      }
    },
    changeMonth(val) {
      this.getBase(val);
    }
  },
  mounted() {
    this.initCountMonths();
    this.getEarnTypeCharge();
    this.getSpendTypeCharge();
    // this.buildSpendMap();
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
  }
};
</script>
