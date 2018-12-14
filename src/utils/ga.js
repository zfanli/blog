import Vue from 'vue'
import ga from 'vue-analytics'
import router from '../router'
import ac from '../App.config'

// Google Analytics support
// Pass router instance for auto track
if (ac.config.ga) {
  Vue.use(ga, { id: ac.config.ga.id, router })
}
