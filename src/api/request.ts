import axios, { type AxiosRequestConfig } from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// const store = useLoginStore()

const request = axios.create({
    baseURL: 'http://192.168.199.227',
    withCredentials: true
})

request.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        NProgress.start()
        // const token = store.getToken
        // if (token) {
        //     (config.headers as AxiosRequestHeaders).Authorization = token
        // }
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
