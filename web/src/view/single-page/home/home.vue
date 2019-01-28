<template>
  <div>
    <Row :gutter="20">
      <i-col
        :xs="8"
        :md="8"
        :lg="8"
        v-for="(infor, i) in inforCardData"
        :key="`infor-${i}`"
        style="height: 120px;padding-bottom: 10px;"
      >
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="14" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="资产占比"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="10" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="近三个月弹性支出情况"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import { getFlow, getFlexibleCount } from "@/api/base";
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import { ChartPie, ChartBar } from "_c/charts";
import Example from "./example.vue";
export default {
  name: "home",
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data() {
    return {
      inforCardData: [
        {
          title: "本月资金流（单位：元）",
          icon: "md-person-add",
          count: 0,
          color: "#2d8cf0"
        },
        {
          title: "本月弹性支出（单位：元）",
          icon: "md-locate",
          count: 0,
          color: "#19be6b"
        },
        {
          title: "年资金增长率（单位：%）",
          icon: "md-help-circle",
          count: 0,
          color: "#ff9900"
        }
      ],
      pieData: [
        { value: 135, name: "活期存储" },
        { value: 234, name: "定期存储" },
        { value: 1548, name: "货币基金" },
        { value: 335, name: "债券基金" },
        { value: 310, name: "指数基金" },
        { value: 310, name: "股票基金" },
        { value: 310, name: "混合基金" },
        { value: 310, name: "外汇存储" }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321
      }
    };
  },
  mounted() {
    this.getMonthFlow();
    this.getMonthFlexibleSpending();
  },
  methods: {
    getMonthFlow() {
      var today = new Date();
      var params = {
        start_charge_time: Date.parse(
          new Date(today.getFullYear(), today.getMonth(), 1)
        ),
        end_charge_time: Date.parse(today)
      };
      getFlow(params).then(res => {
        if (res.data.status) {
          this.inforCardData[0].count = res.data.data;
        }
      });
    },
    getMonthFlexibleSpending() {
      var today = new Date();
      var params = {
        start_charge_time: Date.parse(
          new Date(today.getFullYear(), today.getMonth(), 1)
        ),
        end_charge_time: Date.parse(today)
      };
      getFlexibleCount().then(res => {
        if (res.data.status) {
          this.inforCardData[1].count = res.data.data;
        }
      });
    },
    getAssetProportion() {
      // if()
    }
  }
};
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
