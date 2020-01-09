<template>
  <div class="xdh-header__tool">
    <slot>
      <div class="header-tool-item" :class="classes"
           v-for="(item,index) in data"
           :key="index"
           @click="handleClick(item)">
        <i :class="item[props.icon]"></i>
        {{item[props.text]}}
      </div>
    </slot>
  </div>
</template>

<script>
  export default {
    props: {
      inline: Boolean,
      data: {
        type: Array,
        default() {
          return []
        }
      },
      props: {
        type: Object,
        default() {
          return {
            id: 'id',
            icon: 'icon',
            text: 'text'
          }
        }
      }
    },
    computed: {
      classes() {
        return {
          'is-inline': this.inline
        }
      }
    },
    methods: {
      handleClick(item) {
        this.$emit('click', item)
      }
    }
  }
</script>
