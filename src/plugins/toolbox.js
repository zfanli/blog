import { reactive, readonly } from "vue";
import marked from "marked";
import hljs from "highlight.js";

// setup marked
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: "hljs language-",
});

/**
 * Check if the display device is a mobile device.
 * @returns true if displayed on a mobile
 */
function isMobile() {
  return window.innerWidth <= 580;
}

const toolbox = {
  install: (app) => {
    // define reactive properties
    const data = reactive({ mobile: isMobile() });

    // expose properties with $tools
    app.config.globalProperties.$tools = readonly(
      Object.assign(
        // expose reactive properties as readonly
        data,
        // define static properties
        { hljs, marked }
      )
    );

    // setup listeners
    window.addEventListener("resize", () => {
      data.mobile = isMobile();
    });
  },
};

export default toolbox;
