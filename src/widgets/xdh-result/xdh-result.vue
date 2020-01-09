<template>
  <div class="xdh-result">
    <div class="xdh-result__type" v-if="type">
      <i :class="'el-icon-'+type"></i>
    </div>
    <div class="xdh-result__title" v-if="title">{{title}}</div>
    <div class="xdh-result__description" v-if="description">{{description}}</div>
    <div class="xdh-result__extra" v-if="$slots['extra']">
      <slot name="extra"></slot>
    </div>
    <div class="xdh-result__actions" v-if="$slots['actions']">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
  /**
   * 处理结果
   * @module widgets/xdh-result
   * @author 潘浩玮
   */

  /**
   * 插槽
   * @member slots
   * @property {string} extra 额外内容
   * @property {string} actions 操作区域内容
   */

  /**
   * @export
   */
  export default {
    name: 'XdhResult',
    /**
     * 属性参数
     * @property {String} [type] 处理结果的类型：success（成功）、error（失败）。默认为成功
     * @property {String} [title] 处理结果的标题
     * @property {String} [description] 处理结果的结果描述
     */
    props: {
      type: {
        type: String,
        validator(val) {
          return ['success', 'error'].includes(val)
        },
        default: 'success'
      },
      title: {
        type: String
      },
      description: {
        type: String
      }
    }
  }
</script>
