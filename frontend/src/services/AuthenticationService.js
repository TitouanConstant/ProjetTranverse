import Api from '@/services/Api'

export default {
  register (credentials) {
    return Api().post('register', credentials)
  },
  login (credentials) {
    return Api().post('login', credentials)
  },
  getUsers () {
    return Api().get('admin/users')
  },
  updateUser (userId, userData) {
    return Api().put('admin/users/' + userId, userData)
  },
  deleteUser (userId) {
    return Api().delete('admin/users/' + userId)
  },
  getActivities () {
    return Api().get('activities')
  },
  addActivity (activityData) {
    return Api().post('admin/activities', activityData)
  },
  updateActivity (activityId, activityData) {
    return Api().put(`admin/activities/${activityId}`, activityData)
  },
  deleteActivity (activityId) {
    return Api().delete(`admin/activities/${activityId}`)
  },
  getOrganizations () {
    return Api().get('organizations')
  },
  searchActivities (searchTerm) {
    return Api().get('activities/search', {
      params: { search: searchTerm }
    })
  },
  sortActivitiesByLocation (order) {
    return Api().get('activities/sort', {
      params: { order: order }
    })
  },
  getFilteredActivities (filters) {
    return Api().get('activities/filtered', { params: filters })
  },
  getCart () {
    return Api().get('cart')
  },
  removeFromCart (activityId) {
    return Api().delete(`cart/remove/${activityId}`)
  },
  increaseCartItemQuantity (activityId) {
    return Api().post(`cart/increase/${activityId}`)
  },
  decreaseCartItemQuantity (activityId) {
    return Api().post(`cart/decrease/${activityId}`)
  },
  addToCart (cartData) {
    return Api().post('cart/add', cartData)
  },
  checkout () {
    return Api().post('/checkout')
  },
  getAverageRatingForActivity (activityId) {
    return Api().get(`activities/${activityId}/average-rating`)
  },
  getRatingsBreakdownForActivity (activityId) {
    return Api().get(`ratings/breakdown/${activityId}`)
  },
  addRating (ratingData) {
    return Api().post('/ratings', ratingData)
  },
  getUserRatingForActivity (activityId) {
    return Api().get(`ratings/${activityId}`)
  }
}
