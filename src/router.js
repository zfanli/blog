import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/post/:postTitle',
      name: 'post',
      component: () =>
        import(/* webpackChunkName: "post-page" */ './views/Post.vue'),
      props: true,
      beforeEnter: (to, _, next) => {
        const title = to.params.postTitle
        if (!store.getters.getPostByTitle(title)) {
          next('/404')
        } else {
          next()
        }
      },
    },
    {
      path: '/404',
      name: '404',
      // route level code-splitting
      // lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "404" */ './views/404.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})
