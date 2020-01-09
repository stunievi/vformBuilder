<template>
  <div :class="prefixCls">
    <table-header :columns="columns" :width-array="headerWidthArray"></table-header>
    <el-tree
      class="xdh-tree-table__tree"
      :data="data"
      :empty-text="emptyText"
      :node-key="nodeKey"
      :props="props"
      :render-after-expand="renderAfterExpand"
      :load="load"
      :render-content="renderContent"
      :highlight-current="highlightCurrent"
      :default-expand-all="defaultExpandAll"
      :expand-on-click-node="expandOnClickNode"
      :auto-expand-parent="autoExpandParent"
      :default-expanded-keys="defaultExpandedKeys"
      :show-checkbox="showCheckbox"
      :check-strictly="checkStrictly"
      :default-checked-keys="defaultCheckedKeys"
      :filter-node-method="filterNodeMethod"
      :accordion="accordion"
      :indent="indent"
      ref="tree"></el-tree>

    <div style="display: none;" :class="`${prefixCls}__hidden`">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  /**
   * treeTable表格树组件
   * @module widgets/xdh-tree-table
   * @example
   *
   * <xdh-tree-table :data="data" :show-checkbox="true">
   *    <xdh-tree-table-column prop="name" label="姓名"></xdh-tree-table-column>
   *    <xdh-tree-table-column prop="title" label="标题" width="200px"></xdh-tree-table-column>
   *    <xdh-tree-table-column prop="email" label="邮箱" width="200px"></xdh-tree-table-column>
   * </xdh-tree-table>
   */
  import { Tree } from 'element-ui'
  import TableHeader from './components/table-header.vue'

  const BORDER_WIDTH = 1
  const ARROW_WIDTH = 24
  const CHECKBOX_WIDTH = 22
  const INDENT_DEFAULT = 16
  const EVENTS = ['node-click', 'check-change', 'current-change', 'node-expand', 'node-collapse']
  const treeProps = Object.assign({}, Tree.props)
  delete treeProps.renderContent
  /**
   * 插槽 默认子组件：xdh-tree-table-column
   * @member slot
   * @property {String} [label] tree-table-column的属性，定义column的table-head(表头名)
   * @property {String} [prop] tree-table-column的属性，定义column对应数据的字段名
   * @property {String} [width] 定义tree-table-column的占位宽度（width="200px"）
   */
  export default {
    name: 'XdhTreeTable',
    components: {
      TableHeader
    },
    /**
     * 参数属性 treeTable 属性参照 treeSelect组件
     * @property {Object} [props = {}] 组件的数据展示配置项（指导组件根据data内的数据结构来显示）
     * @property {String | Function(data, node)} [props.label] 指定节点标签（显示的文字）为节点数据对象中的某个属性值
     * @property {String} [props.children] 指定子树节点对象为（当前层）节点数据中的某个属性值
     * @disabled {Boolean | Function(data, node)} [props.disable] 指定用节点对象中某个属性值（输出布尔值）来定义当前节点选择框是否可选
     * @property {Boolean |Function(data, node)} [props.isLeaf] 根据节点对象中的某个属性值来确定当前节点是否叶子节点（不能再往下展开）
     * @property {array} [data] treeSelect的展示数据。 data = [{label: 'A', children:[{label: 'A1'}, {label: 'A2'}]}]
     * @property {Function(node, resolve)} [load] 加载子树数据的方法, 必须与lazy配合使用
     * @property [Boolean] [lazy = false] 子节点是否懒加载，若设为true， 必须结合load使用
     * @property {String} [node-key] 每个树节点用来做唯一标示的属性
     * @property {String} [empty-text] 树状列表区域内容为空时的占位文字
     * @property {Boolean} [render-after-expand = true] 是否为首次点开某个树节点后才渲染其子节点, 默认为true
     * @property {FUnction(h, {node, data, store})} [render-content] 树节点的内容区的渲染 Function(h()) 用于自定义节点
     * @property {Boolean} [highlight-current = false] 默认是否高亮当前选中节点
     * @property {Boolean} [default-expand-all = false] 是否默认展开所有节点
     * @property {Boolean} [expand-on-click-node = true] 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
     * @property {Boolean} [auto-expand-parent = true] 展开子节点的时候是否自动展开父节点
     * @property {Boolean} [showCheckbox = false] 节点是否可被选择
     * @property {Boolean} [check-strictly = false] 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
     * @property {Array} [default-expanded-keys] 默认展开的节点的 key 的数组
     * @property {Array} [default-checked-keys] 默认勾选的节点的 key 的数组
     * @property {Boolean} [accordion = false] 是否使用手风琴模式（每次只有一个同级树节点展开）
     * @propterty {Number} [indent = 16] 子节点缩进距离（默认16px）
     */
    props: {
      ...treeProps
    },
    data () {
      return {
        prefixCls: 'xdh-tree-table',
        columns: []
      }
    },
    computed: {
      tree () {
        return this.$refs.tree
      },
      tableWidth () {
        // 判断是否有checkbox
        if (this.showCheckbox) {
          return `calc(100% - ${CHECKBOX_WIDTH + ARROW_WIDTH}px)`
        } else {
          return `calc(100% - ${ARROW_WIDTH}px)`
        }
      },
      headerWidthArray () {
        // 没有设置宽度的列总数
        const noWidthCount = this.columns.filter(n => !n.width).length
        // 已分配了多少像素宽度
        let assignedWidthPx = 0
        // 已分配了百分比宽度
        let assignedWidthPercent = 0
        // 计算已分配了多少宽度
        this.columns.forEach(n => {
          if (n.width) {
            if (typeof n.width === 'number' || n.width.includes('px')) {
              assignedWidthPx += (Number.parseInt(n.width) + BORDER_WIDTH)
            } else if (n.width.includes('%')) {
              assignedWidthPercent += (Number.parseInt(n.width) + BORDER_WIDTH)
            }
          }
        })
        // 是否有checkbox的偏移值
        let diff = CHECKBOX_WIDTH
        // 有checkbox，加上checkbox占用的宽度
        if (this.showCheckbox) {
          assignedWidthPx += (CHECKBOX_WIDTH + ARROW_WIDTH)
        } else {
          assignedWidthPx += ARROW_WIDTH
          diff = 0
        }
        // 计算每列应该展示的宽度
        return this.columns.map((column, index) => {
          // 有制定宽度
          if (column.width) {
            if (index === 0) {
              // 第一列需要加上箭头和checkbox占用的宽度
              return `calc(${column.width} + ${diff + ARROW_WIDTH}px)`
            } else {
              // 最后一列需要减去每列的边框线宽度
              if (index === this.columns.length - 1) {
                return `calc(${column.width} - ${this.columns.length}px)`
              } else {
                return `calc(${column.width})`
              }
            }
          } else {
            if (index === 0) {
              // 第一列需要加上箭头和checkbox占用的宽度
              return `calc((100% - ${assignedWidthPercent}% - ${(assignedWidthPx)}px) / ${noWidthCount} + ${diff + ARROW_WIDTH}px)`
            } else {
              if (index === this.columns.length - 1) {
                // 最后一列需要减去每列的边框线宽度
                return `calc((100% - ${assignedWidthPercent}% - ${(assignedWidthPx)}px) / ${noWidthCount} - ${this.columns.length}px)`
              } else {
                return `calc((100% - ${assignedWidthPercent}% - ${(assignedWidthPx)}px) / ${noWidthCount})`
              }
            }
          }
        })
      }
    },
    methods: {
      getColumnWidthArray (level) {
        // 没有设置宽度的列总数
        const noWidthCount = this.columns.filter(n => !n.width).length
        // 已分配了多少像素宽度
        let assignedWidthPx = 0
        // 已分配了百分比宽度
        let assignedWidthPercent = 0

        // 当前层级缩进的宽度
        let indent = (level - 1) * (this.indent || INDENT_DEFAULT)

        // 计算已分配了多少宽度
        this.columns.forEach(n => {
          if (n.width) {
            if (typeof n.width === 'number' || n.width.includes('px')) {
              assignedWidthPx += (Number.parseInt(n.width) + BORDER_WIDTH)
            } else if (n.width.includes('%')) {
              assignedWidthPercent += (Number.parseInt(n.width) + BORDER_WIDTH)
            }
          }
        })
        // 计算每列应该展示的宽度
        return this.columns.map((column, index) => {
          // 如果属性指定了宽度
          if (column.width) {
            // 第一列需要减去树层级缩进的宽度
            if (index === 0) {
              return `calc(${column.width} - ${indent}px )`
            } else {
              return column.width
            }
          } else {
            // 如果列没有制定宽度，没宽度的列平均分配剩余的宽度，第一列需要减去树层级缩进的宽度
            if (index === 0) {
              return `calc((100% - ${assignedWidthPercent}% - ${(assignedWidthPx - indent)}px) / ${noWidthCount} -  ${indent}px)`
            } else {
              return `calc((100% - ${assignedWidthPercent}% - ${(assignedWidthPx - indent)}px) / ${noWidthCount})`
            }
          }
        })
      },
      renderContent (h, {node}) {
        let widthArray = this.getColumnWidthArray(node.level)
        const columns = this.columns.map((column, index) => {
          return column.renderCell.call(this._renderProxy, h, {node}, widthArray[index])
        })
        return h('span', {
          'class': `${this.prefixCls}__tr`,
          style: {
            width: this.tableWidth
          }
        }, columns)
      },
      bindEvents () {
        EVENTS.forEach(name => {
          this.tree.$on(name, (data, node, vm) => {
            this.$emit(name, data, node, vm)
          })
        })
      }
    },
    mounted () {
      this.bindEvents()
    },
    beforeDestroy () {
      this.tree.$off(EVENTS)
    }
  }
</script>
