<template><div>
    <el-dialog :title="titleName" :visible.sync="dialogFormVisible" :modal-append-to-body="false" :before-close="handleClose" :close-on-click-modal="false" width="400px">
        <el-form :model="role_info" :rules="rules" ref="roleInfoForm" label-position="right" class="role-info-form" label-width="80px" size="small" v-loading="submitLoading" :element-loading-text="submitLoadingText">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="role_info.roleName" :readonly="readonly" autocomplete="off" show-word-limit maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" v-if="role_info.roleId">
                <el-switch v-model="role_info.status" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input type="textarea" rows="5" v-model="role_info.roleDesc" :readonly="readonly" autocomplete="off" show-word-limit maxlength="100"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit('roleInfoForm')" :loading="submitLoading">确 定</el-button>
        </div>
    </el-dialog>
</div></template>
<script>
import { createRole, updateRole } from "@/api/role";

export default {
    name: "roleInfoDetail",
    data() {
        return {
            dialogFormVisible: false,
            readonly: false,
            submitLoading: false,
            submitLoadingText: "正在保存，请稍候...",
            titleName: "新增角色",
            role_info: {

            },
            rules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' },
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
            this.resetForm("roleInfoForm");
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
                    if (!this.role_info.roleId) {
                        prom = createRole(this.role_info);
                    } else {
                        prom = updateRole(this.role_info);
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
<style lang="scss">
    .role-info-form {
        .el-form-item__content {
            margin-right: 20px;
        }
    }
</style>
