<template >
  <div >
      <!-- <div v-for="(list,item) in info" :key="item"> -->
      <div style="padding:10px">
          <!-- 标题 -->
          <div v-if="info.title != null" style="display:flex;align-items: center;margin:10px 0">
            <div >
                <span >
                标题:
                </span>
            </div>
                <div  style="flex-grow: 1;">
                <el-input
                    placeholder="请填写信息"
                    v-model="inputValue"
                    size="small"
                    >
                </el-input>
            </div>
        </div>
        <!-- 类型 -->
          <!-- <div v-if="info.type != null" style="display:flex;align-items: center;margin:10px 0">
            <div >
                <span >
                类型:
                </span>
            </div>
                <div  style="flex-grow: 1;">
                <el-input
                    placeholder="请填写信息"
                    v-model="type"
                    size="small"
                    >
                </el-input>
            </div>
        </div> -->
        
      </div>
    
    <div style="margin:10px auto 0 auto;width: 41px;">
        <el-button @click="sure()" type="primary">确定<i class="el-icon-upload el-icon--right"></i></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name : 'editItem',
  props: {
    info: Object
  },
  data(){
    return {
      inputValue: this.info.title,
      type: ''
    }
      
  },
  methods:{
      sure:function(){
          console.log(this.info)
          this.info.title = this.inputValue
      }
  },
  watch: {
    info: function () {
         this.inputValue = this.info.title
    }
  }
}
</script>

<style>

</style>