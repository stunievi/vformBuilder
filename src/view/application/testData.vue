<template>
  <div class="box h100">
    <div id="right" class="right h100 ovy">
      <template v-for="v in data">
        <Box v-if="v.type == 'box'" :data="v" ref="boxes" :key="v"></Box>
      </template>

      <el-button @click="save">保存</el-button>
      {{values}}
    </div>
  </div>
</template>
<script>
import Box from "../../components/model/Box";
export default {
  components: {
    Box
  },
  watch: {
    value(nv) {
      this.data = [];
      this.$nextTick(() => {
        this.data = JSON.parse(nv);
      });
      console.log(this.data);
    }
  },
  data() {
    return {
      value: "",
      data: [],
      values: "",
      id: this.$route.query.id,
      parentId: "",
      type: this.$route.query.type
    };
  },
  mounted() {
    this.getFormInfo();
  },
  methods: {
    getFormInfo: function() {
      let url =
        this.type == "save" ? "/app/getAppFormInfo" : "/app/getFormDataInfo";
      console.log("urlurl", url);

      this.axios
        .post(this.global.url + url, {
          id: this.$route.query.id
        })
        .then(response => {
          if (response.data.state == true) {
            console.log("response.data.data",response.data.data)
            this.parentId = response.data.data.parentId;
            this.value =
              this.type == "save"
                ? JSON.stringify(response.data.data.formData)
                : (this.value = JSON.stringify(response.data.data.valueform));
          } else {
            this.$message("获取表单信息失败");
          }
        });
    },
    save() {
      var vals = {};
      // var formData = []
      this.$refs.boxes.forEach(e => {
        // console.log(e.$refs)
        // ;
        (e.$refs.widgets || []).forEach(ee => {
          if (ee.data && ee.data.name) {
            // console.log(ee.data.)
            vals[ee.data.name] = ee.value;
            // vals["value"] = ee.value;
            // vals["field"] = this.randomCoding();
            // formData.push({name:ee.data.name,value:ee.value,field:ee.data.name})
            // formData.push({name:ee.data.name,value:ee.value,field:this.randomCoding()})
          }
        });
      });
      this.values = vals;
      this.pushData();
    },
    randomCoding: function() {
      //创建26个字母数组
      var arr = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "_",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
      ];
      var idvalue = "";
      let n = 8; //这个值可以改变的，对应的生成多少个字母，根据自己需求所改
      for (var i = 0; i < n; i++) {
        idvalue += arr[Math.floor(Math.random() * 36)];
      }
      return idvalue;
    },
    pushData: function() {
      let url =
        this.type == "save"
          ? "/app/insertFormDataById"
          : "/app/updateFormDataInfo";
      this.axios
        .post(this.global.url + url, {
          id:  this.id,
          formTab: this.value,
          formData: JSON.stringify(this.values)
        })
        .then(response => {
          // dom根据formList长度判断是否为空
          if (response.data.state != true) {
            this.$message("保存表单信息失败");
          } else {
            this.$message({
              message: "保存成功",
              type: "success"
            });
          }
          // console.log(this.formList)
        });
    }
    // add11(){
    //     this.data.push({
    //         type:"box"
    //     });
    // },
    // add12(){
    //     this.data.push({
    //         type:"box"
    //     });
    // },
  }
};
</script>
<style scoped>
.box {
  display: flex;
  padding: 40px;
  box-sizing: border-box;
}
.right {
  max-width: 800px;
  padding-left: 20px;
  padding-right: 20px;
  border-left: 1px solid #ddd;
  flex: 1;
  box-sizing: border-box;
}
</style>