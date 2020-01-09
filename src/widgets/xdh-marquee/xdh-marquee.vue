<template>
  <div ref="wrap" class="xdh-marquee">
    <div :style="leftSwitch" v-if="isHorizontal" :class="leftSwitchClass" @click="leftSwitchClick">
      <slot name="left-switch"></slot>
    </div>
    <div :style="rightSwitch" v-if="isHorizontal" :class="rightSwitchClass" @click="rightSwitchClick">
      <slot name="right-switch"></slot>
    </div>
    <div ref="realBox" :style="pos" @mouseenter="enter" @mouseleave="leave" @touchstart="touchStart"
         @touchmove="touchMove" @touchend="touchEnd">
      <div ref="slotList" :style="float">
        <slot></slot>
      </div>
      <div v-html="copyHtml" :style="float"></div>
    </div>
  </div>
</template>

<script>
  /**
   * XdhMarquee 无缝滚动组件
   * @module widgets/xdh-marquee
   */

  import {arrayEqual} from '../../utils/convert'
  import {requestAnimationFrame, cancelAnimationFrame} from '../../utils/util'

  export default {
    name: 'XdhMarquee',
    /**
     * props 属性参数
     * @member props
     * @property {Array} [data] 滚动内容数据
     * @property {Object} [option] 配置参数
     * @property {Number} [option.step=1] 滚动速度，数值约大速度越快
     * @property {Number} [option.limitMoveNum=5] 开始滚动的最小数据长度
     * @property {Boolean} [option.hoverStop=true] 鼠标经过是否停止滚动
     * @property {Number} [option.direction=1] 滚动方向，0：下，1：上，2：左，3：右
     * @property {Boolean} [option.openTouch=true] 是否开启移动端触摸事件
     * @property {Number} [option.singleHeight=0] 上下滚动时，设置间隔停顿滚动的距离
     * @property {Number} [option.singleWidth=0] 左右滚动时，设置间隔停顿滚动的距离
     * @property {Number} [option.waitTime=1000] 间隔停顿等待时间
     * @property {Number} [option.switchOffset=30] 左右切换按钮离左右两侧的距离
     * @property {Boolean} [option.autoPlay=true] 是否自动开始滚动，手动切换时需要设置为false
     * @property {Number} [option.switchSingleStep=134] the size of a single step switch (px)
     * @property {Number} [option.switchDelay=400] the animation time of a single step switch(ms)
     * @property {String} [option.switchDisabledClass=disabled] the className of the switch parent element that cannot be clicked
     * @property {Boolean} [option.isSingleRemUnit=false] singleHeight and singleWidth Whether to enable the rem metric
     */
    props: {
      data: {
        type: Array,
        default: () => {
          return []
        }
      },
      option: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        xPos: 0,
        yPos: 0,
        delay: 0,
        copyHtml: '',
        height: 0,
        width: 0, // 外容器宽度
        realBoxWidth: 0, // 内容实际宽度
        reqFrame: null, // move动画的animationFrame定时器
        singleWaitTime: null, // single 单步滚动的定时器
        isHover: false // mouseenter mouseleave 控制this._move()的开关
      }
    },
    computed: {
      leftSwitchState() {
        return this.xPos < 0
      },
      rightSwitchState() {
        return Math.abs(this.xPos) < (this.realBoxWidth - this.width)
      },
      leftSwitchClass() {
        return this.leftSwitchState ? '' : this.options.switchDisabledClass
      },
      rightSwitchClass() {
        return this.rightSwitchState ? '' : this.options.switchDisabledClass
      },
      leftSwitch() {
        return {
          position: 'absolute',
          margin: `${this.height / 2}px 0 0 -${this.options.switchOffset}px`,
          transform: 'translate(-100%,-50%)'
        }
      },
      rightSwitch() {
        return {
          position: 'absolute',
          margin: `${this.height / 2}px 0 0 ${this.width + this.options.switchOffset}px`,
          transform: 'translateY(-50%)'
        }
      },
      float() {
        return this.isHorizontal ? {float: 'left', overflow: 'hidden'} : {overflow: 'hidden'}
      },
      pos() {
        return {
          transform: `translate(${this.xPos}px,${this.yPos}px)`,
          transition: `all ${this.ease || 'ease-in'} ${this.delay}ms`,
          overflow: 'hidden'
        }
      },
      defaultOption() {
        return {
          // 步长
          step: 1,
          // 启动无缝滚动最小数据数
          limitMoveNum: 5,
          // 是否启用鼠标hover控制
          hoverStop: true,
          // 0 往下 1 往上 2向左 3向右
          direction: 1,

          // 开启移动端touch
          openTouch: true,

          // 单条数据高度有值hoverStop关闭
          singleHeight: 0,

          // 单条数据宽度有值hoverStop关闭
          singleWidth: 0,

          // 单步停止等待时间
          waitTime: 1000,
          switchOffset: 30,
          autoPlay: true,
          switchSingleStep: 134,
          switchDelay: 400,
          switchDisabledClass: 'disabled',

          // singleWidth/singleHeight 是否开启rem度量
          isSingleRemUnit: false
        }
      },
      options() {
        return Object.assign({}, this.defaultOption, this.option)
      },
      moveSwitch() {
        return this.data.length < this.options.limitMoveNum
      },
      hoverStop() {
        return !this.options.autoPlay || !this.options.hoverStop || this.moveSwitch
      },
      canNotTouch() {
        return !this.options.openTouch || !this.options.autoPlay
      },
      isHorizontal() {
        return this.options.direction > 1 || !this.options.autoPlay
      },
      baseFontSize() {
        return this.options.isSingleRemUnit ? parseInt(window.getComputedStyle(document.documentElement, null).fontSize) : 1
      },
      realSingleStopWidth() {
        return this.options.singleWidth * this.baseFontSize
      },
      realSingleStopHeight() {
        return this.options.singleHeight * this.baseFontSize
      }
    },
    methods: {
      leftSwitchClick() {
        if (!this.leftSwitchState) return
        // 小于单步距离
        if (Math.abs(this.xPos) < this.options.switchSingleStep) {
          this.xPos = 0
          return
        }
        this.xPos += this.options.switchSingleStep
      },
      rightSwitchClick() {
        if (!this.rightSwitchState) return
        // 小于单步距离
        if ((this.realBoxWidth - this.width + this.xPos) < this.options.switchSingleStep) {
          this.xPos = this.width - this.realBoxWidth
          return
        }
        this.xPos -= this.options.switchSingleStep
      },
      _cancle() {
        cancelAnimationFrame(this.reqFrame || '')
      },
      touchStart(e) {
        if (this.canNotTouch) return
        let timer
        // touches数组对象获得屏幕上所有的touch，取第一个touch
        const touch = e.targetTouches[0]
        // 取第一个touch的坐标值
        this.startPos = {
          x: touch.pageX,
          y: touch.pageY
        }
        // 记录touchStart时候的posY
        this.startPosY = this.yPos
        // 记录touchStart时候的posX
        this.startPosX = this.xPos
        if (!!this.options.singleHeight && !!this.options.singleWidth) {
          if (timer) clearTimeout(timer)
          timer = setTimeout(() => {
            this._cancle()
          }, this.options.waitTime + 20)
        } else {
          this._cancle()
        }
      },
      touchMove(e) {
        // 当屏幕有多个touch或者页面被缩放过，就不执行move操作
        if (this.canNotTouch || e.targetTouches.length > 1 || e.scale && e.scale !== 1) return
        const touch = e.targetTouches[0]
        this.endPos = {
          x: touch.pageX - this.startPos.x,
          y: touch.pageY - this.startPos.y
        }
        // 阻止触摸事件的默认行为，即阻止滚屏
        event.preventDefault();
        // dir，1表示纵向滑动，0为横向滑动
        const dir = Math.abs(this.endPos.x) < Math.abs(this.endPos.y) ? 1 : 0
        // 表示纵向滑动 && 运动方向为上下
        if (dir === 1 && this.options.direction < 2) {
          this.yPos = this.startPosY + this.endPos.y
          // 为横向滑动 && 运动方向为左右
        } else if (dir === 0 && this.options.direction > 1) {
          this.xPos = this.startPosX + this.endPos.x
        }
      },
      touchEnd() {
        if (this.canNotTouch) return
        let timer
        const direction = this.options.direction
        this.delay = 50
        if (direction === 1) {
          if (this.yPos > 0) this.yPos = 0
        } else if (direction === 0) {
          let h = this.$refs.realBox.offsetHeight / 2 * -1
          if (this.yPos < h) this.yPos = h
        } else if (direction === 2) {
          if (this.xPos > 0) this.xPos = 0
        } else if (direction === 3) {
          let w = this.$refs.slotList.offsetWidth * -1
          if (this.xPos < w) this.xPos = w
        }
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          this.delay = 0
          this._move()
        }, this.delay)
      },
      enter() {
        if (this.hoverStop) return
        // 关闭_move
        this.isHover = true
        // 防止蛋疼的人频频hover进出单步滚动 导致定时器乱掉
        if (this.singleWaitTime) clearTimeout(this.singleWaitTime)
        this._cancle()
      },
      leave() {
        if (this.hoverStop) return
        // 开启_move
        this.isHover = false
        this._move()
      },
      _move() {
        // 鼠标移入时拦截_move()
        if (this.isHover) return
        // 进入move立即先清除动画 防止频繁touchMove导致多动画同时进行
        this._cancle()
        this.reqFrame = requestAnimationFrame(
          function () {
            // fixed 路由之间切换报this.$refs.realBox.offsetHeigh undefined bug
            if (!this.$refs.realBox) return
            // 实际高度
            const h = this.$refs.realBox.offsetHeight / 2
            // 宽度
            const w = this.$refs.slotList.offsetWidth
            // 滚动方向
            const direction = this.options.direction
            // 上
            if (direction === 1) {
              if (Math.abs(this.yPos) >= h) this.yPos = 0
              this.yPos -= this.options.step
              // 下
            } else if (direction === 0) {
              if (this.yPos >= 0) this.yPos = h * -1
              this.yPos += this.options.step
              // 左
            } else if (direction === 2) {
              if (Math.abs(this.xPos) >= w) this.xPos = 0
              this.xPos -= this.options.step
              // 右
            } else if (direction === 3) {
              if (this.xPos >= 0) this.xPos = w * -1
              this.xPos += this.options.step
            }
            if (this.singleWaitTime) clearTimeout(this.singleWaitTime)
            // 是否启动了单行暂停配置
            if (!!this.realSingleStopHeight) {
              // 符合条件暂停waitTime
              if (Math.abs(this.yPos) % this.realSingleStopHeight < 1) {
                this.singleWaitTime = setTimeout(() => {
                  this._move()
                }, this.options.waitTime)
              } else {
                this._move()
              }
              // 符合条件暂停waitTime
            } else if (!!this.realSingleStopWidth) {
              if (Math.abs(this.xPos) % this.realSingleStopWidth < 1) {
                this.singleWaitTime = setTimeout(() => {
                  this._move()
                }, this.options.waitTime)
              } else {
                this._move()
              }
            } else {
              this._move()
            }
          }.bind(this)
        )
      },
      _initMove() {
        this.$nextTick(() => {
          this.height = this.$refs.wrap.offsetHeight
          this.width = this.$refs.wrap.offsetWidth
          // 水平滚动设置warp width
          if (this.isHorizontal) {
            let rate
            if (!this.options.autoPlay) {
              rate = 1
            } else {
              rate = 2
            }
            const w = this.$refs.slotList.offsetWidth * rate
            this.$refs.realBox.style.width = w + 'px'
            this.realBoxWidth = w
          }
          if (!this.options.autoPlay) {
            this.ease = 'linear'
            this.delay = this.options.switchDelay
            return
          }
          this._dataWarm(this.data)
          // 清空copy
          this.copyHtml = ''
          // 是否可以滚动判断
          if (this.moveSwitch) {
            this._cancle()
            this.yPos = this.xPos = 0
          } else {
            let timer
            if (timer) clearTimeout(timer)
            this.copyHtml = this.$refs.slotList.innerHTML
            this._move()
          }
        })
      },
      _dataWarm(data) {
        if (data.length > 100) {
          console.warn(`数据达到了${data.length}条有点多哦~,可能会造成部分老旧浏览器卡顿。`);
        }
      }
    },
    mounted() {
      this._initMove()
    },
    watch: {
      data(newData, oldData) {
        this._dataWarm(newData)
        // 监听data是否有变更
        if (!arrayEqual(newData, oldData)) {
          this._cancle()
          this._initMove()
        }
      }
    },
    beforeDestroy() {
      this._cancle()
    }
  }
</script>
