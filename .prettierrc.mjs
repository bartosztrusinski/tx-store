/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  singleQuote: true,
  jsxSingleQuote: true,
  experimentalTernaries: true,
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
