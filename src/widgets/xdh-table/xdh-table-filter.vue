<template>
  <el-popover ref="filterPopover"
              placement="bottom"
              width="280"
              trigger="click"
              class="filter-box"
              @show="handleShow"
              v-model="isShowed">
    <slot>
      <el-form :inline="true" size="mini" class="filter-box__form">
        <el-form-item :label="colProps.label">
          <xdh-combo v-model="dictValue"
                     :option-data="dictData"
                     clearable
                     class="filter-box__item"
                     v-if="filterType==='dict'"></xdh-combo>

          <el-input v-model="stringValue"
                    v-if="filterType==='string'"
                    class="filter-box__item"></el-input>

          <el-date-picker v-model="dateValue"
                          type="daterange"
                          start-placeholder="开始"
                          end-placeholder="结束"
                          value-format="yyyy-MM-dd"
                          class="filter-box__item"
                          v-if="filterType==='date'">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
        </el-form-item>
      </el-form>
    </slot>

    <!--此处阻止冒泡是为了当出现sortable排序时，会触发th的点击-->
    <i class="el-icon-arrow-down filter-box__button" ref="filterButton" slot="reference"
       @click="handleShowPopper"></i>
  </el-popover>
</template>

<script>
  import XdhCombo from '../xdh-combo'
  import bus from '@/utils/bus'

  const noop = function () {
    return Promise.resolve()
  }

  export default {
    name: 'XdhTableFilter',
    components: {
      XdhCombo
    },
    props: {
      colProps: {
        type: Object
      },
      openFilter: {
        type: Function,
        default: noop
      }
    },
    data() {
      return {
        isShowed: false,
        parentCell: null,
        parentTH: null,

        dictValue: null,
        stringValue: null,
        dateValue: null,
        dictData: []
      }
    },
    computed: {
      filterType() {
        return this.colProps.filterType
      }
    },
    methods: {
      handleFilter() {
        this.$emit('on-filter', this.colProps, this[this.filterType + 'Value'])
        this.hidePopper();
      },
      handleShow() {
        this.openFilter(this.colProps).then(res => {
          if (this.filterType === 'dict') {
            this.dictData = res
          }
        })
        bus.$emit('on-filter-column', this)
      },
      handleShowPopper(e) {
        e.stopPropagation()
      },
      hidePopper() {
        this.isShowed = false
      }
    },
    mounted() {
      this.parentCell = this.$el.parentNode.parentNode
      this.parentCell.appendChild(this.$refs.filterButton)
    },
    beforeDestroy() {
      this.parentCell.removeChild(this.$refs.filterButton)

    }
  }
</script>

<style lang="scss" scoped>
  .filter-box {
    &__form {
      .el-form-item /deep/ {
        margin-bottom: 0;
      }

      .filter-box__item /deep/ {
        width: 150px;
      }
    }

    &__button {
      cursor: pointer;
      padding: 0 3px;
    }
  }
</style>
