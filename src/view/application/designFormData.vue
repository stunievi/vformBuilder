<template>
  <div style="    height: 100%;">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <form-create v-model="fApi" :rule="rule" :option="option"></form-create> -->
    <el-container style=" border: 1px solid #eee;height:100%">
      <el-scrollbar>
        <!-- <div style="height:100%;width:200px;border:1px solid rgb(241, 241, 241)">
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
        </div> -->
      </el-scrollbar>
      <el-container >
        

        <el-main>
          <el-scrollbar style="height:100%">
            <div style="width:1000px">
                <el-button type="primary" @click="newData">新建<i class="el-icon-upload el-icon--right"></i></el-button>
                <!-- <div v-for="(li,item) in list" :key="item">
                    <formBuilder :rule="li" />
                </div> -->
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        v-for="(value,key) in list"
                        :key="key"
                    :prop="value.name"
                    :label="value.name"
                    width="180">
                    </el-table-column>
                </el-table>
            </div>
            
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import formBuilder from "../../function/core.js";
export default {
  name : 'vtitle',
  data(){
    return {
        dialogVisible:false,
      value: '123',
      name:"",
      formList:[],
      list: [ { "name": "姓名", "value": "", "field": "姓名" }, { "name": "出生日期", "value": "", "field": "出生日期" }, { "name": "性别", "value": "", "field": "性别" }, { "name": "工号", "value": "", "field": "工号" }, { "name": "民族", "value": "", "field": "民族" }, { "name": "面貌", "value": "", "field": "面貌" }, { "name": "身份证号", "value": "", "field": "身份证号" }, { "name": "手机号", "value": "", "field": "手机号" }, { "name": "住址", "value": "", "field": "住址" }, { "name": "婚姻", "value": "", "field": "婚姻" } ],
      item:{},
    tableData: [
        // {goods_name: "张三", BXFV7AYV: "20", D_538PJN: "男", ZPEADZ8X: "研发部", W_JWCGLX: "工程师"}
    ]

    }
      
  },
  components:{
    //   formBuilder
  },
  mounted:function(){
      // 调用更新formlist
    //  this.getFormLite()
     this.getFormInfo()
     
  },
  methods: {
    sure:function(){
        this.dialogVisible = false
        console.log(this.global)
        this.axios.post(this.global.url + "/app/newAppForm",{
            name:this.name,
            parentId:"5deceb1d1bea8e4f6b7fc7a8"
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
    getFormLite:function(){
      this.axios.post(this.global.url + "/app/getAppForm",{
            id:this.$route.query.id
        }).then((response) => {
            // dom根据formList长度判断是否为空
            if(response.data.state == true){
                this.formList = response.data.data
            }
            console.log(this.formList)
            
        })
    },
    getFormInfo:function(){
        this.axios.post(this.global.url + "/app/getAppFormInfo",{
          id:"5def9d521d001b27c55b18b4"
      }).then((response) => {
          if(response.data.state == true){
              
            //   console.log(response.data.data.formData)
              this.list = response.data.data.formListData
              this.getFormData()
          }else{
            this.$message(response.data.message)
          }
          console.log(response.data.data.data)
          
      })
    },
    getFormData:function(){
        this.axios.post(this.global.url + "/app/getFormData",{
          id:"5deceb1d1bea8e4f6b7fc7a8"
      }).then((response) => {
          if(response.data.state == true){
              let data = response.data.data
              console.log(response.data.data)
              let FormDataList = new Array()
              data.forEach(element => {
                  
                  FormDataList.push(element.formData)
              });
              console.log(FormDataList)
              this.tableData = FormDataList
          }else{
            this.$message(response.data.message)
          }
        //   console.log(response.data.data.data)
          
      })
    },
    enterForm:function(list){
        console.log(list)
        // this.item = list
        // this.$router.push({path:"/designApp/newApplication",query:{id:list.id}})
    },
    enterNewForm:function(){
        this.$router.push({path:"/designApp/design"})
    },
    newData:function(){
        this.$router.push({path:"/appView/newData",query:{id:this.$route.query.item}})
    },
    log:function(){
        console.log(this.list)
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