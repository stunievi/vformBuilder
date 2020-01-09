import Divider from '@/widgets/xdh-form/items/divider'

export default {
  ...Divider.props,
  contentPosition: {
    type: 'select',
    options: [
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
      }
    ]
  }
}
