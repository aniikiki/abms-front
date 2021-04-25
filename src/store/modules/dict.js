import { getDictList } from '@/api/dict'

const state = {

};

const mutations = {
    SET_STATE: (state, data) => {
        state[data.dictType] = data.dictData;
    }
};

const getters = {
    state: state => state
};

const actions = {
    get({ state, commit }, dictType) {
        let dictData = state[dictType];

        return new Promise((resolve, reject) => {
            if (dictData) {
                resolve(dictData);
            } else {
                getDictList(dictType).then(response => {
                    if (response && response.length) {
                        let data = response.reduce((d, item) => {
                            return d.set(item.dictValue, item.dictName);
                        }, new Map());
                        commit('SET_STATE', {dictType: dictType, dictData: data});
                        resolve(data);
                    } else {
                        reject();
                    }
                }).catch(error => {
                    reject(error);
                })
            }
        })
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
