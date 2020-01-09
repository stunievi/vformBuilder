<template>
  <div class="xdh-image-text" :class="classes">
    <div class="xdh-image-text__img" :class="imageClass">
      <slot name="image"></slot>
    </div>
    <div class="xdh-image-text__txt" :style="textStyle">
      <slot name="text"></slot>
    </div>
  </div>
</template>

<script>
  /**
   *  图文混排组件
   *  @module widgets/xdh-image-text
   */

  /**
   * 插槽 slots
   * @member slots
   * @property {string} image 定义图表区域内容
   * @property {string} text 定义文本区域内容
   */

  export default {
    name: 'XdhImageText',
    /**
     * 属性参数
     * @property {String} [imagePlace=left] 图片放置位置, 可选值：left、right、top
     * @property {String} [imageWidth] 图片宽度。imagePlace 为left 或 right ，wrap为false时，需要设置 imageWidth
     * @property {Boolean} [wrap=true] 文字是否围绕图片
     */
    props: {
      // 图表相对文字的位置
      imagePlace: {
        type: String,
        default: 'left',
        validator(val) {
          return ['left', 'right', 'top'].includes(val)
        }
      },
      // imagePlace 为left 或 right ，wrap为false时，需要设置 imageWidth
      imageWidth: {
        type: String
      },
      // 文字是否围绕图片
      wrap: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {}
    },
    computed: {
      classes() {
        return [
          `xdh-image-text--${this.imagePlace}`,
          {
            'xdh-image-text--wrap': this.wrap
          }
        ]
      },
      imageClass() {
        return {
          'xdh-image-text--wrap': this.wrap
        }
      },
      textStyle() {
        if (this.wrap) {
          return null
        }
        let style = {}
        switch (this.imagePlace) {
          case 'left':
            style.paddingLeft = this.imageWidth
            break
          case 'right':
            style.paddingRight = this.imageWidth
            break
        }
        return style
      }
    }
  }
</script>

<style lang="scss">
  .xdh-image-text {
    display: inline-block;
    vertical-align: top;

    &__txt {
      line-height: 1.5em;
    }
    &--left {
      .xdh-image-text--wrap {
        margin-right: 10px;
        margin-bottom: 10px;
      }
      .xdh-image-text__img {
        float: left;
      }

    }
    &--top {
      .xdh-image-text__img {
        margin-bottom: 10px;
      }
    }
    &--right {
      .xdh-image-text--wrap {
        margin-left: 10px;
        margin-bottom: 10px;
      }
      .xdh-image-text__img {
        float: right;
      }
    }
  }
</style>
