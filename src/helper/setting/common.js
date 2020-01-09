export default [
  {
    label: '字段名',
    type: 'input',
    prop: 'prop',
    rules: [
      {required: true}
    ]
  },
  {
    label: '标签文本',
    type: 'input',
    prop: 'label'
  },
  {
    label: '标签宽度',
    type: 'input',
    prop: 'labelWidth',
    props: {
      placeholder: '单位: px'
    }
  },
  {
    label: '内容宽度',
    type: 'input',
    prop: 'contentWidth',
    props: {
      placeholder: '只对内行模式生效，单位: px'
    }
  },
  {
    label: '字典编码',
    type: 'input',
    prop: 'dict'
  },
  {
    label: '独占行',
    type: 'switch',
    prop: 'block'
  }
]
