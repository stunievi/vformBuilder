import Vue from 'vue'
// import Vue from 'vue/dist/vue.js';
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import formCreate from '@form-create/element-ui'
import VueRouter from 'vue-router'

import routes from "./routers.js"
import axios from 'axios'
import VueAxios from 'vue-axios'

import config from "@/config/config"
// import uploadCustom from '@/components/Upload/upload.vue';


Vue.use(VueAxios, axios)
Vue.use(VueRouter)
Vue.use(formCreate);
Vue.use(ElementUI);
// Vue.component(uploadCustom.name, uploadCustom);

Vue.config.productionTip = false

// 挂载全局
Vue.prototype.global = config;
// Vue.prototype.axios = axios;

const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})
new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
