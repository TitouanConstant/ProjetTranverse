import axios from 'axios'
import store from '@/store'

export default () => {
  const headers = {}
  if (store.state.token) {
    headers.Authorization = `Bearer ${store.state.token}`
  }
  return axios.create({
    baseURL: 'http://localhost:8081/',
    headers: headers
  })
}
