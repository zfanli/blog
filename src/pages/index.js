import store from '../store'
import { IMPORT_POST_DYNAMIC } from '../actions'

// list of post file name
const list = [
  '2018-02-08-css-flexbox',
  '2018-01-28-memo-python',
  '2017-11-26-memo-lock',
  '2017-10-29-memo-vba',
  '2017-10-16-css3-transition&transform',
  '2017-10-08-caution-about-aspect',
  '2017-10-07-RESTful-api-java',
  '2017-10-06-memo-spring-security',
  '2017-09-30-memo-log4j',
  '2017-09-19-memo-mybatis',
  '2017-09-10-memo-spring-mvc',
]

list.map(l => store.dispatch(IMPORT_POST_DYNAMIC, l))
