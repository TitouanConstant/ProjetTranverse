<template>
  <v-app-bar color="grey-darken-4" white fixed>
    <v-btn text :to="{ name: 'home' }" class="app-bar-title">
      <v-app-bar-title>VolunteerActivities</v-app-bar-title>
    </v-btn>
    <template v-if="$store.state.isUserLoggedIn && !$store.state.isUserAdmin">
      <v-btn text :to="{ name: 'activities' }">Activities</v-btn>
    </template>
    <template v-if="$store.state.isUserLoggedIn && $store.state.isUserAdmin">
      <v-btn text :to="{ name: 'adminUser' }">AdminUser</v-btn>
      <v-btn text :to="{ name: 'adminActivities' }">AdminActivities</v-btn>
    </template>
    <v-spacer></v-spacer>
    <template v-if="$store.state.isUserLoggedIn && !$store.state.isUserAdmin">
      <v-btn text :to="{ name: 'cart' }">Cart</v-btn>
    </template>
    <template v-if="!$store.state.isUserLoggedIn">
      <v-btn text :to="{ name: 'login' }">Login</v-btn>
      <v-btn text :to="{ name: 'register' }">Sign Up</v-btn>
    </template>

    <template v-else>
      <v-btn text :to="{ name: 'profile' }">
        {{ $store.state.user.firstName }}
      </v-btn>

      <v-btn text @click="logout">Log Out</v-btn>
    </template>

  </v-app-bar>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$store.dispatch('resetUser')
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style scopped>

.v-btn{

}
</style>
