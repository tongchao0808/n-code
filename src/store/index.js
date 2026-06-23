import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import dict from './modules/dict'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import getters from './getters'
import history from './modules/history'
import assistant from "@/store/modules/assistant";
import mainPageChat from "@/store/modules/mainPageChat";
import knowledgeBase from "@/store/modules/knowledgeBase";
import governance from "@/store/modules/governance";
import chat from "@/store/modules/chat";

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    dict,
    user,
    tagsView,
    permission,
    settings,
    history,
    assistant,
    mainPageChat,
    knowledgeBase,
    governance,
    chat,
  },
  getters
})

export default store
