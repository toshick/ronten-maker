export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Kosugi+Maru&display=swap',
      },
      {
        rel: 'stylesheet',
        href: '//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css',
      },
    ],
    script: [
      {
        defer: true,
        src: 'https://use.fontawesome.com/releases/v5.0.8/js/all.js',
        integrity: 'sha384-SlE991lGASHoBfWbelyBPLsUlwY1GwNDJo3jSJO04KZ33K2bwfV9YBauFfnzvynJ',
        crossorigin: 'anonymous',
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [{ src: 'assets/sass/app.sass', lang: 'sass' }],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/global.ts' },
    // { src: '~/plugins/firebase.ts' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/proxy',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
  /**
   * router
   */
  router: {
    middleware: 'authenticated',
  },
  proxy: {
    '/api': {
      target: 'http://localhost:8888',
    },
  },
  generate: {
    dir: '../app/public',
  },
};
