<template>
  <div :class="classes"
       @mouseenter="handleMouseEnter"
       @mousemove="handleMouseMove"
       @mouseleave="handleMouseLeave">
    <transition-group ref="port"
                      class="xdh-dock__port"
                      :style="portStyle"
                      enter-active-class="animated fadeIn"
                      leave-active-class="animated fadeOut">

      <slot name="prepend"></slot>

      <div class="xdh-dock__item"
           v-for="(item,index) in data"
           ref="items"
           :key="item.id"
           :data-id="index"
           :class="{'is-disabled':item.disabled}"
           :style="getItemStyle(index)">
        <slot name="item" :item="item" :index="index" :ratio="(itemsRatio[index] || 1)"></slot>
      </div>

      <slot name="append"></slot>

    </transition-group>
  </div>
</template>

<script>
  /**
   * XdhDock 程序坞
   * @module widgets/xdh-dock
   */
  import Sortable from '../xdh-tabs/sortable'

  /**
   * 插槽
   * @member slots
   * @property {string} prepend 前置内容
   * @property {string} append 后置内容
   */

  /**
   * 作用域插槽
   * @member scopedSlots
   * @property {string} item 定义项目展示内容，参数：item: 数据， index：索引，ratio：当前缩放比
   */

  export default {
    name: 'XdhDock',
    /**
     * 属性参数
     * @property {Array} data 应用数据
     * @property {string} [placement=bottom] 停靠位置，可选 'top', 'left', 'right', 'bottom'
     * @property {Number} [itemSize=50] 每个项目位置大小，正方形，单位像素
     * @property {Number} [scale=2] 鼠标经过图标最大缩放, 设置>=1
     * @property {Number} [radius=200] 触动半径, 单位像素
     * @property {Boolean|Object} [sortable = false] sortable sort控件实例的配置项 https://segmentfault.com/a/1190000008209715
     */
    props: {
      // 数据
      data: {
        type: Array,
        default() {
          return []
        }
      },
      // 显示位置
      placement: {
        type: String,
        default: 'bottom',
        validator(val) {
          return ['top', 'left', 'right', 'bottom'].includes(val)
        }
      },
      // 项的尺寸，正方形，单位像素
      itemSize: {
        type: Number,
        default: 80
      },
      // 鼠标经过图标最大缩放, 设置>=1
      scale: {
        type: Number,
        default: 2,
        validator(val) {
          return val >= 1
        }
      },
      // 触动半径
      radius: {
        type: Number,
        default: 4 * 50
      },
      sortable: {
        type: [Boolean, Object],
        default: false
      }
    },
    data() {
      return {
        // 每项的中心点坐标
        itemsCenterXY: [],
        itemsRatio: [],
        transition: true,
        sortInstance: null,
        timer: null
      }
    },
    computed: {
      classes() {
        return ['xdh-dock', `is-${this.placement}`, {
          'transition': this.transition
        }]
      },
      scaleRatio() {
        return this.scale / this.radius
      },
      portStyle() {
        let style = {}
        if (this.placement === 'top' || this.placement === 'bottom') {
          style.height = `${this.itemSize}px`
        } else {
          style.width = `${this.itemSize}px`
        }
        return style
      }
    },
    watch: {
      sortable(val) {
        if (this.sortInstance) {
          const options = val ? Object.assign({
            sort: true
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
          fallbackClass: 'xdh-dock__clone'
        }, this.sortable) : {}
        this.sortInstance = new Sortable({
          vm: this,
          container: this.$refs.port.$el,
          data: this.data,
          config: {
            animation: 150,
            // 利用el-tabs生成的tab 属性id来进行标示和排序
            dataIdAttr: 'data-id',
            filter: '.is-disabled'
          },
          options: options,
          reset: function (n, index) {
            return index.toString()
          },
          change: this._handleChange
        })
        this.$on('on-start', () => {
          this.itemsRatio = []
          this.transition = true
        })

      },
      _handleChange(data, type, args) {
        this.$emit('update:data', data)
        /**
         * 数据发生改变时触发，如：排序、新增、删除
         * @event on-change
         * @param {Array} data 数据数组
         * @param {string} type 改变类型： sort / add /remove
         * @param {Array} args type 对应的参数 sort:[oldIndex, newIndex],add:[fromData, element, oldIndex, newIndex], remove:[element, oldIndex]
         */
        this.$emit('on-change', data, type, args)
      },
      setSortable(options) {
        this.sortInstance && this.sortInstance.setOption(options)
      },
      handleMouseEnter(e) {
        this.transition = true
        this.updateItemsCenterXY()
        this.itemsRatio = this.getItemsScaleRatio(e.clientX, e.clientY)

      },
      handleMouseLeave(e) {
        this.itemsRatio = []
        this.itemsCenterXY = []
        this.timer = setTimeout(() => {
          this.transition = true
        }, 200)
      },
      handleMouseMove(e) {
        this.itemsRatio = this.getItemsScaleRatio(e.clientX, e.clientY)
        // 为了实现鼠标刚进入时的渐变动画
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.transition = false
        }, 200)
      },
      /**
       * 更新每个节点的中心在屏幕的位置
       */
      updateItemsCenterXY() {
        this.itemsCenterXY = this.$refs.items.map(el => {
          const rect = el.getBoundingClientRect()
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          }
        })
      },
      /**
       * 获取鼠标距离每个节点的距离
       * @param x
       * @param y
       * @return {number[]}
       */
      getItemsDistance(x, y) {
        if (this.placement === 'bottom' || this.placement === 'top') {
          return this.itemsCenterXY.map(item => {
            return Math.abs(x - item.x)
          })
        } else {
          return this.itemsCenterXY.map(item => {
            return Math.abs(y - item.y)
          })
        }
      },
      getItemsScaleRatio(x, y) {
        const distance = this.getItemsDistance(x, y)
        return distance.map(n => {
          const ratio = (this.radius - n + this.itemSize / 2) * this.scaleRatio
          // 如果节点距离在最大半径之外，不放大
          return ratio > 1 ? (ratio > 2 ? 2 : ratio) : 1
        })
      },
      getItemStyle(index) {
        const ratio = this.itemsRatio[index] || 1
        return {
          width: `${this.itemSize * ratio}px`,
          height: `${this.itemSize * ratio}px`
        }
      }
    },
    mounted() {
      this._initSortable()
    },
    beforeDestroy() {
      this.sortInstance && this.sortInstance.destroy()
      clearTimeout(this.timer)
    }
  }
</script>

<style lang="scss" scoped>
  $name: xdh-dock;
  $padding: 4px;
  .xdh-dock {
    background: rgba(0, 0, 0, 0.3);
    display: inline-block;
    border-radius: $padding;
    position: absolute;
    overflow: visible;
    padding: $padding;
    transition: all 0.2s;
    &.is-bottom {
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      .#{$name}__port {
        align-items: flex-end;
        margin-top: $padding * 2;
      }
    }
    &.is-top {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      .#{$name}__port {
        align-items: flex-start;
        margin-top: 0;
        margin-bottom: $padding * 2;
      }
    }
    &.is-left {
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      .#{$name}__port {
        flex-direction: column;
        margin-right: $padding * 2;
      }
    }

    &.is-right {
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      .#{$name}__port {
        align-items: flex-end;
        flex-direction: column;
        margin-left: $padding * 2;
      }
    }

    &__port {
      display: flex;
      min-height: 30px;
      min-width: 30px;
    }
    &__item {
      margin: $padding;
      display: inline-block;
      outline: none;
      &.sortable-ghost {
        opacity: 0;
      }
    }
    &.transition {
      .#{$name}__item {
        transition: all 0.2s;
        /deep/ * {
          transition: all 0.2s;
        }
      }
    }
  }

</style>
