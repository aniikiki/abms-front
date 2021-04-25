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
                    <el-form-item label="用户名称">
                        <el-input v-model="query_params.username" placeholder="用户名称"></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称">
                        <el-input v-model="query_params.nickname" placeholder="用户昵称"></el-input>
                    </el-form-item>
                    <el-form-item label="用户状态">
                        <dict-select v-model="query_params.status" dictType="status" placeholder="用户状态" clearable></dict-select>
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
                        <el-button size="small" @click="toCreateUser" :loading="loading.addBtnLoading">新增</el-button>
                    </el-col>
                </el-row>
            </el-card>
            <el-table :data="userList" border :header-cell-style="tableHeaderColor" size="small" v-loading="loading.loading" style="width: 100%; margin-top: 20px;">
                <el-table-column type="index" :index="1" label="序号" width="90" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名称" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="nickname" label="用户昵称" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="email" label="email" align="center"></el-table-column>
                <el-table-column prop="status" label="用户状态" :formatter="statusFormatter" align="center"></el-table-column>
                <el-table-column prop="lastLoginIp" label="最后登录IP" align="center"></el-table-column>
                <el-table-column prop="lastLoginTime" label="最后登录时间" align="center"></el-table-column>
                <el-table-column label="操作" width="270" align="center">
                    <template slot-scope="scope" v-if="scope.row.status != '-1'">
                        <el-button @click.native.prevent="toUpdateUser(scope.row)" size="mini" >
                            编辑
                        </el-button>
                        <el-button @click.native.prevent="queryList(scope.row)" size="mini" >
                            角色
                        </el-button>
                        <el-popconfirm hide-icon title="是否删除？" @onConfirm="deleteUser(scope.row)" style="margin-left: 10px;">
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
    <user-info-detail ref="userInfoDetail"></user-info-detail>
</div></template>
<script>
import { getUserList, getUserInfo, deleteUser } from '@/api/user.js'

export default {
    components: {
        userInfoDetail: () => import('./detail'),
    },
    data() {
        return {
            query_params: {
                username: "",
                nickname: "",
                status: "1"
            },
            page_info: {
                pageSize: 10,
                pageNum: 1,
                total: 0
            },
            loading: {
                loading: true,
                addBtnLoading: false,
            },
            userList: []
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
            getUserList(params, data).then((res) => {
                this.userList = res.list;
                this.page_info.pageNum = res.pageNum;
                this.page_info.total = res.total;
            }).catch(() => {}).finally(() => {
                this.loading.loading = false;
            });
        },
        toCreateUser() {
            this.loading.addBtnLoading = true;
            this.$refs.userInfoDetail.user_info =  {};
            this.$refs.userInfoDetail.user_info.password = "Aa123456";
            this.$refs.userInfoDetail.showDialog();
        },
        toUpdateUser(row) {
            if (row && row.userId) {
                this.loading.loading = true;
                getUserInfo(row.userId).then((res) => {
                    this.$refs.userInfoDetail.titleName = "编辑用户";
                    this.$refs.userInfoDetail.user_info = res;
                    this.$refs.userInfoDetail.showDialog();
                }).catch(() => {}).finally(() => {
                    this.loading.loading = false;
                });
            }
        },
        deleteUser(row) {
            if (row && row.userId) {
                this.loading.loading = true;
                deleteUser(row.userId).then(() => {
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

</style>
