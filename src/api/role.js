import request from '@/utils/request'

export function getRoleList(params, data) {
    return request({
        url: '/role/list',
        method: 'post',
        params: params,
        data: data
    })
}

export function getAllRole(data) {
    return request({
        url: '/role/all',
        method: 'post',
        data: data
    })
}

export function getRoleInfo(roleId) {
    return request({
        url: '/role/info/' + roleId,
        method: 'get'
    })
}

export function createRole(data) {
    return request({
        url: '/role/create',
        method: 'post',
        data: data
    })
}

export function updateRole(data) {
    return request({
        url: '/role/update/' + data.roleId,
        method: 'post',
        data: data
    })
}

export function deleteRole(roleId) {
    return request({
        url: '/role/delete/' + roleId,
        method: 'post'
    })
}

export function getRoleMenu(roleId) {
    return request({
        url: '/role/menu/' + roleId,
        method: 'get'
    })
}

export function assignMenu(roleId, data) {
    return request({
        url: '/role/assign/' + roleId,
        method: 'post',
        data: data
    })
}
