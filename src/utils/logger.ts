const NODE_ENV = process.env.NODE_ENV
const isDevelopment = NODE_ENV === 'development'

type Logger = {
  error: (error: string) => void
  warning: (warning: string) => void
  info: (info: string) => void
  dir: (directory: string) => void
}

export const logger: Logger = {
  error: error => {
    if (isDevelopment) {
      console.error(error)
      return
    } else {
      // log into a logger eg sentry
    }
  },
  warning: warning => {
    if (isDevelopment) {
      console.warn(warning)
      return
    }
    // log into a logger eg sentry
  },

  info: info => {
    if (isDevelopment) {
      console.log(info)
      return
    }
    // log into a logger eg sentry
  },

  dir: directory => {
    if (isDevelopment) {
      console.dir(directory)
    }
    // log into a logger eg sentry
  }
}
