<template>
  <el-dialog
    :visible.sync="visible"
    width="380px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    class="vertical-center-dialog"
    custom-class="pwd-modal"
    top="0"
    :show-close="type!==1"
  >
    <div slot="title" class="text-center text-[#1D2129] text-[16px] font-bold">
      {{ titleList[type] }}
    </div>
    <div class="w-[308px] m-auto">
      <div class="origin-pwd" v-if="type === 1">初始密码：123456</div>
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="0"
        :inline="false"
        size="normal"
      >
        <el-form-item label="" v-if="type === 3" prop="mobile">
          <el-input
            v-model="form.mobile"
            placeholder="请输入手机号"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="" size="normal" v-if="type === 3" prop="code">
          <div class="flex justify-between">
            <el-input
              class="grow w-[190px]"
              v-model="form.code"
              placeholder="请输入验证码"
              clearable
            ></el-input>

            <el-button
              :disabled="isCounting"
              type="primary"
              size="mini"
              class="bg-[#3662FF] w-[106px] h-[40px] text-[14px] flex-none"
              @click="sendCode"
              >{{
                isCounting ? `重新发送(${countdown})` : "发送验证码"
              }}</el-button
            >
          </div>
        </el-form-item>

        <el-form-item label="" v-if="type === 2" prop="oldPwd">
          <el-input
            v-model="form.oldPwd"
            placeholder="请输入原密码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="newPwd">
          <el-input
            v-model="form.newPwd"
            placeholder="请输入新密码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="reNewPwd">
          <el-input
            v-model="form.reNewPwd"
            placeholder="请再次输入新密码"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        size="mini"
        class="block w-[280px] m-auto h-[40px] text-[14px] flex-none"
        @click="submit"
        >确认</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { smsVerify, smsSend,resetInitPwd,forgetPwd,changePwd } from "@/api/login";

export default {
  data() {
    //新密码与重复密码不一致，一定写在data里但不是return里
    let repeatValidate = (rule, value, callback) => {
      if (value !== this.form.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    //正则校验主要是这部分：/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,16}$
    //其中特殊字符包括：._~!@#$^&*  （比较常见）
    let newValValidate = (rule, value, callback) => {
      if (value === this.form.oldPwd) {
        callback(new Error("新密码不能与旧密码一致"));
      } else if (
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,16}$/g.test(
          value
        )
      ) {
        callback();
      } else {
        callback(
          new Error("请输入包含英文字母大小写、数字和特殊符号的 8-16 位组合")
        );
      }
    };
    return {
      visible: false,
      titleList: {
        1: "修改初始密码",
        2: "通过旧密码修改",
        3: "通过手机号修改",
      },
      type: 3, //1修改初始密码 2原密码修改密码 3手机号修改
      form: {
        mobile: "",
        code: "",
        newPwd: "",
        reNewPwd: "",
        oldPwd: "",
      },
      rules: {
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            required: true,
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        code:[ {required: true,message: "请输入验证码",trigger: "change",}],
        oldPwd: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        newPwd: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "长度应在 8 到 16 个字符",
            trigger: "blur",
          },
          { validator: newValValidate, trigger: "blur" },
        ],
        reNewPwd: [
          { required: true, message: "请再输入一遍新密码", trigger: "blur" },
          { validator: repeatValidate, trigger: "blur" },
        ],
      },
      isCounting: false,
      countdown: 60,
      timer: null, // 定时器
    };
  },
  methods: {
    init(type) {
      this.type = type;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
    },
    submit() {
      // this.changeSuccess()
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          switch (this.type) {
            case 1:
              await resetInitPwd({newPassword:this.form.newPwd})
              this.changeSuccess()
              break;
            case 2:
              await changePwd({
                oldPassword:this.form.oldPwd,
                newPassword:this.form.newPwd
              })
              this.changeSuccess()
              break;
            case 3:
              await forgetPwd({
                mobileNumber:this.form.mobile,
                code:this.form.code,
                newPassword:this.form.newPwd
              })
              this.changeSuccess()
              break;
          }
        }
      });
    },
    async sendCode() {
      if (this.isCounting) return;
      this.$refs.form.validateField("mobile", (err) => {
        if (!err) {
          this.startCountdown();
          smsSend({
            mobileNumber: this.form.mobile,
            purpose: "FORGET_PASSWORD",
          });
        }
      });
    },
    async verifyCode(){
        await smsVerify({
            mobileNumber: this.form.mobile,
            code: this.form.code,
            purpose: "FORGET_PASSWORD",
          });
    },
    startCountdown() {
      this.isCounting = true;
      this.timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          this.resetCountdown();
        }
      }, 1000);
    },
    resetCountdown() {
      clearInterval(this.timer);
      this.isCounting = false;
      this.countdown = 60;
    },
    changeSuccess(){
      this.visible=false
      this.$emit('successModal')

    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.origin-pwd {
  /* 容器 67 */
  width: 308px;
  height: 40px;
  /* 自动布局 */
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10;
  padding: 10.5px 16px 10.5px 16px;
  /* 14-默认间距 */
  color: rgba(29, 33, 41, 1);
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0px;
  text-align: left;
  border-radius: 4px;
  background: rgba(247, 248, 250, 1);
  margin-bottom: 22px;
}
</style>
<style lang="scss">
.vertical-center-dialog {
    display: grid;
    place-items: center; /* 同时设置水平和垂直居中 */
    height: 100vh;
}
.el-dialog.pwd-modal{
  border-radius: 8px;
  margin-top: 0 !important;
}
</style>
