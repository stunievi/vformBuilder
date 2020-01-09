<template>
  <div style="    height: 100%;">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <form-create v-model="fApi" :rule="rule" :option="option"></form-create> -->
    <el-container style=" border: 1px solid #eee;height:100%">
      <el-container >
        

        <el-main>
          <el-scrollbar style="height:100%;margin: 0 auto;">
            <div style="width:600px">
                <el-button type="primary" @click="back">返回</el-button>
                <el-button type="primary" @click="log()">保存<i class="el-icon-upload el-icon--right"></i></el-button>
                <div v-for="(li,item) in list" :key="item">
                    <div v-if="li.items == null">
                        <formBuilder :rule="li" />
                    </div>
                    <div v-else>
                        <!-- <div v-for="(li.item,item) in list" :key="item">

                        </div> -->
                        <!-- <formBuilder :rule="li" /> -->
                    </div>
                    
                </div>
            </div>
            
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import formBuilder from "../../function/core.js";
export default {
  name : 'vtitle',
  data(){
    return {
        dialogVisible:false,
      value: '123',
      name:"",
      id:this.$route.query.id,
      formList:[],
      list:[]


    }
      
  },
  components:{
      formBuilder
  },
  mounted:function(){
      // 调用更新formlist
     this.getFormInfo()
     
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

    getFormInfo:function(){
        this.axios.post(this.global.url + "/app/getAppFormInfo",{
          id:this.$route.query.id
      }).then((response) => {
          if(response.data.state == true){
              console.log("this.list",response.data.data)
              this.list = response.data.data.formData

          }else{
            this.$message("获取表单信息失败")
          }
          
      })
    },
    back:function(){
        this.$router.go(-1)
    },
    enterForm:function(list){
        // console.log()
        this.$router.push({path:"/designApp/newApplication",query:{id:list.id}})
    },
    log:function(){
        var result = {};
        this.list.forEach(v=>{
            // let field = v.field
            console.log("vvvvvvvvvvvvvvvvvv",v)
            let value = v.value
            result[v.field] = value
        })
            console.log(result)

    //     return null;
        this.axios.post(this.global.url + "/app/insertFormDataById",{
          id:this.id,
          formData:JSON.stringify(result)
      }).then((response) => {
          if(response.data.state == true){
              this.$message("保存成功")
          }else{
            this.$message("保存失败")
          }
          
      })
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