<script>
import {addHistoryToKg, downloadHistory, getHistoryDetail, removeHistory} from "@/api/custom/history";
import HistoryPanel from "@/views/custom/history/components/HistoryPanel.vue";

export default {
  name: "historyDetail",
  components: {HistoryPanel},
  data() {
    return {
      id: "",
      detail: null,
    }
  },
  methods: {
    async loadDetail() {
      this.detail = await getHistoryDetail(this.id);
    },
  },
  mounted() {
    this.id = this.$route.query.id;
    this.loadDetail();
  }
}
</script>

<template>
  <div class="w-full h-full">
    <HistoryPanel mode="full" :record="detail"/>
  </div>
</template>

<style scoped lang="scss">

</style>
