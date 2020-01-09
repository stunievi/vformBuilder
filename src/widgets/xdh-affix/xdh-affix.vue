<template>
  <div>
    <div :class="classes" :style="styles">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import {on, off} from 'element-ui/lib/utils/dom'
  import {getScroll} from '../../utils/dom'

  const prefixCls = 'xdh-affix'
  /**
   * XdhAffix
   * @module widgets/xdh-affix
   */
  export default {
    name: 'XdhAffix',
    /**
     * 属性参数
     * @member
     * @property {object} props 属性参数
     * @property {Window|HTMLElement} [props.container=window] 容器
     * @property {Number} [props.offsetTop=0] 距离顶部距离固定
     * @property {Number} [props.offsetBottom] 距离底部距离固定， offsetTop和offsetBottom只允许设置一个
     */
    props: {
      container: {
        type: [Window, HTMLElement],
        default() {
          return window
        }
      },
      offsetTop: {
        type: Number,
        default: 0
      },
      offsetBottom: {
        type: Number
      }
    },
    /**
     * 内部数据状态
     * @member
     * @property {Object} data
     * @property {boolean} [affix=false] 是否已经固定
     * @property {object} styles 容器样式对象
     */
    data() {
      return {
        affix: false,
        styles: {}
      }
    },
    computed: {
      offsetType() {
        let type = 'top'
        if (this.offsetBottom >= 0) {
          type = 'bottom'
        }
        return type
      },
      classes() {
        return [
          {
            [`${prefixCls}`]: this.affix
          }
        ]
      }
    },
    watch: {
      container(newVal, oldVal) {
        off(oldVal, 'scroll', this.handleScroll)
        off(oldVal, 'resize', this.handleScroll)
        on(newVal, 'scroll', this.handleScroll)
        on(newVal, 'resize', this.handleScroll)
      }
    },
    mounted() {
      on(this.container, 'scroll', this.handleScroll)
      on(this.container, 'resize', this.handleScroll)
      this.$nextTick(() => {
        this.handleScroll()
      })
    },
    activated() {
      this.handleScroll()
    },
    beforeDestroy() {
      off(this.container, 'scroll', this.handleScroll)
      off(this.container, 'resize', this.handleScroll)
    },
    methods: {
      handleScroll() {
        if (!this.container || !this.$el) return
        const affix = this.affix
        const scrollTop = getScroll(this.container, true)
        const elOffset = this.$el.getBoundingClientRect()

        const containerRect = this.container instanceof Window
            ? {top: 0, height: window.innerHeight}
            : this.container.getBoundingClientRect()
        const containerTop = containerRect.top
        const windowHeight = containerRect.height
        const elHeight = this.$el.getElementsByTagName('div')[0].offsetHeight
        // Fixed Top
        if ((elOffset.top + scrollTop - this.offsetTop - containerTop) < scrollTop && this.offsetType === 'top' && !affix) {
          this.affix = true
          this.styles = {
            top: `${containerTop + this.offsetTop}px`,
            left: `${elOffset.left}px`,
            width: `${elOffset.width}px`
          }
          /**
           * 固定/非固定改变时触发
           * @event module:widgets/xdh-affix#change
           * @param {Boolean} isFixed 是否固定
           */
          this.$emit('change', true)
        } else if ((elOffset.top + scrollTop - this.offsetTop - containerTop) > scrollTop && this.offsetType === 'top' && affix) {
          this.affix = false
          this.styles = null

          this.$emit('change', false)
        }

        // Fixed Bottom
        if (((elOffset.top + this.offsetBottom + elHeight - containerTop) > windowHeight) && this.offsetType === 'bottom' && !affix) {
          this.affix = true
          this.styles = {
            top: `${containerTop + windowHeight - elHeight - this.offsetBottom}px`,
            left: `${elOffset.left}px`,
            width: `${elOffset.width}px`
          }

          this.$emit('change', true)
        } else if (((elOffset.top + this.offsetBottom + elHeight - containerTop) < windowHeight) && this.offsetType === 'bottom' && affix) {
          this.affix = false
          this.styles = null

          this.$emit('change', false)
        }
      }
    }
  }
</script>
