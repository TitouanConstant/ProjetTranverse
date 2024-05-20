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
  getWatches () {
    return Api().get('watches')
  },
  addWatch (watchData) {
    return Api().post('admin/watches', watchData)
  },
  updateWatch (watchId, watchData) {
    return Api().put(`admin/watches/${watchId}`, watchData)
  },
  deleteWatch (watchId) {
    return Api().delete(`admin/watches/${watchId}`)
  },
  getBrands () {
    return Api().get('brands')
  },
  searchWatches (searchTerm) {
    return Api().get('watches/search', {
      params: { search: searchTerm }
    })
  },
  sortWatchesByPrice (order) {
    return Api().get('watches/sort', {
      params: { order: order }
    })
  },
  getFilteredWatches (filters) {
    return Api().get('watches/filtered', { params: filters })
  },
  getCart () {
    return Api().get('cart')
  },
  removeFromCart (watchId) {
    return Api().delete(`cart/remove/${watchId}`)
  },
  increaseCartItemQuantity (watchId) {
    return Api().post(`cart/increase/${watchId}`)
  },
  decreaseCartItemQuantity (watchId) {
    return Api().post(`cart/decrease/${watchId}`)
  },
  addToCart (cartData) {
    return Api().post('cart/add', cartData)
  },
  checkout () {
    return Api().post('/checkout')
  },
  getAverageRatingForWatch (watchId) {
    return Api().get(`watches/${watchId}/average-rating`)
  },
  getRatingsBreakdownForWatch (watchId) {
    return Api().get(`ratings/breakdown/${watchId}`)
  },
  addRating (ratingData) {
    return Api().post('/ratings', ratingData)
  },
  getUserRatingForWatch (watchId) {
    return Api().get(`ratings/${watchId}`)
  }
}
