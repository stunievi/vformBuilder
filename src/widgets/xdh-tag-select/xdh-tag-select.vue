<template>
  <div class="tag-list">
    <span
      :class="['checkable', 'checkable-all',size ? 'checkable--' + size : '',{'tag-checkable':selectList.length === data.length}]"
      v-if="!hideCheckAllLocal"
      @click.stop="handleSelectAll">
      <slot name="allTag">全部</slot>
    </span>
    <div class="tag-list-option" :class="{'expand-retract':!expandState}">
      <span
        :class="['checkable',size ? 'checkable--' + size : '',{'is-disabled':item[props.disabled],'tag-checkable':selectList.includes(item[props.id])}]"
        v-for="(item,index) in data"
        :key="index"
        @click.stop="handleSelect(item)">{{item[props.label]}}</span>
    </div>
    <span class="expandable-button" v-if="expandable" @click.stop="onShowAll">{{expandState?'收起':'展开'}}<i
      :class="`${expandState?'el-icon-arrow-up':'el-icon-arrow-down'}`"></i></span>
  </div>
</template>

<script>

  /**
   * XdhTagSelect 标签选择器
   * @module widgets/xdh-tag-select
   */
  export default {
    name: 'XdhTagSelect',
    components: {},
    model: {
      prop: 'value',
      event: 'tagSelect'
    },
    /**
     * 属性参数
     * @member props
     * @property {array} data 标签list
     * @property {boolean} [hide-check-all] 隐藏 全部 按钮 ,设置 min/max 时该配置无效
     * @property {boolean} [expandable = false] 是否折叠 展开/收起 按钮
     * @property {boolean} [expand = true] 默认展开状态,expandable为True 时生效
     * @property {array} [value] 绑定值  标签 props.id 集合
     * @property {Object} [props] 标签对象映射
     * @property {string} [props.id ='id'] 标签唯一Id
     * @property {string} [props.label ='label'] 标签显示文本
     * @property {string} [props.disabled ='disabled'] 标签禁用
     * @property {number} min 可被选中的最小数量
     * @property {number} nax 可被选中的最大数量
     * @property {string} size 选择按钮的尺寸,可选：medium / small / mini
     */
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      value: {
        type: Array,
        default() {
          return []
        }
      },
      size: {
        type: String,
        default: ''
      },
      min: Number,
      max: Number,
      props: {
        type: Object,
        default() {
          return {
            id: 'id',
            label: 'label',
            disabled: 'disabled'
          }
        }
      },
      hideCheckAll: {
        type: Boolean,
        default: false
      },
      defaultCheck: {
        type: Array,
        default() {
          return []
        }
      },
      expandable: {
        type: Boolean,
        default: false
      },
      expand: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      hideCheckAllLocal() {
        return (this.min || this.max) || this.hideCheckAll
      }
    },
    data() {
      return {
        selectList: [],
        expandState: false
      }
    },
    mounted() {
      if (this.value.length > 0) {
        this.selectList = this.value
      }
      this.expandState = this.expand
    },
    watch: {
      selectList(val) {
        this.$emit('tagSelect', val)
      }
    },
    methods: {
      /**
       * 选择标签
       * @param item
       */
      handleSelect(item) {
        // 标签是否禁用
        if (item[this.props.disabled]) return false
        let tempLength = this.selectList.length
        let execute = false
        if (this.selectList.includes(item[this.props.id]) && (!this.min || tempLength > this.min)) {
          this.selectList.splice(this.selectList.indexOf(item[this.props.id]), 1)
          execute = true
        } else if (!this.selectList.includes(item[this.props.id]) && (!this.max || tempLength < this.max)) {
          this.selectList.push(item[this.props.id])
          execute = true
        }
        if (!execute) return false
        let checkedList = []
        for (let i = 0; i < this.data.length; i++) {
          if (this.selectList.includes(this.data[i][this.props.id])) {
            checkedList.push(this.data[i])
          }
        }
        /**
         * 操作单个标签后触发事件
         * @event on-change
         * @param {Object} item 前操作的标签数据对象
         * @param {Array} checkedList 选中的标签对象数组集
         */
        this.$emit('on-change', item, checkedList)
      },
      handleSelectAll() {
        let d = this.data, s = this.selectList
        if (s.length < d.length) {
          d.forEach(item => {
            if (!s.includes(item[this.props.id]) && !item[this.props.disabled]) this.selectList.push(item[this.props.id])
          })
          /**
           * 全选按钮触发事件
           * @event on-checked-all
           * @param {String} state 当前状态:on-全选中，off-全取消
           */
          this.$emit('on-checked-all', 'on')
        } else {
          this.selectList.splice(0)
          this.data.forEach(item => {
            if (item[this.props.disabled]) this.selectList.push(item[this.props.id])
          })
          this.$emit('on-checked-all', 'off')
        }
      },
      /**
       * 展开/收起 标签切换
       */
      onShowAll() {
        this.expandState = !this.expandState
      }
    }
  }
</script>
