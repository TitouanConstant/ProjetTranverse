<template>
  <v-sheet width="300" class="mx-auto form-container">
    <h2>Inscription</h2>
    <v-form fast-fail @submit.prevent="register">
      <v-text-field
        v-model="firstName"
        label="Prénom"
        :rules="firstNameRules"
      ></v-text-field>

      <v-text-field
        v-model="lastName"
        label="Nom"
        :rules="lastNameRules"
      ></v-text-field>

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

      <v-btn type="submit" block class="mt-2 form-button">Inscription</v-btn>

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
      firstName: '',
      lastName: '',
      error: null
    }
  },
  methods: {
    async register () {
      try {
        await AuthenticationService.register({
          email: this.email,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName
        })
      } catch (error) {
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<style>
.form-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    text-align: center;
    border-radius: 10px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease-in-out;
  }
  .form-container:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
  .form-input {
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: 1px solid #bbb;
    border-radius: 5px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s;
  }
  .form-input:focus {
    border-color: #333;
    outline: none;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2), 0 0 5px rgba(51, 51, 51, 0.5);
  }
  .form-button:hover {
    background-color: #444;
  }
  .form-footer {
    margin-top: 20px;
  }
  .form-footer a {
    color: #333;
    text-decoration: none;
  }
  .form-link {
    display: block;
    margin-bottom: 10px;
  }
  h1 {
    font-size: 2em;
    margin-bottom: 10px;
    color: #333;
  }
  p {
    color: #666;
  }
.error {
  color : red;
}
</style>
