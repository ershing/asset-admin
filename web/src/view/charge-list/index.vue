<style>
.ctr-header {
  margin-bottom: 10px;
}
</style>


<template>
  <div>
    <header class="ctr-header">
      <Button type="primary" @click="resetModal();modalEditType = 0;modalVisible = true">记账</Button>
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
    <Table :columns="columns" :data="data"></Table>
    <Modal
      v-draggable="options"
      v-model="modalVisible"
      :mask-closable="false"
      :title="modalTitle"
      @on-ok="confirmModal"
    >
      <Form :model="modalForm" :label-width="80">
        <FormItem label="记账名称">
          <Input v-model="modalForm.charge_name" placeholder="请输入" style="width: 200px"></Input>
        </FormItem>
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
        <FormItem label="对应时间">
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
import { getCharge, upsertCharge, deleteCharge } from "@/api/base";
export default {
  name: "ChargeEdit",
  data() {
    return {
      // 选择的时间范围
      selected_time: [],
      modalVisible: false,
      modalEditType: 0,
      confirmDeleteVisible: false,
      deleteParams: {},
      options: {
        trigger: ".ivu-modal-header",
        body: ".ivu-modal",
        recover: true
      },
      datePickerOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
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
      limit: 5,
      columns: [
        {
          type: "index",
          width: 60,
          align: "center",
          title: "序号"
        },
        {
          title: "记账名称",
          align: "center",
          key: "charge_name"
        },
        {
          title: "操作资产",
          align: "center",
          key: "op_asset_id"
        },
        {
          title: "操作方式",
          align: "center",
          key: "charge_type"
        },
        {
          title: "操作目标",
          align: "center",
          key: "target_id"
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
          title: "对应时间",
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
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success",
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
    this.initSelectedTime();
    this.formatTimeSearch();
  },
  computed: {
    modalTitle() {
      return this.modalEditType === 1 ? "修改记账" : "新建记账";
    }
  },
  methods: {
    initSelectedTime() {
      var date = new Date();
      var firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
      var today = new Date(
        Date.parse(
          new Date(date.getFullYear(), date.getMonth(), date.getDate())
        ) + 86399000
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
          new Date(date.getFullYear(), date.getMonth(), date.getDate())
        ) + 86399000;
      this.getChargeList({
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
    }
  }
};
</script>
