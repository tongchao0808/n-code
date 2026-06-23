import {commit} from "lodash/seq";

const state = {
  checkedDocs: [],
  docListFilter: {
    keyword: "",
    docType: "全部类型"
  }
}

const mutations = {
  ADD_CHECK_DOC: (state, doc) => {
    state.checkedDocs.push(doc)
  },
  DELETE_CHECK_DOC: (state, doc) => {
    const idx = state.checkedDocs.indexOf(doc);
    if (idx > -1) {
      state.checkedDocs.splice(idx, 1);
    }
  },
  CLEAR_CHECK_DOC: (state) => {
    state.checkedDocs = [];
  },
  SET_DOC_LIST_FILTER: (state, payload) => {
    if (payload.filterType === "docType") {
      state.docListFilter.docType = payload.filterValue;
    } else if (payload.filterType === "keyword") {
      state.docListFilter.keyword = payload.filterValue;
    }
  },
  CLEAR_DOC_LIST_FILTER: (state) => {
    state.docListFilter = {
      keyword: "",
      docType: "全部类型",
    }
  }
}

const actions = {
  addCheckDoc: ({ commit }, doc) => {
    commit('ADD_CHECK_DOC', doc);
  },
  deleteCheckDoc: ({ commit }, doc) => {
    commit('DELETE_CHECK_DOC', doc);
  },
  clearCheckDoc: ({ commit }) => {
    commit('CLEAR_CHECK_DOC');
  },
  setRefreshListFlag: ({ commit }) => {
    commit('SET_REFRESH_LIST');
  },
  setDocFilter({ commit }, payload) {
    commit('SET_DOC_LIST_FILTER', payload);
  },
  clearDocFilter({ commit }) {
    commit('CLEAR_DOC_LIST_FILTER');
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
