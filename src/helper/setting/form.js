const formFields = [
  {
    label: '行内模式',
    prop: 'inline',
    type: 'switch',
    value: false
  },
  {
    label: '隐藏必填标识',
    prop: 'hideRequiredAsterisk',
    type: 'switch',
    value: false
  },
  {
    label: '显示底部边框',
    prop: 'footerBorder',
    type: 'switch',
    value: true
  },
  {
    label: '显示底部',
    prop: 'footer',
    type: 'switch',
    value: true
  },
  {
    type: 'divider'
  },
  {
    label: '标签位置',
    prop: 'labelPosition',
    type: 'radio',
    value: 'right',
    props: {
      button: true
    },
    options: [
      {
        label: 'left',
        value: 'left'
      },
      {
        label: 'right',
        value: 'right'
      },
      {
        label: 'top',
        value: 'top'
      }
    ]
  },
  {
    label: '组件尺寸',
    prop: 'size',
    type: 'radio',
    value: '',
    props: {
      button: true
    },
    options: [
      {
        label: '默认',
        value: ''
      },
      {
        label: 'large',
        value: 'large'
      },
      {
        label: 'medium',
        value: 'medium'
      },
      {
        label: 'small',
        value: 'small'
      },
      {
        label: 'mini',
        value: 'mini'
      }
    ]
  },
  {
    label: '底部对齐',
    prop: 'footerAlign',
    type: 'radio',
    value: 'right',
    props: {
      button: true
    },
    options: [
      {
        label: 'label',
        value: 'label'
      },
      {
        label: 'left',
        value: 'left'
      },
      {
        label: 'center',
        value: 'center'
      },
      {
        label: 'right',
        value: 'right'
      },
      {
        label: 'inline',
        value: 'inline'
      }
    ]
  },
  {
    label: '底部尺寸',
    prop: 'footerSize',
    type: 'radio',
    value: '',
    props: {
      button: true
    },
    options: [
      {
        label: '默认',
        value: ''
      },
      {
        label: 'large',
        value: 'large'
      },
      {
        label: 'medium',
        value: 'medium'
      },
      {
        label: 'small',
        value: 'small'
      },
      {
        label: 'mini',
        value: 'mini'
      }
    ]
  },
  {
    label: '内行模式尺寸',
    prop: 'inlineSize',
    type: 'radio',
    value: '',
    props: {
      button: true
    },
    options: [
      {
        label: '默认',
        value: ''
      },
      {
        label: 'large',
        value: 'large'
      },
      {
        label: 'medium',
        value: 'medium'
      },
      {
        label: 'small',
        value: 'small'
      }
    ]
  },
  {
    label: '验证信息显示',
    prop: 'validateMsg',
    type: 'radio',
    value: '',
    props: {
      button: true
    },
    options: [
      {
        label: '默认',
        value: ''
      },
      {
        label: 'top',
        value: 'top'
      },
      {
        label: 'right',
        value: 'right'
      },
      {
        label: 'bottom',
        value: 'bottom'
      }
    ]
  },
  {
    type: 'divider'
  },
  {
    label: '标签宽度',
    prop: 'labelWidth',
    type: 'input'
  },
  {
    label: '标签后缀',
    prop: 'labelSuffix',
    type: 'input'
  },
  {
    label: '提交按钮文本',
    prop: 'submitText',
    type: 'input',
    value: '提交'
  },
  {
    label: '重置按钮文本',
    prop: 'resetText',
    type: 'input',
    value: '重置'
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
  fields: formFields,
  model: getModel(formFields)
}
