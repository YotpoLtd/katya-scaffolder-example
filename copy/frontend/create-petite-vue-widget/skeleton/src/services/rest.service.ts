import axios, { AxiosRequestConfig } from 'axios'

const BASE_URL = 'https://api-cdn.yotpo.com'

const restAPIService = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

restAPIService.interceptors.request.use(
  (config) => {
    const newConfig = {
      ...config,
      yometadata: {},
    }

    newConfig.yometadata = { startTime: new Date() }
    return newConfig
  },
  (error) => {
    return Promise.reject(error)
  },
)
restAPIService.interceptors.response.use(
  (response) => {
    const newRes = { ...response }
    const config = newRes.config as AxiosRequestTimeConfig
    config.yometadata.endTime = new Date()
    config.yometadata.duration = config.yometadata.endTime.getTime() - config.yometadata.startTime.getTime()
    return newRes
  },
  (error) => {
    const newError = { ...error }
    newError.config.yometadata.endTime = new Date()
    newError.config.yometadata.duration = newError.config.yometadata.endTime - newError.config.yometadata.startTime
    return Promise.reject(newError)
  },
)

export interface AxiosRequestTimeConfig extends AxiosRequestConfig {
  yometadata: {
    startTime: Date
    endTime: Date
    duration: number
  }
}

class RestService {
  get(url: string): Promise<any> {
    return restAPIService.get(url)
  }

  post(url: string, body: any, headers: any = null): Promise<any> {
    const requestOptions: any = {
      method: 'POST',
      redirect: 'follow',
    }
    if (headers) {
      const rest = axios.create({
        baseURL: BASE_URL,
        withCredentials: false,
        headers,
      })
      return rest.post(url, body, requestOptions)
    } else {
      return restAPIService.post(url, body, requestOptions)
    }
  }
}

export default new RestService()
