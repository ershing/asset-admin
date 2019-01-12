<style>
.ctr-header {
  margin-bottom: 10px;
}
</style>


<template>
  <div>
    <header class="ctr-header">
      <Button type="primary" @click="modalVisible = true">新建</Button>
    </header>
    <Table :columns="columns" :data="data"></Table>
    <Modal v-draggable="options" v-model="modalVisible" :title="modalTitle">
      <Form :model="modalForm" :label-width="80">
        <FormItem label="资产名称">
          <Input v-model="modalForm.input" placeholder="请输入" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="所属载体">
          <Select v-model="modalForm.select" style="width: 200px">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="信用卡类">
            <i-switch v-model="modalForm.switch" size="large">
                <span slot="open">是</span>
                <span slot="close">否</span>
            </i-switch>
        </FormItem>        
        <FormItem label="具体模块">
          <Select v-model="modalForm.select" style="width: 200px">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>        
        <FormItem label="资金总和">
          <Input
            v-model="value15"
            prefix="logo-usd"
            placeholder="Enter number"
            style="width: 200px"
          />
        </FormItem>
        <FormItem label="对应时间">
          <DatePicker
            type="date"
            placeholder="Select date"
            v-model="modalForm.date"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "AssetEdit",
  data() {
    return {
      modalTitle: "新建资产",
      modalVisible: false,
      options: {
        trigger: ".ivu-modal-header",
        body: ".ivu-modal",
        recover: true
      },
      modalForm: {},
      columns: [
        {
          type: "index",
          width: 60,
          align: "center",
          title: "序号"
        },
        {
          title: "资产名称",
          align: "center",
          key: "asset"
        },
        {
          title: "所属载体",
          align: "center",
          key: "belong_type"
        },
        {
          title: "信用卡类",
          align: "center",
          key: "belong_type"
        },
        {
          title: "具体模块",
          align: "center",
          key: "belong_type"
        },                
        {
          title: "资金余额",
          align: "center",
          key: "profit",
          render: (h, params) => {
            return h("span", "￥" + params.row.profit);
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
                    size: 'small'
                  },
                  style: {
                    marginRight: "10px"
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size:'small'
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
  mounted() {},
  methods: {}
};
</script>
