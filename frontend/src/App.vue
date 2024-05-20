<template>
  <div id="app">
    <v-app>
      <Header/>
      <main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </main>
    </v-app>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'app',
  components: {
    Header
  }
}
</script>

<style>
main {
    background-image: url('@/assets/neewbg.webp');
    background-size: cover;
    background-repeat: no-repeat;
    min-height: 100vh;
}
</style>
