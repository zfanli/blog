<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import './styles/common.scss';
@import './styles/fonts.scss';

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, 'STYuanti', 'Yuanti SC',
    'Microsoft YaHei', '微软雅黑', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
  overflow: hidden;

  @media (min-width: 801px) {
    padding: 2.5rem;
  }
}
</style>
