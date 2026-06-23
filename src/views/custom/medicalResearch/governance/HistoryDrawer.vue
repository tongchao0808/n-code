<script>
import RecordDropdown from "@/components/custom/dropdown/RecordDropdown.vue";
import MessageDialog from "@/components/custom/dialog/MessageDialog.vue";

export default {
  name: "HistoryDrawer",
  components: {MessageDialog, RecordDropdown},
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
      removeMessageDialogShow: false,
    }
  },
  methods: {
    handleDropdownClick() {},
    doRemove() {},
    closeRemoveMessageDialog() {},
  }
}
</script>

<template>
  <el-drawer custom-class="custom-drawer" title=""
             :visible.sync="bindValue"
             :with-header="false" :append-to-body="true">
    <div class="w-full h-full px-6 pt-[75px]">
      <div class="w-full flex justify-between items-center">
        <div class="text-[#1D2129] text-base font-bold">病案记录</div>
        <div class="text-[#3662FF] text-base cursor-pointer">导出</div>
      </div>
      <div class="w-full flex flex-col gap-5">
        <div v-for="(item, index) in $store.state.governance.histories" :key="index" class="w-full flex flex-col">
          <div class="w-full flex justify-between items-center border-b border-b-[#495764] pb-2">
            <div class="w-[calc(100%-110px)] text-[#1D2129] text-[16px] cursor-pointer">
              <div class="w-full cursor-pointer truncate">{{ item.name }}</div>
            </div>
            <div class="flex justify-center items-center gap-4">
                <span class="text-[12px] text-[#86909C]">
                  {{ item && item.createTime && item.createTime.substr(0, 10) }}
                </span>
              <el-dropdown trigger="click" @command="handleDropdownClick">
                <div class="cursor-pointer">
                  <div class="w-[22px] h-[22px] flex rounded justify-center items-center hover:bg-[#F2F3F5] cursor-pointer">
                    <svg-icon icon-class="be-pending" class-name="!w-[20px] !h-[20px] text-[#1D2129]"/>
                  </div>
                  <MessageDialog :show="removeMessageDialogShow"
                                 title="确认要删除这条记录吗?" desc="删除此记录将不可撤销,请谨慎选择"
                                 :on-ok="doRemove" :onCancel="closeRemoveMessageDialog"/>
                </div>
                <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
                  <el-dropdown-item command="start">
                    <div class="w-full flex items-center gap-1">
                      <svg-icon icon-class="play" class-name="text-[#1D2129] !w-[18px] !h-[18px]"/>
                      <span class="text-[#1D2129] text-[14px]">启动任务</span>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item command="rename">
                    <div class="w-full flex items-center gap-1">
                      <svg-icon icon-class="rename" class-name="text-[#1D2129] !w-[18px] !h-[18px]"/>
                      <span class="text-[#1D2129] text-[14px]">重命名</span>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item command="clean-cache">
                    <div class="w-full flex items-center gap-1">
                      <svg-icon icon-class="clean" class-name="text-[#1D2129] !w-[18px] !h-[18px]"/>
                      <span class="text-[#1D2129] text-[14px]">清除缓存</span>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item command="remove">
                    <div class="w-full flex items-center gap-1">
                      <svg-icon icon-class="delete" class-name="text-[#FF5656] !w-[18px] !h-[18px]"/>
                      <span class="text-[#FF5656] text-[14px]">删除</span>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="w-full px-1 py-2">
            <p class="text-[#4E5969] text-[14px] overflow-hidden clamp break-all">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
::v-deep .el-drawer__body {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
