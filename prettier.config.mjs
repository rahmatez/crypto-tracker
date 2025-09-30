/** @type {import('prettier').Config} */
const config = {
  singleQuote: true,
  semi: true,
  trailingComma: 'none',
  tabWidth: 2,
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss']
};

export default config;
