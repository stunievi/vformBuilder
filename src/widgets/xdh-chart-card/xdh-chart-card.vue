<template>
  <el-card class="xdh-chart-card" :shadow="shadow">
    <div class="xdh-chart-card__header" slot="header" name="header">
      <span class="xdh-chart-card__title">{{title}}</span>
      <span class="xdh-chart-card__action" v-if="$slots.action">
          <slot name="action"></slot>
      </span>
    </div>
    <div class="xdh-chart-card__total" v-if="total">{{total}}</div>

    <div class="xdh-chart-card__body"
         :style="{height:contentHeight}"
         v-if="$slots.default">
      <slot></slot>
    </div>

    <div class="xdh-chart-card__footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </el-card>
</template>

<script>
  /**
   * 图表卡片
   * @module widgets/xdh-chart-card
   * @author 潘浩玮
   */

  /**
   * 插槽
   * @member slots
   * @property {string} header 卡片头部内容
   * @property {string} action 卡片头部右侧操作内容
   * @property {string} default 卡片主体内容
   * @property {string} footer 卡片底部内容
   */

  /**
   * @export
   */
  export default {
    name: 'XdhChartCard',
    /**
     * 属性参数
     * @property {String} [title] 图表标题
     * @property {String} [total] 图表总数
     * @property {String} [shadow] 卡片阴影
     * @property {String} [contentHeight] 内容高度
     */
    props: {
      title: {
        type: String
      },
      total: {
        type: String
      },
      shadow: {
        type: String,
        validator(val) {
          return ['always', 'hover', 'never'].includes(val)
        },
        default: 'always'
      },
      contentHeight: {
        type: String,
        default: 'auto'
      }
    },
    computed: {}
  }
</script>

