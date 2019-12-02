<template>
  <div id="app">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <form-create v-model="fApi" :rule="rule" :option="option"></form-create> -->
    <el-container style=" border: 1px solid #eee;height:100%">
      <el-scrollbar>
        <!-- <el-aside style="max-width:200px;height:100%;background-color: rgb(238, 241, 246)"> -->
          <el-menu  :router="true"  class="el-menu-vertical-demo" default-active="1-4-1" :default-openeds="['1', '3']" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-message"></i>
                <span slot="title">导航一</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项4-1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">应用中心</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="/newApplication">新建应用</el-menu-item>
                <el-menu-item index="/appList">应用列表</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="2-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="2-4">
                <template slot="title">选项4</template>
                <el-menu-item index="2-4-1">选项4-1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span slot="title">导航三</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="3-1">选项1</el-menu-item>
                <el-menu-item index="3-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="3-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="3-4">
                <template slot="title">选项4</template>
                <el-menu-item index="3-4-1">选项4-1</el-menu-item>
              </el-submenu>
            </el-submenu>
          </el-menu>
        <!-- </el-aside> -->
      </el-scrollbar>
      <el-container>
        <el-header style="text-align: left; font-size: 12px;border-bottom:1px solid rgb(240, 240, 240);">
          <!-- <el-radio-group v-model="isCollapse" style=""> -->
          <el-button @click="isCollapse = !isCollapse">展开</el-button>
          <!-- <el-radio-button :label="true">收起</el-radio-button> -->
        <!-- </el-radio-group> -->
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>王小虎</span>
        </el-header>

        <el-main>
          <el-scrollbar style="height:100%">
            <router-view></router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import { maker } from "@form-create/element-ui";
export default {
  name: "app",
  // components: {
  //   HelloWorld
  // },
  data() {
    const rule = [
      { type: "input", field: "goods_name", title: "商品名称", value: "mi" },
      {
        type: "inputNumber",
        field: "goods_price",
        title: "商品价格",
        value: 12
      },
      {
        type: "input",
        title: "商品名称",
        field: "goods_name",
        value: "",
        col: {
          span: 12,
          labelWidth: 150
        },
        props: {
          type: "text"
        },
        validate: [
          { required: true, message: "请输入goods_name", trigger: "blur" }
        ]
      }
    ];
    const item = {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄"
    };
    let make = maker.parse(
      '{"type":"input","field":"goods_name","title":"商品名称","value":"mi"}'
    );
    make;
    // log()
    // console.log(make);
    return {
      clientHeight:'',
      isCollapse: true,
      //实例对象
      fApi: {},
      //表单生成规则
      rule: rule,
      //组件参数配置
      option: {
        //表单提交事件
        onSubmit: function(formData) {
          // alert(JSON.stringify(formData));
          console.log(formData);
        }
      },
      tableData: Array(20).fill(item)
    };
  },
  methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      log(){
        console.log(2321)
      }
    }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  height: 100%;
}
.el-scrollbar__wrap {
  // overflow-x: hidden !important;
  overflow: hidden  !important;
}
.el-scrollbar__view{
  height:100%;
  .el-menu{
    height:100%;
    // width: 200px;
    // transition: 0.3s;
    // opacity: 1;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

</style>
