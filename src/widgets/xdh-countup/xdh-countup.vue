<template>
  <div></div>
</template>

<script>

  /**
   * xdh-countup
   * @module widgets/xdh-countup
   */

  import {CountUp} from 'countup.js'

  export default {
    name: 'XdhCountup',
    /**
     * 参数属性
     * @property {Boolean} [auto] 是否自动开始计数，默认为不自动开始
     * @property {Number} [startVal] 计数初始值，不限正负数，默认值为0
     * @property {Number} [value] 计数结束值，不限正负数，可以大于或者小于初始值
     * @property {Number} [decimalPlaces] 计数器数值精度。默认值为0
     * @property {Number} [duration] 计数器动画持续时间，即计数器从开始到结束的时间，单位为秒，默认值为2秒
     * @property {Boolean} [useEasing] 是否显示渐入渐出效果。默认值为显示
     * @property {Boolean} [useGrouping] 计数器是否采用带格式的值，如10,000和10000两种格式（分隔符用separator来定义），默认值为使用
     * @property {String} [separator] 分隔值的符号，默认值为‘,’（英文逗号）
     * @property {String} [decimal] 小数点的格式，当设置了decimals>0时会显示。默认为‘.’（点），可以设置为其他。
     * @property {String} [prefix] 计数器的前缀，可为任意字符
     * @property {String} [suffix] 计数器的后缀，可为任意字符
     */
    props: {
      auto: {
        type: Boolean,
        default: false
      },
      value: Number,
      startVal: {
        type: Number,
        default: 0
      },
      decimalPlaces: {
        type: Number,
        default: 0
      },
      duration: {
        type: Number,
        default: 2
      },
      useGrouping: {
        type: Boolean,
        default: true
      },
      useEasing: {
        type: Boolean,
        default: true
      },
      smartEasingThreshold: {
        type: Number
      },
      smartEasingAmount: {
        type: Number
      },
      separator: {
        type: String,
        default: ','
      },
      decimal: {
        type: String,
        default: '.'
      },
      easingFn: {
        type: Function
      },
      formattingFn: {
        type: Function
      },
      prefix: {
        type: String,
        default: ''
      },
      suffix: {
        type: String,
        default: ''
      },
      numerals: {
        type: Array
      }
    },
    data() {
      return {
        /**
         * CountUp 实例对象
         * @member counter
         * @type {CountUp}
         */
        counter: null
      }
    },
    computed: {
      options() {
        const options = {
          ...this.$props
        }
        delete options.auto
        delete options.value
        return options
      }
    },
    watch: {
      value(val) {
        this.update(val)
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init: function () {
        this.setCountUp();
        if (this.auto) {
          this.start()
        }
      },
      /**
       * 生成计数器
       */
      setCountUp: function () {
        if (this.counter) {
          this.counter = null
        }
        this.counter = new CountUp(this.$el, this.value, this.options)
      },
      /**
       * 重新启动计数器
       */
      restart() {
        this.setCountUp()
        this.start()
      },
      /**
       * 启动计数器
       */
      start() {
        this.reset()
        this.counter && this.counter.start(this.onComplete)
      },
      /**
       * 切换暂停/恢复计数器
       */
      pauseResume() {
        this.counter && this.counter.pauseResume()
      },
      /**
       * 重置计数器
       */
      reset() {
        this.counter && this.counter.reset()
      },
      /**
       * 更新计数器的结束时间
       * @param num 计数结束值
       */
      update(num) {
        if (num) {
          this.counter && this.counter.update(num)
        } else {
          this.counter && this.counter.update(this.endVal)
        }
      },
      /**
       * 计数器计数完成的回调方法
       */
      onComplete: function () {
        this.$emit('on-complete')
      }
    }
  }
</script>
