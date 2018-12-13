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
</style>
