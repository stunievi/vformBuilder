<script>
  /**
   * 键值对表格
   * @module widgets/xdh-dict-table
   */

  /**
   * 作用域插槽
   * @member scopeSlots
   * @property {string} label 定义键内容， 参数：item、row、column
   * @property {string} value 定义值内容，参数：label、row、column
   */

  export default {
    name: 'XdhDictTable',
    /**
     * 属性参数
     * @property {Array} data 键值对数据数组，数据项包含 label / value
     * @property {Object} prop 数据项映射对象 {label, value}
     * @property {number} group 一行展示几对数据项
     * @property {string} labelAlign 名称对齐方式
     * @property {string} valueAlign 值对齐方式
     */
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      prop: {
        type: Object,
        default() {
          return {
            label: 'label',
            value: 'value'
          }
        }
      },
      group: {
        type: Number,
        default: 2
      },
      labelAlign: {
        type: String,
        default: 'left',
        validator(val) {
          return ['left', 'center', 'right'].includes(val)
        }
      },
      valueAlign: {
        type: String,
        default: 'left',
        validator(val) {
          return ['left', 'center', 'right'].includes(val)
        }
      }
    },
    computed: {
      rows() {
        return Math.ceil(this.data.length / this.group)
      },
      items() {
        let array = [], rowArray = []
        this.data.forEach((item, index) => {
          let columnIndex = index % this.group
          if (columnIndex === 0) {
            rowArray = [item]
            array.push(rowArray)
          } else {
            rowArray.push(item)
          }
        })
        let lastRow = array[array.length - 1]
        if (lastRow) {
          while (lastRow.length < this.group) {
            lastRow.push(null)
          }
        }
        return array
      },
      classes() {
        return [
          'xdh-dict-table',
          `is-label-${this.labelAlign}`,
          `is-value-${this.valueAlign}`
        ]
      }
    },
    render() {
      return (
        <table class={this.classes}>
          <tbody>{
            this.items.map((row, i) => {
              return (
                <tr class="xdh-dict-table__row">
                  {
                    row.map((col, j) => {
                      return (
                        [
                          <th class={{'xdh-dict-table__label': true, 'is-disabled': !col}}>
                            {
                              col
                                ? (this.$scopedSlots.label ? this.$scopedSlots.label({
                                  item: col,
                                  column: j,
                                  row: i
                                }) : col[this.prop.label])
                                : ''
                            }
                          </th>,
                          <td class={{'xdh-dict-table__value': true, 'is-disabled': !col}}>
                            {
                              col
                                ? (this.$scopedSlots.value ? this.$scopedSlots.value({
                                  item: col,
                                  column: j,
                                  row: i
                                }) : col[this.prop.value])
                                : ''
                            }
                          </td>
                        ]
                      )
                    })
                  }
                </tr>
              )
            })

          }</tbody>
        </table>
      )
    }
  }
</script>

