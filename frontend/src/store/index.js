import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  strict: true,
  plugins: [createPersistedState()],
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
    isUserAdmin: false
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      state.isUserLoggedIn = !!(token)
    },
    setUser (state, user) {
      state.user = user
      state.isUserAdmin = user ? user.isAdmin : false
    },
    resetUser (state) {
      state.user = null
      state.isUserAdmin = false
    }
  },
  actions: {
    setToken ({ commit }, token) {
      commit('setToken', token)
    },
    setUser ({ commit }, user) {
      commit('setUser', user)
    },
    resetUser ({ commit }) {
      commit('resetUser')
    }
  }
})
