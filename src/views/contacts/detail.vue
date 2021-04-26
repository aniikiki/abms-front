<template><div>
    <el-dialog :title="titleName" :visible.sync="dialogFormVisible" :modal-append-to-body="false" :before-close="handleClose" :close-on-click-modal="false" width="500px" top="5vh">
        <el-form :model="contact_info" :rules="rules" ref="contactInfoForm" label-position="right" class="contact-info-form" label-width="95px" size="small" v-loading="submitLoading" :element-loading-text="submitLoadingText">
            <el-form-item label="联系人姓名" prop="contactName">
                <el-input v-model="contact_info.contactName" :readonly="readonly" autocomplete="off" show-word-limit maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" v-if="contact_info.contactId">
                <el-switch v-model="contact_info.status" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="联系人手机" prop="contactMobile">
                <el-input v-model="contact_info.contactMobile" :readonly="readonly" autocomplete="off" show-word-limit maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="联系人电话" prop="contactTel">
                <el-input v-model="contact_info.contactTel" :readonly="readonly" autocomplete="off" show-word-limit maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="联系人邮箱" prop="contactEmail">
                <el-input v-model="contact_info.contactEmail" :readonly="readonly" autocomplete="off" show-word-limit maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="联系人地址" prop="contactAddress">
                <el-input v-model="contact_info.contactAddress" :readonly="readonly" autocomplete="off" show-word-limit maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="联系人称呼" prop="contactNickname">
                <el-input v-model="contact_info.contactNickname" :readonly="readonly" autocomplete="off" show-word-limit maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="联系人生日" prop="contactBirthday">
                <el-date-picker v-model="contact_info.contactBirthday" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="联系人备注" prop="contactRemark">
                <el-input type="textarea" rows="5" v-model="contact_info.contactRemark" :readonly="readonly" autocomplete="off" show-word-limit maxlength="100"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit('contactInfoForm')" :loading="submitLoading">确 定</el-button>
        </div>
    </el-dialog>
</div></template>
<script>
import { createContact, updateContact } from "@/api/contacts";

export default {
    name: "contactInfoDetail",
    data() {
        return {
            dialogFormVisible: false,
            readonly: false,
            submitLoading: false,
            submitLoadingText: "正在保存，请稍候...",
            titleName: "新增联系人",
            contact_info: {

            },
            rules: {
                contactName: [
                    { required: true, message: '请输入联系人名称', trigger: 'blur' },
                    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                ],
                contactMobile: [
                    { required: true, message: '请输入联系人手机号码', trigger: 'blur' },
                    { pattern: /^\d{11}$/, message: '请输入正确的手机号码', trigger: 'blur' }
                ],
                contactEmail: [
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
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
            this.resetForm("contactInfoForm");
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
                    if (!this.contact_info.contactId) {
                        prom = createContact(this.contact_info);
                    } else {
                        prom = updateContact(this.contact_info);
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

</style>
