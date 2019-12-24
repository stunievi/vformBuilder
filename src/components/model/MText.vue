<template>
    <el-input v-model="value" type="input" class="v" :placeholder="data.hint"/>
</template>
<script>
    export default {
        props:["data"],
        data(){
            return {
                value:""
            }
        },
        created() {
            this.data = this.data||{};
        }
    }

</script>
<style scoped>

</style>
