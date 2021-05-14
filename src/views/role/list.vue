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
                    <el-form-item label="角色名称">
                        <el-input v-model="query_params.roleName" placeholder="角色名称"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述">
                        <el-input v-model="query_params.roleDesc" placeholder="角色描述"></el-input>
                    </el-form-item>
                    <el-form-item label="角色状态">
                        <dict-select v-model="query_params.status" dictType="status" placeholder="角色状态" clearable></dict-select>
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
                        <el-button size="small" @click="toCreateRole" :loading="loading.addBtnLoading">新增</el-button>
                    </el-col>
                </el-row>
            </el-card>
            <el-table :data="roleList" border :header-cell-style="tableHeaderColor" size="small" v-loading="loading.loading" style="width: 100%; margin-top: 20px;">
                <el-table-column type="index" :index="1" label="序号" width="90" align="center"></el-table-column>
                <el-table-column prop="roleName" label="角色名称" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" label="角色状态" :formatter="statusFormatter" align="center"></el-table-column>
                <el-table-column prop="createUser" label="用户数" align="center"></el-table-column>
                <el-table-column label="操作" width="270" align="center">
                    <template slot-scope="scope" v-if="scope.row.status != '-1'">
                        <el-button @click.native.prevent="toUpdateRole(scope.row)" size="mini" >
                            编辑
                        </el-button>
                        <el-button @click.native.prevent="toAssignMenu(scope.row)" size="mini" >
                            菜单
                        </el-button>
                        <el-popconfirm hide-icon title="是否删除？" @onConfirm="deleteRole(scope.row)" style="margin-left: 10px;">
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
    <role-info-detail ref="roleInfoDetail"></role-info-detail>
    <menu-assign ref="menuAssign"></menu-assign>
</div></template>
<script>
import axios from 'axios'
import { getRoleList, getRoleInfo, deleteRole, getRoleMenu } from '@/api/role.js'
import { getMenuList } from '@/api/menu.js'
import { menuDataTranslate } from '@/utils/data-translate.js'

export default {
    components: {
        roleInfoDetail: () => import('./detail'),
        menuAssign: () => import('./assign')
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
            roleList: []
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
            getRoleList(params, data).then((res) => {
                this.roleList = res.list;
                this.page_info.pageNum = res.pageNum;
                this.page_info.total = res.total;
            }).catch(() => {}).finally(() => {
                this.loading.loading = false;
            });
        },
        toCreateRole() {
            this.loading.addBtnLoading = true;
            this.$refs.roleInfoDetail.role_info =  {};
            this.$refs.roleInfoDetail.showDialog();
        },
        toUpdateRole(row) {
            if (row && row.roleId) {
                this.loading.loading = true;
                getRoleInfo(row.roleId).then((res) => {
                    this.$refs.roleInfoDetail.titleName = "编辑角色";
                    this.$refs.roleInfoDetail.role_info = res;
                    this.$refs.roleInfoDetail.showDialog();
                }).catch(() => {}).finally(() => {
                    this.loading.loading = false;
                });
            }
        },
        deleteRole(row) {
            if (row && row.roleId) {
                this.loading.loading = true;
                deleteRole(row.roleId).then(() => {
                    this.$message.success("删除成功");
                    this.queryList();
                }).catch(() => {}).finally(() => {
                    this.loading.loading = false;
                });
            }
        },
        toAssignMenu(row) {
            if (row && row.roleId) {
                this.loading.loading = true;
                axios.all([
                    getMenuList({status: "1"}),
                    getRoleMenu(row.roleId)
                ]).then(axios.spread((menuListRes, roleMenuRes) => {
                    this.$refs.menuAssign.roleId = row.roleId;
                    this.$refs.menuAssign.roleName = row.roleName;
                    this.$refs.menuAssign.menu_tree = menuDataTranslate(menuListRes, 0);

                    let assign_menu = [];
                    if (roleMenuRes && roleMenuRes.length) {
                        assign_menu = roleMenuRes.map((item) => {
                            return item.menu.menuId;
                        });
                    }
                    this.$refs.menuAssign.assign_menu_list = assign_menu.filter((item) => {
                        return !menuListRes.some((it) => {
                            return it.pid == item;
                        });
                    }).sort((a, b) => a - b);

                    this.$refs.menuAssign.showDialog();
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
