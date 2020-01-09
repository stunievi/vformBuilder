<template>
  <el-select v-bind="$attrs" v-on="$listeners" v-model="fieldValue" @keyup.native.13.stop>
    <el-option v-for="(item, index) in options"
               :key="index"
               :label="item.label"
               :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    props: {
      value: {
        type: [String, Number, Boolean, Array]
      },
      options: {
        type: Array,
        default() {
          return []
        }
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

