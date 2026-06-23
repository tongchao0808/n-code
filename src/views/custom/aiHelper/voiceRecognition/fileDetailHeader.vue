<template>
    <div class="w-full h-full flex items-center px-[32px]">
        <div class="h-full flex items-center gap-[12px]">
            <svg-icon icon-class="right-arrow"
                class-name="!w-[24px] !h-[24px] rotate-180 text-[#5F646C] cursor-pointer hover:text-[#3662FF] hover:scale-110"
                @click="returnToHome" />
            <svg-icon icon-class="voice-file" class-name="!w-[48px] !h-[48px]" />
            <div class="flex flex-col">
                <div class="text-[14px] leading-[24px] font-bold">{{ currentRow.title }}</div>
                <div class="flex text-[12px] leading-[22px] text-[#5F646C]">
                    {{ parseTime(currentRow.time, '{y}-{m}-{d} {h}:{i}') }}<span
                        class="px-[12px] text-[#B8CDFF]">|</span>{{ formatDuration(currentRow.duration) }}
                </div>
            </div>
        </div>
        <div>
        </div>
        <AddKnowledgeDialog :chat-title="removeFileExtension(currentRow.title)+'('+optionTypeMap[optionType]+')'"
            :data-list="knowledgeBaseDataList" :show="addToKgDialogShow" :sessionUniqueId="String(detailId)"
            :mode="optionType" :on-ok="doAddToKg" :on-cancel="() => addToKgDialogShow = false"
            :on-add-new="() => createKgDialogShow = true" />
        <NewKnowledgeBaseDialog :show="createKgDialogShow" :on-ok="doCreateKg"
            :on-cancel="() => createKgDialogShow = false" />
    </div>
</template>

<script>
import AddKnowledgeDialog from "@/components/custom/dialog/AddKnowledgeDialog.vue";
import NewKnowledgeBaseDialog from "@/components/custom/dialog/NewKnowledgeBaseDialog.vue";
import { createNewKg, getUserKnowledgeList } from "@/api/custom/customKnowledgeBase";
import { addToKnowledge } from "@/api/custom/voiceRecognition";
export default {
    name: 'FileDetailHeader',
    components: {
        AddKnowledgeDialog,
        NewKnowledgeBaseDialog
    },
    props: {
        currentRow: {
            type: Object,
            default: {}
        },
        detailId: {
            type: Number,
            default: 0
        },
        optionType: {
            type: String,
            default: '1'
        }
    },
    data() {
        const optionTypeMap = {
            '1': '会议纪要',
            '2': '章节纪要',
            '3': '文本记录'
        }
        return {
            copyText: '',
            addToKgDialogShow: false,
            createKgDialogShow: false,
            knowledgeBaseDataList: [],
            optionTypeMap,
        }
    },
    methods: {
        parseCopyText() {
            switch (this.optionType) {
                case '1':
                    this.copyText = this.currentRow?.summary?.content || ''
                    break
                case '2':
                    this.copyText = ''
                    this.currentRow.chapterSummaries.forEach(item => {
                        this.copyText += `${this.formatDuration(item.startTime)}-${this.formatDuration(item.endTime)}\n${item.content}\n\n`
                    })
                    break
                case '3':
                    this.copyText = ''
                    this.currentRow.recognitionResults.forEach(item => {
                        this.copyText += `${item.speaker.name}\n${item.content}\n\n`
                    })
                    break
            }
        },
        copyChat() {
            this.parseCopyText()
            this.$copyText(this.copyText).then(() => {
                this.$message.success('复制成功')
            })
        },
        addCurrentChatToKnowledge() {
            this.reloadKnowledgeBaseList()
            this.addToKgDialogShow = true
        },
        returnToHome() {
            this.$emit('onCancel')
        },
        formatDuration(duration) {
            if (!duration) {
                return '0分0秒'
            }
            duration = Math.round(duration)
            const minutes = Math.floor(duration / 60)
            const seconds = duration % 60
            return `${minutes.toString().padStart(2, '0')}分${seconds.toString().padStart(2, '0')}秒`
        },
        async doCreateKg(name, permission) {
            await createNewKg(name, permission);
            await this.reloadKnowledgeBaseList();
            this.createKgDialogShow = false;
        },
        async reloadKnowledgeBaseList() {
            this.knowledgeBaseDataList = await getUserKnowledgeList(3);
        },
        removeFileExtension(filename) {
            if (!filename) {
                return ""
            }
            return filename.replace(/\.[^/.]+$/, '')
        },
        async doAddToKg(detailId, messageId, kgIds, mode, fileTitle) {
            console.log(detailId, messageId, kgIds, mode, fileTitle);
            const addTypeMap = {
                '1': 'OVERALL_SUMMARY',
                '2': 'PARAGRAPH_SUMMARY',
                '3': 'SENTENCE'
            }
            await addToKnowledge({
                fileId: Number(detailId),
                addType: addTypeMap[mode],
                knowledgeDatabaseId: kgIds[0],
                title: fileTitle
            }).then(res => {
                if (res.code === 200) {
                    this.changeAddToKgDialogShow(false)
                    this.$message.success('添加成功')
                    // this.$emit('onAddSuccess', mode)
                }
            })
        },
        changeAddToKgDialogShow(status) {
            this.addToKgDialogShow = status
        },
        changeCreateKgDialogShow(status) {
            this.createKgDialogShow = status
        },
        formatDuration(duration) {
            if (!duration) {
                return '00:00'
            }
            duration = Math.round(duration)
            const minutes = Math.floor(duration / 60)
            const seconds = duration % 60
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        },
    }
}
</script>
