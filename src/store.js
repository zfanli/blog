import Vue from 'vue'
import Vuex from 'vuex'
import { IMPORT_POST_DYNAMIC, PUSH_POST_FRONT_MATTER_OBJECT } from './actions'
import ac from './App.config'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ...ac.info,
    posts: {},
  },
  getters: {
    postIds(state) {
      return Object.keys(state.posts).sort()
    },
    postList(state, getters) {
      return getters.postIds.map(id => state.posts[id])
    },
  },
  mutations: {
    [PUSH_POST_FRONT_MATTER_OBJECT](state, fm) {
      const t = new Date(fm.attributes.date).getTime()
      state.posts = {
        ...state.posts,
        [t]: fm,
      }
    },
  },
  actions: {
    [IMPORT_POST_DYNAMIC]({ commit }, post) {
      return import(`./pages/${post}.md`).then(m =>
        commit(PUSH_POST_FRONT_MATTER_OBJECT, m.default)
      )
    },
  },
})
