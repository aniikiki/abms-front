import { constantRoutes, asyncRouteMap } from '@/router/index';
import Layout from '@/layout'

const genAccessRoute = (menus) => {
    let accessRoute = [];

    menus.forEach(item => {
        let route = {};

        route.name = item.menuUrl;
        route.path = (item.pid === "0" ? "/" : "") + item.menuUrl;
        if (asyncRouteMap[route.name]) {
            route.component = asyncRouteMap[route.name].component;
        } else if (item.children && item.children.length) {
            route.component = Layout;
            route.redirect = `/${item.menuUrl}/${item.children[0].menuUrl}`;
        }
        route.meta = {
            title: item.menuName,
            icon: item.menuIcon
        };

        if (item.children && item.children.length) {
            route.children = genAccessRoute(item.children)
        }

        accessRoute.push(route);
    });

    return accessRoute;
};

const getDefaultState = () => {
    return {
        routes: [],
        addRoutes: []
    }
};

const state = getDefaultState();

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes;
        state.routes = [...constantRoutes, ...routes];
    },
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState());
    }
};

const actions = {
    getRoute({ state, commit }, menus) {
        return new Promise(resolve => {
            if (state.addRoutes && state.addRoutes.length) {
                resolve(state.addRoutes);
            } else {
                let accessedRoutes = genAccessRoute(menus);
                accessedRoutes.push({ path: '*', redirect: '/404', hidden: true });
                commit('SET_ROUTES', accessedRoutes);
                resolve(accessedRoutes);
            }
        })
    },
    resetRoute({ commit }) {
        return new Promise(resolve => {
            commit('RESET_STATE');
            resolve();
        })
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
