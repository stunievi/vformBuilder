<template>
  <el-tree :class="{'xdh-tree':connect}" ref="tree" v-bind="$props" v-on="listeners">
    <div slot-scope="scope">
      <slot v-bind="scope">{{scope.node.label}}</slot>
    </div>
  </el-tree>
</template>

<script>
  import ElTree from 'element-ui/lib/tree'

  /**
   * XdhTree 树状控件
   * @module widgets/xdh-tree
   *
   * @example
   *
   *  <xdh-tree node-key="ids" fetch-parent ref="tree" :data="data"  show-checkbox></xdh-tree>
   *
   * import XdhTree from '../widgets/xdh-tree'
   * export default {
   *  components: {
   *    XdhTree
   *  }
   * }
   *
   */
  export default {
    name: 'XdhTree',
    components: {
      ElTree
    },
    /**
     * 属性参数，完全继承 el-tree参数，并有以下扩展参数
     * @property {Boolean} [connect = false] 父子节点显示虚线连接
     * @property {Boolean} [fetchParent = false] 选中结果集过滤子节点，仅保留父节点
     */
    props: {
      ...ElTree.props,
      connect: {
        type: Boolean,
        default: false
      },
      fetchParent: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      /**
       * 继承ElTree事件重写(Events)
       * @private
       */
      listeners() {
        let _listeners = {}, _self = this
        for (let item in this.$listeners) {
          _listeners[item] = function () {
            let _arguments = Array.from(arguments)
            _arguments.unshift(item)
            if (_self.fetchParent && item === 'check' && _arguments[2].checkedNodes) {
              _arguments[2].checkedKeys = []
              _arguments[2].checkedNodes = fetchParent(_arguments[2].checkedNodes, _self.nodeKey, _self.props, (node) => {
                _arguments[2].checkedKeys.push(node[_self.nodeKey || 'id'])
              })
            }
            _self.$emit.apply(_self, _arguments)
          }
        }
        return _listeners
      }
    },
    methods: {
      /**
       * 获取当前被选中节点过滤子节点，仅保留父节点的 nodes
       * ps:必须先设置 fetch-parent 为true 此方法才生效
       * @returns {Array}
       */
      getCheckedNodesParent() {
        if (!this.fetchParent) return []
        return fetchParent(this.$refs.tree.getCheckedNodes(), this.nodeKey, this.props)
      }
    }
  }

  /**
   * 结构树勾选过滤保留父级
   * @param {Array} data 树返回的结构数据节点 nodes
   * @param {String} key=id node-key 默认 id
   * @param {object} props 树节点配置
   * @param {string} props.label = 'label'
   * @param {string} props.children = 'children'
   * @param {function} callback 父节点执行回调
   * @returns {Array} 返回 nodes 数组
   *
   * @example
   *
   * let oldList = [{"ids":"1","label":"一级 1","children":[{"ids":"2","label":"二级 1-1","children":[{"ids":"3","label":"三级 1-1-1","children":[{"ids":"4","label":"四级 1-1-1-1"},{"ids":"5","label":"四级 1-1-1-2"}]},{"ids":"7","label":"三级 1-1-2"}]},{"ids":"8","label":"二级 1-2"}]},{"ids":"2","label":"二级 1-1","children":[{"ids":"3","label":"三级 1-1-1","children":[{"ids":"4","label":"四级 1-1-1-1"},{"ids":"5","label":"四级 1-1-1-2"}]},{"ids":"7","label":"三级 1-1-2"}]},{"ids":"3","label":"三级 1-1-1","children":[{"ids":"4","label":"四级 1-1-1-1"},{"ids":"5","label":"四级 1-1-1-2"}]},{"ids":"4","label":"四级 1-1-1-1"},{"ids":"5","label":"四级 1-1-1-2"},{"ids":"7","label":"三级 1-1-2"},{"ids":"8","label":"二级 1-2"}]
   * let newlist = fetchParent(oldList,'ids')
   * console.log(newList)
   * // [{"ids":"1","label":"一级 1","children":[{"ids":"2","label":"二级 1-1","children":[{"ids":"3","label":"三级 1-1-1","children":[{"ids":"4","label":"四级 1-1-1-1"},{"ids":"5","label":"四级 1-1-1-2"}]},{"ids":"7","label":"三级 1-1-2"}]},{"ids":"8","label":"二级 1-2"}]}]
   */
  const fetchParent = (data = [], key, props, callback) => {
    if (!key) key = 'id'
    if (!props) {
      props = {
        label: 'label',
        children: 'children'
      }
    }
    const localData = Array.isArray(data) ? data : []
    let result = [], surplus = []
    let treeMap = (treeItem) => {
      let children = treeItem[props.children]
      if (children) {
        children.forEach(subItem => {
          surplus.push(subItem[key])
          treeMap(subItem)
        })
      }
    }
    if (localData.length > 0) {
      localData.forEach(item => {
        if (!surplus.includes(item[key])) {
          result.push(item)
          if (typeof callback === 'function') callback(item)
        }
        treeMap(item)
      })
    }
    return result
  }
</script>
