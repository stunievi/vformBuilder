import vinput from './vinput.vue'
import vswitch from './vswitch.vue'
import vtitle from './vtitle.vue'
import vbutton from './vbutton.vue'
// import draggableItems from './draggableItems.vue'
// vinput.install = function (Vue) {
//     Vue.component('vshare', vinput)
//     if (typeof window !== 'undefined' && window.Vue) {
//         window.Vue.use(vinput);
//     }
// }
export default {
    // install:function(Vue){
    //     Vue.component('vinput',vinput)
    //     // console.log(324)
    //     return '<div>hjhj</div>'
    // }  //'component-name'这就是后面可以使用的组件的名字，install是默认的一个方法
    name:'formBuilder',
    props: ['rule'],
    data: () => {
        let backAndTextColor = {
            margin:"10px 0"
        };
        return {
            // list:[1,2,3,4,5,6]
            component:backAndTextColor
                
            
        }
    },
    methods:{
        builderTemplate(t){
            let elm;
            // console.log(t)
            switch(t){
                // 组件添加
                case "input":
                    // console.log(this.rule,"2131312")
                    elm = <vinput info={this.rule}></vinput>
                    
                break;
                case "switch":
                    
                    elm = <vswitch info={this.rule}></vswitch>
                break;
                case "title":
                    
                    elm = <vtitle info={this.rule}></vtitle>
                    // elm = this.vTitle
                break;
                case "button":
                    
                    elm = <vbutton info={this.rule}></vbutton>
                break;
                case "slider":
                    
                    elm = <span>{t} </span>
                break;
                case "upload":
                    
                    elm = <span>{t} </span>
                break;
                case "select":
                    
                    elm = <span>{t} </span>
                break;
                case "radio":
                    
                    elm = <span>{t} </span>
                break;
                case "checkbox":
                    
                    elm = <span>{t} </span>
                break;
                case "inputmnumber":
                    
                    elm = <span>{t} </span>
                break;
                case "timepicker":
                    
                    elm = <span>{t} </span>
                break;
                case "datapicker":
                    
                    elm = <span>{t} </span>
                break;
                case "cascader":
                    
                    elm = <span>{t} </span>
                break;
                // case "layout":
                    
                //     elm = <draggableItems info={this.rule}> </draggableItems>
                // break;
            }
            // console.log(elm)
            return elm;
            
        }
    },
    render () {
        return (
            <div style={this.component}>
                {
                    this.builderTemplate(this.rule.type)
                }
                {
                    // console.log(this.rule.title)
                }
            </div>
            
        )
        

    }
     
}
// export default formBuilder