<script>
export default {
  name: "SmallCrumbs",
  data() {
    return {

    }
  },
  props: {
    paths: {type: Array, default: []}
  },
  computed: {
    textArray: function () {
      const res = [];
      for (let i = 0; i < this.paths.length; i++) {
        const isLast = i === this.paths.length - 1;
        if (isLast) {
          res.push({path: "", text: this.paths[i].text, isLast: true, jumpFunc: null});
        } else {
          res.push({path: this.paths[i].path, text: this.paths[i].text, isLast: false, jumpFunc: this.paths[i].jumpFunc, params: this.paths[i].params});
          res.push({path: "", text: "/", isLast: false, jumpFunc: null});
        }
      }
      return res;
    }
  },
  methods: {
    clickItem(item) {
      if (!item.path && !item.jumpFunc) return;
      if (item.jumpFunc) {
        item.jumpFunc();
      } else {
        this.$tab.openPage("", item.path, item.params || null);
      }
    }
  }
}
</script>

<template>
<div class="w-full h-[40px] py-[8px] px-[32px] text-[14px] leading-[18px] font-ms-yahei flex items-center gap-x-[12px]">
  <div v-for="(item, index) in textArray"
       :key="index"
       :style="{color: item.isLast ? '#1D2129' : '#00000073', cursor: item.path || item.jumpFunc ? 'pointer' : ''}"
       :class="item.path || item.jumpFunc ? 'crumb-hover' : ''"
       @click.stop="() => clickItem(item)">
    {{ item.text }}
  </div>
</div>
</template>

<style scoped lang="scss">
.crumb-hover:hover {
  color: #3662FF !important;
}
</style>
