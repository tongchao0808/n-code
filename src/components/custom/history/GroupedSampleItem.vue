<script>
import RecordDropdown from "@/components/custom/dropdown/RecordDropdown.vue";

export default {
  name: "GroupedSampleItem",
  components: {RecordDropdown},
  props: {
    record: {type: Object, required: true},
    onAddKg: {type: Function, required: false},
    onRename: {type: Function, required: false},
    onRemove: {type: Function, required: false},
  },
  methods: {
    useThisRecord() {
      this.$store.state.history.currentId = this.record.id;
    }
  }
}
</script>

<template>
  <li class="w-full flex justify-between items-center hover:bg-[#F2F3F5] hover:cursor-pointer px-4 py-2 gap-5">
    <span class="flex-1 truncate" @click="useThisRecord">{{ record && record.title }}</span>
    <RecordDropdown :on-add-kg="() => onAddKg(record)"
                    :on-rename="() => onRename(record)"
                    :on-remove="() => onRemove(record)"/>
  </li>
</template>

<style scoped lang="scss">

</style>
