import request from "@/utils/request";

export function getDictList(dictType) {
    return request({
        url: '/dict/list/' + dictType,
        method: 'get'
    })
}
