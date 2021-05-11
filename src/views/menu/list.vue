<template><div>
    <el-container>
        <el-main v-loading="loading.loading">
            <el-row type="flex" :gutter="20">
                <el-col :span="8">
                    <el-card shadow="never">
                        <el-form :model="query_params" label-width="80px" size="mini">
                            <el-row type="flex">
                                <el-col :span="10">
                                    <el-form-item label="菜单名称">
                                        <el-input v-model="query_params.menuName"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item label="菜单状态">
                                        <el-select v-model="query_params.status" placeholder="" clearable>
                                            <el-option label="启用" value="1"></el-option>
                                            <el-option label="停用" value="0"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label-width="0" style="float: right">
                                        <el-button type="text" @click="toCreateMenu()">新增</el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-tree
                            :data="menu_list"
                            :props="defaultProps"
                            node-key="menuId"
                            :filter-node-method="filterMenu"
                            @node-click="handleNodeClick"
                            :expand-on-click-node="false"
                            :default-expand-all="true"
                            highlight-current
                            draggable
                            @node-drag-enter="handleDragEnter"
                            @node-drop="handleDrop"
                            ref="menuTree">
                            <span class="menu-tree-node" slot-scope="{ node, data }">
                                <span class="custom-tree-node-label">
                                    <i :class="data.menuIcon" style="margin-right: 4px;"></i>
                                    {{ node.label }}
                                </span>
                                <span>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click.stop="toAddMenu(data)">
                                        增加
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click.stop="deleteMenu(data, node)">
                                        删除
                                    </el-button>
                                </span>
                            </span>
                        </el-tree>
                    </el-card>
                </el-col>
                <el-col :span="16">
                    <el-card shadow="never" v-loading="loading.submitLoading" :element-loading-text="loading.submitLoadingText">
                        <div slot="header" style="border-bottom: none;">
                            <span>{{menu_card.title}}</span>
                            <el-button type="primary" @click="handleSubmit('menuInfoForm')" size="mini" style="float: right; margin-top: -4px;">保存</el-button>
                        </div>
                        <el-form :model="menu_card.menu_info" :rules="rules" ref="menuInfoForm" label-position="right" class="menu-info-form" label-width="80px" size="small">
                            <el-form-item label="上级菜单" prop="" v-if="menu_card.menu_info.parentMenu">
                                <el-input v-model="menu_card.menu_info.parentMenu" readonly autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="菜单名称" prop="menuName">
                                <el-input v-model="menu_card.menu_info.menuName" autocomplete="off" show-word-limit maxlength="30"></el-input>
                            </el-form-item>
                            <el-form-item label="菜单类型" prop="menuType">
                                <dict-select v-model="menu_card.menu_info.menuType" dictType="menu_type" placeholder="菜单类型" clearable></dict-select>
                            </el-form-item>
                            <el-form-item label="菜单地址" prop="menuUrl">
                                <el-input v-model="menu_card.menu_info.menuUrl" autocomplete="off" show-word-limit maxlength="30"></el-input>
                            </el-form-item>
                            <el-form-item label="菜单排序" prop="sort">
                                <el-input-number v-model="menu_card.menu_info.sort" size="mini" :min="0"></el-input-number>
                            </el-form-item>
                            <el-form-item label="菜单图标" prop="">
                                <el-button circle @click="toChooseIcon" style="padding: 8px;">
                                    <i :class="menu_card.menu_info.menuIcon" style="font-size: 14px;"></i>
                                </el-button>
                            </el-form-item>
                            <el-form-item label="是否启用" prop="" v-if="menu_card.menu_info.menuId">
                                <el-switch v-model="menu_card.menu_info.status" active-value="1" inactive-value="0"></el-switch>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
    <menu-icon-detail ref="menuIconDetail"></menu-icon-detail>
</div></template>
<script>
import { getMenuList, createMenu, updateMenu, deleteMenu } from '@/api/menu.js'
import { menuDataTranslate } from '@/utils/data-translate.js'

export default {
    components: {
        menuIconDetail: () => import('./icon'),
    },
    data() {
        return {
            loading: {
                loading: true,
                submitLoading: false,
                submitLoadingText: "正在保存，请稍候...",
            },
            position: {
                before: "前",
                after: "后",
                inner: "中"
            },
            query_params: {
                pid: "",
                menuName: "",
                status: ""
            },
            defaultProps: {
                children: 'children',
                label: 'menuName'
            },
            rules: {
                menuName: [
                    { required: true, message: '请输入菜单名称', trigger: 'blur' },
                    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                ],
                menuType: [
                    { required: true, message: '请选择菜单类型', trigger: 'blur' }
                ],
                menuUrl: [
                    { required: true, message: '请输入菜单地址', trigger: 'blur' },
                    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: '请输入菜单排序', trigger: 'blur' },
                ],
            },
            menu_list: [],
            menu_card: {
                title: "新增菜单",
                menu_info: {
                    pid: "0",
                    menuName: "",
                    menuType: "",
                    menuUrl: "",
                    menuIcon: "el-icon-setting",
                    sort: 0,
                    status: "1",
                }
            }
        }
    },
    watch: {
        "query_params.menuName": function(val) {
            if (this.$refs.menuTree) {
                this.$refs.menuTree.filter(val);
            }
        },
        "query_params.status": function(val) {
            if (this.$refs.menuTree) {
                this.$refs.menuTree.filter(val);
            }
        }
    },
    created() {
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
        queryList() {
            let data = this.query_params;

            this.loading.loading = true;
            getMenuList(data).then((res) => {
                this.menu_list = menuDataTranslate(res, [], 0);
            }).catch(() => {}).finally(() => {
                this.loading.loading = false;
            });
        },
        filterMenu(value, data) {
            if (!value) {
                return true;
            }
            let flag_menuName = this.query_params.menuName ? data.menuName.indexOf(this.query_params.menuName) !== -1 : true;
            let flag_menuStatus = this.query_params.status ? data.status == this.query_params.status : true;
            return flag_menuName && flag_menuStatus;
        },
        handleNodeClick(data, node) {
            this.resetForm("menuInfoForm");
            this.menu_card.title = data.menuName;
            this.menu_card.menu_info.parentMenu = node.parent.data.menuName;
            Object.assign(this.menu_card.menu_info, data);
        },
        toCreateMenu() {
            this.resetForm("menuInfoForm");
            this.menu_card.menu_info = {
                pid: "0",
                menuName: "",
                menuType: "",
                menuUrl: "",
                menuIcon: "el-icon-setting",
                sort: this.$refs.menuTree.data.length,
                status: "1"
            };
        },
        toAddMenu(data) {
            this.resetForm("menuInfoForm");
            this.menu_card.title = "新增菜单";
            this.menu_card.menu_info = {
                pid: data.menuId,
                parentMenu: data.menuName,
                menuName: "",
                menuType: "",
                menuUrl: "",
                menuIcon: "el-icon-setting",
                sort: data.children ? data.children.length : 0,
                status: "1"
            };
        },
        toChooseIcon() {
            this.$refs.menuIconDetail.showDialog();
        },
        handleSubmit(formName) {
            this.loading.submitLoading = true;

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let { pid, menuId, menuName, menuType, menuUrl, menuIcon, sort, status } = this.menu_card.menu_info;
                    let data = { pid, menuId, menuName, menuType, menuUrl, menuIcon, sort, status };

                    let prom = "";
                    if (!data.menuId) {
                        prom = createMenu(data);
                    } else {
                        prom = updateMenu(data);
                    }
                    prom.then(() => {
                        this.$message.success("保存成功");
                        this.queryList();
                    }).catch(() => {}).finally(() => {
                        this.loading.submitLoading = false;
                    });
                } else {
                    this.loading.submitLoading = false;
                }
            });
        },
        deleteMenu(data) {
            if (data && data.menuId) {
                this.$confirm('确认删除【' + data.menuName + '】及其所有子菜单?', '确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading.submitLoading = true;
                    deleteMenu(data.menuId).then(() => {
                        this.$message.success("删除成功");
                        this.queryList();
                    }).catch(() => {}).finally(() => {
                        this.loading.submitLoading = false;
                    });
                }).catch(() => {});
            }
        },
        handleDragEnter(draggingNode, dropNode) {
            if (!dropNode.expanded) {
                dropNode.expanded = true;
            }
        },
        handleDrop(draggingNode, dropNode, position) {
            this.$confirm('确认将【' + draggingNode.data.menuName + '】及其所有子菜单移动到【' + dropNode.data.menuName + '】' + this.position[position] + '?', '确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    menuId: draggingNode.data.menuId
                };

                if (position === "inner") {
                    data.pid = dropNode.data.menuId;
                    data.sort = 0;
                } else {
                    data.pid = dropNode.data.pid;
                    if (position === "before") {
                        data.sort = parseInt(dropNode.data.sort) - 1;
                    } else if (position === "after") {
                        data.sort = parseInt(dropNode.data.sort) + 1;
                    }
                }

                this.loading.submitLoading = true;
                updateMenu(data).then(() => {
                    this.$message.success("保存成功");
                    this.queryList();
                }).catch(() => {}).finally(() => {
                    this.loading.submitLoading = false;
                });
            }).catch(() => {
                this.queryList();
            });
        }
    }
}
</script>
<style lang="scss">
    .el-card__header {
        border-bottom: none;
    }
</style>
<style lang="scss" scoped>
    .menu-info-form {
        width: 50%;
    }
    .menu-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
    }
</style>
