import axios, { type AxiosRequestConfig } from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const request = axios.create({
    baseURL: '/api',
    withCredentials: true
})

request.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        NProgress.start()
        return config
    },
    (err) => {
        return Promise.reject(err)
    }
)

request.interceptors.response.use(
    (res) => {
        NProgress.done()
        return res.data
    },
    (err) => {
        return Promise.reject(err)
    }
)

export default request
