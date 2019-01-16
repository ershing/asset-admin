<template>
  <div>
    <header style="marginBottom:10px;">
      <Input v-model="value" placeholder="请输入新增的分类" style="width:200px;marginRight:10px;"></Input>
      <Button type="success" @click="createClass">新增</Button>
    </header>
    <section style="marginBottom:10px;">
      <Tag
        v-for="ele of moduleClassDictl.filter(ele => ele)"
        :key="ele.code"
        :name="ele.dict_id"
        color="cyan"
        closable
        @on-close="delClass"
      >{{ele.value}}</Tag>
    </section>
    <Card>
      <div class="drag-box-card">
        <!-- 切记设置assetList和putList属性时，一定要添加.sync修饰符 -->
        <drag-list
          :list1.sync="assetList"
          :list2.sync="putList"
          :dropConClass="dropConClass"
          @on-change="handleChange"
        >
          <h3 slot="left-title">未分类模块列表</h3>
          <Card class="drag-item" slot="left" slot-scope="left">{{ left.itemLeft.value }}</Card>
          <h3 slot="right-title">分类：
            <Select v-model="chosenClassCode" style="width: 200px" @on-change="changeSelectClass">
              <Option
                v-for="ele of moduleClassDictl.filter(ele => ele)"
                :key="ele.code"
                :value="ele.dict_id"
              >{{ele.value}}</Option>
            </Select>
          </h3>
          <Card class="drag-item" slot="right" slot-scope="right">{{ right.itemRight.value }}</Card>
        </drag-list>
      </div>
    </Card>
  </div>
</template>
<script>
import { createDictClass, getDictClass, delDictClass } from "@/api/base";
import DragList from "_c/drag-list";
export default {
  name: "AssetClassify",
  components: {
    DragList
  },
  data() {
    return {
      moduleClassDict: [],
      dict_name: "MODULE_CLASSIFY",
      value: "",
      //标签集合
      classList: [],
      assetList: [],
      putList: [],
      //选中类
      chosenClassCode: "",
      dropConClass: {
        left: ["drop-box", "left-drop-box"],
        right: ["drop-box", "right-drop-box"]
      },
      handleList: []
    };
  },
  methods: {
    handleChange({ src, target, oldIndex, newIndex }) {
      console.log({ src, target, oldIndex, newIndex });
    },
    changeSelectClass(dict_id) {
      this.putList = this.$root.$dict.moduleDict
        .filter(ele => ele.classify_id === dict_id)
        .map(ele => ({
          id: ele.code,
          ...ele
        }));
    },
    delClass(dict_id) {
      delDictClass({ dict_id }).then(res => {
        if (res.data.status) {
          this.$Message.success("删除分类成功");
        } else {
          this.$Message.error("删除分类失败");
        }
      });
    },
    createClass(val) {
      createDictClass({
        dict_name: this.dict_name,
        code: this.moduleClassDict[this.moduleClassDict.length - 1].code + 1,
        value: this.value
      }).then(res => {
        if (res.data.status) {
          this.$Message.success("新增分类成功");
          this.getAllClass();
        } else {
          this.$Message.error("新增分类失败");
        }
      });
    },
    getAllClass(callback) {
      getDictClass({ dict_name: this.dict_name }).then(res => {
        if (res.data.status) {
          this.moduleClassDict = res.data.data;
          callback && callback();
        }
      });
    },
    getAssetDict() {
      this.assetList = this.$root.$dict.moduleDict
        .filter(ele => !ele.classify_id)
        .map(ele => ({
          id: ele.code,
          ...ele
        }));
    }
  },
  mounted() {
    this.getAssetDict();
    this.getAllClass(() => {
      this.chosenClassCode = this.moduleClassDict[0].dict_id
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
    padding: 0px;
    height: 35px;
    line-height: 5px;
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
    overflow: auto;
  }
  .left-drop-box {
    margin-right: 20px;
  }
  .right-drop-box {
    //

  }
}
</style>
