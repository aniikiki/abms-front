<template>
    <el-pagination
        background
        :layout="layout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total">
    </el-pagination>
</template>
<script>
    export default {
        name: "pagination",
        props: {
            pageNum: {
                type: [String, Number],
                default: 1,
                required: true
            },
            pageSize: {
                type: [String, Number],
                default: 10,
                required: true
            },
            total: {
                type: [String, Number],
                default: 0,
                required: true
            },
            layout: {
                type: String,
                default: 'total, sizes, prev, pager, next, jumper',
                required: false
            }
        },
        data() {
            return {

            }
        },
        created() {

        },
        methods: {
            handleCurrentChange(currentPage) {
                this.$emit('update:pageNum', currentPage);
                this.$emit("page-change");
            },
            handleSizeChange(pageSize) {
                this.$emit('update:pageSize', pageSize);
                this.$emit("page-change");
            }
        }
    };
</script>
<style scoped lang="scss">

</style>
