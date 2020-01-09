<template>
  <el-table ref="table"
            class="xdh-table"
            :data="tableData"
            v-on="$listeners"
            v-bind="tableOptions">
    <template v-for="(col, index) in tableColumns">

      <!-- 定义 index、selection 类型的列-->
      <el-table-column v-if="col.type==='index' || col.type==='selection'"
                       v-bind="col"
                       :key="index"
                       class-name="xdh-table--not-drag"></el-table-column>

      <!-- 定义 expand 类型的列-->
      <el-table-column v-else-if="col.type==='expand'"
                       v-bind="col"
                       :key="index"
                       class-name="xdh-table--not-drag">
        <template slot-scope="scope">
          <slot name="expand"
                :row="scope.row"
                :$index="scope.$index"
                :column="tableColumns[index]"
                :columnIndex="index">
          </slot>
        </template>
      </el-table-column>

      <!-- 定义通用类型的列-->
      <el-table-column v-else
                       v-bind="resetCol(col)"
                       :class-name="col.fixed ? 'xdh-table--not-drag':''"
                       :key="index">
        <template slot-scope="scope"
                  v-if="!col.type">
          <slot :name="col.prop || 'default'"
                :row="scope.row"
                :$index="scope.$index"
                :column="tableColumns[index]"
                :columnIndex="index">
            {{scope.row[col.prop]}}
          </slot>
        </template>

      </el-table-column>
    </template>

    <!--暴露 el-table append 插槽-->
    <slot slot="append" name="append"></slot>

    <!--暴露 el-table empty 插槽-->
    <slot slot="empty" name="empty"></slot>

  </el-table>
</template>

<script>
  import ElTable from 'element-ui/lib/table'
  import Sortable from 'sortablejs'
  import {debounce} from '@/utils/util'
  import {insertAfter} from '@/utils/dom'
  import XdhTableFilter from './xdh-table-filter'
  import bus from '@/utils/bus'

  const noop = function () {
    return Promise.resolve()
  }

  /**
   * XdhTable 表格组件
   * @module widgets/xdh-table
   */
  export default {
    name: 'XdhTable',
    /**
     * 属性参数，完全继承 el-table参数，并有以下扩展参数
     * @property {Array} [data = []] 表格行数据
     * @property {Array} [columns = []]  表格列定义，对象属性参数完全继承 el-table-column
     * @property {Object | Boolean} [columnSortable = false] 是否启用列拖拽排序, 可以配置Sortable个性化参数
     * @property {Object | Boolean} [rowSortable = false] 是否启用行拖拽排序, 可以配置Sortable个性化参数
     * @property {Number} [distanceToButton = 50] 滚动到距离底部多少距离触发 on-reach-bottom 事件， table需要设置高度才有效
     * @property {Function} [openFilter] 处理打开filter事件，必须返回 Promise实例，如需要显示下拉字典时可以用到
     */
    props: {
      ...ElTable.props,
      columns: {
        type: Array,
        default() {
          return []
        }
      },
      columnSortable: {
        type: [Object, Boolean],
        default: false
      },
      rowSortable: {
        type: [Object, Boolean],
        default: false
      },
      distanceToButton: {
        type: Number,
        default: 50
      },
      openFilter: {
        type: Function,
        default: noop
      }
    },
    data() {
      return {
        // 表格列定义数组
        tableColumns: this.columns,

        // 表格行数据
        tableData: this.data,

        // 列拖拽Sortable实例
        columnSortableInstance: null,

        // 行拖拽Sortable实例
        rowSortableInstance: null,

        // 上次滚动的位置
        lastScrollTop: 0,

        // 筛选框的实例
        filterVM: {}
      }
    },
    watch: {
      data(val) {
        this.tableData = val
      },
      columns(val) {
        this.tableColumns = val
        const data = this.tableData
        this.tableData = []
        this.$nextTick(() => {
          this.tableData = data
        })
      }
    },
    computed: {
      // el-table 参数
      tableOptions() {
        let options = {...this.$props}
        delete options.columns
        delete options.data
        delete options.columnSortable
        delete options.rowSortable
        delete options.distanceToButton
        delete options.openFilter
        return options
      }
    },
    methods: {
      /**
       * 内部调用排序方法，还原由Sortable拖拽改变的DOM顺序，然后修改数据，再由数据驱动改变DOM
       * @function
       * @private
       * @param {String} type 排序类型，row 或 column
       * @param {HTMLElement} container 容器元素DOM
       * @param {Array} data 数据数组
       * @param {Object} e Sortable事件对象
       */
      sort(type, container, data, e) {
        const tempData = [...data]
        const newIndex = e.newIndex
        const oldIndex = e.oldIndex
        const temp = tempData[oldIndex]
        container.removeChild(e.item)
        const children = container.children
        if (children.length > 0) {
          oldIndex > 0
            ? insertAfter(e.item, children[oldIndex - 1])
            : container.insertBefore(e.item, children[0])
        } else {
          container.appendChild(e.item)
        }

        // 固定类型的列不运行拖拽和放置
        if (type === 'column' && data[newIndex] && data[newIndex].type) {
          return
        }
        tempData.splice(oldIndex, 1)
        tempData.splice(newIndex, 0, temp)

        // 修复ele中重新设置表格配置时要重新描绘表格
        if (type === 'column') {
          this.tableColumns = []
          this.$nextTick(() => {
            this.tableColumns = tempData
          })
        } else {
          this.tableData = []
          this.$nextTick(() => {
            this.tableData = tempData
          })
        }
      },
      /**
       * 实例化列Sortable
       */
      initColumnSortable() {
        const tr = this.$refs.table.$refs.tableHeader.$el.getElementsByTagName('tr')[0]
        if (!tr) return

        const options = Object.assign({
          forceFallback: false,
          animation: 150
        }, this.columnSortable, {
          handle: '.cell',
          filter: '.xdh-table--not-drag',
          onSort: (e) => {
            this.sort('column', tr, this.tableColumns, e)
            /**
             * 列拖拽排序完成时触发
             * @event on-column-sort
             * @param {object} e Sortable事件对象
             * @param {Array} columns 列定义数组
             */
            this.$emit('on-column-sort', e, this.tableColumns)
          }
        })

        this.columnSortableInstance = new Sortable(tr, options)
      },
      /**
       * 实例化行Sortable
       */
      initRowSortable() {
        const tbody = this.$refs.table.$refs.bodyWrapper.getElementsByTagName('tbody')[0]
        if (!tbody) return

        const options = Object.assign({
          forceFallback: false,
          animation: 150
        }, this.rowSortable, {
          onSort: (e) => {
            this.sort('row', tbody, this.tableData, e)
            /**
             * 行拖拽排序完成时触发
             * @event on-row-sort
             * @param {object} e Sortable事件对象
             * @param {Array} data 行数据
             */
            this.$emit('on-row-sort', e, this.tableData)
          }
        })

        this.rowSortableInstance = new Sortable(tbody, options)
      },
      handleScroll(e) {
        const target = e.target
        const dir = target.scrollTop - this.lastScrollTop > 0 ? 'down' : 'up'
        this.lastScrollTop = target.scrollTop
        const scrollDistance = target.scrollHeight - target.scrollTop - target.clientHeight
        if (dir === 'down' && scrollDistance <= this.distanceToButton) {
          /**
           * 表格滚动到底部时触发
           * @event on-reach-bottom
           * @param {Number} scrollDistance 离底部的距离
           */
          this.$emit('on-reach-bottom', scrollDistance)
        }

        if (dir === 'up' && target.scrollTop <= this.distanceToButton) {
          /**
           * 表格滚动到顶部时触发
           * @event on-reach-top
           * @param {Number} scrollTop 离顶部的距离
           */
          this.$emit('on-reach-top', target.scrollTop)
        }

        /**
         * 表格滚动时触发
         * @event on-scroll
         * @param {Object} e 事件对象
         */
        this.$emit('on-scroll', e)
      },
      /**
       * 根据每项是否有filterable来控制是否渲染个性化筛选图标
       */
      resetCol(col) {
        let opt = {...col}
        if (col.filterable) {
          opt.renderHeader = this.renderFilterHeader(col)
        }
        return opt
      },
      /**
       * 渲染列表头部自定义筛选图标
       */
      renderFilterHeader(col) {
        const handler = function (h, {column, $index}) {
          let label, filter = col.prop + '-filter'
          if (col.renderHeader) {
            label = col.renderHeader
          } else {
            label = col.label
          }

          return h('span', {class: 'xdh-table-filter'},
            [
              typeof label === 'function' ? label(h, {
                column: column,
                $index: $index
              }) : h('i', {class: 'xdh-table-filter__label'}, label),

              h(XdhTableFilter, {
                  props: {
                    column: column,
                    index: $index,
                    colProps: col,
                    label,
                    openFilter: this.handleOpenFilter
                  },
                  on: {
                    'on-filter': this.handleFilter
                  }
                },
                this.$scopedSlots[filter] ? this.$scopedSlots[filter](col) : null
              )
            ])
        }
        return handler.bind(this)
      },
      /**
       * 点击筛选框的筛选查询回调
       * @param props
       * @param value
       */
      handleFilter(props, value) {
        /**
         * 点击筛选框的筛选查询触发
         * @event on-filter
         * @param {Object} props 当前列的配置
         * @param {String} value 当前筛选框的值
         */
        this.$emit('on-filter', props, value)
      },
      /**
       * 打开筛选框的回调
       * @param props
       */
      handleOpenFilter(props) {
        return this.openFilter && this.openFilter(props)
      }
    },
    mounted() {
      this.columnSortable && this.initColumnSortable()
      this.rowSortable && this.initRowSortable()
      this.proxyHandleScroll = debounce(this.handleScroll, 20, false, this)
      this.bodyWrapper = this.$refs.table.$refs.bodyWrapper
      this.bodyWrapper.addEventListener('scroll', this.proxyHandleScroll)

      // 点击当前列筛选框，要关闭其他列的筛选框
      bus.$on('on-filter-column', vm => {
        const prop = vm.colProps.prop
        if (!this.filterVM[prop]) {
          this.$set(this.filterVM, prop, vm)
        }
        Object.keys(this.filterVM).forEach(n => {
          if (n !== prop) {
            this.filterVM[n].isShowed = false
          }
        })
      })
    },
    beforeDestroy() {
      this.columnSortableInstance && this.columnSortableInstance.destroy()
      this.rowSortableInstance && this.rowSortableInstance.destroy()
      if (this.bodyWrapper && this.proxyHandleScroll) {
        this.bodyWrapper.removeEventListener('scroll', this.proxyHandleScroll)
      }
    }
  }
</script>

<style lang="scss">
  @import "../../style/vars";

  .xdh-table {
    .sortable-ghost {
      background: $--color-warning-light;
      opacity: 0.3;
    }
    .sortable-ghost.xdh-table--not-drag {
      background: transparent;
    }
    &.el-table th > .cell, &.el-table--border th:first-child .cell {
      padding-left: 0;
      padding-bottom: 0;
      margin: 0 10px;
      width: calc(100% - 20px);
    }
    &-filter {
      &__label {
        font-style: normal;
      }
    }
  }
</style>
