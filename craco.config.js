const { paths } = require('@craco/craco')

module.exports = {
  webpack: {
    alias: {
      // Add the aliases for all the top-level folders in the `src/` folder.
      '@commons': `${paths.appSrc}/commons/`,
      '@hooks': `${paths.appSrc}/hooks/`,
      '@components': `${paths.appSrc}/components/`
    }
  }
}
