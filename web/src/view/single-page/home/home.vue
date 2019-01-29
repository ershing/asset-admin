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
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow v-if="pieData.length">
          <chart-pie style="height: 300px;" :value="pieData" text="资产占比"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow v-if="inforCardData[1].count >= 0">
          <chart-bar style="height: 300px;" :value="barData" text="近三个月弹性支出(元)"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <asset-overview ref="overview" style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import {
  getAsset,
  assetNowProfit,
  assetOriginProfit,
  getFlow,
  getFlexibleCount,
  assetTrend
} from "@/api/base";
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import { ChartPie, ChartBar } from "_c/charts";
import AssetOverview from "./asset-overview.vue";
export default {
  name: "Home",
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    AssetOverview
  },
  data() {
    return {
      inforCardData: [
        {
          title: "本月至今资金流(元)",
          icon: "md-person-add",
          count: -1,
          color: "#2d8cf0"
        },
        {
          title: "本月至今弹性支出(元)",
          icon: "md-locate",
          count: -1,
          color: "#19be6b"
        },
        {
          title: "资产年增长率(%)",
          icon: "md-help-circle",
          count: 0,
          color: "#ff9900"
        }
      ],
      pieData: [],
      barData: {}
    };
  },
  mounted() {
    this.getAssetList();
    this.confirmAroundMonth();
    this.getMonthFlow();
    this.getMonthFlexibleSpending();
  },
  methods: {
    getAssetList() {
      var saveProfitList = [];
      getAsset().then(res => {
        if (res.data.status) {
          var assetList = res.data.data || [];
          this.formatTheMap(assetList);
          assetList.forEach(ele => {
            assetNowProfit({ asset_id: ele.asset_id }).then(res2 => {
              if (res2.data.status) {
                saveProfitList.push({
                  nowProfit: res2.data.data,
                  ...ele
                });
                if (saveProfitList.length === assetList.length) {
                  var count = 0;
                  saveProfitList.forEach(ele => {
                    assetOriginProfit({ asset_id: ele.asset_id }).then(res3 => {
                      if (res3.data.status) {
                        ele.originProfit = res3.data.data;
                        count++;
                      }
                      if (count === saveProfitList.length) {
                        this.pieData = saveProfitList.map(ele => ({
                          value: ele.nowProfit,
                          name: this.$root.$dict.moduleDict.filter(
                            el => el && el.code === ele.belong_module
                          )[0].value
                        }));
                        var totalNow = saveProfitList.reduce(
                          (pre, next) => pre + next.nowProfit,
                          0
                        );
                        var totalOrigin = saveProfitList.reduce(
                          (pre, next) => pre + next.originProfit,
                          0
                        );
                        this.inforCardData[2].count =
                          ((totalNow - totalOrigin) * 100) / totalOrigin;
                      }
                    });
                  });
                }
              }
            });
          });
        }
      });
    },
    formatTheMap(assetData) {
      var series = [];
      assetData.forEach(ele => {
        assetTrend({ asset_id: ele.asset_id }).then(res => {
          if (res.data.status) {
            var monthData = [];
            res.data.data.forEach(ele => {
              var timeMonth = new Date(ele.time).getMonth();
              if (monthData[timeMonth] !== undefined) {
                monthData[timeMonth] += ele.profit;
              } else {
                monthData[timeMonth] = ele.profit;
              }
            });
            series.push({
              name: ele.asset_name,
              type: "line",
              stack: "总量",
              areaStyle: {
                normal: {
                  color: "#2d8cf0"
                }
              },
              data: monthData
            });
            if (series.length === assetData.length) {
              this.$refs.overview.option.series = series
              this.$refs.overview.loadMap()
            }
          }
        });
      });
    },
    confirmAroundMonth() {
      var todayMonth = new Date().getMonth();
      if (todayMonth <= 2) {
        this.barData = {
          "1月": 0,
          "2月": 0,
          "3月": 0
        };
      } else {
        this.barData = {
          [todayMonth - 1 + "月"]: 0,
          [todayMonth + "月"]: 0,
          [todayMonth + 1 + "月"]: 0
        };
      }
    },
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
          this.$set(this.barData, today.getMonth() + 1 + "月", res.data.data);
        }
      });
    },
    getAroundFlexibleSpending() {
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
