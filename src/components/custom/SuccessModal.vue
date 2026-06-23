<template>
  <el-dialog
    title=""
    :visible.sync="visible"
    width="380px"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="vertical-center-dialog"
    custom-class="success-modal"

    >

    <div class="text-center success-content">
      <div class="success-icon">
         <svg-icon icon-class="success-icon" style="width: 48px; height: 48px;"/>
      </div>
      <div class="success-message">
        <p class="text-[16px]  text-[#1d2129]">恭喜！密码设置成功</p>
        <p class="text-[14px] text-[#959BA1]">请牢记新密码，<span class="text-[#3662FF]">{{ countDown }}s</span>后自动跳转系统首页</p>
      </div>
    </div>

    <div slot="footer" class="flex items-center justify-center">
      <el-button class="w-[144px] h-[40px]" type="primary" @click="goToHome">前往首页</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      countDown: 3,
      timer: null
    }
  },
  methods: {
    show() {
      this.visible = true
      this.startCountDown()
    },
    startCountDown() {
      this.countDown = 3
      this.timer = setInterval(() => {
        this.countDown--
        if (this.countDown <= 0) {
          clearInterval(this.timer)
          this.goToHome()
        }
      }, 1000)
    },
    goToHome() {
      clearInterval(this.timer)
      this.visible = false
      // 这里替换为实际跳转首页的代码
      this.$router.push('/')
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>



</style>
<style lang="scss">
.vertical-center-dialog {
    display: grid;
    place-items: center; /* 同时设置水平和垂直居中 */
    height: 100vh;

}
.el-dialog.success-modal{
  border-radius: 8px;
  margin-top: 0 !important;
  .el-dialog__header{
    display: none;
  }
}

</style>

