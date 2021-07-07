// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    /* ... */
  },
  plugins: [
    /* ... */
    // ["@snowpack/plugin-babel"],
    ['@snowpack/plugin-typescript'],
    // ['@babel/plugin-syntax-flow']
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
    hmr: true
  },
  buildOptions: {
    /* ... */
  },
};
