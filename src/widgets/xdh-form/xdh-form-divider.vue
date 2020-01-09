<template>
  <divider v-bind="$props">
    <slot v-if="$slots.default"></slot>
  </divider>
</template>

<script>
  /**
   * 表单分组
   * @module widgets/xdh-form-divider
   *
   */

  import Divider from './items/divider'

  /**
   * 插槽
   * @member slots
   * @property {string} - 定义组件内容
   */


  export default {
    name: 'XdhFormDivider',
    components: {
      Divider
    },
    /**
     * 属性参数
     * @member props
     * @property {string} [icon] 图表样式名称
     * @property {string} [contentPosition=center] 内容对齐位置，可选 'left', 'right', 'center'
     * @property {string} [content] 内容文字
     */
    props: {
      ...Divider.props
    }
  }
</script>

