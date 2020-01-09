<template>
  <el-form ref="form"
           v-bind="$attrs"
           class="xdh-form"
           :class="formClasses"
           @submit.native.prevent.stop="preventSubmit"
           @keyup.native.13="handelEnterSubmit"
           :model="currentModel">
    <div class="xdh-form__body" ref="body">
      <slot>
        <xdh-form-item v-for="item in fields" :key="item.prop" v-bind="item"></xdh-form-item>
      </slot>
      <el-form-item v-if="footer && isFooterInline" class="xdh-form__footer">
        <slot name="footer" v-if="footer">
          <el-button v-if="submitText" type="primary" @click="submit" :size="footerSize">{{submitText}}</el-button>
          <el-button v-if="resetText" @click="reset" :size="footerSize">{{resetText}}</el-button>
        </slot>
      </el-form-item>
    </div>
    <el-form-item v-if="footer && !isFooterInline" class="xdh-form__footer" :class="footerClasses"
                  :label="footerAlignLabel">
      <slot name="footer" v-if="footer">
        <el-button v-if="submitText" type="primary" @click="submit" :size="footerSize">{{submitText}}</el-button>
        <el-button v-if="resetText" @click="reset" :size="footerSize">{{resetText}}</el-button>
      </slot>
    </el-form-item>

  </el-form>
</template>

<script>
  /**
   * 表单组件
   * @module widgets/xdh-form
   *
   */
  import XdhFormItem from './xdh-form-item'
  import {clean} from './utils'
  import {isEqual, debounce} from '@/utils/util'

  /**
   * 插槽
   * @member slots
   * @property {string} - 自定义表单项内容，需包含 xdh-form-item 组件
   * @property {string} footer 定义底部内容
   */

  export default {
    name: 'XdhForm',
    components: {
      XdhFormItem
    },
    provide() {
      return {
        xdhForm: this
      }
    },
    /**
     * 参数属性，在支持el-form所有参数并扩展以下参数
     * @property {Object} [model] 表单初始化实体，通常用来设置表单项的默认值
     * @property {Array} [fields] 表单字段配置，配置参数参考xdh-form-item组件，该配置是用来动态创建xdh-form-item, 不支持group、array、object
     * @property {Object} [dictMap] 字典数据映射，格式： {'字典编码': [字典数组]}
     * @property {String} [validateMsg] 验证信息显示方式， 可选值 'top', 'right', 'bottom'
     * @property {Boolean} [footer=true] 是否显示底部操作按钮
     * @property {String} [footerAlign=label] 底部按钮对齐方式，可选值 'label', 'left', 'right', 'center','inline'
     * @property {Boolean} [footerBorder=true] 是否显示底部边框线
     * @property {String} [submitText=提交] 提交按钮文本，为空时将不显示按钮
     * @property {String} [resetText=重置] 重置按钮文本，为空时将不显示按钮
     * @property {String} [footerSize] 底部按钮尺寸，可选值 'large', 'medium', 'small', 'mini'
     * @property {string} [size] 内部表单项尺寸，可选值 medium / small / mini
     * @property {string} [labelPosition] 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width
     * @property {string} [labelWidth] 表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 auto。
     * @property {string} [labelSuffix]  表单域标签的后缀
     * @property {boolean} [inline=false] 内行模式
     * @property {String} [inlineSize]  inline模式的字段域宽度尺寸，可选值 'large', 'medium', 'small'
     * @property {Function} [load] 字典数据加载方法，必须返回Promise.resolve options数组
     * @property {Boolean} [enterSubmit=true] 是否回车键提交表单
     *
     */
    props: {
      // 表单实体默认值
      model: {
        type: Object,
        default() {
          return {}
        }
      },
      fields: {
        type: Array
      },
      // 字典数据构造方法，必须返回Promise
      load: {
        type: Function
      },
      // 静态字典数据配置对象
      dictMap: {
        type: Object,
        default() {
          return {}
        }
      },
      // 验证信息显示方式
      validateMsg: {
        type: String,
        default: '',
        validator(val) {
          return ['top', 'right', 'bottom', ''].includes(val)
        }
      },
      // 是否显示footer
      footer: {
        type: Boolean,
        default: true
      },
      // 底部对齐方式
      footerAlign: {
        type: String,
        default: 'right',
        validator(val) {
          return ['label', 'left', 'right', 'center', 'inline', ''].includes(val)
        }
      },
      // 底部是否加边框, 设置了footerAlign才有效
      footerBorder: {
        type: Boolean,
        default: true
      },
      // 提交按钮文本
      submitText: {
        type: String,
        default: '提交'
      },
      // 重置按钮文本
      resetText: {
        type: String,
        default: '重置'
      },
      // inline模式的字段域尺寸
      inlineSize: {
        type: String,
        default: '',
        validator(val) {
          return ['large', 'medium', 'small', ''].includes(val)
        }
      },
      // 底部按钮尺寸
      footerSize: {
        type: String,
        validator(val) {
          return ['large', 'medium', 'small', 'mini', ''].includes(val)
        }
      },
      // 回车键提交表单
      enterSubmit: {
        type: Boolean,
        default: true
      },
      // 设计模式，仅在可视化制作工具中实用
      designMode: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        currentModel: {...this.model}
      }
    },
    watch: {
      model: {
        deep: true,
        handler(val) {
          if (!isEqual(val, this.currentModel)) {
            this.currentModel = {...val}
          }
        }
      },
      currentModel: {
        deep: true,
        handler(val, old) {
          /**
           * 表单值发生改变时触发
           * @event change
           * @param {Object} val 新实体
           * @param {Object} old 旧实体
           */
          this.proxyHandleChange(val, old)
        }
      }
    },
    computed: {
      extendAttrs() {
        return {
          ...clean(this.$attrs),
          validateMsg: this.validateMsg,
          inlineSize: this.inlineSize

        }
      },
      formClasses() {
        return [this.$attrs.inline ? `is-inline-size is-inline-${this.inlineSize}` : '']
      },
      footerClasses() {
        return [
          `is-${this.footerAlign}`,
          {
            'is-border': (this.footerBorder && this.footerAlign && this.footerAlign !== 'label')
          }
        ]
      },
      footerAlignLabel() {
        return this.footerAlign === 'label' ? ' ' : null
      },
      isFooterInline() {
        return this.footerAlign === 'inline'
      }
    },
    methods: {
      /**
       * 提交表单
       * @method submit
       */
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            /**
             * 提交表单时触发
             * @event submit
             * @param {Object} model 表单实体
             */
            this.$emit('submit', this.currentModel)
          }
        })
      },
      /**
       * 重置表单
       * @method reset
       * @param {Object} model 表单实体
       */
      reset() {
        this.$refs.form.resetFields()
        this.currentModel = {...this.model}
        /**
         * 表单重置时触发
         * @event reset
         * @param {Object} model 表单实体
         */
        this.$emit('reset', this.currentModel)
      },
      preventSubmit() {
        return false
      },
      handelEnterSubmit() {
        this.enterSubmit && this.submit()
      },
      handleChange(val, old) {
        /**
         * 表单值改变时触发
         * @event change
         * @param {Object} model 表单实体
         */
        this.$emit('change', val, old)
      }
    },
    created() {
      this.proxyHandleChange = debounce(this.handleChange, 300, false, this)
    }
  }
</script>
