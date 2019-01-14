<style>
.ctr-header {
  margin-bottom: 10px;
}
</style>


<template>
  <div>
    <header class="ctr-header">
      <Button type="primary" @click="resetModal();modalEditType = 0;modalVisible = true">新增</Button>
    </header>
    <Table :columns="columns" :data="data"></Table>
    <Modal v-draggable="options" v-model="modalVisible" :title="modalTitle" @on-ok="confirmModal">
      <Form :model="modalForm" :label-width="80">
        <FormItem label="计划名称">
          <Input v-model="modalForm.charge_name" placeholder="请输入" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="操作资产">
          <Select v-model="modalForm.op_asset_id" style="width: 200px">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
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
        <FormItem label="记账周期">
          <Select v-model="modalForm.period_type" style="width: 200px">
            <Option :value="3">New York</Option>
            <Option :value="1">London</Option>
            <Option :value="2">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="开始时间">
          <DatePicker
            type="date"
            placeholder="Select date"
            v-model="modalForm.begin_time"
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
import { getRegularCharge, upsertRegularCharge, deleteRegularCharge } from "@/api/base";
export default {
  name: "RugularCharge",
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
        charge_name: "",
        op_asset_id: 0,
        charge_type: 0,
        target_id: 0,
        count: 0,
        period_type: 0,
        begin_time: new Date(),
        is_flexible_spending: false
      },
      columns: [
        {
          type: "index",
          width: 60,
          align: "center",
          title: "序号"
        },
        {
          title: "计划名称",
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
          title: "记账周期",
          align: "center",
          key: "period_type",
          // render: (h, params) => {
          //   return h("span", "￥" + params.row.period_type);
          // }
        },
        {
          title: "开始时间",
          align: "center",
          key: "begin_time",
          render: (h, params) => {
            var times = params.row.begin_time.split(" ");
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
      data: [
        {
          belong_type: 1,
          profit: 12313.12
        }
      ]
    };
  },
  mounted() {
    this.getChargeList();
  },
  computed: {
    modalTitle() {
      return this.modalEditType === 1 ? "修改记账" : "新建记账";
    }
  },
  methods: {
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
        count: 0,
        period_type: 0,
        begin_time: new Date(),
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
      delete insertData._index
      delete insertData._rowKey
      insertData.begin_time = Date.parse(insertData.begin_time);
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
    }
  }
};
</script>
