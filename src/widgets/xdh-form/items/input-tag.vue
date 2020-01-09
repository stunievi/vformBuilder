<template>
  <div class="xdh-form-input-tag el-select"
       :class="[selectSize ? 'el-select--' + selectSize : '']">
    <div class="el-select__tags"
         ref="tags"
         :style="{ 'max-width': inputWidth - 32 + 'px', width: '100%' }">
      <span v-if="collapseTags && tags.length">
        <el-tag type="info"
                :size="collapseTagSize"
                :closable="closableTag"
                @click="handelTagClick"
                disable-transitions
                @close="deleteTag(0, tags[0])">
                    <span class="el-select__tags-text">{{tags[0]}}</span>
        </el-tag>
        <el-tag
          v-if="tags.length > 1"
          :closable="false"
          type="info"
          :size="collapseTagSize"
          disable-transitions>
          <span class="el-select__tags-text">+ {{tags.length - 1 }}</span>
        </el-tag>
      </span>
      <transition-group @after-leave="resetInputHeight" v-if="!collapseTags">
        <el-tag
          v-for="(item,index) in tags"
          :key="`${item}_${index}`"
          :closable="closableTag"
          type="info"
          :size="collapseTagSize"
          @click="handelTagClick"
          @close="deleteTag(index, item)"
          disable-transitions>
          <span class="el-select__tags-text">{{ item }}</span>
        </el-tag>
      </transition-group>

      <input v-model="query"
             v-if="allowCreate"
             ref="input"
             type="text"
             class="el-select__input"
             :class="[selectSize ? `is-${ selectSize }` : '']"
             :disabled="disabled"
             :readonly="readonly"
             @focus="handleFocus"
             @blur="handleBlur"
             :style="{ 'flex-grow': '1', width: inputLength / (inputWidth - 32) + '%', 'max-width': inputWidth - 42 + 'px' }"
             @keyup.enter.prevent.stop="select">
    </div>
    <el-input ref="reference"
              :disabled="disabled"
              :readonly="readonly"
              :size="selectSize"
              :placeholder="currentPlaceholder"
              @focus="handleFocus">
      <template slot="prefix" v-if="$slots.prefix">
        <slot name="prefix"></slot>
      </template>
      <template slot="suffix">
        <i :class="['el-input__icon', icon, {'el-select__caret':active}]" @click="handelIconClick"></i>
      </template>
    </el-input>
  </div>
</template>

<script>
  import {addResizeListener, removeResizeListener} from 'element-ui/lib/utils/resize-event'

  export default {
    inject: {
      elForm: {
        default: ''
      },

      elFormItem: {
        default: ''
      }
    },
    props: {
      // 标签值
      value: {
        type: Array,
        default() {
          return []
        }
      },
      // 占位
      placeholder: {
        type: String,
        default: '请输入标签'
      },
      // 是否折叠标签
      collapseTags: Boolean,
      // 禁用
      disabled: Boolean,
      // 只读
      readonly: Boolean,
      // 尺寸
      size: {
        type: String,
        default: '',
        validator(val) {
          return ['medium', 'small', 'mini', ''].includes(val)
        }
      },
      // 图标
      icon: {
        type: String,
        default: 'el-icon-price-tag'
      },

      active: {
        type: Boolean,
        default: false
      },
      // 是否可以关闭tag
      closable: {
        type: Boolean,
        default: true
      },
      // 允许新增
      allowCreate: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        query: '',
        tags: [...this.value],
        initialInputHeight: 0,
        inputLength: 20,
        inputWidth: 0
      }
    },
    computed: {
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      selectSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      currentPlaceholder() {
        return (this.tags.length > 0 || this.query) ? '' : this.placeholder
      },
      collapseTagSize() {
        return ['small', 'mini'].indexOf(this.selectSize) > -1
          ? 'mini'
          : 'small';
      },
      closableTag() {
        if (!this.closable) return false
        return !this.disabled && !this.readonly
      }
    },
    watch: {
      value(val) {
        this.tags = [...val]
      },
      tags() {
        this.$nextTick(() => {
          this.resetInputHeight()
        })
      },
      disabled() {
        this.$nextTick(() => {
          this.resetInputHeight()
        })
      },
      readonly() {
        this.$nextTick(() => {
          this.resetInputHeight()
        })
      },
      selectSize(val) {
        this.$nextTick(() => {
          this.setInitialInputHeight()
          this.resetInputHeight()
          this.resetInputWidth()
        })
      }
    },
    methods: {
      handelTagClick() {
        this.$emit('tag-click')
      },
      handleFocus() {
        this.$refs.input && this.$refs.input.focus()
        this.$emit('focus')
      },
      handleBlur() {
        this.select()
        this.$emit('blur')
      },
      select() {
        if (!this.allowCreate) return
        if (!this.query) return
        this.tags.push(this.query)
        this.query = ''
        this.$emit('input', this.tags)
        this.$emit('change', this.tags)
      },
      deleteTag(index, tag) {
        if (index > -1) {
          const tags = [...this.tags]
          tags.splice(index, 1)
          this.$emit('input', tags)
          this.$emit('change', tags)
          this.$emit('close-tag', index, tag, tags)
          this.handleFocus()
        }
      },
      resetInputWidth() {
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
      },
      resetInputHeight() {
        if (this.collapseTags) return

        this.$nextTick(() => {
          if (!this.$refs.reference) return
          let inputChildNodes = this.$refs.reference.$el.childNodes;
          let input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0];
          const tags = this.$refs.tags;
          const sizeInMap = this.initialInputHeight || 40;
          input.style.height = this.tags.length === 0
            ? sizeInMap + 'px'
            : Math.max(
            tags ? (tags.clientHeight + (tags.clientHeight > sizeInMap ? 6 : 0)) : 0,
            sizeInMap
          ) + 'px';
        })

      },
      handleResize() {
        this.resetInputWidth();
        this.resetInputHeight();
      },
      setInitialInputHeight() {
        const sizeMap = {
          medium: 36,
          small: 32,
          mini: 28
        };
        this.initialInputHeight = sizeMap[this.selectSize] || 40;
      },
      handelIconClick() {
        this.$emit('icon-click')
      }
    },
    mounted() {
      addResizeListener(this.$el, this.handleResize);
      this.setInitialInputHeight()

    },
    beforeDestroy() {
      if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
    }
  }
</script>
