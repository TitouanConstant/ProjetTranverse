<template>
  <v-container class="mt-14">
    <v-data-table
      :headers="headers"
      :items="watches"
      :sort-by="[{ key: 'name', order: 'asc' }]"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Watches List</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="fetchWatches">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-btn color="primary" dark @click="openEditDialog()">New Watch</v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td><v-img :src="item.imageUrl" height="60" width="60" contain></v-img></td>
          <td>{{ item.name }}</td>
          <td>{{ item.brand }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.quantity }}</td>
          <td>
            <v-icon small class="me-2" @click="openEditDialog(item)">mdi-pencil</v-icon>
            <v-icon small @click="openDeleteDialog(item)">mdi-delete</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedWatch.id ? 'Edit Watch' : 'New Watch' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedWatch.name" label="Name" :error-messages="watchErrors.name"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedWatch.brand" label="Brand" :error-messages="watchErrors.brand"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedWatch.price" label="Price" type="number" :error-messages="watchErrors.price"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedWatch.description" label="Description" :error-messages="watchErrors.description"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedWatch.quantity" label="Quantity" type="number" :error-messages="watchErrors.quantity"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedWatch.imageUrl" label="Image URL" :error-messages="watchErrors.imageUrl"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editDialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveWatch">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this watch?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  data () {
    return {
      watches: [],
      headers: [
        { title: 'Image', key: 'image', sortable: false },
        { title: 'Name', key: 'name' },
        { title: 'Brand', key: 'brand' },
        { title: 'Price', key: 'price' },
        { title: 'Description', key: 'description', sortable: false },
        { title: 'Quantity', key: 'quantity', sortable: false },
        { title: 'Actions', key: 'actions', sortable: false }
      ],
      editDialog: false,
      deleteDialog: false,
      editedWatch: {
        id: '',
        name: '',
        brand: '',
        price: '',
        description: '',
        quantity: 10,
        imageUrl: ''
      },
      watchErrors: {
        name: '',
        brand: '',
        price: '',
        description: '',
        quantity: '',
        imageUrl: ''
      },
      watchToDelete: null
    }
  },

  methods: {
    async fetchWatches () {
      try {
        const response = await AuthenticationService.getWatches()
        this.watches = response.data
      } catch (error) {
        console.error('Error fetching watches:', error)
      }
    },

    openEditDialog (watch = null) {
      this.editedWatch = watch ? Object.assign({}, watch) : this.getEmptyWatch()
      this.watchErrors = {}
      this.editDialog = true
    },

    getEmptyWatch () {
      return { name: '', brand: '', price: '', description: '', quantity: 10, imageUrl: '' }
    },

    validateWatch () {
      this.watchErrors = {}
      let isValid = true

      if (!this.editedWatch.name) {
        this.watchErrors.name = 'Name is required'
        isValid = false
      }
      if (!this.editedWatch.brand) {
        this.watchErrors.brand = 'Brand is required'
        isValid = false
      }
      if (!this.editedWatch.price || this.editedWatch.price <= 0) {
        this.watchErrors.price = 'Valid price is required'
        isValid = false
      }
      if (!this.editedWatch.description) {
        this.watchErrors.description = 'Description is required'
        isValid = false
      }
      if (!this.editedWatch.quantity || this.editedWatch.quantity < 0) {
        this.watchErrors.quantity = 'Valid quantity is required'
        isValid = false
      }
      if (!this.editedWatch.imageUrl || !this.editedWatch.imageUrl.startsWith('http')) {
        this.watchErrors.imageUrl = 'Valid image URL is required'
        isValid = false
      }

      return isValid
    },

    async saveWatch () {
      if (!this.validateWatch()) return

      try {
        if (this.editedWatch.id) {
          await AuthenticationService.updateWatch(this.editedWatch.id, this.editedWatch)
        } else {
          await AuthenticationService.addWatch(this.editedWatch)
        }
        this.editDialog = false
        await this.fetchWatches()
      } catch (error) {
        console.error('Error saving watch:', error)
      }
    },

    openDeleteDialog (watch) {
      this.watchToDelete = watch
      this.deleteDialog = true
    },

    async confirmDelete () {
      try {
        await AuthenticationService.deleteWatch(this.watchToDelete.id)
        this.deleteDialog = false
        await this.fetchWatches()
      } catch (error) {
        console.error('Error deleting watch:', error)
      }
    }
  },

  async created () {
    this.fetchWatches()
  }
}
</script>

<style scoped>
</style>
