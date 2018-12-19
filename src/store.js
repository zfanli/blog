import Vue from 'vue'
import Vuex from 'vuex'
import { IMPORT_POST_DYNAMIC, PUSH_POST_WITH_FRONT_MATTER } from './actions'
import ac from './App.config'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ...ac.info,
    posts: {},
  },
  getters: {
    postIds(state) {
      // sort by keys desc
      return Object.keys(state.posts).sort((a, b) => b - a)
    },
    postList(state, getters) {
      return getters.postIds.map(id => state.posts[id])
    },
    getPostByTitle(_, getters) {
      return title => getters.postList.find(p => p.attributes.title === title)
    },
  },
  mutations: {
    [PUSH_POST_WITH_FRONT_MATTER](state, fm) {
      // use created timestamp as id
      const dt = new Date(fm.attributes.date)

      // do somethings with front matter
      // format date
      const year = dt.getFullYear()
      const month = dt.getMonth() + 1
      const day = dt.getDate()
      fm.attributes.formatedDate = `${year}年 ${month}月 ${day}日`
      // compute read time
      const time = Math.round(fm.body.length / 500)
      const tea = new Array(Math.round(time / 6) + 1).join('☕')
      fm.attributes.timeToRead = `${tea} 阅读时间${time}分钟`

      // merge new posts object
      state.posts = {
        ...state.posts,
        [dt.getTime()]: fm,
      }
    },
  },
  actions: {
    [IMPORT_POST_DYNAMIC]({ commit }, post) {
      return import(`./pages/${post}.md`).then(m =>
        commit(PUSH_POST_WITH_FRONT_MATTER, m.default)
      )
    },
  },
})
