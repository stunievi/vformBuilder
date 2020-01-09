<template>
  <component :is="component" v-on="$listeners" v-bind="bindProps" v-model="fieldValue"></component>
</template>

<script>
  export default {
    props: {
      value: {
        type: [String, Date, Array]
      },
      // 是否picker模式
      picker: Boolean,
      // for time-select
      start: String,
      // for time-select
      end: String,
      // for time-select
      step: String,
      // for time-select
      minTime: String,
      // for time-select
      maxTime: String,
      // for time-picker
      selectableRange: [String, Array]
    },
    computed: {
      fieldValue: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      },
      component() {
        return this.picker ? 'el-time-picker' : 'el-time-select'
      },
      bindProps() {
        const picker = {
          start: this.start,
          end: this.end,
          step: this.step,
          minTime: this.minTime,
          maxTime: this.maxTime,
          selectableRange: this.selectableRange,
          format: this.$attrs.format
        }
        const pickerOptions = {}
        Object.keys(picker).forEach(n => {
          if (picker[n]) {
            pickerOptions[n] = picker[n]
          }
        })
        return {
          pickerOptions: pickerOptions,
          ...this.$attrs
        }
      }
    }
  }
</script>
