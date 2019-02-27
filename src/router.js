import Vue from 'vue'
import Router from 'vue-router'
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
      path: '/tags/:tag?',
      name: 'tags',
      component: () =>
        import(/* webpackChunkName: "tags-page" */ './views/Tags.vue'),
      props: true,
    },
    {
      path: '/post/:postTitle',
      name: 'post',
      component: () =>
        import(/* webpackChunkName: "post-page" */ './views/Post.vue'),
      props: true,
    },
    {
      path: '/404',
      name: '404',
      // route level code-splitting
      // lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "404" */ './views/404.vue'),
    },
    {
      path: '/*',
      redirect: '/404',
      name: '404 handler',
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
