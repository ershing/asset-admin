<template>
  <div>
    <Row :gutter="20">
      <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
        <Card shadow v-if="pieData.length">
          <chart-pie style="height: 600px;" :value="pieData" text="支出大项分类占比"></chart-pie>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="20">
      <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
        <Card shadow v-if="pieData2.length">
          <chart-pie style="height: 600px;" :value="pieData2" text="支出大项占比"></chart-pie>
        </Card>
      </i-col>
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
export default {
  name: "Home",
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar
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
          assetList.forEach(ele => {
            assetNowProfit({ asset_id: ele.asset_id }).then(res2 => {
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
                                    name: ModuleClassDict.filter(
                                      el => el && el.code === ind
                                    )[0].value
                                  });
                                }
                              });
                            }
                          }
                        );

                        var totalNow = saveProfitList.reduce(
                          (pre, next) => pre + next.nowProfit,
                          0
                        );
                        var totalOrigin = saveProfitList.reduce(
                          (pre, next) => pre + next.originProfit,
                          0
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
    }
  }
};
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
