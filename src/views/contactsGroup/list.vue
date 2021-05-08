<template><div>
    <el-container>
        <el-main>
            <el-card shadow="never" class="query-card">
                <el-row class="card-icon">
                    <el-col :span="24">
                        <i class="el-icon-search"></i> <span>筛选条件</span>
                    </el-col>
                </el-row>
                <el-form :inline="true" :model="query_params" ref="queryForm" size="normal" class="query-form">
                    <el-form-item label="群组名称">
                        <el-input v-model="query_params.groupName" placeholder="群组名称"></el-input>
                    </el-form-item>
                    <el-form-item label="群组备注">
                        <el-input v-model="query_params.groupRemark" placeholder="群组描述"></el-input>
                    </el-form-item>
                    <el-form-item label="群组状态">
                        <dict-select v-model="query_params.status" dictType="status" placeholder="群组状态" clearable></dict-select>
                    </el-form-item>
                    <el-form-item style="float: right">
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
                    <el-col :span="16" class="btn-div">
                        <el-button size="small" @click="toCreateGroup" :loading="loading.addBtnLoading">新增</el-button>
                    </el-col>
                </el-row>
            </el-card>
            <el-table :data="groupList" border :header-cell-style="tableHeaderColor" size="small" v-loading="loading.loading" style="width: 100%; margin-top: 20px;">
                <el-table-column type="index" :index="1" label="序号" width="90" align="center"></el-table-column>
                <el-table-column prop="groupName" label="群组名称" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="groupRemark" label="群组描述" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" label="群组状态" :formatter="statusFormatter" align="center"></el-table-column>
                <el-table-column label="操作" width="270" align="center">
                    <template slot-scope="scope" v-if="scope.row.status != '-1'">
                        <el-button @click.native.prevent="toUpdateGroup(scope.row)" size="mini" >
                            编辑
                        </el-button>
                        <el-button @click.native.prevent="toAssignContacts(scope.row)" size="mini" >
                            联系人
                        </el-button>
                        <el-popconfirm hide-icon title="是否删除？" @onConfirm="deleteGroup(scope.row)" style="margin-left: 10px;">
                            <el-button slot="reference" type="danger" size="mini" >
                                删除
                            </el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <pagination v-bind.sync="page_info" @page-change="queryList"></pagination>
        </el-footer>
    </el-container>
    <group-info-detail ref="groupInfoDetail"></group-info-detail>
    <contacts-assign ref="contactsAssign"></contacts-assign>
</div></template>
<script>
import axios from 'axios'
import { getGroupList, getGroupInfo, deleteGroup } from '@/api/contactsGroup.js'
import { getAllContact } from '@/api/contacts.js'

export default {
    components: {
        groupInfoDetail: () => import('./detail'),
        contactsAssign: () => import('./assign'),
    },
    data() {
        return {
            loading: {
                loading: true,
                addBtnLoading: false,
            },
            query_params: {
                roleName: "",
                roleDesc: "",
                status: "1"
            },
            page_info: {
                pageSize: 10,
                pageNum: 1,
                total: 0
            },
            groupList: []
        }
    },
    async created() {
        await this.$store.dispatch("dict/get", "status");
        this.queryList();
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
        statusFormatter(row) {
            let status = this.$store.state.dict.status;
            let key = row.status;
            return status ? status.get(key) : key;
        },
        queryList() {
            let params = this.page_info;
            let data = this.query_params;

            this.loading.loading = true;
            getGroupList(params, data).then((res) => {
                this.groupList = res.list;
                this.page_info.pageNum = res.pageNum;
                this.page_info.total = res.total;
            }).catch(() => {}).finally(() => {
                this.loading.loading = false;
            });
        },
        toCreateGroup() {
            this.loading.addBtnLoading = true;
            this.$refs.groupInfoDetail.group_info =  {};
            this.$refs.groupInfoDetail.showDialog();
        },
        toUpdateGroup(row) {
            if (row && row.groupId) {
                this.loading.loading = true;
                getGroupInfo(row.groupId).then((res) => {
                    this.$refs.groupInfoDetail.titleName = "编辑联系人群组";
                    this.$refs.groupInfoDetail.group_info = res;
                    this.$refs.groupInfoDetail.showDialog();
                }).catch(() => {}).finally(() => {
                    this.loading.loading = false;
                });
            }
        },
        deleteGroup(row) {
            if (row && row.groupId) {
                this.loading.loading = true;
                deleteGroup(row.groupId).then(() => {
                    this.$message.success("删除成功");
                    this.queryList();
                }).catch(() => {}).finally(() => {
                    this.loading.loading = false;
                });
            }
        },
        toAssignContacts(row) {
            if (row && row.groupId) {
                this.loading.loading = true;
                axios.all([
                    getAllContact({}),
                    getGroupInfo(row.groupId)
                ]).then(axios.spread((allContactRes, groupInfoRes) => {
                    this.$refs.contactsAssign.contact_list = allContactRes.map((item) => {
                        let {contactId, contactName} = item;
                        return {contactId, contactName};
                    });
                    let assign_contacts = [];
                    if (groupInfoRes.relList && groupInfoRes.relList.length) {
                        assign_contacts = groupInfoRes.relList.map((item) => {
                            return item.contact.contactId;
                        });
                    }
                    this.$refs.contactsAssign.assign_contact_list = assign_contacts;
                    this.$refs.contactsAssign.origin_assign_contact_list = assign_contacts;
                    this.$refs.contactsAssign.group_info = groupInfoRes;
                    this.$refs.contactsAssign.showDialog();
                })).catch(() => {}).finally(() => {
                    this.loading.loading = false;
                });
            }
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
