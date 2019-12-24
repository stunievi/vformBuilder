<template >
  <div style="display:flex;align-items: center;">
    <div>
      <span class="small">
        {{info.title}}:
      </span>
    </div>
    
    <div  style="flex-grow: 1;">
      <el-input
        placeholder="请填写信息"
        v-model="info.value"
        size="small"
        >
      </el-input>
    </div>
      
  </div>
</template>

<script>
export default {
  name : 'vinput',
  props: {
    info: Object
  },
  data(){
    return {
      inputValue: '',
      type: 'show-password'
    }
      
  }
}
</script>

<style>
.small{
  font-size:14px;
}
</style>