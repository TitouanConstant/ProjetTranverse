<template>
  <v-container class="mt-14">
    <v-data-table
      :headers="headers"
      :items="users"
      :sort-by="[{ key: 'firstName', order: 'asc' }]"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>User List</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="fetchUsers">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" dark class="mb-2" v-bind="props">New User</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedUser.firstName" label="First Name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedUser.lastName" label="Last Name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedUser.email" label="Email"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedUser.password" label="Password" type="password"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close">Cancel</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon v-if="!item.isAdmin" size="small" class="me-2" @click="editUser(item)">
          mdi-pencil
        </v-icon>
        <v-icon v-if="!item.isAdmin" size="small" @click="deleteUser(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this user?</v-card-text>
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
      deleteDialog: false,
      userToDelete: null,
      dialog: false,
      headers: [
        { title: 'First Name', key: 'firstName' },
        { title: 'Last Name', key: 'lastName' },
        { title: 'Email', key: 'email' },
        { title: 'Actions', key: 'actions', sortable: false }
      ],
      users: [],
      editedIndex: -1,
      editedUser: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      },
      defaultUser: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      }
    }
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New User' : 'Edit User'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  async created () {
    try {
      const response = await AuthenticationService.getUsers()
      this.users = response.data
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    editUser (user) {
      if (user.isAdmin) {
        alert('You cannot edit an admin user.')
        return
      }
      this.editedIndex = this.users.indexOf(user)
      this.editedUser = Object.assign({}, user)
      this.dialog = true
    },

    deleteUser (user) {
      if (user.isAdmin) {
        alert('You cannot delete an admin user.')
        return
      }
      this.userToDelete = user
      this.deleteDialog = true
    },
    async confirmDelete () {
      if (this.userToDelete.isAdmin) {
        this.deleteDialog = false
        alert('You cannot delete an admin user.')
        return
      }
      try {
        await AuthenticationService.deleteUser(this.userToDelete.id)
        this.users = this.users.filter(u => u.id !== this.userToDelete.id)
      } catch (error) {
        console.error('Error deleting user:', error)
      }
      this.deleteDialog = false
      this.userToDelete = null
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser)
        this.editedIndex = -1
      })
    },
    async fetchUsers () {
      try {
        const response = await AuthenticationService.getUsers()
        this.users = response.data
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    },
    async save () {
      try {
        if (this.editedIndex > -1) {
          const updatedUser = await AuthenticationService.updateUser(this.editedUser.id, this.editedUser)
          Object.assign(this.users[this.editedIndex], updatedUser.data)
        } else {
          const newUser = await AuthenticationService.register(this.editedUser)
          this.users.push(newUser.data)
        }
        await this.fetchUsers()
      } catch (error) {
        console.error('Error saving user:', error)
      }
      this.close()
    }
  }
}
</script>

<style scoped>
</style>
