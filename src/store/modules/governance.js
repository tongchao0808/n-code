import {getGovernanceMedicalRecordCategories, getStructures} from "@/api/custom/governance";
import Vue from "vue";

const state = {
  governanceType: "通用",
  medicalRecordCategories: [],
  activeMedicalRecordCategory: "",
  operateType: "",
  form: {},
  chat: {
    record: {}
  },
  histories: []
}

const mutations = {
  INIT_MEDICAL_RECORD_CATEGORIES(state, values) {
    if (state.medicalRecordCategories ===undefined || state.medicalRecordCategories.length <= 0) {
      state.medicalRecordCategories = values;
      state.activeMedicalRecordCategory = values[0].value;
    }
  },
  CREATE_FORM_IF_NEED(state, {key}) {
    Vue.set(state.form, key, {content: ""});
  },
  GET_STRUCTURE_DATA(state, record) {
    Vue.set(state.chat, 'record', record);
  }
}
const actions = {
  async initMedicalRecordCategories({ commit }) {
    const values = await getGovernanceMedicalRecordCategories();
    commit('INIT_MEDICAL_RECORD_CATEGORIES', values);
  },
  createFormIfNeeded({commit}) {
    commit('CREATE_FORM_IF_NEED', {key: state.activeMedicalRecordCategory});
  },
  async getStructureData({ commit }) {
    const record = await getStructures(state.form);
    commit('GET_STRUCTURE_DATA', record);
  },
  async doGenerate({commit}) {
    await actions.getStructureData({commit});
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

