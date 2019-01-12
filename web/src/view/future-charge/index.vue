<style>
.ctr-header {
  margin-bottom: 10px;
}
</style>


<template>
  <div>
    <header class="ctr-header">
          <DatePicker
            type="date"
            placeholder="Select date"
            v-model="modalForm.date"
            style="width: 200px"
          ></DatePicker>
    </header>
    <Table :columns="columns" :data="data"></Table>
    <Modal v-draggable="options" v-model="modalVisible" :title="modalTitle">
      <Form :model="modalForm" :label-width="80">           
        <FormItem label="操作资产">
          <Select v-model="modalForm.select" style="width: 200px">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="操作方式">
          <Select v-model="modalForm.select" style="width: 200px">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>  
        <FormItem label="操作目标">
          <Select v-model="modalForm.select" style="width: 200px">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>                
        <FormItem label="资金总量">
          <Input
            v-model="value15"
            prefix="logo-usd"
            placeholder="Enter number"
            style="width: 200px"
          />
        </FormItem>
        <FormItem label="计划名称">
          <Input v-model="modalForm.input" placeholder="请输入" style="width: 200px"></Input>
        </FormItem>     
        <FormItem label="记账时间">
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
      modalTitle: "新增记账计划",
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
          title: "操作资产",
          align: "center",
          key: "asset"
        },        
        {
          title: "操作方式",
          align: "center",
          key: "belong_type"
        },
        {
          title: "操作目标",
          align: "center",
          key: "asset"
        },          
        {
          title: "资金总量",
          align: "center",
          key: "profit",
          render: (h, params) => {
            return h("span", "￥" + params.row.profit);
          }
        },
        {
          title: "记账来源",
          align: "center",
          key: "asset"
        },  
        {
          title: "记账时间",
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
