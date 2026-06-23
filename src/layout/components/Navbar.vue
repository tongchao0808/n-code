<template>
  <div :class="`navbar ${classNames ? classNames : ''}`">
    <el-dropdown trigger="hover" @command="handleClick">
      <div class="flex items-center gap-2">
        <img src="@/assets/images/avatar.png" alt="" width="36" height="36" style="cursor: pointer;border-radius: 50%;"/>
        <div class="font-ms-yahei text-[14px] text-[#5F646C] ml-[9px] cursor-pointer">用户名</div>
      </div>
      <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
        <el-dropdown-item command="changePwd">
          <div class="flex items-center w-full gap-1">
            <span class="text-[#1D2129] text-[14px]">修改密码</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          <div class="flex items-center w-full gap-1">
            <span class="text-[#1D2129] text-[14px]">退出登录</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
      <PWD ref="pwd" @successModal="successModal"></PWD>
    <SuccessModal ref="successModal"></SuccessModal>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import SideMenu from "@/components/custom/sidemenu/SideMenu.vue";
import PWD from "@/components/custom/PWD.vue";
import SuccessModal from '@/components/custom/SuccessModal.vue'
export default {
  components: {
    SideMenu,
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc,
    PWD,
    SuccessModal,
  },
  props: {
    classNames: {type: String, required: false},
  },
  data() {
    return {
      testVisible: true,
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  methods: {
    handleClick(command) {
      // switch (command) {
      //   case 'logout': {
      //     this.logout();
      //     return;
      //   }
      // }
      if(this[command]){
        this[command]()
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    changePwd(){
      this.$refs.pwd.init(2)
      console.log('this.$refs.pwd', this.$refs.pwd)
    },
    async logout() {
      this.$confirm('确定退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/new-aio-machine/';
        })
      }).catch(() => {
      });
    },
    successModal(){
      this.$refs.successModal.show()
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  min-height: 55px;
  height: 55px;
  overflow: hidden;
  //position: relative;
  background: #EEF6FD;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 32px;
  align-items: center;

  //.nav-menu {
  //  display: flex;
  //  flex-direction: row;
  //  height: 100%;
  //}
  //
  //.hamburger-container {
  //  line-height: 46px;
  //  height: 100%;
  //  float: left;
  //  cursor: pointer;
  //  transition: background .3s;
  //  -webkit-tap-highlight-color: transparent;
  //
  //  &:hover {
  //    background: rgba(0, 0, 0, .025)
  //  }
  //}
  //
  //.breadcrumb-container {
  //  float: left;
  //}
  //
  //.topmenu-container {
  //  position: absolute;
  //  left: 50px;
  //}
  //
  //.errLog-container {
  //  display: inline-block;
  //  vertical-align: top;
  //}
  //
  //.right-menu {
  //  float: right;
  //  height: 100%;
  //  line-height: 50px;
  //
  //  &:focus {
  //    outline: none;
  //  }
  //
  //  .right-menu-item {
  //    display: inline-block;
  //    padding: 0 8px;
  //    height: 100%;
  //    font-size: 18px;
  //    color: #5a5e66;
  //    vertical-align: text-bottom;
  //
  //    &.hover-effect {
  //      cursor: pointer;
  //      transition: background .3s;
  //
  //      &:hover {
  //        background: rgba(0, 0, 0, .025)
  //      }
  //    }
  //  }
  //
  //  .avatar-container {
  //    margin-right: 30px;
  //
  //    .avatar-wrapper {
  //      margin-top: 5px;
  //      position: relative;
  //
  //      .user-avatar {
  //        cursor: pointer;
  //        width: 40px;
  //        height: 40px;
  //        border-radius: 10px;
  //      }
  //
  //      .el-icon-caret-bottom {
  //        cursor: pointer;
  //        position: absolute;
  //        right: -20px;
  //        top: 25px;
  //        font-size: 12px;
  //      }
  //    }
  //  }
  //}
}
</style>

<style lang="scss" scoped>
.custom-dropdown-menu {
  padding: 4px !important;
  border-radius: 8px;
  margin-top: 2px;

  ::v-deep .el-dropdown-menu__item {
    padding: 8px !important;
    line-height: 14px !important;
    border-radius: 8px;

    &:hover {
      background: #F2F3F5;
    }
  }

  ::v-deep .popper__arrow {
    display: none;
  }
}
</style>
