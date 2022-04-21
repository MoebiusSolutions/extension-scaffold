/** @type {import("snowpack").SnowpackUserConfig } */

const urlPath = process.env.URLPATH || ''

module.exports = {
  mount: {
    public: { url: `${urlPath}/`, static: true },
    src: { url: `${urlPath}/dist` },
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    [
      '@snowpack/plugin-typescript',
      {
        /* Yarn PnP workaround: see https://www.npmjs.com/package/@snowpack/plugin-typescript */
        ...(process.versions.pnp ? { tsc: 'yarn pnpify tsc' } : {}),
      },
    ],
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    port: 8080,
    /* ... */
  },
  buildOptions: {
    baseUrl: urlPath,
    metaUrlPath: `${urlPath}/_snowpack`
  },
  env: {
    // development
     ES_SECURITY_URL_development: 'https://security.dev26.minerva.navy.mil/es-security-helper',
 
     // production
     WASPET_EXTENSIONS_URL_production: '/es-security-helper',
  }
};
