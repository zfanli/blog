import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'
import ac from '../App.config'

const config = ac.config.gitalk

/**
 * Each page should create new instance for generate id correctly.
 * So export a function to create new Gitalk instance on each call.
 * To get current URL(with hash) as id correctly.
 * And to use it as below:
 *
 * gitalk().render('gitalk-container')
 */
export default (config
  ? id =>
      new Gitalk({
        ...config(id),
      })
  : null)
