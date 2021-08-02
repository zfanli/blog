<template>
  <router-view class="app-content"></router-view>
</template>

<script>
import { provide } from "vue";

export default {
  setup() {
    provide("menu", [
      // { name: "Home", link: "/" },
      // { name: "Posts", link: "/posts" },
      // { name: "About", link: "/about" },
      // { name: "Contact", link: "/contact" },
      { name: "Home/主页", link: "/" },
      { name: "Posts/文章", link: "/posts" },
      { name: "About/关于", link: "/about" },
      { name: "Contact/联系我", link: "/contact" },
    ]);
  },
};
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap.scss";

html {
  overflow: auto;
}

html,
body,
#app {
  height: 100%;
}
</style>

