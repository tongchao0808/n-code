<template>
  <div :class="`navbar ${classNames ? classNames : ''}`">
    <div class="flex items-center">
      <div class="flex items-center p-[4px] text-[#959BA1] hover:text-[#3662FF] cursor-pointer transition-all duration-200 hover:scale-105 rounded-md" @click="handleClickLogout"><svg-icon
          icon-class="external-transmission" class-name="w-[16px] h-[16px] mr-[4px]"></svg-icon>
        <div class="text-[12px] leading-[20px]">退出</div>
      </div>
      <div class="flex items-center gap-[4px] ml-[20px]">
        <img src="@/assets/images/agent-logo.png" alt="" class="w-[32px] h-[32px]">
        <div class="text-[16px] text-[#1D2129] leading-[32px] font-bold">质量管理智能体</div>
      </div>
      <svg-icon icon-class="history" title="历史记录" class-name="w-[20px] h-[20px] text-[#5F646C] hover:text-[#3662FF] ml-[12px] cursor-pointer transition-all duration-200 hover:scale-110" 
        @click="handleClickHistory"></svg-icon>
    </div>
    <div>
      <el-dropdown trigger="hover" @command="handleClick">
        <div class="flex items-center gap-2">
          <img src="@/assets/images/avatar.png" alt="" width="36" height="36"
            style="cursor: pointer;border-radius: 50%;" />
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
          location.href = '/new-aio-machine/mainPage';
        })
      }).catch(() => {
      });
    },
    successModal(){
      this.$refs.successModal.show()
    },
    handleClickHistory() {
      this.$store.state.history.sidebarOpen = !this.$store.state.history.sidebarOpen; 
    },
    handleClickLogout() {
      this.$store.state.history.sidebarOpen = !false; 
      this.$router.push({
        path: '/',
      })
      
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
    display: flex;
    min-height: 55px;
    height: 55px;
    overflow: hidden;
    background: transparent;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
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
