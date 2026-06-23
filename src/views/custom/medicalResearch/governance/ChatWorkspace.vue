<script>
import GovernanceTypeSelect from "@/views/custom/medicalResearch/governance/GovernanceTypeSelect.vue";
import DynamicHeightTextArea from "@/components/custom/form/DynamicHeightTextArea.vue";
import ChatHeader from "@/views/custom/medicalResearch/governance/ChatHeader.vue";
import OperationTypeSelect from "@/views/custom/medicalResearch/governance/OperationTypeSelect.vue";
import ChatSendButtonGroup from "@/components/custom/chat/ChatSendButtonGroup.vue";


export default {
  name: "ChatWorkspace",
  components: {ChatSendButtonGroup, OperationTypeSelect, ChatHeader, DynamicHeightTextArea, GovernanceTypeSelect},
  data() {
    return {
    }
  },
  async mounted() {
    await this.$store.dispatch("governance/initMedicalRecordCategories");
    await this.$store.dispatch("governance/createFormIfNeeded");
  },
  watch: {
    '$store.state.governance.activeMedicalRecordCategory': {
      immediate: true,
      handler(nValue) {
        this.$store.dispatch("governance/createFormIfNeeded");
      }
    }
  },
  computed: {
    bindForm: {
      get() {
        return this.$store.state.governance.form[this.$store.state.governance.activeMedicalRecordCategory];
      },
      set(nValue) {
        this.$store.state.governance.form[this.$store.state.governance.activeMedicalRecordCategory] = nValue;
      }
    },
    textAreaRows() {
      if (!window) {
        return 5;
      }
      const height = window.innerHeight;
      if (!height) {
        return 15;
      }
      const scopes = [
        { min: 0, max: 800, value: 15 },
        { min: 800, max: 1200, value: 20 },
        { min: 1200, max: 999999, value: 25 },
      ];
      return scopes.find(scope => height >= scope.min && height < scope.max)?.value || 5;
    },
  },
  methods: {
    generate() {
      this.$store.dispatch("governance/doGenerate")
    }
  }
}
</script>

<template>
  <div class="relative flex flex-col w-full h-full py-2">
    <ChatHeader/>
    <div class="flex flex-col flex-1 w-full px-6">
      <div class="flex flex-col flex-1 overflow-hidden">
        <el-tabs v-model="$store.state.governance.activeMedicalRecordCategory" class="flex flex-col flex-1">
          <el-tab-pane v-for="(item, index) in $store.state.governance.medicalRecordCategories" :key="index"
                       :label="item.label" :name="item.value" class="flex flex-col flex-1">
            <div class="flex items-center justify-between w-full">
              <OperationTypeSelect/>
              <div>12121212</div>
            </div>
            <div class="flex-1">
              <el-form :model="bindForm" class="h-full">
                <el-form-item class="h-full custom-form-item" label="内容输入区" props="content">
                  <DynamicHeightTextArea v-model="bindForm.content" :rows="textAreaRows"/>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="w-full border-t border-t-[#E5E6EB] pt-3">
        <ChatSendButtonGroup :send="generate" reset=""/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom-form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin: 0;
  padding: 8px;
  flex: 1;

  ::v-deep .el-form-item__label {
    display: flex;
    align-items: center;
    position: relative;
    font-size: 14px;
    line-height: 14px;
    color: #1D2129;
    font-weight: 400;
  }

  ::v-deep .el-form-item__label:before {
    position: absolute;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
  }

  ::v-deep .el-form-item__content {
    flex: 1;
    display: flex;
    align-items: flex-start;
    margin: 0 !important;
  }

  ::v-deep .el-input__inner:focus {
    border: 1px solid #FF89B6;
    caret-color: #FF89B6;
  }
}

::v-deep .el-tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
}

::v-deep .el-tabs__content {
  flex: 1;
  overflow: auto;
}

::v-deep .el-tab-pane {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
