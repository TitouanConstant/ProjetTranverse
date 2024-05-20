<template>
    <v-container>
      <v-card v-if="user">
        <v-card-title class="text-h5">User Profile</v-card-title>
        <v-card-text>
          <div class="my-2">
            <strong>First Name:</strong> {{ user.firstName }}
          </div>
          <div class="my-2">
            <strong>Last Name:</strong> {{ user.lastName }}
          </div>
          <div class="my-2">
            <strong>Email:</strong> {{ user.email }}
          </div>
        </v-card-text>
      </v-card>
      <div v-else>
        Redirecting to home...
      </div>
    </v-container>
  </template>
<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['user'])
  },
  watch: {
    user (newValue) {
      if (!newValue) {
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>
