<template>
    <el-row :gutter="20" class="box-component">
        <el-col class="inner" :span="24 / data.cols" v-for="(v,i) of data.cols" :key="i">
            <template v-for="v in data.children[i] || []">
                <div  class="wrap" :style="{justifyContent: data.align}" :key="v">
                    <template v-if="v.type != 'button'">
                        <label class="k">
                            {{v.name}}
                        </label>
                        <MText v-if="v.type == 'text'" :data="v" ref="widgets"/>
                        <MSelect v-if="v.type == 'select'" :data="v" ref="widgets"/>
                        <MDate v-if="v.type == 'date'" :data="v" ref="widgets"/>
                        <MLabel v-if="v.type == 'label'" :data="v" ref="widgets"/>
                    </template>
                    <template v-else>
                        <MButton :data="v" />
                    </template>
                </div>
            </template>
        </el-col>
    </el-row>
</template>
<script>
    import MText from "./MText"
    import MSelect from "./MSelect"
    import MDate from "./MDate"
    import MLabel from "./MLabel"
    import MButton from "./MButton"
    export default {
        components:{
            MText,
            MSelect,
            MDate,
            MLabel,
            MButton
        },
        props:["data"],
        data(){
           return {}
        },
        created() {
            this.data = this.data || {};
            this.data.cols = Number(this.data.cols || 1);
            this.data.children = this.data.children || [];
            this.data.align = this.data.align || "left";
        }
    }
</script>
<style scoped >
    .box-component{
        margin-bottom: 10px;
    }
    .inner{
        border: 2px dotted  #dedede;
        min-height: 40px;
        padding-top: 10px;
        padding-bottom: 10px;
        /*display: flex;*/
        /*flex-direction: column;*/
    }

    .wrap{
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        
    }
    .k{
            white-space: nowrap;
            margin-right: 10px;
        }
</style>