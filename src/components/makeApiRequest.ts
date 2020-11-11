import { logger } from '../utils/logger'
import axios, { AxiosRequestConfig } from 'axios'

export const baseURL = process.env.REACT_APP_BASE_URL
export const programId = process.env.REACT_APP_PROGRAM_ID
export const authLabel: string = process.env.REACT_APP_FIDEL_AUTH_LABEL || ''

export type transactionRequestType = {
  status: number,
  data: unknown[] | unknown
}

export const axiosConfigurations: AxiosRequestConfig = {
  method: 'get',
  responseType: 'json',
  baseURL,
  timeout: 5000,
  headers: {[authLabel]: process.env.REACT_APP_SECRET_KEY},
  validateStatus: (status: number): boolean => status < 400 || status === 404
}

export const makeRestApiCall = async (url: string, config = {}) => {
  try {
    const updatedConfigurations: AxiosRequestConfig = {
      ...axiosConfigurations,
      ...config,
      url
    }
    console.log(updatedConfigurations)
   const response = await axios(updatedConfigurations)
   const { data, status }  = response || {}
    if (status === 404) {
      return { status, data: '404' }
    }

    if (updatedConfigurations.method === 'delete' || status === 204) {
      return { status, data: 'success' }
    }
    return { status, data }
  } catch (error) {
    if (error.response) {
      const { data, status } = error.response
      console.error(data)
      throw new Error(apiError({ status, url }))
    } else if (error.request) {
      console.error(error.request)
      throw new Error(
        'Something is not quite right, not to worry our engineers were notified!'
      )
    } else {
      console.error(error.message)
      throw new Error(
        'Something is not quite right, not to worry our engineers were notified!'
      )
    }
  }
}

const E3XX = (status: number): boolean => status > 299 && status < 400
const E4XX = (status: number): boolean => status > 399 && status < 500

type ApiErrorParameters = {
  status: number
  url: string
}

export const apiError = ({ status, url }: ApiErrorParameters) => {
  switch (status) {
    case 301:
      logger.warning(
        `${url} returned 301 on ${new Date().toLocaleTimeString()}`
      )
      return 'The requested resources have moved permanently.'
    case 400:
      logger.warning(
        `${url} returned 400 on ${new Date().toLocaleTimeString()}`
      )
      return 'Please provide all parameters correctly and try again.'
    case 403:
      logger.warning(
        `${url} returned 403 on ${new Date().toLocaleTimeString()}`
      )
      return 'You do not have permission to perform this operation.'
    case 401:
      logger.warning(
        `${url} returned 401 on ${new Date().toLocaleTimeString()}`
      )
      return 'This action requires you to be logged in. Please refresh your browser and try again.'
    case 404:
      logger.warning(
        `${url} returned 404 on ${new Date().toLocaleTimeString()}`
      )
      return 'No content was returned.'
    case 500:
      logger.error(`${url} returned 500 on ${new Date().toLocaleTimeString()}`)
      return 'Sorry, something went wrong. Please contact the administrator.'
    default:
      if (E3XX(status)) {
        logger.warning(
          `${url} returned ${status} on ${new Date().toLocaleTimeString()}`
        )
        return 'Sorry, this resource has moved or is being redirected'
      } else if (E4XX(status)) {
        logger.warning(
          `${url} returned ${status} on ${new Date().toLocaleTimeString()}`
        )
        return 'Sorry, we could not understand the request you just made'
      } else {
        logger.error(
          `${url} returned ${status} on ${new Date().toLocaleTimeString()}`
        )
        return 'Sorry, an error occurred while executing your request'
      }
  }
}
