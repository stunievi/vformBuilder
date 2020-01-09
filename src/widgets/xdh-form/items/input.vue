<template>
  <el-input v-bind="$attrs" v-on="$listeners" v-model="fieldValue"></el-input>
</template>

<script>
  export default {
    props: {
      value: {
        type: String
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


