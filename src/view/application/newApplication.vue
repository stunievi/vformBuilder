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
          <el-button @click="link()">关联关系</el-button>
          <el-button @click="save()">保存</el-button>
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
                style="height:60px;"
                  class="list-group templates"
                  :list="element.items"
                  group="element"
                  @change="log"
                >
                  <el-row :gutter="20" style="justify-content: center;display: flex;align-items: center;">
                    <el-col :span="12" v-for="(elementItems,items) in element.items"
                          :key="items">
                      <div class="grid-content bg-purple">
                        <div
                          class="list-group-item-col"
                          
                        >
                        <!-- <span>{{elementItems.title}}</span> -->
                          <formBuilder :rule="elementItems" />
                          <div class="edit-son">
                            <span @click="editItemson(elementItems,items)">编辑</span>
                            <span @click="deleteItemson(element,items)">删除</span>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </draggable>
                <div class="edit-parent">
                  <!-- <span @click="editItem(item)">编辑</span> -->
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
        // {
        //   name: "输入框",
        //   type: "input",
        //   field: "goods_name",
        //   title: "名称:",
        //   value: "mi"
        // }
      ]
    };
  },
  mounted:function(){
    this.axios.post(this.global.url + "/app/getAppFormInfo",{
          id:this.$route.query.id
      }).then((response) => {
          if(response.data.state == true){
            if(response.data.data.data != null){
              this.list2 = response.data.data.data

            }
          }else{
            this.$message("获取表单信息失败")
          }
          
      })
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
      newData.field = this.randomCoding()
      return newData;
    },
    log: function() {
      // window.console.log(evt);
      window.console.log(this.list2);
    },
    editItem: function(item) {
      console.log(this.list2[item]);
      
      this.drawerItem = this.list2[item];
      this.drawer = true;
      // item.title="标题2"
      // this.list2[item].title = "sda"
    },
    deleteItem: function(key) {
      // 传下标
      // this.dialogVisible = true
      // console.log();
      let self = this;
      this.$confirm("确认删除?").then(function() {
        // console.log(result)
        self.list2.splice(key, 1);
      });

      console.log(this.list2);
    },
    editItemson: function(value,item) {
      console.log(value);
      item
      this.drawerItem = value;
      this.drawer = true;
      // item.title="标题2"
      // this.list2[item].title = "sda"
    },
    deleteItemson: function(value,key) {
      // 传下标
      // this.dialogVisible = true
      console.log(value.items[key]);
      // let self = this;
      this.$confirm("确认删除?").then(function() {
        // console.log(result)
        value.items.splice(key, 1);
      });

      // console.log(this.list2);
    },
    
    save:function(){
      var colList = []
      
      let gradeList = JSON.parse(JSON.stringify(this.list2));
      // console.log(gradeList)
      for(let i = 0;i< gradeList.length; i++){
        if(gradeList[i].items != null){
          colList.push(i)
          // console.log(gradeList[i].items)
          for(let t = 0; t <gradeList[i].items.length;t++){
            gradeList[i].items[t].field = this.randomCoding()
            gradeList.push(gradeList[i].items[t])
          }
        }
      }
      colList.forEach(k=>{
        // console.log(k)
        gradeList.splice(k, 1);
      })
      // console.log(gradeList)
      this.axios.post(this.global.url + "/app/insertFormInfo",{
            id:this.$route.query.id,
            formInfo:JSON.stringify(this.list2),
            formList:JSON.stringify(gradeList)
        }).then((response) => {
            // dom根据formList长度判断是否为空
            if(response.data.state != true){
                this.$message("保存表单信息失败")
            }else{
              this.$message({
                message:"保存成功",
                type: 'success'
                })
            }
            // console.log(this.formList)
            
        })
    },
    randomCoding:function (){
      //创建26个字母数组
      var arr = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','_','1','2','3','4','5','6','7','8','9'];
      var idvalue ='';
      let n = 8;//这个值可以改变的，对应的生成多少个字母，根据自己需求所改
      for(var i=0;i<n;i++){
          idvalue+=arr[Math.floor(Math.random()*36)];
      }
      return idvalue;
    },
    link:function(){
      this.$router.push({path:"/designApp/newApplication/link",query: { id: this.$route.query.id}})
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