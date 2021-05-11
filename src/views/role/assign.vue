<template><div>
    <el-dialog :title="roleName" :visible.sync="dialogFormVisible" :modal-append-to-body="false" :before-close="handleClose" :close-on-click-modal="false" width="422px">
        <el-tree
            :data="menu_tree"
            :props="defaultProps"
            node-key="menuId"
            :expand-on-click-node="true"
            :default-expand-all="true"
            :default-checked-keys="assign_menu_list"
            show-checkbox
            ref="menuTree">
            <span class="menu-tree-node" slot-scope="{ node, data }">
                <span class="custom-tree-node-label">
                    <i :class="data.menuIcon" style="margin-right: 2px;"></i>
                    {{ node.label }}
                </span>
            </span>
        </el-tree>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit()" :loading="submitLoading">确 定</el-button>
        </div>
    </el-dialog>
</div></template>
<script>
import { assignMenu } from "@/api/role";

export default {
    name: "menuAssign",
    data() {
        return {
            dialogFormVisible: false,
            submitLoading: false,
            submitLoadingText: "正在保存，请稍候...",
            defaultProps: {
                children: 'children',
                label: 'menuName'
            },
            roleId: "",
            roleName: "",
            menu_tree: [],
            assign_menu_list: [],
        }
    },
    created() {

    },
    methods: {
        showDialog() {
            this.dialogFormVisible = true
        },
        handleClose() {
            this.$parent.loading.addBtnLoading = false;
            this.dialogFormVisible = false;
        },
        handleSubmit() {
            let halfCheckedMenu = this.$refs.menuTree.getHalfCheckedKeys();
            let checkedMenu = this.$refs.menuTree.getCheckedKeys();

            if (checkedMenu.sort((a, b) => a - b).join(",") === this.assign_menu_list.join(",")) {
                this.handleClose();
                return false;
            }

            this.submitLoading = true;
            let data = [...halfCheckedMenu, ...checkedMenu].sort((a, b) => a - b);
            console.log(data);
            assignMenu(this.roleId, data).then(() => {
                this.$message.success("保存成功");
                this.$parent.queryList();
                this.handleClose();
            }).catch(() => {}).finally(() => {
                this.submitLoading = false;
            });
        },
    }
}
</script>
<style lang="scss" scoped>
    .menu-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
    }
</style>
