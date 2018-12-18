import store from '../store'
import { IMPORT_POST_DYNAMIC } from '../actions'

// list of post file name
const list = [
  '2017-10-16-css3-transition&transform',
  '2017-10-07-RESTful-api-java',
]

list.map(l => store.dispatch(IMPORT_POST_DYNAMIC, l))
