<template>
  <div class="xdh-loading" :style="style">
    <div class="xdh-loading__content">
      <slot>
        <i class="xdh-loading__icon el-icon-loading"></i>
        <div>正在努力加载...</div>
      </slot>
    </div>
  </div>
</template>

<script>
  /**
   * loading组件
   * @module widgets/xdh-loading
   * @example
   *
   * // 使用说明
   * <div style="height: 100px">
   *  <xdh-loading></xdh-loading>
   * </div>
   */
  export default {
    name: 'XdhLoading',
    /**
     * 属性参数
     * @property {HTMLElement} [container] container 显示loading的HTMLElement，用作计算垂直居中, 为null时，不自动计算
     */
    props: {
      container: {
        type: HTMLElement
      }
    },
    data() {
      return {
        top: 0,
        parentNode: null
      }
    },
    computed: {
      style() {
        return {
          transform: `translateY(${this.top}px)`
        }
      }
    },
    watch: {
      container(val) {
        this.parentNode = val || this.$el.parentNode
        this.setTop()
      }
    },
    methods: {
      setTop() {
        if (this.container === null) return
        if (!this.parentNode || !this.$el) return
        const parentRect = this.parentNode.getBoundingClientRect()
        const rect = this.$el.getBoundingClientRect()
        this.top = (parentRect.height - rect.height) / 2
      }
    },
    mounted() {
      this.parentNode = this.container || this.$el.parentNode
      if (this.parentNode && this.container !== null) {
        this.setTop()
      }
    }
  }
</script>
