<template>
  <el-popover :width="width" v-model="visible">
    <div class="xdh-image-picker__bd">
      <el-scrollbar>
        <xdh-grid :data="data" wrap="wrap">
          <template slot-scope="scope">
            <span class="xdh-image-picker__item"
                  :class="{'is-selected':scope.item===selectedItem}"
                  @click="handleItemClick(scope.item, scope.index)">
              <slot :item="scope.item" :index="scope.index">
                <img :src="scope.item"/>
              </slot>
            </span>
          </template>
        </xdh-grid>
      </el-scrollbar>
      <select-footer
        :clear="showClearBtn"
        :submit="showOkBtn"
        @on-clear="clearSelected"
        @on-submit="handleSelected">
        <slot name="footer"></slot>
      </select-footer>
    </div>
    <div slot="reference" class="xdh-image-picker">
      <slot name="reference">
        <avatar v-if="value" class="xdh-image-picker__value" :src="value" shape="square" :size="size"></avatar>
        <avatar v-else class="xdh-image-picker__empty" icon="el-icon-close" shape="square" :size="size"></avatar>
      </slot>
    </div>
  </el-popover>

</template>

<script>
  /**
   * image-picker图片选择器组件
   * @module widgets/xdh-image-picker
   * @example
   *
   * // 用默认插槽自定义图片列表展示，通过点击自行调用组件内部选中/清除/确认函数实现图片选择
   * <xdh-image-picker :data="images" v-model="value" :width="400" size="large"
   * :show-clear-btn="false" :show-ok-btn="false" ref="cusImgPicker">
   *    <template slot-scope="props" :keys="props.index">
   *      <div @click="sglClickImgHandle(props.item, props.index)" @dblclick="dblClickImgHandle(props.item)">
   *       <img :src="props.item" alt="" />
   *       <p>{{props.index}}</p>
   *      </div>
   *    </template>
   *  <p slot="footer" >这个是说明</p>
   * </xdh-image-picker>
   *
   * // 自行调用组件内部函数
   * sglClickImgHandle(item, index) {
   *    let curItem = this.$refs.cusImgPicker.selectedItem
   *    if(item === curItem) {
   *      this.$nextTick(() => {
   *        this.$refs.cusImgPicker.clearSelected()
   *      })
   *    }
   *  },
   * dblClickImgHandle(item) {
   *    this.$refs.cusImgPicker.handleSelected()
   *  },
   */
  import Avatar from '../xdh-avatar'
  import XdhGrid from '../xdh-grid'
  import SelectFooter from '../xdh-tree-select/select-footer.vue'

  /**
   * 插槽
   * @member slot
   * @property {String} [default] 定义下拉框中没一项的内容（默认是img节点）
   * @property {Object} [default.item] 默认slot的属性，为数组对应的item
   * @property {Number} [default.index] 默认slot的属性，为图片数组的index
   * @property {String} [footer] footer的插槽，默认为两个功能按钮
   * @property {String} [reference] reference的插槽，默认为显示选中的图片
   */
  export default {
    name: 'XdhImagePicker',
    components: {
      Avatar,
      XdhGrid,
      SelectFooter
    },
    /**
     * 属性参数
     * @property {Array} [data = []] 图片src数组
     * @property {String} [size = 'default'] 选择器尺寸, 可选值为'large', 'small', 'default'
     * @property {Number} [width = 260] 弹窗宽度
     * @property {String} [value] 选中项的值
     * @property {Boolean} [showClearBtn = true] 是否显示清空按钮,默认true
     * @property {Boolean} [showOkBtn= true] 是否显示确认按钮，默认true
     */
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      },
      size: {
        type: String,
        default: 'default',
        validator: function (val) {
          return ['large', 'small', 'default'].includes(val)
        }
      },
      width: {
        type: Number,
        default: 260
      },
      value: {
        type: String
      },
      showClearBtn: {
        type: Boolean,
        default: true
      },
      showOkBtn: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        selectedItem: this.value,
        visible: false
      }
    },
    watch: {
      value (val) {
        this.selectedItem = val
      }
    },
    computed: {
      selectedClass () {
        return this.selectedItem === this.value ? 'is-selected' : ''
      }
    },
    methods: {
      /**
       * （图片）列表单个元素的点击方法
       * @function handleItemClick
       * @param item
       */
      handleItemClick (item) {
        this.selectedItem = item
        /**
         * 图片元素点击事件
         * @event click
         * @param {Object} [item] 点中的图片元素对应在数组中的item
         */
        this.$emit('click', item)
      },
      /**
       * 清除选中项的方法，点击clearBtn时执行，会派发‘on-clear’事件
       * @function clearSelected
       */
      clearSelected () {
        this.selectedItem = null
        /**
         * 选中图片元素清除事件
         * @event on-clear
         */
        this.$emit('on-clear')
      },
      /**
       * 确认选中元素的方法，点击okBtn时执行，会派发‘input’事件 和 ‘on-ok’事件
       * @function clearSelected
       * @param {Object} [selectedItem] 确认选中的item数据
       */
      handleSelected () {
        this.visible = false
        this.$emit('input', this.selectedItem)
        this.$emit('on-ok', this.selectedItem)
      }
    }
  }
</script>
