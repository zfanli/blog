<template>
  <div class="home">
    <introduction :title="title" />
  </div>
</template>

<script>
// @ is an alias to /src
import Introduction from '@/components/Introduction.vue'

export default {
  name: 'home',
  data() {
    return {
      title: 'Richard',
    }
  },
  components: {
    Introduction,
  },
}
</script>
