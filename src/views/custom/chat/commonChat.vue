<script>
import CommonChatWorkspace from "@/components/custom/chat/common/CommonChatWorkspace.vue";
import AIGenerateWorkspace from "@/components/custom/chat/common/AIGenerateWorkspace.vue";

export default {
  name: "commonChat",
  components: {AIGenerateWorkspace, CommonChatWorkspace},
  data() {
    return {
      chatCategory: "",
    }
  },
  computed: {
    bindForm: {
      get() {
        return this.$store.state.chat.form[this.chatCategory];
      },
      set(nValue) {
        this.$store.state.chat.form[this.chatCategory] = nValue;
      }
    },
    bindChat: {
      get() {
        return this.$store.state.chat.chat[this.chatCategory];
      },
      set(nValue) {
        this.$store.state.chat.chat[this.chatCategory] = nValue;
      }
    }
  },
  mounted() {
    this.chatCategory = this.$route.query.chatCategory;
    this.$store.dispatch("chat/createIfNeed", this.chatCategory);
  },
  methods: {
    forceReset() {
      this.$store.dispatch("chat/forceReset", this.chatCategory);
    },
    startChat() {
      this.$store.dispatch("chat/doRequest", this.chatCategory);
    },
    toggleLanguage() {
      this.$store.dispatch("chat/toggleLanguage", this.chatCategory);
    }
  }
}
</script>

<template>
  <div class="w-full h-full flex justify-center items-center ">
    <div class="w-1/2 h-full border-r border-r-[#E8EFFF]">
      <CommonChatWorkspace :title="chatCategory"
                           :form.sync="bindForm"
                           :force-reset="forceReset"
                           :do-request="startChat"/>
    </div>
    <div class="flex-1 h-full border-l border-l-[#E8EFFF]">
      <AIGenerateWorkspace :chat.sync="bindChat" :re-generate="startChat"
                           :toggle-language="toggleLanguage"/>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
