<template>
  <xdh-layout class="xdh-panel"
              :class="classes"
              :fixed="fit"
              :north="{height:headerHeight}"
              :south="{height: footerHeight}"
              :west="false"
              :east="false">
    <xdh-title v-if="title!==null"
               slot="north"
               class="xdh-panel__header"
               :title="title"
               :icon="icon"
               :theme="theme"
               :simple="simple">
      <slot name="title" slot="title"></slot>
      <slot name="tool" slot="tool"></slot>
    </xdh-title>
    <slot></slot>
    <slot slot="south" name="footer"></slot>
  </xdh-layout>

</template>

<script>
  /**
   * panel组件
   * @module widgets/xdh-panel
   * @example
   *
   * // 使用说明
   * <xdh-panel title="标题文字" icon="el-icon-menu">
   *  <template slot="tool">
   *  <i class="el-icon-caret-bottom"></i>
   *  </template>
   *  这是内容...
   * </xdh-panel>
   */
  import XdhTitle from '../xdh-title'
  import XdhLayout from '../xdh-layout'

  /**
   * 插槽
   * @member slot
   * @property {string} name 插槽的命名空间：默认为content的插槽，title为标题插槽，tool为顶部工具栏插槽，footer为panel底部插槽
   */
  export default {
    name: 'XdhPanel',
    components: {
      XdhLayout,
      XdhTitle
    },
    /**
     * 属性参数 props
     * @property {string} title panel的标题字符串
     * @property {string} [icon] panel 头部左边icon  icon="el-icon-menu"
     * @property {string} [theme] 组件主题样式的 className
     * @property {boolean} [simple=false] 是否简约风格，控制标题部分是否有背景色（简约风格title无背景色）
     * @property {boolean} [shadow= false] 是否有阴影
     * @property {string} [headerHeight = '40px'] 标题部分的高度，默认40px
     * @property {string} [footerHeight = '40px'] footer部分的高度，默认40px
     * @property {boolean} [fit = false] 是否让组件的高度自动占满父容器
     * @property {boolean} [border = true] 是否显示边框
     */
    props: {
      title: {
        type: String
      },
      icon: {
        type: String
      },
      theme: {
        type: String,
        default: 'primary'
      },
      simple: {
        type: Boolean,
        default: false
      },
      shadow: {
        type: Boolean,
        default: false
      },
      headerHeight: {
        type: String,
        default: '40px'
      },
      footerHeight: {
        type: String,
        default: '40px'
      },
      fit: {
        type: Boolean,
        default: false
      },
      border: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      classes() {
        return [`xdh-panel--${this.theme}`, {
          'has-shadow': this.shadow,
          'is-simple': this.simple,
          'is-border-none': !this.border
        }]
      }
    }
  }
</script>
