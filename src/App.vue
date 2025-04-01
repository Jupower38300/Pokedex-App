<template>
  <main>
    <Header />
    <br />
    <br />
    <br />
    <RouterView />
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Header from './components/Header.vue'

export default defineComponent({
  name: 'App',
  components: {
    Header,
  },
})
</script>

<style scoped>
main {
  width: 100%;
  min-height: 100vh;
  margin-top: 30px;
}
br {
  height: 10em;
}
</style>
