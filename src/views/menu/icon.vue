<template><div>
    <el-dialog :title="titleName" :visible.sync="dialogFormVisible" :modal-append-to-body="false" :before-close="handleClose" :close-on-click-modal="false" top="5vh" width="910px">
        <ul class="menu-icon-list">
            <li v-for="icon in allIcons" :key="icon" @click="handleIconSelect(icon)">
                <span>
                    <i :class="icon"></i>
                    <span class="icon-name">{{ icon }}</span>
                </span>
            </li>
        </ul>
    </el-dialog>
</div></template>
<script>
import icons from '@/assets/icons/icons.json';

export default {
    name: "menuIconDetail",
    data() {
        return {
            dialogFormVisible: false,
            readonly: false,
            submitLoading: false,
            submitLoadingText: "正在保存，请稍候...",
            titleName: "选择图标",
            allIcons: [],
        }
    },
    created() {
        this.allIcons = icons;
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
        handleIconSelect(icon) {
            if (icon) {
                this.$parent.menu_card.menu_info.menuIcon = icon;
            }
            this.handleClose();
        }
    }
}
</script>
<style lang="scss" scoped>
    .menu-icon-list {
        overflow: hidden;
        list-style: none;
        padding: 0!important;
        border-top: 1px solid #eaeefb;
        border-left: 1px solid #eaeefb;
        border-radius: 4px;
        box-sizing: content-box;

        li {
            float: left;
            width: 16.66%;
            text-align: center;
            height: 120px;
            line-height: 120px;
            color: #666;
            font-size: 13px;
            border-right: 1px solid #eee;
            border-bottom: 1px solid #eee;
            margin-right: -1px;
            margin-bottom: -1px;
            cursor: pointer;

            span {
                line-height: normal;
                font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
                color: #99a9bf;
                transition: color .15s linear;
                display: inline-block;
                vertical-align: middle;
            }

            i {
                display: block;
                font-size: 32px;
                margin-bottom: 15px;
                color: #606266;
                transition: color .15s linear;
            }

            .icon-name {
                display: inline-block;
                padding: 0 3px;
                height: 1em;
                word-break: break-word;
            }
        }

        li:after {
            display: inline-block;
            vertical-align: middle;
            content: "";
            height: 100%;
        }

        li:hover {
            span, i {
                color: #5cb6ff;
            }
        }
    }
</style>
