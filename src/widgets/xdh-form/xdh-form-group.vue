<template>
  <div class="xdh-form-sub xdh-form-group" :class="classes" v-if="isActive" :style="styles">
    <div v-if="tool" class="xdh-form-sub__tool">
      <slot name="tool">
        <el-button @click="handleAdd" icon="el-icon-plus" size="mini"></el-button>
      </slot>
    </div>
    <div v-if="label" class="xdh-form-sub__label" :style="labelStyle">{{label}}
      <i v-if="collapsible"
         @click="handleCollapse"
         class="xdh-form-sub__handler el-icon-arrow-up" :class="{'is-caret':currentCollapsed}"></i></div>
    <transition name="el-zoom-in-top">
      <div v-show="!currentCollapsed" class="xdh-form-sub__content" :class="{'is-collapsed':currentCollapsed}">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
  /**
   * 表单分组
   * @module widgets/xdh-form-group
   *
   */
  import subForm from './mixins/subform'

  /**
   * 插槽
   * @member slots
   * @property {string} - 定义组件内容
   * @property {string} tool 定义操作区内内容，需要设置参数tool为true才有效
   */

  export default {
    name: 'XdhFormGroup',
    mixins: [subForm],
    /**
     *  属性参数
     *  @member props
     *  @property {boolean} [block=true] 是否独占行显示，如需要按列显示，需要设置为false，并且设置宽度width
     *  @property {string} [width] 显示宽度，支持百分比，像素需要带单位
     *  @property {string} [height] 显示高度
     *  @property {boolean} [inline] 内部表单项显示方式采用内行
     *  @property {String} [inlineSize]  inline模式的字段域宽度尺寸，可选值 'large', 'medium', 'small'
     *  @property {string} [size] 内部表单项尺寸，可选值 medium / small / mini
     *  @property {string} [labelPosition] 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width
     *  @property {string} [labelWidth] 表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 auto。
     *  @property {string} [labelSuffix]  表单域标签的后缀
     *  @property {String} [depend] 依赖字段名称
     *  @property {*} [dependValue] 依赖字段的值，依赖字段的值如果与设置的一致即显示
     *  @property {string} [label] 分组标签名称
     *  @property {string} [collapsible=true] 是否开启折叠功能，需要设置label才有效
     *  @property {boolean} [collapsed=false] 初始化默认是否折叠, collapsible为true才有效
     *  @property {boolean} [tool=false] 是否显示工具按钮
     */
    props: {
      block: {
        type: Boolean,
        default: true
      },
      width: String,
      height: String
    },
    computed: {
      styles() {
        return {
          width: this.width,
          height: this.height,
          'vertical-align': this.block ? null : 'top',
          display: this.block ? 'block' : 'inline-block'
        }
      }
    }
  }
</script>
