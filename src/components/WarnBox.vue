<template>
  <small class="warn-box">{{ msg }}</small>
</template>

<script>
export default {
  props: {
    msg: String,
  },
}
</script>

<style lang="scss" scoped>
.warn-box {
  border-style: dashed;
  border-width: 1px;
  border-color: #d23669;
  background-color: #fffadd;
  color: #d23669;
  display: block;
  width: fit-content;
  border-radius: 5px;
  padding: 0 0.5rem;
}
</style>
