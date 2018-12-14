// Use PrismJs for syntax highlight
import Prism from 'prismjs'

// The below is some plugin triggers,
// comment off the import will make target plugin disable.

// Enable line numbers plugin
// import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
// import 'prismjs/plugins/line-numbers/prism-line-numbers.min'

// Enable toolbar as base for other features like show language, etc
import 'prismjs/plugins/toolbar/prism-toolbar.css'
import 'prismjs/plugins/toolbar/prism-toolbar'

// Enable show language
import 'prismjs/plugins/show-language/prism-show-language'

// Export highlight function.
// This function will parse all elements
// on the DOM which has a `.language-xxx` class.
export default Prism.highlightAll
