import {options, tree} from './defaultOptions'

export default [
  {
    type: 'input',
    title: '文本框',
    props: {}
  },
  {
    type: 'input',
    title: '多行文本',
    props: {
      type: 'textarea',
      rows: 3
    }
  },
  {
    type: 'radio',
    title: '单选框',
    props: {},
    options: options
  },
  {
    type: 'checkbox',
    title: '多选框',
    props: {},
    options: options
  },
  {
    type: 'switch',
    title: '开关',
    props: {
      value: false
    }
  },
  {
    type: 'select',
    title: '下拉框',
    props: {},
    options: options
  },
  {
    type: 'date',
    title: '日期',
    props: {}
  },
  {
    type: 'time',
    title: '时间',
    props: {}
  },
  {
    type: 'cascader',
    title: '级联',
    props: {},
    options: tree,
    value: []
  },
  {
    type: 'tree',
    title: '下拉树',
    props: {},
    options: tree,
    value: []
  },
  {
    type: 'number',
    title: '数字',
    props: {}
  },
  {
    type: 'rate',
    title: '评分',
    props: {},
    value: 3
  },
  {
    type: 'slider',
    title: '滑块',
    props: {},
    value: 1
  },
  {
    type: 'upload',
    title: '上传',
    props: {
      action: 'https://jsonplaceholder.typicode.com/posts/'
    }
  },
  {
    type: 'range',
    title: '范围',
    props: {}
  },

  {
    type: 'tag',
    title: '标签',
    props: {}
  },
  {
    type: 'inputTag',
    title: '标签框',
    props: {}
  },
  {
    type: 'color',
    title: '颜色',
    props: {}
  },
  {
    type: 'editor',
    title: '富文本',
    props: {}
  },
  {
    type: 'divider',
    title: '分隔线',
    helper: true,
    props: {
      content: '分割线'
    }
  }
]

