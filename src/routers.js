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
    },
    {
        path:'/designApp/modifyApp',
        component: ()=> import("./view/application/modifyApp.vue")
    },
    {
        path:'/designApp/newApplication',
        component: ()=> import("./view/application/newApplication.vue")
    },
    {
        path:'/appList',
        component: ()=> import("./view/application/appList.vue")
    },
]
export default routes