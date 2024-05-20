<template>
  <v-app>
    <v-main>
      <v-container class="fill-height hero-container" fluid>
        <v-row justify="center" align="center">
          <v-col cols="12" sm="8" md="6" class="text-center">
            <h1 class="display-2 mb-3 hero-title">Un Pour Tous</h1>
            <p class="subtitle-1 mb-5 hero-subtitle">
              Engagez-vous dans des activités bénévoles enrichissantes et faites une différence dans votre communauté. Rejoignez-nous pour découvrir et participer à des initiatives variées, où votre aide est précieuse.
            </p>
            <v-btn color="primary" dark large @click="$router.push('/activities')">
              Découvrez les Activités
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.hero-container {
  padding-top: 100px;
  padding-bottom: 100px;
}
.hero-title {
  color: #4a5568;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}
.hero-subtitle {
  color: #2d3748;
  font-style: italic;
  font-size: 1.2rem;
  margin: 0 auto;
  max-width: 700px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
