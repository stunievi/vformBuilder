<template>
  <el-color-picker v-bind="$attrs" v-on="$listeners" v-model="fieldValue"></el-color-picker>
</template>

<script>
  export default {
    props: {
      value: {
        type: Number
      }
    },
    computed: {
      fieldValue: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    }
  }
</script>
