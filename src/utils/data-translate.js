/**
 * 菜单数据格式转换为树形结构
 * @param menus
 * @param pid
 * @returns {*}
 */
export function menuDataTranslate(menus, pid) {
    let menuTree = [];

    menus.forEach((item) => {
        if (item.pid == pid) {
            let children = menuDataTranslate(menus, item.menuId);
            if (children && children.length) {
                item.children = children;
            }
            menuTree.push(item);
        }
    });

    return menuTree;
}
