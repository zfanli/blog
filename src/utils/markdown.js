import Md from 'markdown-it'
import taskLists from 'markdown-it-task-lists'

const md = new Md({
  // Add `line-numbers` class for tell it to display the line numbers.
  // This is just a flag, and do not mean line numbers must be displayed.
  // The true trigger of line numbers' display is at `highlight.js`.
  // Check if the line numbers relevant import was imported correctly.
  langPrefix: 'line-numbers language-',
}).use(taskLists)

export default md.render.bind(md)
