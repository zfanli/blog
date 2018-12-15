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
      path: '/post/:title',
      name: 'post',
      component: () =>
        import(/* webpackChunkName: "post" */ './views/Post.vue'),
      props: true,
    },
    {
      path: '/404',
      name: '404',
      // route level code-splitting
      // lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "404" */ './views/404.vue'),
    },
  ],
})
