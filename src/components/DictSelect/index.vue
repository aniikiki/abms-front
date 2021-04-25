<template>
    <el-select :value="value" :placeholder="placeholder" :clearable="clearable" @change="handleChange">
        <el-option
            v-for="(item, key) in dictData"
            :key="key"
            :label="item[1]"
            :value="item[0]"
        >
        </el-option>
    </el-select>
</template>
<script>
export default {
    name: "DictSelect",
    props: {
        dictType: {
            required: true
        },
        value: {
            required: true
        },
        placeholder: {
            required: false
        },
        clearable: {
            default: false,
            required: false
        }
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    data() {
        return {
            dictData: {}
        }
    },
    async created() {
        let dictData = await this.$store.dispatch("dict/get", this.dictType).catch(() => {});
        if (dictData) {
            this.dictData = dictData;
        }
    },
    methods: {
        handleChange(val) {
            this.$emit("change", val);
        }
    }
};
</script>
<style scoped lang="scss">

</style>
