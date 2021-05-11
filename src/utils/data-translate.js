/**
 * 菜单数据格式转换为树形结构
 * @param source
 * @param target
 * @param pid
 * @returns {*}
 */
export function menuDataTranslate(source, target, pid) {
    source.forEach((item) => {
        if (item.pid == pid) {
            let children = menuDataTranslate(source, [], item.menuId);
            if (children && children.length) {
                item.children = children;
            }
            target.push(item);
        }
    });
    return target;
}
