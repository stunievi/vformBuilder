<template>
    <div>
        <span  class="small">{{info.title}}:</span>
        <el-select v-model="value"  placeholder="请选择" @change="change">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
    </div>
  
</template>

<script>
  export default {
    name : 'vselect',
    props: {
        info: Object
    },
    data() {
      return {
        options:this.info.options,
        value: this.info.value || ''
      }
    },
    methods:{
      change:function(val){
          var obj = {}
          obj = this.options.find(item =>{
          return item.value === val 
        });
       console.log(obj)
       console.log(this.value)
      //  this.editMessage.chname = obj.chname
     }
    }
  }
</script>
<style>
.small{
  font-size:14px;
}
</style>