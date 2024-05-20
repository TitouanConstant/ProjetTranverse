<template>
  <v-container class="mt-14">
    <v-data-table
      :headers="headers"
      :items="activities"
      :sort-by="[{ key: 'title', order: 'asc' }]"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Liste des Activités</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="fetchActivities">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-btn color="primary" dark @click="openEditDialog()">Nouvelle Activité</v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td><v-img :src="item.imageUrl" height="60" width="60" contain></v-img></td>
          <td>{{ item.title }}</td>
          <td>{{ item.organization }}</td>
          <td>{{ item.location }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.spotsAvailable }}</td>
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
          <span class="text-h5">{{ editedActivity.id ? 'Modifier l\'activité' : 'Nouvelle Activité' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedActivity.title" label="Titre" :error-messages="activityErrors.title"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedActivity.organization" label="Organisation" :error-messages="activityErrors.organization"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedActivity.location" label="Lieu" :error-messages="activityErrors.location"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedActivity.description" label="Description" :error-messages="activityErrors.description"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedActivity.spotsAvailable" label="Places disponibles" type="number" :error-messages="activityErrors.spotsAvailable"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedActivity.imageUrl" label="URL de l'image" :error-messages="activityErrors.imageUrl"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editDialog = false">Annuler</v-btn>
          <v-btn color="blue darken-1" text @click="saveActivity">Sauvegarder</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmer la suppression</v-card-title>
        <v-card-text>Êtes-vous sûr de vouloir supprimer cette activité ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete">Supprimer</v-btn>
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
      activities: [],
      headers: [
        { title: 'Image', key: 'image', sortable: false },
        { title: 'Title', key: 'title' },
        { title: 'Organization', key: 'organization' },
        { title: 'Location', key: 'location' },
        { title: 'Description', key: 'description', sortable: false },
        { title: 'Spots Available', key: 'spotsAvailable', sortable: false },
        { title: 'Actions', key: 'actions', sortable: false }
      ],
      editDialog: false,
      deleteDialog: false,
      editedActivity: {
        id: '',
        title: '',
        organization: '',
        location: '',
        description: '',
        spotsAvailable: 10,
        imageUrl: ''
      },
      activityErrors: {
        title: '',
        organization: '',
        location: '',
        description: '',
        spotsAvailable: '',
        imageUrl: ''
      },
      activityToDelete: null
    }
  },

  methods: {
    async fetchActivities () {
      try {
        const response = await AuthenticationService.getActivities()
        this.activities = response.data
      } catch (error) {
        console.error('Error fetching activities:', error)
      }
    },

    openEditDialog (activity = null) {
      this.editedActivity = activity ? Object.assign({}, activity) : this.getEmptyActivity()
      this.activityErrors = {}
      this.editDialog = true
    },

    getEmptyActivity () {
      return { title: '', organization: '', location: '', description: '', spotsAvailable: 10, imageUrl: '' }
    },

    validateActivity () {
      this.activityErrors = {}
      let isValid = true

      if (!this.editedActivity.title) {
        this.activityErrors.title = 'Title is required'
        isValid = false
      }
      if (!this.editedActivity.organization) {
        this.activityErrors.organization = 'Organization is required'
        isValid = false
      }
      if (!this.editedActivity.location) {
        this.activityErrors.location = 'Location is required'
        isValid = false
      }
      if (!this.editedActivity.description) {
        this.activityErrors.description = 'Description is required'
        isValid = false
      }
      if (!this.editedActivity.spotsAvailable || this.editedActivity.spotsAvailable < 0) {
        this.activityErrors.spotsAvailable = 'Valid spots available is required'
        isValid = false
      }
      if (!this.editedActivity.imageUrl || !this.editedActivity.imageUrl.startsWith('http')) {
        this.activityErrors.imageUrl = 'Valid image URL is required'
        isValid = false
      }

      return isValid
    },

    async saveActivity () {
      if (!this.validateActivity()) return

      try {
        if (this.editedActivity.id) {
          await AuthenticationService.updateActivity(this.editedActivity.id, this.editedActivity)
        } else {
          await AuthenticationService.addActivity(this.editedActivity)
        }
        this.editDialog = false
        await this.fetchActivities()
      } catch (error) {
        console.error('Error saving activity:', error)
      }
    },

    openDeleteDialog (activity) {
      this.activityToDelete = activity
      this.deleteDialog = true
    },

    async confirmDelete () {
      try {
        await AuthenticationService.deleteActivity(this.activityToDelete.id)
        this.deleteDialog = false
        await this.fetchActivities()
      } catch (error) {
        console.error('Error deleting activity:', error)
      }
    }
  },

  async created () {
    this.fetchActivities()
  }
}
</script>

<style scoped>
</style>
