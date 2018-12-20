<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import './styles/common.scss';

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, 'Microsoft YaHei',
    'Yuanti SC', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
  max-width: 700px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
  overflow: hidden;

  @media (min-width: 701px) {
    padding: 2.5rem;
  }
}
</style>
