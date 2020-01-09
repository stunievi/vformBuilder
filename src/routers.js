import index from "./view/index.vue"

const routes = [
    {path: '/', redirect: 'index'},
    {
        path: '/index',
        component: index

    },
    {
        path: '/newDraData',
        component: () => import("./view/application/newDraData.vue"),
    },
    {
        path: '/designApp',
        component: () => import("./view/application/designApp.vue"),
    },
    {
        path: '/designApp/modifyApp',
        component: () => import("./view/application/modifyApp.vue")
    },
    {
        path: '/designApp/newApplication',
        component: () => import("./view/application/newApplication.vue")
    },
    {
        path: '/designApp/design',
        component: () => import("./view/application/design.vue")
    },
    {
        path: '/designApp/designFormData',
        component: () => import("./view/application/designFormData.vue")
    },
    {
        path: '/designApp/officeFenlei',
        component: () => import("./view/application/officeFenlei.vue")
    },
    {
        path: '/designApp/newApplication/link',
        component: () => import("./view/application/link.vue")
    },
    {
        path: '/appList',
        component: () => import("./view/application/appList.vue")
    },
    {
        path: '/preview',
        component: () => import("./view/application/preview.vue")
    },
    {
        path: '/appView',
        component: () => import("./view/application/appView.vue")
    },
    {
        path: '/appView/newData',
        component: () => import("./view/application/newData.vue")
    },
    {
        path: '/appView/testData',
        component: () => import("./view/application/testData.vue")
    }
]
export default routes