<template>
  <el-slider v-bind="$attrs" v-on="$listeners" v-model="fieldValue"></el-slider>
</template>

<script>
  export default {
    props: {
      value: {
        type: [Number, Array]
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


