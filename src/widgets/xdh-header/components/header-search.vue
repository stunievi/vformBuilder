<template>
  <div class="xdh-header__search" :style="styles">
    <slot>
      <el-input :placeholder="placeholder"
                v-model="searchText"
                :size="size">
        <el-select v-model="currentType"
                   slot="prepend"
                   placeholder="请选择"
                   v-if="types && types.length>0">
          <el-option v-for="(item, index) in types"
                     :key="index"
                     :label="item[prop.label]"
                     :value="item[prop.value]"></el-option>
        </el-select>
        <el-button slot="append"
                   icon="el-icon-search"
                   @click="handleSearch"></el-button>
      </el-input>
    </slot>
  </div>
</template>

<script>
  export default {
    props: {
      width: {
        type: String
      },
      size: {
        type: String
      },
      placeholder: {
        type: String,
        default: '请输入查询关键字'
      },
      types: {
        type: Array,
        default() {
          return []
        }
      },
      type: {
        type: [String, Number]
      },
      keyword: {
        type: String
      },
      prop: {
        type: Object,
        default() {
          return {
            label: 'label',
            value: 'value'
          }
        }
      }
    },
    data() {
      return {
        searchText: this.keyword,
        currentType: this.type
      }
    },
    computed: {
      styles() {
        return {
          width: this.width
        }
      }
    },
    watch: {
      type(val) {
        this.currentType = val
      },
      keyword(val) {
        this.searchText = val
      }
    },
    methods: {
      handleSearch(e) {
        this.$emit('search', this.searchText, this.currentType, e)
      }
    },
    created() {
    }
  }
</script>
