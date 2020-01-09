<template>
  <xdh-window class="xdh-dialog"
              v-bind="$props"
              :minimized.sync="minimized"
              :collapsed.sync="collapsed"
              :maximized.sync="maximized"
              :closed.sync="dialogClosed"
              :append-to-body="true">
    <slot name="title" slot="title"></slot>
    <slot name="tools" slot="tools"></slot>
    <slot></slot>
    <slot name="footer" slot="footer">
    </slot>
  </xdh-window>
</template>

<script>
  /**
   * 对话框组件
   * @module widgets/xdh-dialog
   * @author 陈华春
   */
  import XdhWindow from '../xdh-window'

  /**
   * 插槽
   * @member slots
   * @property {string} default 对话框内容
   * @property {string} footer 底部内容
   */

  /**
   * @export
   */
  export default {
    name: 'XdhDialog',
    components: {
      XdhWindow
    },
    /**
     * 参数属性, 继承 [xdh-window]{@link module:widgets/xdh-window}
     * @member porps
     *
     */
    props: {
      ...XdhWindow.props,
      footerHeight: {
        type: String,
        default: '60px'
      }
    },
    data() {
      return {
        dialogClosed: this.closed
      }
    },
    watch: {
      dialogClosed(isClosed) {
        isClosed ? this.$emit('on-close', this) : this.$emit('on-open', this)
        this.$emit('update:closed', isClosed)
      },
      closed(val) {
        this.dialogClosed = val
      },
      minimized(val) {
        this.$emit('update:minimized', val)
      },
      collapsed(val) {
        this.$emit('update:collapsed', val)
      },
      maximized(val) {
        this.$emit('update:maximized', val)
      }
    },
    mounted() {
      this.dialogClosed ? this.$emit('on-close', this) : this.$emit('on-open', this)
    }
  }
</script>
