import { login, logout, getInfo } from '@/api/user'
import {removeToken, setToken} from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
    return {
        token: '',
        username: '',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    }
};

const state = getDefaultState();

const mutations = {
    SET_STATE: (state, data) => {
        Object.assign(state, data);
    },
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState());
    }
};

const actions = {
    login({ commit }, userInfo) {
        const { username, password } = userInfo;

        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password: password }).then(response => {
                commit('SET_STATE', response);
                setToken(response.token);
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        });
    },
    getInfo({ state, commit }) {
        return new Promise((resolve, reject) => {
            if (state.token) {
                resolve(state);
            } else {
                getInfo().then(response => {
                    if (response && response.token) {
                        commit('SET_STATE', response);
                        resolve(response);
                    } else {
                        reject(response);
                    }
                }).catch(error => {
                    reject(error);
                })
            }
        })
    },
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken();
                resetRouter();
                commit('RESET_STATE');
                resolve();
            }).catch(error => {
                reject(error);
            })
        })
    },
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken();
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

