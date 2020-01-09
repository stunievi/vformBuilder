/**
 * 组件之间的消息总线，用作组件间消息传递
 * @module utils/bus
 * @author 陈华春
 */
import Vue from 'vue';

/**
 *  Vue 实例
 *
 * @example
 * A组件：
 *  import bus from '@/utils/bus'
 *  // 触发事件
 *  bus.$emit('message', data)
 *
 *  B组件：
 *  import bus from './util/bus'
 *
 *  // 侦听事件
 *  bus.$on('message', data => {
 *    // 收到A组件发送过来的消息
 *  })
 */
export default new Vue({});
