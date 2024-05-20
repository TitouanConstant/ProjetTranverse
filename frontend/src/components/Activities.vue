<template>
  <v-container class="mt-14">
    <v-alert v-model="alert" :type="alertType" dismissible @input="alert = false">
      {{ alertText }}
    </v-alert>
    <v-data-iterator :items="activities" :organizations="organizations" :items-per-page="itemsPerPage">
      <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
        <h1 class="text-h4 font-weight-bold mb-4 align-center dark-text">Collection d'Activités</h1>
        <div class="header-search-container d-flex align-center justify-space-between">
          <v-text-field
            v-model="search"
            label="Rechercher des activités"
            single-line
            variant="outlined"
            hide-details
            dense
            class="search-bar"
            @keydown.enter="onSearch"
            append-outer-icon="mdi-magnify"
            @click:append-outer="onSearch"
          ></v-text-field>
          <div>
            <v-btn class="me-2" variant="text" @click="onClickSeeAll">
              Voir tout
            </v-btn>
            <v-btn class="me-2" variant="text" @click="showFilterDialog = true">
              Filtrer
            </v-btn>
            <v-dialog v-model="showFilterDialog" max-width="500px">
              <v-card>
                <v-card-title class="headline">Filtres</v-card-title>
                <v-card-text>
                  <v-subheader>Localisation</v-subheader>
                  <v-range-slider
                    v-model="locationRange"
                    :max="maxLocation"
                    :min="minLocation"
                    :step="1000"
                    thumb-label
                    always-dirty
                  ></v-range-slider>
                  <div class="d-flex justify-space-between px-3">
                    <v-text-field
                      v-model="locationRange[0]"
                      label="Localisation Minimale"
                      type="number"
                      outlined
                      dense
                    ></v-text-field>
                    <v-text-field
                      v-model="locationRange[1]"
                      label="Localisation Maximale"
                      type="number"
                      outlined
                      dense
                    ></v-text-field>
                  </div>
                  <v-subheader>Organisations</v-subheader>
                  <v-checkbox
                    v-for="organization in organizations"
                    :key="organization"
                    v-model="selectedOrganizations"
                    :label="organization"
                    :value="organization"
                  ></v-checkbox>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary darken-1" text @click="applyFilter">Appliquer</v-btn>
                  <v-btn color="grey lighten-1" text @click="showFilterDialog = false">Annuler</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn icon="mdi-sort-ascending" size="small" variant="tonal" @click="sortActivities('asc')" v-if="!sortAscending"></v-btn>
            <v-btn icon="mdi-sort-descending" size="small" variant="tonal" @click="sortActivities('desc')" v-if="sortAscending"></v-btn>
            <v-btn :disabled="page === 1" icon="mdi-arrow-left" size="small" variant="tonal" @click="prevPage"></v-btn>
            <v-btn :disabled="page === pageCount" icon="mdi-arrow-right" size="small" variant="tonal" @click="nextPage"></v-btn>
          </div>
        </div>
      </template>
      <template v-slot:default="{ items }">
        <v-row>
          <v-col
            v-for="activity in items"
            :key="activity.raw.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            @click="selectActivity(activity.raw)"
          >
          <div class="v-card v-theme--dark v-card--density-default v-card--variant-elevated">
              <v-img :src="activity.raw.imageUrl" aspect-ratio="1" cover>
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey-darken-4"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <v-card-title>{{ activity.raw.title }}</v-card-title>
              <v-card-text>
                <div>Organisation : {{ activity.raw.organization }}</div>
                <div>Localisation : {{ activity.raw.location }}</div>
                <v-btn color="green" @click.stop="addToCart(activity.raw)">
                  <v-icon left>mdi-cart</v-icon>
                  Rejoindre
                </v-btn>
                <span class="text-grey-lighten-2 text-caption me-2">
                  ({{ activity.raw.averageRating }})
                </span>
                <v-rating
                  v-model="activity.raw.averageRating"
                  color="yellow-darken-3"
                  half-increments
                  readonly
                  size="18"
                ></v-rating>
              </v-card-text>
            </div>
          </v-col>
        </v-row>
        <v-dialog v-model="dialog" max-width="600px" transition="dialog-bottom-transition">
          <v-card class="elevation-12 custom-outlined-card">
            <v-img :src="selectedActivity.imageUrl" aspect-ratio="1.5">
              <v-card-title class="overlay-title">{{ selectedActivity.title }}</v-card-title>
            </v-img>
            <v-card-text>
              <div class="text-h5 py-2">{{ selectedActivity.organization }}</div>
              <div class="text-subtitle-1 pb-2">Localisation : {{ selectedActivity.location }}</div>
              <v-divider></v-divider>
              <div class="pt-3">{{ selectedActivity.description }}</div>
              <v-divider></v-divider>
              <div class="text-subtitle-1 pb-2">Note :</div>
              <span class="text-grey-lighten-2 text-caption me-2">
                  ({{ selectedActivity.averageRating }})
                </span>
              <v-rating
                  v-model="selectedActivity.averageRating"
                  color="yellow-darken-3"
                  half-increments
                  readonly
                  size="18"
                ></v-rating>
                <v-btn
                  variant="text"
                  @click="toggleReveal"
                >
                  Cliquez ici pour voir les notes
                </v-btn>
            </v-card-text>
            <v-card-actions>
              <v-btn color="green" @click="addToCart(selectedActivity)">
              <v-icon left>mdi-cart</v-icon>
                  Rejoindre
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn icon @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="ratingsDialog" max-width="600px">
          <v-card class="d-flex flex-column mx-auto py-8" elevation="10" height="500" width="360">
            <div class="d-flex justify-center mt-auto text-h5 ">
              Vue d'ensemble des notes
            </div>

            <div class="d-flex align-center flex-column my-auto">
              <div class="text-h2 mt-5">
                {{ selectedActivity.averageRating }}
                <span class="text-h6 ml-n3">/5</span>
              </div>

              <v-rating
                v-model="selectedActivity.averageRating"
                color="yellow-darken-3"
                half-increments
                readonly
              ></v-rating>
              <div class="px-3">{{ ratingOverview.totalRatings }} notes</div>
            </div>

            <v-list bg-color="transparent" class="d-flex flex-column-reverse" density="compact">
              <v-list-item v-for="(item, index) in ratingOverview.ratingsBreakdown" :key="index">
                <v-progress-linear
                  :model-value="calculateRatingPercentage(item.count)"
                  class="mx-n5"
                  color="yellow-darken-3"
                  height="20"
                  rounded
                ></v-progress-linear>
                <template v-slot:prepend>
                  <span>{{ item.rating }}</span>
                  <v-icon icon="mdi-star" class="mx-3"></v-icon>
                </template>
                <template v-slot:append>
                  <div class="rating-values">
                    <span class="d-flex justify-end"> {{ item.count }} </span>
                  </div>
                </template>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <div class="text-subtitle-1 pb-2">Votre Note :</div>
            <v-rating
              hover
              :length="5"
              :size="32"
              v-model="tempRating"
              active-color="yellow-darken-3"
            />
            <v-card-actions>
            <v-btn color="primary" @click="saveRating(selectedActivity.id, tempRating)">
              Enregistrer la note
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click="ratingsDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:footer="{page, pageCount}">
        <v-footer class="justify-space-between text-body-2 mt-4">
          Total des activités : {{ activities.length }}
          <div>Page {{ page }} sur {{ pageCount }}</div>
        </v-footer>
      </template>
    </v-data-iterator>
  </v-container>
</template>
<script>
import AuthenticationService from '@/services/AuthenticationService'
import { VAlert } from 'vuetify/components'

export default {
  components: {
    VAlert
  },
  data () {
    return {
      itemsPerPage: 8,
      activities: [],
      organizations: [],
      selectedOrganizations: [],
      search: '',
      sortAscending: true,
      showFilterDialog: false,
      locationRange: [0, 150000],
      minLocation: 0,
      maxLocation: 150000,
      dialog: false,
      selectedActivity: null,
      alert: false,
      alertText: '',
      alertType: 'success',
      ratingsDialog: false,
      ratingsData: null,
      tempRating: 0
    }
  },
  methods: {
    updateTempRating (value) {
      this.tempRating = value
      console.log(`Temp rating updated to: ${value}`)
    },
    async updateAverageRating (activityId) {
      console.log(`Updating average rating for activityId ${activityId}`)
      try {
        const response = await AuthenticationService.getAverageRatingForActivity(activityId)
        console.log('Updated average rating:', response)
        this.selectedActivity.averageRating = response.data.averageRating
        const activityIndex = this.activities.findIndex(activity => activity.id === activityId)
        if (activityIndex !== -1) {
          this.activities[activityIndex].averageRating = response.data.averageRating
        }
      } catch (error) {
        console.error('Error fetching average rating:', error)
      }
    },
    async saveRating (activityId, newRating) {
      console.log(`Saving rating for activityId ${activityId} with rating ${newRating}`)
      try {
        const response = await AuthenticationService.addRating({ activityId, rating: newRating })
        console.log('Rating save response:', response)
        this.selectedActivity.userRating = newRating
        this.updateAverageRating(activityId)
        await this.fetchRatingOverview(activityId)
        this.showAlert('Rating updated successfully!', 'success')
      } catch (error) {
        console.error('Error saving rating:', error)
      }
    },
    async fetchUserRating (activityId) {
      try {
        const response = await AuthenticationService.getUserRatingForActivity(activityId)
        this.selectedActivity.userRating = response.data.rating
      } catch (error) {
        console.error('Error fetching user rating:', error)
        this.selectedActivity.userRating = 0
      }
    },
    toggleReveal () {
      if (this.ratingsDialog) {
        this.ratingsDialog = false
        return
      }
      if (this.selectedActivity) {
        this.fetchRatingOverview(this.selectedActivity.id)
          .then(() => {
            this.ratingsDialog = true
          })
          .catch(error => {
            console.error('Error fetching rating overview:', error)
          })
      }
    },
    async fetchRatingOverview (activityId) {
      try {
        const response = await AuthenticationService.getRatingsBreakdownForActivity(activityId)
        const totalRatings = response.data.ratingsBreakdown.reduce((sum, item) => sum + item.count, 0)
        this.ratingOverview = {
          ...response.data,
          totalRatings: totalRatings,
          ratingsBreakdown: [...response.data.ratingsBreakdown]
        }
        this.ratingsDialog = true
      } catch (error) {
        console.error('Error fetching rating overview:', error)
      }
    },
    calculateRatingPercentage (count) {
      if (!this.ratingOverview || !this.ratingOverview.totalRatings) return 0
      const percentage = (count / this.ratingOverview.totalRatings) * 100
      console.log(`Rating for count ${count} is ${percentage}%`)
      return percentage
    },

    showAlert (message, type) {
      this.alertText = message
      this.alertType = type
      this.alert = true

      setTimeout(() => {
        this.alert = false
      }, 2000)
    },
    onClickSeeAll () {
      this.itemsPerPage = this.itemsPerPage === 8 ? this.activities.length : 8
    },
    selectActivity (activity) {
      this.selectedActivity = activity
      this.dialog = true
      this.fetchUserRating(activity.id).then(() => {
        this.tempRating = this.selectedActivity.userRating || 0
        console.log(`Initial tempRating for activityId ${activity.id}: ${this.tempRating}`)
      })
    },

    async addToCart (activity) {
      try {
        const quantityToAdd = 1
        await AuthenticationService.addToCart({
          activityId: activity.id,
          quantity: quantityToAdd
        })
        this.showAlert('Activity added to cart', 'success')
      } catch (error) {
        console.error('Error adding activity to cart:', error)
        this.showAlert('Error adding activity to cart', 'error')
      }
    },
    async fetchAllActivities () {
      try {
        const response = await AuthenticationService.getActivities()
        const activitiesWithRatings = await Promise.all(response.data.map(async activity => {
          const ratingResponse = await AuthenticationService.getAverageRatingForActivity(activity.id)
          console.log(ratingResponse)
          return { ...activity, averageRating: ratingResponse.data.averageRating }
        }))
        this.activities = activitiesWithRatings
      } catch (error) {
        console.error('Error fetching activities:', error)
      }
    },
    async fetchOrganizations () {
      try {
        const response = await AuthenticationService.getOrganizations()
        this.organizations = response.data
      } catch (error) {
        console.error('Error fetching organizations:', error)
      }
    },
    async onSearch () {
      if (!this.search) {
        this.fetchAllActivities()
        return
      }
      try {
        const response = await AuthenticationService.searchActivities(this.search)
        this.activities = response.data
      } catch (error) {
        console.error('Error searching activities:', error)
      }
    },
    async sortActivities (order) {
      try {
        const response = await AuthenticationService.sortActivitiesByLocation(order)
        this.activities = response.data
        this.sortAscending = order === 'asc'
        const activitiesWithRatings = await Promise.all(response.data.map(async activity => {
          const existingActivity = this.activities.find(a => a.id === activity.id)
          if (existingActivity && existingActivity.averageRating) {
            return { ...activity, averageRating: existingActivity.averageRating }
          } else {
            const ratingResponse = await AuthenticationService.getAverageRatingForActivity(activity.id)
            return { ...activity, averageRating: ratingResponse.data.averageRating }
          }
        }))

        this.activities = activitiesWithRatings
      } catch (error) {
        console.error('Error sorting activities:', error)
      }
    },
    async applyFilter () {
      try {
        const response = await AuthenticationService.getFilteredActivities({
          minLocation: this.locationRange[0],
          maxLocation: this.locationRange[1],
          organizations: this.selectedOrganizations.join(',')
        })
        const activitiesWithRatings = await Promise.all(response.data.map(async activity => {
          const existingActivity = this.activities.find(a => a.id === activity.id)
          if (existingActivity && existingActivity.averageRating) {
            return { ...activity, averageRating: existingActivity.averageRating }
          } else {
            const ratingResponse = await AuthenticationService.getAverageRatingForActivity(activity.id)
            return { ...activity, averageRating: ratingResponse.data.averageRating }
          }
        }))

        this.activities = activitiesWithRatings
        this.showFilterDialog = false
      } catch (error) {
        console.error('Error applying filters:', error)
      }
    }
  },
  async created () {
    this.fetchAllActivities()
    this.fetchOrganizations()
  }
}
</script>

<style>
  .white-text {
    color: white;
  }
  
  .header-search-container {
    color: #333; /* Couleur plus foncée pour le texte */
    margin-left: 20px;
    margin-bottom: 15px;
  }
  
  .search-bar {
    max-width: 600px;
    background-color: rgba(0, 0, 0, 0.1); /* Fond semi-transparent pour la barre de recherche */
    color: #333; /* Couleur du texte */
  }
  
  .v-btn {
    
    background-color: rgba(0, 0, 0, 0.1); /* Fond semi-transparent pour les boutons */
  }
  
  .v-icon {
    color: #333; /* Couleur des icônes */
  }
  
  .v-footer {
    background-color: rgba(0, 0, 0, 0.1); /* Fond semi-transparent pour le footer */
    color: #333; /* Couleur du texte dans le footer */
  }

  .dialog-bottom-transition-enter-active, .dialog-bottom-transition-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .dialog-bottom-transition-enter, .dialog-bottom-transition-leave-to {
    opacity: 0;
  }
  
  .overlay-title {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-bottom-right-radius: 8px;
  }
  
  .custom-outlined-card {
    border: 2px solid var(--v-grey-darken-4);
  }
  .h1 {
    color: white;
  }
</style>
