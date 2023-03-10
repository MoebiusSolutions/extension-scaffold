const urlPath = process.env.URLPATH || ''

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  workspaceRoot: '..',
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
    [
      '@snowpack/plugin-run-script',
      {
        cmd: 'tsc --project sw',
      }
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
    /* ... */
  },
  buildOptions: {
    baseUrl: urlPath,
    metaUrlPath: `${urlPath}/_snowpack`,
  },
};
