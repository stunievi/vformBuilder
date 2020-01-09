<template>
  <div class="xdh-ellipsis">
    <el-tooltip ref="tooltip"
                v-bind="tooltipProps">

      <div class="xdh-ellipsis__tooltip--content"
           slot="content"
           v-if="subContent"
           v-html="subContent">
      </div>

    </el-tooltip>

    <div ref="content"
         class="xdh-ellipsis__content"
         :style="`-webkit-line-clamp: ${lines}`"
         @mouseenter="handleMouseEnter"
         @mouseleave="handleMouseLeave">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  /**
   * ellipsis 组件
   * @module widgets/xdh-ellipsis
   */
  /**
   * // 使用说明
   *  <xdh-ellipsis></xdh-ellipsis> 因为是省略文本，只允许有一个根节点
   */
  import ElTooltip from 'element-ui/lib/tooltip'
  import {debounce} from '@/utils/util'

  /**
   * 插槽
   * @member slots
   * @property {string} default 文本内容
   */

  /**
   * @export
   */
  export default {
    name: 'XdhEllipsis',
    /**
     * 属性参数，完全继承 el-tooltip参数，并有以下扩展参数
     * @property {number} [lines = 1] 限制显示行数
     */
    props: {
      ...ElTooltip.props,
      lines: {
        type: Number,
        default: 1
      }
    },
    computed: {
      tooltipProps() {
        let props = {...this.$props}
        delete props.lines
        // 如果没有设置位置，默认设为top
        if (!props.placement) props.placement = 'top'
        return props
      },
      subContent() {
        // 如果没有传入content则直接读取用户传入的默认插槽作为content值
        if (!this.tooltipProps.content) {
          if (this.$slots.default[0].tag) {
            return this.tooltipContent
          } else {
            return this.$slots.default[0].text
          }
        }

        return null;
      }
    },
    data() {
      return {
        tooltipContent: ''
      }
    },
    updated() {
      this.tooltipContent = this.$slots.default[0].elm.outerHTML
    },
    methods: {
      handleMouseEnter() {
        const content = this.$refs.content

        const range = document.createRange()
        range.setStart(content, 0)
        range.setEnd(content, content.childNodes.length)
        const rangeHeight = range.getBoundingClientRect().height;

        if (rangeHeight > content.offsetHeight || content.scrollHeight > content.offsetHeight) {
          const tooltip = this.$refs.tooltip
          tooltip.referenceElm = content
          tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none');
          tooltip.doDestroy()
          tooltip.setExpectedState(true)
          this.activateTooltip(tooltip)
        }
      },
      handleMouseLeave() {
        const tooltip = this.$refs.tooltip
        if (tooltip) {
          tooltip.setExpectedState(false)
          tooltip.handleClosePopper()
        }
      }
    },
    mounted() {
      this.tooltipContent = this.$slots.default[0].elm.outerHTML
      this.activateTooltip = debounce(tooltip => tooltip.handleShowPopper(), 50, false, this);
    }
  }
</script>

<style lang="scss" scoped>
  .xdh-ellipsis {
    &__content {
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
</style>


