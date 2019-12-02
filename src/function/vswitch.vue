<template>
  <div>
      <el-switch
        v-model="value1"
        active-text="按月付费"
        inactive-text="按年付费">
    </el-switch>
  </div>
</template>

<script>
export default {
  name : 'vswitch',
  data(){
    return {
      value1: true,
    }
      
  }
}
</script>

<style>

</style>