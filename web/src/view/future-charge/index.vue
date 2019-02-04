<style>
.ctr-header {
  overflow: hidden;
  margin-bottom: 10px;
}
</style>


<template>
  <div>
    <header class="ctr-header">
      <Button type="success" @click="exportTable">导出</Button>
      <DatePicker
        v-model="selected_time"
        type="daterange"
        :clearable="false"
        placement="bottom-end"
        placeholder="选择时间范围"
        style="float: right;width: 200px"
        :options="datePickerOptions"
        @on-change="changeSelectedTime"
      ></DatePicker>
      <Page
        style="float:right;"
        :total="total"
        :page-size="limit"
        show-sizer
        @on-change="changePage"
        @on-page-size-change="changePageSize"
        :page-size-opts="[5, 10, 15, 30]"
      />
    </header>
    <Table ref="futureCharge" :columns="columns" :data="data"></Table>
    <Modal v-draggable="options" v-model="modalVisible" :title="modalTitle" @on-ok="confirmModal">
      <Form :model="modalForm" :label-width="80">
        <FormItem label="操作资产">
          <Select v-model="modalForm.op_asset_id" style="width: 200px">
            <Option :value="3">New York</Option>
            <Option :value="1">London</Option>
            <Option :value="2">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="操作方式">
          <Select v-model="modalForm.charge_type" style="width: 200px">
            <Option :value="3">New York</Option>
            <Option :value="1">London</Option>
            <Option :value="2">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="操作目标">
          <Select v-model="modalForm.target_id" style="width: 200px">
            <Option :value="3">New York</Option>
            <Option :value="1">London</Option>
            <Option :value="2">Sydney</Option>
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
        <FormItem label="记账来源">
          <Input v-model="modalForm.charge_name" placeholder="请输入" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="记账时间">
          <DatePicker
            type="date"
            placeholder="Select date"
            v-model="modalForm.charge_time"
            style="width: 200px"
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
  getAsset,
  getCharge,
  upsertCharge,
  deleteCharge,
  getDictClass
} from "@/api/base";
export default {
  name: "AssetEdit",
  data() {
    return {
      //分类字典
      spendingClassDict: [],
      //资产列表
      assetList: [],
      modalTitle: "修改记账",
      modalVisible: false,
      confirmDeleteVisible: false,
      deleteParams: {},
      selected_time: [],
      options: {
        trigger: ".ivu-modal-header",
        body: ".ivu-modal",
        recover: true
      },
      datePickerOptions: {
        disabledDate(date) {
          var dateNow = new Date();
          return (
            (date &&
              date.valueOf() <
                Date.parse(
                  new Date(
                    dateNow.getFullYear(),
                    dateNow.getMonth(),
                    dateNow.getDate()
                  )
                ) +
                  86400000) ||
            date.getFullYear() > dateNow.getFullYear()
          );
        }
      },
      modalForm: {
        charge_name: "",
        op_asset_id: 0,
        charge_type: 0,
        target_id: 0,
        count: 0,
        charge_time: new Date(),
        is_flexible_spending: false
      },
      total: 0,
      limit: 10,
      columns: [
        {
          type: "index",
          width: 60,
          align: "center",
          title: "序号",
          key: "index"
        },
        {
          title: "操作资产",
          align: "center",
          key: "op_asset_id",
          render: (h, params) => {
            return h(
              "span",
              (this.assetList.length &&
                this.assetList.filter(
                  ele => ele && ele.asset_id === params.row.op_asset_id
                )[0].asset_name) ||
                ""
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
                    (this.assetList.length &&
                      this.assetList.filter(
                        ele => ele && ele.asset_id === params.row.target_id
                      )[0].asset_name) ||
                    ""
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
          title: "记账来源",
          align: "center",
          key: "charge_name"
        },
        {
          title: "记账时间",
          align: "center",
          key: "charge_time",
          render: (h, params) => {
            var times = params.row.charge_time.split(" ");
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
          minWidth: 80,
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
    this.getAllClass();
    this.getAssetList();
    this.initSelectedTime();
    this.formatTimeSearch();
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
    initSelectedTime() {
      var date = new Date();
      var firstDate = new Date(
        Date.parse(
          new Date(date.getFullYear(), date.getMonth(), date.getDate())
        ) + 86400000
      );
      var today = new Date(
        Date.parse(
          new Date(
            date.getMonth() === 11
              ? date.getFullYear() + 1
              : date.getFullYear(),
            date.getMonth() === 11 ? 1 : date.getMonth() + 1,
            1
          )
        ) - 1000
      );
      this.selected_time = [firstDate, today];
    },
    changeSelectedTime(val) {
      this.formatTimeSearch();
    },
    changePage(page) {
      this.formatTimeSearch(page);
    },
    changePageSize(limit) {
      this.limit = limit;
      this.formatTimeSearch(1);
    },
    formatTimeSearch(page) {
      page = page || 1;
      var start_charge_time = Date.parse(this.selected_time[0]);
      var date = new Date(this.selected_time[1]);
      var end_charge_time =
        Date.parse(
          new Date(
            date.getMonth() === 11
              ? date.getFullYear() + 1
              : date.getFullYear(),
            date.getMonth() === 11 ? 1 : date.getMonth() + 1,
            1
          )
        ) - 1000;
      this.getChargeList({
        asc: true,
        start_charge_time,
        end_charge_time,
        page,
        limit: this.limit
      });
    },
    getChargeList(params) {
      getCharge(params).then(res => {
        if (res.data.status) {
          this.data = res.data.data || [];
          this.total = res.data.total || 0;
        }
      });
    },
    resetModal() {
      this.modalForm = {
        charge_name: "",
        op_asset_id: 0,
        charge_type: 0,
        target_id: 0,
        count: 0,
        charge_time: new Date(),
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
      insertData.charge_time = Date.parse(insertData.charge_time);
      delete insertData._index;
      delete insertData._rowKey;
      upsertCharge(insertData).then(res => {
        if (res.data.status) {
          this.$Message.success(this.modalTitle + "成功！");
          this.formatTimeSearch();
        } else {
          this.$Message.error(this.modalTitle + "失败！");
        }
      });
    },
    confirmDelete() {
      var params = this.deleteParams;
      deleteCharge({ charge_id: params.row.charge_id }).then(res => {
        if (res.data.status) {
          this.$Message.success(params.row.charge_name + "删除成功！");
          this.formatTimeSearch();
        }
      });
    },
    deleteCharge(params) {
      this.confirmDeleteVisible = true;
      this.deleteParams = params;
    },
    exportTable() {
      var filename = "未来账单";
      var columns = JSON.parse(JSON.stringify(this.columns));
      columns.pop();
      var data = this.data.map((ele, index) => ({
        ...ele,
        index: index + 1,
        charge_time: ele.charge_time.split(" ")[0],
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
        is_flexible_spending: ele.is_flexible_spending ? "弹性" : "固定"
      }));
      this.$refs.futureCharge.exportCsv({ filename, columns, data });
    }
  }
};
</script>
