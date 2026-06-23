<script>
import RecordDropdown from "@/components/custom/dropdown/RecordDropdown.vue";
import {
  addProjectProposalResultHistoryToKg, cleanProjectProposalResultHistory,
  generateProjectProposalResultHistory, removeProjectProposalResultHistory, renameProjectProposalResultHistory
} from "@/api/custom/researchAssistance";
import RenameDialog from "@/components/custom/dialog/RenameDialog.vue";
import RecordMdPreviewDialog from "@/components/custom/dialog/RecordMdPreviewDialog.vue";

export default {
  name: "HistoryListDrawer",
  components: {RecordMdPreviewDialog, RenameDialog, RecordDropdown},
  props: {
    show: {type: Boolean, required: true},
  },
  computed: {
    bindValue: {
      get() {
        return this.show;
      },
      set(nValue) {
        this.$emit("update:show", nValue);
      }
    }
  },
  data() {
    return {
      dataList: [],
      showRenameDialog: false,
      showPreviewDialog: false,
      record: undefined,
    }
  },
  async mounted() {
    const response = await generateProjectProposalResultHistory();
    this.dataList = response.rows;
  },
  methods: {
    async onAddKg(record) {
      await addProjectProposalResultHistoryToKg(record.id);
    },
    async onRename(record) {
      this.record = record;
      this.showRenameDialog = true;
    },
    async doRename(id, value) {
      await renameProjectProposalResultHistory(id, value);
      const index = this.dataList.findIndex(item => item.id === id);
      this.$set(this.dataList[index], 'title', value);
    },
    async onRemove(record) {
      await removeProjectProposalResultHistory(record.id);
    },
    closeRenameDialog() {
      this.showRenameDialog = false;
    },
    async cleanHistory() {
      await cleanProjectProposalResultHistory();
      this.dataList = [];
    },
    openPreviewDialog(record) {
      this.record = record;
      this.showPreviewDialog = true;
    },
    closePreviewDialog() {
      this.showPreviewDialog = false;
    }
  }

}
</script>

<template>
  <div class="hide-scroll-bar">
    <RenameDialog :show="showRenameDialog"
                  :on-ok="doRename"
                  :on-cancel="closeRenameDialog"
                  :record="record"/>
    <RecordMdPreviewDialog :show="showPreviewDialog" :on-cancel="closePreviewDialog" :record="record"/>
    <el-drawer custom-class="custom-drawer" title=""
               :visible.sync="bindValue"
               :with-header="false" :append-to-body="true">
      <div class="w-full h-full px-6 pt-[75px]">
        <div class="w-full flex justify-between items-center mb-6">
          <div class="text-[#1D2129] text-[16px] leading-[20px] font-bold">生成记录</div>
          <el-popconfirm title="此操作会清空全部历史记录,是否确认?"
                         icon="el-icon-info" append-to-body :visible-arrow="false"
                         popper-class="custom-popconfirm"
                         icon-color="#FF5656" @onConfirm="cleanHistory">
            <div slot="reference" class="text-[#FF5656] text-[16px] leading-[20px] cursor-pointer">清空</div>
          </el-popconfirm>
        </div>
        <div class="w-full flex flex-col gap-5">
          <div v-for="(item, index) in dataList" :key="index" class="w-full flex flex-col">
            <div class="w-full flex justify-between items-center border-b border-b-[#495764] pb-2">
              <div class="w-[calc(100%-110px)] text-[#1D2129] text-[16px] cursor-pointer"
                   @click="() => openPreviewDialog(item)">
                <div class="w-full cursor-pointer truncate">{{ item.title }}</div>
              </div>
              <div class="flex justify-center items-center gap-4">
                <span class="text-[12px] text-[#86909C]">
                  {{ item && item.dateTime && item.dateTime.substr(0, 10) }}
                </span>
                <RecordDropdown :on-add-kg="() => onAddKg(item)"
                                :on-rename="() => onRename(item)"
                                :on-remove="() => onRemove(item)"/>
              </div>
            </div>
            <div class="w-full px-1 py-2">
              <p class="text-[#4E5969] text-[14px] overflow-hidden clamp break-all">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

::v-deep .el-drawer__body {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>

<style lang="scss">
.custom-popconfirm {
  padding: 16px;
  border-radius: 8px;
  margin-right: 8px;

  ::v-deep .el-popconfirm {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  ::v-deep .popper__arrow {
    display: none;
  }
}
</style>
