import Emitter from 'element-ui/lib/mixins/emitter'
import {getParent, getParentGroup, getExtendAttrs} from '../utils'

export default {
  mixins: [Emitter],
  inject: {
    xdhForm: {
      default: null
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    collapsible: {
      type: Boolean,
      default: true
    },
    collapsed: {
      type: Boolean
    },
    tool: {
      type: Boolean,
      default: false
    },
    // 依赖字段
    depend: {
      type: String
    },
    // 依赖字段值
    dependValue: {
      type: [String, Number, Boolean, Array, Object]
    }
  },
  data() {
    return {
      currentCollapsed: this.collapsible && this.collapsed
    }
  },
  computed: {
    isActive() {
      // 排除无依赖或设计模式时的设置
      if (!this.depend || this.xdhForm.designMode) return true
      const dependValue = this.parent.currentModel[this.depend]
      return dependValue === this.dependValue
    },
    parent() {
      return getParent.call(this)
    },
    parentGroup() {
      return getParentGroup.call(this)
    },
    extendAttrs() {
      return getExtendAttrs.call(this)
    },
    labelSuffix() {
      return this.extendAttrs.labelSuffix || ''
    },
    inline() {
      return !!this.extendAttrs.inline
    },
    labelPosition() {
      return this.extendAttrs.labelPosition || 'right'
    },
    labelWidth() {
      return this.extendAttrs.labelWidth || null
    },
    classes() {
      return {
        'el-form--inline': this.extendAttrs.inline,
        'is-inline-size': !!this.extendAttrs.inlineSize,
        [`is-inline-${this.extendAttrs.inlineSize}`]: !!this.extendAttrs.inlineSize,
        [`el-form--label-${this.extendAttrs.labelPosition}`]: !!this.extendAttrs.labelPosition
      }
    },
    labelStyle() {
      const {labelWidth, labelPosition} = this.parentGroup.extendAttrs
      const ret = {};
      if (labelPosition === 'top') return ret;
      if (labelWidth) {
        ret.width = labelWidth;
      }
      return ret;
    },
    showMessage() {
      return this.xdhForm.$refs.form.showMessage
    },
    inlineMessage() {
      return this.xdhForm.$refs.form.inlineMessage
    },
    hideRequiredAsterisk() {
      return this.xdhForm.$refs.form.hideRequiredAsterisk
    },
    validateOnRuleChange() {
      return this.xdhForm.$refs.form.validateOnRuleChange
    }
  },
  methods: {
    handleCollapse() {
      this.currentCollapsed = !this.currentCollapsed
    },
    handleAdd() {
      this.$emit('add', this)
    },
    clearValue() {
      const model = this.parent.currentModel
      if (model && this.prop) {
        delete model[this.prop]
      }
      if (Array.isArray(model) && Number.isInteger(this.prop)) {
        model.splice(this.prop, 1)
      }
    }
  },
  created() {
    this.$on('el.form.addField', (field) => {
      if (field) {
        this.dispatch('ElForm', 'el.form.addField', [field]);
      }
    });
    this.$on('el.form.removeField', (field) => {
      if (field.prop) {
        this.dispatch('ElForm', 'el.form.removeField', [field]);
      }
    });
  },
  beforeDestroy() {
    if (typeof this.prop === 'undefined') return
    this.clearValue()
  }
}
