import request from '@/utils/request'

export function getGroupList(params, data) {
    return request({
        url: '/contactsGroup/list',
        method: 'post',
        params: params,
        data: data
    })
}

export function getAllGroup(data) {
    return request({
        url: '/contactsGroup/all',
        method: 'post',
        data: data
    })
}

export function getGroupInfo(groupId) {
    return request({
        url: '/contactsGroup/info/' + groupId,
        method: 'get'
    })
}

export function createGroup(data) {
    return request({
        url: '/contactsGroup/create',
        method: 'post',
        data: data
    })
}

export function updateGroup(data) {
    return request({
        url: '/contactsGroup/update/' + data.groupId,
        method: 'post',
        data: data
    })
}

export function deleteGroup(groupId) {
    return request({
        url: '/contactsGroup/delete/' + groupId,
        method: 'post'
    })
}

export function assignContacts(groupId, data) {
    return request({
        url: '/contactsGroup/assign/' + groupId,
        method: 'post',
        data: data
    })
}
