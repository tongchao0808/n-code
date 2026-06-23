<script>
export default {
  name: "FunctionCategory",
  props: {
    value: {type: String, required: false, default: ""},
    label: {type: String, required: true},
    active: {type: Boolean, default: false},
    className: {type: String, required: false, default: null},
  }
}
</script>

<template>
<div class="w-max h-9 flex flex-row items-center justify-center rounded-lg py-2 px-4 cursor-pointer" :style="{backgroundColor: active ? '#3662FF' : '#F2F3F5', color: active ? '#FFFFFF' : '#1D2129'}" :class="className" @click.stop="$emit('click')">
  <span class="text-[14px] leading-[18px] font-ms-yahei">{{ label }}</span>
</div>
</template>

<style scoped lang="scss">

</style>
