<template>
  <div style="height: 100%;">
    <el-container style="height: 100%;">
      <el-main  v-loading="loading">
          <div style="display:flex;flex-flow: wrap;" >
            <div style="margin: 10px;">
                <div class="newapp" @click="dialogVisible = true">
                    <div>
                        <i class="el-icon-plus text icon"></i>
                    </div>
                    <div>
                        <span class="text">新建应用</span>
                    </div>
                </div>   
            </div>
            <div v-for="(li,item) in list" :key="item" style="margin: 10px;">
                <div class="newapp" @click="enterNewApp(li)">
                    <div>
                        <span class="text">{{li.name}}</span>
                    </div>
                </div>   
            </div>
            
          </div>
          
      </el-main>
      <div>
          <el-dialog
            title="新建应用"
            :visible.sync="dialogVisible"
            width="500px"
            center  
            >
            <div style="height:32px">
                <div style="float:left">
                    <span style="line-height:32px">应用名称:</span>
                </div>
                <div  style="float:left;width:86%">
                   <el-input
                        placeholder="请填写信息"
                        v-model="name"
                        size="small"
                        >
                    </el-input>
                </div>
                
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sure">确 定</el-button>
            </span>
            </el-dialog>
      </div>
    </el-container>
  </div>
</template>
<script>

export default {

  data() {
    return {
      dialogVisible:false,
      name:"",
      list:[],
      loading:true
    };
  },
  mounted:function(){
      this.axios.get(this.global.url + "/app/appList").then((response) => {
            console.log(response.data)
            this.list = response.data.data
            this.loading = false;
        })
  },
  methods: {
    sure:function(){
        this.dialogVisible = false
        console.log(this.global)
        this.axios.post(this.global.url + "/app/newApp",{
            name:this.name
        }).then((response) => {
            // console.log(response)
            if(response.data.state == false){
                this.$message(response.data.message);

            }
            // 清空
            this.name = ""
        })
        // this.axios.get(this.global.url + "/index/index",{

        // }).then(function(data){
        //     console.log(data)
        // })
    },
    enterNewApp:function(item){
        // console.log()
        this.$router.push({path:"/designApp/modifyApp",query: { id: item.id}})
    }
    
  }
};
</script>
<style lang="scss" scoped>
.newapp{
    border:1px solid #5da6ff;
    width:150px;
    height:200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;
    .text{
        color:#5da6ff;
        font-size: 1.2rem;
    }
    .icon{
        font-size: 1.5rem;
    }
}
</style>