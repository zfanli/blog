import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import toolbox from "./plugins/toolbox";
import { registerComponents } from "./components";

const app = createApp(App);
app.use(router).use(toolbox);

registerComponents(app);

app.mount("#app");
