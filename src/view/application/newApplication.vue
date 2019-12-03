<template>
  <div style="height: 100%;">
    <el-drawer title="编辑" :visible.sync="drawer" :append-to-body="true" :modal="false">
      <div>
        <editItem :info="drawerItem" />
      </div>
    </el-drawer>
    <el-container style="height: 100%;">
      <el-aside style="max-width:200px;height:100%;border: 1px solid rgb(240,240,240);">
        <draggable
          class="list-group"
          :list="list1"
          :group="{ name: 'element', pull: 'clone', put: false  }"
          :clone="clone"
        >
          <div
            class="list-group-item"
            style="margin:5px"
            v-for="element in list1"
            :key="element.name"
          >
            <el-button size="small">{{ element.name }}</el-button>
          </div>
        </draggable>
      </el-aside>

      <el-container>
        <el-header
          style="text-align: right; font-size: 12px;border-bottom:1px solid rgb(240, 240, 240);"
        >
          <el-button @click="log()">保存</el-button>
        </el-header>
        <el-main>
          <draggable class="list-group templates" :list="list2" group="element" @change="log">
            <div class="list-group-item" v-for="(element,item) in list2" :key="item">
              <div class="templates-item" v-if="element.items == null">
                <!-- 单个 -->
                <div class="edit">
                  <span @click="editItem(item)">编辑</span>
                  <span @click="deleteItem(item)">删除</span>
                </div>
                <formBuilder :rule="element"></formBuilder>
              </div>
              <!-- 布局 -->
              <div class="templates-item-col" v-if="element.items != null">
                <!-- 布局 -->
                
                <draggable
                  class="list-group templates"
                  :list="element.items"
                  group="element"
                  @change="log"
                >
                  <el-row :gutter="20">
                    <el-col :span="12" v-for="(elementItems,items) in element.items"
                          :key="items">
                      <div class="grid-content bg-purple">
                        <div
                          class="list-group-item-col"
                          
                        >
                        <span>{{elementItems.title}}</span>
                          <formBuilder :rule="element"/>
                          <div class="edit-son">
                            <span @click="editItem(item)">编辑</span>
                            <span @click="deleteItem(item)">删除</span>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </draggable>
                <div class="edit-parent">
                  <span @click="editItem(item)">编辑</span>
                  <span @click="deleteItem(item)">删除</span>
                </div>
              </div>
            </div>
          </draggable>
          <!-- <form-create  v-model="fApi" :rule="rule"></form-create> -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import draggable from "vuedraggable";
// import vinput from '../../function/vinput.vue'
import editItem from "../../function/editItem.vue";
import formBuilder from "../../function/core.js";
import componentJson from "../../function/component.js";
export default {
  //   name: "two-lists",
  //   display: "Two Lists",
  //   order: 1,
  components: {
    draggable,
    formBuilder,
    editItem
    // vinput
  },
  data() {
    return {
      dialogVisible: false,
      list1: componentJson,
      drawer: false,
      direction: "rtl",
      drawerItem: {}, // 用于识别编辑的项目
      list2: [
        // 默认
        { name: "标题", title: "标题", type: "title" },
        {
          name: "输入框",
          type: "input",
          field: "goods_name",
          title: "商品名称:",
          value: "mi"
        },
        { name: "按钮", title: "提交", type: "button" }
      ]
    };
  },
  methods: {
    add: function() {
      this.list.push({ name: "Juan" });
    },
    replace: function() {
      this.list = [{ name: "Edgard" }];
    },
    clone: function(el) {
      console.log(el);
      // let newData = JSON.parse(JSON.stringify(el));
      let { ...newData } = el;
      return newData;
    },
    log: function() {
      // window.console.log(evt);
      window.console.log(this.list2);
    },
    editItem: function(item) {
      console.log(this.list2[item]);
      this.drawer = true;
      this.drawerItem = this.list2[item];
      // item.title="标题2"
      // this.list2[item].title = "sda"
    },
    deleteItem: function(key) {
      // 传下标
      // this.dialogVisible = true
      let self = this;
      this.$confirm("确认删除?").then(function() {
        // console.log(result)
        self.list2.splice(key, 1);
      });

      console.log(this.list2);
    }
  }
};
</script>
<style lang="scss" scoped>
.templates {
  // border:1px solid rgb(240,240,240);
  background: rgb(251, 251, 251);
  height: 100%;
  .templates-item {
    position:relative;
  }
  .templates-item .edit {
    display: none;
    position: absolute;
    right: 0px;
    z-index: 1;

    // text-align: end;
    span {
      margin: 0 5px;
      padding: 2px;
      background: rgb(200, 200, 200);
      color: #fff;
      cursor: pointer;
    }
    
  }
  .templates-item-col{
    position:relative;
  }
  .templates-item-col .edit-parent{
    display: none;
    position: absolute;
    right: 0px;
    top:1px;
    z-index: 1;

    // text-align: end;
    span {
      margin: 0 5px;
      padding: 2px;
      background: rgb(200, 200, 200);
      color: #fff;
      cursor: pointer;
    } 
  }
  .templates-item-col .list-group-item-col .edit-son{
    display: none;
    position: absolute;
    // right: 34px;
    // margin-left:90px;
    top: 1px;
    z-index: 1;

    // text-align: end;
    span {
      margin: 0 5px;
      padding: 2px;
      background: rgb(200, 200, 200);
      color: #fff;
      cursor: pointer;
    } 
  }
  .templates-item:hover {
    border: 1px solid rgb(200, 200, 200);
    border-style: dashed;
    .edit {
      display: block;
      text-align: end;
    }
  }
  .templates-item-col:hover {
    border: 1px solid rgb(200, 200, 200);
    border-style: dashed;
    .edit-parent {
      display: block;
      text-align: end;
    }
  }
  .templates-item-col .list-group-item-col:hover {
    border: 1px solid rgb(200, 200, 200);
    border-style: dashed;
    .edit-son {
      display: block;
      text-align: end;
    }
  }
}
</style>