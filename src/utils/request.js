import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 20000 // request timeout
});

service.interceptors.request.use(
    config => {
        return config
    },
    error => {
        console.log(error) // for debug
        return Promise.reject(error)
    }
);

service.interceptors.response.use(
    response => {
        const res = response.data;

        if (res.code == "200") {
            return res.data;
        } else if (res.code == "401") {
            Message({
                message: '您的登录已过期，请重新登录',
                type: 'warning'
            });
            let redirect = router.history.pending ? router.history.pending.fullPath : router.currentRoute.fullPath;
            store.dispatch('user/resetToken').then(() => {
                router.push(`/login?redirect=${redirect}`);
            });
            return Promise.reject("401");
        } else {
            let msg = res.data ? res.data : res.message;
            Message({
                message: msg,
                type: 'warning'
            });
            return Promise.reject(response);
        }
    },
    error => {
        console.log('err' + error); // for debug
        Message.error("服务器发生异常，请重试");
        return Promise.reject(error)
    }
);

export default service
