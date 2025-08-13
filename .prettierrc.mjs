/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  experimentalTernaries: true,
  jsxSingleQuote: true,
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 100,
  singleQuote: true,
};

export default config;
