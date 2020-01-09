<template>
  <div :class="`xdh-skeleton ${skeletonClass}`">
    <template v-if="loading">
      <div class="xdh-skeleton-header" v-if="avatar">
        <span :class="`xdh-skeleton-avatar ${avatarClass}`"></span>
      </div>
      <div class="xdh-skeleton-content" v-if="title||paragraph">
        <h3 :class="`xdh-skeleton-title ${titleClass}`" v-if="title"
            :style="`width: ${title.width||'50%'}`"></h3>
        <ul class="xdh-skeleton-paragraph" v-if="paragraph">
          <li v-for="item in paragraphRows" :key="item"
              :style="`width: ${paragraphWidth(item)}`"></li>
        </ul>
      </div>
    </template>
    <slot v-else></slot>
  </div>
</template>

<script>
  /**
   * XdhSkeleton 加载占位图
   * @module widgets/xdh-skeleton
   */

  /**
   * 插槽
   * @member slots
   * @property {string} '' 默认插槽，存放占位数据节点
   */
  export default {
    name: 'XdhSkeleton',
    mixins: [],
    components: {},
    /**
     * 属性参数
     * @member props
     * @property {Boolean} loading 为 true 时，显示占位图。反之则直接展示子组件
     * @property {Boolean} [active = true] 是否展示动画效果
     * @property {Boolean/Object} [avatar = false] 是否显示头像占位图
     * @property {String} [avatar.size = 'default'] 设置头像占位图的大小  'large', 'small', 'default'
     * @property {String} [avatar.shape = 'circle'] 指定头像的形状  'circle', 'square'
     * @property {Boolean/Object} [title = true] 是否显示标题占位图
     * @property {String} title.width 设置标题占位图的宽度
     * @property {Boolean/Object} [paragraph = true] 是否显示段落占位图
     * @property {Number} [paragraph.rows = 3] 设置段落占位图的行数
     * @property {String/Array} paragraph.width 设置段落占位图的宽度，若为数组时则为对应的每行宽度，反之则是最后一行的宽度
     */
    props: {
      loading: Boolean,
      active: {
        type: Boolean,
        default: true
      },
      avatar: {
        type: [Boolean, Object],
        default: false
      },
      title: {
        type: [Boolean, Object],
        default: true
      },
      paragraph: {
        type: [Boolean, Object],
        default: true
      }
    },
    data() {
      return {}
    },
    computed: {
      paragraphRows() {
        return this.paragraph.rows || 3
      },
      skeletonClass() {
        let result = ' '
        if (this.avatar) result += ' xdh-skeleton-with-avatar'
        if (this.active) result += ' xdh-skeleton-active'
        return result
      },
      avatarClass() {
        let result = ` xdh-skeleton-avatar-${this.avatar.size || 'default'} xdh-skeleton-avatar-${this.avatar.shape || 'circle'}`
        return result
      },
      titleClass() {
        let result = ` xdh-skeleton-title-${this.avatar.size || 'default'}`
        return result
      }
    },
    watch: {},
    methods: {
      paragraphWidth(index) {
        let result = '100%'
        if (Array.isArray(this.paragraph.width)) {
          result = this.paragraph.width[index - 1]
        } else if (index === this.paragraphRows) {
          result = this.paragraph.width
        }
        return result || '100%'
      }
    },
    created() {
    },
    mounted() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">

</style>
