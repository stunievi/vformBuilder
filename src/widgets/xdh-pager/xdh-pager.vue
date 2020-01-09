<template>
  <div class="xdh-pager" v-show="visible">
    <el-pagination
      ref="pager"
      :background="background"
      :small="small"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="sizes"
      :page-size="size"
      :layout="currentLayout"
      :total="total">
      <slot>
        <span>{{page}} / {{pageCount}}</span>
      </slot>
    </el-pagination>
  </div>
</template>


<script>
  /**
   * pager 分页组件
   * @module widgets/xdh-pager
   * @example
   *
   * // 使用说明
   * <xdh-pager :total="100" @size-change="pageSCHandle" @current-change="pageCCHandle"></xdh-pager>
   * <xdh-pager :total="100" :small="true"></xdh-pager>
   */
  /**
   * 插槽
   * @member slot
   * @property {string} [default] 自定义页码内容
   */
  import {addResizeListener, removeResizeListener} from 'element-ui/lib/utils/resize-event'

  const layouts = {
    full: 'total,sizes, ->, prev, pager, next, jumper',
    small: 'total,sizes, ->, prev, next, jumper',
    mini: 'total,sizes, ->, prev, next',
    simple: 'prev, pager, next',
    tiny: 'prev,slot,next'
  }
  export default {
    name: 'XdhPager',
    /**
     * 属性参数
     * @property {Array} [sizes = [10, 20, 50, 100]] 每页显示个数选择器的选项设置
     * @property {String} [layout = 'total,sizes, ->, prev, pager, next, jumper'] 分页组件布局（需要显示那些功能模块），子组件名用逗号分隔，或者用‘full’(默认),'small','mini','simple'来设定分页器功能
     * @property {String} [layout.layout['full']] 分页组件的子组件如下： total:总条数， sizes:每页显示条数选择器， prev:前一页，pager:分页页码， next:后一页， jump:跳至第n页
     * @property {Number} [size = 10] 分页显示的条数， 默认10条
     * @property {Number} [total] 需要进行分页的列表的总条数
     * @property {Number} [page = 1] 组件创建时打开第n页，默认值为1
     * @property {Boolean} [autoLayout = true] 控制分页器 可以自动根据组件当前的长度来显示隐藏部分子组件（如分页器变窄时，可以自动隐藏 'pager'组件）
     * @property {Boolean} [background = true] 控制 分页器的 页码按钮 是否有 背景色
     * @property {Boolean} [small = false] 分页器是否设置小型分页样式（默认否）
     */
    props: {
      sizes: {
        type: Array,
        default() {
          return [10, 20, 50, 100]
        }
      },
      layout: {
        type: String,
        default: layouts.full
      },
      size: {
        type: Number,
        default: 10
      },
      total: {
        type: Number,
        default: 0
      },
      page: {
        type: Number,
        default: 1
      },
      autoLayout: {
        type: Boolean,
        default: true
      },
      background: {
        type: Boolean,
        default: true
      },
      small: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        currentLayout: layouts[this.layout] || this.layout
      }
    },
    computed: {
      visible() {
        return this.total > 0
      },
      pageCount() {
        if (this.total > 0) {
          return Math.ceil(this.total / this.size)
        } else {
          return 0
        }
      }
    },
    watch: {
      layout(val) {
        this.currentLayout = layouts[val] || this.layout
      }
    },
    methods: {
      /**
       * 分页器单页显示数量改变的事件 （@size-change）
       * @event size-change
       * @property {number} [val] 新的单页显示的条数
       */
      handleSizeChange(val) {
        this.$emit('size-change', val)
      },
      /**
       * 分页器控制跳转页码时的事件 （@current-change）
       * @event current-change
       * @property {number} [val] 当前跳转到的页码
       */
      handleCurrentChange(val) {
        this.$emit('update:page', val)
        this.$emit('current-change', val)
      },
      changeLayout(e) {
        const rect = this.$el.getBoundingClientRect()
        if (rect.width >= 800) {
          this.currentLayout = layouts.full
        } else {
          this.currentLayout = layouts.small
        }
      }
    },
    mounted() {
      /**
       * 组件生成后，若‘autoLayout’开启，将 el-pagination组件内部的‘proxyChangeLayout’方法指向自己定义的‘changeLayout()’方法，并监听组建的resize事件（调用ele-ui内部的‘addResizeListener’方法）
       * @member mounted
       */
      if (this.autoLayout) {
        this.proxyChangeLayout = this.changeLayout.bind(this)
        addResizeListener(this.$el, this.proxyChangeLayout)
      }
    },
    beforeDestroy() {
      this.proxyChangeLayout && removeResizeListener(this.$el, this.proxyChangeLayout)
    }
  }
</script>
