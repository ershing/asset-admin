<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { getAllBaseDict } from "@/api/base";
export default {
  name: "App",
  mounted() {
    this.initDict();
  },
  methods: {
    initDict() {
      if (localStorage.getItem("dicts")) {
        this.$root.$dict = JSON.parse(localStorage.getItem("dicts"));
        return;
      }
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
      });
    }
  }
};
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
