<template>
  <xdh-layout :class="curdClasses"
              :fixed="fit"
              :north="{height:'auto'}">

    <xdh-filter-panel v-if="filter"
                      slot="north"
                      :title="filterTitle"
                      :icon="filterIcon"
                      :collapsible="collapsible"
                      :collapsed="collapsed"
                      :filterHeaderHeight="filterHeaderHeight"
                      :filterFooterHeight="filterFooterHeight"
                      :model.sync="filterModel"
                      @on-query="handleQuery"
                      @on-reset="handleReset"
                      @toggle="handleToggle">
      <slot name="filter-tool" slot="tool"></slot>
      <slot name="filter-items"></slot>
      <slot name="filter-items-expand" slot="expand"></slot>
      <slot name="filter-footer" slot="footer"></slot>
    </xdh-filter-panel>
    <xdh-list-panel ref="list"
                    :icon="listIcon"
                    :title="listTitle"
                    :load="fetch"
                    :state="state"
                    :size="pageSize"
                    :class="listPanelClasses"
                    :is-auto="isAuto"
                    :pager="pager"
                    :headerHeight="listHeaderHeight">
      <div slot="tool">
        <el-button v-if="addable" type="primary" size="mini" icon="el-icon-plus" @click="handleOpenAdd">新增</el-button>
        <slot name="table-tool"></slot>
      </div>
      <template slot-scope="scope">
        <el-table :data="scope.list" @selection-change="handleSelection" stripe border :height="scope.height - 20">
          <slot name="table-columns" :state="state">

          </slot>
          <el-table-column v-if="hasHandleColumn" label="操作" :width="handleColumnWidth" :fixed="handleFixedRight">
            <template slot-scope="prop">
              <slot name="table-handle-column" :row="prop.row" :$index="prop.$index"></slot>
              <template v-if="handleType==='icon'">
                <el-tooltip content="编辑" placement="top">
                  <el-button v-if="editable" :disabled="editDisabled(prop.row)" icon="el-icon-edit" size="mini"
                             @click="handleEdit(prop.row, prop.$index)"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button v-if="removable" :disabled="removeDisabled(prop.row)" icon="el-icon-delete" size="mini"
                             type="warning"
                             @click="handleRemove(prop.row, prop.$index)">
                  </el-button>
                </el-tooltip>
              </template>
              <template v-else>
                <el-button v-if="editable" :disabled="editDisabled(prop.row)" size="mini"
                           @click="handleEdit(prop.row, prop.$index)">编辑
                </el-button>
                <el-button v-if="removable" :disabled="removeDisabled(prop.row)" size="mini" type="warning"
                           @click="handleRemove(prop.row, prop.$index)">删除
                </el-button>
              </template>

            </template>
          </el-table-column>
        </el-table>
      </template>
    </xdh-list-panel>
    <xdh-dialog-form ref="dialogForm"
                     :closed.sync="dialogClosed"
                     :model="currentModel"
                     :rules="rules"
                     :mode="dialogMode"
                     :title="dialogTitle"
                     :width="dialogWidth"
                     :max-height="dialogHeight"
                     @open="handleDialogOpen"
                     @close="handleDialogClose"
                     :on-insert="handleInsert"
                     :on-update="handleUpdate"
                     :labelWidth="formLabelWidth"
                     :size="dialogFormSize">
      <template slot-scope="prop" v-if="$scopedSlots['dialog-form-items']">
        <slot name="dialog-form-items" :model="prop.model"
              :rules="prop.rules"></slot>
      </template>
    </xdh-dialog-form>
  </xdh-layout>
</template>

<script>
  import Vue from 'vue'
  import camelCase from 'lodash/camelCase'
  import snakeCase from 'lodash/snakeCase'
  import XdhLayout from '@/widgets/xdh-layout'
  import XdhFilterPanel from '@/widgets/xdh-filter-panel'
  import XdhListPanel from '@/widgets/xdh-list-panel'
  import XdhDialogForm from '@/widgets/xdh-dialog-form'

  const toMethodName = function (type, name) {
    return camelCase(`${type}_${snakeCase(name)}`)
  }
  const toTypeName = function (type, name) {
    return `${type}_${snakeCase(name)}`.toUpperCase()
  }
  const noop = function () {
    return false
  }
  /**
   * 增删改查组件
   * @module widgets/xdh-curd
   */

  /**
   * 插槽
   * @member slots
   * @property {string} filter-tool 查询面板工具区
   * @property {string} filter-items 查询条件表单项，必须是el-form-item组件
   * @property {string} filter-items-expand 查询条件扩展表单项，必须是el-form-item组件
   * @property {string} filter-footer  查询面板底部
   * @property {string} table-tool 列表面板工具区
   * @property {string} table-columns 列表表格列，必须是el-table-column组件，作用域插槽，参数：state 状态数据
   * @property {string} table-handle-column 操作功能列内容，作用域插槽，参数：row 当前列数据，$index 当前列索引
   * @property {string} dialog-form-items 新增、修改表单项目，必须是el-form-item组件，作用域插槽，参数：model 表单项对象
   */
  export default {
    name: 'XdhCurd',
    components: {
      XdhFilterPanel,
      XdhListPanel,
      XdhDialogForm,
      XdhLayout
    },
    /**
     * 属性参数
     * @member
     * @property {boolean} [filter=true] 是否显示查询条件面板
     * @property {string} [filterTitle=查询条件] 查询面板标题文字
     * @property {string} [filterIcon] 查询面板标题文字前的icon
     * @property {boolean} [collapsible=false] 能否折叠
     * @property {boolean} [collapsed=true] 是否折叠, collapsible为true时有效
     * @property {string} [filterHeaderHeight=40px] 查询面板头部标题栏目的高度
     * @property {string} [filterFooterHeight=40px] 查询面板底部的高度
     * @property {string} [listHeaderHeight=40px] 列表标题栏目的高度
     * @property {object} [query] 查询参数对象,支持sync修饰符
     * @property {string} [name] 实体对象名称, 需与代码生成器配合
     * @property {Object} [mixin]  mixin对象，如果设置了mixin，启用mixin模式，否则启用store模式
     * @property {Object} [rules] 新增、修改表单验证规则
     * @property {Object} [model] 新增或修改实体的字段对象
     * @property {String} [modelKey] 实体的主键字段名称
     * @property {boolean} [addable=true] 显示增加按钮
     * @property {boolean} [editable=true] 显示编辑按钮
     * @property {boolean} [removable=true] 显示删除按钮
     * @property {number} [handleColumnWidth=150] 操作列的宽度
     * @property {string} [handleType=button] 操作按钮类型, button / icon
     * @property {boolean} [handleFixed=true] 操作列表是否固定在右侧
     * @property {string} [listTitle=列表] 列表标题文字
     * @property {string} [listIcon=el-icon-tickets] 列表标题图标
     * @property {number} [pageSize=10] 分页页大小
     * @property {string} [dialogWidth=500px] 对话框宽度
     * @property {string} [dialogFormSize] 对话框的表单项尺寸 medium / small / mini
     * @property {string} [formLabelWidth=80px] 对话框宽度
     * @property {boolean} [fit=true] 是否充满父容器
     * @property {boolean} [isAuto=true] 是否在初始化时自动加载数据
     * @property {Function} [editDisabled] 设置编辑按钮的Disabled回调函数。传入参数：row 当前行数据
     * @property {Function} [removeDisabled] 设置删除按钮的Disabled回调函数。传入参数：row 当前行数据
     * @property {Function} [insertHandler] 处理新增事件，必须返回 Promise实例，需要特殊处理新增才需要用到
     * @property {Function} [updateHandler] 处理修改事件，必须返回 Promise实例，需要特殊处理修改才需要用到
     * @property {Boolean} [pager=true] 是否显示分页
     * @property {Object} [keyMap] 分页字段名称映射
     */
    props: {
      // 是否显示查询条件面板
      filter: {
        type: Boolean,
        default: true
      },
      // 查询面板标题文字
      filterTitle: {
        type: String,
        default: '查询条件'
      },
      // 查询面板标题文字前的icon
      filterIcon: {
        type: String
      },
      // 能否折叠
      collapsible: {
        type: Boolean,
        default: false
      },
      // 是否折叠
      collapsed: {
        type: Boolean,
        default: true
      },
      // 头部标题栏目的高度
      filterHeaderHeight: {
        type: String,
        default: '40px'
      },
      // 底部的高度
      filterFooterHeight: {
        type: String,
        default: '40px'
      },
      // 列表标题栏目的高度
      listHeaderHeight: {
        type: String,
        default: '40px'
      },
      // 查询参数对象
      query: {
        type: Object,
        default() {
          return {}
        }
      },
      // 实体对象名称
      name: {
        type: String,
        required: true
      },
      // mixin对象，如果设置了mixin，启用mixin模式，否则启用store模式
      mixin: {
        type: Object
      },
      // 表单验证规则
      rules: {
        type: Object
      },
      // 新增或修改实体的字段集合
      model: {
        type: Object,
        default() {
          return {}
        }
      },
      // 实体的主键字段名称
      modelKey: {
        type: String,
        default: 'id'
      },
      // 显示增加按钮
      addable: {
        type: Boolean,
        default: true
      },
      // 显示编辑按钮
      editable: {
        type: Boolean,
        default: true
      },
      // 显示删除按钮
      removable: {
        type: Boolean,
        default: true
      },
      // 操作列的宽度
      handleColumnWidth: {
        type: Number,
        default: 150
      },
      // 操作按钮类型，button 或 icon
      handleType: {
        type: String,
        validator(val) {
          return ['button', 'icon'].includes(val)
        },
        default: 'button'
      },
      // 操作列表是否固定在右侧
      handleFixed: {
        type: Boolean,
        default: true
      },
      // 列表标题文字
      listTitle: {
        type: String,
        default: '列表'
      },
      // 列表标题文字前的icon
      listIcon: {
        type: String,
        default: 'el-icon-tickets'
      },
      // 分页页大小
      pageSize: {
        type: Number,
        default: 10
      },
      // 对话框宽度
      dialogWidth: {
        type: String,
        default: '500px'
      },
      // 对话框最大高度
      dialogHeight: {
        type: String,
        default: '550px'
      },
      // 对话框的表单项尺寸：medium / small / mini
      dialogFormSize: {
        type: String,
        default: ''
      },
      // 表单字段名称的宽度
      formLabelWidth: {
        type: String,
        default: '80px'
      },
      // 是否充满父容器
      fit: {
        type: Boolean,
        default: true
      },
      // 是否在初始化时自动加载数据
      isAuto: {
        type: Boolean,
        default: true
      },
      editDisabled: {
        type: Function,
        default: noop
      },
      removeDisabled: {
        type: Function,
        default: noop
      },
      insertHandler: {
        type: Function
      },
      updateHandler: {
        type: Function
      },
      pager: {
        type: Boolean,
        default: true
      },
      keyMap: {
        type: Object,
        default() {
          return {
            page: 'page',
            limit: 'limit'
          }
        }
      }
    },
    data() {
      return {
        filterModel: {...this.query},
        vm: null,
        dialogClosed: true,
        dialogMode: 'insert',
        editIndex: null,
        selection: [],
        currentModel: {...this.model},
        tableHeight: this.fit ? 100 : undefined
      }
    },
    computed: {
      fetchName() {
        return this.mixin ? toMethodName('fetch', this.name) : toTypeName('fetch', this.name)
      },
      addName() {
        return this.mixin ? toMethodName('add', this.name) : toTypeName('add', this.name)
      },
      updateName() {
        return this.mixin ? toMethodName('update', this.name) : toTypeName('update', this.name)
      },
      removeName() {
        return this.mixin ? toMethodName('remove', this.name) : toTypeName('remove', this.name)
      },
      state() {
        if (this.vm) {
          return this.vm[this.name]
        } else {
          return this.$store.state[this.name]
        }
      },
      dialogTitle() {
        return this.dialogMode === 'insert' ? '新增' : '编辑'
      },
      hasHandleColumn() {
        return this.editable || this.removable || this.$scopedSlots['table-handle-column']
      },
      curdClasses() {
        return {
          'xdh-curd': true,
          'xdh-curd--fit': this.fit
        }
      },
      listPanelClasses() {
        return {
          'xdh-list-panel--fit': this.fit
        }
      },
      listBody() {
        return this.$refs.list.$refs.body.parentNode
      },
      handleFixedRight() {
        return this.handleFixed ? 'right' : null
      }
    },
    watch: {
      query: {
        deep: true,
        handler(val) {
          this.filterModel = {...val}
        }
      }
    },
    methods: {
      handleToggle() {
        /**
         * 查询条件发生变化时触发
         * @event update:query
         * @param {object} model 查询条件对象
         */
        this.$emit('update:query', this.filterModel)
      },
      handleReset(val) {
        this.$emit('update:query', val)
      },
      handleDialogOpen(mode) {
        /**
         * 对话框打开时触发
         * @event on-dialog-open
         * @param {string} mode 表单模式 insert / update
         * @param {object} model 当前模型数据
         */
        this.$emit('on-dialog-open', mode, this.currentModel)
      },
      handleDialogClose(mode) {
        /**
         * 对话框关闭时触发
         * @event on-dialog-close
         * @param {string} mode 表单模式 insert / update
         */
        this.$emit('on-dialog-close', mode)
      },
      setDialogModel(model) {
        this.currentModel = {...model}
      },
      /**
       * 获取列表数据
       * @function fetch
       * @param {number} [page=1] 页码
       * @param {number} [size=10] 每页几条数据
       * @returns {Promise}
       */
      fetch(page = 1, size = 10) {
        if (!this.name) {
          return Promise.reject(new Error('name is required'))
        }
        this.selection = []
        if (this.vm) {
          return this.vm[this.fetchName]({
            [this.keyMap.limit]: size,
            [this.keyMap.page]: page,
            ...this.filterModel
          }).then(res => {
            /**
             * 请求成功时触发，包括增删改查
             * @event on-success
             * @param {string} type 请求类型 fetch/add/update/remove
             * @param {object} res 响应数据
             */
            this.$emit('on-success', 'fetch', res)
            return res;
          }).catch(err => {
            /**
             * 请求失败时触发，包括增删改查
             * @event on-success
             * @param {string} type 请求类型 fetch/add/update/remove
             * @param {object} err 错误信息
             */
            this.$emit('on-error', 'fetch', err)
            return Promise.reject(err)
          })
        } else {
          return this.$store.dispatch(this.fetchName, {
            data: {
              [this.keyMap.limit]: size,
              [this.keyMap.page]: page,
              ...this.filterModel
            }
          }).then(res => {
            this.$emit('on-success', 'fetch', res)
            return res;
          }).catch(err => {
            this.$emit('on-error', 'fetch', err)
            return Promise.reject(err)
          })
        }
      },
      /**
       * 添加实体
       * @function add
       * @param {object} model 实体对象
       * @returns {Promise}
       */
      add(model) {
        if (this.vm) {
          return this.vm[this.addName](model, 0)
            .then(res => {
              this.$emit('on-success', 'add', Object.assign({}, model, res), 0)
              return res;
            }).catch(err => {
              this.$emit('on-error', 'add', err)
              return Promise.reject(err)
            })
        } else {
          return this.$store.dispatch(this.addName, {
            data: model,
            index: 0
          }).then(res => {
            this.$emit('on-success', 'add', Object.assign({}, model, res), 0)
            return res;
          }).catch(err => {
            this.$emit('on-error', 'add', err)
            return Promise.reject(err)
          })
        }
      },
      /**
       * 更新实体
       * @function update
       * @param {object} model 实体对象
       * @returns {Promise}
       */
      update(model) {
        if (this.vm) {
          return this.vm[this.updateName](model, this.editIndex)
            .then(res => {
              this.$emit('on-success', 'update', Object.assign({}, model, res), this.editIndex)
              return res;
            }).catch(err => {
              this.$emit('on-error', 'update', err)
              return Promise.reject(err)
            })
        } else {
          return this.$store.dispatch(this.updateName, {
            data: model,
            index: this.editIndex
          }).then(res => {
            this.$emit('on-success', 'update', Object.assign({}, model, res), this.editIndex)
            return res;
          }).catch(err => {
            this.$emit('on-error', 'update', err)
            return Promise.reject(err)
          })
        }
      },
      /**
       * 删除实体
       * @function remove
       * @param {object} model 实体对象
       * @param {number} [index] 删除的实体在列表的索引
       * @returns {Promise}
       */
      remove(model, index) {
        if (this.vm) {
          return this.vm[this.removeName](model[this.modelKey], null, index)
            .then(res => {
              this.$emit('on-success', 'remove', Object.assign({}, model, res), index)
              return res;
            }).catch(err => {
              this.$emit('on-error', 'remove', err)
              return Promise.reject(err)
            })
        } else {
          return this.$store.dispatch(this.removeName, {
            [this.modelKey]: model[this.modelKey],
            data: null,
            index: index
          }).then(res => {
            this.$emit('on-success', 'remove', Object.assign({}, model, res), index)
            return res;
          }).catch(err => {
            this.$emit('on-error', 'remove', err)
            return Promise.reject(err)
          })
        }
      },
      handleQuery() {
        this.reload()
      },
      /**
       * 重新加载列表数据，刷新列表, 分页转到第一页
       * @function reload
       */
      reload() {
        this.$refs.list.reload()
      },
      /**
       * 重新加载列表数据，刷新列表, 分页保持当前页不变
       * @function refresh
       */
      refresh() {
        this.$refs.list.loadData()
      },
      handleOpenAdd() {
        this.dialogMode = 'insert'
        this.currentModel = {...this.model}
        this.dialogClosed = false
      },
      handleSelection(selection) {
        this.selection = selection
      },
      handleInsert(model) {
        return this.insertHandler ? this.insertHandler(model) : this.add(model)
      },
      handleUpdate(model) {
        return this.updateHandler
          ? this.updateHandler(model)
          : this.update(model).then(() => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          })
      },
      handleRemove(row, index) {
        this.$confirm('是否确定删除？', '提示', {type: 'warning'}).then(() => {
          this.remove(row, index).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        }).catch(e => {
        })
      },
      handleEdit(row, index) {
        this.currentModel = {...row}
        this.editIndex = index
        this.dialogMode = 'update'
        this.dialogClosed = false
      }
    },
    created() {
      if (this.mixin) {
        this.vm = new Vue(this.mixin)
      }
    }
  }
</script>
