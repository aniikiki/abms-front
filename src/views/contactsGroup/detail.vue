<template><div>
    <el-dialog :title="titleName" :visible.sync="dialogFormVisible" :modal-append-to-body="false" :before-close="handleClose" :close-on-click-modal="false" width="400px">
        <el-form :model="group_info" :rules="rules" ref="groupInfoForm" label-position="right" class="group-info-form" label-width="80px" size="small" v-loading="submitLoading" :element-loading-text="submitLoadingText">
            <el-form-item label="群组名称" prop="groupName">
                <el-input v-model="group_info.groupName" :readonly="readonly" autocomplete="off" show-word-limit maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" v-if="group_info.groupId">
                <el-switch v-model="group_info.status" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="群组描述" prop="groupRemark">
                <el-input type="textarea" rows="5" v-model="group_info.groupRemark" :readonly="readonly" autocomplete="off" show-word-limit maxlength="100"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit('groupInfoForm')" :loading="submitLoading">确 定</el-button>
        </div>
    </el-dialog>
</div></template>
<script>
import { createGroup, updateGroup } from "@/api/contactsGroup";

export default {
    name: "groupInfoDetail",
    data() {
        return {
            dialogFormVisible: false,
            readonly: false,
            submitLoading: false,
            submitLoadingText: "正在保存，请稍候...",
            titleName: "新增联系人群组",
            group_info: {

            },
            rules: {
                groupName: [
                    { required: true, message: '请输入群组名称', trigger: 'blur' },
                    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                ],
                groupRemark: [
                    { required: true, message: '请输入群组描述', trigger: 'blur' },
                    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        showDialog() {
            this.dialogFormVisible = true
        },
        handleClose() {
            this.$parent.loading.addBtnLoading = false;
            this.dialogFormVisible = false;
            this.resetForm("groupInfoForm");
        },
        resetForm(formName) {
            if (this.$refs[formName]) {
                this.$refs[formName].resetFields();
            }
        },
        handleSubmit(formName) {
            this.submitLoading = true;

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let prom = "";
                    if (!this.group_info.groupId) {
                        prom = createGroup(this.group_info);
                    } else {
                        prom = updateGroup(this.group_info);
                    }
                    prom.then(() => {
                        this.$message.success("保存成功");
                        this.$parent.queryList();
                        this.handleClose();
                    }).catch(() => {}).finally(() => {
                        this.submitLoading = false;
                    });
                } else {
                    this.submitLoading = false;
                }
            });
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
