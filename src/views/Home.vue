<template>
  <div class="home">
    <introduction :title="introductionTitle"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Introduction from '@/components/Introduction.vue'
import { mapState } from 'vuex'

export default {
  name: 'home',
  computed: {
    ...mapState(['introductionTitle']),
  },
  components: {
    Introduction,
  },
}
</script>
