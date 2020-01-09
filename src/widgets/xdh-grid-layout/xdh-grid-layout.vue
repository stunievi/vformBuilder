<template>
  <grid-layout class="xdh-grid-layout" v-bind="layoutOptions" v-on="$listeners">
    <grid-item v-for="(item, index) in layout"
               :key="item.i"
               v-bind="item"
               v-on="itemEvents">
      <slot v-if="!$slots[item.i]" :item="item" :index="index"></slot>
      <slot :name="item.i"></slot>
    </grid-item>
  </grid-layout>
</template>

<script>
  /**
   * GridLayout 网格布局
   * @module widgets/xdh-grid-layout
   */

  import {GridItem, GridLayout} from 'vue-grid-layout'
  import {addResizeListener, removeResizeListener} from 'element-ui/lib/utils/resize-event'
  import {debounce} from '@/utils/util'

  /**
   * scopedSlots 作用域插槽
   * @member scopedSlots
   * @property {string} default 定义各网格内容，参数：item 网格配置， index 网格在layout 索引
   */

  /**
   * slots 插槽, 以layout数组各项的 i 名称定义指定网格内容
   * @member slot
   */

  /**
   * 布局更新时触发
   * @event layout-updated
   * @param {Array} newLayout 更新后的布局数组
   */

  export default {
    name: 'XdhGridLayout',
    components: {
      GridLayout,
      GridItem
    },
    /**
     * 属性参数
     * @member props
     * @property {Array} layout 初始化布局网格数组，数据项必须要包含 i,x,y,w,h
     * @property {String} layout.i 网格标识名称，要唯一
     * @property {number} layout.x 网格水平方向位置，Says what is a initial horizontal position of the item (in which column it should be placed).
     * @property {number} layout.y Says what is a initial vertical position of the item (in which row it should be placed).
     * @property {number} layout.w Says what is a initial width of the item.
     * @property {number} layout.h Says what is a initial height of the item.
     * @property {number} [layout.minW] Says what is a minimal width of the item. If w will be smaller then minW then w will be set to minW.
     * @property {number} [layout.minH] Says what is a minimal hieght of the item. If h will be smaller then minH then h will be set to minH.
     * @property {number} [layout.maxW]
     * @property {number} [layout.maxH]
     * @property {Boolean} [layout.isDraggable]
     * @property {Boolean} [layout.isResizable]
     * @property {String} [layout.dragIgnoreFrom]
     * @property {String} [layout.dragAllowFrom]
     * @property {String} [layout.resizeIgnoreFrom]
     * @property {number} [colNum=12] 网格列数
     * @property {Number} [rowHeight=150] 行高度
     * @property {Boolean} [fitRow=false] 根据容器高度自动计算行高, 如设置该值，rowHeight将失效
     * @property {Number} [maxRows] 最大行数
     * @property {Array} [margin=[10, 10]] 网格边距
     * @property {Boolean} [isDraggable=false] 能否拖拽
     * @property {Boolean} [isResizable=false] 能否改尺寸
     * @property {Boolean} [isMirrored=false] RTL/LTR should be reversed
     *
     */
    props: {
      // 初始化布局网格数组，数据项必须要包含 i,x,y,w,h,minW,minH,maxW,maxH,isDraggable,isResizable,
      // dragIgnoreFrom,dragAllowFrom,resizeIgnoreFrom
      layout: {
        type: Array,
        default() {
          return []
        }
      },
      // 总列数
      colNum: {
        type: Number,
        default: 12
      },
      // 行高度
      rowHeight: {
        type: Number,
        default: 150
      },
      // 最大行数
      maxRows: {
        type: Number
      },
      // 高度自动适应, 如设置该值，rowHeight将失效
      fitRow: {
        type: Boolean,
        default: false
      },
      // 网格边距
      margin: {
        type: Array,
        default() {
          return [10, 10]
        }
      },
      // 能否拖拽
      isDraggable: {
        type: Boolean,
        default: false
      },
      // 能否改尺寸
      isResizable: {
        type: Boolean,
        default: false
      },
      //  RTL/LTR should be reversed
      isMirrored: {
        type: Boolean,
        default: false
      },
      //  Says if the container height should swells and contracts to fit contents.
      autoSize: {
        type: Boolean,
        default: true
      },
      // Says if the layout should be compact vertically.
      verticalCompact: {
        type: Boolean,
        default: true
      },
      // Says if the CSS transition-property: transform; should be used.
      useCssTransforms: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        wrapperHeight: 'auto',
        fitRowHeight: this.rowHeight,
        itemEvents: {
          resize: (i, newH, newW, newHPx, newWPx) => {
            this.$emit('resize', i, newH, newW, newHPx, newWPx)
          },
          resized: (i, newH, newW, newHPx, newWPx) => {
            this.$emit('resized', i, newH, newW, newHPx, newWPx)
          },
          move: (i, newX, newY) => {
            this.$emit('move', i, newX, newY)
          },
          moved: (i, newX, newY) => {
            this.$emit('moved', i, newX, newY)
          }
        }
      }
    },
    computed: {
      layoutOptions() {
        const options = {...this.$props}
        options.rowHeight = this.fitRowHeight
        delete options.fitRow
        return options
      },
      rows() {
        return this.layout.map(n => n.y + n.h).sort((a, b) => b - a)[0]
      }
    },
    methods: {
      setRowHeight() {
        this.wrapperHeight = this.$el.parentNode.getBoundingClientRect().height
        this.fitRowHeight = (this.wrapperHeight - this.margin[1] * (this.rows + 1)) / this.rows
      }
    },
    mounted() {
      if (this.fitRow && this.rows && this.$el.parentNode) {
        this.proxySetRowHeight = debounce(this.setRowHeight, 100, true, this)
        addResizeListener(this.$el.parentNode, this.proxySetRowHeight)
      }
    },
    beforeDestroy() {
      if (this.$el.parentNode && this.proxySetRowHeight) {
        removeResizeListener(this.$el.parentNode, this.proxySetRowHeight)
      }
    }
  }
</script>
