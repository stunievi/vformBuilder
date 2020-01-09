<template>
  <xdh-panel v-bind="panelProps"
             :title="title"
             :class="classes"
             :style="styles"
             v-clickoutside="handleClickOutside">
    <slot name="title" slot="title"></slot>
    <slot name="tool" slot="tool"></slot>
    <slot slot="footer" name="footer"></slot>
    <div class="xdh-slide-panel__body">
      <div class="xdh-slide-panel__inner">
        <slot></slot>
      </div>
      <slot name="handle">
        <div v-if="showHandle" class="xdh-slide-panel__handle" @click="toggle">
          <i :class="handleIcon"></i>
        </div>
      </slot>
    </div>
    <modal v-if="!collapsed && modal"></modal>
  </xdh-panel>
</template>

<script>
  /**
   * SlidePanel 滑动面板组件
   * @module widgets/xdh-slide-panel
   */
  import XdhPanel from '../xdh-panel'
  import Modal from './modal'
  import {addClass, removeClass} from 'element-ui/lib/utils/dom'
  import clickoutside from 'element-ui/lib/utils/clickoutside'

  /**
   * 插槽
   * @member slots
   * @property {string} title 定义标题内容
   * @property {string} tool 定义工具内容
   * @property {string} footer 定义底部内容
   * @property {string} handle 定义切换按钮
   * @property {string} - 定义主体内容
   */

  export default {
    name: 'XdhSlidePanel',
    components: {
      XdhPanel,
      Modal
    },
    directives: {clickoutside},
    /**
     * 属性参数，继承 xdh-panel 组件，以下是SlidePanel的专有属性参数
     * @property {string} [position=left] 面板停靠位置，可选 left / right / top / bottom
     * @property {string} [width] 面板宽度
     * @property {string} [height] 面板高度
     * @property {boolean} [collapsed=false] 是否折叠收起, 支持sync修饰符
     * @property {boolean} [showHandle=true] 是否显示切换按钮
     * @property {boolean} [appendToBody=false] 是否创建dom到body下
     * @property {string|HTMLElement} [appendTo] 是否创建dom到制定dom下，支持元素Id 和 元素对象
     * @property {Boolean} [modal=false] 是否显示模态层
     * @property {Boolean} [clickOutside=false] 是否启用点击面板外面折叠
     *
     */
    props: {
      ...XdhPanel.props,

      // 停靠位置：left / right / top / bottom
      position: {
        type: String,
        default: 'left'
      },
      // 宽度
      width: String,

      // 高度
      height: String,

      // 是否收起
      collapsed: {
        type: Boolean,
        default: false
      },
      showHandle: {
        type: Boolean,
        default: true
      },
      appendToBody: {
        type: Boolean,
        default: false
      },
      appendTo: {
        type: [String, HTMLElement]
      },
      modal: {
        type: Boolean,
        default: false
      },
      clickOutside: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        appendToDom: null
      }
    },
    computed: {
      panelProps() {
        let options = {...this.$props}
        delete options.width
        delete options.height
        delete options.position
        delete options.collapsed
        return options
      },
      classes() {
        return [
          'xdh-slide-panel',
          `is-${this.position}`,
          {'is-collapsed': this.collapsed}
        ]
      },
      styles() {
        return {
          width: this.width,
          height: this.height
        }
      },
      handleIcon() {
        let icon;
        switch (this.position) {
          case 'left':
            icon = this.collapsed ? 'el-icon-arrow-right' : 'el-icon-arrow-left'
            break;
          case 'right':
            icon = this.collapsed ? 'el-icon-arrow-left' : 'el-icon-arrow-right'
            break;
          case 'top':
            icon = this.collapsed ? 'el-icon-arrow-down' : 'el-icon-arrow-up'
            break;
          case 'bottom':
            icon = this.collapsed ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
            break;
        }
        return icon
      }
    },
    watch: {
      appendTo(val) {
        this.clearDom()
        this.renderDom(val)
      }
    },
    methods: {
      toggle() {
        this.$emit('update:collapsed', !this.collapsed)
        /**
         * 切换时触发
         * @event on-slide
         * @param {boolean} collapsed 是否折叠收起
         */
        this.$emit('on-slide', this.collapsed)
      },
      renderDom(val) {
        let to = val || this.appendTo
        if (to) {
          this.appendToDom = to instanceof HTMLElement
            ? to
            : document.getElementById(to)

          if (this.appendToDom && this.$el) {
            this.appendToDom.appendChild(this.$el)
          }
        }

        if (this.appendToBody && this.$el) {
          window.document.body.appendChild(this.$el)
        }

        if (this.$el.parentNode) {
          addClass(this.$el.parentNode, 'xdh-slide-panel__wrapper')
        }
      },
      clearDom() {
        if (this.$el.parentNode) {
          removeClass(this.$el.parentNode, 'xdh-slide-panel__wrapper')
        }
        if (this.$el && this.$el.parentNode && (this.appendToDom || this.appendToBody)) {
          this.$el.parentNode.removeChild(this.$el)
        }
      },
      handleClickOutside() {
        if (this.clickOutside && !this.collapsed) {
          this.toggle()
        }
      }
    },
    mounted() {
      this.renderDom()
    },
    destroyed() {
      this.clearDom()
    }
  }
</script>
