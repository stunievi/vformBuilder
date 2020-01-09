<template>
  <xdh-panel class="xdh-list-panel"
             :title="title"
             :icon="icon"
             :fit="fit"
             :border="border"
             :header-height="headerHeight"
             :footer-height="footerHeight">
    <slot slot="title" name="title"></slot>
    <slot slot="tool" name="tool"></slot>
    <div class="xdh-list-panel__body" ref="body">
      <slot :list="list" :height="height" :page="currentPage" :pageSize="size"></slot>
    </div>
    <xdh-loading class="xdh-list-panel__loading" v-show="loading"></xdh-loading>

    <slot name="footer">
      <xdh-pager
        v-if="mode==='pager' && pager"
        slot="footer"
        ref="footer"
        class="xdh-list-panel__pager"
        :total="total"
        :page="currentPage"
        :size="pageSize"
        :sizes="sizes"
        layout="total,sizes, ->, prev, pager, next, jumper,slot"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        v-bind="pagerOptions">
        <slot v-if="$slots['pager-custom']" name="pager-custom"></slot>
      </xdh-pager>
    </slot>

  </xdh-panel>
</template>

<script>
  /**
   * listPanel组件
   * @module widgets/xdh-list-panel
   * @example
   *
   * <xdh-list-panel :load="loadData" :state="state">
   *   <el-table :data="state.list" height="300" border stripe>
   *   <el-table-column label="日期" prop="date"></el-table-column>
   *   <el-table-column label="姓名" prop="name"></el-table-column>
   *   <el-table-column label="标题" prop="title"></el-table-column>
   *   </el-table>
   * </xdh-list-panel>
   * //----------------
   * data:{
   *  state: {
   *    total: 20,
   *    list: [{
   *      date: 'xxx',
   *      name: 'xxx',
   *      title: 'xxx'
   *    }, ...]
   *  }
   * }
   */
  import XdhPager from '../xdh-pager'
  import XdhPanel from '@/widgets/xdh-panel'
  import XdhLoading from '../xdh-loading'
  import {addResizeListener, removeResizeListener} from 'element-ui/lib/utils/resize-event'
  import {on, off} from 'element-ui/lib/utils/dom'
  import {debounce} from '../../utils/util'

  /**
   * 插槽
   * @member slot
   * @property {String} [tool] header区域右侧的工具插槽，可以放入按钮等工具处理列表数据
   * @property {String} [pager-custom] 分页组件自定义内容
   */

  /**
   * 作用域插槽
   * @member scopedSlots
   * @property {String} default 定义列表内容，参数 list：列表数据， height：容器高度, page: 页码， pageSize：页大小
   */

  export default {
    name: 'XdhListPanel',
    componentName: 'ListPanel',
    components: {
      XdhPanel,
      XdhPager,
      XdhLoading
    },
    /**
     * 参数属性
     * @property {String} [title = '列表'] 标题文字
     * @property {String} [icon = 'el-icon-tickets'] 标题文字前面的图标样式名称
     * @property {Boolean} [pager = true] 是否使用分页控件
     * @property {Number} [size = 10] 分页每页显示记录条数
     * @property {Array} [sizes = [10, 20, 50, 100]] 显示分页每页的记录数选项（见分页控件）
     * @property {String} [headerHeight = '40px'] 头部标题栏目的高度
     * @property {String} [footerHeight = '40px'] 底部高度
     * @property {Object} [state = {list: [], total: 0}] 列表的state, 必须包含 list 和 total 如：{total:0, list:[]}
     * @property {Array} [state.list = []] listPanel 的列表数据
     * @property {Number} [state.total] 列表的总条数
     * @property {Object} [stateProps = {total: 'total', list: 'list'}] store的数据属性映射（默认：state的total对应stoer数据中的'total'键,list对应list键）
     * @property {Function(page,size)} [load] 数据加载函数，参数为 加载页和 单页数量。需要返回 promise
     * @property {Boolean} [isAuto = true] 是否在组件初始化时自动加载数据
     * @property {Boolean} [fit = false] 是否填满父容器
     * @property {Number} [distanceToButton = 50] 滚动到距离底部多少距离触发 on-reach-bottom 事件
     * @property {Object} [pagerOptions] 分页组件参数选项
     * @property {string} [mode=pager] 分页加载模式，pager 或 scroll
     * @property {boolean} [border=true] 是否显示边框
     */
    props: {
      // 标题文字
      title: {
        type: String,
        default: '列表'
      },
      // 标题文字前面的图标样式名称
      icon: {
        type: String,
        default: 'el-icon-tickets'
      },
      // 分页每页显示记录条数
      size: {
        type: Number,
        default: 10
      },
      // 显示分页每页的记录数选项
      sizes: {
        type: Array,
        default() {
          return [10, 20, 50, 100]
        }
      },
      // 头部标题栏目的高度
      headerHeight: {
        type: String,
        default: '40px'
      },
      // 底部的高度
      footerHeight: {
        type: String,
        default: '40px'
      },
      // 列表的state, 必须包含 list 和 total 如：{total:0, list:[]}
      state: {
        type: Object,
        default() {
          return {
            total: 0,
            list: []
          }
        }
      },
      // store 属性映射
      stateProps: {
        type: Object,
        default() {
          return {
            total: 'total',
            list: 'list'
          }
        }
      },
      // 加载数据函数，传入参数：page，size，必须要返回Promise
      load: {
        type: Function,
        default: null
      },
      // 是否在初始化时自动加载数据
      isAuto: {
        type: Boolean,
        default: true
      },
      // 是否显示分页
      pager: {
        type: Boolean,
        default: true
      },
      // 是否填满父容器
      fit: {
        type: Boolean,
        default: false
      },
      distanceToButton: {
        type: Number,
        default: 50
      },
      // 分页组件参数选项
      pagerOptions: {
        type: Object
      },
      // 分页模式，pager 或 scroll
      mode: {
        type: String,
        default: 'pager',
        validator(val) {
          return ['pager', 'scroll'].includes(val)
        }
      },
      border: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        currentPage: 1,
        pageSize: this.size,
        loading: false,
        loadingContainer: null,
        height: null,
        // 上次滚动的位置
        lastScrollTop: 0,
        scrollTarget: null
      }
    },
    watch: {
      mode() {
        this.currentPage = 1
        this.lastScrollTop = 0
        this.scrollTarget.scrollTop = 0
        this.loadData()
      }
    },
    computed: {
      list() {
        return this.state[this.stateProps.list] || []
      },
      total() {
        return this.state[this.stateProps.total] || 0
      },
      pageCount() {
        return this.pageSize > 0 ? Math.ceil(this.total / this.pageSize) : 0
      }
    },
    methods: {
      /**
       * 加载数据， 内部调用从组件props传入‘load’函数
       * @Function loadData
       */
      loadData() {
        if (!this.load || this.loading) return
        this.loading = true
        this.load(this.currentPage, this.pageSize)
          .then(() => {
            this.loading = false
            if (this.scrollTarget) this.scrollTarget.scrollTop = this.lastScrollTop

          })
          .catch(() => {
            this.loading = false
            if (this.scrollTarget) this.scrollTarget.scrollTop = this.lastScrollTop
          })
      },
      /**
       * 分页器页码变动是触发的函数
       * @Function handlePageChange
       * @param page
       */
      handlePageChange(page) {
        this.currentPage = page
        this.loadData()
      },
      /**
       * 分页器每页数量变动时触发的函数
       * @Function handleSizeChange
       * @param size
       */
      handleSizeChange(size) {
        this.currentPage = 1
        this.pageSize = size
        this.loadData()
      },
      /**
       * 组件重置函数
       * @Function reload
       */
      reload() {
        this.currentPage = 1
        this.loadData()
      },
      setBodyHeight() {
        if (this.$refs.body) {
          this.height = this.$refs.body.getBoundingClientRect().height
        }

      },
      handleScroll(e) {
        const target = e.target
        const dir = target.scrollTop - this.lastScrollTop > 0 ? 'down' : 'up'
        this.lastScrollTop = target.scrollTop
        this.scrollTarget = target
        const scrollDistance = target.scrollHeight - target.scrollTop - target.clientHeight
        if (dir === 'down' && scrollDistance <= this.distanceToButton) {
          /**
           * 滚动到底部时触发
           * @event on-reach-bottom
           * @param {Number} scrollDistance 离底部的距离
           */
          this.$emit('on-reach-bottom', scrollDistance)

          if (!this.loading && this.mode === 'scroll') {
            if (this.currentPage < this.pageCount) {
              ++this.currentPage
              this.loadData()
            } else {
              /**
               * 滚动模式，已加载完全部数据时触发
               * @event on-load-complete
               */
              this.$emit('on-load-complete')
            }
          }
        }

        if (dir === 'up' && target.scrollTop <= this.distanceToButton) {
          /**
           * 滚动到顶部时触发
           * @event on-reach-top
           * @param {Number} scrollTop 离顶部的距离
           */
          this.$emit('on-reach-top', target.scrollTop)
        }

        /**
         * 滚动时触发
         * @event on-scroll
         * @param {Object} e 事件对象
         */
        this.$emit('on-scroll', e)
      }
    },
    created() {
      this.proxyHandleScroll = debounce(this.handleScroll, 50, false, this)
      this.proxySetBodyHeight = debounce(this.setBodyHeight, 50, false, this)
      this.isAuto && this.loadData()
    },
    mounted() {
      this.loadingContainer = this.$refs.body.parentNode
      this.setBodyHeight()
      addResizeListener(this.$refs.body, this.proxySetBodyHeight)
      on(this.$refs.body, 'scroll', this.proxyHandleScroll)
    },
    beforeDestroy() {
      removeResizeListener(this.$refs.body, this.proxySetBodyHeight)
      off(this.$refs.body, 'scroll', this.proxyHandleScroll)
    }
  }
</script>
