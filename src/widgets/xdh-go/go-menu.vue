<template>
    <div style="z-index: 10000;position:absolute;">
      <slot></slot>
    </div>
</template>
<script>
/**
   * gojs功能组件
   * @module widgets/xdh-go/go-menu
   * @example
   * // use it with menu components
   *  <go-menu ref="menu1">
          <circle-menu
          :menu-list="listData1"
          @item-click="itemClick">
          </circle-menu>
      </go-menu>
   */
  /**
 * 插槽
 * @member slot [default]
 */
import go from 'gojs'
let $ = go.GraphObject.make
export default {
  /**
   * 属性参数
   * @property {Function} [beforeShowMenu = () => {}] 显示菜单前须做的操作，可用于调整菜单项
   * @property {Function} [showContextMenu] 显示菜单，可选
   */
  props: {
    beforeShowMenu: {
      type: Function,
      default: () => {}
    },
    showContextMenu: {
      type: Function
    }
  },
  data() {
    return {
      menu: null,
      menuObj: null,
      offset: [0, 0]
    }
  },
  computed: {},
  methods: {
    /**
     * 返回用于绑定到contextMenu参数的HTMLInfo对象
     * @function bindMenu
     */
    bindMenu() {
      this.menuObj = this.$children[0];
      this.menu = this.$children[0].$el;
      // 取消原生右键点击事件
      this.menu.addEventListener(
        'contextmenu',
        function(e) {
          e.preventDefault()
          return false
        },
        false
      )
      return $(go.HTMLInfo, {
        show: this.showMenu,
        mainElement: this.menu
      })
    },
    // 组件内部使用的方法
    showMenu(obj, diagram, tool) {
      // 显示菜单时将菜单初始化，因此菜单内部须实现resetMenu方法
      if(this.menuObj.resetMenu) {
        this.menuObj.resetMenu();
      }
      this.diagram = diagram
      this.beforeShowMenu(obj, diagram, tool, this.menu)
        // 有时你可能想在指定的位置显示菜单，而不是在节点上，可自定义方法实现
        // 传回diagram 方便将菜单通过lastInput定位到指定坐标
      if (this.showContextMenu) {
        this.showContextMenu(obj, diagram, tool, this.menu)
      } else {
        this.menu.style.display = 'block'
        let event = diagram.lastInput.event;
        this.menu.style.left = event.pageX + 'px'
        this.menu.style.top = event.pageY + 'px';
      }
    }
  }
}
</script>
<style type="text/scss" lang="scss" scoped>
</style>