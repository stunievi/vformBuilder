<template>
  <el-switch v-bind="$attrs" v-on="$listeners" v-model="fieldValue"></el-switch>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean
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
