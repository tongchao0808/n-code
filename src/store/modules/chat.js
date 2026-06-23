import {streamChatWithAI} from "@/api/custom/chat";
import Vue from "vue";

const state = {
  form: {},
  chat: {}
}

function getInitForm() {
  return {
    content: "",
    files: [],
    images: [],
    useKnowledge: true,
    model: "",
    language: "cn"
  };
}

function getInitChat() {
  return {
    title: "",
    think: "",
    content: "",
  };
}

function getStaticPrompt(key, form) {
  return ""
}

const mutations = {
  CREATE_IF_NEED: (state, {key}) => {
    if (key === undefined) { return; }
    if (state.form[key] !== undefined && state.chat[key] !== undefined) { return; }
    if (state.form[key] === undefined) {
      Vue.set(state.form, key, getInitForm());
      // state.form[key] = getInitForm();
    }
    if (state.chat[key] === undefined) {
      Vue.set(state.chat, key, getInitChat());
      // state.chat[key] = getInitChat();
    }
  },
  FORCE_RESET: (state, {key}) => {
    if (key === undefined) { return; }
    Vue.set(state.form, key, getInitForm());
    Vue.set(state.chat, key, getInitChat());
  },
  DO_REQUEST: async (state, {key}) => {
    if (key === undefined) { return; }
    const form = state.form[key];
    const chat = state.chat[key];
    const question = getStaticPrompt(key, form);

    let thinkFlag = "no";
    const callbackFunc = (responseType, value) => {
      if (responseType === 'chunk') {
        let content = value.response;
        if (thinkFlag === 'no') {
          content = content.replace('<think>', '')
        }
        if (thinkFlag === 'no' || thinkFlag === 'pending') {
          const nContent = chat.think + content;
          chat.think = nContent;
          if (nContent.indexOf('</think>') > 0) {
            chat.think = chat.think.replace('</think>', '')
            thinkFlag = 'done';
          } else {
            thinkFlag = 'pending';
          }
        }
        if (thinkFlag === 'done') {
          chat.content = content + content
        }
      } else {
        console.log("*** ai stream callback: ", responseType, value)
      }
    };
    await streamChatWithAI(question, callbackFunc);
  },
  TOGGLE_LANGUAGE: async (state, {key}) => {
    if (state.form[key].language === "cn") {
      state.form[key].language = "en";
    } else if (state.form[key].language === "en") {
      state.form[key].language = "cn";
    }
    Vue.set(state.chat, key, getInitChat());
    await mutations.DO_REQUEST(state, {key});
  },
}
const actions = {
  createIfNeed({ commit }, key) {
    commit('CREATE_IF_NEED', {key})
  },
  forceReset({ commit }, key) {
    commit('FORCE_RESET', {key})
  },
  doRequest({ commit }, key) {
    commit('DO_REQUEST', {key})
  },
  toggleLanguage({ commit }, key) {
    commit('TOGGLE_LANGUAGE', {key})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
