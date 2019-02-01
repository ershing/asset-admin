<template>
  <div>
    <header style="marginBottom:10px;">
      <Input v-model="value" placeholder="请输入新增的分类" style="width:200px;marginRight:10px;"></Input>
      <Button type="success" @click="createClass">新增</Button>
    </header>
    <section style="marginBottom:10px;">
      <Tag
        v-for="ele of spendingClassDict.filter(ele => ele)"
        :key="ele.id"
        :name="ele.id"
        type="border"
        color="success"
        closable
        @on-close="delClass"
      >{{ele.value}}</Tag>
    </section>
    <Card>
      <div class="drag-box-card">
        <!-- 切记设置spendingList和putList属性时，一定要添加.sync修饰符 -->
        <drag-list
          :list1.sync="spendingList"
          :list2.sync="putList"
          :dropConClass="dropConClass"
          @on-change="handleChange"
        >
          <h3 slot="left-title">未分类支出大项列表</h3>
          <Card class="drag-item" slot="left" slot-scope="left">{{ left.itemLeft.value }}</Card>
          <h3 slot="right-title">选择分类：
            <Select v-model="chosenClassCode" style="width: 200px" @on-change="changeSelectClass">
              <Option
                v-for="ele of spendingClassDict.filter(ele => ele)"
                :key="ele.code"
                :value="ele.id"
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
import {
  getAllBaseDict,
  createDictClass,
  getDictClass,
  delDictClass,
  classifyBaseDict
} from "@/api/base";
import DragList from "_c/drag-list";
export default {
  name: "SpendingClassify",
  components: {
    DragList
  },
  data() {
    return {
      spendingClassDict: [],
      dict_name: "SPENDING_CLASSIFY",
      value: "",
      //标签集合
      classList: [],
      spendingList: [],
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
    refreshDict(dict_id) {
      getAllBaseDict().then(res => {
        var dicts = {};
        res.data &&
          res.data.data.forEach(ele => {
            if (!dicts[ele.dict_name]) {
              dicts[ele.dict_name] = [];
            }
            dicts[ele.dict_name][ele.code] = ele;
          });
        localStorage.setItem("dicts", JSON.stringify(dicts));
        this.$root.$dict = dicts;
        this.getSpendingDict();
        this.getAllClass(() => {
          if (this.chosenClassCode === dict_id) {
            this.chosenClassCode = this.spendingClassDict.length
              ? this.spendingClassDict[this.spendingClassDict.length - 1].id
              : "";
          }
          this.$nextTick(() => {
            this.changeSelectClass(this.chosenClassCode);
          });
        });
      });
    },
    handleChange({ src, target, oldIndex, newIndex }) {
      if (src === "left" && target === "right") {
        // 分类
        var id = this.putList[newIndex].id;
        classifyBaseDict({ id, classify_id: this.chosenClassCode })
          .then(res => {
            this.$Message.success("分类成功");
            this.refreshDict();
          })
          .catch(e => {
            this.$Message.error("分类失败");
            this.refreshDict();
          });
      }

      if (src === "right" && target === "left") {
        //取消分类
        var id = this.spendingList[newIndex].id;
        classifyBaseDict({ id, classify_id: "" })
          .then(res => {
            this.$Message.success("取消分类成功");
            this.refreshDict();
          })
          .catch(e => {
            this.$Message.error("取消分类失败");
            this.refreshDict();
          });
      }
    },
    changeSelectClass(dict_id) {
      this.putList = this.$root.$dict.spendingTargetDict.filter(
        ele => ele && ele.classify_id === dict_id
      );
    },
    delClass(e, dict_id) {
      delDictClass({ dict_id }).then(res => {
        if (res.data.status) {
          this.$Message.success("删除分类成功");
          this.refreshDict(dict_id);
        } else {
          this.$Message.error("删除分类失败");
        }
      });
    },
    createClass(val) {
      createDictClass({
        dict_name: this.dict_name,
        code: this.spendingClassDict.length
          ? this.spendingClassDict[this.spendingClassDict.length - 1].code + 1
          : 1,
        value: this.value
      }).then(res => {
        if (res.data.status) {
          this.value = "";
          this.$Message.success("新增分类成功");
          this.getAllClass(() => {
            this.chosenClassCode = this.spendingClassDict.length
              ? this.spendingClassDict[this.spendingClassDict.length - 1].id
              : "";
            this.putList = [];
          });
        } else {
          this.$Message.error("新增分类失败");
        }
      });
    },
    getAllClass(callback) {
      getDictClass({ dict_name: this.dict_name }).then(res => {
        if (res.data.status) {
          this.spendingClassDict = res.data.data;
          callback && callback();
        }
      });
    },
    getSpendingDict() {
      this.spendingList = this.$root.$dict.spendingTargetDict.filter(
        ele => ele && !ele.classify_id
      );
    }
  },
  mounted() {
    this.getSpendingDict();
    this.getAllClass(() => {
      this.chosenClassCode = this.spendingClassDict.length
        ? this.spendingClassDict[0].id
        : "";
      if (this.chosenClassCode) {
        this.changeSelectClass(this.chosenClassCode);
      }
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
