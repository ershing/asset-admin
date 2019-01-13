<template>
  <div>
    <header style="marginBottom:10px;">
      <Input v-model="value" placeholder="请输入新增的分类" style="width:200px;marginRight:10px;"></Input>
      <Button type="success" @click="createClass">新增</Button>
    </header>
    <section style="marginBottom:10px;">
      <Tag color="cyan" closable>success</Tag>
    </section>
    <Card>
      <div class="drag-box-card">
        <!-- 切记设置assetList和putList属性时，一定要添加.sync修饰符 -->
        <drag-list
          :assetList.sync="assetList"
          :putList.sync="putList"
          :dropConClass="dropConClass"
          @on-change="handleChange"
        >
          <h3 slot="left-title">资产列表</h3>
          <Card class="drag-item" slot="left" slot-scope="left">{{ left.itemLeft.name }}</Card>
          <h3 slot="right-title">分类：
            <Select v-model="belong_supporter" style="width: 200px">
              <Option value="beijing">New York</Option>
              <Option value="shanghai">London</Option>
              <Option value="shenzhen">Sydney</Option>
            </Select>
          </h3>
          <Card class="drag-item" slot="right" slot-scope="right">{{ right.itemRight.name }}</Card>
        </drag-list>
      </div>
    </Card>
  </div>
</template>
<script>
import DragList from "_c/drag-list";
export default {
  name: "AssetClassify",
  components: {
    DragList
  },
  data() {
    return {
      dict_name: "ASSET_CLASSIFY",
      code: 1,
      value: "",
      //标签集合
      classList: [],
      assetList: [],
      putList: [],
      dropConClass: {
        left: ["drop-box", "left-drop-box"],
        right: ["drop-box", "right-drop-box"]
      },
      handleList: []
    };
  },
  methods: {
    handleChange({ src, target, oldIndex, newIndex }) {},
    createClass() {}
  },
  mounted() {
    getDragList().then(res => {
      this.assetList = res.data;
      this.putList = [res.data[0]];
    });
  }
};
</script>
<style lang="less">
.drag-box-card {
  display: inline-block;
  // width: 600px;
  width: 100%;
  height: 560px;
  .drag-item {
    margin: 10px;
  }
  h3 {
    height: 52px;
    line-height: 30px;
    padding: 10px 15px;
  }
  .drop-box {
    border: 1px solid #eeeeee;
    height: 455px;
    border-radius: 5px;
  }
  .left-drop-box {
    margin-right: 10px;
  }
  .right-drop-box {
    //

  }
}
</style>
