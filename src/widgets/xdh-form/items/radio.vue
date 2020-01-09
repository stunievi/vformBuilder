<template>
  <el-radio-group v-bind="$attrs" v-on="$listeners" v-model="fieldValue">
    <component :is="component"
               v-for="(item,index) in options"
               :key="index"
               :label="item.value">{{item.label}}
    </component>
  </el-radio-group>
</template>

<script>

  export default {
    props: {
      value: {
        type: String
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
        return this.button ? 'el-radio-button' : 'el-radio'
      },
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

