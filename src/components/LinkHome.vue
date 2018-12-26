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
@import '@/styles/constants.scss';

.home-link {
  text-decoration: none;
  font-family: 'PaytoneOne-Regular', 'Microsoft YaHei', 'Yuanti SC', sans-serif;
  font-weight: 900;
  color: $font-color + #2d8b6c;
  font-size: 1.5rem;
}
</style>
