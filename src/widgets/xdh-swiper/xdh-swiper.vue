<template>
  <swiper :options="swiperOptions"
          class="xdh-swiper"
          v-on="$listeners">
    <swiper-slide v-for="(item,index) in swiperData"
                  :key="index"
                  class="xdh-swiper__slide">

      <div class="xdh-swiper__title">
        <slot name="swiper-title" :title="item.title">{{item.title}}</slot>
      </div>

      <swiper :options="setInnerOptions(index)"
              class="xdh-swiper__content">
        <swiper-slide v-for="currPage in item.pageCount" :key="currPage">

          <xdh-grid :data="setList(item.data,currPage)"
                    direction="row"
                    wrap="wrap"
                    :class="{'xdh-swiper__grid':true,'xdh-swiper__grid--page':pagination || item.pageCount>1}">
            <div class="xdh-swiper__block" slot-scope="scope">
              <slot :name="`swiper${index}-content`" v-bind="scope">
                <div class="xdh-swiper__block--pic" :style="scope.item.iconStyle || item.iconStyle || iconStyle">
                  <img v-if="scope.item.src" :src="scope.item.src">
                  <i v-else-if="scope.item.icon" :class="scope.item.icon"></i>
                </div>
                <div class="xdh-swiper__block--title">{{scope.item.title}}</div>
              </slot>
            </div>
          </xdh-grid>

        </swiper-slide>

        <div :class="`swiper-pagination xdh-swiper__inner-page${index}`"
             slot="pagination"
             v-show="item.pageCount>1&&mode==='nest'"></div>
      </swiper>
    </swiper-slide>

    <div class="swiper-pagination xdh-swiper__outer-page" slot="pagination"></div>
    <div class="swiper-button-prev xdh-swiper__outer-prev" slot="button-prev"></div>
    <div class="swiper-button-next xdh-swiper__outer-next" slot="button-next"></div>
  </swiper>
</template>

<style lang="scss" scoped>
  .xdh-swiper {
    width: 100%;
    height: 100%;
    text-align: center;
    * {
      box-sizing: border-box;
    }

    & > .swiper-wrapper > &__slide {
      padding: 0 62px;
      display: flex;
      flex-direction: column;
    }

    &__title {
      padding: 20px 0;
      font-size: 20px;
      flex: 0 0 auto
    }

    &__content {
      flex: 1;
      width: 100%;
      height: 100%;
    }

    &__grid {
      height: 100%;
      &--page {
        padding-bottom: 42px;
      }
    }

    &__block {
      width: 100%;
      height: 100%;
      padding: 10px;
      display: flex;
      flex-direction: column;
      &--pic {
        margin: 0 auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }

  }
</style>

<script>
  /**
   * XdhSwiper 大屏切换不同图标组件
   * @module widgets/xdh-swiper
   */
  import 'swiper/dist/css/swiper.css'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import XdhGrid from '../xdh-grid'

  /**
   * 插槽
   * @member slots
   * @property {string} swiper-title 每一个slide的大title的内容
   * @property {string} swiper${index}-content 第N个slide的内容
   */

  export default {
    name: 'XdhSwiper',
    components: {
      XdhGrid,
      swiper,
      swiperSlide
    },
    /**
     * 属性参数
     * @property {Array} [mode='nest'] 显示模式:'nest'嵌套分页滑动切换，'slide'无嵌套分页滑动切换
     * @property {Array} [data] swiper显示的内容
     * @property {Boolean} [loop=true] 是否开启循环模式
     * @property {Boolean} [navigation=true] 是否开启每页控制器
     * @property {Boolean} [pagination=true] 是否开启左右箭头控制器
     * @property {Number} [pageSize=12] 每屏显示的图标总数
     * @property {Number} [columns=6] 每屏显示的图标列数
     * @property {Object} [iconStyle] 图标的样式
     */
    props: {
      mode: {
        type: String,
        validator(val) {
          return ['nest', 'slide'].includes(val)
        },
        default: 'nest'
      },
      data: {
        type: Array,
        required: true
      },
      loop: {
        type: Boolean,
        default: true
      },
      navigation: {
        type: Boolean,
        default: true
      },
      pagination: {
        type: Boolean,
        default: true
      },
      pageSize: {
        type: Number,
        default: 12
      },
      columns: {
        type: Number,
        default: 6
      },
      iconStyle: {
        type: Object
      }
    },
    watch: {},
    computed: {
      swiperOptions() {
        let obj = {}
        if (this.navigation) {
          obj.navigation = {
            nextEl: '.xdh-swiper__outer-next',
            prevEl: '.xdh-swiper__outer-prev'
          }
        }
        if (this.pagination && this.mode === 'slide') {
          obj.pagination = {
            el: '.xdh-swiper__outer-page',
            clickable: true
          }
        }
        return {
          allowTouchMove: false, // 鼠标模拟手机触摸
          loop: this.loop,
          observer: true,
          ...obj
        }
      },
      swiperData() {
        let data = [];

        // 如果是slide模式，要将所有数据不嵌套显示出来
        if (this.mode === 'slide') {
          this.data.forEach(item => {
            const pageSize = item.pageSize || this.pageSize
            const total = Math.ceil(item.data.length / pageSize)
            for (let i = 0; i < total; i++) {
              data.push(Object.assign({}, item, {data: item.data.slice(i * pageSize, (i + 1) * pageSize)}))
            }
          })
        } else {
          data = [...this.data]
        }

        data.forEach(n => {
          const pageSize = n.pageSize || this.pageSize
          const columns = n.columns || this.columns
          n.pageCount = Math.ceil(n.data.length / pageSize)
          n.data.forEach(d => {
            d.basis = (100 / columns).toFixed(4) + '%'
          })
        })

        return data
      }
    },
    methods: {
      /**
       * 渲染内部swiper
       * @param data 当前内部swiper的全部data
       * @param currPage  当前内部swiper显示的当前页数
       * @returns {*}
       */
      setList(data, currPage) {
        return data.slice((currPage - 1) * this.pageSize, currPage * this.pageSize)
      },
      /**
       * 设置嵌套的swiper的options
       */
      setInnerOptions(index) {
        return {
          allowTouchMove: false,
          pagination: {
            el: '.xdh-swiper__inner-page' + index,
            clickable: true
          }
        }
      }
    }
  }
</script>


