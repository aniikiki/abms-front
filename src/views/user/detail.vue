<template><div>
    <el-dialog :title="titleName" :visible.sync="dialogFormVisible" :modal-append-to-body="false" :before-close="handleClose" :close-on-click-modal="false" width="400px">
        <el-form :model="user_info" :rules="rules" ref="userInfoForm" label-position="right" class="user-info-form" label-width="80px" size="small" v-loading="submitLoading" :element-loading-text="submitLoadingText">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="user_info.username" :readonly="readonly" autocomplete="off" show-word-limit maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" v-if="user_info.userId">
                <el-input v-model="user_info.password" :readonly="readonly" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" v-if="user_info.userId">
                <el-switch v-model="user_info.status" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="user_info.nickname" :readonly="readonly" autocomplete="off" show-word-limit maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="email" prop="email">
                <el-input v-model="user_info.email" :readonly="readonly" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" rows="5" v-model="user_info.remark" :readonly="readonly" autocomplete="off" show-word-limit maxlength="100"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit('userInfoForm')" :loading="submitLoading">确 定</el-button>
        </div>
    </el-dialog>
</div></template>
<script>
import {createUser, updateUser} from "../../api/user";

export default {
    name: "userInfoDetail",
    data() {
        return {
            dialogFormVisible: false,
            readonly: false,
            submitLoading: false,
            submitLoadingText: "正在保存，请稍候...",
            titleName: "新增用户",
            user_info: {

            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                ],
                nickname: [
                    { required: true, message: '请输入用户昵称', trigger: 'blur' },
                    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                ],
                remark: [
                    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
                ],
            }
        }
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
            this.resetForm("userInfoForm");
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
                    if (!this.user_info.userId) {
                        prom = createUser(this.user_info);
                    } else {
                        prom = updateUser(this.user_info);
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
    .user-info-form {
        .el-form-item__content {
            margin-right: 20px;
        }
    }
</style>
