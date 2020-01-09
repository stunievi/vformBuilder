<template>
  <div :class="['xdh-calendar',{'xdh-calendar--full':fullScreen}]">
    <div class="xdh-calendar__header">
      <div class="xdh-calendar__select xdh-calendar__select--year">
        <el-select v-model="yearValue"
                   placeholder="年份"
                   :size="fullScreen?'small':'mini'"
                   @change="selectYear">
          <el-option v-for="item in yearData"
                     :key="item.value"
                     :label="item.text"
                     :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="xdh-calendar__select xdh-calendar__select--month" v-show="dayShowed">
        <el-select v-model="monthValue"
                   placeholder="月份"
                   :size="fullScreen?'small':'mini'"
                   @change="selectMonth">
          <el-option v-for="item in 12"
                     :key="item"
                     :label="`${item}月`"
                     :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="xdh-calendar__select xdh-calendar__select--radio">
        <el-radio-group v-model="radioValue" :size="fullScreen?'small':'mini'" @change="changeMode">
          <el-radio-button label="month">月</el-radio-button>
          <el-radio-button label="year">年</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="xdh-calendar__body">
      <div class="xdh-calendar__body--inner" v-show="monthShowed">
        <div class="xdh-calendar__range xdh-calendar__range--month">
          <template v-for="(month,index) in 12">
            <div :key="index"
                 :class="['xdh-calendar__range--block',setToday(month),{'xdh-calendar__range--active':month === monthValue}]"
                 @click="selectMonth(month)">
              <div class="xdh-calendar__text">
                <div class="xdh-calendar__text--value">{{month}}月</div>
                <div class="xdh-calendar__text--content">
                  <slot name="month-content" :date="parseDate('month',month)" :month="month"></slot>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="xdh-calendar__body--inner" v-show="dayShowed">
        <div class="xdh-calendar__range xdh-calendar__range--week">
          <template v-for="(week,index) in weekData">
            <div class="xdh-calendar__range--block"
                 :key="index">
              {{week}}
            </div>
          </template>
        </div>
        <div class="xdh-calendar__range xdh-calendar__range--day">
          <template v-for="(day,index) in dayData">
            <div :key="index"
                 :class="['xdh-calendar__range--block',{'xdh-calendar__range--gray': day.type !== 'curr'},day.dClass,{'xdh-calendar__range--active':day.type === 'curr' && day.value === dayValue}]"
                 @click="selectDay(day)">
              <div class="xdh-calendar__text">
                <div class="xdh-calendar__text--value">{{day.text}}</div>
                <div class="xdh-calendar__text--content">
                  <slot name="day-content" :date="parseDate('day',day)" :day="day.value"></slot>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  /**
   * 日历组件
   * @module widgets/xdh-calendar
   */
  import date from '@/utils/date'

  /**
   * 插槽
   * @member slots
   * @property {string} month-content 每个月份的自定义内容
   * @property {string} day-content 每天的自定义内容
   */

  /**
   * @export
   */
  export default {
    name: 'XdhCalendar',
    /**
     * 属性参数
     * @property {string} [format='MM/dd/yyyy'] 日期格式
     * @property {Boolean} [fullScreen=true] 是否全屏显示
     * @property {String} [mode='month'] 初始模式，month/year
     * @property {Boolean} [autoSwitch=false] 当显示年选择时，点击月份框之后，是否直接切换到显示日期
     */
    props: {
      value: {
        type: [String, Date]
      },
      format: {
        type: String,
        default: 'yyyy-MM-dd'
      },
      fullScreen: {
        type: Boolean,
        default: true
      },
      mode: {
        type: String,
        default: 'month'
      },
      autoSwitch: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        radioValue: this.mode,
        yearValue: '',
        monthValue: '',
        dayValue: '',
        yearData: [],
        // monthData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        weekData: ['一', '二', '三', '四', '五', '六', '日'],
        dayData: [],
        today: new Date(),
        currDate: null
      }
    },
    computed: {
      monthShowed() {
        return this.radioValue === 'year'
      },
      dayShowed() {
        return this.radioValue === 'month'
      }
    },
    watch: {
      currDate(val) {
        this.$emit('input', date(val, this.format))
        this.renderDate()
      }
    },
    mounted() {
      this.currDate = this.resetDate(this.value)
      this.dayValue = this.currDate.getDate()
    },
    methods: {
      /**
       * 切换面板
       */
      changeMode() {
        /**
         * 切换年份月份面板时触发
         * @event on-change-mode
         * @param {String} value 切换面板名称
         */
        this.$emit('on-change-mode', this.radioValue)
      },
      /**
       * 设置今日样式
       */
      setToday(month) {
        if (this.yearValue === this.today.getFullYear() && (month - 1) === this.today.getMonth()) {
          return 'xdh-calendar__range--today'
        }
      },
      /**
       * 转换插槽的日期
       */
      parseDate(type, value) {
        if (type === 'day') {
          if (value.type === 'curr') {
            return new Date(this.yearValue, this.monthValue - 1, value.value)
          } else if (value.type === 'prev') {
            return new Date(this.yearValue, this.monthValue - 2, value.value)
          } else {
            return new Date(this.yearValue, this.monthValue, value.value)
          }
        } else if (type === 'month') {
          return new Date(this.yearValue, value - 1, 1)
        }
      },
      /**
       * 首次加载重置时间
       */
      resetDate(dateStr) {
        if (!dateStr) {
          return (new Date())
        }
        let obj = typeof dateStr === 'string' ? new Date(dateStr.replace(/-/g, '/')) : dateStr
        obj = new Date(obj.getFullYear(), obj.getMonth(), obj.getDate())

        return obj
      },
      /**
       * 获取当月天数
       * @param year
       * @param month
       * @returns {number}
       */
      getDayCount(year, month) {
        const curDate = new Date();
        curDate.setFullYear(year);
        curDate.setMonth(month + 1);
        curDate.setDate(0);
        return curDate.getDate();
      },
      /**
       * 修正指定年月
       * @param year
       * @param month
       * @returns {{year: *, month: *}}
       */
      getYearMonth(year, month) {
        if (month > 11) {
          year++
          month = 0
        } else if (month < 0) {
          year--
          month = 11
        }

        return {year: year, month: month}
      },
      /**
       * 渲染日期
       */
      renderDate() {
        this.yearData = []
        this.dayData = []
        const currYear = this.currDate.getFullYear()
        const currMonth = this.currDate.getMonth()
        this.monthValue = currMonth + 1

        // 显示选中的年份
        let yearStr = currYear.toString()
        let firstYearOfDecade = (yearStr.substring(0, yearStr.length - 1) + 0) - 1
        for (let i = 0; i < 12; i++) {
          const year = firstYearOfDecade + i
          this.yearData.push({
            text: year + '年',
            value: year
          })
        }
        this.yearValue = currYear

        // 显示日期
        // 选中月的周和日期处理
        const currMonthFirstDay = new Date(currYear, currMonth, 1)
        let currMonthFirstWeek = currMonthFirstDay.getDay()
        const currMonthDayCount = this.getDayCount(currYear, currMonth)
        // 处理周日为0的特殊情况
        if (currMonthFirstWeek === 0) {
          currMonthFirstWeek = 7
        }
        // 若选中月1号不是周一,先放入上个月的补充天数
        if (currMonthFirstWeek > 1) {
          const prevMonth = this.getYearMonth(currYear, currMonth - 1)
          const prevMonthDayCount = this.getDayCount(prevMonth.year, prevMonth.month)

          for (let i = 1; i < currMonthFirstWeek; i++) {
            const day = prevMonthDayCount - currMonthFirstWeek + i + 1
            this.dayData.push({
              text: day,
              value: day,
              type: 'prev'
            })
          }
        }

        // 放入选中月日期
        for (let i = 1; i <= currMonthDayCount; i++) {
          let dClass
          if (currYear === this.today.getFullYear() && currMonth === this.today.getMonth() && i === this.today.getDate()) {
            dClass = 'xdh-calendar__range--today'
          }
          this.dayData.push({
            text: i,
            value: i,
            type: 'curr',
            dClass: dClass
          })
        }

        // 补充下个月的日期
        if (this.dayData.length < 42) {
          const need = 42 - this.dayData.length
          for (let i = 1; i <= need; i++) {
            this.dayData.push({
              text: i,
              value: i,
              type: 'next'
            })
          }
        }
      },
      /**
       * 选择某一天
       * @param day
       */
      selectDay(day) {
        this.dayValue = day.value
        let month, date
        if (day.type !== 'curr') {
          if (day.type === 'prev') {
            month = this.monthValue - 1
          } else if (day.type === 'next') {
            month = this.monthValue + 1
          }
          date = this.getYearMonth(this.yearValue, month - 1)
          this.currDate = new Date(date.year, date.month, day.value)
        } else {
          this.currDate = new Date(this.currDate.getFullYear(), this.currDate.getMonth(), day.value)
        }

        /**
         * 选择日期时触发
         * @event on-select-day
         * @param {String} date 带格式的日期
         */
        this.$emit('on-select-day', this.currDate)
      },
      /**
       * 选择某一月份
       * @param month
       */
      selectMonth(month) {
        if (!month) {
          month = this.monthValue
        }
        // 点击月份切换日期
        if (this.radioValue === 'year' && this.autoSwitch) {
          this.radioValue = 'month'
        }
        const year = Number(this.yearValue)
        this.dayValue = 1
        this.currDate = new Date(year, month - 1, 1)

        /**
         * 选择月份时触发
         * @event on-select-month
         * @param {String} date 带格式的日期
         */
        this.$emit('on-select-month', this.currDate)
      },
      /**
       * 选择某一月份
       * @param year
       */
      selectYear(year) {
        if (!year) {
          year = this.yearValue
        }
        this.currDate = new Date(year, this.monthValue - 1, this.dayValue || 1)

        /**
         * 选择年份时触发
         * @event on-select-year
         * @param {String} date 带格式的日期
         */
        this.$emit('on-select-year', this.currDate)
      }
    }
  }
</script>
