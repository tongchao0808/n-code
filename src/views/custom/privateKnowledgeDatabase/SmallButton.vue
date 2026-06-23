<script>
export default {
  name: 'SmallButton',
  components: {

  },
  props: {
    label: {type: String, required: true},
    prefixIcon: {type: String, required: false, default: ''},
    suffixIcon: {type: String, required: false, default: ''},
    className: {type: String, required: false, default: null},
    borderColor: {type: String, required: false, default: "#C9CDD4"},
    textColor: {type: String, required: false, default: "#1D2129"},
    bgColor: {type: String, required: false, default: ""},
    iconClassName: {type: String, required: false, default: ""},
  },
  data() {
    return {

    }
  }
}
</script>

<template>
<div class="h-[38px] py-[5px] px-4 border-[1px] rounded-lg flex flex-row items-center justify-between cursor-pointer" :style="{borderColor: borderColor, color: textColor, backgroundColor: bgColor}" :class="className" v-on="$listeners">
  <svg-icon v-if="prefixIcon" :icon-class="prefixIcon" :class-name="`mr-1 ${iconClassName}`" style="width: 16px; height: 16px;" />
  <span class="text-[14px] leading-[28px]">{{ label }}</span>
  <svg-icon v-if="suffixIcon" :icon-class="suffixIcon" :class-name="`mr-1 ${iconClassName}`" style="width: 16px; height: 16px;" />
</div>
</template>

<style scoped lang="scss">

</style>
