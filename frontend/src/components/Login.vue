<template>
  <v-sheet width="300" class="mx-auto form-container">
    <h2>Connexion</h2>
    <v-form fast-fail @submit.prevent="login">
      <v-text-field
        v-model="email"
        label="Email"
        :rules="emailRules"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Mot de passe"
        type="password"
        :rules="passwordRules"
      ></v-text-field>
      <v-btn type="submit" block class="mt-2 form-button">Connexion</v-btn>
      <p v-if="error" class="error">{{ error }}</p>
    </v-form>
  </v-sheet>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
  data () {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    async login () {
      try {
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        })
        const responseData = response.data || response
        if (responseData && responseData.token && responseData.user) {
          this.$store.dispatch('setToken', responseData.token)
          this.$store.dispatch('setUser', responseData.user)
          this.$router.push({ name: 'home' })
        } else {
          this.error = 'Login failed. Invalid response format.'
        }
      } catch (error) {
        this.error = error.response && error.response.data
          ? error.response.data.error
          : 'An error occurred during login.'
      }
    }

  }
}
</script>
<style scoped>
</style>
