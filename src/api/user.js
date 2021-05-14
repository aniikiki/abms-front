import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/login',
        method: 'post',
        data: data
    })
}

export function getInfo() {
    return request({
        url: '/login/info',
        method: 'get'
    })
}

export function logout() {
    return request({
        url: '/login/logout',
        method: 'post'
    })
}

export function changePassword(data) {
    return request({
        url: '/login/changePassword',
        method: 'post',
        data: data
    })
}

export function getUserList(params, data) {
    return request({
        url: '/user/list',
        method: 'post',
        params: params,
        data: data
    })
}

export function getUserInfo(userId) {
    return request({
        url: '/user/info/' + userId,
        method: 'get'
    })
}

export function createUser(data) {
    return request({
        url: '/user/create',
        method: 'post',
        data: data
    })
}

export function updateUser(data) {
    return request({
        url: '/user/update/' + data.userId,
        method: 'post',
        data: data
    })
}

export function deleteUser(userId) {
    return request({
        url: '/user/delete/' + userId,
        method: 'post'
    })
}

export function getUserRole(userId) {
    return request({
        url: '/user/role/' + userId,
        method: 'get'
    })
}

export function assignRole(userId, data) {
    return request({
        url: '/user/assign/' + userId,
        method: 'post',
        data: data
    })
}
