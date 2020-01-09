<template>
  <el-rate v-bind="$attrs" v-on="$listeners" v-model="fieldValue"></el-rate>
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


