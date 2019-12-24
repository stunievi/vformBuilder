
<template>
    <draggable class="list-group templates" :list="info.items" group="element" >
          <div
            class="list-group-item "
            

          >
          <div class="templates-item" >
            <div class="edit">
              <span @click="editItemt(item)">编辑</span>
              <span @click="deleteItemt(item)">删除</span>
            </div>
            <formBuilder :rule="element">
            </formBuilder>
            <span>
              dads
            </span>
          </div>
          
          </div>
        </draggable>

</template>
<script>
import draggable from "vuedraggable";
import formBuilder from './core.js'
  export default {
      name:"draggableItems",
    props:{
        info:Object
    },
    component:{
      draggable,
      formBuilder
    },
    data() {
      return {
        
      };
    },
    methods: {
      editItem: function(item) {
        console.log(this.info.item[item]);
        
        // this.drawerItem = this.list2[item];
        // this.drawer = true;
      },
      deleteItem: function(key) {
        // 传下标
        // this.dialogVisible = true
        // console.log();
        // let self = this;
        // this.$confirm("确认删除?").then(function() {
        //   // console.log(result)
        //   self.list2.splice(key, 1);
        // });

        console.log(this.info.item[key]);
      },
    }
  };
</script>