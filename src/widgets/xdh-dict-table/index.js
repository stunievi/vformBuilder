import Module from './xdh-dict-table'

Module.install = function (Vue) {
  Vue.component(Module.name, Module)
}

export default Module
