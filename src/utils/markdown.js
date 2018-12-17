import Md from 'markdown-it'
import taskLists from 'markdown-it-task-lists'
import { highlight, languages } from 'prismjs'

const md = new Md({
  html: true,
  highlight: (str, lang) => {
    let code
    if (languages[lang]) {
      code = highlight(str, languages[lang], lang)
    } else {
      // if language is not supported, just wrap classes and return
      code = str
    }
    return `<pre class="language-${lang}"><code class="language-${lang}">${code}</code></pre>`
  },
}).use(taskLists)

export default md.render.bind(md)
