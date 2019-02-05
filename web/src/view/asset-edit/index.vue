<style>
.ctr-header {
  margin-bottom: 10px;
}
</style>


<template>
  <div>
    <header class="ctr-header">
      <Button type="success" @click="resetModal();modalEditType = 0;modalVisible = true">新建</Button>
      <Button style="margin-left:10px;" type="success" @click="exportTable">导出</Button>
    </header>
    <Table :columns="columns" :data="data" ref="assetEdit"></Table>
    <Modal v-draggable="options" v-model="modalVisible" :title="modalTitle" @on-ok="confirmModal">
      <Form :model="modalForm" :label-width="80">
        <FormItem label="资产名称">
          <Input v-model="modalForm.asset_name" placeholder="请输入" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="所属载体">
          <Select v-model="modalForm.belong_supporter" style="width: 200px">
            <Option
              v-for="ele of $root.$dict.supporterDict.filter(ele => ele)"
              :key="ele.code"
              :value="ele.code"
            >{{ele.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="信用卡类">
          <i-switch
            v-model="modalForm.is_credit_class"
            size="large"
            @on-change="modalForm.belong_module=0"
          >
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="具体模块" v-if="modalForm.is_credit_class">
          <Select v-model="modalForm.belong_module" style="width: 200px">
            <Option
              v-for="ele of $root.$dict.creditModuleDict.filter(ele => ele)"
              :key="ele.code"
              :value="ele.code"
            >{{ele.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="具体模块" v-if="!modalForm.is_credit_class">
          <Select v-model="modalForm.belong_module" style="width: 200px">
            <Option
              v-for="ele of $root.$dict.moduleDict.filter(ele => ele)"
              :key="ele.code"
              :value="ele.code"
            >{{ele.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="资金总和">
          <Input
            v-model.number="modalForm.profit"
            prefix="logo-usd"
            placeholder="Enter number"
            style="width: 200px"
          />
        </FormItem>
        <FormItem label="对应时间">
          <DatePicker
            type="date"
            placeholder="Select date"
            v-model="modalForm.create_time"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-draggable="options"
      v-model="confirmDeleteVisible"
      title="警告"
      @on-ok="confirmDelete"
    >此操作将删除此资产相关的所有记账记录，是否确认删除资产数据？</Modal>
  </div>
</template>

<script>
import { getAsset, upsertAsset, deleteAsset, assetNowProfit } from "@/api/base";
export default {
  name: "AssetEdit",
  data() {
    return {
      modalEditType: 0,
      modalVisible: false,
      confirmDeleteVisible: false,
      deleteParams: {},
      options: {
        trigger: ".ivu-modal-header",
        body: ".ivu-modal",
        recover: true
      },
      modalForm: {
        asset_name: "",
        belong_supporter: 0,
        is_credit_class: false,
        belong_module: 0,
        profit: 0.01,
        create_time: new Date()
      },
      columns: [
        {
          type: "index",
          width: 60,
          align: "center",
          title: "序号",
          key: "index"
        },
        {
          title: "资产名称",
          align: "center",
          key: "asset_name"
        },
        {
          title: "所属载体",
          align: "center",
          key: "belong_supporter",
          render: (h, params) => {
            return h(
              "span",
              this.$root.$dict.supporterDict[params.row.belong_supporter].value
            );
          }
        },
        {
          title: "信用卡类",
          align: "center",
          key: "is_credit_class",
          render: (h, params) => {
            return h("span", params.row.is_credit_class ? "是" : "否");
          }
        },
        {
          title: "具体模块",
          align: "center",
          key: "belong_module",
          render: (h, params) => {
            return h(
              "span",
              this.$root.$dict.moduleDict[params.row.belong_module].value
            );
          }
        },
        {
          title: "创建资金额",
          align: "center",
          key: "profit",
          render: (h, params) => {
            return h("span", "￥" + params.row.profit.toFixed(2));
          }
        },
        {
          title: "对应创建时间",
          align: "center",
          key: "create_time",
          render: (h, params) => {
            var times = params.row.create_time.split(" ");
            return h("span", times[0]);
          }
        },
        {
          title: "资金余额",
          align: "center",
          key: "now_profit",
          render: (h, params) => {
            return h("span", "￥" + params.row.now_profit.toFixed(2));
          }
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.editModal(params);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.deleteAsset(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data: []
    };
  },
  mounted() {
    this.getAssetList();
  },
  computed: {
    modalTitle() {
      return this.modalEditType === 1 ? "修改资产" : "新建资产";
    }
  },
  methods: {
    getAssetList() {
      getAsset().then(res => {
        if (res.data.status) {
          var count = 0;
          res.data.data.forEach(ele => {
            assetNowProfit({ asset_id: ele.asset_id, end_charge_time: Date.parse(new Date()) }).then(res2 => {
              if (res2.data.status) {
                ele.now_profit = res2.data.data;
                count++;
              }
              if (count === res.data.data.length) {
                this.data = res.data.data || [];
              }
            });
          });
        }
      });
    },
    resetModal() {
      this.modalForm = {
        asset_name: "",
        belong_supporter: 0,
        is_credit_class: false,
        belong_module: 0,
        profit: 0.01,
        create_time: new Date()
      };
    },
    editModal(params) {
      Object.assign(this.modalForm, params.row);
      this.modalEditType = 1;
      this.modalVisible = true;
    },
    confirmModal() {
      var insertData = { ...this.modalForm };
      insertData.create_time = Date.parse(insertData.create_time);
      delete insertData._index;
      delete insertData._rowKey;
      upsertAsset(insertData).then(res => {
        if (res.data.status) {
          this.$Message.success(this.modalTitle + "成功！");
          this.getAssetList();
        } else {
          this.$Message.error(this.modalTitle + "失败！");
        }
      });
    },
    confirmDelete() {
      var params = this.deleteParams;
      deleteAsset({ asset_id: params.row.asset_id }).then(res => {
        if (res.data.status) {
          this.$Message.success(params.row.asset_name + "删除成功！");
          this.getAssetList();
        }
      });
    },
    deleteAsset(params) {
      this.confirmDeleteVisible = true;
      this.deleteParams = params;
    },
    exportTable() {
      var filename = "资产列表";
      var columns = JSON.parse(JSON.stringify(this.columns));
      columns.pop();
      var data = this.data.map((ele, index) => ({
        ...ele,
        index: index + 1,
        create_time: ele.create_time.split(" ")[0],
        belong_supporter: this.$root.$dict.supporterDict.filter(
          el => el && el.code === ele.belong_supporter
        )[0].value,
        belong_module: this.$root.$dict[
          ele.is_credit_class ? "creditModuleDict" : "moduleDict"
        ].filter(el => el && el.code === ele.belong_module)[0].value,
        is_credit_class: ele.is_credit_class ? "是" : "否"
      }));
      this.$refs.assetEdit.exportCsv({ filename, columns, data });
    }
  }
};
</script>
