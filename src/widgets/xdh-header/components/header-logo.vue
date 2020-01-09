<template>
  <div class="xdh-header__logo">
    <slot><img v-if="src" :src="src"/></slot>
  </div>
</template>

<script>
  export default {
    props: {
      src: String
    }
  }
</script>
