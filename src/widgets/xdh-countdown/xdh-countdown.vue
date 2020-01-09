<template>
  <span>{{newTime}}</span>
</template>

<script>
  /**
   * 倒计时
   * @module widgets/xdh-countdown
   */
  export default {
    name: 'XdhCountdown',
    /**
     * 参数属性
     * @property {Function} format 默认输出格式，hh:mm:ss , 回调参数一个: 为当前剩余间隔时间毫秒
     * @property {Date} target 目标时间
     * @property {Number} [interval = 1000] 倒计时间隔 单位 ms
     */
    props: {
      // 时间格式化显示
      format: {
        type: Function,
        default(time) {
          return this.defaultFormat(time)
        }
      },
      // 目标时间
      target: [Date, Number],
      // 倒计时间隔
      interval: {
        type: Number,
        default: 1000
      }
    },

    data() {
      return {
        lastTime: 0,
        timer: null
      }
    },

    computed: {
      newTime() {
        return this.format(this.lastTime)
      }
    },
    watch: {
      target(val) {
        this.initTime()
      }
    },
    created() {
      this.initTime()
    },
    methods: {
      initTime() {
        let targetTime = 0;
        const currentTime = new Date().getTime()
        if (Object.prototype.toString.call(this.target) === '[object Date]') {
          targetTime = this.target.getTime();
        } else {
          targetTime = new Date(this.target).getTime();
        }
        let tempLastTime = targetTime - currentTime;
        this.lastTime = (tempLastTime < 0 ? 0 : tempLastTime)
        this.tick()
      },
      tick() {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          if (this.lastTime < this.interval) {
            clearTimeout(this.timer)
            this.lastTime = 0
            /**
             * 倒计时结束时触发
             * @event on-end
             */
            this.$emit('on-end')
          } else {
            this.lastTime -= this.interval
            /**
             * 倒计时跳动时触发
             * @event on-change
             * @param time 下一个显示时间毫秒
             */
            this.$emit('on-change', this.lastTime)
            this.tick()
          }
        }, this.interval);
      },
      /**
       * 默认显示格式
       * @param time
       * @returns {string}
       */
      defaultFormat(time) {
        const hours = 60 * 60 * 1000;
        const minutes = 60 * 1000;
        const fixedZero = val => {
          return val * 1 < 10 ? `0${val}` : val;
        }
        const h = Math.floor(time / hours);
        const m = Math.floor((time - h * hours) / minutes);
        const s = Math.floor((time - h * hours - m * minutes) / 1000);
        return `${fixedZero(h)}:${fixedZero(m)}:${fixedZero(s)}`
      }
    }
  }
</script>

<style scoped>
  span {
    font-size: 20px;
    color: #999999;
  }
</style>
