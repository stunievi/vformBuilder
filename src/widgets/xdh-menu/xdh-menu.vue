<script>
  /**
   * 菜单组件
   * @module widgets/xdh-menu
   * @example
   *
   * // 使用说明
   */
  export default {
    name: 'XdhMenu',
    /**
     * 属性参数
     * @property {Array} [data = []] data 构成菜单内容的数组
     * @property {Object} [props = { id: 'id', text: 'text', icon: 'icon', children: 'children', group: 'group', route: 'route' }] props 指引菜单组件根据data数组中元素的键名作为菜单中对应的显示内容。例如：数组内元素为 {g_id:1, str:'第一组'}, 可以通过设置"props={id: 'g_id', text: 'str'}"来将数组的g_id对应为id，str对应为text
     * @property {String} [mode = 'verticle'] mode 默认为垂直模式，横向 ‘horizontal’
     * @property {Boolean} [collapse = false] 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
     * @property {String} [backgroundColor] backgroundColor='#FFFFFF' 菜单的背景色（仅支持 hex 格式）
     * @property {String} [textColor] 菜单的文字颜色（仅支持 hex 格式）
     * @property {String} [activeTextColor] 当前激活菜单的文字颜色（仅支持 hex 格式）
     * @property {String} [defaultActive] 当前激活菜单的 index。 defaultActive = '1'
     * @property {Array} [defaultOpeneds] 当前打开的sub-menu的 key 数组。 defaultOpeneds = ['2', '4']
     * @property {Boolean} [uniqueOpened = false] 是否只保持一个子菜单的展开
     * @property {String} [menuTrigger = 'click'] 子菜单打开的触发方式(只在 mode 为 horizontal 时有效)
     * @property {Boolean} [router = false] 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
     */
    props: {
      // 菜单数据
      data: {
        type: Array,
        default() {
          return []
        }
      },
      // 数据字段名称映射
      props: {
        type: Object,
        default() {
          return {
            id: 'id',
            text: 'text',
            icon: 'icon',
            children: 'children',
            group: 'group',
            route: 'route'
          }
        }
      },
      // 模式 horizontal / vertical
      mode: String,

      // 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
      collapse: Boolean,

      // 菜单的背景色（仅支持 hex 格式）
      backgroundColor: String,

      // 菜单的文字颜色（仅支持 hex 格式）
      textColor: String,

      // 当前激活菜单的文字颜色（仅支持 hex 格式）
      activeTextColor: String,

      // 当前激活菜单的 index
      defaultActive: String,

      // 当前打开的sub-menu的 key 数组
      defaultOpeneds: Array,

      // 是否只保持一个子菜单的展开
      uniqueOpened: Boolean,

      // 子菜单打开的触发方式(只在 mode 为 horizontal 时有效)
      menuTrigger: String,

      // 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
      router: Boolean,

      // 弹出菜单的自定义类名
      popperClass: String
    },
    methods: {
      grouping(array) {
        let groups = {
          'default': []
        }
        let props = this.props
        array.forEach(n => {
          let key = n[props.group]
          if (key) {
            groups[key] = groups[key] || []
            groups[key].push(n)
          } else {
            groups['default'].push(n)
          }
        })
        return groups
      },
      createTitle(h, item) {
        return [
          h('i', {
            'class': item[this.props.icon]
          }),
          h('span', {
            slot: 'title'
          }, item[this.props.text])
        ]
      },
      createItem(h, item) {
        const key = (item[this.props.id] || '').toString()
        return h('el-menu-item', {
          props: {
            index: key,
            route: item[this.props.route]
          },
          key: key
        }, this.createTitle(h, item))
      },
      createSubmenu(h, item) {
        const key = (item[this.props.id] || '').toString()
        return h('el-submenu', {
          props: {
            index: (item[this.props.id] || '').toString(),
            popperClass: this.popperClass
          },
          key: key
        }, [h('template', {
          slot: 'title'
        }, this.createTitle(h, item)), this.createNodes(h, item[this.props.children])])
      },
      createGroup(h, title, items) {
        let nodes = []
        let props = this.props
        items.forEach(item => {
          if (item[props.children] && item[props.children].length > 0) {
            nodes.push(this.createSubmenu(h, item))
          } else {
            nodes.push(this.createItem(h, item))
          }
        })
        nodes.unshift(h('template', {
          slot: 'title'
        }, title))
        return h('el-menu-item-group', null, nodes)
      },
      createNodes(h, array) {
        let nodes = [], groups = this.grouping(array)
        let props = this.props
        for (let key in groups) {
          let items = groups[key] || []
          if (key === 'default') {
            items.forEach(item => {
              if (item[props.children] && item[props.children].length > 0) {
                nodes.push(this.createSubmenu(h, item))
              } else {
                nodes.push(this.createItem(h, item))
              }
            })
          } else {
            nodes.push(this.createGroup(h, key, items))
          }
        }
        return nodes
      },
      open(index) {
        this.$refs.menu.open(index)
      },
      close(index) {
        this.$refs.menu.close(index)
      }
    },
    render(h) {
      return h('el-menu', {
        props: {
          ...this.$props
        },
        'class': 'xdh-menu',
        on: {
          /**
           * 触发选中事件
           * @event select
           * @param index {String} 选中列表id
           * @param indexPath {Array} 选中列表对应的路径 如：['item1', 'item1-1']
           */
          select: (index, indexPath) => this.$emit('select', index, indexPath),
          /**
           * 触发列表组（子菜单）展开事件
           * @event open
           * @param index {String} 选中列表id
           * @param indexPath {Array} 选中列表对应的路径 如：['item1', 'item1-1']
           */
          open: (index, indexPath) => this.$emit('open', index, indexPath),
          /**
           * 触发列表组（子菜单）收起事件
           * @event close
           * @param index {String} 选中列表id
           * @param indexPath {Array} 选中列表对应的路径 如：['item1', 'item1-1']
           */
          close: (index, indexPath) => this.$emit('close', index, indexPath)
        },
        ref: 'menu'
      }, this.createNodes(h, this.data))
    }
  }
</script>
