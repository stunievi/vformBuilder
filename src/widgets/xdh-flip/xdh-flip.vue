<template>
  <div :class="`xdh-flip xdh-flip__${size}`" :style="{fontSize:fontSize}">
    <div :class="{'xdh-flip__set':true,'xdh-flip-previous':previous}">
      <div class="xdh-flip__top" :style="innerStyles">
        <span class="xdh-flip__wrap">{{oldNumber}}</span>
      </div>
      <div class="xdh-flip__shadow-top"></div>
      <div class="xdh-flip__bottom" :style="innerStyles">
        <span class="xdh-flip__wrap" :style="bottomWrapStyle">{{oldNumber}}</span>
      </div>
      <div class="xdh-flip__shadow-bottom"></div>
    </div>

    <div :class="{'xdh-flip__set':true,'xdh-flip-active':active}">
      <div class="xdh-flip__top" :style="innerStyles">
        <span class="xdh-flip__wrap">{{newNumber}}</span>
      </div>
      <div class="xdh-flip__shadow-top"></div>
      <div class="xdh-flip__bottom" :style="innerStyles">
        <span class="xdh-flip__wrap" :style="bottomWrapStyle">{{newNumber}}</span>
      </div>
      <div class="xdh-flip__shadow-bottom"></div>
    </div>
  </div>
</template>

<script>
  /**
   * 翻牌时钟效果
   * @module widgets/xdh-flip
   * @author 潘浩玮
   */
  export default {
    name: 'XdhFlip',
    /**
     * 属性参数
     * @property {String|Number} [number] 需显示的数字，只能为0-9的正整数
     * @property {String} [color] 卡片的背景色
     * @property {String} [fontSize] 卡片字体的大小
     * @property {String} [size] 卡片的宽度
     */
    props: {
      number: {
        type: [String, Number],
        required: true,
        validator: function (val) {
          return /^[0-9]$/.test(Number.parseInt(val))
        }
      },
      color: {
        type: String,
        default: '#333'
      },
      fontSize: {
        type: String
      },
      size: {
        type: String,
        validator(val) {
          return ['mini', 'small', 'medium'].includes(val)
        },
        default: 'medium'
      }
    },
    computed: {
      /**
       * 改变整个数字翻页的背景颜色
       */
      innerStyles() {
        return {
          backgroundColor: this.color
        }
      }
    },
    data() {
      return {
        previous: true,
        active: true,
        timer: null,
        newNumber: null,
        oldNumber: null,
        bottomWrapStyle: null
      }
    },
    watch: {
      number: {
        handler(newNumber, oldNumber) {
          this.previous = false
          this.active = false
          this.timer = setTimeout(() => {
            this.newNumber = newNumber
            this.oldNumber = oldNumber
            this.previous = true
            this.active = true
          }, 10)
        },
        immediate: true
      },
      size(val) {
        // 修改因改变整个数字翻页的宽高引起的下层数字的显示问题
        this.bottomWrapStyle = {
          marginTop: '-' + this.$el.clientHeight / 2 + 'px'
        }
      }
    },
    mounted() {
      this.bottomWrapStyle = {marginTop: '-' + this.$el.clientHeight / 2 + 'px'}
    },
    beforeDestroy() {
      window.clearTimeout(this.timer)
    }
  }
</script>
