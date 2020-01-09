import VueModule from './xdh-grid-layout'

VueModule.install = function (Vue) {
  Vue.component(VueModule.name, VueModule)
}
export default VueModule
