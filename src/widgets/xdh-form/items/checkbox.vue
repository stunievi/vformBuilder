<template>
  <el-checkbox-group v-bind="$attrs" v-on="$listeners" v-model="fieldValue">
    <component :is="component"
               v-for="(item,index) in options"
               :key="index"
               :label="item.value">{{item.label}}
    </component>
  </el-checkbox-group>
</template>

<script>
  export default {
    props: {
      value: {
        type: Array
      },
      options: {
        type: Array,
        default() {
          return []
        }
      },
      // 是否按钮模式
      button: Boolean
    },
    computed: {
      component() {
        return this.button ? 'el-checkbox-button' : 'el-checkbox'
      },
      fieldValue: {
        get() {
          return this.value || []
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    }
  }
</script>

