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
            <div class="form-list-item">
              <div @click="enterAppView(value)">
                <span>
                {{value.name}}
              </span>
              </div>
              
            </div>
            
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
              // console.log(this.appList)
              // 获取第一个的表单
                this.getAppFormList(this.appList[0])
                loadingInstance1.close()
          }else{
            this.$message("获取表单信息失败")
          }
          
      })  
  },
  methods: {
    
    appListOpen:function(item){
      console.log(item)
      this.getAppFormList(item)
    },
    getAppFormList:function(item){
      this.axios.post(this.global.url + "/app/getAppForm",{
            id:item.id
        }).then((response) => {
            if(response.data.state == true){
                this.appForm = response.data.data
                console.log(this.appForm)
                // 获取第一个的表单
                
            }else{
              this.$message(response.data.message)
              this.appForm = []
            }
            
        })
    },
    enterAppView:function(item){
      this.$router.push({path:"/appView",query: { id: item.parentId,item:item.id}})
    }
  }
};
</script>
<style lang="scss" scoped>
.form-list-item{
  width: 100px;
  height: 100px;
  border: 1px solid #5da6ff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  span{
    color:#5da6ff
  }
}
</style>