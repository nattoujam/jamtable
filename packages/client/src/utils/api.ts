import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-with': 'XMLHttpRequest',
  },
  responseType: 'json',
})

export const postLogin = async (userName: string) => await api.post('/login', { userName })
export const postLogout = async (userName: string) => await api.post('/logout', { userName })
export const getRoom = async () => await api.get('/rooms')
