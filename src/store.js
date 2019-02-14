import Vue from 'vue'
import Vuex from 'vuex'
import {
  IMPORT_POST_DYNAMIC,
  PUSH_POST_WITH_FRONT_MATTER,
  SET_THE_REAL_LENGTH,
} from './actions'
import ac from './App.config'
import { isProductionMode } from './utils/helper';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ...ac.info,
    posts: {},
    realLength: null,
  },
  getters: {
    postIds(state) {
      // sort by keys desc
      let ids = Object.keys(state.posts).sort((a, b) => b - a)
      // hide draft in production mode
      if (isProductionMode()) {
        ids = ids.filter(id => !state.posts[id].attributes.draft)
      }
      return ids
    },
    postList(state, getters) {
      return getters.postIds.map(id => state.posts[id])
    },
    getPostByTitle(_, getters) {
      return title => getters.postList.find(p => p.attributes.title === title)
    },
    isLoading(state) {
      if (state.realLength) {
        // because there are drafts exists in the postList
        // so compare to the posts object
        return state.realLength !== Object.keys(state.posts).length
      }
      return true
    },
    tags(_, getters) {
      let tags = {}
      for (let p of getters.postList) {
        for (let t of p.attributes.tags) {
          if (!tags[t]) {
            tags[t] = 1
          } else {
            tags[t] += 1
          }
        }
      }
      return tags
    },
    getPostByTag(_, getters) {
      return tag => {
        if (!tag) return getters.postList
        return getters.postList.filter(p => p.attributes.tags.includes(tag))
      }
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
      fm.attributes.formatedDate = `发布于 ${year}年 ${month}月 ${day}日`
      // compute read time
      const time = Math.round(fm.body.length / 500)
      const tea = new Array(Math.round(time / 6) + 1).join('☕')
      fm.attributes.timeToRead = `${tea ? tea : '☕'} 阅读时间${time}分钟`

      // merge new posts object
      state.posts = {
        ...state.posts,
        [dt.getTime()]: fm,
      }
    },
    [SET_THE_REAL_LENGTH](state, length) {
      state.realLength = length
    },
  },
  actions: {
    [IMPORT_POST_DYNAMIC]({ commit }, post) {
      return import(/* webpackChunkName: "post" */ `./pages/${post}.md`).then(
        m => commit(PUSH_POST_WITH_FRONT_MATTER, m.default)
      )
    },
  },
})
