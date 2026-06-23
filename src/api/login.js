import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}
// 验证手机验证码
export function smsVerify(data) {
  return request({
    url: '/smsVerify/verify',
    headers: {
      isToken: false
    },
    method: 'get',
    data
  })
}
// 获取手机验证码
export function smsSend(data) {
  return request({
    url: '/smsVerify/send',
    headers: {
      isToken: false
    },
    method: 'post',
    data
  })
}
// 初次登录重置密码 /system/password/reset/init
export function resetInitPwd(data) {
  return request({
    url: '/system/password/reset/init',
    method: 'post',
    data
  })
}
// 手机号重置密码 /system/password/forget
export function forgetPwd(data) {
  return request({
    url: '/system/password/forget',
    headers: {
      isToken: false
    },
    method: 'post',
    data
  })
}
// 旧密码重置密码 /system/password/change
export function changePwd(data) {
  return request({
    url: '/system/password/change',

    method: 'post',
    data
  })
}
