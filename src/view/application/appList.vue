<template>
  <div style="height: 100%;">
    <el-container style="height: 100%;">
      

      
        <!-- <form-create  v-model="fApi" :rule="rule"></form-create> -->

      <el-main>
      </el-main>
      
    </el-container>
  </div>
</template>
<script>

export default {

  data() {
    return {
      dialogVisible:false
    };
  },
  methods: {
    
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