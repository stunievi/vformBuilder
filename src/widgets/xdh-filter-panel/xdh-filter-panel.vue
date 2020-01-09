<template>
  <xdh-panel class="xdh-filter-panel"
             :title="title"
             :icon="icon"
             :header-height="headerHeight"
             :footer-height="footerHeight">
    <div slot="tool">
      <slot name="tool"></slot>
      <i v-if="collapsible" @click="toggleCollapsed" :class="toggleClass"></i>
    </div>
    <div @keyup.13="handleQuery">
      <el-form inline :size="size" v-bind="formProp"  ref="form">
        <slot></slot>
        <slot name="expand" v-if="!isShowCollapsed"></slot>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="xdh-filter-panel__footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>

  </xdh-panel>
</template>


<script>
  /**
   * filterPanel查询面板组件
   * @module widgets/xdh-filter-panel
   * @example
   *
   * <xdh-filter-panel title="查询" :model.sync="model" @on-query="handleQuery" :collapsible="true">
   *   <el-form-item label="关键字" prop="keyword">  // 每个el-form中 需要设置 prop
   *    <el-input v-model="model.keyword"></el-input>
   *   </el-form-item>
   *   <template slot="expand">
   *     <el-form-item label="标题" prop="title"> // 每个el-form中 需要设置 prop
   *      <el-input v-model="model.title"></el-input>
   *     </el-form-item>
   *   </template>
   * </xdh-filter-panel>
   *
   * // -----------------
   * data() {
   *  return {
   *    model: { // model 的解构对应 slot中表单组件的prop
   *      keyword: '',
   *      title: ''
   *    }
   *  }
   * }
   */
  import XdhPanel from '@/widgets/xdh-panel'
  /**
   * 插槽
   * @member slot
   * @property {string} [default] 默认slot 为筛选的input表单（主要筛选条件）
   * @property {string} [expand] 拓展部分的插槽，可以通过tool来切换显示隐藏。里面的input表单为额外的筛选条件表单
   * @property {string} [footer] 底部插槽
   * @property {string} [tool] 右上角切换按钮旁边的内容插槽
   */
  export default {
    name: 'XdhFilterPanel',
    components: {
      XdhPanel
    },
    /**
     * 属性参数
     * @property {String} [title = '查询条件'] 面板的标题
     * @property {String} [icon = 'iconfont icon-filter'] 左上角icon
     * @property {String} [size=small] 表单项的尺寸，medium / small / mini
     * @property {Boolean} [collapsible = false] 是否开启折叠隐藏功能，true时，左上角展开按钮出现，可以控制expand插槽显示隐藏
     * @collapsed {Boolean} [coolapsed = true] 是否展开隐藏内容，需要与collapsible共同使用
     * @property {String} [headerHeight = '36px'] 版面header的高度，默认36px
     * @property {String} [footerHeight = '36px'] 版面footer的高度，默认36px
     * @property {Object} [model] 查询模型对象, 需要使用 .sync修饰符（:model.sync="someModel"）
     */
    props: {
      formProp: {
        type: Object,
        default: () => { return {} }
      },
      title: {
        type: String,
        default: '查询条件'
      },
      icon: {
        type: String,
        default: 'iconfont icon-filter'
      },
      size: {
        type: String,
        default: 'small'
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
      headerHeight: {
        type: String,
        default: '40px'
      },
      // 底部的高度
      footerHeight: {
        type: String,
        default: '40px'
      },
      // 查询模型对象， 支持sync修饰符
      model: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        isCollapsed: this.collapsed,
        defaultModel: {...this.model}
      }
    },
    computed: {
      toggleClass() {
        return {
          'el-icon-caret-bottom': this.isCollapsed,
          'el-icon-caret-top': !this.isCollapsed
        }
      },
      isShowCollapsed() {
        return this.collapsible && this.isCollapsed && this.$slots.expand
      }
    },
    methods: {
      /**
       * 点击tool插槽中的展开/收起按钮时执行的函数
       * @Function toggleCollapsed
       */
      toggleCollapsed() {
        this.isCollapsed = !this.isCollapsed
        this.$nextTick(() => {
          this.resetExpandFields()
          /**
           * 切换expand插槽部分展开隐藏的派发事件
           * @event toggle
           * @param {Boolean} [isCollapsed] 是否展开flag
           */
          this.$emit('toggle', this.isCollapsed)
        })
      },
      handleQuery() {
        /**
         * 点击查询派发的事件
         * @event on-query'
         * @param {Object} [model] 事件派发时将props中传入的model作为payload进行派发，props的model通过‘.sync’修饰为同步变化的属性
         */
        this.$emit('on-query', {...this.model})
      },
      /**
       * 重置表单函数
       * @Function handleReset
       */
      handleReset() {
        this.$refs.form.resetFields()
        const model = {...this.defaultModel}
        /**
         * 重置表单派发的事件，将当前model恢复到初始model(props中传入的model)
         * @event update:model
         */
        this.$emit('update:model', model)
        /**
         * 重置表单派发的事件，将当前model恢复到初始model(props中传入的model)
         * @event on-reset
         */
        this.$emit('on-reset', model)
      },
      /**
       * 重置扩展区域的输入表单函数， 在t切换expand插槽时执行
       * @Function resetExpandFields
       */
      resetExpandFields() {
        if (!this.$slots.expand) return
        let model = {...this.model}
        let expandFields = []
        this.$slots.expand.forEach(vnode => {
          if (!vnode.componentOptions) return
          const propsData = vnode.componentOptions.propsData
          if (propsData && propsData.prop) {
            expandFields.push(propsData.prop)
            model[propsData.prop] = this.defaultModel[propsData.prop]
          }
        })
        /**
         * 切换expand区域时派发的事件，可以将expand插槽内的其他表单的prop转换为数组作为payload进行派发
         * @event reset-expand-fields
         */
        expandFields.length > 0 && this.$emit('reset-expand-fields', expandFields)
        /**
         * 切换（收起）expand插槽时对expand内的表单内容重置，并同步update model数据
         * @event update:model
         */
        this.$emit('update:model', model)
      }
    }
  }
</script>
