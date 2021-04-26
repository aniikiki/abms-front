import request from '@/utils/request'

export function getContactList(params, data) {
    return request({
        url: '/contacts/list',
        method: 'post',
        params: params,
        data: data
    })
}

export function getContactInfo(contactId) {
    return request({
        url: '/contacts/info/' + contactId,
        method: 'get'
    })
}

export function createContact(data) {
    return request({
        url: '/contacts/create',
        method: 'post',
        data: data
    })
}

export function updateContact(data) {
    return request({
        url: '/contacts/update/' + data.contactId,
        method: 'post',
        data: data
    })
}

export function deleteContact(contactId) {
    return request({
        url: '/contacts/delete/' + contactId,
        method: 'post'
    })
}
