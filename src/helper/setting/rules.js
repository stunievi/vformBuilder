const list = [
  {
    type: 'switch',
    prop: 'required',
    label: '必填'
  },
  {
    type: 'input',
    prop: 'message',
    label: '提示文本',
    rules: [
      {required: true}
    ]
  },
  {
    type: 'radio',
    prop: 'trigger',
    label: '触发方式',
    value: '',
    props: {
      button: true
    },
    options: [
      'change',
      'blur'
    ]
  },
  {
    type: 'select',
    prop: 'type',
    label: '数据类型',
    options: [
      'string',
      'number',
      'boolean',
      'integer',
      'float',
      'array',
      'date',
      'url',
      'email'
    ]
  },
  {
    type: 'input',
    prop: 'pattern',
    label: '表达式'
  },
  {
    type: 'number',
    prop: 'min',
    label: '最小值'
  },
  {
    type: 'number',
    prop: 'max',
    label: '最大值'
  },
  {
    type: 'number',
    prop: 'len',
    label: '长度'
  }
]


export function getModel(list = []) {
  let m = {}
  list.forEach(item => {
    if (typeof item.value !== 'undefined') {
      m[item.prop] = item.value
    }
  })
  return m
}

export default {
  fields: list,
  model: getModel(list)
}
