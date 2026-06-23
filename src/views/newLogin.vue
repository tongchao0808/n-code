<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'
import PWD from '@/components/custom/PWD.vue'
import SuccessModal from '@/components/custom/SuccessModal.vue'
import {cleanLogininfor} from '@/api/monitor/logininfor'
export default {
  name: "newLogin",
  data() {
    return {
      codeUrl: "",
      passwordVisible: false,
      loginForm: {
        username: "admin",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          {required: true, trigger: "blur", message: "请输入您的账号"}
        ],
        password: [
          {required: true, trigger: "blur", message: "请输入您的密码"}
        ],
        code: [{required: true, trigger: "change", message: "请输入验证码"}]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: false,
      // 注册开关
      register: false,
      redirect: undefined
    };
  },
  components:{PWD,SuccessModal},
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    // cleanLogininfor().then(res => {
    //   console.log(res)
    // })
    this.getCode();
    this.getCookie();
  },
  methods: {
      togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
      },
      getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, {expires: 300});
            Cookies.set("password", encrypt(this.loginForm.password), {expires: 300});
            Cookies.set('rememberMe', this.loginForm.rememberMe, {expires: 300});
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then((res) => {
            const {firstLogin} = res
            if(firstLogin){
              this.loading = false;
              this.$refs.pwd.init(1)
              return
            }
            this.$router.push({path: this.redirect || "/knowledgeLibrary"}).catch(() => {});
          }).catch(() => {
            this.loading = false;
            if (this.captchaEnabled) {
              this.getCode();
            }
          });
        }
      });
    },
    forgetPwd(){
      this.$refs.pwd.init(3)
    },
    successModal(){
      this.$refs.successModal.show()
    }
  }
}
</script>

<template>
  <div class="relative flex items-center justify-end w-screen h-screen overflow-hidden">
    <div class="absolute top-0 left-0 w-screen h-screen custom-bg"></div>
    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-[38.69%] h-[62.12%] custom-bg-icon ml-[9%] 2xl:ml-[14%]"></div>
    <div class="rounded-2xl bg-white w-[29.375%] max-w-[564px] 2xl:py-9 2xl:px-8 py-6 px-5 flex flex-col items-center justify-center gap-6 2xl:gap-9 mr-[13%]">
      <div class="flex items-center justify-center w-full">
        <!-- <svg-icon icon-class="logo" class-name="!w-[56px] !h-[56px]"/> -->
        <svg-icon icon-class="logo-text" class-name="!w-[154px] !h-[48px]"/>
        <!-- <b class="text-[#4A535D] text-[22px]">样本库质量管理平台</b> -->
      </div>
      <div class="w-full mb-[48px]">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" :inline-message="true" class="custom-form">
          <div class="flex flex-col w-full">
            <span class="text-[36px] leading-[54px] text-[#1D2129] inline-flex justify-center font-bold mb-12">样本库质量管理平台</span>
            <div class="flex flex-col w-full gap-6 2xl:gap-9">
              <div>
                <el-form-item prop="username">
                  <el-input
                      v-model="loginForm.username"
                      type="text"
                      auto-complete="off"
                      placeholder="请输入登录账号"
                  >
                    <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
                  </el-input>
                </el-form-item>
              </div>
              <div class="password-input">
                <el-form-item prop="password">
                  <el-input
                      v-model="loginForm.password"
                      :type="passwordVisible ? 'text' : 'password'"
                      auto-complete="off"
                      placeholder="请输入登录密码"
                      @keyup.enter.native="handleLogin"
                  >
                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
                    <svg-icon slot="suffix" :icon-class="passwordVisible ? 'eye' : 'eye-open'" class="el-input__icon input-icon cursor-pointer" @click="togglePasswordVisibility"/>
                  </el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item prop="code" v-if="captchaEnabled">
                  <el-input
                      v-model="loginForm.code"
                      auto-complete="off"
                      placeholder="验证码"
                      style="width: 63%"
                      @keyup.enter.native="handleLogin"
                  >
                    <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
                  </el-input>
                  <div class="login-code">
                    <img :src="codeUrl" @click="getCode" class="login-code-img"/>
                  </div>
                </el-form-item>
              </div>
            </div>
            <div class="flex items-center justify-between pb-5 h-[70px]">
              <el-checkbox v-model="loginForm.rememberMe" class="text-[14px]" text-color="#3662ff" fill="#3662ff">记住密码</el-checkbox>
              <span class="text-[#959ba1] text-[14px]  cursor-pointer hover:text-[#3662ff]" @click="forgetPwd">忘记密码</span>
            </div>
            <div class="w-full">
              <el-form-item style="width:100%;">
                <el-button
                    :loading="loading"
                    size="medium"
                    type="primary"
                    style="width:100%;"
                    class="bg-[#3662FF]"
                    @click.native.prevent="handleLogin"
                >
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
                <div style="float: right;" v-if="register">
                  <router-link class="link-type" :to="'/register'">立即注册</router-link>
                </div>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </div>
      <PWD ref="pwd" @successModal="successModal"></PWD>
      <SuccessModal ref="successModal"></SuccessModal>
  </div>
</template>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 38px;
}

.people {
  width: 50vw;
  height: 57vh;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  position: absolute;
  left: 30%;
  top: 50%;
  transform: translate(-50%, -50%);
}


@font-face {
  font-family: "阿里妈妈数黑体 Bold";
  font-weight: 700;
  src: url("//at.alicdn.com/wf/webfont/urFKO9GIjnQ2/auw7UkADFdVv.woff2") format("woff2"),
  url("//at.alicdn.com/wf/webfont/urFKO9GIjnQ2/l3cD9O4xBnpb.woff") format("woff");
  font-display: swap;
}
</style>

<style lang="scss" scoped>
.custom-bg {
  z-index: -1;
  background-image: url(~@/assets/images/custom/bg.svg);
  background-size: cover;
  background-repeat: no-repeat;
}
.custom-bg-icon {
  z-index: -1;
  background-image: url(~@/assets/images/custom/bg-icons.svg);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.custom-form {
  ::v-deep .el-form-item {
    margin-bottom: 0!important;
  }
  ::v-deep .el-checkbox__label{
    color:#3662ff;
  }
  ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner{
    background-color:#3662ff;
    border-color:#3662ff;
  }
}

.password-input {
  ::v-deep .el-input__suffix {
    right: 10px;
  }
}
</style>
