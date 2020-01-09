<template>
  <xdh-dialog :title="title"
              :closed.sync="dialogClosed"
              @on-open="handleDialogOpen"
              @on-close="handleDialogClose"
              :draggable="true"
              :width="width"
              :max-height="maxHeight">
    <el-form
      :label-position="labelPosition"
      :label-width="labelWidth"
      :size="size"
      :rules="rules"
      ref="form"
      :model="currentModel">
      <slot :model="currentModel" :rules="rules">
        <el-form-item v-for="(item, name) in currentModel" :key="name" :label="name" :prop="name">
          <el-input v-model="currentModel[name]"></el-input>
        </el-form-item>
      </slot>
    </el-form>
    <div slot="footer">
      <el-button  @click="handleCancel" size="medium">取消</el-button>
      <el-button :loading="loading"
                 :disabled="loading"
                 size="medium"
                 type="primary"
                 @click="handleSubmit">{{okBtnText}}
      </el-button>
    </div>
  </xdh-dialog>
</template>

<script>
  /**
   * dialog-form 弹窗表单组件
   * @module widgets/xdh-dialog-form
   */
  import XdhDialog from '../xdh-dialog'
  import {clone} from '@/utils/convert'

  const noop = function () {
    return Promise.resolve()
  }
  /**
   * 插槽
   * @member slot
   * @property {string} [default] dialog的content插槽，默认为对应model的key的<el-form>组件，也可以根据slot-scope中的model自行插入<el-form>
   * @property {Object} [default.model] 组件的props属性model， 绑定到当前slot中
   * @property {Object} [default.rules] 组件的props属性rules， 绑定到当前slot中
   * @property {string} [footer] 底部slot
   */
  export default {
    name: 'XdhDialogForm',
    components: {
      XdhDialog
    },
    /**
     * 参数属性
     * @property {String} [mode = 'insert'] 定义dialogForm的操作模式('insert'(新增)|'update'(修改))，默认'insert'
     * @property {Function} [on-insert] 对应 mode为 insert 时的 callback函数，需要返回Promise。on-insert(data)函数会改变 绑定的 model数据。
     * @property {Function} [on-update] 对应 mode为 update 时的 callback函数，需要返回Promise。on-update(data)函数会输出一个全新的与model解构一致的数据， 但不会改变绑定的model数据
     * @property {String} [title] dialogForm 的标题
     * @property {Boolean} [closed] 是否显示/关闭，可用于双向绑定的属性（:closed.sync=isClosed）
     * @property {Object} [model] 表单修改对应的数据。默认(不自定义表单时)dialogForm中的<el-form>是通过遍历model的key生成。 在slot中自定义表单时，添加的<el-form>通过 定义prop为 slot-scope中的model的对应key来确定对应的键值绑定
     * @property {Object} [rules] 表单的验证规则，定义model中的key的绑定数据规则
     * @property {Array} [rules.keys] 定义model中某个key的验证规则，通过数组定义多个验证规则
     * @property {Array} [rules.keys.require] 验证规则条件，此value是否为必填'{title:[{required:true}]}'
     * @property {String} [rules.keys.message] 验证规则条件，此value不正确时的提示文字 '{title:[{message: 不能为空}]}'
     * @property {String} [rules.keys.type] 验证规则条件，此value的类型 '{title:[{type: String}]}'
     * @property {Function} [rules.keys.validator] 验证规则条件, 通过函数输出验证的条件
     * @property {String} [rules.keys.trigger] 验证规则条件, 验证执行的触发, 有'blur'/'submit'等
     * @property {String} [label-position = 'right'] 表单字段名称对齐方式
     * @property {String} [label-width = '80px'] 表单字段名称的宽度
     * @property {String} [size] 表单项的尺寸 medium / small / mini
     * @property {String} [width = '50%'] 对话框宽度
     * @property {String} [max-height = 'auto'] 最大宽度
     */
    props: {
      // 操作模式，新增还是修改
      mode: {
        type: String,
        default: 'insert',
        validator(val) {
          return ['insert', 'update'].includes(val)
        }
      },
      // 对话框标题
      title: {
        type: String,
        default: ''
      },
      // 是否关闭，支持双向绑定修饰符
      closed: {
        type: Boolean,
        default: true
      },
      // 对话框宽度
      width: {
        type: String,
        default: '50%'
      },
      // 最大宽度
      maxHeight: {
        type: String,
        default: 'auto'
      },
      // 模型数据
      model: {
        type: Object,
        default() {
          return {}
        }
      },
      // 表单验证规则
      rules: {
        type: Object
      },
      // 表单字段名称对齐方式
      labelPosition: {
        type: String,
        default: 'right'
      },
      // 表单字段名称的宽度
      labelWidth: {
        type: String,
        default: '80px'
      },
      // 表单项的尺寸
      size: {
        type: String
      },
      // 增加动作回调函数，需要返回Promise
      onInsert: {
        type: Function,
        default: noop
      },
      // 更新动作回调函数，需要返回Promise
      onUpdate: {
        type: Function,
        default: noop
      }
    },
    data() {
      return {
        dialogClosed: this.closed,
        currentModel: clone(this.model),
        loading: false
      }
    },
    computed: {
      okBtnText() {
        return this.loading ? '正在处理...' : '确定'
      }
    },
    watch: {
      dialogClosed(val) {
        this.$emit('update:closed', val)
        if (val) {
          this.loading = false
        }
      },
      closed(val) {
        this.dialogClosed = val
      },
      model: {
        deep: true,
        handler(val) {
          this.currentModel = clone(val)
        }
      }
    },
    methods: {
      handleCancel() {
        this.dialogClosed = true
      },
      handleSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true
            switch (this.mode) {
              case 'insert':
                this.onInsert(clone(this.currentModel)).then(() => {
                  this.dialogClosed = true
                }).catch(() => {
                  this.loading = false
                })
                break
              case 'update':
                this.onUpdate(clone(this.currentModel)).then(() => {
                  this.dialogClosed = true
                }).catch(() => {
                  this.loading = false
                })
                break
            }
          }
        })
      },
      handleDialogOpen() {
        /**
         * 打开事件派发
         * @event open
         */
        this.$emit('open')
        this.$nextTick(() => {
          this.$refs.form && this.$refs.form.clearValidate()
        })
      },
      handleDialogClose() {
        /**
         * 关闭事件派发
         * @event close
         */
        this.$emit('close')
        this.$refs.form && this.$refs.form.resetFields()
      }
    }
  }
</script>
