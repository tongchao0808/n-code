<script>
export default {
  name: "PreviewUploader",
  props: {
    upload: {type: Function, required: true},
    remove: {type: Function, required: true},
    objects: {type: Array, required: true},
    mode: {type: String, required: true},
  },
  methods: {
    toReadableSize(kb) {
      const units = ["KB", "MB", "GB", "TB", "PB"];
      let unitIndex = 0;

      while (kb >= 1024 && unitIndex < units.length - 1) {
        kb /= 1024;
        unitIndex++;
      }
      return `${kb} ${units[unitIndex]}`;
    }
  }
}
</script>

<template>
  <div class="w-full flex">
    <div class="flex-1 flex gap-2 overflow-x-auto hide-scroll-bar">
      <el-upload class="custom-uploader" action="#" :show-file-list="false" :http-request="upload">
        <svg-icon icon-class="plus" class-name="!w-[48px] !h-[48px] text-[#959BA1]"/>
      </el-upload>
      <div
        class="min-w-[128px] w-[128px] h-[80px] relative rounded-lg border border-[#e5e6eb] hover:border-[#3662ff] group overflow-hidden"
        v-for="(objectItem, index) in objects" :key="`${objectItem.id}-${index}`">
        <div
          class="absolute top-0 right-0 w-5 h-5 rounded-bl-[10px] bg-[#3662ff] flex justify-center items-center opacity-0 group-hover:opacity-100 cursor-pointer"
          @click="remove(objectItem)">
          <svg-icon icon-class="close" class-name="!w-5 !h-5 text-white"/>
        </div>
        <div class="w-full px-4 py-2" v-if="mode === 'file'">
          <div class="h-6 w-full flex justify-center">
            <svg-icon icon-class="word-file" class-name="!w-6 !h-6"/>
          </div>
          <div class="h-[17px] text-[12px] leading-[17px] text-[#1D2129] w-full truncate text-center">
            {{ objectItem.name }}
          </div>
          <div class="h-[17px] text-[12px] leading-[17px] text-[#86909c] w-full flex justify-center items-center">
            {{ toReadableSize(objectItem.size) }}
          </div>
        </div>
        <div class="w-full overflow-hidden" v-else>
          <img :src="objectItem.url" alt="upload image" class="object-cover w-full h-full"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom-uploader {
  width: 80px;
  min-width: 80px;
  height: 80px;
  min-height: 80px;
  border-radius: 8px;
  background: #E5E6EB;
  border: 1px solid #E5E6EB;

  ::v-deep .el-upload {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

}
</style>
