<script>
  /**
   * 虚拟滚动列表
   * @module widgets/xdh-virtual-scroller
   */

  import {RecycleScroller, DynamicScroller, DynamicScrollerItem} from 'vue-virtual-scroller'
  import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
  /**
   * 注意：
   * 1、你必须要设置虚拟滚动容器和内容项的尺寸。除非使用variable height mode，否则为了防止战事问题，所有内容项都应该设置一样的高度。
   * 2、不建议在内部使用函数式组件
   */

  /**
   * 插槽
   * @member slots
   * @property {string} default 要显示的每一项内容及排版，参数：item显示的内容数据，index每项内容对应在数组的索引值，active当前视图是否显示。
   * @property {string} before-container 滚动容器的头部内容区
   * @property {string} after-container 滚动容器的头部内容区
   */

  export default {
    name: 'XdhVirtualScroller',
    /**
     * Scroller属性参数
     * @property {Array} items 必填项。要展示的内容数组
     * @property {Number} [itemSize=null] 以像素为单位的内容项，用于计算滚动高度和位置。当为null的时候，会使用可变高度模式（Variable height mode）。
     * @property {Number|String} [minItemSize=null] 如果内容项的高度未知，则使用最小高度。当mode为dynamic时，该字段为必填。
     * @property {Boolean} [pageMode=false] 启用页面滚动模式，否的时候使用内部滚动模式
     * @property {Number} [buffer=200] 添加到滚动可见区域边缘的总像素，以开始更远地渲染项目。
     * @property {Number} [prerender=0] 为服务端渲染固定数量的内容项
     * @property {Boolean} [emitUpdate=false] 每次更新虚拟滚动内容时，是否传入'update'事件。可能会影响性能。
     * @property {String} [sizeField='height'] 在Variable height mode下，获取内容项的高度的配置字段。官网建议最好为'height'
     * @property {String} [typeField='type'] 用于区分整个列表中不同类型的组件的配置字段。对每一个不同的类型，将会创建一个循环池。
     * @property {String} [keyField='id'] 用于每个表单项的标识的配置字段，同时优化渲染视图管理。
     *
     * @property {String} [mode='recycle'] 区分滚动列表是固定高度（recycle）还是动态高度（dynamic）
     * @property {String} [scrollerHeight] 滚动容器的高度，当pageMode为false时，必须设置该值
     */
    props: {
      ...RecycleScroller.props,
      mode: {
        type: String,
        validator(val) {
          return ['recycle', 'dynamic'].includes(val)
        },
        default: 'recycle'
      },
      scrollerHeight: {
        type: String
      }
    },
    computed: {
      scrollerProps() {
        const props = {...this.$props}
        // 官网要求dynamic滚动时，minItemSize是必填项
        if (props.mode === 'dynamic' && !props.minItemSize) {
          console.warn('minItemSize is required')
          return false
        }

        if (!props.pageMode && !props.scrollerHeight) {
          console.warn('scrollerHeight is required')
          return false
        }

        delete props.mode
        delete props.scrollerHeight
        return props
      }
    },
    data() {
      return {}
    },
    render(h) {
      return h(
        this.mode === 'recycle' ? RecycleScroller : DynamicScroller,
        {
          style: !this.pageMode ? {height: this.scrollerHeight} : null,
          props: this.scrollerProps,
          on: this.$listeners,
          scopedSlots: {
            default: props => {
              return this.mode === 'dynamic'
                ? h(DynamicScrollerItem,
                  {props: {...props}},
                  this.$scopedSlots.default(props))
                : this.$scopedSlots.default(props)
            }
          }
        },
        [
          h('template', {slot: 'before'}, this.$slots['before']),
          h('template', {slot: 'after'}, this.$slots['after'])
        ]
      )
    }
  }
</script>

