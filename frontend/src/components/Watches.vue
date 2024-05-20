  <template>
    <v-container class="mt-14">
      <v-alert v-model="alert" :type="alertType" dismissible @input="alert = false">
        {{ alertText }}
      </v-alert>
      <v-data-iterator :items="watches" :brands="brands" :items-per-page="itemsPerPage">
        <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
          <h1 class="text-h4 font-weight-bold mb-4 align-center white-text">Watches Collection</h1>
          <div class="header-search-container d-flex align-center justify-space-between">
            <v-text-field
              v-model="search"
              label="Search Watches"
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
                See all
              </v-btn>
              <v-btn class="me-2" variant="text" @click="showFilterDialog = true">
                Filter
              </v-btn>
              <v-dialog v-model="showFilterDialog" max-width="500px">
                <v-card>
                  <v-card-title class="headline">Filters</v-card-title>
                  <v-card-text>
                    <v-subheader>Price Range</v-subheader>
                    <v-range-slider
                      v-model="priceRange"
                      :max="maxPrice"
                      :min="minPrice"
                      :step="1000"
                      thumb-label
                      always-dirty
                    ></v-range-slider>
                    <div class="d-flex justify-space-between px-3">
                      <v-text-field
                        v-model="priceRange[0]"
                        label="Min Price"
                        type="number"
                        outlined
                        dense
                      ></v-text-field>
                      <v-text-field
                        v-model="priceRange[1]"
                        label="Max Price"
                        type="number"
                        outlined
                        dense
                      ></v-text-field>
                    </div>
                    <v-subheader>Brands</v-subheader>
                    <v-checkbox
                      v-for="brand in brands"
                      :key="brand"
                      v-model="selectedBrands"
                      :label="brand"
                      :value="brand"
                    ></v-checkbox>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary darken-1" text @click="applyFilter">Apply</v-btn>
                    <v-btn color="grey lighten-1" text @click="showFilterDialog = false">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn icon="mdi-sort-ascending" size="small" variant="tonal" @click="sortWatches('asc')" v-if="!sortAscending"></v-btn>
              <v-btn icon="mdi-sort-descending" size="small" variant="tonal" @click="sortWatches('desc')" v-if="sortAscending"></v-btn>
              <v-btn :disabled="page === 1" icon="mdi-arrow-left" size="small" variant="tonal" @click="prevPage"></v-btn>
              <v-btn :disabled="page === pageCount" icon="mdi-arrow-right" size="small" variant="tonal" @click="nextPage"></v-btn>
            </div>
          </div>
        </template>
        <template v-slot:default="{ items }">
          <v-row>
            <v-col
              v-for="watch in items"
              :key="watch.raw.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              @click="selectWatch(watch.raw)"
            >
            <div class="v-card v-theme--dark v-card--density-default v-card--variant-elevated">
                <v-img :src="watch.raw.imageUrl" aspect-ratio="1" cover>
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
                <v-card-title>{{ watch.raw.name }}</v-card-title>
                <v-card-text>
                  <div>Brand: {{ watch.raw.brand }}</div>
                  <div>Price: {{ watch.raw.price }} $</div>
                  <v-btn color="green" @click.stop="addToCart(watch.raw)">
                    <v-icon left>mdi-cart</v-icon>
                    Buy
                  </v-btn>
                  <span class="text-grey-lighten-2 text-caption me-2">
                    ({{ watch.raw.averageRating }})
                  </span>
                  <v-rating
                    v-model="watch.raw.averageRating"
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
              <v-img :src="selectedWatch.imageUrl" aspect-ratio="1.5">
                <v-card-title class="overlay-title">{{ selectedWatch.name }}</v-card-title>
              </v-img>
              <v-card-text>
                <div class="text-h5 py-2">{{ selectedWatch.brand }}</div>
                <div class="text-subtitle-1 pb-2">Price: ${{ selectedWatch.price }}</div>
                <v-divider></v-divider>
                <div class="pt-3">{{ selectedWatch.description }}</div>
                <v-divider></v-divider>
                <div class="text-subtitle-1 pb-2">Rating :</div>
                <span class="text-grey-lighten-2 text-caption me-2">
                    ({{ selectedWatch.averageRating }})
                  </span>
                <v-rating
                    v-model="selectedWatch.averageRating"
                    color="yellow-darken-3"
                    half-increments
                    readonly
                    size="18"
                  ></v-rating>
                  <v-btn
                    variant="text"
                    @click="toggleReveal"
                  >
                    Click here to see Ratings
                  </v-btn>
              </v-card-text>
              <v-card-actions>
                <v-btn color="green" @click="addToCart(selectedWatch)">
                <v-icon left>mdi-cart</v-icon>
                    Buy
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
                Rating overview
              </div>

              <div class="d-flex align-center flex-column my-auto">
                <div class="text-h2 mt-5">
                  {{ selectedWatch.averageRating }}
                  <span class="text-h6 ml-n3">/5</span>
                </div>

                <v-rating
                  v-model="selectedWatch.averageRating"
                  color="yellow-darken-3"
                  half-increments
                  readonly
                ></v-rating>
                <div class="px-3">{{ ratingOverview.totalRatings }} ratings</div>
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
              <div class="text-subtitle-1 pb-2">Your Rating :</div>
              <v-rating
                hover
                :length="5"
                :size="32"
                v-model="tempRating"
                active-color="yellow-darken-3"
              />
              <v-card-actions>
              <v-btn color="primary" @click="saveRating(selectedWatch.id, tempRating)">
                Save Rating
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
            Total Watches: {{ watches.length }}
            <div>Page {{ page }} of {{ pageCount }}</div>
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
      watches: [],
      brands: [],
      selectedBrands: [],
      search: '',
      sortAscending: true,
      showFilterDialog: false,
      priceRange: [0, 150000],
      minPrice: 0,
      maxPrice: 150000,
      dialog: false,
      selectedWatch: null,
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
    async updateAverageRating (watchId) {
      console.log(`Updating average rating for watchId ${watchId}`)
      try {
        const response = await AuthenticationService.getAverageRatingForWatch(watchId)
        console.log('Updated average rating:', response)
        this.selectedWatch.averageRating = response.data.averageRating
        const watchIndex = this.watches.findIndex(watch => watch.id === watchId)
        if (watchIndex !== -1) {
          this.watches[watchIndex].averageRating = response.data.averageRating
        }
      } catch (error) {
        console.error('Error fetching average rating:', error)
      }
    },
    async saveRating (watchId, newRating) {
      console.log(`Saving rating for watchId ${watchId} with rating ${newRating}`)
      try {
        const response = await AuthenticationService.addRating({ watchId, rating: newRating })
        console.log('Rating save response:', response)
        this.selectedWatch.userRating = newRating
        this.updateAverageRating(watchId)
        await this.fetchRatingOverview(watchId)
        this.showAlert('Rating updated successfully!', 'success')
      } catch (error) {
        console.error('Error saving rating:', error)
      }
    },
    async fetchUserRating (watchId) {
      try {
        const response = await AuthenticationService.getUserRatingForWatch(watchId)
        this.selectedWatch.userRating = response.data.rating
      } catch (error) {
        console.error('Error fetching user rating:', error)
        this.selectedWatch.userRating = 0
      }
    },
    toggleReveal () {
      if (this.ratingsDialog) {
        this.ratingsDialog = false
        return
      }
      if (this.selectedWatch) {
        this.fetchRatingOverview(this.selectedWatch.id)
          .then(() => {
            this.ratingsDialog = true
          })
          .catch(error => {
            console.error('Error fetching rating overview:', error)
          })
      }
    },
    async fetchRatingOverview (watchId) {
      try {
        const response = await AuthenticationService.getRatingsBreakdownForWatch(watchId)
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
      this.itemsPerPage = this.itemsPerPage === 8 ? this.watches.length : 8
    },
    selectWatch (watch) {
      this.selectedWatch = watch
      this.dialog = true
      this.fetchUserRating(watch.id).then(() => {
        this.tempRating = this.selectedWatch.userRating || 0
        console.log(`Initial tempRating for watchId ${watch.id}: ${this.tempRating}`)
      })
    },

    async addToCart (watch) {
      try {
        const quantityToAdd = 1
        await AuthenticationService.addToCart({
          watchId: watch.id,
          quantity: quantityToAdd
        })
        this.showAlert('Item added to cart', 'success')
      } catch (error) {
        console.error('Error adding item to cart:', error)
        this.showAlert('Error adding item to cart', 'error')
      }
    },
    async fetchAllWatches () {
      try {
        const response = await AuthenticationService.getWatches()
        const watchesWithRatings = await Promise.all(response.data.map(async watch => {
          const ratingResponse = await AuthenticationService.getAverageRatingForWatch(watch.id)
          console.log(ratingResponse)
          return { ...watch, averageRating: ratingResponse.data.averageRating }
        }))
        this.watches = watchesWithRatings
      } catch (error) {
        console.error('Error fetching watches:', error)
      }
    },
    async fetchBrands () {
      try {
        const response = await AuthenticationService.getBrands()
        this.brands = response.data
      } catch (error) {
        console.error('Error fetching brands:', error)
      }
    },
    async onSearch () {
      if (!this.search) {
        this.fetchAllWatches()
        return
      }
      try {
        const response = await AuthenticationService.searchWatches(this.search)
        this.watches = response.data
      } catch (error) {
        console.error('Error searching watches:', error)
      }
    },
    async sortWatches (order) {
      try {
        const response = await AuthenticationService.sortWatchesByPrice(order)
        this.watches = response.data
        this.sortAscending = order === 'asc'
        const watchesWithRatings = await Promise.all(response.data.map(async watch => {
          const existingWatch = this.watches.find(w => w.id === watch.id)
          if (existingWatch && existingWatch.averageRating) {
            return { ...watch, averageRating: existingWatch.averageRating }
          } else {
            const ratingResponse = await AuthenticationService.getAverageRatingForWatch(watch.id)
            return { ...watch, averageRating: ratingResponse.data.averageRating }
          }
        }))

        this.watches = watchesWithRatings
      } catch (error) {
        console.error('Error sorting watches:', error)
      }
    },
    async applyFilter () {
      try {
        const response = await AuthenticationService.getFilteredWatches({
          minPrice: this.priceRange[0],
          maxPrice: this.priceRange[1],
          brands: this.selectedBrands.join(',')
        })
        const watchesWithRatings = await Promise.all(response.data.map(async watch => {
          const existingWatch = this.watches.find(w => w.id === watch.id)
          if (existingWatch && existingWatch.averageRating) {
            return { ...watch, averageRating: existingWatch.averageRating }
          } else {
            const ratingResponse = await AuthenticationService.getAverageRatingForWatch(watch.id)
            return { ...watch, averageRating: ratingResponse.data.averageRating }
          }
        }))

        this.watches = watchesWithRatings
        this.showFilterDialog = false
      } catch (error) {
        console.error('Error applying filters:', error)
      }
    }
  },
  async created () {
    this.fetchAllWatches()
    this.fetchBrands()
  }
}
</script>

  <style>
    .white-text {
      color: white;
    }
    .header-search-container {
      color: white;
    }
    .header-search-container {
      margin-left: 20px;
      margin-bottom: 15px;
    }
    .search-bar {
      max-width: 600px;
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
