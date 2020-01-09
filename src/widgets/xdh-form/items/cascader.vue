<template>
  <el-cascader
    :options="treeOptions"
    v-bind="$attrs"
    v-on="$listeners"
    v-model="fieldValue">
  </el-cascader>
</template>

<script>
  import {buildTree} from '@/utils/convert'

  export default {
    props: {
      options: {
        type: Array,
        default() {
          return []
        }
      },
      // 列表数据转化成树结构要用到的父级id值
      parentId: {
        type: [Number, String],
        default: null
      },
      value: {
        type: Array,
        default() {
          return []
        }
      },
      idKey: {
        type: String,
        default: 'id'
      },
      parentIdKey: {
        type: String,
        default: 'parentId'
      }
    },
    data() {
      return {}
    },
    computed: {
      treeOptions() {
        return buildTree(this.options, this.parentId, this.idKey, this.parentIdKey)
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

