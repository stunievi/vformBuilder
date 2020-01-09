<template>
  <div ref="container"
       class="xdh-grid__container"
       :class="classes">
    <div class="xdh-grid__item"
         v-for="(item,index) in grids"
         :data-id="index"
         :key="index"
         :style="styles(item)">
      <slot :index="index" :item="item" :props="props">{{index}}</slot>
    </div>
  </div>

</template>

<script>
  /**
   * grid组件
   * @module widgets/xdh-grid
   */
  import Sortable from '../xdh-tabs/sortable'

  export default {
    name: 'XdhGrid',
    /**
     * 属性参数
     * @property {Boolean | Object} [sortable = false] sortable sort控件实例的配置项 https://segmentfault.com/a/1190000008209715
     * @property {Array} [data] data 传入的列表数据，不能双向绑定，list 和 value 只能设置一个x
     * @property {Object} [props = {...}] props grid组件的子元素flex样式属性配置项
     * @property {String} [props.order] order 对应flex子元素样式属性，定义item在容器中的排列顺序，数值越小，排列越靠前， 默认值0
     * @property {String} [props.basis] basis 对应flex子元素样式属性，定义在分配多余空间之前，item占据的主轴空间，浏览器器根据这个属性，计算主轴是否有多余空间
     * @property {String} [props.grow] grow 对应flex子元素样式属性，定义item的放大比例，分配剩余空间比例
     * @property {String} [props.shrink] shrink 对应flex子元素样式属性 ，定义item的缩小比例，空间不足时，压缩比例
     * @property {String} [props.align] align 对应flex子元素样式属性，允许单个item有与其他item不一样的对齐方式， 设置值与align-items 一样
     * @property {String} [direction] direction 同flex父组件样式属性, 只接受'row', 'row-reverse', 'column', 'column-reverse'
     * @property {String} [wrap] wrap 同flex父组件样式属性, 只接受'nowrap', 'wrap', 'wrap-reverse'
     * @property {String} [justify] justify 同flex父组件样式属性, 只接受'flex-start', 'flex-end', 'center', 'space-between', 'space-around'
     * @property {String} [alignItems] alignItems 同flex父组件样式属性, 只接受'flex-start', 'flex-end', 'center', 'baseline', 'stretch'
     * @property {String} [alignContent] direction 同flex父组件样式属性, 只接受'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch'
     */
    props: {
      // sortablejs 实例化参数选项
      sortable: {
        type: [Boolean, Object],
        default: false
      },
      // 列表数据
      data: {
        type: Array
      },
      // 列表项目数据字段映射
      props: {
        type: Object,
        default() {
          return {
            // 定义item在容器中的排列顺序，数值越小，排列越靠前， 默认值0
            order: 'order',

            // 定义在分配多余空间之前，item占据的主轴空间，浏览器器根据这个属性，计算主轴是否有多余空间
            basis: 'basis',

            // 定义item的放大比例, 分配剩余空间比例
            grow: 'grow',

            // 定义item的缩小比例，空间不足时，压缩比例
            shrink: 'shrink',

            //  允许单个item有与其他item不一样的对齐方式， 设置值与align-items 一样
            align: 'align'
          }
        }
      },
      // 决定主轴得分方向，即item的排列方向
      direction: {
        type: String,
        validator(value) {
          return ['row', 'row-reverse', 'column', 'column-reverse'].includes(value)
        }
      },
      // 确定容器内item是否可换行
      wrap: {
        type: String,
        validator(value) {
          return ['nowrap', 'wrap', 'wrap-reverse'].includes(value)
        }
      },
      // 定义item在主轴的对齐方式
      justify: {
        type: String,
        validator(value) {
          return ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'].includes(value)
        }
      },
      // 定义item在交叉轴上的对其方式
      alignItems: {
        type: String,
        validator(value) {
          return ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'].includes(value)
        }
      },
      // 定义多根轴线的对齐方式，如果items只有一根轴线，该设置将不起作用
      alignContent: {
        type: String,
        validator(value) {
          return ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch'].includes(value)
        }
      }
    },
    data() {
      return {
        container: null,
        sortInstance: null,
        grids: []
      }
    },
    watch: {
      data: {
        deep: true,
        immediate: true,
        handler(val) {
          this.grids = val || []
        }
      },
      sortable(val) {
        if (this.sortInstance) {
          const options = val ? Object.assign({
            sort: true
          }, val) : {}
          this.setSortable(options)
        }
      }
    },
    computed: {
      // 根据props 中传入的与 flex布局样式有关的属性 定义 组件使用的样式类
      classes() {
        return {
          [`xdh-grid--direction-${this.direction}`]: !!this.direction,
          [`xdh-grid--wrap-${this.wrap}`]: !!this.wrap,
          [`xdh-grid--justify-${this.justify}`]: !!this.justify,
          [`xdh-grid--align-items-${this.alignItems}`]: !!this.alignItems,
          [`xdh-grid--align-content-${this.alignContent}`]: !!this.alignContent,
          'xdh-grid--sortable': !!this.sortOptions
        }
      }
    },
    methods: {
      // 根据 props.prop属性(obj)的配置项，来定义grid内部子元素的flex属性相关样式
      styles(item) {
        /**
         * grid子元素flex样式设置函数, list遍历生成子元素时根据属性"props"配置项生成子节点的flex样式属性
         * @param {object} item
         */
        let style = {}
        if (item[this.props.order]) {
          style.order = item[this.props.order]
        }
        if (item[this.props.basis]) {
          style['flex-basis'] = item[this.props.basis]
        }
        if (item[this.props.grow]) {
          style['flex-grow'] = item[this.props.grow]
        }
        if (item[this.props.shrink]) {
          style['flex-shrink'] = item[this.props.shrink]
        }
        if (item[this.props.align]) {
          style['align-self'] = item[this.props.align]
        }
        return style
      },
      _initSortable() {
        if (!this.sortable) return

        const options = this.sortable ? Object.assign({
          sort: true,
          fallbackClass: 'xdh-tabs__clone'
        }, this.sortable) : {}
        this.sortInstance = new Sortable({
          vm: this,
          container: this.container,
          data: this.grids,
          config: {
            animation: 150,
            // 利用el-tabs生成的tab 属性id来进行标示和排序
            dataIdAttr: 'data-id',
            filter: '.is-disabled'
          },
          options: options,
          reset: function (n, index) {
            return index.toString()
          },
          change: this._handleChange
        })
      },
      _handleChange(data, type, args) {
        this.grids = data
        this.$emit('update:data', data)
        /**
         * 数据发生改变时触发，如：排序、新增、删除
         * @event on-change
         * @param {Array} data 数据数组
         * @param {string} type 改变类型： sort / add /remove
         * @param {Array} args type 对应的参数 sort:[oldIndex, newIndex],add:[fromData, element, oldIndex, newIndex], remove:[element, oldIndex]
         */
        this.$emit('on-change', data, type, args)
      },
      setSortable(options) {
        this.sortInstance && this.sortInstance.setOption(options)
      }
    },
    mounted() {
      this.container = this.$refs.container
      this._initSortable()
    },
    beforeDestroy() {
      this.sortInstance && this.sortInstance.destroy()
    }
  }
</script>
