<template>
  <div style="height: 100%;">
    <el-container style="height: 100%;">
      <el-menu
      default-active="0"
      class="el-menu-vertical-demo">
      <el-menu-item v-for="(value,key) in appList" :key="key"  index="0"  @click="appListOpen(value)">
        <i class="el-icon-menu"></i>
        <span slot="title">{{value.name}}</span>
      </el-menu-item>
    </el-menu>
      <el-main>
        <div>
          <div  v-for="(value,key) in appForm" :key="key">
            <span>
              {{value.name}}
            </span>
          </div>
          
        </div>
        
      </el-main>
      
    </el-container>
  </div>
</template>
<script>

export default {

  data() {
    return {
      dialogVisible:false,
      appList:[],
      appForm:[]
    };
  },
  mounted:function(){
    // 获取应用列表及表单
    let loadingInstance1 = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
     });
    this.axios.post(this.global.url + "/app/appList",{
          // id:this.$route.query.id
      }).then((response) => {
          if(response.data.state == true){
              this.appList = response.data.data
              console.log(this.appList)
              // 获取第一个的表单
                this.getAppFormList()
                loadingInstance1.close()
          }else{
            this.$message("获取表单信息失败")
          }
          
      })  
  },
  methods: {
    
    appListOpen:function(item){
      console.log(item)
      this.getAppFormList()
    },
    getAppFormList:function(){
      this.axios.post(this.global.url + "/app/getAppForm",{
            id:this.appList[0].id
        }).then((response) => {
            if(response.data.state == true){
                this.appForm = response.data.data
                console.log(this.appForm)
                // 获取第一个的表单
                
            }else{
              this.$message("获取表单信息失败")
            }
            
        })
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