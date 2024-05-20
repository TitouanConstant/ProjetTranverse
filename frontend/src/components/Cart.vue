<template>
  <v-container class="mt-14">
    <v-row>
      <v-col cols="12" md="8">
        <h1 class="text-h4 font-weight-bold mb-4 align-center white-text">Votre Panier</h1>
        <div v-for="item in cartItems" :key="item.activityId" class="cart-item">
          <v-card class="mb-3 elevation-2 card-size">
            <div class="d-flex justify-end">
              <v-btn icon class="remove-btn" @click="promptRemoveFromCart(item)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            <v-card-title>
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-img :src="item.activity.imageUrl" height="80" width="80" contain class="mr-3"></v-img>
                  <div>
                    <div class="text-h6">{{ item.activity.title }}</div>
                    <div class="text-subtitle-1">{{ item.activity.organization }}</div>
                    <div class="text-subtitle-2">{{ item.activity.location }}</div>
                    <div class="text-subtitle-2 font-weight-bold">Places Totales : {{ item.activity.spotsAvailable }}</div>
                  </div>
                </div>
                <div class="d-flex align-center quantity-controls">
                  <v-btn icon small @click="decreaseQuantity(item)">
                    <v-icon size="18">mdi-minus</v-icon>
                  </v-btn>
                  <span class="mx-2">{{ item.quantity }}</span>
                  <v-btn icon small @click="increaseQuantity(item)">
                    <v-icon size="18">mdi-plus</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-card-title>
          </v-card>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <div class="checkout-summary sticky-top">
          <v-card class="mb-3">
            <v-card-title class="summary-title">
              Résumé
              <div class="checkout-items">
                <div v-for="item in cartItems" :key="item.activityId" class="checkout-item">
                  <span class="item-name">{{ item.activity.title }}</span>
                  <span class="item-multiplier">x</span>
                  <span class="item-quantity">{{ item.quantity }}</span>
                </div>
              </div>
              Places Totales : {{ totalSpots }}
            </v-card-title>
            <v-card-actions>
              <v-btn large color="green" @click="showCheckoutDialog = true">Passer à la caisse</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <!-- Boîte de dialogue de confirmation de paiement -->
    <v-dialog v-model="showCheckoutDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmer le paiement</v-card-title>
        <v-card-text>Voulez-vous passer à la caisse ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-4" text @click="showCheckoutDialog = false">Annuler</v-btn>
          <v-btn color="red-darken-4" text @click="confirmCheckout">Confirmer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Boîte de dialogue de suppression d'article -->
    <v-dialog v-model="showRemoveDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Supprimer l'article</v-card-title>
        <v-card-text>Êtes-vous sûr de vouloir supprimer cet article du panier ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-4" text @click="showRemoveDialog = false">Annuler</v-btn>
          <v-btn color="red-darken-4" text @click="confirmRemoveItem">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Alerte pour les messages -->
    <v-alert v-model="alert" :type="alertType" dismissible @input="alert = false">
      {{ alertText }}
    </v-alert>
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
      cartItems: [],
      showCheckoutDialog: false,
      showRemoveDialog: false,
      itemToRemove: null,
      alert: false,
      alertText: '',
      alertType: 'success'
    }
  },
  computed: {
    totalSpots () {
      return this.cartItems.reduce((total, item) => {
        return total + item.quantity
      }, 0)
    }
  },
  async created () {
    await this.fetchCart()
  },
  methods: {
    async fetchCart () {
      try {
        const response = await AuthenticationService.getCart()
        this.cartItems = response.data
      } catch (error) {
        this.showAlert('Error fetching cart', 'error')
      }
    },
    promptRemoveFromCart (item) {
      this.itemToRemove = item
      this.showRemoveDialog = true
    },
    confirmRemoveItem () {
      this.showRemoveDialog = false
      if (this.itemToRemove) {
        this.removeFromCart(this.itemToRemove)
        this.itemToRemove = null
      }
    },
    async removeFromCart (item) {
      try {
        await AuthenticationService.removeFromCart(item.activityId)
        this.fetchCart()
        this.showAlert('Item removed from cart', 'success')
      } catch (error) {
        this.showAlert('Error removing item from cart', 'error')
      }
    },
    async increaseQuantity (item) {
      try {
        await AuthenticationService.increaseCartItemQuantity(item.activityId)
        this.fetchCart()
        this.showAlert('Quantity increased', 'success')
      } catch (error) {
        this.showAlert('Error increasing quantity', 'error')
      }
    },
    async decreaseQuantity (item) {
      if (item.quantity === 1) {
        this.promptRemoveFromCart(item)
      } else {
        try {
          await AuthenticationService.decreaseCartItemQuantity(item.activityId)
          this.fetchCart()
          this.showAlert('Quantity decreased', 'success')
        } catch (error) {
          this.showAlert('Error decreasing quantity', 'error')
        }
      }
    },
    confirmCheckout () {
      this.showCheckoutDialog = false
      this.checkout()
    },
    async checkout () {
      try {
        await AuthenticationService.checkout()
        this.fetchCart()
        this.showAlert('Checkout successful', 'success')
      } catch (error) {
        this.showAlert('Error during checkout', 'error')
      }
    },
    showAlert (message, type) {
      this.alertText = message
      this.alertType = type
      this.alert = true

      setTimeout(() => {
        this.alert = false
      }, 2000) // Auto-hide after 2000ms (2 seconds)
    }
  }
}
</script>

<style scoped>
.v-alert {
  margin-bottom: 1rem;
}
.summary-title {
  font-size: 1.25rem; /* Adjust the size to your preference */
  margin-bottom: 0.5rem;
}

.item-name {
  font-size: 0.85rem; /* Smaller font size for the item name */
}

.item-quantity {
  font-size: 0.85rem; /* Smaller font size for the quantity */
}
.item-multiplier {
  font-size: 0.85rem; /* Match the font size of item name and quantity */
  margin: 0 4px; /* Optional: add some horizontal spacing around the 'x' */
}

.cart-item {
  display: flex;
  align-items: center;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.card-size {
  width: 100%;
  /*max-width: 500px;*/
}
.v-btn:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.remove-btn {
  width: 24px;
  height: 24px;
  min-width: 24px;
}

.remove-btn .v-icon {
  font-size: 18px;
}

.quantity-controls .v-btn {
  width: 24px;
  height: 24px;
  min-width: 24px;
  padding: 0;
}

.quantity-controls .v-icon {
  font-size: 18px;
}

.checkout-btn {
  background-color: green;
  color: white;
  font-weight: bold;
  padding: 12px 24px;
}

.checkout-btn:hover {
  background-color: darkgreen;
}

.v-row {
  position: relative;
}

.checkout-summary {
  position: sticky;
  top: 0;
  padding-top: 20px;
  height: fit-content;
}

.checkout-items {
  margin-bottom: 10px;
}

.checkout-item {
  margin-bottom: 5px;
}

.card-size {
  max-width: 100%;
}

.total-container {
  display: none;
}
</style>
