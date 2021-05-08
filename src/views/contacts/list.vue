<template><div>
    <el-container>
        <el-main>
            <el-card shadow="never" class="query-card">
                <el-row class="card-icon">
                    <el-col :span="24">
                        <i class="el-icon-search"></i> <span>筛选条件</span>
                    </el-col>
                </el-row>
                <el-form :inline="true" :model="query_params" ref="queryForm" size="normal" label-width="82px" class="query-form">
                    <el-form-item label="联系人姓名">
                        <el-input v-model="query_params.contactName" placeholder="联系人姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人手机">
                        <el-input v-model="query_params.contactMobile" placeholder="联系人手机"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人电话">
                        <el-input v-model="query_params.contactTel" placeholder="联系人电话"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人邮箱">
                        <el-input v-model="query_params.contactEmail" placeholder="联系人邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人地址">
                        <el-input v-model="query_params.contactAddress" placeholder="联系人地址"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人称呼">
                        <el-input v-model="query_params.contactNickname" placeholder="联系人地址"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人群组">
                        <el-select v-model="query_params.groupIdArr" multiple collapse-tags clearable placeholder="联系人群组">
                            <el-option
                                v-for="item in groupList"
                                :key="item.groupId"
                                :label="item.groupName"
                                :value="item.groupId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="联系人状态">
                        <dict-select v-model="query_params.status" dictType="status" placeholder="联系人状态" clearable></dict-select>
                    </el-form-item>
                    <el-form-item style="float: right; margin-right: 0;">
                        <el-button type="primary" @click="queryList">查询</el-button>
                        <el-button @click="resetForm('queryForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card shadow="never">
                <el-row class="operation-card">
                    <el-col :span="8">
                        <i class="el-icon-s-operation"></i> <span>用户操作</span>
                    </el-col>
                    <el-col :span="16" class="btn-div" style="padding-right: 20px;">
                        <el-button size="small" @click="toCreateContact" :loading="loading.addBtnLoading">新增</el-button>
                    </el-col>
                </el-row>
            </el-card>
            <el-card shadow="never">
                <el-row :gutter="10" v-loading="loading.loading">
                    <div class="el-table__empty-block" v-if="contactList.length === 0"><span class="el-table__empty-text">暂无数据</span></div>
                    <el-col :span="8" v-for="item in contactList" :key="item.contactId" style="margin: 10px 0;">
                        <el-card :title="item.contactName">
                            <div slot="header" v-if="item.status != '-1'">
                                <i class="el-icon-thumb" style="margin-right: 5px;"/>
                                <span>操作</span>
                                <el-popconfirm hide-icon title="是否删除？" @onConfirm="deleteContact(item)">
                                    <el-button slot="reference" type="danger" icon="el-icon-delete" title="删除" style="float: right; margin-top: -5px;" size="mini" circle></el-button>
                                </el-popconfirm>
                                <el-button @click="toUpdateContact(item)" icon="el-icon-edit-outline"  title="编辑" style="float: right; margin-top: -5px; margin-right: 10px;" size="mini" circle></el-button>
                            </div>
                            <el-row :gutter="20">
                                <el-col :span="8" style="text-align: center">
                                    <el-avatar :size="100" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
                                    <h4 style="margin: 10px 0;">{{item.contactNickname}}</h4>
                                </el-col>
                                <el-col :span="16">
                                    <h4 style="margin: 0 0 10px 0;">{{item.contactName}}</h4>
                                    <div class="contact-item" :title="item.contactAddress">
                                        <i class="el-icon-location-outline"/>
                                        {{item.contactAddress}}
                                    </div>
                                    <div class="contact-item" :title="item.contactMobile">
                                        <i class="el-icon-mobile-phone"/>
                                        {{item.contactMobile}}
                                    </div>
                                    <div class="contact-item" :title="item.contactTel">
                                        <i class="el-icon-phone"/>
                                        {{item.contactTel}}
                                    </div>
                                    <div class="contact-item" :title="item.contactEmail">
                                        <i class="el-icon-message"/>
                                        {{item.contactEmail}}
                                    </div>
                                    <div class="contact-item" :title="item.contactBirthday">
                                        <i class="el-icon-date"/>
                                        {{item.contactBirthday}}
                                    </div>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>
            </el-card>
        </el-main>
        <el-footer>
            <pagination v-bind.sync="page_info" :page-sizes="[9, 18, 27, 36]" @page-change="queryList"></pagination>
        </el-footer>
    </el-container>
    <contact-info-detail ref="contactInfoDetail"></contact-info-detail>
</div></template>
<script>
import { getContactList, getContactInfo, deleteContact } from '@/api/contacts.js'
import { getAllGroup } from '@/api/contactsGroup.js'

export default {
    components: {
        contactInfoDetail: () => import('./detail'),
    },
    data() {
        return {
            loading: {
                loading: true,
                addBtnLoading: false,
            },
            query_params: {
                contactName: "",
                contactMobile: "",
                contactTel: "",
                contactEmail: "",
                contactAddress: "",
                contactNickname: "",
                groupId: "",
                status: "1"
            },
            page_info: {
                pageSize: 9,
                pageNum: 1,
                total: 0
            },
            contactList: [],
            groupList: [],
        }
    },
    async created() {
        this.queryList();
        this.groupList = await getAllGroup({});
    },
    methods: {
        tableHeaderColor() {
            return {background: '#fff',color: '#606266'};
        },
        resetForm(formName) {
            if (this.$refs[formName]) {
                this.$refs[formName].resetFields();
            }
        },
        queryList() {
            let params = this.page_info;
            let data = this.query_params;

            this.loading.loading = true;
            getContactList(params, data).then((res) => {
                this.contactList = res.list;
                this.page_info.pageNum = res.pageNum;
                this.page_info.total = res.total;
            }).catch(() => {}).finally(() => {
                this.loading.loading = false;
            });
        },
        toCreateContact() {
            this.loading.addBtnLoading = true;
            this.$refs.contactInfoDetail.contact_info =  {};
            this.$refs.contactInfoDetail.showDialog();
        },
        toUpdateContact(row) {
            if (row && row.contactId) {
                this.loading.loading = true;
                getContactInfo(row.contactId).then((res) => {
                    this.$refs.contactInfoDetail.titleName = "编辑联系人";
                    this.$refs.contactInfoDetail.contact_info = res;
                    this.$refs.contactInfoDetail.showDialog();
                }).catch(() => {}).finally(() => {
                    this.loading.loading = false;
                });
            }
        },
        deleteContact(row) {
            if (row && row.contactId) {
                this.loading.loading = true;
                deleteContact(row.contactId).then(() => {
                    this.$message.success("删除成功");
                    this.queryList();
                }).catch(() => {}).finally(() => {
                    this.loading.loading = false;
                });
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .contact-item {
        font-size: 14px;
        white-space: nowrap;
        word-break: keep-all;
        overflow: hidden;
        text-overflow: ellipsis;
        font-style: normal;
        vertical-align: bottom;
        margin: 5px 0;
    }
</style>
<style lang="scss">
    .query-form {
        .el-input {
            width: 185px;
        }
    }
</style>
