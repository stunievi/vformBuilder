<template>
  <el-date-picker v-bind="$attrs" v-on="$listeners" v-model="fieldValue"></el-date-picker>
</template>

<script>
  export default {
    props: {
      value: {
        type: [String, Array, Date]
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

