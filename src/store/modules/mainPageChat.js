const state = {
  mode: 'newChat',
  similarQuestions: [],
  knowledgeMagicNo: 0,
  filesCache: {}
}

const mutations = {
  SET_SIMILAR_QUESTIONS: (state, questions) => {
    state.similarQuestions = questions;
  },
  REFRESH_KNOWLEDGE_MAGIC: (state) => {
    state.knowledgeMagicNo += 1;
  }
}

const actions = {
  setSimilarQuestions({ commit }, questions) {
    commit('SET_SIMILAR_QUESTIONS', questions);
  },
  clearQuestions({ commit }) {
    commit('SET_SIMILAR_QUESTIONS', []);
  },
  getQuestions({ commit }) {
    return state.similarQuestions;
  },
  emitRefreshKnowledgeBase({ commit }) {
    commit('REFRESH_KNOWLEDGE_MAGIC');
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
