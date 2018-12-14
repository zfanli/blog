import Vue from 'vue'
import Vuex from 'vuex'

import ac from './App.config'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ...ac.info
  },
  mutations: {

  },
  actions: {

  }
})
