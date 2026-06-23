<template>
    <div class="translation-tab flex items-center">
                <el-dropdown @command="v=>handletranslation('translationFrom', v)" trigger="click" :disabled="disabledFrom"
                    class="custom-dropdown px-[8px] py-[4px] rounded-[8px] border-[#E5E6EB] border-[1px]">
                    <span class="el-dropdown-link">
                        {{languages.find(v => v.value == translationFrom)?.label}}<i
                            class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="value in languages" :command="value.value">{{ value.label
                        }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                    <el-button type="text" icon="el-icon-sort " @click="handleExchange" class="text-[18px] text-[#959BA1] ml-[8px] mr-[8px] rotate-90" :disabled="translationFrom === 'AUTO_DETECT' || !allowExchange" />
                <el-dropdown @command="v=>handletranslation('translationTo', v)" trigger="click"  :disabled="disabledTo"
                    class="custom-dropdown px-[8px] py-[4px] rounded-[8px] border-[#E5E6EB] border-[1px]">
                    <span class="el-dropdown-link">
                        {{languages.find(v => v.value == translationTo)?.label}}<i
                            class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="value in languages.slice(1)" :command="value.value">{{ value.label
                        }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
</template>

<script>
import { getTranslationLanguages } from '@/api/custom/translation';

export default {
    name: 'TranslationTab',
    props: {
        from: {
            type: String,
            default: 'AUTO_DETECT',
        },
        to: {
            type: String,
            default: 'CHINESE',
        },
        allowExchange: {
            type: Boolean,
            default: true,
        },
        disabledFrom: {
            type: Boolean,
            default: false,
        },
        disabledTo: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        const languages = [
                {
                    label: '自动检测',
                    value: 'AUTO_DETECT'
                },
                {
                    label: '中文',
                    value: 'CHINESE'
                },
                {
                    label: '英文',
                    value: 'ENGLISH'
                },
            ]
        return {
            translationFrom: 'AUTO_DETECT',
            translationTo: 'CHINESE',
            languages,
        }
    },
    created() {
        this.from && (this.translationFrom = this.from);
        this.to && (this.translationTo = this.to);
        this.getLanguages();
    },
    mounted() {
    },
    methods: {
         async getLanguages() {
            const res = await getTranslationLanguages();
            if(res.code === 200) {
                this.languages = res.data.items.map(v => ({
                    label: v.name,
                    value: v.value,
                }));
            }
            this.$emit('change', this.getValue());
        },
        getValue() {
            return {
                translationFrom: this.translationFrom,
                translationTo: this.translationTo,
                fromLabel: this.languages.find(v => v.value == this.translationFrom).label,
                toLabel: this.languages.find(v => v.value == this.translationTo).label,
            }
        },
        handletranslation(property, value) {
            this[property] = value;
            this.$emit('change', this.getValue());
        },
        handleExchange() {
            if(this.translationFrom === this.translationTo) {
                return;
            }
            [this.translationFrom, this.translationTo] = [this.translationTo, this.translationFrom];
            this.$emit('change', this.getValue());
        },
    }
}
</script>

<style scoped lang="scss">
.translation-tab {
    ::v-deep .el-button--medium {
    padding: 0 !important;
}
}

</style>