/**
 * 路由导航守卫
 * @function
 * @param {VueRouter} router 路由实例
 */

import NProgress from 'nprogress'

// 进度自动递增20%
NProgress.inc(0.2)

export default function (router) {
  /**
   * 全局前置守卫
   */
  router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
    
  });
  
  /**
   * 全局后置守卫
   */
  router.afterEach((to, from) => {
    NProgress.done()
  })
  
}


