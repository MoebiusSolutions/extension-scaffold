// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
        public: '/',
        src: '/dist',
    },
    plugins: [
    /* ... */
    ],
    packageOptions: {
    /* ... */
    },
    devOptions: {
        hostname: '0.0.0.0',
        port: Number(process.env.PORT) || 8080,
    },
    buildOptions: {
    /* ... */
    },
}
