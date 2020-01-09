import Module from './xdh-virtual-table'

Module.install = function (Vue) {
  Vue.component(Module.name, Module)
}

export default Module
