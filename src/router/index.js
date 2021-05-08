import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/homepage',
        children: [{
            path: 'homepage',
            name: 'homepage',
            component: () => import('@/views/dashboard/index'),
            meta: {title: '首页', icon: 'el-icon-s-home'}
        }]
    },

    {
        path: '/contacts',
        component: Layout,
        redirect: '/contacts/list',
        name: 'Contacts',
        meta: {title: '联系人管理', icon: 'el-icon-notebook-1'},
        children: [
            {
                path: 'list',
                name: 'List',
                component: () => import('@/views/contacts/list'),
                meta: {title: '联系人列表', icon: 'el-icon-notebook-2'}
            },
            {
                path: 'group',
                name: 'Group',
                component: () => import('@/views/contactsGroup/list'),
                meta: {title: '联系人群组', icon: 'el-icon-collection'}
            }
        ]
    },

    {
        path: '/system',
        component: Layout,
        redirect: '/system/user',
        name: 'System',
        meta: {title: '系统管理', icon: 'el-icon-setting'},
        children: [
            {
                path: 'user',
                name: 'User',
                component: () => import('@/views/user/list'),
                meta: {title: '用户管理', icon: 'el-icon-user'}
            },
            {
                path: 'role',
                name: 'Role',
                component: () => import('@/views/role/list'),
                meta: {title: '角色管理', icon: 'el-icon-s-custom'}
            },
            {
                path: 'menu',
                name: 'Menu',
                component: () => import('@/views/menu/list'),
                meta: {title: '菜单管理', icon: 'el-icon-menu'}
            },
        ]
    },

    // 404 page must be placed at the end !!!
    {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
