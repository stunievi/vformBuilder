<template>
  <div>
    <el-row :gutter="gutter" v-if="title">
      <el-col :span="24">
        <slot name="title" :title="title">{{title}}</slot>
      </el-col>
    </el-row>
    <el-row :gutter="gutter">
      <el-col :span="24/col" class="el-row-item" v-for="(item,index) in list" :key="index">
        <slot :item="item">
          <el-row :gutter="gutter">
            <el-col :span="layout === 'vertical'?24:4">{{item.title}}</el-col>
            <el-col :span="layout === 'vertical'?24:18">{{item.content}}</el-col>
          </el-row>
        </slot>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  /**
   * DescriptionList 描述列表组件
   * @module widgets/xdh-description-list
   */

  /**
   * 插槽
   * @member slots
   * @property {string} default 默认插槽  slot-scope = {list:{title:'',content:''}}
   * @property {string} title 列表标题区域 slot-scope = {title:''}
   */
  export default {
    name: 'XdhDescriptionList',
    /**
     * 属性参数
     * @member
     * @property {string} title 列表标题
     * @property {array} list 列表项数据
     * @property {string} list.title 列表项标题
     * @property {string} list.content 列表项内容
     * @property {string} [layout='horizontal'] 布局方式 可选：'horizontal', 'vertical'
     * @property {number} [col=3] 指定信息最多分几列展示，最终一行几列由 col 配置结合响应式规则决定 (0 < col <= 4)
     * @property {number} [gutter=20] 列表项间距，单位为 px
     */
    props: {
      title: {
        type: String,
        default: ''
      },
      list: {
        type: Array,
        default() {
          return []
        }
      },
      layout: {
        type: String,
        default: 'horizontal'
      },
      col: {
        type: Number,
        default: 3
      },
      gutter: {
        type: Number,
        default: 20
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-row-item {
    margin-bottom: 15px;
  }
</style>
