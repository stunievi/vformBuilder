<template>
  <el-row :class="classes"
          :type="type"
          :gutter="gutter"
          :justify="justify">
    <el-col :span="span" :key="index" class="xdh-list__item" v-for="(item,index) in data">
      <slot :item="item" :index="index"></slot>
    </el-col>
  </el-row>
</template>

<script>
  /**
   * 列表组件
   * @module widgets/xdh-list
   * @author 潘浩玮
   */

  /**
   * 插槽
   * @member slots
   * @property {string} default 列表项内容
   */

  /**
   * @export
   */
  export default {
    name: 'XdhList',
    /**
     * 属性参数
     * @property {Array} [data] 数据源
     * @property {Boolean} [bordered=false] 是否显示外边框
     * @property {String} [layout=vertical] 设置成 horizontal 则横向样式显示, 设置成 vertical 则竖直样式显示, 默认竖排
     * @property {String} [size=medium] list 的尺寸,包括'mini', 'small', 'medium'
     * @property {Boolean} [split=true] 是否展示分割线
     * @property {Number} [gutter=0] 栅格间隔
     * @property {Number} [column=1] 列数
     * @property {String} [justify='start'] flex 布局下的水平排列方式，搭配type使用
     * @property {String} [type] 布局模式，可选 flex，现代浏览器下有效
     *
     */
    props: {
      data: {
        type: Array,
        required: true
      },
      bordered: {
        type: Boolean,
        default: false
      },
      layout: {
        type: String,
        validator(val) {
          return ['vertical', 'horizontal'].includes(val)
        },
        default: 'vertical'
      },
      size: {
        type: String,
        validator(val) {
          return ['mini', 'small', 'medium'].includes(val)
        },
        default: 'medium'
      },
      split: {
        type: Boolean,
        default: true
      },
      gutter: {
        type: Number,
        default: 0
      },
      column: {
        type: Number,
        default: 1
      },
      justify: {
        type: String,
        validator(val) {
          return ['start', 'end', 'center', 'space-around', 'space-between'].includes(val)
        },
        default: 'start'
      },
      type: {
        type: String,
        default: null
      }
    },
    computed: {
      span() {
        if (this.layout === 'vertical') {
          return 24
        } else {
          return 24 / this.column
        }
      },
      classes() {
        return [
          'xdh-list--' + this.layout,
          'xdh-list--' + this.size,
          {'xdh-list--bordered': this.bordered, 'xdh-list--split': this.split}
        ]
      }
    }
  }
</script>
