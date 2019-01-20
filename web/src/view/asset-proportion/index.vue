<template>
  <div>
    <Card shadow>
      <chart-pie style="min-height: 600px;" :value="pieData" text="分类资产占比"></chart-pie>
    </Card>
    <Card shadow>
      <chart-pie style="min-height: 600px;" :value="pieData" text="分类资产占比"></chart-pie>
    </Card>
  </div>
</template>

<script>
export default {
  name: "AssetProportion",
  data() {
    return {
      pieData: [
        { value: 135, name: "活期存储" },
        { value: 234, name: "定期存储" },
        { value: 1548, name: "货币基金" },
        { value: 335, name: "债券基金" },
        { value: 310, name: "指数基金" },
        { value: 310, name: "股票基金" },
        { value: 310, name: "混合基金" },
        { value: 310, name: "外汇存储" }
      ]
    };
  },
  mounted() {
    this.getAllAsset()
    this.getAllClass()
  },
  methods: {
    getAllAsset(){},
    getAllClass(){},

  },
};
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
