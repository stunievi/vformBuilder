import index from "./view/index.vue"

const routes = [
    {path: '/', redirect: 'index'},
    {   
        path: '/index',
        component: index
        
    },
    {   
        path: '/designApp',
        component:  ()=> import("./view/application/designApp.vue"),
        children:[
            {
                path:'/newApplication',
                component: ()=> import("./view/application/newApplication.vue")
            }
            
        ]
    },
    {
        path:'/appList',
        component: ()=> import("./view/application/appList.vue")
    },
]
export default routes