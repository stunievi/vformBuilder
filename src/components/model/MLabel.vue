<template>
    <font :style="{color: data.color}">{{data.text}}</font>
</template>
<script>
   export default {
       props:["data"],
       data(){
           return {}
       },
       created() {
           this.data = this.data ||{};
           this.data.color = this.data.color || "black";
       }
   }
</script>