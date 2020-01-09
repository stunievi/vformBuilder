import VueModule from './xdh-breadcrumb'

VueModule.install = function (Vue) {
  Vue.component(VueModule.name, VueModule)
}
export default VueModule
