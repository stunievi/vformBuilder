<template>
  <el-select v-model="query"
             v-bind="selectProps"
             v-on="listeners"
             :remote-method="getRemoteData"
             ref="combo">
    <el-option v-for="item in data"
               :key="valueKey ? item[optionValue][valueKey] : item[optionValue]"
               :label="item[optionLabel] ? item[optionLabel]: item[optionValue]"
               :value="item[optionValue]">
      <slot :item="item" name="options"></slot>
    </el-option>
  </el-select>
</template>

<script>
  /**
   * 组合下拉输入框组件
   * @module widgets/xdh-combo
   * @author 潘浩玮
   */
  import ElSelect from 'element-ui/lib/select'

  /**
   * 插槽
   * @member slots
   * @property {string} options 下拉框自定义内容
   */

  /**
   * @export
   */
  export default {
    name: 'XdhCombo',
    /**
     * 属性参数

     * @property {Array} [optionData] options选项数据数组
     */
    props: {
      ...ElSelect.props,
      // @property {Object} [optionProp] 作为 value 唯一标识的键名，绑定值为对象类型时必填,自定义options选项的label,value,disabled名称
      // optionProp: {
      //   type: Object,
      //   default() {
      //     return null
      //   }
      // },
      optionData: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        query: '',
        list: [],
        data: [...this.optionData]
      }
    },
    computed: {
      selectProps() {
        let props = {...this.$props}
        props.remote = true;
        props.allowCreate = true
        props.filterable = true
        delete props.remoteMethod
        delete props.optionData
        // 多选框情况下，按下回车就可以选中当前选项列表中的第一个选项,用于多选时回车新增自定义选项
        if (props.multiple) {
          props.defaultFirstOption = true
        }
        return props
      },
      listeners() {
        const _self = this
        let _listeners = {}

        for (let item in this.$listeners) {
          _listeners[item] = function () {
            let _arguments = Array.from(arguments)
            _arguments.unshift(item)

            // 先做默认点击某一级获取下一级数据，再做用户有自定义的点击选项事件
            if (item === 'clear') {
              _self.getRemoteData()
            }
            _self.$emit.apply(_self, _arguments)
          }
        }

        // 默认点击某一级获取下一级数据，再做用户有自定义的点击选项事件
        if (!_listeners['clear']) {
          _listeners['clear'] = function () {
            let _arguments = Array.from(arguments)
            _arguments.unshift('clear')
            _self.getRemoteData()
            _self.$emit.apply(_self, _arguments)
          }
        }

        return _listeners
      },
      optionValue() {
        return this.optionMap && this.optionMap.value ? this.optionMap.value : 'value';
      },
      optionLabel() {
        return this.optionMap && this.optionMap.label ? this.optionMap.label : 'label';
      }
    },
    watch: {
      optionData: {
        handler(data) {
          this.data = data
        },
        deep: true,
        immediate: true
      },
      query(val) {
        this.$emit('input', val);
      },
      value(val) {
        this.query = val;
      }
    },
    methods: {
      /**
       * 设置根据输入内容不同显示的下拉数据
       * @param data 输入内容匹配原数组得到的结果
       */
      setNewOptions(data) {
        if (data.length > 0) {
          this.data = data
        } else {
          if (this.list[0].length > 0) {
            this.data = [this.query]
          } else {
            let obj = {}
            obj[this.optionLabel] = obj[this.optionValue] = this.query
            this.data = [obj]
          }
        }
      },
      /**
       * 使用远程的方法模拟获取输入内容不存在选项中也可以获取到输入内容的效果
       * @param query
       */
      getRemoteData(query = '') {
        // 传入的data可能有下面两种情况
        // [{key:1,value:1},{key:2,value:2}]
        // [1,2]
        // 单选情况下
        if (!this.multiple) {
          this.query = query;
          // 重新设置下拉框的内容
          if (query) {
            setTimeout(() => {
              const temp = this.data.filter(item => {
                // 判断data的两种情况
                if (item[this.optionLabel]) {
                  return item[this.optionValue].toString().includes(query);
                } else {
                  return item.includes(query);
                }
              });
              this.setNewOptions(temp)
            }, 10);
          } else {
            setTimeout(() => {
              this.data = [...this.list]
            }, 10);
          }
        }
      }
    },
    mounted() {
      this.query = this.value;
      this.list = this.optionData;
    },
    created() {
      if (this.multiple && !Array.isArray(this.value)) {
        this.$emit('input', []);
      }
      if (!this.multiple && Array.isArray(this.value)) {
        this.$emit('input', '');
      }
    }
  }
</script>
