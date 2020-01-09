<template>
  <div v-if="!currentClosed"
       v-show="!currentMinimized"
       class="xdh-window__wrapper"
       :class="wrapperClasses"
       :style="wrapperStyles"
       @click="handleClick">
    <transition name="el-fade-in">
      <div class="xdh-window__modal" v-if="!currentClosed && !currentMinimized && modal && !inline"></div>
    </transition>
    <transition name="el-fade-in">
      <el-container v-if="!currentClosed"
                    v-show="!currentMinimized"
                    class="xdh-window"
                    :class="classes"
                    :style="styles"
                    v-draggable="draggableOptions"
                    v-resizable="resizableOptions">
        <el-header class="xdh-window__header" :height="headerHeight" v-if="hasHeader">
          <slot name="icon">
            <div class="xdh-window__icon" v-if="icon"><i :class="`${icon}`"></i></div>
          </slot>
          <div class="xdh-window__title">
            <slot name="title">{{title}}</slot>
          </div>
          <div class="xdh-window__tools">
            <slot name="tools"></slot>
            <span class="xdh-window__tool" v-if="collapsible" @click="handleCollapsed">
            <i v-if="currentCollapsed" :class="icons[0]"></i>
            <i v-else :class="icons[1]"></i>
          </span>

            <span class="xdh-window__tool" v-if="minimizable" @click="handleMinimized"><i
              :class="icons[2]"></i></span>

            <span class="xdh-window__tool" v-if="maximizable" @click="handleMaximized">
            <i v-if="currentMaximized" :class="icons[3]"></i>
            <i v-else :class="icons[4]"></i>
          </span>

            <span class="xdh-window__tool" v-if="closable" @click="handleClosed"><i :class="icons[5]"></i></span>
          </div>
        </el-header>
        <el-main class="xdh-window__body">
          <slot></slot>
        </el-main>
        <el-footer class="xdh-window__footer" :height="footerHeight" v-if="$slots.footer">
          <slot name="footer"></slot>
        </el-footer>
      </el-container>
    </transition>

  </div>

</template>

<script>
  /**
   * 窗体组件
   * @module widgets/xdh-window
   * @author 陈华春
   */
  import draggable from '../../utils/directives/draggable'
  import resizable from '../../utils/directives/resizable'

  /**
   * 插槽
   * @member slots
   * @property {string} default 窗体内容
   * @property {string} title 定义标题内容，设置了改插槽，参数title将无效
   * @property {string} tools 定义操作按钮
   * @property {string} footer 定义底部内容
   */

  /**
   * @export
   */
  export default {
    name: 'XdhWindow',
    directives: {
      draggable,
      resizable
    },
    /**
     * 属性参数
     * @property {string} [title] 标题文字, 为null时即不显示头部
     * @property {string} [icon] 标题旁边的图标样式名称
     * @property {string} [width=auto] 窗体宽度
     * @property {string} [height=auto] 窗体高度
     * @property {string} [left=null] 窗体左位置，inline为true是无效， left、top同时为null时，自动居中
     * @property {string} [top=null] 窗体顶位置，inline为true是无效， left、top同时为null时，自动居中
     * @property {boolean} [closable=true] 是否显示关闭按钮
     * @property {boolean} [collapsible=false] 是否显示折叠按钮
     * @property {boolean} [maximizable=false] 是否显示最大化按钮
     * @property {boolean} [minimizable=false] 是否显示最小化按钮
     * @property {boolean} [closed=false] 是否关闭状态，支持sync修饰符进行双向绑定
     * @property {boolean} [collapsed=false] 是否折叠收起状态，支持sync修饰符进行双向绑定
     * @property {boolean} [minimized=false] 是否最小化状态，支持sync修饰符进行双向绑定
     * @property {boolean} [maximized=false] 是否最大化状态，支持sync修饰符进行双向绑定
     * @property {boolean} [modal=true] 是否显示遮罩层，inline为true是无效
     * @property {boolean|object} [draggable=true] 窗体支持拖拽配置参数, 参数对象参考[v-draggable]{@link module:utils/directives/draggable}
     * @property {boolean|object} [resizable=true] 窗体支持改变尺寸配置参数, 设置该参数，必须要设置width和height 参数对象参考[v-resizable]{@link module:utils/directives/resizable}
     * @property {string} [headerHeight=40px] 头部高度
     * @property {string} [footerHeight=40px] 底部高度
     * @property {number} [zIndex=1000] 窗体层级
     * @property {boolean} [shadow=true] 是否显示窗体阴影
     * @property {boolean} [inline=false] 是否以内联方式显示
     * @property {Array} [icons] 图标数组
     */
    props: {
      // 标题
      title: {
        type: String
      },
      // 标题图标
      icon: {
        type: String
      },
      // 宽度
      width: {
        type: [String, Number],
        default: 'auto'
      },
      // 高度
      height: {
        type: [String, Number],
        default: 'auto'
      },
      // 最大高度
      maxHeight: {
        type: [String, Number],
        default: 'auto'
      },
      // 左位置
      left: {
        type: [String, Number],
        default: null
      },
      // 上位置
      top: {
        type: [String, Number],
        default: null
      },
      // 能否关闭
      closable: {
        type: Boolean,
        default: true
      },
      // 能否折叠
      collapsible: {
        type: Boolean,
        default: false
      },
      // 能否最大化
      maximizable: {
        type: Boolean,
        default: false
      },
      // 能否最小化
      minimizable: {
        type: Boolean,
        default: false
      },
      // 是否关闭
      closed: {
        type: Boolean,
        default: false
      },
      // 是否折叠
      collapsed: {
        type: Boolean,
        default: false
      },
      // 是否最小化
      minimized: {
        type: Boolean,
        default: false
      },
      // 是否最大化
      maximized: {
        type: Boolean,
        default: false
      },
      // 是否需要遮罩层
      modal: {
        type: Boolean,
        default: true
      },
      // 是否开启拖拽
      draggable: {
        type: [Boolean, Object],
        default: false
      },
      // 是否能改变尺寸
      resizable: {
        type: [Boolean, Object],
        default: false
      },
      // 头部高度
      headerHeight: {
        type: String,
        default: '40px'
      },
      // 底部高度
      footerHeight: {
        type: String,
        default: '40px'
      },
      // 层级
      zIndex: {
        type: Number,
        default: 1000
      },
      // 边框是否需要阴影
      shadow: {
        type: Boolean,
        default: true
      },
      // 是否以内联方式显示
      inline: {
        type: Boolean,
        default: false
      },
      appendToBody: {
        type: Boolean,
        default: true
      },
      icons: {
        type: Array,
        default() {
          return [
            'el-icon-caret-bottom',
            'el-icon-caret-top',
            'iconfont icon-mini',
            'iconfont icon-mid',
            'iconfont icon-full',
            'el-icon-close'
          ]
        }
      }
    },
    data() {
      return {
        currentCollapsed: this.collapsed,
        currentMinimized: this.minimized,
        currentMaximized: this.maximized,
        currentClosed: this.closed
      }
    },
    watch: {
      collapsed(val) {
        this.currentCollapsed = val
      },
      minimized(val) {
        this.currentMinimized = val
      },
      maximized(val) {
        this.currentMaximized = val
      },
      closed(val) {
        this.currentClosed = val
        if (!val && this.appendToBody && this.$el && !this.inline) {
          document.body.appendChild(this.$el)
        }
      }
    },
    computed: {
      hasHeader() {
        return this.title !== null
      },
      wrapperClasses() {
        return {
          'is-inline': this.inline
        }
      },
      wrapperStyles() {
        return {
          'z-index': this.zIndex,
          height: this.inline ? this.height : 'auto'
        }
      },
      classes() {
        return {
          'is-center': !this.inline && !this.resizable && this.left === null && this.top === null,
          'is-minimized': this.currentMinimized,
          'is-maximized': this.currentMaximized,
          'is-collapsed': this.currentCollapsed,
          'is-shadow': this.shadow,
          'is-inline': this.inline
        }
      },
      styles() {
        let style = {}
        if (this.currentMaximized) {
          style = {
            left: 0,
            top: 0
          }
          if (this.currentCollapsed) {
            style.height = this.headerHeight
          }
          return style
        }
        style = {
          width: this.width,
          height: this.currentCollapsed ? this.headerHeight : this.height,
          'max-height': this.maxHeight
        }
        if (this.resizable) {
          const clientWidth = window.innerWidth
          const clientHeight = window.innerHeight
          style.left = this.left || `${(clientWidth - (parseInt(style.width)) || 0) / 2}px`
          style.top = this.top || `${(clientHeight - (parseInt(style.height) || 0)) / 2}px`
        } else {
          if (this.left !== null) style.left = this.left
          if (this.top !== null) style.top = this.top
        }
        return style
      },
      draggableOptions() {
        if (this.title === null || this.inline) {
          return false
        }
        return this.draggable ? Object.assign({
          handle: '.xdh-window__header',
          onStartDrag: (e) => {
            /**
             * 开始拖拽时触发
             * @event on-start-drag
             * @param {object} e 拖拽事件对象
             */
            this.$emit('on-start-drag', e)
          },
          onStopDrag: (e) => {
            /**
             * 拖拽结束时触发
             * @event on-stop-drag
             * @param {object} e 拖拽事件对象
             */
            this.$emit('on-stop-drag', e)
          },
          onDrag: (e) => {
            /**
             * 正在拖拽时触发
             * @event on-drag
             * @param {object} e 拖拽事件对象
             */
            this.$emit('on-drag', e)
          }
        }, this.draggable) : false
      },
      resizableOptions() {
        return this.resizable ? Object.assign({
          minWidth: 100,
          minHeight: 41,
          onStartResize: (e) => {
            /**
             * 开始改变尺寸时触发
             * @event on-start-resize
             * @param {object} e resize事件对象
             */
            this.$emit('on-start-resize', e)
          },
          onStopResize: (e) => {
            /**
             * 改变尺寸结束时触发
             * @event on-stop-resize
             * @param {object} e resize事件对象
             */
            this.$emit('on-stop-resize', e)
          },
          onResize: (e) => {
            /**
             * 正在改变尺寸时触发
             * @event on-resize
             * @param {object} e resize事件对象
             */
            this.$emit('on-resize', e)
          }
        }, this.resizable) : false
      }
    },
    methods: {
      handleCollapsed() {
        this.currentCollapsed = !this.currentCollapsed
        this.$emit('update:collapsed', this.currentCollapsed)
        /**
         * collapsed改变时触发
         * @event on-collapsed
         * @param {boolean} collapsed 当前的collapsed
         */
        this.$emit('on-collapsed', this.currentCollapsed, this)
      },
      handleMinimized() {
        this.currentMinimized = true
        this.$emit('update:minimized', this.currentMinimized)
        /**
         * 最小化时触发
         * @event on-minimized
         */
        this.$emit('on-minimized', this)
      },
      handleMaximized() {
        this.currentMaximized = !this.currentMaximized
        this.$emit('update:maximized', this.currentMaximized)
        /**
         * 最化时触发
         * @event on-minimized
         */
        this.$emit('on-maximized', this.currentMaximized, this)
      },
      handleClosed() {
        this.currentClosed = true
        this.$emit('update:closed', this.currentClosed)
        /**
         * 窗体关闭触发
         * @event on-closed
         */
        this.$emit('on-closed', this)
      },
      handleClick() {
        this.$emit('click', this)
      }
    },
    mounted() {
      if (this.appendToBody && this.$el && !this.inline) {
        document.body.appendChild(this.$el)
      }
    },
    destroyed() {
      if (this.appendToBody && this.$el && this.$el.parentNode && !this.inline) {
        this.$el.parentNode.removeChild(this.$el)
      }
    }
  }
</script>
