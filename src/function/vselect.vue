<template>
    <div>
        <span  class="small">{{info.title}}:</span>
        <el-select v-model="value" placeholder="请选择">
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
    name : 'vinput',
    props: {
        info: Object
    },
    data() {
      return {
        options:this.info.options,
        value: ''
      }
    }
  }
</script>
<style>
.small{
  font-size:14px;
}
</style>