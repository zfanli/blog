<template>
  <router-link class="home-link" to="/">{{ title }}</router-link>
</template>

<script>
export default {
  props: {
    title: String,
  },
}
</script>

<style lang="scss" scoped>
.home-link {
  text-decoration: none;
  color: inherit;
  font-family: 'PaytoneOne-Regular', 'Microsoft YaHei', 'Yuanti SC', sans-serif;
  font-weight: 900;
}
</style>
