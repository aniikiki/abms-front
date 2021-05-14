import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { menuDataTranslate } from '@/utils/data-translate.js'

NProgress.configure({ showSpinner: true }); // NProgress Configuration

const whiteList = ['/login']; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start();

    // set page title
    document.title = getPageTitle(to.meta.title);

    if (whiteList.indexOf(to.path) === -1) {
        // determine whether the user has logged in
        const hasToken = getToken();

        if (hasToken) {
            const addRoutes = store.getters.addRoutes;
            if (addRoutes && addRoutes.length) {
                next();
            } else {
                try {
                    // get user info
                    let userInfo = await store.dispatch('user/getInfo');

                    // generate accessible route
                    let accessedRoutes = await store.dispatch('route/getRoute', menuDataTranslate(userInfo.menuList, 0));

                    // dynamically add accessible routes
                    router.addRoutes(accessedRoutes);

                    // hack method to ensure that addRoutes is complete
                    // set the replace: true, so the navigation will not leave a history record
                    next({ ...to, replace: true });
                } catch (error) {
                    if (error != "401") {
                        // remove token and go to login page to re-login
                        await store.dispatch('user/resetToken');
                        Message.error('获取登录信息失败，请重新登录');
                        next(`/login?redirect=${to.path}`);
                    }
                }
            }
        } else {
            next(`/login?redirect=${to.path}`);
        }
    } else {
        next();
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});
