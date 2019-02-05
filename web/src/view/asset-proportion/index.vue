<template>
  <div>
    <Row :gutter="20">
      <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
        <Card shadow v-if="pieData.length">
          <chart-pie style="height: 600px;" :value="pieData" text="现今资产模块分类占比"></chart-pie>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="20">
      <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
        <Card shadow v-if="pieData2.length">
          <chart-pie style="height: 600px;" :value="pieData2" text="现今各项资产占比"></chart-pie>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <asset-overview ref="overviews" style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import {
  getAsset,
  assetNowProfit,
  assetOriginProfit,
  assetTrend,
  getDictClass
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
      pieData: [],
      pieData2: []
    };
  },
  mounted() {
    this.getAssetList();
  },
  methods: {
    getAssetList() {
      var saveProfitList = [];
      getAsset().then(res => {
        if (res.data.status) {
          var assetList = res.data.data || [];
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
                  this.pieData2 = [];
                  saveProfitList.forEach(ele => {
                    this.pieData2.push({
                      value: ele.nowProfit,
                      name: ele.asset_name
                    });
                  });

                  var count = 0;
                  saveProfitList.forEach(ele => {
                    assetOriginProfit({ asset_id: ele.asset_id }).then(res3 => {
                      if (res3.data.status) {
                        ele.originProfit = res3.data.data;
                        count++;
                      }
                      if (count === saveProfitList.length) {
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

                        //分类
                        getDictClass({ dict_name: "MODULE_CLASSIFY" }).then(
                          res => {
                            if (res.data.status) {
                              var ModuleClassDict = res.data.data;
                              this.pieData = [];
                              var classFormatList = [];
                              formatSaveProfitList.forEach((ele, index) => {
                                if (ele && ele.length) {
                                  if (
                                    !this.$root.$dict.moduleDict.filter(
                                      el => el && el.code === index
                                    )[0].classify_id
                                  ) {
                                    if (classFormatList[0]) {
                                      classFormatList[0].push(ele);
                                    } else {
                                      classFormatList[0] = [ele];
                                    }
                                    return;
                                  }
                                  if (
                                    !classFormatList[
                                      ModuleClassDict.filter(
                                        md =>
                                          md.id ===
                                          this.$root.$dict.moduleDict.filter(
                                            el => el && el.code === index
                                          )[0].classify_id
                                      )[0].code
                                    ]
                                  ) {
                                    classFormatList[
                                      ModuleClassDict.filter(
                                        md =>
                                          md.id ===
                                          this.$root.$dict.moduleDict.filter(
                                            el => el && el.code === index
                                          )[0].classify_id
                                      )[0].code
                                    ] = [ele];
                                  } else {
                                    classFormatList[
                                      ModuleClassDict.filter(
                                        md =>
                                          md.id ===
                                          this.$root.$dict.moduleDict.filter(
                                            el => el && el.code === index
                                          )[0].classify_id
                                      )[0].code
                                    ].push(ele);
                                  }
                                }
                              });

                              classFormatList.forEach((ele, ind) => {
                                var value = 0;
                                if (ele && ele.length) {
                                  ele.forEach(el => {
                                    value += el.reduce(
                                      (a, b) => a + b.nowProfit,
                                      0
                                    );
                                  });
                                  this.pieData.push({
                                    value,
                                    name:
                                      ind === 0
                                        ? "其他未分类"
                                        : ModuleClassDict.filter(
                                            el => el && el.code === ind
                                          )[0].value
                                  });
                                }
                              });
                            }
                          }
                        );

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
      // var colors = [
      //   "#ffff00",
      //   "#ffcc33",
      //   "#ff9966",
      //   "#ff6699",
      //   "#ff33cc",
      //   "#ff00ff",
      //   "#9900ff",
      //   "#9933cc",
      //   "#996699",
      //   "#999966",
      //   "#99cc33",
      //   "#99ff00",
      //   "#00ff33",
      //   "#00cc66",
      //   "#009999",
      //   "#0066cc",
      //   "#0033ff",
      //   "#3300ff",
      //   "#3300cc",
      //   "#330099"
      // ];
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
              data: monthData
            });
            this.$refs.overviews.option.legend.data.push(ele.asset_name);
            if (series.length === assetData.length) {
              this.$refs.overviews.option.series = series;
              this.$refs.overviews.loadMap();
            }
          }
        });
      });
    }
  }
};
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
