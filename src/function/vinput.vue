<template >
  <div style="display:flex;align-items: center;">
    <div>
      <span >
      {{title}}
    </span>
    </div>
    
    <div  style="flex-grow: 1;">
      <el-input
        placeholder="请填写信息"
        v-model="inputValue">
      </el-input>
    </div>
      
  </div>
</template>

<script>
export default {
  name : 'vinput',
  props: {
    title: String
  },
  data(){
    return {
      inputValue: '123'
    }
      
  }
}
</script>

<style>

</style>