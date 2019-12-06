<template>
  <div style="    height: 100%;">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <form-create v-model="fApi" :rule="rule" :option="option"></form-create> -->
    <el-container style=" border: 1px solid #eee;height:100%">
      <el-scrollbar>
        <div style="height:100%;width:200px;border:1px solid rgb(241, 241, 241)">
          <div style="background-color: rgb(241, 241, 241);height:30px">
              <span style="line-height:30px;    font-size: .8rem;">表单列表</span>
          </div>
          <div v-if="formList.length == 0">
              <span style="font-size: .8rem;">列表为空</span> 
          </div>
          <div v-else>
              <div>
                  <ul class="form-list" >
                      <li v-for="(list,item) in formList" :key="item" @click="enterForm(list)">{{list.name}}</li>
                  </ul>
              </div>
              
          </div>
        </div>
      </el-scrollbar>
      <el-container >
        

        <el-main>
          <el-scrollbar style="height:100%">
            <div>
                <div style="display:flex;flex-flow: wrap;" >
                    <div style="margin: 10px;">
                        <div class="newapp" @click="dialogVisible = true">
                            <div>
                                <i class="el-icon-plus text icon"></i>
                            </div>
                            <div>
                                <span class="text">新建表单</span>
                            </div>
                        </div>   
                    </div>
                </div>
            </div>
            <div>
          <el-dialog
            title="新建表单"
            :visible.sync="dialogVisible"
            width="500px"
            center  
            >
            <div style="height:32px">
                <div style="float:left">
                    <span style="line-height:32px">表单名称:</span>
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
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name : 'vtitle',
  data(){
    return {
        dialogVisible:false,
      value: '123',
      name:"",
      formList:[]
    }
      
  },
  mounted:function(){
      // 调用更新formlist
     this.getFormLit()
  },
  methods: {
    sure:function(){
        this.dialogVisible = false
        console.log(this.global)
        this.axios.post(this.global.url + "/app/newAppForm",{
            name:this.name,
            parentId:this.$route.query.id
        }).then((response) => {
            if(response.data.state == false){
                this.$message(response.data.message);
            }
            // 清空
            this.name = ""
            // 调用更新formlist
            this.getFormLit()
        })
        
    },
    getFormLit:function(){
         console.log(this.$route.query.id)
      this.axios.post(this.global.url + "/app/getAppForm",{
            id:this.$route.query.id
        }).then((response) => {
            // dom根据formList长度判断是否为空
            if(response.data.state == true){
                this.formList = response.data.data
            }
            // console.log(this.formList)
            
        })
    },
    enterForm:function(list){
        // console.log()
        this.$router.push({path:"/designApp/newApplication",query:{id:list.id}})
    }
    
  }
}
</script>

<style lang="scss" scoped>
.newapp{
    border:1px solid #5da6ff;
    width:200px;
    height:150px;
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
.form-list{
    list-style:none;
    padding: 0;
    font-size: .8rem;
    margin:0;
    li{
        padding: 10px;
        border: 1px solid rgb(240,240,240);
        border-radius: 5px;
        margin: 2px 2px 0px 2px ;
        cursor: pointer;
    }
}
</style>