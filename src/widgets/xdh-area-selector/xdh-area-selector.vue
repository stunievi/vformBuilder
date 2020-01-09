<template>
  <div class="xdh-area-selector">
    <el-select v-for="(select,index) in showedSetComputed" :key="select.type"
               v-model="allValue[select.type]"
               v-bind="selectProps"
               v-on="listeners"
               :placeholder="select.placeholder"
               @change="handleSelectChange($event,index)">
      <el-option v-for="(opt,i) in optionData[select.type]"
                 :key="`${opt.value}_${i}`"
                 :label="opt.label"
                 :value="opt.value">
      </el-option>
    </el-select>
  </div>
</template>

<style lang="scss" type="text/scss" scoped>
  .xdh-area-selector {
    /deep/ .el-select {
      margin-right: 5px;
    }
  }
</style>

<script>
  /**
   * 导入系统地区数据
   */
  function loadAreaData() {
    return import('./data/pcaa')
  }

  /**
   * 设置指定地区的数据内容
   * @param data 源数据
   * @param areaId 指定的地区节点ID
   * @returns []
   */
  const setAreaData = function (data, areaId) {
    const areaData = Object.keys(data[areaId]).map((item) => {
      let obj = {
        value: item,
        label: data[areaId][item]
      }
      if (data[item]) {
        obj.children = []
      }
      return obj
    })
    return areaData
  }

  /**
   * 非异步情况下，将全部数据转换源地区数据
   * @param obj data.js的地区数据
   * @param parentId 父节点ID
   * @param lazy 是否一级一级懒加载
   * @param level 层级
   * @param showLevel 默认显示的层级数
   * @returns {Array} listData数据
   */
  const objToData = function (obj, parentId, lazy, level = 0, showLevel = 4) {
    let temp = [], result = []
    const data = obj[parentId]

    if (!obj && !data) {
      return result
    }

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const item = {
          value: key,
          label: data[key]
        }
        // 控制显示的级别
        if (level < showLevel) {
          temp = objToData(obj, key, lazy, level + 1, showLevel)
          if (temp.length > 0) {
            item.children = temp
          }
        }
        result.push(item)
      }
    }

    return result
  }

  /**
   * export
   */
  export default {
    name: 'XdhAreaSelector',
    /**
     * 属性参数
     * @property {Object} [selectProps] select 配置项
     * @property {Boolean} [showAll=true] true为显示全部下拉框，false为只显示首级下拉框，每级触发
     * @property {Array} [selectText] 省/市/县区/乡镇街道，每个下拉框对应的placeholder
     * @property {Number} [level=4] 显示的层级数，至少有1级以上
     * @property {Array} [customData] 自定义数据，如果为空则读取系统数据
     * @property {Boolean} [lazy=false] 是否异步加载。
     */
    props: {
      value: {
        required: true
      },
      selectProps: {
        type: Object,
        default() {
          return {}
        }
      },
      showAll: {
        type: Boolean,
        default: false
      },
      selectText: {
        type: Array,
        default() {
          return ['请选择省', '请选择市', '请选择县区', '请选择乡镇街道']
        }
      },
      level: {
        type: Number,
        validator(val) {
          return Number.isInteger(val) && val > 0
        },
        default: 4
      },
      customData: {
        type: Array,
        default() {
          return []
        }
      },
      lazy: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      selectText: {
        handler(text) {
          this.setting.map((n, i) => {
            this.baseSetting.push({
              type: n,
              placeholder: text[i] || '请选择'
            })
          })
        },
        immediate: true
      },
      // 回填value
      selectValue(val) {
        let value = [...val]
        let isFlag = false
        value.forEach(n => {
          if (!n) {
            isFlag = true
          }
        })
        if (isFlag) {
          value = []
        }
        this.$emit('input', value)
      },
      // 初始化showAll，true则根据传进来的level来控制显示的下拉框；false则显示首个下拉框
      showAll: {
        handler(val) {
          let set = []
          this.basedSet = this.baseSetting.filter((n, i) => {
            if (i < this.level) {
              return n
            }
          })
          if (val) {
            set = [...this.basedSet]
          } else {
            set.push(this.baseSetting[0])
          }
          this.showedSet = [...set]
        },
        immediate: true
      },
      // 显示的配置
      showedSet: {
        handler(set) {
          this.showedSelect = []
          set.map((n, i) => {
            // 控制哪些下拉框显示
            this.showedSelect.push(n.type)
          })
        },
        deep: true,
        immediate: true
      },
      // 渲染组件加载首级所需数据
      customData: {
        handler(data) {
          if (data.length > 0) {
            this.isDefault = false
            // 渲染首级数据
            this.$set(this.optionData, this.showedSet[0].type, data)
            this.$nextTick(() => {
              if (this.value.length > 0) {
                this.renderValue()
              }
            })
          } else {
            this.renderSystemData()
          }
        },
        immediate: true
      },
      allValue: {
        handler(value) {
          const selectValue = []
          Object.keys(value).map(n => {
            selectValue.push(value[n])
          })
          this.selectValue = selectValue
        },
        deep: true
      }
    },
    computed: {
      listeners() {
        const _self = this
        let _listeners = {}
        // change：抛出在@change做：先做默认点击某一级获取下一级数据，再做用户有自定义的点击选项事件
        for (let item in this.$listeners) {
          if (item !== 'change') {
            _listeners[item] = function () {
              let _arguments = Array.from(arguments)
              _arguments.unshift(item)
              _self.$emit.apply(_self, _arguments)
            }
          }
        }
        return _listeners
      },
      showedSetComputed() {
        return this.showedSet.filter(item => this.showedSelect.includes(item.type))
      }
    },
    data() {
      return {
        isDefault: true, // 读取系统数据
        districtCity: ['110000', '120000', '310000', '500000'],
        isDistrict: false,
        optionData: {},
        selectValue: [],
        allValue: {},
        showedSelect: [],
        basedSet: [], // 根据不同级别显示的地区
        showedSet: [], // 根据切换不同省份要显示不同的select,
        changedSet: [],
        setting: ['province', 'city', 'area', 'town'],
        baseSetting: []
      }
    },
    methods: {
      /**
       * 获取系统地区数据
       */
      renderSystemData() {
        Promise.all([loadAreaData()]).then((results) => {
          this.chinaAreaData = results[0].chinaAreaData
          let data
          if (this.lazy) {
            data = setAreaData(this.chinaAreaData, '86')
          } else {
            data = objToData(this.chinaAreaData, '86', false, 0, this.level)
          }
          this.$set(this.optionData, this.showedSet[0].type, data)
          if (this.value.length > 0) {
            this.renderValue()
          }
        })
      },
      /**
       * 动态获取下级数据
       */
      getNextAreaData(data, areaId) {
        let obj = {}
        data.forEach(n => {
          if (n.value === areaId) {
            Object.keys(this.chinaAreaData[areaId]).forEach(d => {
              obj = {
                value: d,
                label: this.chinaAreaData[areaId][d]
              }
              if (this.chinaAreaData[d]) {
                obj.children = []
              }
              n.children.push(obj)
            })
          }
        })
      },
      /**
       * 点击下一项
       */
      handleSelectChange(areaId, index, isRendered = false) {
        // 首级处理
        if (index === 0) {
          this.changedSet = []
          // 读取直辖市数据,要将市级数据先隐藏
          if (this.isDefault && this.districtCity.includes(areaId)) {
            this.isDistrict = true
            const arr = [...this.baseSetting]
            arr.splice(1, 1)
            if (this.showAll) {
              this.showedSet = arr.slice(0, this.level)
            } else {
              this.changedSet = arr.slice(0, this.level)
              this.showedSet.splice(index + 1)
            }
          } else { // 读取普通省份数据
            this.isDistrict = false
            if (this.showAll) {
              this.showedSet = [...this.basedSet]
            } else {
              this.changedSet = [...this.basedSet]
              this.showedSet.splice(index + 1)
            }
          }
          const obj = {}
          obj[this.showedSet[index].type] = this.allValue[this.showedSet[index].type]
          this.allValue = {...obj}
        }

        if (!this.isDistrict && index < this.level - 1 || this.isDistrict && index < this.level - 2) {
          // 获取下级children数据
          let data
          const type = this.showedSet[index].type
          if (this.lazy) {
            this.getNextAreaData(this.optionData[type], areaId)
          }
          data = this.optionData[type].filter(n => {
            return n.value === areaId
          })

          // 判断没有下级，则没有自动触发点击事件
          if (data[0] && data[0].children && data[0].children.length > 0) {
            if (!this.showAll && (this.isDistrict && this.showedSet.length < this.level - 1 || !this.isDistrict && this.showedSet.length < this.level)) {
              this.showedSet.push(this.changedSet[index + 1])
            }
            if (!isRendered) {
              this.$nextTick(() => {
                // 清空对应的value值
                for (let i = index + 1; i < this.showedSelect.length; i++) {
                  this.$set(this.allValue, this.showedSelect[i], '')
                }

                this.$set(this.optionData, this.showedSet[index + 1].type, data[0].children)
              })
            } else {
              this.$set(this.optionData, this.showedSet[index + 1].type, data[0].children)
            }
          }
        }

        /**
         * select改变时触发
         * @event change
         * @param {string} areaId 当前选中的下拉框的id
         */
        this.$emit('change', areaId)
      },
      /**
       * 回填数据
       */
      renderValue() {
        this.value.map((n, i) => {
          if (i < this.value.length - 1) {
            this.handleSelectChange(n, i, true)
          }
          this.$nextTick(() => {
            this.$set(this.allValue, this.showedSelect[i], n)
          })
        })
      }
    },
    mounted() {
    }
  }
</script>
