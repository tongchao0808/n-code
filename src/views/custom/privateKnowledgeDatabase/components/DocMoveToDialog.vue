<script>
import { getCustomKnowledgeBaseList } from "@/api/custom/customKnowledgeBase";
import PrimaryButton from "@/components/custom/button/PrimaryButton.vue";
import SecondaryButton from "@/components/custom/button/SecondaryButton.vue";

export default {
  name: "DocMoveToDialog",
  components: { SecondaryButton, PrimaryButton },
  props: {
    show: { type: Boolean, default: false },
    onOk: { type: Function, default: null },
    onCancel: { type: Function, default: null },
    docId: { type: [String, Number], required: true },
    list: { type: Array, default: () => [] },
  },
  data() {
    return {
      kgList: [],
      selectedKgId: "",
      databaseId: "",
      selectedKgName: "",
      defaultKg: {},
      myShareList: [],
      myPrivateList: [],
      myShareParams: {
        pageNum: 1,
        pageSize: 100,
        permissionType: "SHARED_BY_ME",
        total: 0,
      },
      myPrivateParams: {
        pageNum: 1,
        pageSize: 100,
        permissionType: "MY_PERSONAL",
        total: 0,
      },
    };
  },
  methods: {
    async reloadKgList(params) {
      const res = await getCustomKnowledgeBaseList(params);
      switch (params.permissionType) {
        case "ALL":
          this.defaultKg = res.records.find((item) => item.isDefault);
          break;
        case "SHARED_BY_ME":
          this.myShareList = res.records;
          break;
        case "MY_PERSONAL":
          this.myPrivateList = res.records;
          break;
      }
      this.kgList = res.records;
    },
    doSelectThisKg(kg) {
      this.selectedKgId = kg.id;
      this.selectedKgName = kg.name;
    },
    doSelectThis(item) {
      this.databaseId = this.list[0].id;
      this.selectedKgId = item.id == this.list[0].id ? 0 : item.id;
      this.selectedKgName = item.label;
    },
    handleOpen() {},
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      key = Number(key);
      this.selectedKgId = key;
      this.selectedKgName = this[keyPath[0]].find(
        (item) => item.id === key
      ).name;
    },
  },
  watch: {
    show: {
      immediate: true,
      handler(nValue) {
        if (nValue) {
          const defaultParams = {
            pageNum: 1,
            pageSize: 10,
            permissionType: "ALL",
          };
          // this.reloadKgList(defaultParams);
          // this.reloadKgList(this.myShareParams);
          // this.reloadKgList(this.myPrivateParams);
        }
      },
    },
  },
};
</script>

<template>
  <el-dialog
    class="custom-dialog"
    :visible.sync="show"
    :show-close="false"
    width="400px"
    :modal-append-to-body="true"
  >
    <div slot="title" class="px-6 py-[14px] flex justify-between items-center">
      <span class="text-[#1D2129] text-[16px] font-bold">
        移动到：
        <span class="ml-2 text-[#3662FF] font-normal">{{
          selectedKgName
        }}</span>
      </span>
      <div class="cursor-pointer" @click="onCancel">
        <svg-icon
          icon-class="close"
          class-name="!w-[24px] !h-[24px] text-[#808080]"
        />
      </div>
    </div>

    <div class="flex flex-col items-start justify-start w-full px-[24px]">
      <div
        v-for="item in list"
        :key="item.name"
        :index="item.name"
        class="flex items-center gap-[8px] text-[#1D2129] text-[14px] leading-[18px] font-ms-yahei hover:bg-[#F5F8FF] cursor-pointer"
        @click.stop="() => doSelectThis(item)"
      >
        <svg-icon
          icon-class="knowledge-base-public"
          class-name="!w-[32px] !h-[32px]"
        />{{ item.label }}
      </div>
      <!-- <div
        class="w-full flex items-center gap-[8px] py-3 hover:bg-[#F5F8FF] cursor-pointer p-[8px]"
        @click.stop="() => doSelectThisKg(defaultKg)"
      >
        <svg-icon
          icon-class="knowledge-base-default"
          class-name="!w-[32px] !h-[32px]"
        />
        <div
          class="text-[#1D2129] text-[14px] leading-[18px] font-ms-yahei cursor-pointer"
        >
          {{ defaultKg.name }}
        </div>
      </div>

      <el-menu
        default-active="1"
        class="w-full el-menu-vertical"
        @open="handleOpen"
        @select="handleSelect"
        unique-opened
      >
        <el-submenu index="myShareList">
          <template slot="title">
            <span class="px-[8px]">我的共享</span>
          </template>
          <el-menu-item
            v-for="item in myShareList"
            :key="item.id"
            :index="item.id.toString()"
            class="flex items-center gap-[8px] text-[#1D2129] text-[14px] leading-[18px] font-ms-yahei"
            ><svg-icon
              icon-class="knowledge-base-public"
              class-name="!w-[32px] !h-[32px]"
            />{{ item.name }}</el-menu-item
          >
        </el-submenu>

        <el-submenu index="myPrivateList">
          <template slot="title">
            <span class="px-[8px]">我的个人库</span>
          </template>
          <el-menu-item
            v-for="item in myPrivateList"
            :key="item.id"
            :index="item.id.toString()"
            class="flex items-center gap-[8px] text-[#1D2129] text-[14px] leading-[18px] font-ms-yahei"
            ><svg-icon
              icon-class="knowledge-base-private"
              class-name="!w-[32px] !h-[32px]"
            />{{ item.name }}</el-menu-item
          >
        </el-submenu>
      </el-menu> -->
    </div>

    <div
      slot="footer"
      class="w-full flex justify-end items-center pt-3 pb-4 px-6 gap-[10px]"
    >
      <div class="w-[74px] h-[32px]">
        <SecondaryButton text="取消" @click="onCancel" />
      </div>
      <div class="w-[74px] h-[32px]">
        <PrimaryButton
          text="移动到此"
          @click="() => onOk(docId, databaseId, selectedKgId)"
        />
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.custom-dialog {
  padding: 0;

  ::v-deep .el-dialog {
    border-radius: 8px;
  }

  ::v-deep .el-dialog__header {
    padding: 0 !important;
  }

  ::v-deep .el-dialog__body {
    padding: 0 !important;
    height: 344px;
    max-height: 344px;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 10px;
      background-color: #f5f8ff;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #3662ff;
    }
  }

  ::v-deep .el-dialog__footer {
    padding: 0 !important;
  }

  ::v-deep .el-submenu .el-menu-item {
    padding: 0 20px !important;
  }
  ::v-deep .el-menu-item.is-active {
    color: #3662ff;
    font-weight: 600;
  }
  ::v-deep .el-menu-item:hover,
  .el-menu-item:focus {
    background-color: #f5f8ff;
  }
  // ::v-deep .el-submenu__title:hover {
  //   background-color: #F5F8FF;
  // }
}
</style>
