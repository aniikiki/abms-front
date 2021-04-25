import request from '@/utils/request'

export function getMenuList(data) {
    return request({
        url: '/menu/list',
        method: 'post',
        data: data
    })
}

export function getMenuInfo(roleId) {
    return request({
        url: '/menu/info/' + roleId,
        method: 'get'
    })
}

export function createMenu(data) {
    return request({
        url: '/menu/create',
        method: 'post',
        data: data
    })
}

export function updateMenu(data) {
    return request({
        url: '/menu/update/' + data.menuId,
        method: 'post',
        data: data
    })
}

export function deleteMenu(menuId) {
    return request({
        url: '/menu/delete/' + menuId,
        method: 'post'
    })
}

