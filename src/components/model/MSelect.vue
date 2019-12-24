<template>
    <el-select v-model="value" :placeholder="data.hint">
        <el-option v-for="v in data.options || []" :label="v" :value="v" :key="v"></el-option>
    </el-select>
</template>
<script>
    export default {
        props:["data"],
        data(){
            return {
                value:""
            }
        }
    }
</script>

<style scoped >

</style>