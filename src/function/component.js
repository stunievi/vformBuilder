let componentJson =  [
    {
        name: "标题",
        title: "标题",
        type: "title",
    }, {
        name: "开关",
        type: "switch",
        title: "开关",
    }, {
        name: "滑块",
        title: "滑块",
        type: "slider"
    }, {
        name: "上传",
        title: "上传",
        type: "upload"
    }, {
        type: "input",
        name: "输入框",
        title: "商品名称",
        field: "goods_name",
        value: "iphone 7",
        col: {
            span: 12,
            labelWidth: 150
        },
        props: {
            "type": "text",
        },
        validate: [{
            required: true,
            message: '请输入goods_name',
            trigger: 'blur'
        }, ],
    }, {
        name: "选择框",
        title: "选择框",
        type: "select"
    }, {
        name: "单选框",
        title: "单选框",
        type: "radio"
    }, {
        name: "多选框",
        title: "多选框",
        type: "checkbox"
    }, {
        name: "计数器",
        title: "计数器",
        type: "inputmnumber"
    }, {
        name: "时间选择器",
        title: "时间选择器",
        type: "timepicker"
    }, {
        name: "日期选择器",
        title: "日期选择器",
        type: "datapicker"
    }, {
        name: "级联选择器",
        title: "级联选择器",
        type: "cascader"
    }, {
        name: "按钮",
        title: "按钮",
        type: "button"
    }
        
]
export default componentJson;