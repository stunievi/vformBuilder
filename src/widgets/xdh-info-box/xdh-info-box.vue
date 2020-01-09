<template>
  <el-card :class="`xdh-info-box ${infoBoxClass}`"
           @click.native="onClick"
           :shadow="shadow"
           :body-style="bodyStyle">
    <template v-if="type === 'smallbox'">
      <div class="xdh-info-box__inner">
        <h3>
          <xdh-countup auto
                       :decimals="decimals"
                       :start-val="0"
                       separator=","
                       :value="number"></xdh-countup>
        </h3>
        <p>{{title}}</p>
        <slot></slot>
      </div>
      <div class="xdh-info-box__icon--one">
        <i :class="icon"></i>
      </div>
      <a :href="to?'#'+to:'javascript:void(0);'" class="xdh-info-box__footer">
        {{moreText}} <i class="el-icon-d-arrow-right"></i>
      </a>
    </template>
    <template v-else>
        <span class="xdh-info-box__icon">
          <i :class="icon"></i>
        </span>
      <div class="xdh-info-box__content">
        <span class="xdh-info-box__text">{{title}}</span>
        <span class="xdh-info-box__number">
         <xdh-countup auto
                      :start-val="0"
                      :decimals="decimals"
                      separator=","
                      :value="number"></xdh-countup>
        </span>
        <slot></slot>
      </div>
    </template>
  </el-card>
</template>

<script>
  import XdhCountup from '@/widgets/xdh-countup'

  /**
   * Info Box 信息框组件
   * @module widgets/xdh-info-box
   */
  /**
   * slot
   * @member slot
   * @property 默认插入其它数据内容到卡片
   */
  export default {
    name: 'XdhInfoBox',
    components: {
      XdhCountup
    },
    /**
     * 属性参数
     * @member props
     * @property {String} title 标题
     * @property {Number} [number = 0] 数值
     * @property {String} [icon = 'el-icon-picture-outline'] 显示的字体图标 iconfont
     * @property {String} [shadow = 'always']  设置阴影显示时机,可选 always / hover / never
     * @property {Number} [decimals = 0]  数值精度到小数点后几位数
     * @property {String} type 类型,可选 default/background/smallbox
     * @property {Boolean} [gradient = false] 底色渐变,可选 true/false
     * @property {String} theme 主题,可选 default/success/warning/danger/info
     * @property {String} to 跳转目标路由
     * @property {String} [more-text = '更多'] type为smallbox 时,底部穿梭文案
     */
    props: {
      title: {
        type: String,
        default: '标题'
      },
      number: {
        type: Number,
        default: 0
      },
      icon: {
        type: String,
        default: 'el-icon-picture-outline'
      },
      shadow: {
        type: String,
        default: 'always'
      },
      decimals: {
        type: Number,
        default: 0
      },
      type: {
        type: String,
        default: ''
      },
      theme: {
        type: String,
        default: ''
      },
      gradient: {
        type: Boolean,
        default: false
      },
      to: {
        type: String,
        default: ''
      },
      moreText: {
        type: String,
        default: '更多'
      }
    },
    computed: {
      bodyStyle() {
        return {
          padding: '10px',
          'min-height': '60px',
          display: 'flex'
        }
      },
      infoBoxClass() {
        let result = ' '
        if (this.type && this.type !== 'default') result += ` xdh-info-box__${this.type}`
        if (this.theme && this.theme !== 'default') result += ` xdh-info-box__bg--${this.theme}`
        if (this.gradient) result += ` is-gradient`
        if (this.to || (this.$listeners && this.$listeners['on-click'])) result += ` click`
        return result
      }
    },
    methods: {
      onClick() {
        /**
         * 点击事件
         * @event on-click
         */
        this.$emit('on-click')
        if (this.$router && this.to) this.$router.push(this.to)
      }
    }
  }
</script>

