<template>
  <div class="xdh-virtual-table">
    <slot :data="visibleData"></slot>
  </div>
</template>

<script>

  /**
   * XdhVirtualTable 虚拟滚动表格，需要与XdhTable结合使用
   * @module widgets/xdh-virtual-table
   */

  import {on, off} from 'element-ui/lib/utils/dom'
  import {addResizeListener, removeResizeListener} from 'element-ui/lib/utils/resize-event'

  export default {
    name: 'XdhVirtualTable',
    /**
     * 属性参数
     * @property {Array} items 表格数据
     * @property {Number} [itemHeight] 表格行高
     * @property {Number} [limit] 可视区最多显示几行
     */
    props: {
      items: {
        type: Array,
        default() {
          return []
        }
      },
      itemHeight: {
        type: Number,
        default: 48
      },
      limit: {
        type: Number,
        default: 20
      }
    },
    data() {
      return {
        visibleData: [],
        elTable: null,
        bodyWrapper: null,
        bodyTable: null,
        fixedBodyWrapper: null,
        fixedBody: null,
        rightFixedBodyWrapper: null,
        rightFixedBody: null,
        bodyPhantom: null,
        fixedBodyPhantom: null,
        rightFixedBodyPhantom: null
      }
    },
    computed: {
      contentHeight() {
        return this.items.length * this.itemHeight + 'px';
      }
    },
    watch: {
      items: {
        immediate: true,
        handler(val, oldVal) {

          // 引用修改数据
          if (val === oldVal) return

          // 追加数据
          if (oldVal && oldVal.length !== 0 && oldVal.length < val.length) return

          // 外部数据改变后重置滚动条
          this.visibleData = val.slice(0, this.limit);
          this.resetScrollTop()
          this.$nextTick(() => {
            this.updateVisibleData(0)
          })
        }
      },
      contentHeight() {
        this.updatePhantom()
      }
    },
    methods: {
      setTransform(el, start) {
        if (!el) return

        el.style.webkitTransform = `translateY(${start * this.itemHeight}px)`;
      },
      resetScrollTop() {
        if (this.bodyWrapper) {
          this.bodyWrapper.scrollTop = 0
        }
      },
      getTabelEl(wrapper) {
        if (!wrapper) return null

        return wrapper.querySelector('table')
      },
      updateVisibleData(scrollTop = 0) {
        if (!this.bodyWrapper || !this.bodyTable) return

        // 取得可见区域的可见列数量
        const visibleCount = Math.ceil(this.bodyWrapper.clientHeight / this.itemHeight);
        // 取得可见区域的起始数据索引
        const start = Math.floor(scrollTop / this.itemHeight);
        // 取得可见区域的结束数据索引，防止在初始化时内容区高度为撑开时，获取高度不对，设定一个最大行数
        const end = Math.max(start + visibleCount, this.limit);
        // 计算出可见区域对应的数据，让 Vue.js 更新
        this.visibleData = this.items.slice(start, end);
        this.setTransform(this.bodyTable, start)
        this.setTransform(this.fixedBody, start)
        this.setTransform(this.rightFixedBody, start)
      },
      handleScroll() {
        if (!this.bodyWrapper) return

        const scrollTop = this.bodyWrapper.scrollTop;
        this.updateVisibleData(scrollTop);
      },

      /**
       * 在内容区插入一个div，把内容撑开显示滚动条
       * @param {HTMLElement} bodyWrapper
       */
      addPhantom(bodyWrapper) {
        const div = document.createElement('div')
        div.style.height = this.contentHeight
        div.classList.add('xdh-virtual-table__phantom')
        bodyWrapper.appendChild(div)
        return div
      },
      updateContentHeight(el) {
        if (!el) return
        el.style.height = this.contentHeight
      },
      updatePhantom() {
        this.updateContentHeight(this.bodyPhantom)
        this.updateContentHeight(this.fixedBodyPhantom)
        this.updateContentHeight(this.rightFixedBodyPhantom)
      },
      removePhantom(el) {
        if (!el) return

        el.parentNode.removeChild(el)
      },
      setFixed() {
        this.fixedBodyWrapper = this.elTable.$refs.fixedBodyWrapper
        this.rightFixedBodyWrapper = this.elTable.$refs.rightFixedBodyWrapper
        this.fixedBody = this.getTabelEl(this.fixedBodyWrapper)
        this.rightFixedBody = this.getTabelEl(this.rightFixedBodyWrapper)
        if (this.fixedBodyWrapper) {
          this.fixedBodyPhantom = this.addPhantom(this.fixedBodyWrapper)
        }
        if (this.rightFixedBodyWrapper) {
          this.rightFixedBodyPhantom = this.addPhantom(this.rightFixedBodyWrapper)
        }
      },
      destroyElement() {
        this.removePhantom(this.bodyPhantom)
        this.removePhantom(this.fixedBodyPhantom)
        this.removePhantom(this.rightFixedBodyPhantom)
        this.elTable = null
        this.bodyWrapper = null
        this.bodyTable = null
        this.fixedBodyWrapper = null
        this.fixedBody = null
        this.rightFixedBodyWrapper = null
        this.rightFixedBody = null
        this.bodyPhantom = null
        this.fixedBodyPhantom = null
        this.rightFixedBodyPhantom = null
      }
    },
    created() {
      this.proxyHandleScroll = this.handleScroll.bind(this)
    },
    mounted() {
      if (this.$children && this.$children[0]) {
        const child = this.$children[0]
        this.elTable = child.$refs.table
        this.bodyWrapper = this.elTable.$refs.bodyWrapper
        this.bodyTable = this.getTabelEl(this.bodyWrapper)
        this.bodyPhantom = this.addPhantom(this.bodyWrapper)
        on(this.bodyWrapper, 'scroll', this.proxyHandleScroll)
        addResizeListener(this.$el, this.proxyHandleScroll)
        // fixed 列是动态构建，在mounted触发时还没完成
        this.$nextTick(() => {
          this.setFixed()
        })
      }
    },
    activated() {
      if (this.bodyWrapper) {
        this.resetScrollTop()
        this.updateVisibleData(0)
      }
    },
    beforeDestroy() {
      if (this.bodyWrapper) {
        off(this.bodyWrapper, 'scroll', this.proxyHandleScroll)
        removeResizeListener(this.$el, this.proxyHandleScroll)
      }
      this.destroyElement()
    }
  }
</script>


<style scoped lang="scss">
  .xdh-virtual-table {
    /deep/ {
      .xdh-virtual-table__phantom {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        z-index: -1;
      }
      .el-table__fixed-body-wrapper {
        width: 100%;
      }
      .el-table__body {
        left: 0;
        right: 0;
        top: 0;
        position: absolute;
      }
      .el-table__fixed-right .el-table__body {
        left: initial;
      }
    }
  }
</style>

