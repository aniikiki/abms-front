<template><div>
    <div class="navbar">
        <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

        <breadcrumb class="breadcrumb-container" />

        <div class="right-menu">
            <el-dropdown trigger="hover">
                <div class="avatar-container">
                    <el-avatar :src="avatar"></el-avatar>
                    <span style="margin-left: 8px;">
                        <i class="user-name">{{name}}</i>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                </div>
                <el-dropdown-menu slot="dropdown" class="user-dropdown">
                    <el-dropdown-item icon="el-icon-user-solid">
                        <router-link to="/">个人信息</router-link>
                    </el-dropdown-item>
                    <el-dropdown-item icon="el-icon-edit-outline" @click.native="toChangePassword">修改密码</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-close" @click.native="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
    <changePassword ref="changePassword"></changePassword>
</div></template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
    components: {
        Breadcrumb,
        Hamburger,
        changePassword: () => import('@/views/user/change_password')
    },
    computed: {
        ...mapGetters([
            'sidebar',
            'avatar',
            'name'
        ])
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        toChangePassword() {
            this.$refs.changePassword.resetForm("changePasswordForm");
            this.$refs.changePassword.showDialog();
        },
        async logout() {
            await this.$store.dispatch('user/logout');
            this.$router.push({path: `/login?redirect=${this.$route.fullPath}`});
        }
    }
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background .3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, .025)
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;
        margin-right: 20px;

        &:focus {
            outline: none;
        }

        .el-icon-arrow-down {
            transition: all 1s;
        }

        .avatar-container {
            display: flex;
            justify-content: center;
            align-items: center;

            .user-name {
                display: inline-block;
                max-width: 80px;
                white-space: nowrap;
                word-break: keep-all;
                overflow: hidden;
                text-overflow: ellipsis;
                font-style: normal;
                vertical-align: bottom;
            }

            .user-avatar {
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 10px;
            }

            .el-icon-caret-bottom {
                cursor: pointer;
                position: absolute;
                right: -20px;
                top: 25px;
                font-size: 12px;
            }
        }

    }
}

.user-dropdown {
    a {
        display: inline;
    }
}

.right-menu:hover {
    .el-icon-arrow-down {
        transform: rotateX(180deg);
    }
}
</style>
