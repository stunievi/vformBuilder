<template>
  <div style="height: 100%;">
    <el-drawer
      title="编辑"
      :visible.sync="drawer"
      :append-to-body="true"
      :modal = "false">
      <div>
        <span>编辑</span>
      </div>
    </el-drawer>
    <el-container style="height: 100%;">
      <el-aside style="max-width:200px;height:100%;background-color: rgb(238, 241, 246)">
        <draggable class="list-group" :list="list1" 
          :group="{ name: 'element', pull: 'clone', put: false  }" @change="log"
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
        
        <el-header style="text-align: right; font-size: 12px;border-bottom:1px solid rgb(240, 240, 240);">
          <el-button @click="log()">保存</el-button>
          
        </el-header>
        <el-main>
        <draggable class="list-group templates" :list="list2" group="element" @change="log">
          <div
            class="list-group-item "
            v-for="(element,item) in list2"
            :key="item"

          >
          <div class="templates-item" >
            <div class="edit">
              <span @click="editItem(element)">编辑</span>
              <span @click="deleteItem(item)">删除</span>
            </div>
            <formBuilder :title="element.title" :type="element.type">
            </formBuilder>
            
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
import formBuilder from '../../function/core.js'
import componentJson from '../../function/component.js'
export default {
//   name: "two-lists",
//   display: "Two Lists",
//   order: 1,
  components: {
    draggable,
    formBuilder
    // vinput
  },
  data() {
    return {
      dialogVisible:false,
      list1: componentJson,
      drawer: false,
        direction: 'rtl',
      list2: [
        // 默认
        { name: "标题", title: "标题", type:"title"},
        {name:'1',type:'input',field:'goods_name',title:'商品名称:',value:'mi'},
        { name: "按钮",title: "提交", type:"button" }
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
      return {
        name: el.name + " cloned"
      };
    },
    log: function(evt) {
      window.console.log(evt);
      window.console.log(this.list2);
    },
    editItem:function(item){
      console.log(item)
      this.drawer = true
      item.title="中华人民共和国"
    },
    deleteItem: function(key){
      // 传下标
      // this.dialogVisible = true
      let self = this;
      this.$confirm('确认删除?').then(function(){
        // console.log(result)
        self.list2.splice(key,1);
      })
      
      console.log(this.list2)

    }
  }
};
</script>
<style lang="scss" scoped>
.templates{
  border:1px solid rgb(240,240,240);
  height:100%;
  .templates-item .edit{
    display:none;
    position: absolute;
    right: 34px;
    z-index: 1;
    
    // text-align: end;
    span{
      margin:0 5px;
      padding:2px;
      background:rgb(200,200,200);
      color:#fff;
      cursor: pointer;
    }
  }
  .templates-item:hover{
    border:1px solid rgb(200,200,200);
    border-style: dashed;
    .edit{
      display: block;
      text-align: end;
    }
  }
}
</style>