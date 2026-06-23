<script>
export default {
  name: "FunctionShortcut",
  props: {
    title: {type: String, required: true},
    desc: {type: String, required: true},
    singleLined: {type: Boolean, required: false, default: false},
    icon: {type: String, required: true},
    className: {type: String, required: false, default: null},
  },
  data() {
    return {

    };
  },
  methods: {

  }
}
</script>

<template>
<div class="w-full h-full bg-white flex flex-row items-center justify-between p-4 rounded-2xl container cursor-pointer" @click.stop="$emit('click')" :class="className">
  <div class="w-12 h-12">
    <img :src="icon" :alt="title" class="w-full h-full" />
  </div>
  <div class="w-[calc(100%-48px)] flex flex-col items-center justify-center pl-2">
    <span class="w-full text-[14px] leading-[18px] font-ms-yahei text-[#1D2129] text-left mb-1">{{ title }}</span>
    <span class="w-full text-[#86909C] text-[10px] leading-[13px] font-ms-yahei" :style="singleLined ? {textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'} : {}">{{ desc }}</span>
  </div>
</div>
</template>

<style scoped lang="scss">
.container {
  border: #E5E6EB solid 1px;
}

.container:hover {
  border: #3662FF solid 1px;
  background-color: #F5F8FF;
}
</style>
