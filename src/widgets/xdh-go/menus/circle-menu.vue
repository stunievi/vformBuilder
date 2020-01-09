<template>
  <div :class="{'circle-menus': true, 'fixed': fixed}" :style="menuStyle">
    <div class="center-mask" :style="maskStyle" @click="hide()">
      <slot name="center-btn" :menuList="menuList" :menuLevels="menuLevels"></slot>
    </div>
    <div
      :class="{'circle-menu': true, 'opened': level.opened}"
      v-for="(level, levelIndex) in menuLevels"
      :key="levelIndex"
      :style="`
        width: ${level.menuWidth}px;
          height: ${level.menuWidth}px;
          margin-top: ${-level.liWidth+fixedOffset}px;
          margin-left: ${-level.liWidth+fixedOffset}px;
          z-index: ${level.zIndex};
        `"
    >
      <ul>
        <li
          v-for="(item, idx) in level.menuList"
          v-if="!item.disabled"
          :key="idx"
          @mouseenter="cxcommand($event, item, level, idx)"
          @click="cxcommand($event, item, level, idx)"
          @mouseleave="cxcommand($event, item, level, idx)"
          :style="!level.opened?
           `
            transform: rotate(${level.centerAngle - level.itemAngle/2}deg) skew(${90 - level.itemAngle + 1}deg);
            width:${level.liWidth}px;
            height:${level.liWidth}px;
            margin-left: -${level.liWidth}px;
            `
          :`
            transform: rotate(${level.start + idx*level.itemAngle}deg) skew(${90 - level.itemAngle + 1}deg);
            width:${level.liWidth}px;
            height:${level.liWidth}px;
            margin-left: -${level.liWidth}px;
            `"
        >
          <a
            class="item-content"
            :style="`
              background: radial-gradient(transparent ${level.innerRadius}px, ${activeMenus.includes('item_'+item[itemKey])?activeColor:(hoverItem === ('item_' +item[itemKey])?comHoverColor:normalColor)} ${level.innerRadius}px);
              width: ${level.menuWidth}px;
              height: ${level.menuWidth}px;
              right: -${level.liWidth}px;
              bottom: -${level.liWidth}px;
              transform: skew(-${90 - level.itemAngle + 1}deg) rotate(-${90 - level.itemAngle / 2}deg) scale(1);
              `"
          >
            <slot name="list-item" :item="item">
              <a
                href="#"
                target="_self"
                class="item-text"
                :style="Object.assign({},{'line-height': itemWidth + 'px'},itemStyle)"
              >{{item[propMap.text]}}</a>
            </slot>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
/**
   * 圆形菜单组件
   * @module widgets/xdh-go/menus/circle-menu
   * @example
   * // with go-menu in gojs
   *  <go-menu ref="menu1">
          <circle-menu
          :menu-list="listData1"
          @item-click="itemClick">
          </circle-menu>
      </go-menu>
      // single use
       <circle-menu ref="menu1"
          :menu-list="listData1"
          @item-click="itemClick">
       </circle-menu>
       don't forget to show after mounted
       mounted() {
         this.$refs.menu1.show();
       }
   */
/**
 * 插槽
 * @member slots
 * @property {String} 'list-item' 菜单项
 * @property {String} 'center-btn' 中心功能按钮
 */
export default {
  /**
   * 属性参数
   * @property {Array} [angleRange =  [-30, 210]]  扇形开始位置和结束位置
   * @property {Object} [propMap = {text: 'text', subMenu: 'subMenu'}] 参数配置
   * @property {String} [itemKey = 'text'] 菜单的每个菜单项需要有唯一标识，默认为text字段,
   *                                       有时你不想显示文本，只想显示图标，那么需要指定一个字段作为唯一标识
   * @property {Number} [innerRadius = 60] 扇形内径大小
   * @property {Number} [itemWidth = 100] 扇形菜单项圈径
   * @property {Boolean} [subRangeLimit] 子菜单的角度范围限制在所设的angleRange范围内,
   *                                     如果菜单要放在角落里，这个限制是有必要的
   * @property {String} [trigger = 'click'] 子菜单触发事件 ['click'|'mouseover']
   * @property {Array} [menuList = []] 菜单选项列表
   * @property {String} [itemStyle = {color: '#fff'} ] 菜单项文字样式
   * @property {String} [activeColor='rgba(255, 102, 0, 0.5)'] 菜单项选中状态颜色
   * @property {String} [normalColor = 'rgba(140, 197, 255, 0.8)'] 菜单项非选中状态颜色
   * @property {String} [hoverColor = ''] 菜单项鼠标经过颜色，不设置与选中一样
   * @property {Boolean} [fixed = false] 设置成true时，不再作为弹出菜单，而是跟随文档流布局
   */
  props: {
    angleRange: {
      type: Array,
      default() {
        return [-30, 210]
      }
    },
    propMap: {
      type: Object,
      default() {
        return {
          text: 'text',
          subMenu: 'subMenu'
        }
      }
    },
    itemKey: {
      type: String,
      default: 'text'
    },
    innerRadius: {
      type: Number,
      default: 60
    },
    itemWidth: {
      type: Number,
      default: 100
    },
    subRangeLimit: Boolean,
    trigger: {
      type: String,
      default: 'click'
    },
    menuList: {
      type: Array,
      default() {
        return []
      }
    },
    itemStyle: {
      type: Object,
      default() {
        return {
          color: '#333'
        }
      }
    },
    activeColor: {
      type: String,
      default: 'rgba(255, 102, 0, 0.5)'
    },
    normalColor: {
      type: String,
      default: 'rgba(140, 197, 255, 0.8)'
    },
    hoverColor: {
      type: String,
      default: ''
    },
    fixed: {
      type: Boolean
    }
  },
  computed: {
    comHoverColor() {
      return this.hoverColor || this.activeColor
    },
    menuStyle() {
      return this.fixed
        ? `width: ${(this.innerRadius + this.itemWidth) * 2}px;
          height: ${(this.innerRadius + this.itemWidth) * 2}px;
          `
        : ''
    },
    fixedOffset() {
      let offset = this.innerRadius + this.itemWidth
      return this.fixed ? offset : 0
    },
    maskStyle() {
      return `
          width:${this.innerRadius * 2}px;
          height:${this.innerRadius * 2}px;
          margin-left: ${-this.innerRadius + this.fixedOffset}px;
          margin-top: ${-this.innerRadius + this.fixedOffset}px;
          `
    }
  },
  watch: {
    menuList: {
      deep: true,
      immediate: true,
      handler(menu) {
        this.resetMenu()
      }
    },
    innerRadius(val) {
      this.resetMenu()
    },
    itemWidth(val) {
      this.resetMenu()
    }
  },
  data() {
    return {
      // 用来记录当前菜单路径
      activeMenus: [],
      // 根据菜单层次记录菜单[{level0: {item_root: [...]}]
      menuMap: {},
      // 当前展示的菜单，通过v-for生成，通过pop和push切换菜单
      menuLevels: [],
      // 菜单选项配置
      tPropMap: {
        text: 'text',
        subMenu: 'subMenu'
      },
      triggerMap: {
        click: ['click'],
        mouseover: ['mouseenter']
      },
      hoverItem: ''
    }
  },
  methods: {
    /**
     * 弹出时或者菜单消失时初始化菜单，通常要在go-menu中调用
     * @function resetMenu
     */
    resetMenu() {
      this.calList(this.menuList, 0, 'root')
      this.initLevels()
      this.activeMenus = []
    },
    // 初始化根菜单
    initLevels() {
      this.menuLevels = [
        {
          ...this.menuMap['level0'],
          menuList: this.menuMap['level0']['item_root'],
          ...this.calCircle(this.menuMap['level0']['item_root'])
        }
      ]
      this.$nextTick(() => {
        setTimeout(() => {
          this.menuLevels[0].opened = true
        }, 210)
      })
    },
    /**
     * 计算得出根菜单或子菜单的起始角度，圈径等数据
     * @function calCircle
     * @param {Array} [arr] 菜单数组
     * @param {Object} [level] 可省，当前点击级别的相关数据，省略时为根菜单
     * @param {Number} [index] 可省，当前点击菜单项的下标值
     */
    calCircle(arr, level, index) {
      let length = arr.length
      let angleRange, innerRadius, prevLevelCenterAngle
      // 当level为空时计算的是根菜单
      if (!level) {
        if (this.angleRange instanceof Array && this.angleRange.length === 2) {
          angleRange = this.angleRange
          innerRadius = this.innerRadius
          prevLevelCenterAngle =
            this.angleRange[0] +
            Math.abs(this.angleRange[0] - this.angleRange[1]) / 2
        } else {
          throw new Error('angleRange参数错误')
        }
      } else {
        // 增加5个像素，让子菜单和上级菜单有一定间隙
        innerRadius = level.liWidth + 5
        // 获得当前点击菜单项的中线夹角
        prevLevelCenterAngle =
          level.start + index * level.itemAngle + level.itemAngle / 2
        // 通过弧长比例计算下级菜单项应该有的角度
        let itemAngle =
          (level.liWidth * level.itemAngle) / (innerRadius + this.itemWidth)
        // 正常情况下该级子菜单应该有的角度总和
        let angle = length * itemAngle
        let start, end
        // 对特殊情况进行处理，当subRangeLimit开启时，对子菜单进行范围限制
        if (this.subRangeLimit) {
          // 当角度总和超出根菜单范围限制
          if (angle >= Math.abs(this.angleRange[0] - this.angleRange[1])) {
            start = this.angleRange[0]
            end = this.angleRange[1]
            // 角度总和不超过，但左边界超
          } else if (prevLevelCenterAngle - angle / 2 <= this.angleRange[0]) {
            start = this.angleRange[0]
            end = start + angle
            // 角度总和不超过，但右边界超
          } else if (prevLevelCenterAngle + angle / 2 >= this.angleRange[1]) {
            end = this.angleRange[1]
            start = end - angle
            // 角度总和不超，且在边界内
          } else {
            start = prevLevelCenterAngle - angle / 2
            end = prevLevelCenterAngle + angle / 2
          }
        } else {
          // 超出360度时进行范围修正
          if (angle > 360) {
            angle = 360
          }
          start = prevLevelCenterAngle - angle / 2
          end = prevLevelCenterAngle + angle / 2
        }
        angleRange = [start, end]
      }
      let range = Math.abs(angleRange[0] - angleRange[1])
      let itemAngle = parseFloat(range / length)
      let liWidth = innerRadius + this.itemWidth
      let menuWidth = liWidth * 2
      return {
        start: angleRange[0], // 菜单开始位置
        itemAngle, // 菜单项角度值
        liWidth, // 菜单项的宽度
        menuWidth, // 菜单所在圆形的直径
        innerRadius, // 菜单的内径
        centerAngle: prevLevelCenterAngle, // 中心角
        opened: false // 是否打开状态，用于控制动态添加css3类产生动画效果
      }
    },
    calList(menu, levelNum, itemKey) {
      let arr = []
      menu.forEach((item, idx) => {
        // 使用递归，将菜单按层次分组放置在menuMap中
        if (item[this.tPropMap.subMenu]) {
          this.calList(
            item[this.tPropMap.subMenu],
            levelNum + 1,
            item[this.itemKey]
          )
        }
        item.levelNum = levelNum
        arr.push(item)
      })
      // 将子菜单分层存放,方便点击按钮时查找
      if (!this.menuMap['level' + levelNum]) {
        // 根菜单在上，子菜单放置在下层
        this.menuMap['level' + levelNum] = {
          zIndex: 9999 - levelNum,
          levelNum: levelNum
        }
      }
      this.menuMap['level' + levelNum]['item_' + itemKey] = arr
    },
    /**
     * 菜单点击事件
     * @function cxcmmand
     * @param event 事件
     * @param item 菜单项对象
     * @param level 关于菜单层级的信息，包括liWidth, menuWidth, itemAngle,start, innerRadius
     * @param index 菜单在第几项
     */
    cxcommand(event, item, level, index) {
      switch (event.type) {
        case 'mouseleave':
          this.hoverItem = ''
          break
        case 'mouseenter':
          this.hoverItem = 'item_' + item[this.itemKey]
          break
      }
      if (item[this.tPropMap.subMenu]) {
        if (!this.triggerMap[this.trigger].includes(event.type)) {
          return
        }
        // 删除子菜单
        this.reduceMenu(level.levelNum + 1).then(() => {
          let nextLevel = this.menuMap['level' + (item.levelNum + 1)]
          let subMenu = nextLevel['item_' + item[this.itemKey]]
          this.activeMenus.push('item_' + item[this.itemKey])
          this.$nextTick(() => {
            let levelObj = {
              ...nextLevel,
              menuList: subMenu,
              ...this.calCircle(subMenu, level, index) // 将上一层的level传入，用于计算下一层的值
            }
            this.menuLevels.push(levelObj)
            this.$nextTick(() => {
              setTimeout(() => {
                levelObj.opened = true
              }, 210)
            })
          })
        })
      } else {
        if (event.type !== 'click') {
          return
        }
        // 删除子菜单
        this.reduceMenu(level.levelNum + 1).then(() => {
          /**
           * 搜索框点击搜索按钮时触发
           * @event on-item-click
           * @param {Event} event 点击事件的原生对象
           * @param {Object} item  菜单项对象
           */
          this.$emit('on-item-click', event, item)
        })
      }
    },
    /**
     * 清除菜单，通常是在点击按钮时，作为固定菜单使用时
     * @function reduceMenu
     * @param {Number} reduceTo 一直删除到剩下数量为reduceTo的菜单, 之所以不用while而用递归，是想通过控制opened属性控制动画的先后
     */
    reduceMenu(reduceTo) {
      return new Promise((resolve, reject) => {
        if (this.menuLevels.length > reduceTo) {
          this.menuLevels[this.menuLevels.length - 1].opened = false
          setTimeout(() => {
            this.menuLevels.pop()
            this.activeMenus.pop()
            this.reduceMenu(reduceTo).then(() => {
              resolve()
            })
          }, 0)
        } else {
          resolve()
        }
      })
    },
    /**
     * 显示菜单
     * @function show
     * @param {Object} [options = {left: 0, top: 0}] 菜单显示时的初始位置
     */
    show(options = { left: 0, top: 0 }) {
      this.$el.style.display = 'block'
      this.$el.style.left = options.left + 'px'
      this.$el.style.top = options.top + 'px'
      setTimeout(() => {
        this.opened = true
      }, 200)
    },
    /**
     * 隐藏菜单
     * @function hide
     */
    hide() {
      // 删除除根菜单外的所有子菜单
      this.reduceMenu(1).then(() => {
        if (this.fixed) {
          return
        }
        this.$el.style.display = 'none'
      })
    }
  },
  created() {
    this.tPropMap = Object.assign(
      {},
      { text: 'text', subMenu: 'subMenu' },
      this.propMap
    )
  }
}
</script>
<style type="text/scss" lang="scss" scoped>
.center-mask {
  border-radius: 50%;
  background-color: #fff;
  position: absolute;
  background: transparent;
  z-index: 10000;
}
.circle-menus {
  display: none;
  top: 0;
  left: 0;
  position: fixed;
  z-index: 10000;
  &.fixed {
    position: relative;
    display: block;
  }
}
.circle-menu {
  position: absolute;
  // top: 50%;
  // left: 50%;
  border-radius: 50%;
  background: transparent;
  opacity: 0;
  transition: transform 0.2s ease;
  transition: opacity 0.2s ease;
  transform: scale(0.01);
  pointer-events: none;
  overflow: hidden;
  ul {
    position: relative;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  &.opened {
    border-radius: 50%;
    opacity: 1;
    transition: transform 0.2s ease;
    transition: opacity 0.2s ease;
    transform: scale(1);
    pointer-events: auto;
    li {
      transition: transform 0.2s ease 0.2s;
    }
  }
  li {
    position: absolute;
    top: 50%;
    left: 50%;
    overflow: hidden;
    transition: transform 0.2s ease 0.2s;
    transform-origin: 100% 100%;
    pointer-events: none;
    .item-content {
      position: absolute;
      display: block;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      color: #fff;
      text-align: center;
      text-decoration: none;
      line-height: 2;
      pointer-events: auto;
      cursor: pointer;
      .item-text {
        display: inline-block;
        font-size: 14px;
        color: #333;
        text-align: center;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>