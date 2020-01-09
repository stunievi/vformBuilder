<template>
    <div class="box h100">
        <div class="left h100">
            <el-input type="textarea" v-model="value"></el-input>
        </div>
        <div id="right" class="right h100 ovy">
            <template v-for="v in data">
                <Box v-if="v.type == 'box'" :data="v" ref="boxes" :key="v"></Box>
            </template>

            <el-button @click="save">保存</el-button>
            {{values}}
        </div>
    </div>
</template>
<script>
    import Box from "../../components/model/Box"

    export default {
        components: {
            Box
        },
        watch: {
            value(nv) {
                this.data = [];
                this.$nextTick(() => {
                    this.data = JSON.parse(nv);
                })
                console.log(this.data);
            }
        },
        data() {
            return {
                value: "",
                data: [],
                values: ""
            }
        },
        mounted() {
            this.value = JSON.stringify([
                {
                    "type": "box",
                    "cols": "1",
                    align: "center",
                    "children": [
                        [
                            {
                                "type": "text",
                                "name": "姓名",
                                hint: "请输入姓名",
                            }

                        ]
                    ]
                },
                {
                    "type": "box",
                    "cols": "2",
                    align: "center",
                    children: [
                        [
                            {
                                name: "出生日期",
                                type: "date",
                                hint: "请输入开始日期"
                            },
                        ], [
                            {
                                name: "性别",
                                type: "select",
                                options: [
                                    "男",
                                    "女"
                                ],
                                hint: "请选择性别"
                            }
                        ]
                    ]
                },

                {
                    "type": "box",
                    "cols": "3",
                    children: [
                        [
                            {
                                "type": "text",
                                "name": "工号"
                            },
                        ],
                        [
                            {
                                name: "民族",
                                type: "select",
                                options: [
                                    "汉",
                                    "回"
                                ],
                                hint: "请选择民族"
                            }
                        ], [
                            {
                                "type": "text",
                                "name": "面貌"
                            }
                        ]
                    ]
                },
                {
                    "type": "box",
                    "cols": "2",
                    children: [
                        [
                            {
                                "type": "text",
                                "name": "身份证号"
                            },
                        ],
                        [
                            {
                                "type": "text",
                                "name": "手机号"
                            },
                        ]
                    ]
                },
                {
                    "type": "box",
                    "cols": "2",
                    children: [
                        [
                            {
                                "type": "text",
                                "name": "住址"
                            },
                        ],
                        [
                            {
                                name: "婚姻",
                                type: "select",
                                options: [
                                    "已婚",
                                    "未婚"
                                ]
                            }
                        ]
                    ]
                },
                // {
                //     type:"box",
                //     cols:1,
                //     align:"center",
                //     children:[
                //         [
                //             {
                //                 type:"button",
                //                 text:"提交定定"
                //             }
                //         ]
                //     ]
                // },
            ]);
        },
        methods: {
            save() {
                var vals = {};
                // var formData = []
                this.$refs.boxes.forEach(e => {
                    // console.log(e.$refs)
                    // ;
                    (e.$refs.widgets || []).forEach(ee => {
                        console.log(ee.data)
                        if (ee.data && ee.data.name) {
                            // console.log(ee.data.)
                            vals[ee.data.name] = ee.value;
                            // vals["value"] = ee.value;
                            // vals["field"] = this.randomCoding();
                            // formData.push({name:ee.data.name,value:ee.value,field:ee.data.name})
                            // formData.push({name:ee.data.name,value:ee.value,field:this.randomCoding()})
                        }
                    });
                });
                this.values = vals;
                this.pushData()
            },
            randomCoding: function () {
                //创建26个字母数组
                var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                var idvalue = '';
                let n = 8;//这个值可以改变的，对应的生成多少个字母，根据自己需求所改
                for (var i = 0; i < n; i++) {
                    idvalue += arr[Math.floor(Math.random() * 36)];
                }
                return idvalue;
            },
            pushData: function () {
                this.axios.post(this.global.url + "/app/insertFormDataById", {
                    id: "5e0ef48ece51c76c370a017e",
                    formTab : JSON.stringify(this.value),
                    formData: JSON.stringify(this.values)
                }).then((response) => {
                    // dom根据formList长度判断是否为空
                    if (response.data.state != true) {
                        this.$message("保存表单信息失败")
                    } else {
                        this.$message({
                            message: "保存成功",
                            type: 'success'
                        })
                    }
                    // console.log(this.formList)

                })
            }
            // add11(){
            //     this.data.push({
            //         type:"box"
            //     });
            // },
            // add12(){
            //     this.data.push({
            //         type:"box"
            //     });
            // },

        }
    }
</script>
<style scoped>
    .box {
        display: flex;
        padding: 40px;
        box-sizing: border-box;
    }

    .left {
        display: flex;
        flex-direction: column;
        padding-right: 20px;
        width: 200px;

    }

    .right {
        max-width: 800px;
        padding-left: 20px;
        padding-right: 20px;
        border-left: 1px solid #ddd;
        flex: 1;
        box-sizing: border-box;
    }

</style>