<template>
  <el-tabs class="xdh-tabs"
           ref="tabs"
           v-model="tabIndex"
           v-bind="{type, closable, addable,editable, tabPosition}"
           @tab-click="_handleTabClick"
           @tab-remove="_handleTabRemove"
           @tab-add="_handleTabAdd"
           @edit="_handleEdit">
    <el-tab-pane v-for="(item, index) in tabs"
                 :key="index"
                 :label="item.label"
                 :disabled="item.disabled"
                 :name="index.toString()"
                 :closable="item.closable">
      <template slot="label" v-if="$scopedSlots.label">
        <slot name="label" :item="item" :index="index">{{item.label}}</slot>
      </template>
      <keep-alive>
        <component v-if="item.keepAlive && item.component && parseInt(tabIndex) === index"
                   :is="item.component"
                   v-bind="item.props"></component>
      </keep-alive>
      <component v-if="!item.keepAlive && item.component && parseInt(tabIndex) === index"
                 :is="item.component"
                 v-bind="item.props"></component>
      <slot v-if="item.name" :name="item.name">
        <div v-if="item.content" v-html="item.content"></div>
      </slot>
      <slot v-else name="content" :item="item" :index="index">
        <div v-if="item.content" v-html="item.content"></div>
      </slot>

    </el-tab-pane>
    <tabs-tool>
      <slot name="tools"></slot>
    </tabs-tool>
  </el-tabs>
</template>

<script>
  /**
   * 选项卡组件, 支持拖拽排序、新增、删除、异步加载组件, 兼容el-tabs组件
   * @module widgets/xdh-tabs
   */
  import TabsTool from './tabs-tool'
  import Sortable from './sortable'

  /**
   * slots
   * @member slots
   * @property {string} tools 定义工具区
   */

  /**
   * scopeSlots
   * @member scopeSlots
   * @property {string} label 自定义选项卡标题内容, 参数：item 当前选项卡数据，index 数据所在数组索引
   * @property {string} content 自定义内容插槽
   */

  export default {
    components: {
      TabsTool
    },
    name: 'XdhTabs',
    /**
     * 参数属性
     * @member props
     * @property {Array} data 选项卡数据，支持sync修饰符，数据项对象：{label, disabled, closable, component, props, keepAlive, content}
     * @property {string} data.label 选项卡标题
     * @property {Boolean} [data.disable=false] 是否禁用选项卡，禁用后不能删除、点击和拖拽
     * @property {Boolean} [data.closable=false] 是否显示关闭按钮
     * @property {VueComponent|String} [data.component] 选项卡加载的组件，支持异步组件
     * @property {Object} [data.props] 组件实例化参数对象
     * @property {Boolean} [data.keepAlive=false] 是否对组件进行缓存，在加载组件较大是，为提供性能建议加缓存
     * @property {String} [data.content] 选项卡显示内容
     * @property {String} [data.name] 选项卡内容插槽名称
     * @property {string} [type] 风格类型 card / border-card
     * @property {Number} [value] 绑定值，选中选项卡的索引, 默认是 0
     * @property {Object|Boolean} [sortable=false] Sortable实例化参数选项
     * @property {Boolean} [sortable.sort] sorting inside list
     * @property {String|Object} [sortable.group] name or { name: "...", pull: [true, false, clone], put: [true, false, array] }
     */
    props: {
      data: {
        type: Array
      },
      type: {
        type: String
      },
      value: {
        type: Number,
        default: 0
      },
      closable: {
        type: Boolean
      },
      addable: {
        type: Boolean
      },
      editable: {
        type: Boolean
      },
      tabPosition: {
        type: String
      },
      sortable: {
        type: [Object, Boolean],
        default: false
      }
    },
    data() {
      return {
        /**
         * Sortable实例
         * @member sortInstance
         * @type {Object}
         */
        sortInstance: null,
        /**
         * 选项卡导航容器
         * @member nav
         */
        nav: null,
        /**
         * 选项卡数据数组
         * @member tabs
         * @type {Array}
         */
        tabs: [],
        /**
         * 当前活动的选项卡索引, 对应el-tabs的value
         * @member tabIndex
         * @type {String}
         */
        tabIndex: String(this.value)
      }
    },
    watch: {
      data: {
        deep: true,
        immediate: true,
        handler(val) {
          this.tabs = val || []
        }
      },
      value(val) {
        this.tabIndex = String(val)
      },
      tabIndex(val) {
        this.$emit('input', parseInt(val))
      },
      sortable(val) {
        if (this.sortInstance) {
          const options = val ? Object.assign({
            sort: true,
            fallbackClass: 'xdh-tabs__clone'
          }, val) : {}
          this.setSortable(options)
        }
      }
    },
    methods: {
      _initSortable() {
        if (!this.sortable) return

        const options = this.sortable ? Object.assign({
          sort: true,
          fallbackClass: 'xdh-tabs__clone'
        }, this.sortable) : {}
        this.sortInstance = new Sortable({
          vm: this,
          container: this.nav,
          data: this.tabs,
          config: {
            animation: 150,
            // 利用el-tabs生成的tab 属性id来进行标示和排序
            dataIdAttr: 'id',
            filter: '.is-disabled',
            forceFallback: true,
            fallbackOnBody: true
          },
          options: options,
          reset: function (n, index) {
            return 'tab-' + index.toString()
          },
          change: this._handleChange
        })
      },
      _handleChange(data, type, args) {
        this.tabs = data
        this.$emit('update:data', data)
        /**
         * 数据发生改变时触发，如：排序、新增、删除
         * @event on-change
         * @param {Array} data 数据数组
         * @param {string} type 改变类型： sort / add /remove
         * @param {Array} args type 对应的参数 sort:[oldIndex, newIndex],add:[fromData, element, oldIndex, newIndex], remove:[element, oldIndex]
         */
        this.$emit('on-change', data, type, args)
        if (type === 'remove') {
          this._setTabIndex()
        } else if (type === 'add') {
          // 把新加入的tab设置为活动状态
          this.tabIndex = String(args[3])
        } else {
          this.tabIndex = String(args[1])
        }
      },
      _setTabIndex() {
        const tabCount = this.tabs.length
        if (tabCount > 0) {
          const tab = this.tabs[parseInt(this.tabIndex)]
          if (!tab) {
            this.tabIndex = String(tabCount - 1)
          }
        } else {
          this.tabIndex = '0'
        }
      },
      _handleTabClick(tab) {
        /**
         * tab 被选中时触发
         * @event tab-click
         * @param {object} tab 被选中的标签 tab 实例
         */
        this.$emit('tab-click', tab)
      },
      _handleTabRemove(name) {
        /**
         * 点击 tab 移除按钮后触发
         * @event tab-remove
         * @param {number} index 被删除的标签的 索引
         */
        this.$emit('tab-remove', parseInt(name))
      },
      _handleTabAdd() {
        /**
         * 点击 tabs 的新增按钮后触发
         * @event tab-add
         */
        this.$emit('tab-add')
      },
      _handleEdit(targetName, action) {
        /**
         * 点击 tabs 的新增按钮或 tab 被关闭后触发
         * @event edit
         * @param {string|null} targetName
         * @param {string} action
         */
        this.$emit('edit', targetName, action)
      },
      /**
       * 更新Sortable属性
       * @function setSortable
       * @param {object} options 需更新的属性对象
       */
      setSortable(options) {
        this.sortInstance && this.sortInstance.setOption(options)
      }
    },
    mounted() {
      this.nav = this.$refs.tabs.$refs.nav.$refs.nav
      this._initSortable()
    },
    beforeDestroy() {
      this.sortInstance && this.sortInstance.destroy()
    }
  }
</script>
