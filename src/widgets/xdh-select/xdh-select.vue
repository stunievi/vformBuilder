<template>
  <div>
    <el-select 
    :multiple="multiple"
    :disabled="disabled"
    :value-key="valueKey"
    :size="size"
    :clearable="clearable"
    :collapse-tags="collapseTags"
    :multiple-limit="multipleLimit"
    :name="name"
    :auto-complete="autoComplete"
    :placeholder="placeholder"
    :filterable="filterable"
    :allow-create="allowCreate"
    :filter-method="filterMethodHandler()"
    :remote="remote"
    :remote-method="remoteMethod"
    :loading="loading"
    :loading-text="loadingText"
    :no-match-text="noMatchText"
    :no-data-text="noDataText"
    :popper-class="popperClass"
    :reserve-keyword="reserveKeyword"
    :default-first-option="defaultFirstOption"
    :popper-append-to-body="popperAppendToBody"
    @change="val => $emit('change', val)"
    @visible-change="val => visibleChangeHandler(val)"
    @remove-tag="val => $emit('remove-tag', val)"
    @clear="val => $emit('clear')"
    @blur="e => $emit('blur', e)"
    @focus="e => $emit('focus', e)"
    v-model="query" 
    ref="infiniteSelect">
    <el-option
      v-if="domLimit"
      v-for="(item, idx) in renderList"
      :key="valueKey ? item[mapValue][valueKey] : item[mapValue]"
      :label="item[mapLabel] ? item[mapLabel]: item[mapValue]"
      :value="item[mapValue]"
      :disabled="item[mapDisabled] ? item[mapDisabled] : false"
      :data-items-index="currStartIndex+idx"
      :class="{'last-item': idx === renderList.length - 1 , 'first-item': idx === 0}">
      <slot :item="item" name="options"></slot>
    </el-option>
     <slot v-if="!domLimit"></slot>
  </el-select>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script>
import { on, off, getStyle } from 'element-ui/lib/utils/dom';
import { getScroll, scrollTop } from '../../utils/dom';
import { Select } from 'element-ui';
const selectProps = Object.assign({}, Select.props);
/**
 * XdhSelect
 * @module widgets/xdh-select
 * @author 李国师
 * @example
 *
 * // 使用说明
 *  <xdh-select v-model="selected" :dom-num="5"  :data="options" filterable>
 *  </xdh-select>
 *
 * // ----------或使用slot-------
 *
 *  <xdh-select v-model="selected" :dom-num="5" :data="options" filterable>
 *   <template slot-scope="{item}" slot="options">
 *     <span>{{item.label}}--{{item.value}}</span>
 *   </template>
 *  </xdh-select>
 */
/**
 * 作用域插槽
 * @member slot
 * @property {string} [options] 自定义选项格式
 */
export default {
  name: 'XdhSelect',
  /**
   * 属性参数
   * @member
   * @property {Object} [data] 数据选项
   * @property {Boolean} [dom-limit] 是否渲染,默认值为true
   * @property {Number} [dom-num] 每页渲染的dom数目，最终渲染3页，dom节点数为domNum*3
   * @property {Object} [option-map] 自定义value,label,disabled名称
   * @property {Boolean} [disabled] 是否禁用
   * @property {String} [size] 输入框尺寸
   * @property {Boolean} [clearable] 单选时是否可以清空选项
   * @property {Number} [multiple-limit] 多选时用户最多可以选择的项目数，为 0 则不限制
   * @property {String} [placeholder] 占位符
   * @property {Boolean} [filterable] 是否可搜索
   * @property {Boolean} [allow-create] 是否允许用户创建新条目，需配合 filterable 使用
   * @property {Boolean} [collapse-tags] 多选时是否将选中值按文字的形式展示
   * @property {Function} [filter-method] 自定义搜索方法
   * @property {Boolean} [remote] 是否为远程搜索
   * @property {Function} [remote-method] 远程搜索方法
   * @property {Boolean} [loading] 是否正在从远程获取数据
   * @property {String} [loading-text] 远程加载时显示的文字
   * @property {String} [no-match-text] 搜索条件无匹配时显示的文字
   * @property {String} [no-data-text] 选项为空时显示的文字
   * @property {String} [popper-class] Select 下拉框的类名
   * @property {String} [reserve-keyword] 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词
   * @property {Boolean} [default-first-option] 在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用
   * @property {Boolean} [popper-append-to-body] 是否将弹出框插入至 body 元素。在弹出框的定位出现问题时，可将该属性设置为 false
   */
  props: {
    ...selectProps,
    domNum: {
      type: Number,
      default: 10
    },
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    domLimit: {
      type: Boolean,
      default: true
    },
    optionMap: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      defaultItemHeight: 34,
      query: '',
      cacheList: [],
      currStartIndex: 0,
      lastMaxItemIndex: 0,
      lastLoadedIndex: 0,
      scrollHeight: null,
      scrollTop: null,
      wrapPaddingTop: 0,
      itemHeight: null,
      isLoading: false,
      scrollWrap: null,
      selectInput: null,
      selectInitHeight: null,
      scrollList: null,
      renderList: []
    };
  },
  computed: {
    mapValue() {
      return this.optionMap && this.optionMap.value ? this.optionMap.value : 'value';
    },
    mapLabel() {
      return this.optionMap && this.optionMap.label ? this.optionMap.label : 'label';
    },
    mapDisabled() {
      return this.optionMap && this.optionMap.disabled ? this.optionMap.disabled : 'disabled';
    }
  },
  watch: {
    query(val) {
      this.$emit('input', val);
    },
    value(val) {
      this.query = val;
    },
    data: {
      handler(val) {
        if (this.domLimit) {
          this.cacheList = [...this.data];
          this.resetRenderList();
        }
      },
      deep: true
    }
  },
  methods: {
    filterMethodHandler() {
      if (this.domLimit) {
        return val => {
          if (val === '') {
            this.cacheList = [...this.data];
          } else {
            if (
              this.filterMethod !== undefined &&
              typeof this.filterMethod === 'function'
            ) {
              this.filterMethod(val);
            }else{
              this.cacheList = this.data.filter(r => {
                return r[this.mapLabel].includes(val);
              });
            }
          }
          this.resetRenderList();
        };
      } else {
        return this.filterMethod;
      }
    },
    resetRenderList() {
      this.renderList = this.cacheList.slice(
        0,
        this.domNum * 3 > this.cacheList.length
          ? this.cacheList.length
          : this.domNum * 3
      );
      this.currStartIndex = 0;
      this.lastLoadedIndex = 0;
      this.lastMaxItemIndex = this.cacheList.length - 1;
      this.scrollHeight = null;
      this.scrollList.style = `position: relative;`;
    },
    focus() {
      this.$refs.infiniteSelect.focus();
    },
    blur() {
      this.$refs.infiniteSelect.blur();
    },
    visibleChangeHandler(val) {
      if (this.domLimit) {
        if (val) {
          this.cacheList = [...this.data];
          this.resetRenderList();
        }
      }
      this.$emit('visible-change', val);
    },
    appendNewItems(prevHeight, topPos) {
      let lastIndex = parseInt(
        this.scrollWrap
          .querySelector('.last-item')
          .getAttribute('data-items-index'),
        10
      );
      if (this.lastMaxItemIndex === lastIndex) {
        this.isLoading = false;
        return;
      }
      this.currStartIndex += this.domNum;
      this.renderList = this.cacheList.slice(
        this.currStartIndex,
        this.currStartIndex + this.domNum * 3 > this.cacheList.length
          ? this.cacheList.length
          : this.currStartIndex + this.domNum * 3
      );
      this.$nextTick(() => {
        lastIndex = parseInt(
          this.scrollWrap
            .querySelector('.last-item')
            .getAttribute('data-items-index'),
          10
        );
        let mainContentPaddingTop = getStyle(this.scrollList, 'paddingTop');
        mainContentPaddingTop = parseFloat(
          mainContentPaddingTop.split('px')[0] || 0
        );
        if (
          this.lastMaxItemIndex > lastIndex &&
          this.lastLoadedIndex < lastIndex
        ) {
          this.scrollList.style.height =
            prevHeight + this.domNum * this.itemHeight + 'px';
          this.scrollList.style.paddingTop =
            mainContentPaddingTop + this.domNum * this.itemHeight + 'px';
          this.lastLoadedIndex = lastIndex;
        } else {
          this.scrollList.style.paddingTop =
            mainContentPaddingTop + this.domNum * this.itemHeight + 'px';
        }
        off(this.scrollWrap, 'scroll', this.scrollHandler);
        scrollTop(this.scrollWrap, 0, topPos, 0);
        this.scrollHandler = this.scrollHandler.bind(this);
        on(this.scrollWrap, 'scroll', this.scrollHandler);
        // 重新计算滚动条高度
        this.$refs.infiniteSelect.$refs.scrollbar.update();
        this.isLoading = false;
      });
    },
    restorePreItems(prevHeight, topPos) {
      let firstIndex = parseInt(
        this.scrollWrap
          .querySelector('.first-item')
          .getAttribute('data-items-index'),
        10
      );
      if (firstIndex <= 0) {
        this.isLoading = false;
        return;
      }
      this.currStartIndex -= this.domNum;
      this.renderList = this.cacheList.slice(
        this.currStartIndex < 0 ? 0 : this.currStartIndex,
        this.currStartIndex + this.domNum * 3 > this.cacheList.length
          ? this.cacheList.length
          : this.currStartIndex + this.domNum * 3
      );
      this.$nextTick(() => {
        let mainContentPaddingTop;
        firstIndex = parseInt(
          this.scrollWrap
            .querySelector('.first-item')
            .getAttribute('data-items-index'),
          10
        );

        mainContentPaddingTop = getStyle(this.scrollList, 'paddingTop');
        mainContentPaddingTop = parseFloat(
          mainContentPaddingTop.split('px')[0] || 0
        );
        this.scrollList.style.paddingTop =
          mainContentPaddingTop - this.domNum * this.itemHeight + 'px';
        off(this.scrollWrap, 'scroll', this.scrollHandler);
        scrollTop(this.scrollWrap, 0, topPos, 0);
        on(this.scrollWrap, 'scroll', this.scrollHandler);
         // 重新计算滚动条高度
        this.$refs.infiniteSelect.$refs.scrollbar.update();
        this.isLoading = false;
      });
    },
    scrollHandler(e) {
      let lastItemTop, firstItemTop;
      if (!this.scrollHeight) {
        this.scrollHeight = this.scrollWrap.getBoundingClientRect().height;
        this.scrollTop = this.scrollWrap.getBoundingClientRect().top;
        this.itemHeight = this.scrollList
          .querySelector('.el-select-dropdown__item')
          .getBoundingClientRect().height;
      }
      if (this.isLoading) {
        return;
      } else {
        lastItemTop = this.scrollWrap
          .querySelector('.last-item')
          .getBoundingClientRect().top;
        let multiOffsetHeight = this.selectInput.offsetHeight - this.selectInitHeight;
        lastItemTop = lastItemTop - this.scrollTop - multiOffsetHeight;
      }
      if (lastItemTop <= this.scrollHeight) {
        this.isLoading = true;
        this.appendNewItems(
          this.scrollList.getBoundingClientRect().height,
          getScroll(this.scrollWrap, true)
        );
        return;
      }
      firstItemTop = this.scrollWrap
        .querySelector('.first-item')
        .getBoundingClientRect().top;
      firstItemTop = firstItemTop - this.scrollTop - this.wrapPaddingTop;
      if (firstItemTop >= 0) {
        this.restorePreItems(
          this.scrollList.getBoundingClientRect().height,
          getScroll(this.scrollWrap, true)
        );
      }
    },
    updateCacheOptions() {
      this.$refs.infiniteSelect.cachedOptions = this.cacheList.map(r => {
        return {
          label: r[this.mapLabel],
          value: r[this.mapValue],
          currentLabel: r[this.mapLabel],
          currentValue: r[this.mapValue]
        }
      })
    }
  },
  mounted() {
    this.query = JSON.parse(JSON.stringify(this.value));
    if (this.domLimit) {
      this.cacheList = [...this.data];
      this.updateCacheOptions();
      this.scrollHandler = this.scrollHandler.bind(this);
      this.scrollWrap = this.$refs.infiniteSelect.$el.querySelector(
        '.el-select-dropdown__wrap'
      );
      this.selectInput = this.$refs.infiniteSelect.$el;
      this.selectInitHeight = this.$refs.infiniteSelect.$el.offsetHeight;
      this.scrollList = this.scrollWrap.querySelector(
        '.el-select-dropdown__list'
      );
      this.resetRenderList();
      this.wrapPaddingTop = getStyle(this.scrollList, 'paddingTop');
      this.wrapPaddingTop = parseFloat(this.wrapPaddingTop.split('px')[0] || 0);
      on(this.scrollWrap, 'scroll', this.scrollHandler);
    }
  },
  created() {
    if (this.multiple && !Array.isArray(this.value)) {
      this.$emit('input', []);
    }
    if (!this.multiple && Array.isArray(this.value)) {
      this.$emit('input', '');
    }
  }
};
</script>