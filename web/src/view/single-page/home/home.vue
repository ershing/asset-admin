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
    <Row :gutter="20" style="margin-top: 10px;" v-if="assetList.length">
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow v-if="pieData.length">
          <chart-pie style="height: 300px;" :value="pieData" text="现今资产模块占比"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow v-if="inforCardData[1].count >= 0">
          <chart-bar style="height: 300px;" :value="barData" text="近三个月弹性支出(元)"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow v-if="assetList.length">
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
      assetList: [],
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
          this.assetList = assetList;
          this.formatTheMap(assetList);
          assetList.forEach(ele => {
            assetNowProfit({
              asset_id: ele.asset_id,
              end_charge_time: Date.parse(new Date())
            }).then(res2 => {
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
                        this.pieData = [];
                        var formatSaveProfitList = [];
                        saveProfitList.forEach(ele => {
                          if (
                            !formatSaveProfitList[ele.belong_module] ||
                            !formatSaveProfitList[ele.belong_module].length
                          ) {
                            formatSaveProfitList[ele.belong_module] = [ele];
                          } else {
                            formatSaveProfitList[ele.belong_module].push(ele);
                          }
                        });
                        formatSaveProfitList.forEach(ele => {
                          var value = 0;
                          if (ele && ele.length) {
                            value = ele.reduce((a, b) => a + b.nowProfit, 0);
                            this.pieData.push({
                              value,
                              name: this.$root.$dict.moduleDict.filter(
                                el => el && el.code === ele[0].belong_module
                              )[0].value
                            });
                          }
                        });

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
      var colors = [
        "#ffff00",
        "#ffcc33",
        "#ff9966",
        "#ff6699",
        "#ff33cc",
        "#ff00ff",
        "#9900ff",
        "#9933cc",
        "#996699",
        "#999966",
        "#99cc33",
        "#99ff00",
        "#00ff33",
        "#00cc66",
        "#009999",
        "#0066cc",
        "#0033ff",
        "#3300ff",
        "#3300cc",
        "#330099"
      ];
      assetData.forEach((ele, index) => {
        assetTrend({
          asset_id: ele.asset_id,
          end_charge_time: Date.parse(new Date())
        }).then(res => {
          if (res.data.status) {
            var monthData = [];
            res.data.data.forEach((ele, ind) => {
              var timeMonth = new Date(ele.time).getMonth() + 1;
              var countdown = timeMonth - 2;
              if (ind === 0) {
                monthData[timeMonth - 1] = ele.profit;
                while (countdown >= 0) {
                  monthData[countdown] = ele.profit;
                  countdown--;
                }
              } else {
                monthData[timeMonth] = ele.profit;
              }
            });

            //补全数据
            var toMonth = new Date().getMonth() + 1;
            while (toMonth > 0) {
              if (!monthData[toMonth]) {
                monthData[toMonth] = monthData[toMonth - 1];
              }
              toMonth--;
            }

            var countBase = 0;
            var baseNum = 0;
            var formatRate = monthData.map((ele, index) => {
              if (!ele || ele == 0) {
                countBase++;
                return 0;
              } else {
                if (index === countBase) {
                  baseNum = ele <= 0 ? ele / 1000 : ele;
                  return baseNum <= 0 ? baseNum : 1;
                } else {
                  console.log('heyjack',parseFloat((ele / baseNum).toFixed(2)))
                  return baseNum <= 0
                    ? parseFloat((ele / 1000).toFixed(2))
                    : parseFloat((ele / baseNum).toFixed(2));
                }
              }
            });

            series.push({
              name: ele.asset_name,
              type: "line",
              // stack: "总量",
              // areaStyle: {
              //   normal: {
              //     color:
              //       index > colors.length - 1
              //         ? colors[colors.length - 1]
              //         : colors[index]
              //   }
              // },
              data: formatRate
            });
            if (series.length === assetData.length) {
              this.$refs.overview.option.series = series;
              this.$refs.overview.loadMap();
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
      getFlexibleCount(params).then(res => {
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
