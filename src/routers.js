import index from "./view/index.vue"

const routes = [
    {path: '/', redirect: 'index'},
    {   
        path: '/index',
        component: index
        
    },
    {
        path:'/newApplication',
        component: ()=> import("./view/application/newApplication.vue")
    },
    {
        path:'/appList',
        component: ()=> import("./view/application/appList.vue")
    },
]
export default routes