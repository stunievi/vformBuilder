/**
 * Sortable 模块
 * @module widgets/xdh-tabs/sortable
 */
import SortableJs from 'sortablejs'
import {insertAfter} from '@/utils/dom'

const noop = function () {
}

/**
 * 处理拖拽排序，实现数据双向绑定
 */
class Sortable {
  /**
   * 构造函数
   * @param {Object} setting 参数对象
   * @param {Object} setting.vm Vue实例
   * @param {HTMLElement} setting.container 可拖拽的容器DOM
   * @param {Array} setting.data 列表数据
   * @param {Object} setting.config SortableJs固定配置
   * @param {Object} setting.options SortableJs可选配置
   * @param {Function} setting.reset 对原数据生成的tab元素进行排序，在双向数据绑定时需要还原html元素的排序
   * @param {Function} setting.change 在数据发生改变后，回调change函数
   */
  constructor(setting = {}) {
    /**
     * Vue组件实例
     * @type {Object}
     */
    this.vm = setting.vm
    /**
     * 拖拽容器
     * @type {HTMLElement}
     */
    this.container = setting.container
    this.container.__data__ = setting.data
    /**
     * 数据数组
     * @type {Array}
     */
    this.data = setting.data.slice()
    /**
     * Sortable通用配置参数
     * @type {Object}
     */
    this.config = this._defaultConfig(setting.vm, setting.config)
    /**
     * Sortable 实例化自定义参数
     * @member options
     * @type {Object}
     */
    this.options = {...setting.options, ...this.config}

    /**
     * 处理 data.map() 回调函数
     */
    this.resetHandler = setting.reset || null
    /**
     * 数据改变时回调函数
     */
    this.changeHandler = setting.change || noop
    /**
     * SortableJs 实例
     * @member sortable
     * @type {SortableJs}
     */
    this.sortable = new SortableJs(this.container, this.options)
  }

  /**
   * 构建Sortable默认参数选项
   * @param {Object} vm Vue实例
   * @param {Object} config 参数选项对象
   * @returns {Object} 参数选项对象
   * @private
   */
  _defaultConfig(vm, config) {
    return {
      animation: 150,
      onUpdate: (e) => {
        this.sort(e.oldIndex, e.newIndex)
        vm.$emit('on-update', e)
      },
      onAdd: (e) => {
        this.add(e.from.__data__, e.item, e.oldIndex, e.newIndex)
        vm.$emit('on-add', e)
      },
      onRemove: (e) => {
        this.remove(e.item, e.oldIndex)
        vm.$emit('on-remove', e)
      },
      onChoose: (e) => {
        vm.$emit('on-choose', e)
      },
      onStart: (e) => {
        vm.$emit('on-start', e)
      },
      onEnd: (e) => {
        vm.$emit('on-end', e)
      },
      onSort: (e) => {
        vm.$emit('on-sort', e)
      },
      onFilter: (e) => {
        vm.$emit('on-filter', e)
      },
      onMove: (e) => {
        vm.$emit('on-move', e)
      },
      onClone: (e) => {
        vm.$emit('on-clone', e)
      },
      ...config
    }
  }

  /**
   * 销毁
   */
  destroy() {
    this.sortable.destroy()
    this.container.__data__ = null
    this.vm = null
  }

  /**
   * 更新数据
   * @param {Array} data 数据数组
   */
  setData(data) {
    this.data = data.slice()
    this.container.__data__ = this.data
  }

  /**
   * 更新Sortable属性参数
   * @param {Object} options 需要更新的选项
   */
  setOption(options = {}) {
    Object.keys(options).forEach(key => {
      const value = options[key]
      this.options[key] = value
      this.sortable.option(key, value)
    })
  }

  /**
   * 拖拽排序后的处理函数
   * @param {Number} oldIndex 原来的位置索引
   * @param {Number} newIndex 排序后的位置索引
   */
  sort(oldIndex, newIndex) {
    const oldTemp = this.data[oldIndex]
    this.data.splice(oldIndex, 1)
    this.data.splice(newIndex, 0, oldTemp)
    /**
     *  拖拽结束后，HTML结构已经发生了改变。 HTML的生成是由数据驱动的，由于Vue生成HTML的虚拟DOM会计算最小的开销去更新DOM，
     *  当数据改变后，Vue是不能识别Sortable修改的DOM，因此需要在触发更新数据前，恢复Sortable修改DOM
     *  用 sortable.sort 方法恢复拖拽排序前的DOM
     */
    if (this.resetHandler) {
      const order = this.data.map(this.resetHandler)
      this.sortable.sort(order)
    }
    this.changeHandler(this.data.slice(), 'sort', Array.from(arguments))
    this.setData(this.data)
  }

  /**
   * 拖拽新增项
   * @param {Array} fromData 拖拽的源数据
   * @param {HTMLElement} element 拖拽的DOM
   * @param {Number} oldIndex 从源数据的拖出位置索引
   * @param {Number} newIndex 放置的位置索引
   */
  add(fromData, element, oldIndex, newIndex) {
    const newTab = fromData[oldIndex]
    this.data.splice(newIndex, 0, newTab)

    /**
     * 拖拽结束后，新的HTML已经插入到放置区，需要删除拖进来的HTML，再修改数据，由数据驱动生成HTML
     */
    Array.from(this.container.children).forEach(el => {
      if (el === element) {
        this.container.removeChild(el)
      }
    })
    // 触发更新数据
    this.changeHandler(this.data.slice(), 'add', Array.from(arguments))
    this.setData(this.data)
  }

  /**
   * 拖拽删除项
   * @param {HTMLElement} element 删除的DOM
   * @param {Number} oldIndex 位置索引
   */
  remove(element, oldIndex) {
    this.data.splice(oldIndex, 1)
    /**
     * 拖拽结束后，HTML已经删除，在更新数据之前，需要恢复原来的DOM，再触发数据更新，由数据驱动生成HTML
     */
    const children = this.container.children
    if (children.length > 0) {
      oldIndex > 0
        ? insertAfter(element, children[oldIndex - 1])
        : this.container.insertBefore(element, children[0])
    } else {
      this.container.appendChild(element)
    }
    this.changeHandler(this.data.slice(), 'remove', Array.from(arguments))
    this.setData(this.data)
  }
}

/**
 * @export Sortable
 */
export default Sortable
