<template><div>
    <el-dialog :title="nickname" :visible.sync="dialogFormVisible" :modal-append-to-body="false" :before-close="handleClose" :close-on-click-modal="false" width="622px">
        <el-row>
            <el-col :span="24">
                <el-transfer
                    filterable
                    :props="props"
                    :titles="titles"
                    v-model="assign_role_list"
                    :data="role_list">
                </el-transfer>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit()" :loading="submitLoading">确 定</el-button>
        </div>
    </el-dialog>
</div></template>
<script>
import { assignRole } from "@/api/user";

export default {
    name: "roleAssign",
    data() {
        return {
            dialogFormVisible: false,
            readonly: false,
            submitLoading: false,
            submitLoadingText: "正在保存，请稍候...",
            props: {
                key: 'roleId',
                label: 'roleName'
            },
            titles: [
                "未分配角色",
                "已分配角色"
            ],
            userId: "",
            nickname: "",
            role_list: [],
            assign_role_list: [],
            origin_assign_role_list: []
        }
    },
    computed: {

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
            if (this.origin_assign_role_list.join(",") === this.assign_role_list.join(",")) {
                this.handleClose();
                return false;
            }
            this.submitLoading = true;
            assignRole(this.userId, this.assign_role_list).then(() => {
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

</style>
