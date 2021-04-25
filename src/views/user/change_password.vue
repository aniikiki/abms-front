<template><div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" :modal-append-to-body="false" :before-close="handleClose" :close-on-click-modal="false" width="400px">
        <el-form :model="params" :rules="rules" ref="changePasswordForm" label-position="right" class="change-password-form" label-width="80px" size="small" v-loading="submitLoading" :element-loading-text="submitLoadingText">
            <el-form-item label="原密码" prop="password">
                <el-input type="password" v-model="params.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="params.newPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPassword">
                <el-input type="password" v-model="params.checkPassword" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit('changePasswordForm')" :loading="submitLoading">确 定</el-button>
        </div>
    </el-dialog>
</div></template>
<script>
import {changePassword} from '@/api/user.js'

export default {
    name: "changePassword",
    data() {
        let validatePass = (rule, value, callback) => {
            if (this.params.checkPassword) {
                this.$refs.changePasswordForm.validateField('params.checkPassword');
            }
            callback();
        };
        let validateCheckPass = (rule, value, callback) => {
            if (value !== this.params.newPassword) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            dialogFormVisible: false,
            submitLoading: false,
            submitLoadingText: "正在保存，请稍候...",
            params: {
                password: "",
                newPassword: "",
                checkPassword: ""
            },
            rules: {
                password: [
                    { required: true, message: '请输入原密码', trigger: 'blur' },
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' },
                ],
                checkPassword: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { validator: validateCheckPass, trigger: 'blur' },
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
            this.dialogFormVisible = false;
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
                    changePassword(this.params).then(() => {
                        this.$message({
                            message: '密码修改成功，请重新登录',
                            type: 'success'
                        });
                        this.handleClose();
                        this.$parent.logout();
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
    .change-password-form {
        .el-form-item__content {
            margin-right: 20px;
        }
    }
</style>
