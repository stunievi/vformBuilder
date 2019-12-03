<template>
  <div>
      <el-button type="primary">{{info.title}}<i class="el-icon-upload el-icon--right"></i></el-button>
  </div>
</template>

<script>
export default {
  name : 'vbutton',
  props: {
    info: Object
  },
  data(){
    return {
      value: '提交'
    }
      
  }
}
</script>

<style>

</style>