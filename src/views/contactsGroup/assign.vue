<template><div>
    <el-dialog :title="group_info.groupName" :visible.sync="dialogFormVisible" :modal-append-to-body="false" :before-close="handleClose" :close-on-click-modal="false" width="622px">
        <el-row>
            <el-col :span="24">
                <el-transfer
                    filterable
                    :filter-method="filterMethod"
                    :props="props"
                    :titles="titles"
                    v-model="assign_contact_list"
                    :data="contact_list">
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
    import { assignContacts } from "@/api/contactsGroup";

export default {
    name: "contactsAssign",
    data() {
        return {
            dialogFormVisible: false,
            readonly: false,
            submitLoading: false,
            submitLoadingText: "正在保存，请稍候...",
            props: {
                key: 'contactId',
                label: 'contactName'
            },
            titles: [
                "未分配联系人",
                "已分配联系人"
            ],
            group_info: {},
            contact_list: [],
            assign_contact_list: [],
            origin_assign_contact_list: []
        }
    },
    computed: {

    },
    methods: {
        tableHeaderColor() {
            return {background: '#eeeeee80',color: '#606266'};
        },
        showDialog() {
            this.dialogFormVisible = true
        },
        handleClose() {
            this.$parent.loading.addBtnLoading = false;
            this.dialogFormVisible = false;
        },
        handleSubmit() {
            if (this.origin_assign_contact_list.join(",") === this.assign_contact_list.join(",")) {
                this.handleClose();
                return false;
            }
            this.submitLoading = true;
            let groupId = this.group_info.groupId;
            assignContacts(groupId, this.assign_contact_list).then(() => {
                this.$message.success("保存成功");
                this.$parent.queryList();
                this.handleClose();
            }).catch(() => {}).finally(() => {
                this.submitLoading = false;
            });
        },
        filterMethod() {
            return true;
        }
    }
}
</script>
<style lang="scss" scoped>
    .group-info-form {
        .el-form-item__content {
            margin-right: 20px;
        }
    }
</style>
