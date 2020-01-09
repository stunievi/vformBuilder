export default (_self, h) => {
  let icons = [];
  // 配置按钮
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!_self.obj.config) {
    icons.push(h('el-button', {
      props: {
        icon: 'el-icon-setting',
      },
      nativeOn: {
        click() {
          _self.$emit('handleConfEle', _self.index);
        }
      }
    }));
  }
  // 删除按钮
  icons.push(h('el-button', {
    props: {
        icon: 'el-icon-minus'
    },
    nativeOn: {
      click() {
        _self.$emit('handleRemoveEle', _self.index);
      }
    }
  }));
  const item_icon = h('div', {
    class: {
      'item-icon': true
    }
  }, icons);
  return item_icon;
}
