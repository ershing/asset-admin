<style>
.ctr-header {
  margin-bottom: 10px;
}
</style>


<template>
  <div>
    <header class="ctr-header">
      <Button type="success" @click="resetModal();modalEditType = 0;modalVisible = true">新增</Button>
      <Button style="margin-left:10px;" type="success" @click="exportTable">导出</Button>
    </header>
    <Table ref="regularCharge" :columns="columns" :data="data"></Table>
    <Modal v-draggable="options" v-model="modalVisible" :title="modalTitle" @on-ok="confirmModal">
      <Form :model="modalForm" :label-width="80">
        <FormItem label="计划名称">
          <Input v-model="modalForm.charge_name" placeholder="请输入" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="操作资产">
          <Select v-model="modalForm.op_asset_id" style="width: 200px">
            <Option
              v-for="ele of assetList"
              :key="ele.asset_id"
              :value="ele.asset_id"
            >{{ele.asset_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="操作方式">
          <Select
            v-model="modalForm.charge_type"
            style="width: 200px"
            @on-change="modalForm.target_id = 0;"
          >
            <Option
              v-for="ele of $root.$dict.chargeTypeDict.filter(ele => ele && ele.code !== 4)"
              :key="ele.code"
              :value="ele.code"
            >{{ele.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="操作目标">
          <Select
            v-if="!modalForm.charge_type || modalForm.charge_type<=1"
            v-model="modalForm.target_id"
            style="width: 200px"
          >
            <Option
              v-for="ele of $root.$dict.earnTargetDict.filter(ele => ele)"
              :key="ele.code"
              :value="ele.code"
            >{{ele.value}}</Option>
          </Select>
          <Select
            v-if="modalForm.charge_type===2"
            v-model="modalForm.target_id"
            style="width: 200px"
          >
            <Option
              v-for="ele of $root.$dict.spendingTargetDict.filter(ele => ele)"
              :key="ele.code"
              :value="ele.code"
            >{{ele.value}}</Option>
          </Select>
          <Select
            v-if="modalForm.charge_type===3"
            v-model="modalForm.target_id"
            style="width: 200px"
          >
            <Option
              v-for="ele of assetList"
              :key="ele.asset_id"
              :value="ele.asset_id"
            >{{ele.asset_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="资金总量">
          <Input
            v-model="modalForm.count"
            prefix="logo-usd"
            placeholder="Enter number"
            style="width: 200px"
          />
        </FormItem>
        <FormItem label="记账周期">
          <Select v-model="modalForm.period_type" style="width: 200px">
            <Option
              v-for="ele of $root.$dict.periodTypeDict.filter(ele => ele)"
              :key="ele.code"
              :value="ele.code"
              @on-change="modalForm.begin_time = '';"
            >{{ele.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="开始时间">
          <DatePicker
            type="date"
            placeholder="请选择"
            v-model="modalForm.begin_time"
            style="width: 200px"
            :options="datePickerOptions"
          ></DatePicker>
        </FormItem>
        <FormItem label="固弹支出">
          <i-switch v-model="modalForm.is_flexible_spending" size="large">
            <span slot="open">弹性</span>
            <span slot="close">固定</span>
          </i-switch>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-draggable="options"
      v-model="confirmDeleteVisible"
      title="警告"
      @on-ok="confirmDelete"
    >是否确认删除记账数据？</Modal>
  </div>
</template>

<script>
import {
  getRegularCharge,
  upsertRegularCharge,
  deleteRegularCharge,
  getAsset,
  getDictClass
} from "@/api/base";
export default {
  name: "RugularCharge",
  data() {
    var that = this;
    return {
      //分类字典
      spendingClassDict: [],      
      //资产列表
      assetList: [],
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
        charge_name: "",
        op_asset_id: 0,
        charge_type: 0,
        target_id: 0,
        count: 0.01,
        period_type: 0,
        begin_time: "",
        is_flexible_spending: false
      },
      datePickerOptions: {
        disabledDate(date) {
          var today = new Date();
          var inner =
            date.valueOf() < Date.now() ||
            date.valueOf() > Date.parse(new Date(today.getFullYear(), 11, 31));
          var plus = false;
          if (that.modalForm.period_type === 6) {
            plus = date.getDay() === 6 || date.getDay() === 0;
          }
          if (that.modalForm.period_type === 7) {
            plus = date.getDay() >= 1 && date.getDay() <= 5;
          }
          return inner || plus;
        }
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
          title: "计划名称",
          align: "center",
          key: "charge_name"
        },
        {
          title: "操作资产",
          align: "center",
          key: "op_asset_id",
          render: (h, params) => {
            return h(
              "span",
              this.assetList.filter(
                ele => ele.asset_id === params.row.op_asset_id
              )[0].asset_name
            );
          }
        },
        {
          title: "操作方式",
          align: "center",
          key: "charge_type",
          render: (h, params) => {
            return h(
              "span",
              this.$root.$dict.chargeTypeDict.filter(
                ele => ele && ele.code === params.row.charge_type
              )[0].value
            );
          }
        },
        {
          title: "支出分类",
          align: "center",
          key: "spend_class",
          render: (h, params) => {
            if (params.row.charge_type === 1 || params.row.charge_type === 3)
              return h("span", "——");
            if (params.row.charge_type === 2)
              var classify_id = this.$root.$dict.spendingTargetDict.filter(
                ele => ele && ele.code === params.row.target_id
              )[0].classify_id;
            var target = this.spendingClassDict.filter(
              ele => ele && ele.id === classify_id
            )[0];
            return h("span", target ? target.value : "未分类");
          }
        },
        {
          title: "操作目标",
          align: "center",
          key: "target_id",
          render: (h, params) => {
            return h(
              "span",
              (params.row.target_id &&
                params.row.charge_type &&
                {
                  1: () =>
                    this.$root.$dict.earnTargetDict.filter(
                      ele => ele && ele.code === params.row.target_id
                    )[0].value,
                  2: () =>
                    this.$root.$dict.spendingTargetDict.filter(
                      ele => ele && ele.code === params.row.target_id
                    )[0].value,
                  3: () =>
                    this.assetList.filter(
                      ele => ele.asset_id === params.row.target_id
                    )[0].asset_name
                }[params.row.charge_type]()) ||
                ""
            );
          }
        },
        {
          title: "资金总量",
          align: "center",
          key: "count",
          render: (h, params) => {
            return h("span", "￥" + params.row.count);
          }
        },
        {
          title: "记账周期",
          align: "center",
          key: "period_type",
          render: (h, params) => {
            return h(
              "span",
              this.$root.$dict.periodTypeDict.filter(
                ele => ele && ele.code === params.row.period_type
              )[0].value
            );
          }
        },
        {
          title: "开始时间",
          align: "center",
          key: "begin_time",
          render: (h, params) => {
            var times = "";
            if (params.row.begin_time) {
              times = params.row.begin_time.split(" ");
            } else {
              times = [];
            }
            return h("span", times[0]);
          }
        },
        {
          title: "固弹支出",
          align: "center",
          key: "is_flexible_spending",
          render: (h, params) => {
            return h("span", params.row.is_flexible_spending ? "弹性" : "固定");
          }
        },
        {
          title: "操作",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              // h(
              //   "Button",
              //   {
              //     props: {
              //       type: "success",
              //       size: "small"
              //     },
              //     style: {
              //       marginRight: "10px"
              //     },
              //     on: {
              //       click: () => {
              //         this.editModal(params);
              //       }
              //     }
              //   },
              //   "编辑"
              // ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.deleteCharge(params);
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
    this.getAllClass()
    this.getAssetList();
    this.getChargeList();
  },
  computed: {
    modalTitle() {
      return this.modalEditType === 1 ? "修改记账" : "新建记账";
    }
  },
  methods: {
    getAllClass(callback) {
      getDictClass({ dict_name: "SPENDING_CLASSIFY" }).then(res => {
        if (res.data.status) {
          this.spendingClassDict = res.data.data;
        }
      });
    },    
    getAssetList() {
      getAsset().then(res => {
        if (res.data.status) {
          this.assetList = res.data.data || [];
        }
      });
    },
    getChargeList() {
      getRegularCharge().then(res => {
        if (res.data.status) {
          this.data = res.data.data || [];
        }
      });
    },
    resetModal() {
      this.modalForm = {
        charge_name: "",
        op_asset_id: 0,
        charge_type: 0,
        target_id: 0,
        count: 0.01,
        period_type: 0,
        begin_time: "",
        is_flexible_spending: false
      };
    },
    editModal(params) {
      Object.assign(this.modalForm, params.row);
      this.modalEditType = 1;
      this.modalVisible = true;
    },
    confirmModal() {
      var insertData = { ...this.modalForm };
      delete insertData._index;
      delete insertData._rowKey;
      insertData.begin_time = Date.parse(insertData.begin_time);
      var ifTransfer = this.assetList.filter(
        ele => ele && ele.asset_id === insertData.target_id
      )[0];
      insertData.is_credit_transfer = ifTransfer
        ? ifTransfer.is_credit_class
        : false;
      if (insertData.charge_type === 2 || insertData.charge_type === 3) {
        insertData.count = -insertData.count;
      }
      upsertRegularCharge(insertData).then(res => {
        if (res.data.status) {
          this.$Message.success(this.modalTitle + "成功！");
          this.getChargeList();
        } else {
          this.$Message.error(this.modalTitle + "失败！");
        }
      });
    },
    confirmDelete() {
      var params = this.deleteParams;
      deleteRegularCharge({ charge_id: params.row.charge_id }).then(res => {
        if (res.data.status) {
          this.$Message.success(params.row.charge_name + "删除成功！");
          this.getChargeList();
        }
      });
    },
    deleteCharge(params) {
      this.confirmDeleteVisible = true;
      this.deleteParams = params;
    },
    exportTable() {
      var filename = "记账计划";
      var columns = JSON.parse(JSON.stringify(this.columns));
      columns.pop();
      var data = this.data.map((ele, index) => ({
        ...ele,
        index: index + 1,
        begin_time: ele.begin_time.split(" ")[0],
        op_asset_id: this.assetList.filter(
          el => el.asset_id === ele.op_asset_id
        )[0].asset_name,
        charge_type: this.$root.$dict.chargeTypeDict.filter(
          el => el && el.code === ele.charge_type
        )[0].value,
        spend_class: (() => {
          if (ele.charge_type === 1 || ele.charge_type === 3) return "——";
          if (ele.charge_type === 2)
            var classify_id = this.$root.$dict.spendingTargetDict.filter(
              el => el && el.code === ele.target_id
            )[0].classify_id;
          var target = this.spendingClassDict.filter(
            el => el && el.id === classify_id
          )[0];
          return target ? target.value : "未分类";
        })(),
        target_id:
          (ele.target_id &&
            ele.charge_type &&
            {
              1: () =>
                this.$root.$dict.earnTargetDict.filter(
                  el => el && el.code === ele.target_id
                )[0].value,
              2: () =>
                this.$root.$dict.spendingTargetDict.filter(
                  el => el && el.code === ele.target_id
                )[0].value,
              3: () =>
                this.assetList.filter(el => el.asset_id === ele.target_id)[0]
                  .asset_name
            }[ele.charge_type]()) ||
          "",
        period_type: this.$root.$dict.periodTypeDict.filter(
          el => el && el.code === ele.period_type
        )[0].value,
        is_flexible_spending: ele.is_flexible_spending ? "弹性" : "固定"
      }));
      this.$refs.regularCharge.exportCsv({ filename, columns, data });
    }
  }
};
</script>
